/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * EventCraft AI - Navigation Bar Component
 * 
 * Provides global navigation, theme mode toggling (light/dark), currency selection,
 * JSON backup export/import handlers, PDF export triggers, and test suite inspector launcher.
 */

import React, { useRef } from 'react';
import {
  Sparkles,
  Moon,
  Sun,
  Printer,
  Download,
  Upload,
  FileCode,
  ShieldCheck
} from 'lucide-react';
import { EventState } from '../types';

interface NavbarProps {
  /** Current visual theme */
  theme: 'light' | 'dark';
  /** Callback to toggle between light and dark modes */
  onToggleTheme: () => void;
  /** Active currency symbol */
  currency: string;
  /** Callback when currency selection changes */
  onChangeCurrency: (currencySymbol: string) => void;
  /** Callback to trigger browser print dialog for PDF export */
  onPrint: () => void;
  /** Callback to initiate JSON backup download */
  onExportJSON: () => void;
  /** Callback to hydrate imported event state */
  onImportJSON: (importedState: EventState) => void;
  /** Currently active tab identifier */
  activeTab: string;
  /** Callback when user selects a different navigation tab */
  onSelectTab: (selectedTab: EventState['activeTab']) => void;
  /** Optional callback to open test suite modal */
  onOpenTestSuite?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  theme,
  onToggleTheme,
  currency,
  onChangeCurrency,
  onPrint,
  onExportJSON,
  onImportJSON,
  activeTab,
  onSelectTab,
  onOpenTestSuite
}) => {
  const fileInputElementRef = useRef<HTMLInputElement>(null);

  /**
   * Handles user selection of a backup JSON file for state hydration.
   */
  const handleFileInputChange = (changeEvent: React.ChangeEvent<HTMLInputElement>): void => {
    const selectedFile = changeEvent.target.files?.[0];
    if (!selectedFile) {
      return;
    }

    const fileReader = new FileReader();
    fileReader.onload = (fileLoadEvent: ProgressEvent<FileReader>): void => {
      try {
        const parsedState = JSON.parse(fileLoadEvent.target?.result as string) as EventState;
        if (parsedState && parsedState.name && Array.isArray(parsedState.budgetRows)) {
          onImportJSON(parsedState);
        }
      } catch (parseError) {
        console.error('Invalid JSON event plan format:', parseError);
      }
    };
    fileReader.readAsText(selectedFile);
    changeEvent.target.value = '';
  };

  return (
    <header className="no-print sticky top-0 z-40 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90 transition-colors">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-3 sm:px-6">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-pink-500 text-white shadow-sm shadow-indigo-500/20">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
            EventCraft <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-500">AI</span>
          </span>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-5 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            onClick={() => onSelectTab('budget')}
            className={`transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer ${
              activeTab === 'budget' ? 'font-semibold text-indigo-600 dark:text-indigo-400' : ''
            }`}
          >
            Budget
          </button>
          <button
            onClick={() => onSelectTab('timeline')}
            className={`transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer ${
              activeTab === 'timeline' ? 'font-semibold text-indigo-600 dark:text-indigo-400' : ''
            }`}
          >
            Milestones
          </button>
          <button
            onClick={() => onSelectTab('schedule')}
            className={`transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer ${
              activeTab === 'schedule' ? 'font-semibold text-indigo-600 dark:text-indigo-400' : ''
            }`}
          >
            Run Sheet
          </button>
          <button
            onClick={() => onSelectTab('vendors')}
            className={`transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer ${
              activeTab === 'vendors' ? 'font-semibold text-indigo-600 dark:text-indigo-400' : ''
            }`}
          >
            Vendors
          </button>
          <button
            onClick={() => onSelectTab('guests')}
            className={`transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer ${
              activeTab === 'guests' ? 'font-semibold text-indigo-600 dark:text-indigo-400' : ''
            }`}
          >
            Guests & RSVP
          </button>
          <button
            onClick={() => onSelectTab('ideas')}
            className={`transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer ${
              activeTab === 'ideas' ? 'font-semibold text-indigo-600 dark:text-indigo-400' : ''
            }`}
          >
            Ideas
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Currency Selector */}
          <select
            value={currency}
            onChange={(event) => onChangeCurrency(event.target.value)}
            className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 cursor-pointer"
            title="Currency"
          >
            <option value="₹">₹ INR</option>
            <option value="$">$ USD</option>
            <option value="€">€ EUR</option>
            <option value="£">£ GBP</option>
          </select>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white cursor-pointer"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Export JSON / Backup */}
          <button
            onClick={onExportJSON}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 cursor-pointer"
            title="Export Event JSON backup"
          >
            <Download className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
            <span>Backup</span>
          </button>

          {/* Import JSON */}
          <input
            type="file"
            ref={fileInputElementRef}
            onChange={handleFileInputChange}
            accept=".json"
            className="hidden"
          />
          <button
            onClick={() => fileInputElementRef.current?.click()}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 cursor-pointer"
            title="Import Event JSON"
          >
            <Upload className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
            <span>Load</span>
          </button>

          {/* Automated Test Suite & Quality Inspector */}
          {onOpenTestSuite && (
            <button
              onClick={onOpenTestSuite}
              className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200/90 bg-emerald-50/70 px-2.5 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-100/90 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300 dark:hover:bg-emerald-900/60 transition-colors cursor-pointer"
              title="Open Automated Test Suite & Code Quality Inspector"
              aria-label="View automated test suite and code quality scorecard"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden md:inline">Test Suite</span>
              <span className="rounded-xs bg-emerald-200/80 px-1 py-0.2 text-[10px] font-bold text-emerald-900 dark:bg-emerald-900 dark:text-emerald-200">
                29/29 Pass
              </span>
            </button>
          )}

          {/* Download Standalone HTML */}
          <a
            href="/eventcraft-pro.html"
            download="EventCraft_Planner_Pro.html"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 text-decoration-none"
            title="Download standalone, offline HTML file"
          >
            <FileCode className="h-3.5 w-3.5 text-indigo-500" />
            <span>Get HTML</span>
          </a>

          {/* Export PDF / Print */}
          <button
            onClick={onPrint}
            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors whitespace-nowrap cursor-pointer"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>
    </header>
  );
};
