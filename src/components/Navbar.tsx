import React from 'react';
import { Moon, Sun, ScanLine } from 'lucide-react';

export type NavViewType = 'overview' | 'analyze' | 'history' | 'methodology';

interface NavbarProps {
  currentView: NavViewType;
  onNavigate: (view: NavViewType) => void;
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
    <header className="sticky top-0 z-40 w-full bg-[#FFFFFF]/95 dark:bg-[#1C201C]/95 backdrop-blur-xs border-b border-[#DCDDD4] dark:border-[#2B312B] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-6">
        {/* Brand mark: custom geometric circular material-flow glyph & wordmark */}
        <button
          onClick={() => onNavigate('overview')}
          className="flex items-center gap-3 text-left cursor-pointer group"
          title="EcoSort AI Quality Control System"
        >
          {/* Custom circular material-flow SVG glyph */}
          <div className="w-8 h-8 rounded-md bg-[#F5F4EE] dark:bg-[#22332A] border border-[#DCDDD4] dark:border-[#2B312B] flex items-center justify-center shrink-0 group-hover:border-[#245B45] transition-colors">
            <svg
              className="w-4.5 h-4.5 text-[#245B45] dark:text-[#3A7D63]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 2.5" opacity="0.45" />
              <path d="M12 3 A 9 9 0 0 1 21 12" />
              <path d="M21 12 A 9 9 0 0 1 12 21" strokeWidth="2.6" />
              <circle cx="12" cy="12" r="3" fill="currentColor" />
              <path d="M12 5.5v2.5" />
              <path d="M16 12h2.5" />
            </svg>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-extrabold tracking-tight text-[#252923] dark:text-[#E6E8E3]">
              EcoSort AI
            </span>
            <span className="hidden sm:inline-block font-mono text-[10px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded-xs bg-[#F5F4EE] dark:bg-[#22332A] text-[#777B73] dark:text-[#9DA399] border border-[#DCDDD4] dark:border-[#2B312B]">
              QC // RECYCLING
            </span>
          </div>
        </button>

        {/* Primary 4-Tab Navigation */}
        <nav className="hidden md:flex items-center gap-1 text-xs font-semibold tracking-wide">
          <button
            onClick={() => onNavigate('overview')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              currentView === 'overview'
                ? 'bg-[#F5F4EE] dark:bg-[#22332A] text-[#245B45] dark:text-[#E6E8E3] font-bold border border-[#DCDDD4] dark:border-[#2B312B]'
                : 'text-[#777B73] dark:text-[#9DA399] hover:text-[#252923] dark:hover:text-[#E6E8E3] hover:bg-[#F5F4EE]/60 dark:hover:bg-[#22332A]/50 border border-transparent'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => onNavigate('analyze')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              currentView === 'analyze'
                ? 'bg-[#F5F4EE] dark:bg-[#22332A] text-[#245B45] dark:text-[#E6E8E3] font-bold border border-[#DCDDD4] dark:border-[#2B312B]'
                : 'text-[#777B73] dark:text-[#9DA399] hover:text-[#252923] dark:hover:text-[#E6E8E3] hover:bg-[#F5F4EE]/60 dark:hover:bg-[#22332A]/50 border border-transparent'
            }`}
          >
            Analyze Waste
          </button>
          <button
            onClick={() => onNavigate('history')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              currentView === 'history'
                ? 'bg-[#F5F4EE] dark:bg-[#22332A] text-[#245B45] dark:text-[#E6E8E3] font-bold border border-[#DCDDD4] dark:border-[#2B312B]'
                : 'text-[#777B73] dark:text-[#9DA399] hover:text-[#252923] dark:hover:text-[#E6E8E3] hover:bg-[#F5F4EE]/60 dark:hover:bg-[#22332A]/50 border border-transparent'
            }`}
          >
            Analysis History
          </button>
          <button
            onClick={() => onNavigate('methodology')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              currentView === 'methodology'
                ? 'bg-[#F5F4EE] dark:bg-[#22332A] text-[#245B45] dark:text-[#E6E8E3] font-bold border border-[#DCDDD4] dark:border-[#2B312B]'
                : 'text-[#777B73] dark:text-[#9DA399] hover:text-[#252923] dark:hover:text-[#E6E8E3] hover:bg-[#F5F4EE]/60 dark:hover:bg-[#22332A]/50 border border-transparent'
            }`}
          >
            Methodology
          </button>
        </nav>

        {/* Actions & Restrained Theme Toggle */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onToggleDarkMode}
            className="p-1.5 rounded-md text-[#777B73] hover:text-[#252923] dark:text-[#9DA399] dark:hover:text-[#E6E8E3] hover:bg-[#F5F4EE] dark:hover:bg-[#22332A] border border-[#DCDDD4] dark:border-[#2B312B] transition-colors cursor-pointer"
            aria-label={darkMode ? "Switch to light theme" : "Switch to dark theme"}
            title={darkMode ? "Switch to light theme" : "Switch to dark theme"}
          >
            {darkMode ? <Sun className="w-4 h-4 text-[#E6E8E3]" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={() => onNavigate('analyze')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#245B45] hover:bg-[#1D4B39] dark:bg-[#3A7D63] dark:hover:bg-[#2F6852] rounded-md transition-colors cursor-pointer shadow-xs whitespace-nowrap active:scale-98"
          >
            <ScanLine className="w-3.5 h-3.5" />
            <span>Analyze Waste</span>
          </button>
        </div>
      </div>
    </header>
  );
};
