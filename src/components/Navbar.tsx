import React from 'react';
import { Moon, Sun, ScanLine } from 'lucide-react';

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
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-[#0B1513]/95 backdrop-blur-md border-b border-[#E2E6DF] dark:border-[#1B332B] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        {/* Brand wordmark with micro-project indicator */}
        <button
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-3 text-left cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-[#102A24] dark:bg-[#16A36A] text-white flex items-center justify-center font-bold text-sm tracking-tight shadow-xs">
            ES
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold tracking-tight text-[#102A24] dark:text-[#EAEFEA]">
                EcoSort AI
              </span>
              <span className="hidden sm:inline-block text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#102A24]/5 dark:bg-[#16A36A]/15 text-[#102A24] dark:text-[#C8F169] border border-[#102A24]/10 dark:border-[#16A36A]/20">
                Inspection System
              </span>
            </div>
            <p className="hidden md:block text-[11px] text-[#66736C] dark:text-[#8A9890] font-normal leading-none mt-0.5">
              Waste Segregation & Recycling Assessment
            </p>
          </div>
        </button>

        {/* Navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold tracking-wide">
          <button
            onClick={() => onNavigate('landing')}
            className={`whitespace-nowrap transition-colors cursor-pointer py-1.5 px-1 ${
              currentView === 'landing'
                ? 'text-[#16A36A] dark:text-[#C8F169] border-b-2 border-[#16A36A] dark:border-[#C8F169]'
                : 'text-[#66736C] dark:text-[#8A9890] hover:text-[#102A24] dark:hover:text-[#EAEFEA]'
            }`}
          >
            Product Overview
          </button>
          <button
            onClick={() => onNavigate('dashboard')}
            className={`whitespace-nowrap transition-colors cursor-pointer py-1.5 px-1 ${
              currentView === 'dashboard'
                ? 'text-[#16A36A] dark:text-[#C8F169] border-b-2 border-[#16A36A] dark:border-[#C8F169]'
                : 'text-[#66736C] dark:text-[#8A9890] hover:text-[#102A24] dark:hover:text-[#EAEFEA]'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onNavigate('analyze')}
            className={`whitespace-nowrap transition-colors cursor-pointer py-1.5 px-1 ${
              currentView === 'analyze'
                ? 'text-[#16A36A] dark:text-[#C8F169] border-b-2 border-[#16A36A] dark:border-[#C8F169]'
                : 'text-[#66736C] dark:text-[#8A9890] hover:text-[#102A24] dark:hover:text-[#EAEFEA]'
            }`}
          >
            Analyze Waste
          </button>
          <button
            onClick={() => onNavigate('history')}
            className={`whitespace-nowrap transition-colors cursor-pointer py-1.5 px-1 ${
              currentView === 'history'
                ? 'text-[#16A36A] dark:text-[#C8F169] border-b-2 border-[#16A36A] dark:border-[#C8F169]'
                : 'text-[#66736C] dark:text-[#8A9890] hover:text-[#102A24] dark:hover:text-[#EAEFEA]'
            }`}
          >
            Inspection History
          </button>
          <button
            onClick={() => onNavigate('methodology')}
            className={`whitespace-nowrap transition-colors cursor-pointer py-1.5 px-1 ${
              currentView === 'methodology'
                ? 'text-[#16A36A] dark:text-[#C8F169] border-b-2 border-[#16A36A] dark:border-[#C8F169]'
                : 'text-[#66736C] dark:text-[#8A9890] hover:text-[#102A24] dark:hover:text-[#EAEFEA]'
            }`}
          >
            Standards
          </button>
        </nav>

        {/* Action & Theme Toggle */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-lg text-[#66736C] hover:text-[#102A24] dark:text-[#8A9890] dark:hover:text-[#EAEFEA] hover:bg-[#F2F4EF] dark:hover:bg-[#12211C] transition-colors cursor-pointer border border-transparent hover:border-[#E2E6DF] dark:hover:border-[#1B332B]"
            aria-label={darkMode ? "Switch to light theme" : "Switch to dark theme"}
            title={darkMode ? "Switch to light theme" : "Switch to dark theme"}
          >
            {darkMode ? <Sun className="w-4 h-4 text-[#C8F169]" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={() => onNavigate('analyze')}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-[#102A24] dark:bg-[#16A36A] hover:bg-[#16A36A] dark:hover:bg-[#128354] rounded-lg transition-colors shadow-xs cursor-pointer whitespace-nowrap shrink-0 active:scale-98"
          >
            <ScanLine className="w-3.5 h-3.5" />
            <span>Analyze Waste</span>
          </button>
        </div>
      </div>
    </header>
  );
};
