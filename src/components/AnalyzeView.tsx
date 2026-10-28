import React, { useState, useRef, useEffect } from 'react';
import {
  UploadCloud,
  FileImage,
  Sparkles,
  X,
  RefreshCw,
  Sliders,
  CheckCircle2,
  Info,
  Layers,
  ArrowRight
} from 'lucide-react';
import { AnalysisResult, WasteStreamType } from '../types/index.ts';
import { WASTE_STREAM_DEFINITIONS } from '../data/standards.ts';

interface AnalyzeViewProps {
  onAnalysisComplete: (result: AnalysisResult) => void;
  preselectedSampleId?: string;
  onClearSample?: () => void;
}

const ANALYSIS_STAGES = [
  'Ingesting optical raster payload...',
  'Segmenting material boundaries & sub-polymers...',
  'Evaluating contamination against ISRI / EN 643 tolerances...',
  'Compiling prioritized mitigation checklist...'
];

export const AnalyzeView: React.FC<AnalyzeViewProps> = ({
  onAnalysisComplete,
  preselectedSampleId,
  onClearSample
}) => {
  const [selectedStream, setSelectedStream] = useState<WasteStreamType>('SINGLE_STREAM');
  const [batchName, setBatchName] = useState('');
  const [facilityLine, setFacilityLine] = useState('Conveyor Belt Infeed 01');
  const [notes, setNotes] = useState('');

  // Image states
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [imageMetadata, setImageMetadata] = useState<{ size: string; name: string; type: string } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Analysis process states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load sample if specified
  useEffect(() => {
    if (preselectedSampleId) {
      loadPreloadedSample(preselectedSampleId);
      if (onClearSample) onClearSample();
    }
  }, [preselectedSampleId]);

  const loadPreloadedSample = async (sampleId: string) => {
    try {
      const sampleMap: Record<string, { path: string; name: string; stream: WasteStreamType }> = {
        'sample-clean-segregated': {
          path: '/src/assets/images/waste_sample_materials_1793178553637.jpg',
          name: 'Segregated-Clean-Commodities.jpg',
          stream: 'SINGLE_STREAM'
        },
        'sample-commercial-contaminated': {
          path: '/src/assets/images/waste_sample_contaminated_1793178553543.jpg',
          name: 'Mixed-Commercial-OCC-Film.jpg',
          stream: 'COMMERCIAL_OCC'
        },
        'sample-optical-facility': {
          path: '/src/assets/images/hero_waste_stream_facility_1793178553276.jpg',
          name: 'Automated-NIR-Chamber.jpg',
          stream: 'RIGID_PLASTICS'
        }
      };

      const sample = sampleMap[sampleId] || sampleMap['sample-clean-segregated'];
      setSelectedStream(sample.stream);
      setBatchName(`Facility-Audit-${sample.stream.slice(0, 3)}-${Math.floor(Math.random() * 800 + 100)}`);
      setImagePreviewUrl(sample.path);
      setImageMetadata({
        name: sample.name,
        size: '1.8 MB (High Resolution)',
        type: 'image/jpeg'
      });
      setImageFile(null); // Marked as remote path
    } catch (err) {
      console.error('Error loading sample:', err);
    }
  };

  const handleFileChange = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setAnalysisError('Please provide a valid image file (JPEG, PNG, or WebP).');
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setAnalysisError('Image file is larger than 25MB limit.');
      return;
    }

    setAnalysisError(null);
    setImageFile(file);
    setImageMetadata({
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      type: file.type
    });

    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreviewUrl(null);
    setImageMetadata(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const runAnalysis = async () => {
    if (!imagePreviewUrl) {
      setAnalysisError('Please select or upload an image to analyze.');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError(null);
    setActiveStageIndex(0);

    // Realistic stage progression interval
    const interval = setInterval(() => {
      setActiveStageIndex((prev) => (prev < ANALYSIS_STAGES.length - 1 ? prev + 1 : prev));
    }, 800);

    try {
      let base64Data = '';
      let mimeType = 'image/jpeg';

      if (imageFile) {
        // Read file as base64
        const fileBase64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(imageFile);
        });
        base64Data = fileBase64;
        mimeType = imageFile.type;
      } else if (imagePreviewUrl.startsWith('data:')) {
        base64Data = imagePreviewUrl;
      } else {
        // Fetch static sample path to base64
        const resp = await fetch(imagePreviewUrl);
        const blob = await resp.blob();
        base64Data = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
        mimeType = blob.type || 'image/jpeg';
      }

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64Data,
          mimeType,
          wasteStream: selectedStream,
          batchName: batchName.trim() || `Batch-${selectedStream.slice(0, 3)}-${Date.now().toString().slice(-4)}`,
          facilityLine: facilityLine.trim(),
          notes: notes.trim()
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const result: AnalysisResult = await response.json();
      clearInterval(interval);
      onAnalysisComplete(result);
    } catch (err: any) {
      console.error('Analysis failed:', err);
      setAnalysisError(err?.message || 'Failed to complete analysis. Please try again.');
    } finally {
      clearInterval(interval);
      setIsAnalyzing(false);
    }
  };

  const streamDef = WASTE_STREAM_DEFINITIONS[selectedStream];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="border-b border-[#E2E6DF] dark:border-[#1C2B25] pb-5">
        <div className="flex items-center gap-2 text-xs text-[#737D75] dark:text-[#85948A] mb-1">
          <span>Inspection Studio</span>
          <span aria-hidden="true">/</span>
          <span className="text-[#18251F] dark:text-[#EAEFEA] font-medium">Optical Waste Stream Analysis</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#102A24] dark:text-[#EAEFEA]">
          Analyze Waste Stream
        </h1>
        <p className="text-xs sm:text-sm text-[#737D75] dark:text-[#85948A] mt-0.5">
          Submit conveyor photographs or receiving bale images to identify contamination, non-target polymers, and diversion yield.
        </p>
      </div>

      {analysisError && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-xs text-red-800 dark:text-red-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-red-600 shrink-0" />
            <span>{analysisError}</span>
          </div>
          <button onClick={() => setAnalysisError(null)} className="text-red-600 hover:text-red-800">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Two-Column Workflow */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Image Drag & Drop / Preview */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-[#18251F] dark:text-[#EAEFEA]">
              Optical Image Capture
            </h3>
            {imagePreviewUrl && (
              <button
                onClick={handleRemoveImage}
                disabled={isAnalyzing}
                className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" /> Replace Image
              </button>
            )}
          </div>

          {!imagePreviewUrl ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-[#16A36A] bg-[#16A36A]/5'
                  : 'border-[#E2E6DF] dark:border-[#1E352F] bg-white dark:bg-[#102A24] hover:border-[#16A36A]/60 hover:bg-[#F7F8F5] dark:hover:bg-[#15342C]'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files && e.target.files[0] && handleFileChange(e.target.files[0])}
                className="hidden"
              />

              <div className="w-14 h-14 rounded-full bg-[#16A36A]/10 text-[#16A36A] mx-auto flex items-center justify-center mb-4">
                <UploadCloud className="w-7 h-7" />
              </div>

              <h4 className="text-base font-semibold text-[#18251F] dark:text-[#EAEFEA]">
                Drag and drop waste stream photograph
              </h4>
              <p className="text-xs text-[#737D75] dark:text-[#85948A] mt-1.5 max-w-sm mx-auto">
                Conveyor belt overhead captures, bale core samples, or receiving dock photos. Supports JPG, PNG, WebP up to 25MB.
              </p>

              <button
                type="button"
                className="mt-5 inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#18251F] dark:text-[#EAEFEA] bg-[#F7F8F5] dark:bg-[#1C2B25] border border-[#E2E6DF] dark:border-[#283E36] rounded-lg hover:bg-white transition-colors"
              >
                <FileImage className="w-3.5 h-3.5 text-[#16A36A]" />
                <span>Browse Local Files</span>
              </button>
            </div>
          ) : (
            <div className="relative rounded-2xl overflow-hidden border border-[#E2E6DF] dark:border-[#1E352F] bg-black shadow-md">
              <div className="relative aspect-[16/10] overflow-hidden flex items-center justify-center bg-slate-950">
                <img
                  src={imagePreviewUrl}
                  alt="Waste Stream Preview"
                  className="w-full h-full object-contain"
                />

                {/* Scanning Laser Animation during analysis */}
                {isAnalyzing && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#C8F169] to-transparent shadow-[0_0_15px_#C8F169] animate-pulse absolute top-1/2 -translate-y-1/2" />
                    <div className="absolute inset-0 bg-[#16A36A]/10 backdrop-blur-[1px]" />
                  </div>
                )}
              </div>

              {/* Metadata strip */}
              <div className="p-3.5 bg-white dark:bg-[#102A24] border-t border-[#E2E6DF] dark:border-[#1E352F] flex flex-wrap items-center justify-between text-xs text-[#737D75] dark:text-[#85948A]">
                <div className="flex items-center gap-2 truncate max-w-xs">
                  <FileImage className="w-4 h-4 text-[#16A36A] shrink-0" />
                  <span className="font-medium text-[#18251F] dark:text-[#EAEFEA] truncate">
                    {imageMetadata?.name || 'Infeed Image'}
                  </span>
                </div>
                <div className="flex items-center gap-3 font-mono text-[11px]">
                  <span>{imageMetadata?.size || 'Compressed'}</span>
                  <span>·</span>
                  <span className="text-[#16A36A] font-semibold">Ready for Vision AI</span>
                </div>
              </div>
            </div>
          )}

          {/* Quick-test with representative sample batches */}
          <div className="p-4 rounded-xl bg-white dark:bg-[#102A24] border border-[#E2E6DF] dark:border-[#1E352F] space-y-2.5">
            <span className="text-xs font-semibold text-[#18251F] dark:text-[#EAEFEA] block">
              Quick Test with Facility Audited Batches:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => loadPreloadedSample('sample-clean-segregated')}
                disabled={isAnalyzing}
                className="p-2.5 text-left rounded-lg border border-[#E2E6DF] dark:border-[#1E352F] hover:border-[#16A36A] hover:bg-[#F7F8F5] dark:hover:bg-[#15342C] transition-all cursor-pointer group"
              >
                <div className="text-[11px] font-bold text-[#102A24] dark:text-[#EAEFEA] group-hover:text-[#16A36A]">
                  Segregated Commodities
                </div>
                <div className="text-[10px] text-[#737D75] dark:text-[#85948A] mt-0.5">
                  Clean OCC, PET, Aluminum
                </div>
              </button>

              <button
                type="button"
                onClick={() => loadPreloadedSample('sample-commercial-contaminated')}
                disabled={isAnalyzing}
                className="p-2.5 text-left rounded-lg border border-[#E2E6DF] dark:border-[#1E352F] hover:border-[#16A36A] hover:bg-[#F7F8F5] dark:hover:bg-[#15342C] transition-all cursor-pointer group"
              >
                <div className="text-[11px] font-bold text-[#102A24] dark:text-[#EAEFEA] group-hover:text-[#16A36A]">
                  Contaminated OCC Batch
                </div>
                <div className="text-[10px] text-[#737D75] dark:text-[#85948A] mt-0.5">
                  Greasy cartons &amp; plastic films
                </div>
              </button>

              <button
                type="button"
                onClick={() => loadPreloadedSample('sample-optical-facility')}
                disabled={isAnalyzing}
                className="p-2.5 text-left rounded-lg border border-[#E2E6DF] dark:border-[#1E352F] hover:border-[#16A36A] hover:bg-[#F7F8F5] dark:hover:bg-[#15342C] transition-all cursor-pointer group"
              >
                <div className="text-[11px] font-bold text-[#102A24] dark:text-[#EAEFEA] group-hover:text-[#16A36A]">
                  Automated Sorter Line
                </div>
                <div className="text-[10px] text-[#737D75] dark:text-[#85948A] mt-0.5">
                  NIR Chute Sensor Array
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Parameters, Tolerances & Execution */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#102A24] border border-[#E2E6DF] dark:border-[#1E352F] shadow-sm space-y-5">
            <h3 className="font-bold text-sm text-[#18251F] dark:text-[#EAEFEA] flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#16A36A]" />
              <span>Inspection Parameters</span>
            </h3>

            {/* Waste Stream Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#18251F] dark:text-[#EAEFEA]">
                Target Waste Stream *
              </label>
              <select
                value={selectedStream}
                onChange={(e) => setSelectedStream(e.target.value as WasteStreamType)}
                disabled={isAnalyzing}
                className="w-full text-xs p-2.5 bg-[#F7F8F5] dark:bg-[#15342C] border border-[#E2E6DF] dark:border-[#1E352F] rounded-lg text-[#18251F] dark:text-[#EAEFEA] focus:outline-none focus:ring-1 focus:ring-[#16A36A]"
              >
                <option value="SINGLE_STREAM">Single-Stream Recyclables (Curbside Mix)</option>
                <option value="COMMERCIAL_OCC">Commercial Paper &amp; Cardboard (OCC)</option>
                <option value="RIGID_PLASTICS">Rigid Polymers (PET / HDPE #1 &amp; #2)</option>
                <option value="MIXED_POLYMERS">Mixed Polymers (#1 - #7)</option>
                <option value="METALS">Scrap &amp; Non-Ferrous Metals (UBC)</option>
                <option value="ORGANICS">Compostable &amp; Organic Biomass</option>
              </select>
            </div>

            {/* Stream Tolerance Cue */}
            {streamDef && (
              <div className="p-3 rounded-lg bg-[#F7F8F5] dark:bg-[#15342C] border border-[#E2E6DF] dark:border-[#1E352F] text-[11px] space-y-1.5 text-[#737D75] dark:text-[#85948A]">
                <div className="flex justify-between items-center text-[#18251F] dark:text-[#EAEFEA] font-semibold">
                  <span>Standard Quality Tolerance:</span>
                  <span className="font-mono text-[#16A36A]">Max {streamDef.standardToleranceMaxRisk}% Contamination</span>
                </div>
                <p className="leading-relaxed">{streamDef.description}</p>
                <div className="pt-1 text-[10px] flex items-center gap-1 text-red-600 dark:text-red-400">
                  <span className="font-semibold">Strictly Disallowed:</span> {streamDef.strictDisallowed.slice(0, 2).join(', ')}
                </div>
              </div>
            )}

            {/* Batch Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#18251F] dark:text-[#EAEFEA]">
                Batch / Bale Identifier (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Line-03-Infeed-Bale-A88"
                value={batchName}
                onChange={(e) => setBatchName(e.target.value)}
                disabled={isAnalyzing}
                className="w-full text-xs p-2.5 bg-[#F7F8F5] dark:bg-[#15342C] border border-[#E2E6DF] dark:border-[#1E352F] rounded-lg text-[#18251F] dark:text-[#EAEFEA] focus:outline-none focus:ring-1 focus:ring-[#16A36A]"
              />
            </div>

            {/* Facility Line */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#18251F] dark:text-[#EAEFEA]">
                Facility Station / Conveyor Line
              </label>
              <input
                type="text"
                value={facilityLine}
                onChange={(e) => setFacilityLine(e.target.value)}
                disabled={isAnalyzing}
                className="w-full text-xs p-2.5 bg-[#F7F8F5] dark:bg-[#15342C] border border-[#E2E6DF] dark:border-[#1E352F] rounded-lg text-[#18251F] dark:text-[#EAEFEA] focus:outline-none focus:ring-1 focus:ring-[#16A36A]"
              />
            </div>

            {/* Operator Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#18251F] dark:text-[#EAEFEA]">
                Operator Field Notes (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="Any visual anomalies, hauler details, or belt speed adjustments..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={isAnalyzing}
                className="w-full text-xs p-2.5 bg-[#F7F8F5] dark:bg-[#15342C] border border-[#E2E6DF] dark:border-[#1E352F] rounded-lg text-[#18251F] dark:text-[#EAEFEA] focus:outline-none focus:ring-1 focus:ring-[#16A36A] resize-none"
              />
            </div>

            {/* Analysis Progress or Trigger Button */}
            {isAnalyzing ? (
              <div className="p-4 rounded-xl bg-[#F7F8F5] dark:bg-[#15342C] border border-[#16A36A]/40 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-[#102A24] dark:text-[#EAEFEA]">
                  <span className="flex items-center gap-2">
                    <RefreshCw className="w-3.5 h-3.5 text-[#16A36A] animate-spin" />
                    Processing Optical Inspection
                  </span>
                  <span className="font-mono text-[#16A36A]">
                    Stage {activeStageIndex + 1}/{ANALYSIS_STAGES.length}
                  </span>
                </div>

                <div className="w-full h-2 bg-[#E2E6DF] dark:bg-[#1E352F] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#16A36A] transition-all duration-500 rounded-full"
                    style={{ width: `${((activeStageIndex + 1) / ANALYSIS_STAGES.length) * 100}%` }}
                  />
                </div>

                <p className="text-xs text-[#737D75] dark:text-[#85948A] italic">
                  {ANALYSIS_STAGES[activeStageIndex]}
                </p>
              </div>
            ) : (
              <button
                type="button"
                onClick={runAnalysis}
                disabled={!imagePreviewUrl}
                className={`w-full py-3.5 px-6 rounded-xl font-semibold text-xs flex items-center justify-center gap-2.5 transition-all shadow-md cursor-pointer ${
                  imagePreviewUrl
                    ? 'bg-[#102A24] dark:bg-[#16A36A] hover:bg-[#16A36A] text-white active:scale-95'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Sparkles className="w-4 h-4 text-[#C8F169]" />
                <span>Execute Waste Stream Analysis</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
