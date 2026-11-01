import React, { useState, useRef, useEffect } from 'react';
import {
  UploadCloud,
  FileImage,
  X,
  RefreshCw,
  Sliders,
  CheckCircle2,
  Info,
  Layers,
  ArrowRight,
  ScanLine,
  AlertTriangle
} from 'lucide-react';
import { AnalysisResult, WasteStreamType } from '../types/index.ts';
import { WASTE_STREAM_DEFINITIONS } from '../data/standards.ts';

interface AnalyzeViewProps {
  onAnalysisComplete: (result: AnalysisResult) => void;
  preselectedSampleId?: string;
  onClearSample?: () => void;
}

const ANALYSIS_STAGES = [
  'Preparing waste image for visual evaluation...',
  'Identifying visible materials & waste categories...',
  'Evaluating contamination against stream tolerances...',
  'Compiling recycling suitability verdict & recommendations...'
];

export const AnalyzeView: React.FC<AnalyzeViewProps> = ({
  onAnalysisComplete,
  preselectedSampleId,
  onClearSample
}) => {
  const [selectedStream, setSelectedStream] = useState<WasteStreamType>('SINGLE_STREAM');
  const [batchName, setBatchName] = useState('');
  const [facilityLine, setFacilityLine] = useState('Line 01 Inspection Station');
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
          name: 'Automated-Sorting-Facility.jpg',
          stream: 'RIGID_PLASTICS'
        }
      };

      const sample = sampleMap[sampleId] || sampleMap['sample-clean-segregated'];
      setSelectedStream(sample.stream);
      setBatchName(`Audit-${sample.stream.slice(0, 3)}-${Math.floor(Math.random() * 800 + 100)}`);
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
      setAnalysisError('Image file is larger than the 25MB limit.');
      return;
    }

    console.log('[EcoSort Frontend] Image received by the frontend', {
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      type: file.type
    });

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
    reader.onerror = (e) => {
      console.error('[EcoSort Frontend] FileReader error:', e);
      setAnalysisError('Failed to read the local image file.');
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
    setAnalysisError(null);
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

    // Stage progression interval
    const interval = setInterval(() => {
      setActiveStageIndex((prev) => (prev < ANALYSIS_STAGES.length - 1 ? prev + 1 : prev));
    }, 1200);

    // 60-second network timeout controller
    const abortController = new AbortController();
    const timeoutId = setTimeout(() => {
      console.warn('[EcoSort Frontend] Request timed out after 60 seconds. Aborting...');
      abortController.abort();
    }, 60000);

    try {
      let base64Data = '';
      let mimeType = 'image/jpeg';

      if (imageFile) {
        const fileBase64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error('Failed to read image file data.'));
          reader.readAsDataURL(imageFile);
        });
        base64Data = fileBase64;
        mimeType = imageFile.type;
      } else if (imagePreviewUrl.startsWith('data:')) {
        base64Data = imagePreviewUrl;
      } else {
        const resp = await fetch(imagePreviewUrl);
        if (!resp.ok) {
          throw new Error(`Failed to load sample image (HTTP ${resp.status}).`);
        }
        const blob = await resp.blob();
        base64Data = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error('Failed to convert sample image to base64.'));
          reader.readAsDataURL(blob);
        });
        mimeType = blob.type || 'image/jpeg';
      }

      console.log('[EcoSort Frontend] Request sent to the backend (/api/analyze)', {
        stream: selectedStream,
        batch: batchName.trim() || 'auto',
        payloadLength: base64Data.length
      });

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: abortController.signal,
        body: JSON.stringify({
          imageBase64: base64Data,
          mimeType,
          wasteStream: selectedStream,
          batchName: batchName.trim() || `Batch-${selectedStream.slice(0, 3)}-${Date.now().toString().slice(-4)}`,
          facilityLine: facilityLine.trim(),
          notes: notes.trim()
        })
      });

      console.log('[EcoSort Frontend] Response received from the backend', {
        status: response.status,
        ok: response.ok
      });

      if (!response.ok) {
        let errDetail = `Server returned HTTP ${response.status}`;
        try {
          const errJson = await response.json();
          if (errJson?.error) errDetail = errJson.error;
        } catch {
          // ignore json parse error
        }
        throw new Error(errDetail);
      }

      const result: AnalysisResult = await response.json();
      console.log('[EcoSort Frontend] Results displayed successfully', {
        id: result.id,
        batch: result.batchName,
        score: result.contaminationScore,
        risk: result.overallRisk
      });

      clearInterval(interval);
      clearTimeout(timeoutId);
      onAnalysisComplete(result);
    } catch (err: any) {
      clearInterval(interval);
      clearTimeout(timeoutId);
      console.error('[EcoSort Frontend] Analysis pipeline failed:', err);

      if (err?.name === 'AbortError') {
        setAnalysisError('The analysis request timed out after 60 seconds. Please click Retry Analysis.');
      } else {
        setAnalysisError(err?.message || 'Failed to complete analysis. Please try again.');
      }
    } finally {
      clearInterval(interval);
      clearTimeout(timeoutId);
      setIsAnalyzing(false);
    }
  };

  const streamDef = WASTE_STREAM_DEFINITIONS[selectedStream];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="border-b border-[#E2E6DF] dark:border-[#1B332B] pb-5">
        <div className="flex items-center gap-2 text-xs text-[#66736C] dark:text-[#8A9890] mb-1">
          <span>Inspection Station</span>
          <span aria-hidden="true">/</span>
          <span className="text-[#102A24] dark:text-[#EAEFEA] font-semibold">New Waste Analysis</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#102A24] dark:text-[#EAEFEA]">
          Analyze Waste Batch
        </h1>
        <p className="text-xs sm:text-sm text-[#66736C] dark:text-[#8A9890] mt-0.5">
          Submit an RGB photograph of waste materials for automated material identification, contamination assessment, and recycling suitability guidance.
        </p>
      </div>

      {/* Error Banner */}
      {analysisError && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 flex items-start justify-between gap-3 text-xs">
          <div className="flex items-start gap-2.5 text-red-700 dark:text-red-300">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold block">Analysis Issue Detected</strong>
              <p className="mt-0.5 leading-relaxed">{analysisError}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={runAnalysis}
              className="px-2.5 py-1 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded cursor-pointer"
            >
              Retry Analysis
            </button>
            <button
              onClick={() => setAnalysisError(null)}
              className="p-1 text-red-600 hover:text-red-800 dark:hover:text-red-200 cursor-pointer"
              aria-label="Dismiss error"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Two-Column Workflow */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Image Upload & Preview */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#66736C] dark:text-[#8A9890]">
              1. Waste Batch Image
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
              className={`border-2 border-dashed rounded-xl p-8 sm:p-12 text-center cursor-pointer transition-colors ${
                isDragging
                  ? 'border-[#16A36A] bg-[#16A36A]/5'
                  : 'border-[#E2E6DF] dark:border-[#1B332B] bg-white dark:bg-[#10221D] hover:border-[#16A36A]/60 hover:bg-[#F7F8F5] dark:hover:bg-[#15342C]'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files && e.target.files[0] && handleFileChange(e.target.files[0])}
                className="hidden"
              />

              <div className="w-12 h-12 rounded-full bg-[#16A36A]/10 text-[#16A36A] mx-auto flex items-center justify-center mb-3">
                <UploadCloud className="w-6 h-6" />
              </div>

              <h4 className="text-sm font-semibold text-[#18251F] dark:text-[#EAEFEA]">
                Click to browse or drag and drop a waste batch photograph
              </h4>
              <p className="text-xs text-[#66736C] dark:text-[#8A9890] mt-1.5 max-w-sm mx-auto">
                Conveyor belt captures, bin overviews, or receiving dock samples. Supports JPEG, PNG, and WebP up to 25MB.
              </p>

              <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-[#102A24] dark:text-[#EAEFEA] bg-[#F7F8F5] dark:bg-[#1B332B] border border-[#E2E6DF] dark:border-[#283E36] rounded-md">
                <FileImage className="w-3.5 h-3.5 text-[#16A36A]" />
                <span>Select File from Device</span>
              </div>
            </div>
          ) : (
            <div className="rounded-xl overflow-hidden border border-[#E2E6DF] dark:border-[#1B332B] bg-black shadow-xs">
              <div className="relative aspect-[16/10] overflow-hidden flex items-center justify-center bg-[#0C1613]">
                <img
                  src={imagePreviewUrl}
                  alt="Waste Stream Preview"
                  className="w-full h-full object-contain"
                />

                {isAnalyzing && (
                  <div className="absolute inset-0 bg-[#102A24]/60 backdrop-blur-xs flex items-center justify-center">
                    <div className="text-center text-white space-y-2 p-4">
                      <RefreshCw className="w-8 h-8 text-[#C8F169] animate-spin mx-auto" />
                      <div className="text-xs font-semibold">Running Computer Vision Analysis</div>
                      <div className="text-[11px] text-[#C8F169]/90 font-mono">
                        {ANALYSIS_STAGES[activeStageIndex]}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Metadata strip */}
              <div className="p-3 bg-white dark:bg-[#10221D] border-t border-[#E2E6DF] dark:border-[#1B332B] flex flex-wrap items-center justify-between text-xs text-[#66736C] dark:text-[#8A9890]">
                <div className="flex items-center gap-2 truncate max-w-xs">
                  <FileImage className="w-4 h-4 text-[#16A36A] shrink-0" />
                  <span className="font-medium text-[#18251F] dark:text-[#EAEFEA] truncate">
                    {imageMetadata?.name || 'Uploaded Waste Image'}
                  </span>
                </div>
                <div className="flex items-center gap-3 font-mono text-[11px]">
                  <span>{imageMetadata?.size || 'Valid Size'}</span>
                  <span>·</span>
                  <span className="text-[#16A36A] font-semibold">Ready for Assessment</span>
                </div>
              </div>
            </div>
          )}

          {/* Demonstration Sample Batches */}
          <div className="p-4 rounded-xl bg-white dark:bg-[#10221D] border border-[#E2E6DF] dark:border-[#1B332B] space-y-2">
            <span className="text-xs font-semibold text-[#18251F] dark:text-[#EAEFEA] block">
              Or load a pre-configured demonstration sample:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => loadPreloadedSample('sample-clean-segregated')}
                disabled={isAnalyzing}
                className="p-2.5 text-left rounded-lg border border-[#E2E6DF] dark:border-[#1B332B] hover:border-[#16A36A] hover:bg-[#F7F8F5] dark:hover:bg-[#15342C] transition-colors cursor-pointer group"
              >
                <div className="text-xs font-bold text-[#102A24] dark:text-[#EAEFEA] group-hover:text-[#16A36A]">
                  Segregated Commodities
                </div>
                <div className="text-[10px] text-[#66736C] dark:text-[#8A9890] mt-0.5">
                  Clean OCC, PET bottles &amp; aluminum cans
                </div>
              </button>

              <button
                type="button"
                onClick={() => loadPreloadedSample('sample-commercial-contaminated')}
                disabled={isAnalyzing}
                className="p-2.5 text-left rounded-lg border border-[#E2E6DF] dark:border-[#1B332B] hover:border-[#16A36A] hover:bg-[#F7F8F5] dark:hover:bg-[#15342C] transition-colors cursor-pointer group"
              >
                <div className="text-xs font-bold text-[#102A24] dark:text-[#EAEFEA] group-hover:text-[#16A36A]">
                  Contaminated Stream
                </div>
                <div className="text-[10px] text-[#66736C] dark:text-[#8A9890] mt-0.5">
                  Paperboard with plastic film wrapping
                </div>
              </button>

              <button
                type="button"
                onClick={() => loadPreloadedSample('sample-optical-facility')}
                disabled={isAnalyzing}
                className="p-2.5 text-left rounded-lg border border-[#E2E6DF] dark:border-[#1B332B] hover:border-[#16A36A] hover:bg-[#F7F8F5] dark:hover:bg-[#15342C] transition-colors cursor-pointer group"
              >
                <div className="text-xs font-bold text-[#102A24] dark:text-[#EAEFEA] group-hover:text-[#16A36A]">
                  Sorting Facility Infeed
                </div>
                <div className="text-[10px] text-[#66736C] dark:text-[#8A9890] mt-0.5">
                  Conveyor mixed rigid polymers
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Parameters & Execution */}
        <div className="lg:col-span-5 space-y-5">
          <div className="p-5 rounded-xl bg-white dark:bg-[#10221D] border border-[#E2E6DF] dark:border-[#1B332B] shadow-xs space-y-4">
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#66736C] dark:text-[#8A9890] flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-[#16A36A]" />
              <span>2. Inspection Parameters</span>
            </h3>

            {/* Waste Stream Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#18251F] dark:text-[#EAEFEA]">
                Intended Waste Stream *
              </label>
              <select
                value={selectedStream}
                onChange={(e) => setSelectedStream(e.target.value as WasteStreamType)}
                disabled={isAnalyzing}
                className="w-full text-xs p-2.5 bg-[#F7F8F5] dark:bg-[#15342C] border border-[#E2E6DF] dark:border-[#1B332B] rounded-lg text-[#18251F] dark:text-[#EAEFEA] focus:outline-none focus:ring-1 focus:ring-[#16A36A]"
              >
                <option value="SINGLE_STREAM">Single-Stream Recyclables (Mixed Curbside)</option>
                <option value="COMMERCIAL_OCC">Commercial Paper &amp; Cardboard (OCC)</option>
                <option value="RIGID_PLASTICS">Rigid Polymers (PET / HDPE #1 &amp; #2)</option>
                <option value="MIXED_POLYMERS">Mixed Polymers (#1 - #7)</option>
                <option value="METALS">Scrap &amp; Non-Ferrous Metals (UBC)</option>
                <option value="ORGANICS">Compostable &amp; Organic Biomass</option>
              </select>
            </div>

            {/* Stream Tolerance Cue */}
            {streamDef && (
              <div className="p-3 rounded-lg bg-[#F7F8F5] dark:bg-[#15342C] border border-[#E2E6DF] dark:border-[#1B332B] text-[11px] space-y-1 text-[#66736C] dark:text-[#8A9890]">
                <div className="flex justify-between items-center text-[#18251F] dark:text-[#EAEFEA] font-semibold">
                  <span>Stream Quality Tolerance:</span>
                  <span className="font-mono text-[#16A36A]">Max {streamDef.standardToleranceMaxRisk}% Contamination</span>
                </div>
                <p className="leading-relaxed">{streamDef.description}</p>
                <div className="pt-1 text-[10px] flex items-center gap-1 text-red-600 dark:text-red-400">
                  <span className="font-semibold">Disallowed:</span> {streamDef.strictDisallowed.slice(0, 2).join(', ')}
                </div>
              </div>
            )}

            {/* Batch Name / ID */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#18251F] dark:text-[#EAEFEA]">
                Batch / Inspection Identifier
              </label>
              <input
                type="text"
                placeholder="e.g. Batch-2026-OCC-01"
                value={batchName}
                onChange={(e) => setBatchName(e.target.value)}
                disabled={isAnalyzing}
                className="w-full text-xs p-2.5 bg-[#F7F8F5] dark:bg-[#15342C] border border-[#E2E6DF] dark:border-[#1B332B] rounded-lg text-[#18251F] dark:text-[#EAEFEA] focus:outline-none focus:ring-1 focus:ring-[#16A36A]"
              />
            </div>

            {/* Facility Line */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#18251F] dark:text-[#EAEFEA]">
                Inspection Station / Location (Optional)
              </label>
              <input
                type="text"
                value={facilityLine}
                onChange={(e) => setFacilityLine(e.target.value)}
                disabled={isAnalyzing}
                className="w-full text-xs p-2.5 bg-[#F7F8F5] dark:bg-[#15342C] border border-[#E2E6DF] dark:border-[#1B332B] rounded-lg text-[#18251F] dark:text-[#EAEFEA] focus:outline-none focus:ring-1 focus:ring-[#16A36A]"
              />
            </div>

            {/* Operator Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#18251F] dark:text-[#EAEFEA]">
                Inspection Notes (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="Any visual observations or sampling details..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={isAnalyzing}
                className="w-full text-xs p-2.5 bg-[#F7F8F5] dark:bg-[#15342C] border border-[#E2E6DF] dark:border-[#1B332B] rounded-lg text-[#18251F] dark:text-[#EAEFEA] focus:outline-none focus:ring-1 focus:ring-[#16A36A] resize-none"
              />
            </div>

            {/* Analysis Progress or Trigger Button */}
            {isAnalyzing ? (
              <div className="p-4 rounded-xl bg-[#F7F8F5] dark:bg-[#15342C] border border-[#16A36A]/40 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-semibold text-[#102A24] dark:text-[#EAEFEA]">
                  <span className="flex items-center gap-2">
                    <RefreshCw className="w-3.5 h-3.5 text-[#16A36A] animate-spin" />
                    Executing Visual Inspection
                  </span>
                  <span className="font-mono text-[#16A36A]">
                    Stage {activeStageIndex + 1}/{ANALYSIS_STAGES.length}
                  </span>
                </div>

                <div className="w-full h-2 bg-[#E2E6DF] dark:bg-[#1B332B] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#16A36A] transition-all duration-500 rounded-full"
                    style={{ width: `${((activeStageIndex + 1) / ANALYSIS_STAGES.length) * 100}%` }}
                  />
                </div>

                <p className="text-xs text-[#66736C] dark:text-[#8A9890] italic">
                  {ANALYSIS_STAGES[activeStageIndex]}
                </p>
              </div>
            ) : (
              <button
                type="button"
                onClick={runAnalysis}
                disabled={!imagePreviewUrl}
                className={`w-full py-3 px-4 rounded-lg font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer ${
                  imagePreviewUrl
                    ? 'bg-[#102A24] dark:bg-[#16A36A] hover:bg-[#16A36A] text-white active:scale-98'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                }`}
              >
                <ScanLine className="w-4 h-4" />
                <span>Analyze Waste Batch</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
