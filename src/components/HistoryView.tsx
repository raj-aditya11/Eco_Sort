import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  Eye,
  Trash2,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileSpreadsheet,
  X,
  Info,
  ScanLine
} from 'lucide-react';
import { AnalysisResult, WasteStreamType, ContaminationRiskLevel } from '../types/index.ts';

interface HistoryViewProps {
  onViewAnalysis: (analysis: AnalysisResult) => void;
  onNewAnalysis: () => void;
  onShowToast: (title: string, message?: string, type?: 'success' | 'info') => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  onViewAnalysis,
  onNewAnalysis,
  onShowToast
}) => {
  const [items, setItems] = useState<AnalysisResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [streamFilter, setStreamFilter] = useState<string>('ALL');
  const [riskFilter, setRiskFilter] = useState<string>('ALL');

  // Sorting
  const [sortField, setSortField] = useState<'createdAt' | 'batchName' | 'contaminationScore' | 'purityIndex'>('createdAt');
  const [sortAsc, setSortAsc] = useState(false);

  // Deletion modal state
  const [itemToDelete, setItemToDelete] = useState<AnalysisResult | null>(null);

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.append('q', searchQuery.trim());
      if (streamFilter !== 'ALL') params.append('stream', streamFilter);
      if (riskFilter !== 'ALL') params.append('risk', riskFilter);

      const res = await fetch(`/api/history?${params.toString()}`);
      const data = await res.json();
      setItems(data.items || []);
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [searchQuery, streamFilter, riskFilter]);

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      const res = await fetch(`/api/history/${itemToDelete.id}`, { method: 'DELETE' });
      if (res.ok) {
        setItems(prev => prev.filter(i => i.id !== itemToDelete.id));
        onShowToast('Batch Record Deleted', `Audit ${itemToDelete.batchName} removed.`, 'info');
      }
    } catch (err) {
      console.error('Failed to delete item:', err);
    } finally {
      setItemToDelete(null);
    }
  };

  // Client sort
  const sortedItems = [...items].sort((a, b) => {
    let aVal: any = a[sortField];
    let bVal: any = b[sortField];
    if (sortField === 'createdAt') {
      aVal = new Date(aVal).getTime();
      bVal = new Date(bVal).getTime();
    }
    if (aVal < bVal) return sortAsc ? -1 : 1;
    if (aVal > bVal) return sortAsc ? 1 : -1;
    return 0;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E2E6DF] dark:border-[#1B332B] pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#66736C] dark:text-[#8A9890] mb-1">
            <span>Register</span>
            <span aria-hidden="true">/</span>
            <span className="text-[#102A24] dark:text-[#EAEFEA] font-semibold">Inspection Records</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#102A24] dark:text-[#EAEFEA]">
            Inspection History
          </h1>
          <p className="text-xs sm:text-sm text-[#66736C] dark:text-[#8A9890] mt-0.5">
            Search, filter, and review historical visual assessments and contamination scores.
          </p>
        </div>

        <button
          onClick={onNewAnalysis}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-[#102A24] dark:bg-[#16A36A] hover:bg-[#16A36A] dark:hover:bg-[#128354] rounded-lg transition-colors shadow-xs active:scale-98 cursor-pointer whitespace-nowrap shrink-0 self-start sm:self-auto"
        >
          <ScanLine className="w-3.5 h-3.5" />
          <span>New Inspection</span>
        </button>
      </div>

      {/* In-memory storage disclaimer */}
      <div className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#F7F8F5] dark:bg-[#10221D] border border-[#E2E6DF] dark:border-[#1B332B] text-xs text-[#66736C] dark:text-[#8A9890]">
        <Info className="w-4 h-4 text-[#16A36A] shrink-0" />
        <span>
          <strong className="font-semibold text-[#18251F] dark:text-[#EAEFEA]">In-Memory Register:</strong> Records are stored in server memory for the duration of the current session.
        </span>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="p-3.5 rounded-xl bg-white dark:bg-[#10221D] border border-[#E2E6DF] dark:border-[#1B332B] shadow-xs flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#66736C]" />
          <input
            type="text"
            placeholder="Search by batch name, notes, or station..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-xs bg-[#F7F8F5] dark:bg-[#15342C] border border-[#E2E6DF] dark:border-[#1B332B] rounded-lg text-[#18251F] dark:text-[#EAEFEA] focus:outline-none focus:ring-1 focus:ring-[#16A36A]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#66736C] hover:text-[#18251F] cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Stream Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-[#66736C] shrink-0" />
          <select
            value={streamFilter}
            onChange={(e) => setStreamFilter(e.target.value)}
            className="text-xs p-2 bg-[#F7F8F5] dark:bg-[#15342C] border border-[#E2E6DF] dark:border-[#1B332B] rounded-lg text-[#18251F] dark:text-[#EAEFEA] focus:outline-none"
          >
            <option value="ALL">All Waste Streams</option>
            <option value="SINGLE_STREAM">Single-Stream</option>
            <option value="COMMERCIAL_OCC">Commercial OCC</option>
            <option value="RIGID_PLASTICS">Rigid Plastics</option>
            <option value="MIXED_POLYMERS">Mixed Polymers</option>
            <option value="METALS">Metals</option>
            <option value="ORGANICS">Organics</option>
          </select>
        </div>

        {/* Risk Filter */}
        <div className="flex items-center gap-2">
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="text-xs p-2 bg-[#F7F8F5] dark:bg-[#15342C] border border-[#E2E6DF] dark:border-[#1B332B] rounded-lg text-[#18251F] dark:text-[#EAEFEA] focus:outline-none"
          >
            <option value="ALL">All Risk Tiers</option>
            <option value="LOW">Low Risk</option>
            <option value="MODERATE">Moderate Risk</option>
            <option value="HIGH">High Risk</option>
            <option value="CRITICAL">Critical Risk</option>
          </select>
        </div>

        {/* Refresh */}
        <button
          onClick={fetchHistory}
          disabled={isLoading}
          className="p-2 text-xs rounded-lg border border-[#E2E6DF] dark:border-[#1B332B] text-[#66736C] hover:text-[#18251F] dark:hover:text-white transition-colors cursor-pointer self-end md:self-auto"
          title="Refresh table"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Desktop Data Table */}
      <div className="rounded-xl bg-white dark:bg-[#10221D] border border-[#E2E6DF] dark:border-[#1B332B] shadow-xs overflow-hidden hidden md:block">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#E2E6DF] dark:border-[#1B332B] text-[#66736C] dark:text-[#8A9890] bg-[#F7F8F5]/60 dark:bg-[#0C1613]/60">
              <th
                onClick={() => toggleSort('batchName')}
                className="py-3.5 px-4 font-semibold cursor-pointer hover:text-[#102A24] dark:hover:text-[#EAEFEA]"
              >
                <div className="flex items-center gap-1.5">
                  <span>Batch Identifier</span>
                  <ArrowUpDown className="w-3 h-3 text-[#66736C]" />
                </div>
              </th>
              <th className="py-3.5 px-4 font-semibold">Stream</th>
              <th
                onClick={() => toggleSort('contaminationScore')}
                className="py-3.5 px-4 font-semibold text-right cursor-pointer hover:text-[#102A24] dark:hover:text-[#EAEFEA]"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Contamination</span>
                  <ArrowUpDown className="w-3 h-3 text-[#66736C]" />
                </div>
              </th>
              <th
                onClick={() => toggleSort('purityIndex')}
                className="py-3.5 px-4 font-semibold text-right cursor-pointer hover:text-[#102A24] dark:hover:text-[#EAEFEA]"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Purity Index</span>
                  <ArrowUpDown className="w-3 h-3 text-[#66736C]" />
                </div>
              </th>
              <th className="py-3.5 px-4 font-semibold">Risk Tier</th>
              <th className="py-3.5 px-4 font-semibold">Suitability</th>
              <th
                onClick={() => toggleSort('createdAt')}
                className="py-3.5 px-4 font-semibold cursor-pointer hover:text-[#102A24] dark:hover:text-[#EAEFEA]"
              >
                <div className="flex items-center gap-1.5">
                  <span>Date &amp; Time</span>
                  <ArrowUpDown className="w-3 h-3 text-[#66736C]" />
                </div>
              </th>
              <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E6DF] dark:divide-[#1B332B]">
            {isLoading ? (
              [1, 2, 3, 4].map((n) => (
                <tr key={n} className="animate-pulse">
                  <td className="py-4 px-4"><div className="h-4 bg-[#E2E6DF] dark:bg-[#1B332B] rounded w-32" /></td>
                  <td className="py-4 px-4"><div className="h-4 bg-[#E2E6DF] dark:bg-[#1B332B] rounded w-20" /></td>
                  <td className="py-4 px-4 text-right"><div className="h-4 bg-[#E2E6DF] dark:bg-[#1B332B] rounded w-12 ml-auto" /></td>
                  <td className="py-4 px-4 text-right"><div className="h-4 bg-[#E2E6DF] dark:bg-[#1B332B] rounded w-12 ml-auto" /></td>
                  <td className="py-4 px-4"><div className="h-4 bg-[#E2E6DF] dark:bg-[#1B332B] rounded w-16" /></td>
                  <td className="py-4 px-4"><div className="h-4 bg-[#E2E6DF] dark:bg-[#1B332B] rounded w-24" /></td>
                  <td className="py-4 px-4"><div className="h-4 bg-[#E2E6DF] dark:bg-[#1B332B] rounded w-28" /></td>
                  <td className="py-4 px-4 text-right"><div className="h-4 bg-[#E2E6DF] dark:bg-[#1B332B] rounded w-16 ml-auto" /></td>
                </tr>
              ))
            ) : sortedItems.length > 0 ? (
              sortedItems.map((item) => {
                const isAccepted = item.streamSuitability === 'ACCEPTED';
                const isSorting = item.streamSuitability === 'ACCEPTED_WITH_SORTING';

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-[#F2F4EF] dark:hover:bg-[#15342C] transition-colors"
                  >
                    <td className="py-3.5 px-4 font-medium text-[#18251F] dark:text-[#EAEFEA]">
                      <div className="font-semibold">{item.batchName}</div>
                      <div className="text-[10px] text-[#66736C] dark:text-[#8A9890]">{item.facilityLine || 'Line 01'}</div>
                    </td>
                    <td className="py-3.5 px-4 text-[#66736C] dark:text-[#8A9890]">
                      {item.wasteStream.replace(/_/g, ' ')}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-semibold tabular-nums text-[#18251F] dark:text-[#EAEFEA]">
                      {item.contaminationScore.toFixed(1)}%
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-semibold tabular-nums text-[#16A36A]">
                      {item.purityIndex.toFixed(1)}%
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        item.overallRisk === 'LOW'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : item.overallRisk === 'MODERATE'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                          : item.overallRisk === 'HIGH'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                      }`}>
                        {item.overallRisk}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 font-medium ${
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
                    <td className="py-3.5 px-4 text-[#66736C] dark:text-[#8A9890]">
                      {new Date(item.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1">
                      <button
                        onClick={() => onViewAnalysis(item)}
                        className="p-1.5 rounded hover:bg-[#E2E6DF] dark:hover:bg-[#1B332B] text-[#18251F] dark:text-[#EAEFEA] transition-colors cursor-pointer"
                        title="View Full Report"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setItemToDelete(item)}
                        className="p-1.5 rounded hover:bg-red-50 text-red-600 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                        title="Delete Batch Record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={8} className="p-8 text-center text-xs text-[#66736C] dark:text-[#8A9890]">
                  No historical audits matching search and filter parameters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Responsive Cards */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {isLoading ? (
          <div className="p-4 text-xs text-[#66736C] text-center">Loading audit history...</div>
        ) : sortedItems.length > 0 ? (
          sortedItems.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl bg-white dark:bg-[#10221D] border border-[#E2E6DF] dark:border-[#1B332B] space-y-2.5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-xs text-[#18251F] dark:text-[#EAEFEA]">{item.batchName}</h4>
                  <p className="text-[11px] text-[#66736C] dark:text-[#8A9890]">{item.wasteStream.replace(/_/g, ' ')}</p>
                </div>
                <span className="font-mono text-xs font-bold text-[#16A36A]">{item.purityIndex.toFixed(1)}% Purity</span>
              </div>

              <div className="flex items-center justify-between text-xs text-[#66736C] dark:text-[#8A9890] border-t border-[#E2E6DF] dark:border-[#1B332B] pt-2">
                <span>{item.streamSuitability.replace(/_/g, ' ')}</span>
                <span className="font-mono text-[11px]">
                  {new Date(item.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  onClick={() => onViewAnalysis(item)}
                  className="px-3 py-1.5 text-xs font-semibold bg-[#16A36A] text-white rounded-md flex items-center gap-1"
                >
                  <Eye className="w-3 h-3" /> View Report
                </button>
                <button
                  onClick={() => setItemToDelete(item)}
                  className="px-2 py-1.5 text-xs text-red-600 rounded-md hover:bg-red-50 dark:hover:bg-red-950/40"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-xs text-[#66736C]">
            No records found.
          </div>
        )}
      </div>

      {/* Confirmation Dialog for Deletion */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-xl bg-white dark:bg-[#10221D] p-5 border border-[#E2E6DF] dark:border-[#1B332B] shadow-lg space-y-3">
            <h3 className="font-bold text-sm text-[#18251F] dark:text-[#EAEFEA]">
              Delete Inspection Record?
            </h3>
            <p className="text-xs text-[#66736C] dark:text-[#8A9890] leading-relaxed">
              Are you sure you want to remove <strong className="text-[#18251F] dark:text-[#EAEFEA]">{itemToDelete.batchName}</strong> from this session's history?
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setItemToDelete(null)}
                className="px-3 py-1.5 text-xs font-medium text-[#66736C] hover:text-[#18251F] dark:hover:text-[#EAEFEA] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
