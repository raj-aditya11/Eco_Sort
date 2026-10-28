import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { LandingHero } from './components/LandingHero.tsx';
import { DashboardView } from './components/DashboardView.tsx';
import { AnalyzeView } from './components/AnalyzeView.tsx';
import { ResultsView } from './components/ResultsView.tsx';
import { HistoryView } from './components/HistoryView.tsx';
import { MethodologyView } from './components/MethodologyView.tsx';
import { ToastContainer, ToastMessage } from './components/Toast.tsx';
import { AnalysisResult } from './types/index.ts';

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard' | 'analyze' | 'history' | 'methodology' | 'results'>('landing');
  const [activeAnalysis, setActiveAnalysis] = useState<AnalysisResult | null>(null);
  const [preselectedSampleId, setPreselectedSampleId] = useState<string | undefined>(undefined);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Dark mode with localStorage persistence
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ecosort_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('ecosort_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
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
    console.log('[EcoSort Frontend] Results displayed successfully', {
      id: result.id,
      batch: result.batchName,
      risk: result.overallRisk,
      score: result.contaminationScore
    });
    setActiveAnalysis(result);
    setCurrentView('results');
    showToast(
      'Optical Inspection Complete',
      `Batch ${result.batchName} analyzed with ${result.contaminationScore.toFixed(1)}% contamination.`,
      result.overallRisk === 'CRITICAL' ? 'warning' : 'success'
    );
  };

  // Sample batch inspection trigger
  const handleOpenSample = (sampleId: string) => {
    setPreselectedSampleId(sampleId);
    setCurrentView('analyze');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F8F5] dark:bg-[#0D1614] text-[#18251F] dark:text-[#EAEFEA] transition-colors">
      <Navbar
        currentView={currentView === 'results' ? 'analyze' : currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      <main className="flex-1 w-full">
        {currentView === 'landing' && (
          <LandingHero
            onAnalyzeClick={() => {
              setCurrentView('analyze');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onExploreClick={() => {
              const el = document.getElementById('workflow');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            onOpenSample={handleOpenSample}
          />
        )}

        {currentView === 'dashboard' && (
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
          />
        )}

        {currentView === 'analyze' && (
          <AnalyzeView
            onAnalysisComplete={handleAnalysisComplete}
            preselectedSampleId={preselectedSampleId}
            onClearSample={() => setPreselectedSampleId(undefined)}
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
              setCurrentView('dashboard');
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
