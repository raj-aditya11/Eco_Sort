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

  const score = result.contaminationScore;
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const isAccepted = result.streamSuitability === 'ACCEPTED';
  const isSorting = result.streamSuitability === 'ACCEPTED_WITH_SORTING';

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 space-y-6">
      {/* Top Breadcrumb & Action Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#DCDDD4] dark:border-[#2B312B] pb-5 no-print">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-[#777B73] dark:text-[#9DA399]">
            <button
              onClick={onBackToDashboard}
              className="hover:text-[#252923] dark:hover:text-[#E6E8E3] flex items-center gap-1 cursor-pointer font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Overview
            </button>
            <span aria-hidden="true">/</span>
            <span className="font-mono text-[11px]">{result.id}</span>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#252923] dark:text-[#E6E8E3]">
              {result.batchName}
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#F5F4EE] dark:bg-[#151815] border border-[#DCDDD4] dark:border-[#2B312B] text-[#777B73] dark:text-[#9DA399]">
              {result.wasteStream.replace(/_/g, ' ')}
            </span>
          </div>
          <p className="text-xs text-[#777B73] dark:text-[#9DA399]">
            Inspected {new Date(result.createdAt).toLocaleString()} {result.facilityLine ? `· ${result.facilityLine}` : ''}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 no-print">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#252923] dark:text-[#E6E8E3] bg-[#FFFFFF] dark:bg-[#1C201C] border border-[#DCDDD4] dark:border-[#2B312B] hover:bg-[#F5F4EE] dark:hover:bg-[#22332A] rounded transition-colors cursor-pointer"
            title="Print a clean physical or PDF report"
          >
            <Printer className="w-3.5 h-3.5 text-[#777B73]" />
            <span>Print Report</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#252923] dark:text-[#E6E8E3] bg-[#FFFFFF] dark:bg-[#1C201C] border border-[#DCDDD4] dark:border-[#2B312B] hover:bg-[#F5F4EE] dark:hover:bg-[#22332A] rounded transition-colors cursor-pointer"
            title="Download full analysis payload as JSON"
          >
            <Download className="w-3.5 h-3.5 text-[#777B73]" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={onNewAnalysis}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#245B45] hover:bg-[#1D4B39] dark:bg-[#3A7D63] dark:hover:bg-[#2F6852] rounded transition-colors shadow-xs active:scale-98 cursor-pointer whitespace-nowrap shrink-0"
          >
            <ScanLine className="w-3.5 h-3.5" />
            <span>Analyze Another Batch</span>
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Summary, Score Gauge & Material Composition */}
        <div className="lg:col-span-5 space-y-5">
          {/* Inspection Summary Card */}
          <div className="p-5 rounded-lg bg-[#FFFFFF] dark:bg-[#1C201C] border border-[#DCDDD4] dark:border-[#2B312B] space-y-4">
            <div className="flex items-center justify-between border-b border-[#DCDDD4] dark:border-[#2B312B] pb-3">
              <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-[#777B73] dark:text-[#9DA399]">
                Inspection Assessment
              </h2>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                result.overallRisk === 'LOW'
                  ? 'bg-[#DDE8DE] text-[#245B45] dark:bg-[#22332A] dark:text-[#3A7D63]'
                  : result.overallRisk === 'MODERATE'
                  ? 'bg-blue-50 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                  : result.overallRisk === 'HIGH'
                  ? 'bg-amber-50 text-[#B77928] dark:bg-amber-950/60 dark:text-amber-300'
                  : 'bg-[#FBF0EE] text-[#A63F37] dark:bg-[#2B1B1A] dark:text-[#E68A82]'
              }`}>
                {result.overallRisk} RISK
              </span>
            </div>

            {/* Circular Contamination Score Gauge */}
            <div className="flex flex-col items-center justify-center pt-1 pb-1">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 140 140">
                  <circle
                    cx="70"
                    cy="70"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-[#DCDDD4] dark:text-[#2B312B]"
                  />
                  <circle
                    cx="70"
                    cy="70"
                    r={radius}
                    stroke={
                      score < 12
                        ? '#245B45'
                        : score < 28
                        ? '#B77928'
                        : '#A63F37'
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
                  <span className="text-2xl font-extrabold tabular-nums font-mono tracking-tight text-[#252923] dark:text-[#E6E8E3]">
                    {score.toFixed(1)}%
                  </span>
                  <span className="text-[10px] font-semibold text-[#777B73] dark:text-[#9DA399] uppercase mt-0.5">
                    Contamination
                  </span>
                </div>
              </div>

              {/* Purity vs Contamination Ratio Bar */}
              <div className="w-full mt-3 text-xs space-y-1">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-[#245B45] dark:text-[#3A7D63] font-semibold">Purity Index: {result.purityIndex.toFixed(1)}%</span>
                  <span className="text-[#777B73] dark:text-[#9DA399]">Non-Target: {score.toFixed(1)}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#DCDDD4] dark:bg-[#2B312B] overflow-hidden flex">
                  <div style={{ width: `${result.purityIndex}%` }} className="bg-[#245B45] dark:bg-[#3A7D63]" />
                  <div style={{ width: `${score}%` }} className="bg-[#A63F37]" />
                </div>
              </div>

              {/* Explanatory note */}
              <p className="text-[11px] text-[#777B73] dark:text-[#9DA399] mt-2.5 text-center leading-relaxed">
                Visual non-target contamination estimate calibrated to stream tolerance thresholds.
              </p>
            </div>

            {/* Suitability Classification */}
            <div className="p-3.5 rounded bg-[#F5F4EE] dark:bg-[#151815] border border-[#DCDDD4] dark:border-[#2B312B] space-y-1.5">
              <div className="flex items-center gap-2">
                {isAccepted ? (
                  <CheckCircle2 className="w-4 h-4 text-[#245B45] dark:text-[#3A7D63] shrink-0" />
                ) : isSorting ? (
                  <AlertTriangle className="w-4 h-4 text-[#B77928] shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-[#A63F37] shrink-0" />
                )}
                <span className="text-xs font-bold text-[#252923] dark:text-[#E6E8E3]">
                  Suitability: {result.streamSuitability.replace(/_/g, ' ')}
                </span>
              </div>
              <p className="text-xs text-[#777B73] dark:text-[#9DA399] leading-relaxed">
                {result.suitabilityReason}
              </p>
            </div>

            {/* Inspected Image Thumbnail */}
            {result.imageUrl && (
              <div className="space-y-1.5 pt-1 border-t border-[#DCDDD4] dark:border-[#2B312B]">
                <span className="text-[11px] font-semibold text-[#777B73] dark:text-[#9DA399] block">
                  Inspected Photograph:
                </span>
                <div className="rounded overflow-hidden border border-[#DCDDD4] dark:border-[#2B312B] aspect-[16/10] bg-[#151815]">
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
          <div className="p-5 rounded-lg bg-[#FFFFFF] dark:bg-[#1C201C] border border-[#DCDDD4] dark:border-[#2B312B] space-y-4">
            <div className="flex items-center justify-between border-b border-[#DCDDD4] dark:border-[#2B312B] pb-2.5">
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#777B73] dark:text-[#9DA399] flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#245B45] dark:text-[#3A7D63]" />
                <span>Material Composition</span>
              </h3>
              <span className="text-[11px] text-[#777B73] dark:text-[#9DA399] font-mono">
                {result.materialsDetected.length} Detected
              </span>
            </div>

            <div className="space-y-3">
              {result.materialsDetected.map((m, idx) => (
                <div key={idx} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className={`w-2 h-2 rounded-xs shrink-0 ${m.recyclableInStream ? 'bg-[#245B45] dark:bg-[#3A7D63]' : 'bg-[#A63F37]'}`} />
                      <span className="font-semibold text-[#252923] dark:text-[#E6E8E3] truncate">{m.name}</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-[11px] shrink-0">
                      <span className="text-[#777B73] dark:text-[#9DA399]">{m.category}</span>
                      <span className="font-bold text-[#252923] dark:text-[#E6E8E3]">{m.estimatedPercentage}%</span>
                    </div>
                  </div>

                  <div className="w-full h-1.5 rounded-full bg-[#DCDDD4] dark:bg-[#2B312B] overflow-hidden">
                    <div
                      className={`h-full rounded-full ${m.recyclableInStream ? 'bg-[#245B45] dark:bg-[#3A7D63]' : 'bg-[#A63F37]'}`}
                      style={{ width: `${Math.min(100, m.estimatedPercentage)}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[10px] text-[#777B73] dark:text-[#9DA399]">
                    <span>Confidence: {m.confidence}%</span>
                    <span className={m.recyclableInStream ? 'text-[#245B45] dark:text-[#3A7D63] font-medium' : 'text-[#A63F37] font-medium'}>
                      {m.recyclableInStream ? 'Compatible in Stream' : 'Non-Target Contaminant'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Summary Prose, Contamination Alerts, Action Checklist, Recommendations, Uncertainty Notice */}
        <div className="lg:col-span-7 space-y-5">
          {/* Executive AI Analysis Summary */}
          <div className="p-4 rounded-lg bg-[#FFFFFF] dark:bg-[#1C201C] border border-[#DCDDD4] dark:border-[#2B312B] space-y-1.5">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#245B45] dark:text-[#3A7D63]">
              01 // Visual Analysis Summary
            </span>
            <p className="text-xs sm:text-sm text-[#252923] dark:text-[#E6E8E3] leading-relaxed">
              {result.summaryProse}
            </p>
          </div>

          {/* Contamination Alerts */}
          <div className="p-5 rounded-lg bg-[#FFFFFF] dark:bg-[#1C201C] border border-[#DCDDD4] dark:border-[#2B312B] space-y-4">
            <div className="flex items-center justify-between border-b border-[#DCDDD4] dark:border-[#2B312B] pb-2.5">
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#777B73] dark:text-[#9DA399] flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-[#B77928]" />
                <span>02 // Contamination Alerts &amp; Evidence</span>
              </h3>
              <span className="text-xs font-mono text-[#777B73] dark:text-[#9DA399]">
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
                      className="p-3.5 rounded border border-[#DCDDD4] dark:border-[#2B312B] bg-[#F5F4EE]/60 dark:bg-[#151815]/60 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-[#252923] dark:text-[#E6E8E3]">
                          {alert.item}
                        </span>
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                          isCrit
                            ? 'bg-[#FBF0EE] text-[#A63F37] dark:bg-[#2B1B1A] dark:text-[#E68A82]'
                            : isWarn
                            ? 'bg-amber-50 text-[#B77928] dark:bg-amber-950/60 dark:text-amber-300'
                            : 'bg-blue-50 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                        }`}>
                          {alert.severity}
                        </span>
                      </div>

                      <p className="text-[#777B73] dark:text-[#9DA399] leading-relaxed">
                        {alert.description}
                      </p>

                      <div className="p-2.5 rounded bg-[#FFFFFF] dark:bg-[#1C201C] border border-[#DCDDD4] dark:border-[#2B312B] text-[11px] space-y-1">
                        <div>
                          <strong className="text-[#252923] dark:text-[#E6E8E3]">Visual Evidence: </strong>
                          <span className="text-[#777B73] dark:text-[#9DA399]">{alert.visualEvidence}</span>
                        </div>
                        <div>
                          <strong className="text-[#245B45] dark:text-[#3A7D63]">Corrective Action: </strong>
                          <span className="text-[#252923] dark:text-[#E6E8E3]">{alert.correctiveAction}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 text-center text-xs text-[#245B45] dark:text-[#3A7D63] bg-[#DDE8DE]/40 dark:bg-[#22332A]/40 rounded border border-[#245B45]/20">
                <CheckCircle2 className="w-5 h-5 mx-auto mb-1 text-[#245B45] dark:text-[#3A7D63]" />
                Zero contamination alerts flagged. Batch satisfies stream purity threshold.
              </div>
            )}
          </div>

          {/* Corrective-Action Checklist */}
          <div className="p-5 rounded-lg bg-[#FFFFFF] dark:bg-[#1C201C] border border-[#DCDDD4] dark:border-[#2B312B] space-y-4">
            <div className="flex items-center justify-between border-b border-[#DCDDD4] dark:border-[#2B312B] pb-2.5">
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#777B73] dark:text-[#9DA399] flex items-center gap-1.5">
                <FileCheck className="w-3.5 h-3.5 text-[#245B45] dark:text-[#3A7D63]" />
                <span>03 // Corrective Action Checklist</span>
              </h3>
              <span className="text-[11px] text-[#777B73] dark:text-[#9DA399]">
                Operator Directives
              </span>
            </div>

            <div className="space-y-2">
              {checklist.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => toggleChecklistStep(idx)}
                  className={`p-3 rounded border transition-colors cursor-pointer flex items-start gap-3 ${
                    item.completed
                      ? 'bg-[#DDE8DE]/30 dark:bg-[#22332A]/30 border-[#245B45]/30 text-[#777B73]'
                      : 'bg-[#F5F4EE] dark:bg-[#151815] border-[#DCDDD4] dark:border-[#2B312B] hover:border-[#245B45]'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={!!item.completed}
                    onChange={() => {}}
                    className="mt-0.5 rounded text-[#245B45] focus:ring-[#245B45] cursor-pointer"
                  />
                  <div className="flex-1 text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`font-semibold ${item.completed ? 'line-through text-[#777B73]' : 'text-[#252923] dark:text-[#E6E8E3]'}`}>
                        Step {item.step}: {item.title}
                      </span>
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                        item.priority === 'HIGH'
                          ? 'bg-[#FBF0EE] text-[#A63F37] dark:bg-[#2B1B1A] dark:text-[#E68A82]'
                          : 'bg-[#F5F4EE] text-[#777B73] dark:bg-[#151815] dark:text-[#9DA399]'
                      }`}>
                        {item.priority}
                      </span>
                    </div>
                    <p className="text-[#777B73] dark:text-[#9DA399] mt-0.5 text-[11px] leading-relaxed">
                      {item.description}
                    </p>
                    {item.estimatedDivertRate && (
                      <div className="mt-1 text-[10px] text-[#245B45] dark:text-[#3A7D63] font-medium font-mono">
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
            <div className="p-4 rounded-lg bg-[#FFFFFF] dark:bg-[#1C201C] border border-[#DCDDD4] dark:border-[#2B312B] space-y-2.5">
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#777B73] dark:text-[#9DA399]">
                04 // Segregation &amp; Handling Directives
              </h3>
              <ul className="space-y-1.5 text-xs text-[#777B73] dark:text-[#9DA399]">
                {result.batchRecommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <ChevronRight className="w-3.5 h-3.5 text-[#245B45] dark:text-[#3A7D63] shrink-0 mt-0.5" />
                    <span className="leading-relaxed text-[#252923] dark:text-[#E6E8E3]">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Mandatory Uncertainty & Limitations Notice */}
          <div className="p-3.5 rounded-lg bg-[#F5F4EE] dark:bg-[#1C201C] border border-[#DCDDD4] dark:border-[#2B312B] flex items-start gap-2.5 text-xs">
            <Info className="w-4 h-4 text-[#777B73] dark:text-[#9DA399] shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <strong className="text-[11px] font-semibold text-[#252923] dark:text-[#E6E8E3] uppercase tracking-wide block">
                Uncertainty &amp; Operating Limitations
              </strong>
              <p className="text-[11px] text-[#777B73] dark:text-[#9DA399] leading-relaxed">
                Results are image-based estimates. Hidden chemical or microbial contamination cannot be verified from an RGB image. Follow local municipal and recycler guidelines.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
