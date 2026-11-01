import React, { useState, useEffect } from 'react';
import { Navbar, NavViewType } from './components/Navbar.tsx';
import { DashboardView } from './components/DashboardView.tsx';
import { AnalyzeView } from './components/AnalyzeView.tsx';
import { ResultsView } from './components/ResultsView.tsx';
import { HistoryView } from './components/HistoryView.tsx';
import { MethodologyView } from './components/MethodologyView.tsx';
import { ToastContainer, ToastMessage } from './components/Toast.tsx';
import { AnalysisResult } from './types/index.ts';

export type AppViewType = 'overview' | 'analyze' | 'history' | 'methodology' | 'results';

export default function App() {
  // Default to overview (the Inspection Overview workspace) directly
  const [currentView, setCurrentView] = useState<AppViewType>('overview');
  const [activeAnalysis, setActiveAnalysis] = useState<AnalysisResult | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Dark mode with localStorage persistence
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ecosort_theme');
      if (saved !== null) {
        return saved === 'dark';
      }
    }
    return false; // Default to clean, warm light mode first as requested
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
      document.body.classList.add('dark');
      document.body.setAttribute('data-theme', 'dark');
      localStorage.setItem('ecosort_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
      document.body.classList.remove('dark');
      document.body.setAttribute('data-theme', 'light');
      localStorage.setItem('ecosort_theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  const showToast = (title: string, message?: string, type: 'success' | 'warning' | 'error' | 'info' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastMessage = { id, title, message, type };
    setToasts(prev => [...prev, newToast]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Analysis completion handler
  const handleAnalysisComplete = (result: AnalysisResult) => {
    console.log('[EcoSort Frontend] Inspection results loaded', {
      id: result.id,
      batch: result.batchName,
      risk: result.overallRisk,
      score: result.contaminationScore
    });
    setActiveAnalysis(result);
    setCurrentView('results');
    showToast(
      'Inspection Complete',
      `Batch ${result.batchName}: ${result.contaminationScore.toFixed(1)}% contamination (${result.streamSuitability.replace(/_/g, ' ')}).`,
      result.overallRisk === 'CRITICAL' ? 'warning' : 'success'
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F4EE] dark:bg-[#151815] text-[#252923] dark:text-[#E6E8E3] transition-colors">
      <Navbar
        currentView={currentView === 'results' ? 'analyze' : currentView}
        onNavigate={(view: NavViewType) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      <main className="flex-1 w-full">
        {currentView === 'overview' && (
          <DashboardView
            onNewAnalysis={() => {
              setCurrentView('analyze');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onViewAnalysis={(analysis) => {
              setActiveAnalysis(analysis);
              setCurrentView('results');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            darkMode={darkMode}
          />
        )}

        {currentView === 'analyze' && (
          <AnalyzeView
            onAnalysisComplete={handleAnalysisComplete}
          />
        )}

        {currentView === 'results' && activeAnalysis && (
          <ResultsView
            result={activeAnalysis}
            onNewAnalysis={() => {
              setCurrentView('analyze');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onBackToDashboard={() => {
              setCurrentView('overview');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onShowToast={showToast}
          />
        )}

        {currentView === 'history' && (
          <HistoryView
            onViewAnalysis={(analysis) => {
              setActiveAnalysis(analysis);
              setCurrentView('results');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNewAnalysis={() => {
              setCurrentView('analyze');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onShowToast={showToast}
          />
        )}

        {currentView === 'methodology' && (
          <MethodologyView />
        )}
      </main>

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
