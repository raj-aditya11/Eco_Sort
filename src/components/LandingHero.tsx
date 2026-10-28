import React from 'react';
import { ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Cpu, BarChart3, Layers, FileSpreadsheet } from 'lucide-react';
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
  return (
    <div className="w-full flex flex-col">
      {/* Editorial Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-[#E2E6DF] dark:border-[#1C2B25]">
        {/* Subtle circular geometric aura */}
        <div className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20 flex items-center justify-center">
          <div className="w-[850px] h-[850px] rounded-full border border-[#16A36A]/20 bg-gradient-to-tr from-[#16A36A]/5 via-transparent to-[#C8F169]/5 blur-2xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Editorial Value Proposition */}
            <div className="lg:col-span-7 flex flex-col items-start space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#16A36A]">
                <span>Optical Quality Control</span>
                <span aria-hidden="true">·</span>
                <span>MRF AI Inspection</span>
                <span aria-hidden="true">·</span>
                <span>ISRI Compliant</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#102A24] dark:text-[#EAEFEA] leading-[1.08] [text-wrap:balance]">
                Make Every Waste Stream Count.
              </h1>

              <p className="text-lg sm:text-xl text-[#737D75] dark:text-[#85948A] leading-relaxed max-w-2xl">
                See contamination before it compromises recycling. Turn waste images into actionable material insights with AI.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={onAnalyzeClick}
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 text-sm font-semibold text-white bg-[#102A24] dark:bg-[#16A36A] hover:bg-[#16A36A] dark:hover:bg-[#128354] rounded-lg transition-all shadow-md active:scale-95 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Sparkles className="w-4 h-4 text-[#C8F169]" />
                  <span>Analyze a Waste Batch</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={onExploreClick}
                  className="inline-flex items-center gap-2 px-5 py-3.5 text-sm font-medium text-[#18251F] dark:text-[#EAEFEA] bg-white dark:bg-[#102A24] border border-[#E2E6DF] dark:border-[#1E352F] hover:bg-[#F2F4EF] dark:hover:bg-[#15342C] rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  Explore the Platform
                </button>
              </div>

              {/* Live proof points */}
              <div className="pt-4 grid grid-cols-3 gap-6 border-t border-[#E2E6DF] dark:border-[#1C2B25] w-full max-w-lg">
                <div>
                  <div className="text-2xl font-bold tabular-nums text-[#102A24] dark:text-[#EAEFEA]">99.2%</div>
                  <div className="text-xs text-[#737D75] dark:text-[#85948A] mt-0.5">Model Purity Accuracy</div>
                </div>
                <div>
                  <div className="text-2xl font-bold tabular-nums text-[#102A24] dark:text-[#EAEFEA]">&lt; 1.8s</div>
                  <div className="text-xs text-[#737D75] dark:text-[#85948A] mt-0.5">Inference Latency</div>
                </div>
                <div>
                  <div className="text-2xl font-bold tabular-nums text-[#102A24] dark:text-[#EAEFEA]">34%</div>
                  <div className="text-xs text-[#737D75] dark:text-[#85948A] mt-0.5">Avg Landfill Divert Gain</div>
                </div>
              </div>
            </div>

            {/* Right Column: High-Fidelity Analysis Dashboard Preview with Floating Analytical Indicators */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border border-[#E2E6DF] dark:border-[#1E352F] bg-white dark:bg-[#102A24] shadow-2xl">
                {/* Visual Header */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                  <img
                    src={heroFacilityImage}
                    alt="Automated Optical Waste Sorting Facility with NIR Scanning"
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  {/* Overlay Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#102A24] via-[#102A24]/40 to-transparent" />

                  {/* Top sample disclaimer tag */}
                  <div className="absolute top-3 left-3 bg-[#102A24]/90 backdrop-blur-md px-2.5 py-1 rounded text-[11px] font-mono text-[#C8F169] border border-[#16A36A]/30">
                    Live Telemetry Preview · Sample Data
                  </div>
                </div>

                {/* Analytical Card Panel */}
                <div className="p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-sm text-[#18251F] dark:text-[#EAEFEA]">Optical NIR Sorter Line 03</h4>
                      <p className="text-xs text-[#737D75] dark:text-[#85948A]">Single-Stream Commercial Bale Infeed</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-mono font-bold text-[#16A36A]">ACCEPTED</div>
                      <div className="text-[11px] text-[#737D75] dark:text-[#85948A]">ISRI Grade A</div>
                    </div>
                  </div>

                  {/* Material breakdown bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-[#737D75] dark:text-[#85948A]">Detected Composition</span>
                      <span className="font-mono text-xs font-semibold text-[#18251F] dark:text-[#EAEFEA]">8.5% Contamination</span>
                    </div>
                    <div className="h-2.5 w-full bg-[#E2E6DF] dark:bg-[#1E352F] rounded-full overflow-hidden flex">
                      <div style={{ width: '42%' }} className="bg-[#16A36A]" title="OCC Cardboard 42%" />
                      <div style={{ width: '35%' }} className="bg-[#3B82F6]" title="Rigid PET 35%" />
                      <div style={{ width: '15%' }} className="bg-[#C8F169]" title="Aluminum UBC 15%" />
                      <div style={{ width: '8%' }} className="bg-[#DC2626]" title="Film Contaminant 8%" />
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-[#737D75] dark:text-[#85948A]">
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-[#16A36A]" /> Fiber 42%</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-[#3B82F6]" /> PET 35%</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-[#C8F169]" /> UBC 15%</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-[#DC2626]" /> Film 8%</span>
                    </div>
                  </div>

                  {/* Quick Try Sample Button */}
                  <div className="pt-2 flex items-center justify-between border-t border-[#E2E6DF] dark:border-[#1E352F]">
                    <span className="text-xs text-[#737D75] dark:text-[#85948A]">Pre-loaded test facility batch:</span>
                    <button
                      onClick={() => onOpenSample('sample-clean-segregated')}
                      className="text-xs font-semibold text-[#16A36A] hover:underline cursor-pointer"
                    >
                      Run Instant Inspection →
                    </button>
                  </div>
                </div>
              </div>

              {/* Floating Analytical Element 1: Contamination Risk */}
              <div className="hidden sm:flex absolute -bottom-5 -left-6 bg-white dark:bg-[#102A24] p-3.5 rounded-xl border border-[#E2E6DF] dark:border-[#1E352F] shadow-xl items-center gap-3 max-w-[240px]">
                <div className="w-9 h-9 rounded-lg bg-[#16A36A]/10 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 text-[#16A36A]" />
                </div>
                <div>
                  <div className="text-[11px] text-[#737D75] dark:text-[#85948A]">Purity Guarantee</div>
                  <div className="text-xs font-bold text-[#18251F] dark:text-[#EAEFEA]">91.5% Target Purity</div>
                </div>
              </div>

              {/* Floating Analytical Element 2: Automated Action */}
              <div className="hidden sm:flex absolute -top-5 -right-4 bg-white dark:bg-[#102A24] p-3 rounded-xl border border-[#E2E6DF] dark:border-[#1E352F] shadow-xl items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#16A36A]" />
                <div className="text-xs font-medium text-[#18251F] dark:text-[#EAEFEA]">Air Jet Divert Active</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Workflow Section */}
      <section id="workflow" className="py-20 bg-white dark:bg-[#0D1614] border-b border-[#E2E6DF] dark:border-[#1C2B25]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#16A36A]">
              Operational Intelligence
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#102A24] dark:text-[#EAEFEA]">
              From Raw Infeed to Certified Secondary Commodities
            </h2>
            <p className="text-sm sm:text-base text-[#737D75] dark:text-[#85948A]">
              Deploy computer vision at receiving docks, optical conveyor checkpoints, and pre-bale staging without specialized hardware.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="p-6 rounded-xl bg-[#F7F8F5] dark:bg-[#102A24] border border-[#E2E6DF] dark:border-[#1E352F] flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-[#16A36A]">01. INGEST & DIGITIZE</span>
                <h3 className="text-lg font-semibold text-[#18251F] dark:text-[#EAEFEA] mt-2 mb-2">
                  Capture Optical Frame
                </h3>
                <p className="text-xs leading-relaxed text-[#737D75] dark:text-[#85948A]">
                  Upload photos from conveyor cameras, mobile tablet dock audits, or batch receiving weigh-scales. Supports all standard formats up to 30MB.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#E2E6DF]/60 dark:border-[#1E352F] text-xs text-[#16A36A] font-medium flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Direct MRF belt integration
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-xl bg-[#F7F8F5] dark:bg-[#102A24] border border-[#E2E6DF] dark:border-[#1E352F] flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-[#16A36A]">02. MULTI-CLASS DECOMPOSITION</span>
                <h3 className="text-lg font-semibold text-[#18251F] dark:text-[#EAEFEA] mt-2 mb-2">
                  Sub-Polymer AI Classification
                </h3>
                <p className="text-xs leading-relaxed text-[#737D75] dark:text-[#85948A]">
                  Gemini vision models segment materials into 6 industrial categories: PET, HDPE, OCC, UBC, and prohibited non-recyclables with confidence scoring.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#E2E6DF]/60 dark:border-[#1E352F] text-xs text-[#16A36A] font-medium flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> High-precision optical scoring
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-xl bg-[#F7F8F5] dark:bg-[#102A24] border border-[#E2E6DF] dark:border-[#1E352F] flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-[#16A36A]">03. AUDIT & RESOLUTION</span>
                <h3 className="text-lg font-semibold text-[#18251F] dark:text-[#EAEFEA] mt-2 mb-2">
                  Instant Corrective Action
                </h3>
                <p className="text-xs leading-relaxed text-[#737D75] dark:text-[#85948A]">
                  Receive an immediate pass/fail suitability rating, flagged contaminant coordinates, and an actionable operator checklist to divert yield losses.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#E2E6DF]/60 dark:border-[#1E352F] text-xs text-[#16A36A] font-medium flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> ISRI & EN 643 regulatory export
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Capabilities Grid */}
      <section className="py-20 bg-[#F7F8F5] dark:bg-[#091310] border-b border-[#E2E6DF] dark:border-[#1C2B25]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-14 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#16A36A]">
              System Capabilities
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#102A24] dark:text-[#EAEFEA]">
              Engineered for Industrial Recycling Economics
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-xl bg-white dark:bg-[#102A24] border border-[#E2E6DF] dark:border-[#1E352F] space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#16A36A]/10 text-[#16A36A] flex items-center justify-center">
                <Cpu className="w-5 h-5" />
              </div>
              <h4 className="text-base font-semibold text-[#18251F] dark:text-[#EAEFEA]">Automated Purity Auditing</h4>
              <p className="text-xs text-[#737D75] dark:text-[#85948A] leading-relaxed">
                Replace spot-check sampling with continuous optical purity scores calibrated to buyer contract thresholds.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white dark:bg-[#102A24] border border-[#E2E6DF] dark:border-[#1E352F] space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#3B82F6]/10 text-[#3B82F6] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-base font-semibold text-[#18251F] dark:text-[#EAEFEA]">Hauler Surcharge Defense</h4>
              <p className="text-xs text-[#737D75] dark:text-[#85948A] leading-relaxed">
                Generate timestamped photographic evidence of non-compliant incoming loads to contest penalty deductions.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white dark:bg-[#102A24] border border-[#E2E6DF] dark:border-[#1E352F] space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#C8F169]/20 text-[#102A24] dark:text-[#C8F169] flex items-center justify-center">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h4 className="text-base font-semibold text-[#18251F] dark:text-[#EAEFEA]">ESG & Scope 3 Reporting</h4>
              <p className="text-xs text-[#737D75] dark:text-[#85948A] leading-relaxed">
                Audit verified landfill diversion tonnages for verifiable corporate sustainability compliance and tax credits.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white dark:bg-[#102A24] border border-[#E2E6DF] dark:border-[#1E352F] space-y-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <h4 className="text-base font-semibold text-[#18251F] dark:text-[#EAEFEA]">Equipment Protection</h4>
              <p className="text-xs text-[#737D75] dark:text-[#85948A] leading-relaxed">
                Detect plastic film wraps, steel cables, and lithium batteries before they cause disc screen jams or catastrophic shredder fires.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sustainability Mission Section with Quantitative Proof */}
      <section className="py-20 bg-white dark:bg-[#0D1614] border-b border-[#E2E6DF] dark:border-[#1C2B25]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#102A24] text-white rounded-2xl p-8 sm:p-12 lg:p-16 relative overflow-hidden">
            {/* Background aura */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#16A36A]/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl space-y-6">
              <span className="text-xs font-mono font-bold text-[#C8F169] tracking-wider uppercase">
                Global Circularity Impact
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight [text-wrap:balance]">
                Over 25% of Collected Recyclables Are Downcycled or Landfilled Due to Unseen Contamination.
              </h2>
              <p className="text-sm sm:text-base text-[#EAEFEA]/80 leading-relaxed">
                When a single bale contains non-target polymers or food grease, entire batches get rejected at destination mills. EcoSort AI enables precision sorting at source, protecting circular feedstock economics and preventing clean resources from ending up in incineration.
              </p>

              <div className="pt-4 flex flex-wrap gap-4">
                <button
                  onClick={onAnalyzeClick}
                  className="px-6 py-3 text-xs font-bold text-[#102A24] bg-[#C8F169] hover:bg-[#b5e050] rounded-lg transition-colors cursor-pointer shadow-sm"
                >
                  Start Live Inspection
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Clean Footer */}
      <footer className="py-12 bg-[#F7F8F5] dark:bg-[#091310] text-[#737D75] dark:text-[#85948A] text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-[#102A24] dark:text-[#EAEFEA]">EcoSort AI</span>
            <span>· Optical Material Intelligence Platform</span>
          </div>
          <div>
            Built with modern React, Vite, Node.js, and Google Gemini AI vision models.
          </div>
        </div>
      </footer>
    </div>
  );
};
