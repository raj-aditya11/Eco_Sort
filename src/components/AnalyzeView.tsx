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
      setImageFile(null);
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
      setAnalysisError('Please select or upload a waste photograph to analyze.');
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
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 space-y-6">
      {/* Header */}
      <div className="border-b border-[#DCDDD4] dark:border-[#2B312B] pb-5">
        <div className="flex items-center gap-2 font-mono text-[11px] text-[#777B73] dark:text-[#9DA399] uppercase tracking-wider mb-1">
          <span>STATION 01</span>
          <span aria-hidden="true">·</span>
          <span>OPTICAL EVALUATION</span>
          <span aria-hidden="true">·</span>
          <span className="text-[#245B45] dark:text-[#3A7D63] font-semibold">STREAM TRIAGE</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#252923] dark:text-[#E6E8E3]">
          Analyze Waste Batch
        </h1>
        <p className="text-xs sm:text-sm text-[#777B73] dark:text-[#9DA399] mt-0.5">
          Submit an RGB photograph of waste materials for automated material identification, contamination assessment, and recycling suitability guidance.
        </p>
      </div>

      {/* Error Banner */}
      {analysisError && (
        <div className="p-3.5 rounded-md bg-[#FBF0EE] dark:bg-[#2B1B1A] border border-[#E9BFBA] dark:border-[#522927] flex items-start justify-between gap-3 text-xs">
          <div className="flex items-start gap-2.5 text-[#A63F37] dark:text-[#E68A82]">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold block">Inspection Issue Detected</strong>
              <p className="mt-0.5 leading-relaxed">{analysisError}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={runAnalysis}
              className="px-2.5 py-1 text-xs font-semibold bg-[#A63F37] hover:bg-[#8F352E] text-white rounded cursor-pointer"
            >
              Retry
            </button>
            <button
              onClick={() => setAnalysisError(null)}
              className="p-1 text-[#A63F37] hover:text-[#7A2A24] dark:hover:text-[#FFA49C] cursor-pointer"
              aria-label="Dismiss error"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Two-Column Workflow */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
        {/* Left Column: Image Infeed & Preview */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#777B73] dark:text-[#9DA399] flex items-center gap-1.5">
              <span>01 // PHOTOGRAPHIC INFEED</span>
            </h3>
            {imagePreviewUrl && (
              <button
                onClick={handleRemoveImage}
                disabled={isAnalyzing}
                className="text-xs font-semibold text-[#A63F37] hover:text-[#8F352E] flex items-center gap-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" /> Replace Photo
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
              className={`border-2 border-dashed rounded-lg p-8 sm:p-12 text-center cursor-pointer transition-colors ${
                isDragging
                  ? 'border-[#245B45] bg-[#245B45]/5'
                  : 'border-[#DCDDD4] dark:border-[#2B312B] bg-[#FFFFFF] dark:bg-[#1C201C] hover:border-[#245B45]/70 hover:bg-[#F5F4EE] dark:hover:bg-[#22332A]/50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files && e.target.files[0] && handleFileChange(e.target.files[0])}
                className="hidden"
              />

              <div className="w-11 h-11 rounded-md bg-[#F5F4EE] dark:bg-[#22332A] border border-[#DCDDD4] dark:border-[#2B312B] text-[#245B45] dark:text-[#3A7D63] mx-auto flex items-center justify-center mb-3">
                <UploadCloud className="w-5 h-5" />
              </div>

              <h4 className="text-sm font-bold text-[#252923] dark:text-[#E6E8E3]">
                Click to browse or drag and drop waste photograph
              </h4>
              <p className="text-xs text-[#777B73] dark:text-[#9DA399] mt-1.5 max-w-sm mx-auto leading-relaxed">
                Conveyor belt captures, bin overviews, or receiving dock samples. Supports JPEG, PNG, and WebP up to 25MB.
              </p>

              <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-[#252923] dark:text-[#E6E8E3] bg-[#F5F4EE] dark:bg-[#22332A] border border-[#DCDDD4] dark:border-[#2B312B] rounded">
                <FileImage className="w-3.5 h-3.5 text-[#245B45] dark:text-[#3A7D63]" />
                <span>Select File from Station</span>
              </div>
            </div>
          ) : (
            <div className="rounded-lg overflow-hidden border border-[#DCDDD4] dark:border-[#2B312B] bg-[#151815]">
              <div className="relative aspect-[16/10] overflow-hidden flex items-center justify-center bg-[#151815]">
                <img
                  src={imagePreviewUrl}
                  alt="Waste Stream Preview"
                  className="w-full h-full object-contain"
                />

                {isAnalyzing && (
                  <div className="absolute inset-0 bg-[#151815]/75 flex items-center justify-center">
                    <div className="text-center text-white space-y-2.5 p-4 max-w-sm">
                      <RefreshCw className="w-7 h-7 text-[#DDE8DE] animate-spin mx-auto" />
                      <div className="text-xs font-bold uppercase tracking-wider text-[#E6E8E3]">
                        Running Computer Vision Inspection
                      </div>
                      <div className="text-[11px] text-[#DDE8DE] font-mono leading-relaxed">
                        {ANALYSIS_STAGES[activeStageIndex]}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Metadata strip */}
              <div className="p-3 bg-[#FFFFFF] dark:bg-[#1C201C] border-t border-[#DCDDD4] dark:border-[#2B312B] flex flex-wrap items-center justify-between text-xs text-[#777B73] dark:text-[#9DA399]">
                <div className="flex items-center gap-2 truncate max-w-xs">
                  <FileImage className="w-4 h-4 text-[#245B45] dark:text-[#3A7D63] shrink-0" />
                  <span className="font-semibold text-[#252923] dark:text-[#E6E8E3] truncate">
                    {imageMetadata?.name || 'Infeed Waste Photo'}
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[11px]">
                  <span>{imageMetadata?.size || 'Valid Size'}</span>
                  <span>·</span>
                  <span className="text-[#245B45] dark:text-[#3A7D63] font-semibold">Ready for Inspection</span>
                </div>
              </div>
            </div>
          )}

          {/* Demonstration Sample Batches */}
          <div className="p-4 rounded-lg bg-[#FFFFFF] dark:bg-[#1C201C] border border-[#DCDDD4] dark:border-[#2B312B] space-y-2">
            <span className="text-xs font-semibold text-[#252923] dark:text-[#E6E8E3] block">
              Load demonstration sample image:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => loadPreloadedSample('sample-clean-segregated')}
                disabled={isAnalyzing}
                className="p-2.5 text-left rounded-md border border-[#DCDDD4] dark:border-[#2B312B] hover:border-[#245B45] hover:bg-[#F5F4EE] dark:hover:bg-[#22332A] transition-colors cursor-pointer group"
              >
                <div className="text-xs font-bold text-[#252923] dark:text-[#E6E8E3] group-hover:text-[#245B45] dark:group-hover:text-[#3A7D63]">
                  Clean Segregated
                </div>
                <div className="text-[10px] text-[#777B73] dark:text-[#9DA399] mt-0.5">
                  OCC, PET bottles &amp; aluminum cans
                </div>
              </button>

              <button
                type="button"
                onClick={() => loadPreloadedSample('sample-commercial-contaminated')}
                disabled={isAnalyzing}
                className="p-2.5 text-left rounded-md border border-[#DCDDD4] dark:border-[#2B312B] hover:border-[#245B45] hover:bg-[#F5F4EE] dark:hover:bg-[#22332A] transition-colors cursor-pointer group"
              >
                <div className="text-xs font-bold text-[#252923] dark:text-[#E6E8E3] group-hover:text-[#245B45] dark:group-hover:text-[#3A7D63]">
                  Contaminated OCC
                </div>
                <div className="text-[10px] text-[#777B73] dark:text-[#9DA399] mt-0.5">
                  Paperboard with plastic film wrapping
                </div>
              </button>

              <button
                type="button"
                onClick={() => loadPreloadedSample('sample-optical-facility')}
                disabled={isAnalyzing}
                className="p-2.5 text-left rounded-md border border-[#DCDDD4] dark:border-[#2B312B] hover:border-[#245B45] hover:bg-[#F5F4EE] dark:hover:bg-[#22332A] transition-colors cursor-pointer group"
              >
                <div className="text-xs font-bold text-[#252923] dark:text-[#E6E8E3] group-hover:text-[#245B45] dark:group-hover:text-[#3A7D63]">
                  Optical Sorting Line
                </div>
                <div className="text-[10px] text-[#777B73] dark:text-[#9DA399] mt-0.5">
                  Conveyor mixed rigid polymers
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Parameters & Execution */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-lg bg-[#FFFFFF] dark:bg-[#1C201C] border border-[#DCDDD4] dark:border-[#2B312B] space-y-4">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#777B73] dark:text-[#9DA399] flex items-center gap-1.5 border-b border-[#DCDDD4] dark:border-[#2B312B] pb-2.5">
              <Sliders className="w-3.5 h-3.5 text-[#245B45] dark:text-[#3A7D63]" />
              <span>02 // INSPECTION PARAMETERS</span>
            </h3>

            {/* Waste Stream Selector */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#252923] dark:text-[#E6E8E3]">
                Target Waste Stream *
              </label>
              <select
                value={selectedStream}
                onChange={(e) => setSelectedStream(e.target.value as WasteStreamType)}
                disabled={isAnalyzing}
                className="w-full text-xs p-2.5 bg-[#F5F4EE] dark:bg-[#151815] border border-[#DCDDD4] dark:border-[#2B312B] rounded text-[#252923] dark:text-[#E6E8E3] focus:outline-none focus:ring-1 focus:ring-[#245B45]"
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
              <div className="p-3 rounded bg-[#F5F4EE] dark:bg-[#151815] border border-[#DCDDD4] dark:border-[#2B312B] text-[11px] space-y-1 text-[#777B73] dark:text-[#9DA399]">
                <div className="flex justify-between items-center text-[#252923] dark:text-[#E6E8E3] font-semibold">
                  <span>Standard Quality Tolerance:</span>
                  <span className="font-mono text-[#245B45] dark:text-[#3A7D63]">Max {streamDef.standardToleranceMaxRisk}% Contamination</span>
                </div>
                <p className="leading-relaxed">{streamDef.description}</p>
                <div className="pt-0.5 text-[10px] flex items-center gap-1 text-[#A63F37] dark:text-[#E68A82]">
                  <span className="font-semibold">Strictly Prohibited:</span> {streamDef.strictDisallowed.slice(0, 2).join(', ')}
                </div>
              </div>
            )}

            {/* Batch Name / ID */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#252923] dark:text-[#E6E8E3]">
                Batch / Inspection Identifier
              </label>
              <input
                type="text"
                placeholder="e.g. Batch-OCC-2026-01"
                value={batchName}
                onChange={(e) => setBatchName(e.target.value)}
                disabled={isAnalyzing}
                className="w-full text-xs p-2.5 bg-[#F5F4EE] dark:bg-[#151815] border border-[#DCDDD4] dark:border-[#2B312B] rounded text-[#252923] dark:text-[#E6E8E3] focus:outline-none focus:ring-1 focus:ring-[#245B45]"
              >
              </input>
            </div>

            {/* Facility Line */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#252923] dark:text-[#E6E8E3]">
                Inspection Station / Location
              </label>
              <input
                type="text"
                value={facilityLine}
                onChange={(e) => setFacilityLine(e.target.value)}
                disabled={isAnalyzing}
                className="w-full text-xs p-2.5 bg-[#F5F4EE] dark:bg-[#151815] border border-[#DCDDD4] dark:border-[#2B312B] rounded text-[#252923] dark:text-[#E6E8E3] focus:outline-none focus:ring-1 focus:ring-[#245B45]"
              />
            </div>

            {/* Operator Notes */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#252923] dark:text-[#E6E8E3]">
                Inspector Notes (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="Observations, conveyor conditions, or pre-sort sampling notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={isAnalyzing}
                className="w-full text-xs p-2.5 bg-[#F5F4EE] dark:bg-[#151815] border border-[#DCDDD4] dark:border-[#2B312B] rounded text-[#252923] dark:text-[#E6E8E3] focus:outline-none focus:ring-1 focus:ring-[#245B45] resize-none"
              />
            </div>

            {/* Analysis Progress or Trigger Button */}
            {isAnalyzing ? (
              <div className="p-3.5 rounded bg-[#F5F4EE] dark:bg-[#151815] border border-[#245B45]/40 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-[#252923] dark:text-[#E6E8E3]">
                  <span className="flex items-center gap-2">
                    <RefreshCw className="w-3.5 h-3.5 text-[#245B45] dark:text-[#3A7D63] animate-spin" />
                    Executing Inspection
                  </span>
                  <span className="font-mono text-[#245B45] dark:text-[#3A7D63]">
                    Stage {activeStageIndex + 1}/{ANALYSIS_STAGES.length}
                  </span>
                </div>

                <div className="w-full h-1.5 bg-[#DCDDD4] dark:bg-[#2B312B] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#245B45] dark:bg-[#3A7D63] transition-all duration-500 rounded-full"
                    style={{ width: `${((activeStageIndex + 1) / ANALYSIS_STAGES.length) * 100}%` }}
                  />
                </div>

                <p className="text-[11px] text-[#777B73] dark:text-[#9DA399] font-mono truncate">
                  {ANALYSIS_STAGES[activeStageIndex]}
                </p>
              </div>
            ) : (
              <button
                type="button"
                onClick={runAnalysis}
                disabled={!imagePreviewUrl}
                className={`w-full py-2.5 px-4 rounded font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  imagePreviewUrl
                    ? 'bg-[#245B45] hover:bg-[#1D4B39] dark:bg-[#3A7D63] dark:hover:bg-[#2F6852] text-white active:scale-98'
                    : 'bg-[#DCDDD4] dark:bg-[#2B312B] text-[#777B73] cursor-not-allowed'
                }`}
              >
                <ScanLine className="w-4 h-4" />
                <span>Execute Waste Analysis</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
