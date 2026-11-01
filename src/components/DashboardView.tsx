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
  Eye,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileSpreadsheet,
  ScanLine,
  Info,
  ArrowRight,
  Layers
} from 'lucide-react';
import { AnalysisResult } from '../types/index.ts';

interface DashboardViewProps {
  onNewAnalysis: () => void;
  onViewAnalysis: (analysis: AnalysisResult) => void;
  darkMode?: boolean;
}

const MATERIAL_COLORS: Record<string, string> = {
  'Plastics': '#3B82F6',
  'Paper & Cardboard': '#245B45',
  'Metals': '#B77928',
  'Glass': '#6D7280',
  'Organics': '#4A7C59',
  'Non-Recyclable Contaminant': '#A63F37'
};

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNewAnalysis,
  onViewAnalysis,
  darkMode = false
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
        fetch('/api/history?limit=8'),
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

  // Compute Risk Distribution
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

  const highRiskTotal = riskCounts.HIGH + riskCounts.CRITICAL;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 space-y-6">
      {/* Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#DCDDD4] dark:border-[#2B312B] pb-5">
        <div>
          <div className="flex items-center gap-2 font-mono text-[11px] text-[#777B73] dark:text-[#9DA399] uppercase tracking-wider mb-1">
            <span>FACILITY // LINE 01</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#245B45] dark:text-[#3A7D63] font-semibold">STATION ONLINE</span>
            <span aria-hidden="true">·</span>
            <span>ACTIVE SESSION</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#252923] dark:text-[#E6E8E3]">
            Inspection Overview
          </h1>
          <p className="text-xs sm:text-sm text-[#777B73] dark:text-[#9DA399] mt-0.5 max-w-2xl">
            Material-quality control, stream contamination monitoring, and automated optical audit logs.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchDashboardData}
            disabled={isLoading}
            className="p-2 rounded-md border border-[#DCDDD4] dark:border-[#2B312B] text-[#777B73] hover:text-[#252923] dark:hover:text-[#E6E8E3] bg-[#FFFFFF] dark:bg-[#1C201C] transition-colors cursor-pointer"
            title="Refresh inspection data"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={onNewAnalysis}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-[#245B45] hover:bg-[#1D4B39] dark:bg-[#3A7D63] dark:hover:bg-[#2F6852] rounded-md transition-colors shadow-xs active:scale-98 cursor-pointer whitespace-nowrap shrink-0"
          >
            <ScanLine className="w-3.5 h-3.5" />
            <span>New Waste Analysis</span>
          </button>
        </div>
      </div>

      {/* Session scope notice */}
      <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-md bg-[#FFFFFF] dark:bg-[#1C201C] border border-[#DCDDD4] dark:border-[#2B312B] text-xs text-[#777B73] dark:text-[#9DA399]">
        <Info className="w-4 h-4 text-[#245B45] dark:text-[#3A7D63] shrink-0" />
        <span>
          <strong className="font-semibold text-[#252923] dark:text-[#E6E8E3]">Session Scope:</strong> Batch audits and live photographic evaluations are held in volatile memory during the current operational session.
        </span>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Inspections */}
        <div className="p-4 rounded-lg bg-[#FFFFFF] dark:bg-[#1C201C] border border-[#DCDDD4] dark:border-[#2B312B] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#777B73] dark:text-[#9DA399]">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Inspections</span>
            <FileSpreadsheet className="w-4 h-4 text-[#245B45] dark:text-[#3A7D63]" />
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold tabular-nums font-mono text-[#252923] dark:text-[#E6E8E3]">
              {totalBatches}
            </div>
            <div className="text-[11px] text-[#777B73] dark:text-[#9DA399] mt-0.5">
              Audited waste batches recorded
            </div>
          </div>
        </div>

        {/* Metric 2: Average Contamination */}
        <div className="p-4 rounded-lg bg-[#FFFFFF] dark:bg-[#1C201C] border border-[#DCDDD4] dark:border-[#2B312B] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#777B73] dark:text-[#9DA399]">
            <span className="text-xs font-semibold uppercase tracking-wider">Avg Contamination</span>
            <TrendingDown className="w-4 h-4 text-[#245B45] dark:text-[#3A7D63]" />
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold tabular-nums font-mono text-[#252923] dark:text-[#E6E8E3]">
              {avgContamination}%
            </div>
            <div className="text-[11px] text-[#777B73] dark:text-[#9DA399] mt-0.5">
              Standard tolerance ceiling: 10.0%
            </div>
          </div>
        </div>

        {/* Metric 3: Average Purity */}
        <div className="p-4 rounded-lg bg-[#FFFFFF] dark:bg-[#1C201C] border border-[#DCDDD4] dark:border-[#2B312B] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#777B73] dark:text-[#9DA399]">
            <span className="text-xs font-semibold uppercase tracking-wider">Avg Purity Index</span>
            <ShieldCheck className="w-4 h-4 text-[#245B45] dark:text-[#3A7D63]" />
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold tabular-nums font-mono text-[#245B45] dark:text-[#3A7D63]">
              {avgPurity}%
            </div>
            <div className="text-[11px] text-[#777B73] dark:text-[#9DA399] mt-0.5">
              Compliant target material ratio
            </div>
          </div>
        </div>

        {/* Metric 4: High-Risk Batches */}
        <div className="p-4 rounded-lg bg-[#FFFFFF] dark:bg-[#1C201C] border border-[#DCDDD4] dark:border-[#2B312B] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#777B73] dark:text-[#9DA399]">
            <span className="text-xs font-semibold uppercase tracking-wider">Attention Required</span>
            <AlertTriangle className="w-4 h-4 text-[#B77928]" />
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold tabular-nums font-mono text-[#A63F37]">
              {highRiskTotal} <span className="text-xs font-sans font-normal text-[#777B73]">batches</span>
            </div>
            <div className="text-[11px] text-[#777B73] dark:text-[#9DA399] mt-0.5">
              High / Critical severity tiers flagged
            </div>
          </div>
        </div>
      </div>

      {/* Analytical Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Chart: Contamination Severity Trend */}
        <div className="lg:col-span-8 p-5 rounded-lg bg-[#FFFFFF] dark:bg-[#1C201C] border border-[#DCDDD4] dark:border-[#2B312B] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4 border-b border-[#DCDDD4] dark:border-[#2B312B] pb-3">
            <div>
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#252923] dark:text-[#E6E8E3]">
                Contamination Severity Trend (%)
              </h3>
              <p className="text-[11px] text-[#777B73] dark:text-[#9DA399]">
                Sequential waste batches inspected over operational cycles
              </p>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-[#777B73] dark:text-[#9DA399] font-mono">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#245B45] dark:bg-[#3A7D63]" />
              <span>Contamination %</span>
            </div>
          </div>

          <div className="h-60 w-full">
            {trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorContam" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={darkMode ? "#3A7D63" : "#245B45"} stopOpacity={0.2} />
                      <stop offset="95%" stopColor={darkMode ? "#3A7D63" : "#245B45"} stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="2 2" vertical={false} stroke={darkMode ? "#2B312B" : "#E5E6DE"} />
                  <XAxis dataKey="batch" tick={{ fontSize: 10, fill: darkMode ? '#9DA399' : '#777B73' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 60]} tick={{ fontSize: 10, fill: darkMode ? '#9DA399' : '#777B73' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: darkMode ? '#1C201C' : '#FFFFFF',
                      border: darkMode ? '1px solid #2B312B' : '1px solid #DCDDD4',
                      borderRadius: '4px',
                      color: darkMode ? '#E6E8E3' : '#252923',
                      fontSize: '11px',
                      boxShadow: 'none'
                    }}
                    formatter={(value: any) => [`${value}%`, 'Contamination']}
                  />
                  <Area
                    type="monotone"
                    dataKey="contaminationScore"
                    stroke={darkMode ? "#3A7D63" : "#245B45"}
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorContam)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-[#777B73]">
                No batch trend data recorded yet.
              </div>
            )}
          </div>
        </div>

        {/* Right Chart: Aggregated Material Composition */}
        <div className="lg:col-span-4 p-5 rounded-lg bg-[#FFFFFF] dark:bg-[#1C201C] border border-[#DCDDD4] dark:border-[#2B312B] flex flex-col justify-between">
          <div className="mb-2 border-b border-[#DCDDD4] dark:border-[#2B312B] pb-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#252923] dark:text-[#E6E8E3]">
              Aggregated Material Mix
            </h3>
            <p className="text-[11px] text-[#777B73] dark:text-[#9DA399]">
              Commodity breakdown across inspected batches
            </p>
          </div>

          <div className="h-40 w-full flex items-center justify-center">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={42}
                    outerRadius={65}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {categoryData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={MATERIAL_COLORS[entry.name] || '#777B73'} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: darkMode ? '#1C201C' : '#FFFFFF',
                      border: darkMode ? '1px solid #2B312B' : '1px solid #DCDDD4',
                      borderRadius: '4px',
                      color: darkMode ? '#E6E8E3' : '#252923',
                      fontSize: '11px',
                      boxShadow: 'none'
                    }}
                    formatter={(value: any, name: any) => [`${value}%`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-[#777B73]">No materials recorded.</div>
            )}
          </div>

          {/* Clean Legend */}
          <div className="mt-2 grid grid-cols-2 gap-1.5 text-[11px] text-[#777B73] dark:text-[#9DA399] border-t border-[#DCDDD4] dark:border-[#2B312B] pt-3">
            {categoryData.slice(0, 4).map((c: any) => (
              <div key={c.name} className="flex items-center gap-1.5 truncate">
                <span className="w-2 h-2 rounded-xs shrink-0" style={{ backgroundColor: MATERIAL_COLORS[c.name] || '#777B73' }} />
                <span className="truncate">{c.name}</span>
                <span className="font-mono ml-auto font-medium tabular-nums">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Analysis Table */}
      <div className="rounded-lg bg-[#FFFFFF] dark:bg-[#1C201C] border border-[#DCDDD4] dark:border-[#2B312B] overflow-hidden">
        <div className="p-4 border-b border-[#DCDDD4] dark:border-[#2B312B] flex items-center justify-between">
          <div>
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#252923] dark:text-[#E6E8E3]">
              Recent Inspection Records
            </h3>
            <p className="text-[11px] text-[#777B73] dark:text-[#9DA399]">
              Latest batches evaluated against commodity standards
            </p>
          </div>

          <button
            onClick={onNewAnalysis}
            className="text-xs font-semibold text-[#245B45] dark:text-[#3A7D63] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Scan Infeed Batch</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {recentItems.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#DCDDD4] dark:border-[#2B312B] text-[#777B73] dark:text-[#9DA399] bg-[#F5F4EE]/70 dark:bg-[#151815]/70">
                  <th className="py-2.5 px-4 font-semibold uppercase text-[10px] tracking-wider">Batch Identifier</th>
                  <th className="py-2.5 px-4 font-semibold uppercase text-[10px] tracking-wider">Target Stream</th>
                  <th className="py-2.5 px-4 font-semibold uppercase text-[10px] tracking-wider text-right">Contamination</th>
                  <th className="py-2.5 px-4 font-semibold uppercase text-[10px] tracking-wider text-right">Purity</th>
                  <th className="py-2.5 px-4 font-semibold uppercase text-[10px] tracking-wider">Suitability</th>
                  <th className="py-2.5 px-4 font-semibold uppercase text-[10px] tracking-wider">Timestamp</th>
                  <th className="py-2.5 px-4 font-semibold uppercase text-[10px] tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DCDDD4] dark:divide-[#2B312B]">
                {recentItems.map((item) => {
                  const isAccepted = item.streamSuitability === 'ACCEPTED';
                  const isSorting = item.streamSuitability === 'ACCEPTED_WITH_SORTING';

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-[#F5F4EE]/60 dark:hover:bg-[#22332A]/50 transition-colors"
                    >
                      <td className="py-2.5 px-4 font-medium text-[#252923] dark:text-[#E6E8E3]">
                        {item.batchName}
                      </td>
                      <td className="py-2.5 px-4 text-[#777B73] dark:text-[#9DA399]">
                        {item.wasteStream.replace(/_/g, ' ')}
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono font-semibold tabular-nums text-[#252923] dark:text-[#E6E8E3]">
                        {item.contaminationScore.toFixed(1)}%
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono font-semibold tabular-nums text-[#245B45] dark:text-[#3A7D63]">
                        {item.purityIndex.toFixed(1)}%
                      </td>
                      <td className="py-2.5 px-4">
                        <span className={`inline-flex items-center gap-1.5 font-medium text-[11px] ${
                          isAccepted
                            ? 'text-[#245B45] dark:text-[#3A7D63]'
                            : isSorting
                            ? 'text-[#B77928]'
                            : 'text-[#A63F37]'
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
                      <td className="py-2.5 px-4 text-[#777B73] dark:text-[#9DA399] font-mono text-[11px]">
                        {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        <button
                          onClick={() => onViewAnalysis(item)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-[#252923] dark:text-[#E6E8E3] bg-[#F5F4EE] dark:bg-[#22332A] hover:bg-[#245B45] hover:text-white dark:hover:bg-[#3A7D63] rounded border border-[#DCDDD4] dark:border-[#2B312B] transition-colors cursor-pointer"
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
          <div className="p-8 text-center text-xs text-[#777B73] dark:text-[#9DA399]">
            No batch records available. Click "New Waste Analysis" above to perform an inspection.
          </div>
        )}
      </div>
    </div>
  );
};
