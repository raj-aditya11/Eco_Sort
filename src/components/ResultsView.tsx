import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  Download,
  Printer,
  ArrowLeft,
  Layers,
  ChevronRight,
  HelpCircle,
  FileCheck,
  ScanLine,
  Info
} from 'lucide-react';
import { AnalysisResult, ActionChecklistItem } from '../types/index.ts';
import { printAnalysisReport } from '../utils/printReport.js';

interface ResultsViewProps {
  result: AnalysisResult;
  onNewAnalysis: () => void;
  onBackToDashboard: () => void;
  onShowToast: (title: string, message?: string, type?: 'success' | 'info') => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  result,
  onNewAnalysis,
  onBackToDashboard,
  onShowToast
}) => {
  const [checklist, setChecklist] = useState<ActionChecklistItem[]>(result.actionChecklist || []);

  const toggleChecklistStep = (stepIndex: number) => {
    setChecklist(prev =>
      prev.map((item, idx) =>
        idx === stepIndex ? { ...item, completed: !item.completed } : item
      )
    );
    onShowToast('Action Step Updated', 'Checklist status updated for this session.', 'info');
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(result, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${result.batchName || 'ecosort-audit'}-report.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    onShowToast('Report Exported', 'JSON data downloaded successfully.', 'success');
  };

  const handlePrint = () => {
    printAnalysisReport(result);
    onShowToast('Printing Report', 'Opening browser print dialog...', 'info');
  };

  // Circular gauge math
  const score = result.contaminationScore;
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const isAccepted = result.streamSuitability === 'ACCEPTED';
  const isSorting = result.streamSuitability === 'ACCEPTED_WITH_SORTING';

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Breadcrumb & Action Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E2E6DF] dark:border-[#1B332B] pb-5 no-print">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-[#66736C] dark:text-[#8A9890]">
            <button
              onClick={onBackToDashboard}
              className="hover:text-[#102A24] dark:hover:text-[#EAEFEA] flex items-center gap-1 cursor-pointer font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Workspace
            </button>
            <span aria-hidden="true">/</span>
            <span className="font-mono text-[11px]">{result.id}</span>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#102A24] dark:text-[#EAEFEA]">
              {result.batchName}
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#F7F8F5] dark:bg-[#15342C] border border-[#E2E6DF] dark:border-[#1B332B] text-[#66736C] dark:text-[#8A9890]">
              {result.wasteStream.replace(/_/g, ' ')}
            </span>
          </div>
          <p className="text-xs text-[#66736C] dark:text-[#8A9890]">
            Inspected {new Date(result.createdAt).toLocaleString()} {result.facilityLine ? `· ${result.facilityLine}` : ''}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 no-print">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#18251F] dark:text-[#EAEFEA] bg-white dark:bg-[#10221D] border border-[#E2E6DF] dark:border-[#1B332B] hover:bg-[#F2F4EF] dark:hover:bg-[#15342C] rounded-lg transition-colors cursor-pointer"
            title="Print a clean physical or PDF report"
          >
            <Printer className="w-3.5 h-3.5 text-[#66736C]" />
            <span>Print Report</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#18251F] dark:text-[#EAEFEA] bg-white dark:bg-[#10221D] border border-[#E2E6DF] dark:border-[#1B332B] hover:bg-[#F2F4EF] dark:hover:bg-[#15342C] rounded-lg transition-colors cursor-pointer"
            title="Download full analysis payload as JSON"
          >
            <Download className="w-3.5 h-3.5 text-[#66736C]" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={onNewAnalysis}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#102A24] dark:bg-[#16A36A] hover:bg-[#16A36A] dark:hover:bg-[#128354] rounded-lg transition-colors shadow-xs active:scale-98 cursor-pointer whitespace-nowrap shrink-0"
          >
            <ScanLine className="w-3.5 h-3.5" />
            <span>Analyze Another Batch</span>
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Summary, Score Gauge & Material Composition */}
        <div className="lg:col-span-5 space-y-6">
          {/* Inspection Summary Card */}
          <div className="p-5 rounded-xl bg-white dark:bg-[#10221D] border border-[#E2E6DF] dark:border-[#1B332B] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E6DF] dark:border-[#1B332B] pb-3">
              <h2 className="font-bold text-xs uppercase tracking-wider text-[#66736C] dark:text-[#8A9890]">
                Inspection Summary
              </h2>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                result.overallRisk === 'LOW'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : result.overallRisk === 'MODERATE'
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                  : result.overallRisk === 'HIGH'
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
              }`}>
                {result.overallRisk} RISK
              </span>
            </div>

            {/* Circular Contamination Score Gauge */}
            <div className="flex flex-col items-center justify-center pt-1 pb-2">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 140 140">
                  <circle
                    cx="70"
                    cy="70"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-[#E2E6DF] dark:text-[#1B332B]"
                  />
                  <circle
                    cx="70"
                    cy="70"
                    r={radius}
                    stroke={
                      score < 12
                        ? '#16A36A'
                        : score < 28
                        ? '#D97706'
                        : '#DC2626'
                    }
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-700 ease-out"
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-extrabold tabular-nums font-mono tracking-tight text-[#102A24] dark:text-[#EAEFEA]">
                    {score.toFixed(1)}%
                  </span>
                  <span className="text-[10px] font-semibold text-[#66736C] dark:text-[#8A9890] uppercase mt-0.5">
                    Contamination
                  </span>
                </div>
              </div>

              {/* Purity vs Contamination Ratio Bar */}
              <div className="w-full mt-3 text-xs space-y-1">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-[#16A36A] font-semibold">Target Purity: {result.purityIndex.toFixed(1)}%</span>
                  <span className="text-[#66736C] dark:text-[#8A9890]">Non-Target: {score.toFixed(1)}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#E2E6DF] dark:bg-[#1B332B] overflow-hidden flex">
                  <div style={{ width: `${result.purityIndex}%` }} className="bg-[#16A36A]" />
                  <div style={{ width: `${score}%` }} className="bg-red-500" />
                </div>
              </div>

              {/* Explanatory note */}
              <p className="text-[11px] text-[#66736C] dark:text-[#8A9890] mt-3 text-center leading-relaxed">
                Scores represent image-based visual surface contamination estimates calculated against stream tolerance thresholds.
              </p>
            </div>

            {/* Suitability Classification */}
            <div className="p-3.5 rounded-lg bg-[#F7F8F5] dark:bg-[#15342C] border border-[#E2E6DF] dark:border-[#1B332B] space-y-2">
              <div className="flex items-center gap-2">
                {isAccepted ? (
                  <CheckCircle2 className="w-4 h-4 text-[#16A36A] shrink-0" />
                ) : isSorting ? (
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                )}
                <span className="text-xs font-bold text-[#102A24] dark:text-[#EAEFEA]">
                  Suitability: {result.streamSuitability.replace(/_/g, ' ')}
                </span>
              </div>
              <p className="text-xs text-[#66736C] dark:text-[#8A9890] leading-relaxed">
                {result.suitabilityReason}
              </p>
            </div>

            {/* Inspected Image Thumbnail (if available) */}
            {result.imageUrl && (
              <div className="space-y-1.5 pt-1 border-t border-[#E2E6DF] dark:border-[#1B332B]">
                <span className="text-[11px] font-semibold text-[#66736C] dark:text-[#8A9890] block">
                  Inspected Photograph:
                </span>
                <div className="rounded-lg overflow-hidden border border-[#E2E6DF] dark:border-[#1B332B] aspect-[16/10] bg-black">
                  <img
                    src={result.imageUrl}
                    alt={`Inspected batch ${result.batchName}`}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Material Composition Breakdown */}
          <div className="p-5 rounded-xl bg-white dark:bg-[#10221D] border border-[#E2E6DF] dark:border-[#1B332B] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#66736C] dark:text-[#8A9890] flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#16A36A]" />
                <span>Material Composition</span>
              </h3>
              <span className="text-[11px] text-[#66736C] dark:text-[#8A9890]">
                {result.materialsDetected.length} Detected
              </span>
            </div>

            <div className="space-y-3">
              {result.materialsDetected.map((m, idx) => (
                <div key={idx} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className={`w-2 h-2 rounded-xs shrink-0 ${m.recyclableInStream ? 'bg-[#16A36A]' : 'bg-red-500'}`} />
                      <span className="font-medium text-[#18251F] dark:text-[#EAEFEA] truncate">{m.name}</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-[11px] shrink-0">
                      <span className="text-[#66736C] dark:text-[#8A9890]">{m.category}</span>
                      <span className="font-bold text-[#102A24] dark:text-[#EAEFEA]">{m.estimatedPercentage}%</span>
                    </div>
                  </div>

                  <div className="w-full h-1.5 rounded-full bg-[#E2E6DF] dark:bg-[#1B332B] overflow-hidden">
                    <div
                      className={`h-full rounded-full ${m.recyclableInStream ? 'bg-[#16A36A]' : 'bg-red-500'}`}
                      style={{ width: `${Math.min(100, m.estimatedPercentage)}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[10px] text-[#66736C] dark:text-[#8A9890]">
                    <span>Confidence: {m.confidence}%</span>
                    <span className={m.recyclableInStream ? 'text-[#16A36A] font-medium' : 'text-red-600 dark:text-red-400 font-medium'}>
                      {m.recyclableInStream ? 'Compatible in Stream' : 'Non-Target Contaminant'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Summary Prose, Contamination Alerts, Action Checklist, Recommendations, Uncertainty Notice */}
        <div className="lg:col-span-7 space-y-6">
          {/* Executive AI Analysis Summary */}
          <div className="p-5 rounded-xl bg-[#F7F8F5] dark:bg-[#10221D] border border-[#E2E6DF] dark:border-[#1B332B] space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#16A36A] dark:text-[#C8F169]">
              Visual Analysis Summary
            </span>
            <p className="text-xs sm:text-sm text-[#18251F] dark:text-[#EAEFEA] leading-relaxed">
              {result.summaryProse}
            </p>
          </div>

          {/* Contamination Alerts */}
          <div className="p-5 rounded-xl bg-white dark:bg-[#10221D] border border-[#E2E6DF] dark:border-[#1B332B] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#66736C] dark:text-[#8A9890] flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                <span>Contamination Alerts &amp; Evidence</span>
              </h3>
              <span className="text-xs font-mono text-[#66736C] dark:text-[#8A9890]">
                {result.contaminationAlerts.length} Flagged
              </span>
            </div>

            {result.contaminationAlerts.length > 0 ? (
              <div className="space-y-3">
                {result.contaminationAlerts.map((alert, idx) => {
                  const isCrit = alert.severity === 'CRITICAL';
                  const isWarn = alert.severity === 'WARNING';

                  return (
                    <div
                      key={idx}
                      className="p-3.5 rounded-lg border border-[#E2E6DF] dark:border-[#1B332B] bg-[#F7F8F5]/60 dark:bg-[#15342C]/30 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-[#18251F] dark:text-[#EAEFEA]">
                          {alert.item}
                        </span>
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                          isCrit
                            ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                            : isWarn
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                        }`}>
                          {alert.severity}
                        </span>
                      </div>

                      <p className="text-[#66736C] dark:text-[#8A9890] leading-relaxed">
                        {alert.description}
                      </p>

                      <div className="p-2.5 rounded bg-white dark:bg-[#10221D] border border-[#E2E6DF] dark:border-[#1B332B] text-[11px] space-y-1">
                        <div>
                          <strong className="text-[#18251F] dark:text-[#EAEFEA]">Visual Evidence: </strong>
                          <span className="text-[#66736C] dark:text-[#8A9890]">{alert.visualEvidence}</span>
                        </div>
                        <div>
                          <strong className="text-[#16A36A]">Corrective Action: </strong>
                          <span className="text-[#18251F] dark:text-[#EAEFEA]">{alert.correctiveAction}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-5 text-center text-xs text-[#16A36A] bg-[#16A36A]/5 rounded-lg border border-[#16A36A]/20">
                <CheckCircle2 className="w-5 h-5 mx-auto mb-1 text-[#16A36A]" />
                Zero contamination alerts flagged. Batch satisfies stream purity threshold.
              </div>
            )}
          </div>

          {/* Corrective-Action Checklist */}
          <div className="p-5 rounded-xl bg-white dark:bg-[#10221D] border border-[#E2E6DF] dark:border-[#1B332B] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#66736C] dark:text-[#8A9890] flex items-center gap-1.5">
                <FileCheck className="w-3.5 h-3.5 text-[#16A36A]" />
                <span>Corrective Action Checklist</span>
              </h3>
              <span className="text-[11px] text-[#66736C] dark:text-[#8A9890]">
                Prioritized Action Steps
              </span>
            </div>

            <div className="space-y-2">
              {checklist.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => toggleChecklistStep(idx)}
                  className={`p-3 rounded-lg border transition-colors cursor-pointer flex items-start gap-3 ${
                    item.completed
                      ? 'bg-[#16A36A]/5 border-[#16A36A]/30 text-[#66736C]'
                      : 'bg-[#F7F8F5] dark:bg-[#15342C] border-[#E2E6DF] dark:border-[#1B332B] hover:border-[#16A36A]'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={!!item.completed}
                    onChange={() => {}} // handled by parent container click
                    className="mt-0.5 rounded text-[#16A36A] focus:ring-[#16A36A] cursor-pointer"
                  />
                  <div className="flex-1 text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`font-semibold ${item.completed ? 'line-through text-[#66736C]' : 'text-[#18251F] dark:text-[#EAEFEA]'}`}>
                        Step {item.step}: {item.title}
                      </span>
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                        item.priority === 'HIGH'
                          ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}>
                        {item.priority}
                      </span>
                    </div>
                    <p className="text-[#66736C] dark:text-[#8A9890] mt-0.5 text-[11px] leading-relaxed">
                      {item.description}
                    </p>
                    {item.estimatedDivertRate && (
                      <div className="mt-1 text-[10px] text-[#16A36A] font-medium">
                        Expected Divert Yield Impact: {item.estimatedDivertRate}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Batch Recommendations */}
          {result.batchRecommendations && result.batchRecommendations.length > 0 && (
            <div className="p-5 rounded-xl bg-white dark:bg-[#10221D] border border-[#E2E6DF] dark:border-[#1B332B] shadow-xs space-y-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#66736C] dark:text-[#8A9890]">
                Segregation &amp; Handling Recommendations
              </h3>
              <ul className="space-y-1.5 text-xs text-[#66736C] dark:text-[#8A9890]">
                {result.batchRecommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <ChevronRight className="w-3.5 h-3.5 text-[#16A36A] shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Mandatory Uncertainty & Limitations Notice */}
          <div className="p-4 rounded-xl bg-[#F7F8F5] dark:bg-[#10221D] border border-[#E2E6DF] dark:border-[#1B332B] flex items-start gap-3 text-xs">
            <Info className="w-4 h-4 text-[#66736C] dark:text-[#8A9890] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="text-[11px] font-semibold text-[#18251F] dark:text-[#EAEFEA] uppercase tracking-wide block">
                Uncertainty &amp; Operating Limitations
              </strong>
              <p className="text-[11px] text-[#66736C] dark:text-[#8A9890] leading-relaxed">
                Results are image-based estimates. Hidden chemical or microbial contamination cannot be verified from an RGB image. Follow local municipal and recycler guidelines.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
