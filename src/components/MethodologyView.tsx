import React from 'react';
import { BookOpen, Shield, Scale, Info } from 'lucide-react';
import { WASTE_STREAM_DEFINITIONS } from '../data/standards.ts';

export const MethodologyView: React.FC = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 space-y-6">
      {/* Header */}
      <div className="border-b border-[#DCDDD4] dark:border-[#2B312B] pb-5">
        <div className="flex items-center gap-2 font-mono text-[11px] text-[#777B73] dark:text-[#9DA399] uppercase tracking-wider mb-1">
          <span>SPECIFICATIONS</span>
          <span aria-hidden="true">·</span>
          <span>RECOVERY STANDARDS</span>
          <span aria-hidden="true">·</span>
          <span className="text-[#245B45] dark:text-[#3A7D63] font-semibold">TOLERANCE MATRICES</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#252923] dark:text-[#E6E8E3]">
          Waste Stream Quality Specifications
        </h1>
        <p className="text-xs sm:text-sm text-[#777B73] dark:text-[#9DA399] mt-0.5 max-w-3xl">
          How EcoSort AI aligns visual contamination evaluation with secondary commodity specifications and recyclability thresholds.
        </p>
      </div>

      {/* Core Standard Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-[#FFFFFF] dark:bg-[#1C201C] border border-[#DCDDD4] dark:border-[#2B312B] space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-[#F5F4EE] dark:bg-[#22332A] border border-[#DCDDD4] dark:border-[#2B312B] text-[#245B45] dark:text-[#3A7D63] flex items-center justify-center shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#252923] dark:text-[#E6E8E3]">
              ISRI Scrap Guidelines
            </h3>
          </div>
          <p className="text-xs text-[#777B73] dark:text-[#9DA399] leading-relaxed">
            Incorporates Institute of Scrap Recycling Industries specifications. Defines outthrow, prohibitive, and moisture tolerances for paper, cardboard, and non-ferrous metals.
          </p>
        </div>

        <div className="p-4 rounded-lg bg-[#FFFFFF] dark:bg-[#1C201C] border border-[#DCDDD4] dark:border-[#2B312B] space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-[#F5F4EE] dark:bg-[#22332A] border border-[#DCDDD4] dark:border-[#2B312B] text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#252923] dark:text-[#E6E8E3]">
              APR Model Bale Specifications
            </h3>
          </div>
          <p className="text-xs text-[#777B73] dark:text-[#9DA399] leading-relaxed">
            Association of Plastic Recyclers criteria for bottle-to-bottle recycling. Establishes thresholds for clear PET, HDPE fractions, and incompatible polymer contaminants like PVC.
          </p>
        </div>

        <div className="p-4 rounded-lg bg-[#FFFFFF] dark:bg-[#1C201C] border border-[#DCDDD4] dark:border-[#2B312B] space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-[#F5F4EE] dark:bg-[#22332A] border border-[#DCDDD4] dark:border-[#2B312B] text-[#B77928] flex items-center justify-center shrink-0">
              <Scale className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#252923] dark:text-[#E6E8E3]">
              EN 643 European Standard
            </h3>
          </div>
          <p className="text-xs text-[#777B73] dark:text-[#9DA399] leading-relaxed">
            Standard European list of recovered paper and board grades, bounding non-paper components to strict 1.5% to 5.0% maximums depending on industrial pulping application.
          </p>
        </div>
      </div>

      {/* Waste Stream Threshold Matrix */}
      <div className="rounded-lg bg-[#FFFFFF] dark:bg-[#1C201C] border border-[#DCDDD4] dark:border-[#2B312B] overflow-hidden space-y-3 p-4 sm:p-5">
        <div className="border-b border-[#DCDDD4] dark:border-[#2B312B] pb-3">
          <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#252923] dark:text-[#E6E8E3]">
            Tolerance Matrix by Commodity Stream
          </h3>
          <p className="text-[11px] text-[#777B73] dark:text-[#9DA399]">
            Thresholds applied by EcoSort AI to determine stream acceptance vs. required sorting intervention
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#DCDDD4] dark:border-[#2B312B] text-[#777B73] dark:text-[#9DA399] bg-[#F5F4EE]/70 dark:bg-[#151815]/70">
                <th className="py-2.5 px-3.5 font-semibold uppercase text-[10px] tracking-wider">Stream Commodity</th>
                <th className="py-2.5 px-3.5 font-semibold uppercase text-[10px] tracking-wider text-right">Max Contamination Cap</th>
                <th className="py-2.5 px-3.5 font-semibold uppercase text-[10px] tracking-wider text-right">Target Purity</th>
                <th className="py-2.5 px-3.5 font-semibold uppercase text-[10px] tracking-wider">Primary Accepted Materials</th>
                <th className="py-2.5 px-3.5 font-semibold uppercase text-[10px] tracking-wider">Critical Prohibited Items</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCDDD4] dark:divide-[#2B312B]">
              {Object.values(WASTE_STREAM_DEFINITIONS).map((def) => (
                <tr key={def.id} className="hover:bg-[#F5F4EE]/60 dark:hover:bg-[#22332A]/50 transition-colors">
                  <td className="py-3 px-3.5 font-semibold text-[#252923] dark:text-[#E6E8E3]">
                    {def.label}
                  </td>
                  <td className="py-3 px-3.5 text-right font-mono font-bold text-[#A63F37]">
                    &le; {def.standardToleranceMaxRisk}%
                  </td>
                  <td className="py-3 px-3.5 text-right font-mono font-bold text-[#245B45] dark:text-[#3A7D63]">
                    &ge; {def.targetPurityMin}%
                  </td>
                  <td className="py-3 px-3.5 text-[#777B73] dark:text-[#9DA399]">
                    {def.typicalCommodities.slice(0, 3).join(', ')}
                  </td>
                  <td className="py-3 px-3.5 text-[#A63F37]">
                    {def.strictDisallowed.slice(0, 2).join(', ')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Uncertainty Notice in Methodology */}
      <div className="p-3.5 rounded-lg bg-[#F5F4EE] dark:bg-[#1C201C] border border-[#DCDDD4] dark:border-[#2B312B] flex items-start gap-2.5 text-xs">
        <Info className="w-4 h-4 text-[#777B73] dark:text-[#9DA399] shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <strong className="text-[11px] font-semibold text-[#252923] dark:text-[#E6E8E3] uppercase tracking-wide block">
            Regulatory Notice
          </strong>
          <p className="text-[11px] text-[#777B73] dark:text-[#9DA399] leading-relaxed">
            Results are image-based estimates. Hidden chemical or microbial contamination cannot be verified from an RGB image. Follow local municipal and recycler guidelines.
          </p>
        </div>
      </div>
    </div>
  );
};
