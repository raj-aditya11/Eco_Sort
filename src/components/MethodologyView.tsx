import React from 'react';
import { BookOpen, CheckCircle2, Shield, Layers, Scale, Sparkles } from 'lucide-react';
import { WASTE_STREAM_DEFINITIONS } from '../data/standards.ts';

export const MethodologyView: React.FC = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="border-b border-[#E2E6DF] dark:border-[#1C2B25] pb-5">
        <div className="flex items-center gap-2 text-xs text-[#737D75] dark:text-[#85948A] mb-1">
          <span>Standards &amp; Compliance</span>
          <span aria-hidden="true">/</span>
          <span className="text-[#18251F] dark:text-[#EAEFEA] font-medium">Measurement Methodology</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#102A24] dark:text-[#EAEFEA]">
          Regulatory &amp; Quality Specifications
        </h1>
        <p className="text-xs sm:text-sm text-[#737D75] dark:text-[#85948A] mt-0.5">
          How EcoSort AI aligns computer vision optical models with international secondary commodity trading standards.
        </p>
      </div>

      {/* Core Standard Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-[#102A24] border border-[#E2E6DF] dark:border-[#1E352F] shadow-sm space-y-3">
          <div className="w-9 h-9 rounded-lg bg-[#16A36A]/10 text-[#16A36A] flex items-center justify-center">
            <BookOpen className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-sm text-[#18251F] dark:text-[#EAEFEA]">
            ISRI Scrap Specifications
          </h3>
          <p className="text-xs text-[#737D75] dark:text-[#85948A] leading-relaxed">
            Incorporates the Institute of Scrap Recycling Industries scrap trade guidelines. Defines strict moisture, outthrow, and prohibitive tolerances for paper and non-ferrous metals.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-[#102A24] border border-[#E2E6DF] dark:border-[#1E352F] shadow-sm space-y-3">
          <div className="w-9 h-9 rounded-lg bg-[#3B82F6]/10 text-[#3B82F6] flex items-center justify-center">
            <Shield className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-sm text-[#18251F] dark:text-[#EAEFEA]">
            APR Model Bale Specifications
          </h3>
          <p className="text-xs text-[#737D75] dark:text-[#85948A] leading-relaxed">
            Association of Plastic Recyclers criteria for bottle-to-bottle circularity. Establishes thresholds for clear PET, HDPE fractions, and non-melting polymer contaminants like PVC.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-[#102A24] border border-[#E2E6DF] dark:border-[#1E352F] shadow-sm space-y-3">
          <div className="w-9 h-9 rounded-lg bg-[#C8F169]/20 text-[#102A24] dark:text-[#C8F169] flex items-center justify-center">
            <Scale className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-sm text-[#18251F] dark:text-[#EAEFEA]">
            EN 643 European Paper Standard
          </h3>
          <p className="text-xs text-[#737D75] dark:text-[#85948A] leading-relaxed">
            Strict European list of standard grades of recovered paper and board, bounding non-paper components to strict 1.5% to 5.0% maximums depending on industrial mill application.
          </p>
        </div>
      </div>

      {/* Waste Stream Threshold Matrix */}
      <div className="rounded-2xl bg-white dark:bg-[#102A24] border border-[#E2E6DF] dark:border-[#1E352F] shadow-sm overflow-hidden space-y-4 p-6">
        <div>
          <h3 className="font-bold text-sm text-[#18251F] dark:text-[#EAEFEA]">
            Official Tolerance Matrix by Commodity Stream
          </h3>
          <p className="text-xs text-[#737D75] dark:text-[#85948A]">
            Standard thresholds used by EcoSort AI to determine stream acceptance vs. mandatory positive sortation.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#E2E6DF] dark:border-[#1C2B25] text-[#737D75] dark:text-[#85948A] bg-[#F7F8F5]/60 dark:bg-[#0D1614]/60">
                <th className="py-3 px-4 font-semibold">Stream Commodity</th>
                <th className="py-3 px-4 font-semibold text-right">Max Contamination Cap</th>
                <th className="py-3 px-4 font-semibold text-right">Target Purity</th>
                <th className="py-3 px-4 font-semibold">Primary Accepted Materials</th>
                <th className="py-3 px-4 font-semibold">Critical Prohibited Items</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E6DF] dark:divide-[#1C2B25]">
              {Object.values(WASTE_STREAM_DEFINITIONS).map((def) => (
                <tr key={def.id} className="hover:bg-[#F2F4EF] dark:hover:bg-[#15342C] transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-[#18251F] dark:text-[#EAEFEA]">
                    {def.label}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-red-600 dark:text-red-400">
                    &le; {def.standardToleranceMaxRisk}%
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-[#16A36A]">
                    &ge; {def.targetPurityMin}%
                  </td>
                  <td className="py-3.5 px-4 text-[#737D75] dark:text-[#85948A]">
                    {def.typicalCommodities.slice(0, 3).join(', ')}
                  </td>
                  <td className="py-3.5 px-4 text-red-600 dark:text-red-400">
                    {def.strictDisallowed.slice(0, 2).join(', ')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
