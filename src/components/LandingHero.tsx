import React, { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Cpu,
  Layers,
  FileSpreadsheet,
  AlertTriangle,
  ScanLine,
  Image as ImageIcon
} from 'lucide-react';
import heroFacilityImage from '../assets/images/hero_waste_stream_facility_1793178553276.jpg';

interface LandingHeroProps {
  onAnalyzeClick: () => void;
  onExploreClick: () => void;
  onOpenSample: (sampleId: string) => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onAnalyzeClick,
  onExploreClick,
  onOpenSample
}) => {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <div className="w-full flex flex-col">
      {/* Editorial Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-16 lg:pb-24 border-b border-[#E2E6DF] dark:border-[#1B332B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Editorial Value Proposition */}
            <div className="lg:col-span-7 flex flex-col items-start space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide text-[#16A36A] dark:text-[#C8F169]">
                <span className="px-2 py-0.5 rounded bg-[#16A36A]/10 text-[#102A24] dark:text-[#C8F169] border border-[#16A36A]/20">
                  Micro-Project System
                </span>
                <span aria-hidden="true">·</span>
                <span>AI-Based Waste Segregation &amp; Assessment</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#102A24] dark:text-[#EAEFEA] leading-[1.12] [text-wrap:balance]">
                Make Every Waste Stream Count.
              </h1>

              <p className="text-base sm:text-lg text-[#66736C] dark:text-[#8A9890] leading-relaxed max-w-2xl">
                AI-assisted waste inspection that identifies visible contamination and supports better recycling decisions. Turn waste images into structured material insights and corrective segregation guidance.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3.5 pt-1">
                <button
                  onClick={onAnalyzeClick}
                  className="inline-flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-semibold text-white bg-[#102A24] dark:bg-[#16A36A] hover:bg-[#16A36A] dark:hover:bg-[#128354] rounded-lg transition-colors shadow-xs active:scale-98 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <ScanLine className="w-4 h-4" />
                  <span>Analyze a Waste Batch</span>
                  <ArrowRight className="w-4 h-4 ml-0.5" />
                </button>

                <button
                  onClick={onExploreClick}
                  className="inline-flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold text-[#18251F] dark:text-[#EAEFEA] bg-white dark:bg-[#10221D] border border-[#E2E6DF] dark:border-[#1B332B] hover:bg-[#F2F4EF] dark:hover:bg-[#15342C] rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  Explore Inspection Workflow
                </button>
              </div>

              {/* Core System Capabilities (Grounded & Honest) */}
              <div className="pt-5 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-[#E2E6DF] dark:border-[#1B332B] w-full">
                <div className="p-3 rounded-lg bg-white/70 dark:bg-[#10221D]/70 border border-[#E2E6DF] dark:border-[#1B332B]">
                  <div className="text-xs font-bold text-[#102A24] dark:text-[#EAEFEA]">Multi-Class Detection</div>
                  <div className="text-[11px] text-[#66736C] dark:text-[#8A9890] mt-0.5 leading-snug">
                    Plastics, paper, metals, glass, organics &amp; non-recyclables.
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-white/70 dark:bg-[#10221D]/70 border border-[#E2E6DF] dark:border-[#1B332B]">
                  <div className="text-xs font-bold text-[#102A24] dark:text-[#EAEFEA]">Contamination Severity</div>
                  <div className="text-[11px] text-[#66736C] dark:text-[#8A9890] mt-0.5 leading-snug">
                    Optical scoring against target stream tolerance caps.
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-white/70 dark:bg-[#10221D]/70 border border-[#E2E6DF] dark:border-[#1B332B]">
                  <div className="text-xs font-bold text-[#102A24] dark:text-[#EAEFEA]">Corrective Directives</div>
                  <div className="text-[11px] text-[#66736C] dark:text-[#8A9890] mt-0.5 leading-snug">
                    Actionable steps to resolve contamination before processing.
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Inspection Preview Card with Local Asset & Graceful Fallback */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-xl overflow-hidden border border-[#E2E6DF] dark:border-[#1B332B] bg-white dark:bg-[#10221D] shadow-sm">
                {/* Visual Header */}
                <div className="relative aspect-[16/10] overflow-hidden bg-[#0C1613] flex items-center justify-center">
                  {!imageFailed ? (
                    <img
                      src={heroFacilityImage}
                      alt="Automated Optical Waste Sorting Facility with NIR Scanning"
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-102"
                      referrerPolicy="no-referrer"
                      onError={() => setImageFailed(true)}
                    />
                  ) : (
                    /* Graceful Fallback when image cannot load */
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-[#8A9890]">
                      <div className="w-12 h-12 rounded-lg bg-[#16A36A]/10 border border-[#16A36A]/20 flex items-center justify-center mb-2 text-[#16A36A]">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-semibold text-[#EAEFEA]">Optical Inspection Facility</span>
                      <span className="text-[11px] text-[#8A9890] mt-1">Conveyor Optical Camera Inspection View</span>
                    </div>
                  )}

                  {/* Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#10221D] via-[#10221D]/30 to-transparent pointer-events-none" />

                  {/* Sample label */}
                  <div className="absolute top-3 left-3 bg-[#102A24]/90 backdrop-blur-xs px-2.5 py-1 rounded text-[11px] font-medium text-[#C8F169] border border-[#16A36A]/30">
                    Sample Infeed Preview · Demonstration Batch
                  </div>
                </div>

                {/* Analytical Card Panel */}
                <div className="p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-xs text-[#18251F] dark:text-[#EAEFEA]">
                        Optical Inspection Station 01
                      </h4>
                      <p className="text-[11px] text-[#66736C] dark:text-[#8A9890]">
                        Single-Stream Mixed Commodity Infeed
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-mono font-bold text-[#16A36A]">ACCEPTED</div>
                      <div className="text-[10px] text-[#66736C] dark:text-[#8A9890]">Within Tolerance</div>
                    </div>
                  </div>

                  {/* Material breakdown bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-[#66736C] dark:text-[#8A9890]">Detected Composition</span>
                      <span className="font-mono text-xs font-semibold text-[#18251F] dark:text-[#EAEFEA]">
                        8.5% Contamination
                      </span>
                    </div>
                    <div className="h-2 w-full bg-[#E2E6DF] dark:bg-[#1B332B] rounded-full overflow-hidden flex">
                      <div style={{ width: '42%' }} className="bg-[#16A36A]" title="OCC Cardboard 42%" />
                      <div style={{ width: '35%' }} className="bg-[#3B82F6]" title="Rigid PET 35%" />
                      <div style={{ width: '15%' }} className="bg-[#C8F169]" title="Aluminum UBC 15%" />
                      <div style={{ width: '8%' }} className="bg-[#DC2626]" title="Film Contaminant 8%" />
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-[#66736C] dark:text-[#8A9890] flex-wrap">
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-xs bg-[#16A36A]" /> Paper 42%</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-xs bg-[#3B82F6]" /> PET 35%</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-xs bg-[#C8F169]" /> Metal 15%</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-xs bg-[#DC2626]" /> Film 8%</span>
                    </div>
                  </div>

                  {/* Quick Try Sample Button */}
                  <div className="pt-3 flex items-center justify-between border-t border-[#E2E6DF] dark:border-[#1B332B]">
                    <span className="text-xs text-[#66736C] dark:text-[#8A9890]">
                      Pre-loaded audit image:
                    </span>
                    <button
                      onClick={() => onOpenSample('sample-clean-segregated')}
                      className="text-xs font-semibold text-[#16A36A] hover:underline cursor-pointer"
                    >
                      Run Instant Inspection →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Workflow Section */}
      <section id="workflow" className="py-16 bg-white dark:bg-[#0B1513] border-b border-[#E2E6DF] dark:border-[#1B332B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#16A36A] dark:text-[#C8F169]">
              Inspection Workflow
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#102A24] dark:text-[#EAEFEA]">
              From Batch Image to Actionable Recycling Decision
            </h2>
            <p className="text-xs sm:text-sm text-[#66736C] dark:text-[#8A9890]">
              A practical visual assessment tool designed to evaluate waste stream quality and prevent downcycling.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="p-6 rounded-xl bg-[#F7F8F5] dark:bg-[#10221D] border border-[#E2E6DF] dark:border-[#1B332B] flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-[#16A36A]">01. INGEST IMAGE</span>
                <h3 className="text-base font-semibold text-[#18251F] dark:text-[#EAEFEA] mt-2 mb-2">
                  Capture &amp; Upload
                </h3>
                <p className="text-xs leading-relaxed text-[#66736C] dark:text-[#8A9890]">
                  Upload photographs from receiving bins, conveyor audit points, or facility containers. Supports JPEG, PNG, and WebP up to 25MB.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-[#E2E6DF]/70 dark:border-[#1B332B] text-xs text-[#16A36A] font-medium flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> High-resolution image support
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-xl bg-[#F7F8F5] dark:bg-[#10221D] border border-[#E2E6DF] dark:border-[#1B332B] flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-[#16A36A]">02. MULTI-CLASS AI SCAN</span>
                <h3 className="text-base font-semibold text-[#18251F] dark:text-[#EAEFEA] mt-2 mb-2">
                  Material Identification
                </h3>
                <p className="text-xs leading-relaxed text-[#66736C] dark:text-[#8A9890]">
                  Gemini vision models identify visible materials across plastics, paper, metal, glass, organics, and non-recyclable contaminants with confidence scores.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-[#E2E6DF]/70 dark:border-[#1B332B] text-xs text-[#16A36A] font-medium flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Multi-material categorization
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-xl bg-[#F7F8F5] dark:bg-[#10221D] border border-[#E2E6DF] dark:border-[#1B332B] flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-[#16A36A]">03. AUDIT &amp; RESOLUTION</span>
                <h3 className="text-base font-semibold text-[#18251F] dark:text-[#EAEFEA] mt-2 mb-2">
                  Suitability &amp; Corrective Steps
                </h3>
                <p className="text-xs leading-relaxed text-[#66736C] dark:text-[#8A9890]">
                  Receive an immediate suitability verdict (Accepted, Accepted with Sorting, or Rejected), flagged contaminant details, and a prioritized operator checklist.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-[#E2E6DF]/70 dark:border-[#1B332B] text-xs text-[#16A36A] font-medium flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Printable report &amp; JSON export
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Capabilities Grid */}
      <section className="py-16 bg-[#F7F8F5] dark:bg-[#0C1613] border-b border-[#E2E6DF] dark:border-[#1B332B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10 space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#16A36A] dark:text-[#C8F169]">
              Core Capabilities
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#102A24] dark:text-[#EAEFEA]">
              Designed for Practical Waste Quality Control
            </h2>
            <p className="text-xs sm:text-sm text-[#66736C] dark:text-[#8A9890]">
              Empowering sorting personnel with immediate, structured visual contamination feedback.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-5 rounded-xl bg-white dark:bg-[#10221D] border border-[#E2E6DF] dark:border-[#1B332B] space-y-2.5">
              <div className="w-9 h-9 rounded-lg bg-[#16A36A]/10 text-[#16A36A] flex items-center justify-center">
                <Cpu className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-semibold text-[#18251F] dark:text-[#EAEFEA]">
                Visual Purity Assessment
              </h4>
              <p className="text-xs text-[#66736C] dark:text-[#8A9890] leading-relaxed">
                Replaces guesswork with consistent visual contamination percentages calibrated to standard stream tolerances.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white dark:bg-[#10221D] border border-[#E2E6DF] dark:border-[#1B332B] space-y-2.5">
              <div className="w-9 h-9 rounded-lg bg-[#3B82F6]/10 text-[#3B82F6] flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-semibold text-[#18251F] dark:text-[#EAEFEA]">
                Contamination Evidence
              </h4>
              <p className="text-xs text-[#66736C] dark:text-[#8A9890] leading-relaxed">
                Highlights non-target items, film wraps, and hazardous articles with clear photographic visual descriptions.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white dark:bg-[#10221D] border border-[#E2E6DF] dark:border-[#1B332B] space-y-2.5">
              <div className="w-9 h-9 rounded-lg bg-[#C8F169]/20 text-[#102A24] dark:text-[#C8F169] flex items-center justify-center">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-semibold text-[#18251F] dark:text-[#EAEFEA]">
                Corrective Checklist
              </h4>
              <p className="text-xs text-[#66736C] dark:text-[#8A9890] leading-relaxed">
                Generates prioritized operator recommendations (e.g. manual pick, vacuum film divert, bale rejection).
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white dark:bg-[#10221D] border border-[#E2E6DF] dark:border-[#1B332B] space-y-2.5">
              <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-semibold text-[#18251F] dark:text-[#EAEFEA]">
                Standards Alignment
              </h4>
              <p className="text-xs text-[#66736C] dark:text-[#8A9890] leading-relaxed">
                Evaluates stream quality against ISRI scrap specifications, APR resin categories, and EN 643 paper rules.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sustainability Mission Section */}
      <section className="py-16 bg-white dark:bg-[#0B1513] border-b border-[#E2E6DF] dark:border-[#1B332B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#102A24] text-white rounded-xl p-8 sm:p-12 relative overflow-hidden">
            <div className="relative z-10 max-w-3xl space-y-4">
              <span className="text-xs font-mono font-bold text-[#C8F169] tracking-wider uppercase">
                Environmental &amp; Circularity Purpose
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight [text-wrap:balance]">
                Preventing Recycling Batch Rejection at the Source
              </h2>
              <p className="text-xs sm:text-sm text-[#EAEFEA]/80 leading-relaxed">
                When a collected waste batch contains incompatible polymers, non-recyclable films, or organic contamination, entire loads risk rejection and redirection to landfills or incinerators. EcoSort AI delivers immediate visual inspection feedback so operators can segregate materials correctly before processing.
              </p>

              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  onClick={onAnalyzeClick}
                  className="px-5 py-2.5 text-xs font-bold text-[#102A24] bg-[#C8F169] hover:bg-[#b5e050] rounded-lg transition-colors cursor-pointer shadow-xs"
                >
                  Start Batch Inspection
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Clean Footer */}
      <footer className="py-10 bg-[#F7F8F5] dark:bg-[#0B1513] text-[#66736C] dark:text-[#8A9890] text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-[#102A24] dark:text-[#EAEFEA]">EcoSort AI</span>
            <span>· AI-Based Intelligent Waste Segregation &amp; Recycling Assessment System</span>
          </div>
          <div className="text-[11px]">
            Academic Micro-Project · Powered by Google Gemini AI Vision Models
          </div>
        </div>
      </footer>
    </div>
  );
};
