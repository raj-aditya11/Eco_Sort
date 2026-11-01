import React, { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  ShieldCheck,
  TrendingDown,
  RefreshCw,
  ArrowUpRight,
  Eye,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileSpreadsheet,
  ScanLine,
  Info
} from 'lucide-react';
import { AnalysisResult } from '../types/index.ts';

interface DashboardViewProps {
  onNewAnalysis: () => void;
  onViewAnalysis: (analysis: AnalysisResult) => void;
  darkMode?: boolean;
}

const MATERIAL_COLORS: Record<string, string> = {
  'Plastics': '#3B82F6',
  'Paper & Cardboard': '#16A36A',
  'Metals': '#F59E0B',
  'Glass': '#8B5CF6',
  'Organics': '#10B981',
  'Non-Recyclable Contaminant': '#EF4444'
};

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNewAnalysis,
  onViewAnalysis,
  darkMode = true
}) => {
  const [stats, setStats] = useState<any>(null);
  const [recentItems, setRecentItems] = useState<AnalysisResult[]>([]);
  const [allHistory, setAllHistory] = useState<AnalysisResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [statsRes, historyRes, allHistoryRes] = await Promise.all([
        fetch('/api/stats'),
        fetch('/api/history?limit=6'),
        fetch('/api/history?limit=100')
      ]);
      const statsData = await statsRes.json();
      const historyData = await historyRes.json();
      const allData = await allHistoryRes.json();

      setStats(statsData);
      setRecentItems(historyData.items || []);
      setAllHistory(allData.items || []);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const totalBatches = stats?.totalBatches || 0;
  const avgContamination = stats?.avgContaminationScore || 0;
  const avgPurity = stats?.avgPurityIndex || 100;
  const trendData = stats?.trendData || [];
  const categoryData = stats?.categoryDistribution || [];

  // Compute Risk Distribution directly from actual records
  const riskCounts = {
    LOW: 0,
    MODERATE: 0,
    HIGH: 0,
    CRITICAL: 0
  };
  allHistory.forEach((item) => {
    if (riskCounts[item.overallRisk] !== undefined) {
      riskCounts[item.overallRisk]++;
    }
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E2E6DF] dark:border-[#1B332B] pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#66736C] dark:text-[#8A9890] mb-1">
            <span>Workspace</span>
            <span aria-hidden="true">/</span>
            <span>Analytics</span>
            <span aria-hidden="true">/</span>
            <span className="text-[#102A24] dark:text-[#EAEFEA] font-semibold">Inspection Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#102A24] dark:text-[#EAEFEA]">
            Inspection Workspace
          </h1>
          <p className="text-xs sm:text-sm text-[#66736C] dark:text-[#8A9890] mt-0.5">
            Aggregated contamination metrics, material distribution, and audit history from batch evaluations.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchDashboardData}
            disabled={isLoading}
            className="p-2 rounded-lg border border-[#E2E6DF] dark:border-[#1B332B] text-[#66736C] hover:text-[#102A24] dark:hover:text-white bg-white dark:bg-[#10221D] transition-colors cursor-pointer"
            title="Refresh statistics"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={onNewAnalysis}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-[#102A24] dark:bg-[#16A36A] hover:bg-[#16A36A] dark:hover:bg-[#128354] rounded-lg transition-colors shadow-xs active:scale-98 cursor-pointer whitespace-nowrap shrink-0"
          >
            <ScanLine className="w-3.5 h-3.5" />
            <span>New Analysis</span>
          </button>
        </div>
      </div>

      {/* Session notice */}
      <div className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#16A36A]/5 border border-[#16A36A]/15 text-xs text-[#102A24] dark:text-[#EAEFEA]">
        <Info className="w-4 h-4 text-[#16A36A] shrink-0" />
        <span>
          <strong className="font-semibold">Session Scope:</strong> Demonstration data and live uploads are stored in-memory during this active server session.
        </span>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Inspections */}
        <div className="p-5 rounded-xl bg-white dark:bg-[#10221D] border border-[#E2E6DF] dark:border-[#1B332B] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#66736C] dark:text-[#8A9890]">
            <span className="text-xs font-semibold">Total Inspections</span>
            <div className="p-1.5 rounded-md bg-[#F7F8F5] dark:bg-[#15342C]">
              <FileSpreadsheet className="w-4 h-4 text-[#16A36A]" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold tabular-nums text-[#102A24] dark:text-[#EAEFEA]">
              {totalBatches}
            </div>
            <div className="text-[11px] text-[#66736C] dark:text-[#8A9890] mt-1">
              Recorded waste batch evaluations
            </div>
          </div>
        </div>

        {/* Metric 2: Average Contamination */}
        <div className="p-5 rounded-xl bg-white dark:bg-[#10221D] border border-[#E2E6DF] dark:border-[#1B332B] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#66736C] dark:text-[#8A9890]">
            <span className="text-xs font-semibold">Avg Contamination Score</span>
            <div className="p-1.5 rounded-md bg-[#F7F8F5] dark:bg-[#15342C]">
              <TrendingDown className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold tabular-nums text-[#102A24] dark:text-[#EAEFEA]">
              {avgContamination}%
            </div>
            <div className="text-[11px] text-[#66736C] dark:text-[#8A9890] mt-1">
              Visual surface non-target estimate
            </div>
          </div>
        </div>

        {/* Metric 3: Average Purity */}
        <div className="p-5 rounded-xl bg-white dark:bg-[#10221D] border border-[#E2E6DF] dark:border-[#1B332B] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#66736C] dark:text-[#8A9890]">
            <span className="text-xs font-semibold">Avg Purity Index</span>
            <div className="p-1.5 rounded-md bg-[#F7F8F5] dark:bg-[#15342C]">
              <ShieldCheck className="w-4 h-4 text-[#16A36A]" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold tabular-nums text-[#102A24] dark:text-[#EAEFEA]">
              {avgPurity}%
            </div>
            <div className="text-[11px] text-[#66736C] dark:text-[#8A9890] mt-1">
              Calculated target material ratio
            </div>
          </div>
        </div>

        {/* Metric 4: Risk Distribution (Grounded replacement for unverified diversion tons) */}
        <div className="p-5 rounded-xl bg-white dark:bg-[#10221D] border border-[#E2E6DF] dark:border-[#1B332B] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#66736C] dark:text-[#8A9890]">
            <span className="text-xs font-semibold">Risk Distribution</span>
            <div className="p-1.5 rounded-md bg-[#F7F8F5] dark:bg-[#15342C]">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="grid grid-cols-4 gap-1 text-center">
              <div className="p-1 rounded bg-[#16A36A]/10 text-[#16A36A]">
                <div className="text-xs font-bold font-mono">{riskCounts.LOW}</div>
                <div className="text-[9px] font-semibold uppercase">Low</div>
              </div>
              <div className="p-1 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <div className="text-xs font-bold font-mono">{riskCounts.MODERATE}</div>
                <div className="text-[9px] font-semibold uppercase">Mod</div>
              </div>
              <div className="p-1 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <div className="text-xs font-bold font-mono">{riskCounts.HIGH}</div>
                <div className="text-[9px] font-semibold uppercase">High</div>
              </div>
              <div className="p-1 rounded bg-red-500/10 text-red-600 dark:text-red-400">
                <div className="text-xs font-bold font-mono">{riskCounts.CRITICAL}</div>
                <div className="text-[9px] font-semibold uppercase">Crit</div>
              </div>
            </div>
            <div className="text-[11px] text-[#66736C] dark:text-[#8A9890] mt-2">
              Batches grouped by severity tier
            </div>
          </div>
        </div>
      </div>

      {/* Analytical Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Chart: Contamination Rate Trend */}
        <div className="lg:col-span-8 p-5 rounded-xl bg-white dark:bg-[#10221D] border border-[#E2E6DF] dark:border-[#1B332B] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-[#18251F] dark:text-[#EAEFEA]">
                Contamination Severity Trend (%)
              </h3>
              <p className="text-xs text-[#66736C] dark:text-[#8A9890]">
                Sequential waste batches inspected over operational cycles
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#66736C] dark:text-[#8A9890]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#16A36A]" />
              <span>Contamination %</span>
            </div>
          </div>

          <div className="h-60 w-full">
            {trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorContam" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#16A36A" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#16A36A" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.06)"} />
                  <XAxis dataKey="batch" tick={{ fontSize: 11, fill: darkMode ? '#8A9890' : '#66736C' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 60]} tick={{ fontSize: 11, fill: darkMode ? '#8A9890' : '#66736C' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: darkMode ? '#10221D' : '#FFFFFF',
                      border: darkMode ? '1px solid #1B332B' : '1px solid #E2E6DF',
                      borderRadius: '8px',
                      color: darkMode ? '#EAEFEA' : '#18251F',
                      fontSize: '12px'
                    }}
                    formatter={(value: any) => [`${value}%`, 'Contamination']}
                  />
                  <Area type="monotone" dataKey="contaminationScore" stroke="#16A36A" strokeWidth={2} fillOpacity={1} fill="url(#colorContam)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-[#66736C]">
                No batch trend data recorded yet.
              </div>
            )}
          </div>
        </div>

        {/* Right Chart: Aggregated Material Composition */}
        <div className="lg:col-span-4 p-5 rounded-xl bg-white dark:bg-[#10221D] border border-[#E2E6DF] dark:border-[#1B332B] shadow-xs flex flex-col justify-between">
          <div className="mb-3">
            <h3 className="font-bold text-sm text-[#18251F] dark:text-[#EAEFEA]">
              Aggregated Material Mix
            </h3>
            <p className="text-xs text-[#66736C] dark:text-[#8A9890]">
              Category breakdown across all inspected batches
            </p>
          </div>

          <div className="h-44 w-full flex items-center justify-center">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={68}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={MATERIAL_COLORS[entry.name] || '#94A3B8'} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: darkMode ? '#10221D' : '#FFFFFF',
                      border: darkMode ? '1px solid #1B332B' : '1px solid #E2E6DF',
                      borderRadius: '8px',
                      color: darkMode ? '#EAEFEA' : '#18251F',
                      fontSize: '11px'
                    }}
                    formatter={(value: any, name: any) => [`${value}%`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-[#66736C]">No materials recorded.</div>
            )}
          </div>

          {/* Clean Legend */}
          <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] text-[#66736C] dark:text-[#8A9890] border-t border-[#E2E6DF] dark:border-[#1B332B] pt-3">
            {categoryData.slice(0, 4).map((c: any) => (
              <div key={c.name} className="flex items-center gap-1.5 truncate">
                <span className="w-2 h-2 rounded-xs shrink-0" style={{ backgroundColor: MATERIAL_COLORS[c.name] || '#94A3B8' }} />
                <span className="truncate">{c.name}</span>
                <span className="font-mono ml-auto font-medium">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Analysis Table */}
      <div className="rounded-xl bg-white dark:bg-[#10221D] border border-[#E2E6DF] dark:border-[#1B332B] shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#E2E6DF] dark:border-[#1B332B] flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-[#18251F] dark:text-[#EAEFEA]">
              Recent Inspection Records
            </h3>
            <p className="text-xs text-[#66736C] dark:text-[#8A9890]">
              Latest batches evaluated by the visual inspection model
            </p>
          </div>

          <button
            onClick={onNewAnalysis}
            className="text-xs font-semibold text-[#16A36A] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Scan Infeed Batch</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentItems.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#E2E6DF] dark:border-[#1B332B] text-[#66736C] dark:text-[#8A9890] bg-[#F7F8F5]/60 dark:bg-[#0C1613]/60">
                  <th className="py-3 px-4 font-semibold">Batch Identifier</th>
                  <th className="py-3 px-4 font-semibold">Target Stream</th>
                  <th className="py-3 px-4 font-semibold text-right">Contamination</th>
                  <th className="py-3 px-4 font-semibold text-right">Purity Score</th>
                  <th className="py-3 px-4 font-semibold">Suitability</th>
                  <th className="py-3 px-4 font-semibold">Timestamp</th>
                  <th className="py-3 px-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E6DF] dark:divide-[#1B332B]">
                {recentItems.map((item) => {
                  const isAccepted = item.streamSuitability === 'ACCEPTED';
                  const isSorting = item.streamSuitability === 'ACCEPTED_WITH_SORTING';

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-[#F2F4EF] dark:hover:bg-[#15342C] transition-colors"
                    >
                      <td className="py-3 px-4 font-medium text-[#18251F] dark:text-[#EAEFEA]">
                        {item.batchName}
                      </td>
                      <td className="py-3 px-4 text-[#66736C] dark:text-[#8A9890]">
                        {item.wasteStream.replace(/_/g, ' ')}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-semibold tabular-nums text-[#18251F] dark:text-[#EAEFEA]">
                        {item.contaminationScore.toFixed(1)}%
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-semibold tabular-nums text-[#16A36A]">
                        {item.purityIndex.toFixed(1)}%
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1.5 font-medium ${
                          isAccepted
                            ? 'text-[#16A36A]'
                            : isSorting
                            ? 'text-amber-600 dark:text-amber-400'
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          {isAccepted ? (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          ) : isSorting ? (
                            <AlertTriangle className="w-3.5 h-3.5" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5" />
                          )}
                          <span>{item.streamSuitability.replace(/_/g, ' ')}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[#66736C] dark:text-[#8A9890]">
                        {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => onViewAnalysis(item)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-[#102A24] dark:text-[#EAEFEA] bg-[#F7F8F5] dark:bg-[#1B332B] hover:bg-[#16A36A] hover:text-white dark:hover:bg-[#16A36A] rounded transition-colors cursor-pointer"
                        >
                          <Eye className="w-3 h-3" />
                          <span>View Report</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-[#66736C] dark:text-[#8A9890]">
            No batch records available. Click "New Analysis" above to perform an optical inspection.
          </div>
        )}
      </div>
    </div>
  );
};
