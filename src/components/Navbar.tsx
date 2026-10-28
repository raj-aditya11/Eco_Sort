import React from 'react';
import { Sparkles, Moon, Sun } from 'lucide-react';

interface NavbarProps {
  currentView: 'landing' | 'dashboard' | 'analyze' | 'history' | 'methodology';
  onNavigate: (view: 'landing' | 'dashboard' | 'analyze' | 'history' | 'methodology') => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  darkMode,
  onToggleDarkMode
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#F7F8F5]/90 dark:bg-[#0D1614]/90 backdrop-blur-md border-b border-[#E2E6DF] dark:border-[#1C2B25] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark (single text element) */}
        <button
          onClick={() => onNavigate('landing')}
          className="text-lg font-bold tracking-tight text-[#102A24] dark:text-[#EAEFEA] hover:opacity-90 transition-opacity whitespace-nowrap shrink-0 text-left cursor-pointer"
        >
          EcoSort AI
        </button>

        {/* Zone 2: 4-5 concise single-line nav links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          <button
            onClick={() => onNavigate('landing')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 ${
              currentView === 'landing'
                ? 'text-[#16A36A] font-semibold border-b-2 border-[#16A36A]'
                : 'text-[#737D75] dark:text-[#85948A] hover:text-[#18251F] dark:hover:text-[#EAEFEA]'
            }`}
          >
            Product
          </button>
          <button
            onClick={() => onNavigate('dashboard')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 ${
              currentView === 'dashboard'
                ? 'text-[#16A36A] font-semibold border-b-2 border-[#16A36A]'
                : 'text-[#737D75] dark:text-[#85948A] hover:text-[#18251F] dark:hover:text-[#EAEFEA]'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => onNavigate('analyze')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 ${
              currentView === 'analyze'
                ? 'text-[#16A36A] font-semibold border-b-2 border-[#16A36A]'
                : 'text-[#737D75] dark:text-[#85948A] hover:text-[#18251F] dark:hover:text-[#EAEFEA]'
            }`}
          >
            Analyze Waste
          </button>
          <button
            onClick={() => onNavigate('history')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 ${
              currentView === 'history'
                ? 'text-[#16A36A] font-semibold border-b-2 border-[#16A36A]'
                : 'text-[#737D75] dark:text-[#85948A] hover:text-[#18251F] dark:hover:text-[#EAEFEA]'
            }`}
          >
            Analysis History
          </button>
          <button
            onClick={() => onNavigate('methodology')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 ${
              currentView === 'methodology'
                ? 'text-[#16A36A] font-semibold border-b-2 border-[#16A36A]'
                : 'text-[#737D75] dark:text-[#85948A] hover:text-[#18251F] dark:hover:text-[#EAEFEA]'
            }`}
          >
            Methodology
          </button>
        </nav>

        {/* Zone 3: 1 primary action + subtle theme toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-lg text-[#737D75] hover:text-[#18251F] dark:text-[#85948A] dark:hover:text-[#EAEFEA] transition-colors cursor-pointer"
            aria-label={darkMode ? "Switch to light theme" : "Switch to dark theme"}
            title={darkMode ? "Switch to light theme" : "Switch to dark theme"}
          >
            {darkMode ? <Sun className="w-4 h-4 text-[#C8F169]" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={() => onNavigate('analyze')}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#102A24] dark:bg-[#16A36A] hover:bg-[#16A36A] dark:hover:bg-[#128354] rounded-lg transition-all shadow-sm cursor-pointer whitespace-nowrap shrink-0 active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C8F169]" />
            <span>Analyze Batch</span>
          </button>
        </div>
      </div>
    </header>
  );
};
