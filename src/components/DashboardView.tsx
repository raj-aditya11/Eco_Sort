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
  Sparkles,
  ShieldCheck,
  TrendingDown,
  Scale,
  RefreshCw,
  ArrowUpRight,
  Eye,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileSpreadsheet
} from 'lucide-react';
import { AnalysisResult } from '../types/index.ts';

interface DashboardViewProps {
  onNewAnalysis: () => void;
  onViewAnalysis: (analysis: AnalysisResult) => void;
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
  onViewAnalysis
}) => {
  const [stats, setStats] = useState<any>(null);
  const [recentItems, setRecentItems] = useState<AnalysisResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [statsRes, historyRes] = await Promise.all([
        fetch('/api/stats'),
        fetch('/api/history?limit=6')
      ]);
      const statsData = await statsRes.json();
      const historyData = await historyRes.json();

      setStats(statsData);
      setRecentItems(historyData.items || []);
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
  const divertedTons = stats?.landfillDivertedTons || 0;
  const trendData = stats?.trendData || [];
  const categoryData = stats?.categoryDistribution || [];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E2E6DF] dark:border-[#1C2B25] pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#737D75] dark:text-[#85948A] mb-1">
            <span>Workspace</span>
            <span aria-hidden="true">/</span>
            <span>Recovery Operations</span>
            <span aria-hidden="true">/</span>
            <span className="text-[#18251F] dark:text-[#EAEFEA] font-medium">Facility Audit Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#102A24] dark:text-[#EAEFEA]">
            Waste Stream Telemetry
          </h1>
          <p className="text-xs sm:text-sm text-[#737D75] dark:text-[#85948A] mt-0.5">
            Real-time optical contamination monitoring, stream purity tolerances, and diversion efficiency.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchDashboardData}
            disabled={isLoading}
            className="p-2.5 rounded-lg border border-[#E2E6DF] dark:border-[#1E352F] text-[#737D75] hover:text-[#18251F] dark:hover:text-white bg-white dark:bg-[#102A24] transition-colors cursor-pointer"
            title="Refresh statistics"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={onNewAnalysis}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[#102A24] dark:bg-[#16A36A] hover:bg-[#16A36A] dark:hover:bg-[#128354] rounded-lg transition-all shadow-sm active:scale-95 cursor-pointer whitespace-nowrap shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C8F169]" />
            <span>New Analysis</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-5 rounded-xl bg-white dark:bg-[#102A24] border border-[#E2E6DF] dark:border-[#1E352F] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#737D75] dark:text-[#85948A]">
            <span className="text-xs font-medium">Audited Batches</span>
            <div className="p-2 rounded-lg bg-[#F7F8F5] dark:bg-[#15342C]">
              <FileSpreadsheet className="w-4 h-4 text-[#16A36A]" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold tabular-nums text-[#102A24] dark:text-[#EAEFEA]">
              {totalBatches}
            </div>
            <div className="text-[11px] text-[#737D75] dark:text-[#85948A] mt-1 flex items-center gap-1">
              <span className="text-[#16A36A] font-semibold">100%</span> verified via vision AI
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-xl bg-white dark:bg-[#102A24] border border-[#E2E6DF] dark:border-[#1E352F] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#737D75] dark:text-[#85948A]">
            <span className="text-xs font-medium">Avg Contamination Risk</span>
            <div className="p-2 rounded-lg bg-[#F7F8F5] dark:bg-[#15342C]">
              <TrendingDown className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold tabular-nums text-[#102A24] dark:text-[#EAEFEA]">
              {avgContamination}%
            </div>
            <div className="text-[11px] text-[#737D75] dark:text-[#85948A] mt-1">
              Target facility cap: &lt; 12.0%
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-xl bg-white dark:bg-[#102A24] border border-[#E2E6DF] dark:border-[#1E352F] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#737D75] dark:text-[#85948A]">
            <span className="text-xs font-medium">Stream Purity Index</span>
            <div className="p-2 rounded-lg bg-[#F7F8F5] dark:bg-[#15342C]">
              <ShieldCheck className="w-4 h-4 text-[#16A36A]" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold tabular-nums text-[#102A24] dark:text-[#EAEFEA]">
              {avgPurity}%
            </div>
            <div className="text-[11px] text-[#737D75] dark:text-[#85948A] mt-1">
              ISRI Grade A threshold: &ge; 90%
            </div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-5 rounded-xl bg-white dark:bg-[#102A24] border border-[#E2E6DF] dark:border-[#1E352F] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#737D75] dark:text-[#85948A]">
            <span className="text-xs font-medium">Estimated Landfill Diverted</span>
            <div className="p-2 rounded-lg bg-[#F7F8F5] dark:bg-[#15342C]">
              <Scale className="w-4 h-4 text-[#C8F169] bg-[#102A24] rounded p-0.5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold tabular-nums text-[#102A24] dark:text-[#EAEFEA]">
              {divertedTons} <span className="text-base font-normal text-[#737D75] dark:text-[#85948A]">tons</span>
            </div>
            <div className="text-[11px] text-[#737D75] dark:text-[#85948A] mt-1">
              Avoided tipping fees &amp; CO₂ credits
            </div>
          </div>
        </div>
      </div>

      {/* Analytical Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Chart: Contamination Rate Trend */}
        <div className="lg:col-span-8 p-5 sm:p-6 rounded-xl bg-white dark:bg-[#102A24] border border-[#E2E6DF] dark:border-[#1E352F] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-[#18251F] dark:text-[#EAEFEA]">
                Contamination Severity Trend (%)
              </h3>
              <p className="text-xs text-[#737D75] dark:text-[#85948A]">
                Sequential waste batches inspected over operational cycles
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs text-[#737D75] dark:text-[#85948A]">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#16A36A]" /> Contamination %
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            {trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorContam" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#16A36A" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#16A36A" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(115, 125, 117, 0.15)" />
                  <XAxis dataKey="batch" tick={{ fontSize: 11, fill: '#737D75' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 50]} tick={{ fontSize: 11, fill: '#737D75' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#102A24',
                      border: '1px solid #16A36A',
                      borderRadius: '8px',
                      color: '#EAEFEA',
                      fontSize: '12px'
                    }}
                    formatter={(value: any) => [`${value}%`, 'Contamination']}
                  />
                  <Area type="monotone" dataKey="contaminationScore" stroke="#16A36A" strokeWidth={2.5} fillOpacity={1} fill="url(#colorContam)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-[#737D75]">
                No batch trend data recorded yet.
              </div>
            )}
          </div>
        </div>

        {/* Right Chart: Material Composition Breakdown */}
        <div className="lg:col-span-4 p-5 sm:p-6 rounded-xl bg-white dark:bg-[#102A24] border border-[#E2E6DF] dark:border-[#1E352F] shadow-sm flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="font-bold text-sm text-[#18251F] dark:text-[#EAEFEA]">
              Aggregated Material Mix
            </h3>
            <p className="text-xs text-[#737D75] dark:text-[#85948A]">
              Commodity distribution across all analyzed batches
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
                      backgroundColor: '#102A24',
                      border: '1px solid #1E352F',
                      borderRadius: '8px',
                      color: '#EAEFEA',
                      fontSize: '11px'
                    }}
                    formatter={(value: any, name: any) => [`${value}%`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-[#737D75]">No materials recorded.</div>
            )}
          </div>

          {/* Clean Legend */}
          <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-[#737D75] dark:text-[#85948A] border-t border-[#E2E6DF] dark:border-[#1E352F] pt-3">
            {categoryData.slice(0, 4).map((c: any) => (
              <div key={c.name} className="flex items-center gap-1.5 truncate">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: MATERIAL_COLORS[c.name] || '#94A3B8' }} />
                <span className="truncate">{c.name}</span>
                <span className="font-mono ml-auto font-medium">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Analysis Table */}
      <div className="rounded-xl bg-white dark:bg-[#102A24] border border-[#E2E6DF] dark:border-[#1E352F] shadow-sm overflow-hidden">
        <div className="p-5 border-b border-[#E2E6DF] dark:border-[#1E352F] flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-[#18251F] dark:text-[#EAEFEA]">
              Recent Audit Telemetry
            </h3>
            <p className="text-xs text-[#737D75] dark:text-[#85948A]">
              Latest batches classified by computer vision models
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
                <tr className="border-b border-[#E2E6DF] dark:border-[#1C2B25] text-[#737D75] dark:text-[#85948A] bg-[#F7F8F5]/60 dark:bg-[#0D1614]/60">
                  <th className="py-3 px-4 font-semibold">Batch Identifier</th>
                  <th className="py-3 px-4 font-semibold">Target Stream</th>
                  <th className="py-3 px-4 font-semibold text-right">Contamination</th>
                  <th className="py-3 px-4 font-semibold text-right">Purity Score</th>
                  <th className="py-3 px-4 font-semibold">Suitability</th>
                  <th className="py-3 px-4 font-semibold">Timestamp</th>
                  <th className="py-3 px-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E6DF] dark:divide-[#1C2B25]">
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
                      <td className="py-3 px-4 text-[#737D75] dark:text-[#85948A]">
                        {item.wasteStream.replace('_', ' ')}
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
                      <td className="py-3 px-4 text-[#737D75] dark:text-[#85948A]">
                        {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => onViewAnalysis(item)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-[#102A24] dark:text-[#EAEFEA] bg-[#F7F8F5] dark:bg-[#1E352F] hover:bg-[#16A36A] hover:text-white dark:hover:bg-[#16A36A] rounded transition-colors cursor-pointer"
                        >
                          <Eye className="w-3 h-3" />
                          <span>View Detail</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-[#737D75] dark:text-[#85948A]">
            No batch records available. Click "New Analysis" above to perform your first optical inspection.
          </div>
        )}
      </div>
    </div>
  );
};
