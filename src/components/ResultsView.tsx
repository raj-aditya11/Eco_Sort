import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  Download,
  Printer,
  Sparkles,
  ArrowLeft,
  Layers,
  ChevronRight,
  HelpCircle,
  FileCheck
} from 'lucide-react';
import { AnalysisResult, ActionChecklistItem } from '../types/index.ts';

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
    onShowToast('Operational Step Updated', 'Checklist status synchronized in local audit session.', 'info');
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(result, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${result.batchName || 'ecosort-audit'}-report.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    onShowToast('Audit Report Exported', 'JSON payload downloaded successfully.', 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  // Circular gauge math
  const score = result.contaminationScore;
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const isAccepted = result.streamSuitability === 'ACCEPTED';
  const isSorting = result.streamSuitability === 'ACCEPTED_WITH_SORTING';

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Breadcrumb & Action Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E2E6DF] dark:border-[#1C2B25] pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-[#737D75] dark:text-[#85948A]">
            <button
              onClick={onBackToDashboard}
              className="hover:text-[#18251F] dark:hover:text-[#EAEFEA] flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Workspace
            </button>
            <span aria-hidden="true">/</span>
            <span className="font-mono">{result.id}</span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#102A24] dark:text-[#EAEFEA]">
              {result.batchName}
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#F7F8F5] dark:bg-[#15342C] border border-[#E2E6DF] dark:border-[#1E352F] text-[#737D75] dark:text-[#85948A]">
              {result.wasteStream.replace('_', ' ')}
            </span>
          </div>
          <p className="text-xs text-[#737D75] dark:text-[#85948A]">
            Audited {new Date(result.createdAt).toLocaleString()} · {result.facilityLine || 'Line 01 Inspection'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#18251F] dark:text-[#EAEFEA] bg-white dark:bg-[#102A24] border border-[#E2E6DF] dark:border-[#1E352F] hover:bg-[#F2F4EF] dark:hover:bg-[#15342C] rounded-lg transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-[#737D75]" />
            <span>Print Report</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#18251F] dark:text-[#EAEFEA] bg-white dark:bg-[#102A24] border border-[#E2E6DF] dark:border-[#1E352F] hover:bg-[#F2F4EF] dark:hover:bg-[#15342C] rounded-lg transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#737D75]" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={onNewAnalysis}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#102A24] dark:bg-[#16A36A] hover:bg-[#16A36A] dark:hover:bg-[#128354] rounded-lg transition-all shadow-sm active:scale-95 cursor-pointer whitespace-nowrap shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C8F169]" />
            <span>Analyze Another Batch</span>
          </button>
        </div>
      </div>

      {/* Main Two-Column Analytical Centerpiece */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Gauge, Suitability & Material Breakdown */}
        <div className="lg:col-span-5 space-y-6">
          {/* Contamination Risk Gauge Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#102A24] border border-[#E2E6DF] dark:border-[#1E352F] shadow-sm flex flex-col items-center text-center space-y-4">
            <div className="w-full flex items-center justify-between text-xs text-[#737D75] dark:text-[#85948A]">
              <span className="font-semibold text-[#18251F] dark:text-[#EAEFEA]">Contamination Severity</span>
              <span className="flex items-center gap-1 font-mono text-[11px]" title="AI vision optical confidence score">
                <HelpCircle className="w-3 h-3 text-[#737D75]" /> Optical Model
              </span>
            </div>

            {/* Circular Gauge */}
            <div className="relative w-44 h-44 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                {/* Background Ring */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="10"
                  fill="transparent"
                  className="text-[#E2E6DF] dark:text-[#1E352F]"
                />
                {/* Progress Ring */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke={
                    score < 12
                      ? '#16A36A'
                      : score < 28
                      ? '#D97706'
                      : '#DC2626'
                  }
                  strokeWidth="10"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold tabular-nums font-mono tracking-tight text-[#102A24] dark:text-[#EAEFEA]">
                  {score.toFixed(1)}%
                </span>
                <span className="text-[11px] font-semibold text-[#737D75] dark:text-[#85948A] uppercase tracking-wider mt-0.5">
                  {result.overallRisk} Risk
                </span>
              </div>
            </div>

            {/* Purity vs Contamination Ratio Bar */}
            <div className="w-full pt-2 border-t border-[#E2E6DF] dark:border-[#1E352F] text-xs">
              <div className="flex justify-between items-center mb-1 text-[11px]">
                <span className="text-[#16A36A] font-semibold">Purity {result.purityIndex.toFixed(1)}%</span>
                <span className="text-[#737D75] dark:text-[#85948A]">Contaminants {score.toFixed(1)}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#E2E6DF] dark:bg-[#1E352F] overflow-hidden flex">
                <div style={{ width: `${result.purityIndex}%` }} className="bg-[#16A36A]" />
                <div style={{ width: `${score}%` }} className="bg-red-500" />
              </div>
            </div>
          </div>

          {/* Stream Suitability Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#102A24] border border-[#E2E6DF] dark:border-[#1E352F] shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              {isAccepted ? (
                <div className="w-7 h-7 rounded-lg bg-[#16A36A]/15 text-[#16A36A] flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              ) : isSorting ? (
                <div className="w-7 h-7 rounded-lg bg-amber-500/15 text-amber-600 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
              ) : (
                <div className="w-7 h-7 rounded-lg bg-red-500/15 text-red-600 flex items-center justify-center">
                  <XCircle className="w-4 h-4" />
                </div>
              )}
              <h3 className="font-bold text-sm text-[#18251F] dark:text-[#EAEFEA]">
                Batch Classification Outcome
              </h3>
            </div>

            <div className="text-sm font-bold tracking-tight text-[#102A24] dark:text-[#EAEFEA]">
              {result.streamSuitability.replace(/_/g, ' ')}
            </div>

            <p className="text-xs text-[#737D75] dark:text-[#85948A] leading-relaxed">
              {result.suitabilityReason}
            </p>
          </div>

          {/* Detected Material Breakdown */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#102A24] border border-[#E2E6DF] dark:border-[#1E352F] shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-[#18251F] dark:text-[#EAEFEA] flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#16A36A]" />
                <span>Detected Material Spectrum</span>
              </h3>
              <span className="text-[11px] text-[#737D75] dark:text-[#85948A]">
                {result.materialsDetected.length} Categories
              </span>
            </div>

            <div className="space-y-3">
              {result.materialsDetected.map((m, idx) => (
                <div key={idx} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${m.recyclableInStream ? 'bg-[#16A36A]' : 'bg-red-500'}`} />
                      <span className="font-medium text-[#18251F] dark:text-[#EAEFEA] truncate">{m.name}</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-[11px] shrink-0">
                      <span className="text-[#737D75] dark:text-[#85948A]">{m.category}</span>
                      <span className="font-bold text-[#18251F] dark:text-[#EAEFEA]">{m.estimatedPercentage}%</span>
                    </div>
                  </div>

                  <div className="w-full h-1.5 rounded-full bg-[#E2E6DF] dark:bg-[#1E352F] overflow-hidden">
                    <div
                      className={`h-full rounded-full ${m.recyclableInStream ? 'bg-[#16A36A]' : 'bg-red-500'}`}
                      style={{ width: `${Math.min(100, m.estimatedPercentage)}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[10px] text-[#737D75] dark:text-[#85948A]">
                    <span>Confidence: {m.confidence}%</span>
                    <span>{m.recyclableInStream ? 'Accepted Target' : 'Contaminant Reject'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Contamination Alerts, Operator Checklist & Batch Recommendations */}
        <div className="lg:col-span-7 space-y-6">
          {/* Executive Summary Card */}
          <div className="p-5 rounded-2xl bg-[#F7F8F5] dark:bg-[#15342C] border border-[#E2E6DF] dark:border-[#1E352F] space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#16A36A]">
              Optical Analysis Summary
            </span>
            <p className="text-xs sm:text-sm text-[#18251F] dark:text-[#EAEFEA] leading-relaxed">
              {result.summaryProse}
            </p>
          </div>

          {/* Contamination Alerts */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#102A24] border border-[#E2E6DF] dark:border-[#1E352F] shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-[#18251F] dark:text-[#EAEFEA] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Contamination Alerts &amp; Evidence</span>
              </h3>
              <span className="text-xs font-mono text-[#737D75] dark:text-[#85948A]">
                {result.contaminationAlerts.length} Flagged Item{result.contaminationAlerts.length === 1 ? '' : 's'}
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
                      className="p-4 rounded-xl border border-[#E2E6DF] dark:border-[#1E352F] bg-[#F7F8F5]/60 dark:bg-[#15342C]/40 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm text-[#18251F] dark:text-[#EAEFEA]">
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

                      <p className="text-[#737D75] dark:text-[#85948A] leading-relaxed">
                        {alert.description}
                      </p>

                      <div className="p-2.5 rounded bg-white dark:bg-[#102A24] border border-[#E2E6DF] dark:border-[#1E352F] text-[11px] space-y-1">
                        <div>
                          <span className="font-semibold text-[#18251F] dark:text-[#EAEFEA]">Visual Signature: </span>
                          <span className="text-[#737D75] dark:text-[#85948A]">{alert.visualEvidence}</span>
                        </div>
                        <div>
                          <span className="font-semibold text-[#16A36A]">Corrective Protocol: </span>
                          <span className="text-[#18251F] dark:text-[#EAEFEA]">{alert.correctiveAction}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-[#16A36A] bg-[#16A36A]/5 rounded-xl border border-[#16A36A]/20">
                <CheckCircle2 className="w-5 h-5 mx-auto mb-1 text-[#16A36A]" />
                Zero critical contamination alerts flagged. Batch satisfies strict pure commodity threshold.
              </div>
            )}
          </div>

          {/* Operator Action Checklist */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#102A24] border border-[#E2E6DF] dark:border-[#1E352F] shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-[#18251F] dark:text-[#EAEFEA] flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-[#16A36A]" />
                <span>Prioritized Mitigation Checklist</span>
              </h3>
              <span className="text-[11px] text-[#737D75] dark:text-[#85948A]">
                Interactive Field Protocol
              </span>
            </div>

            <div className="space-y-2.5">
              {checklist.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => toggleChecklistStep(idx)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                    item.completed
                      ? 'bg-[#16A36A]/5 border-[#16A36A]/30 text-[#737D75]'
                      : 'bg-[#F7F8F5] dark:bg-[#15342C] border-[#E2E6DF] dark:border-[#1E352F] hover:border-[#16A36A]'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={!!item.completed}
                    onChange={() => {}} // handled by parent onClick
                    className="mt-0.5 rounded text-[#16A36A] focus:ring-[#16A36A] cursor-pointer"
                  />
                  <div className="flex-1 text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`font-semibold ${item.completed ? 'line-through text-[#737D75]' : 'text-[#18251F] dark:text-[#EAEFEA]'}`}>
                        Step {item.step}: {item.title}
                      </span>
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                        item.priority === 'HIGH' ? 'bg-red-100 text-red-700 dark:bg-red-950' : 'bg-slate-100 text-slate-700 dark:bg-slate-800'
                      }`}>
                        {item.priority}
                      </span>
                    </div>
                    <p className="text-[#737D75] dark:text-[#85948A] mt-0.5 text-[11px] leading-relaxed">
                      {item.description}
                    </p>
                    <div className="mt-1 text-[10px] text-[#16A36A] font-medium">
                      Estimated Divert Gain: {item.estimatedDivertRate}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Batch Recommendations */}
          {result.batchRecommendations && result.batchRecommendations.length > 0 && (
            <div className="p-6 rounded-2xl bg-white dark:bg-[#102A24] border border-[#E2E6DF] dark:border-[#1E352F] shadow-sm space-y-3">
              <h3 className="font-bold text-sm text-[#18251F] dark:text-[#EAEFEA]">
                Supervisor Directives &amp; Facility Guidance
              </h3>
              <ul className="space-y-2 text-xs text-[#737D75] dark:text-[#85948A]">
                {result.batchRecommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <ChevronRight className="w-3.5 h-3.5 text-[#16A36A] shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
