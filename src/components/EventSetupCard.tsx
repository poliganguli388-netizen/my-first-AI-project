import React from 'react';
import { Sliders, Wand2, Mail, Lightbulb, ClipboardList, Loader2, Sparkles, MapPin, Calendar, Users, DollarSign } from 'lucide-react';
import { EventType } from '../types';

interface EventSetupCardProps {
  type: EventType;
  onChangeType: (type: EventType) => void;
  date: string;
  onChangeDate: (date: string) => void;
  guests: number;
  onChangeGuests: (guests: number) => void;
  budget: number;
  onChangeBudget: (budget: number) => void;
  currency: string;
  city: string;
  onChangeCity: (city: string) => void;
  notes: string;
  onChangeNotes: (notes: string) => void;
  onLoadTemplate: (type: EventType) => void;
  onAutoPlan: () => void;
  onOpenInviteModal: () => void;
  onOpenBudgetDoctor: () => void;
  onOpenVendorChecklist: () => void;
  isAiLoading: boolean;
  aiActionName: string;
}

export const EventSetupCard: React.FC<EventSetupCardProps> = ({
  type,
  onChangeType,
  date,
  onChangeDate,
  guests,
  onChangeGuests,
  budget,
  onChangeBudget,
  currency,
  city,
  onChangeCity,
  notes,
  onChangeNotes,
  onLoadTemplate,
  onAutoPlan,
  onOpenInviteModal,
  onOpenBudgetDoctor,
  onOpenVendorChecklist,
  isAiLoading,
  aiActionName
}) => {
  return (
    <section className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-800/90 dark:bg-slate-900/95 transition-all">
      {/* Header */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
            <Sliders className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
              Event Setup & Core Specifications
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Configure parameters to tailor all financial allocations and timelines
            </p>
          </div>
        </div>

        {/* Quick Starter Templates */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-1">Pre-built Starters:</span>
          <button
            onClick={() => onLoadTemplate('wedding')}
            className="rounded-lg border border-slate-200/90 bg-slate-50/80 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700/80 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Royal Wedding
          </button>
          <button
            onClick={() => onLoadTemplate('birthday')}
            className="rounded-lg border border-slate-200/90 bg-slate-50/80 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700/80 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Boho Birthday
          </button>
          <button
            onClick={() => onLoadTemplate('anniversary')}
            className="rounded-lg border border-slate-200/90 bg-slate-50/80 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700/80 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Anniversary
          </button>
          <button
            onClick={() => onLoadTemplate('corporate')}
            className="rounded-lg border border-slate-200/90 bg-slate-50/80 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700/80 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Corporate Summit
          </button>
          <button
            onClick={() => onLoadTemplate('community')}
            className="rounded-lg border border-slate-200/90 bg-slate-50/80 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700/80 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Festival
          </button>
        </div>
      </div>

      {/* Form Fields Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div>
          <label className="block text-[11px] font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
            Event Type
          </label>
          <select
            value={type}
            onChange={(e) => onChangeType(e.target.value as EventType)}
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-sm font-semibold text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-100 dark:focus:border-indigo-500 transition-all cursor-pointer"
          >
            <option value="wedding">Indian Wedding / Sangeet</option>
            <option value="birthday">Birthday Milestone</option>
            <option value="anniversary">Anniversary Celebration</option>
            <option value="corporate">Corporate Gala / Summit</option>
            <option value="community">Community / Festival Event</option>
            <option value="party">Garden Soiree / Party</option>
            <option value="other">Bespoke Gathering</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
            Event Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => onChangeDate(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-sm font-semibold text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-100 dark:focus:border-indigo-500 transition-all"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
            Guest Count
          </label>
          <div className="relative mt-1.5">
            <input
              type="number"
              min="1"
              value={guests || ''}
              onChange={(e) => onChangeGuests(Math.max(1, Number(e.target.value) || 0))}
              placeholder="100"
              className="w-full font-mono tabular-nums rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-sm font-semibold text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-100 dark:focus:border-indigo-500 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
            Total Budget ({currency})
          </label>
          <div className="relative mt-1.5">
            <span className="absolute left-3 top-2 text-sm text-slate-400 font-mono">
              {currency}
            </span>
            <input
              type="number"
              min="0"
              step="5000"
              value={budget || ''}
              onChange={(e) => onChangeBudget(Math.max(0, Number(e.target.value) || 0))}
              placeholder="500000"
              className="w-full font-mono tabular-nums rounded-xl border border-slate-200 bg-slate-50/70 py-2 pl-7 pr-3 text-sm font-semibold text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-100 dark:focus:border-indigo-500 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
            City / Location
          </label>
          <input
            type="text"
            value={city}
            onChange={(e) => onChangeCity(e.target.value)}
            placeholder="e.g. Udaipur, Mumbai, Goa"
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-sm font-semibold text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-100 dark:focus:border-indigo-500 transition-all"
          />
        </div>

        <div className="sm:col-span-2 lg:col-span-5">
          <label className="block text-[11px] font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
            Host Vision & Creative Preferences
          </label>
          <textarea
            value={notes}
            onChange={(e) => onChangeNotes(e.target.value)}
            rows={2}
            placeholder="Theme styling (e.g. Royal Rajasthani heritage, brass lanterns), vegetarian live chaat counters, acoustic jazz band, outdoor lawn with rain shelter..."
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2 text-sm font-medium text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-100 dark:focus:border-indigo-500 transition-all"
          />
        </div>
      </div>

      {/* AI Automation Suite */}
      <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2.5">
        <button
          onClick={onAutoPlan}
          disabled={isAiLoading}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-pink-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm shadow-indigo-500/20 hover:from-indigo-500 hover:to-pink-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 transition-all cursor-pointer whitespace-nowrap"
        >
          {isAiLoading && aiActionName === 'plan' ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Wand2 className="h-4 w-4" />
          )}
          <span>AI Auto-Plan Everything</span>
        </button>

        <button
          onClick={onOpenInviteModal}
          disabled={isAiLoading}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200/90 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700/80 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-750 transition-colors whitespace-nowrap cursor-pointer shadow-2xs"
        >
          <Mail className="h-3.5 w-3.5 text-indigo-500" />
          <span>AI WhatsApp & Digital Invite</span>
        </button>

        <button
          onClick={onOpenBudgetDoctor}
          disabled={isAiLoading}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200/90 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700/80 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-750 transition-colors whitespace-nowrap cursor-pointer shadow-2xs"
        >
          <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
          <span>AI Budget Doctor</span>
        </button>

        <button
          onClick={onOpenVendorChecklist}
          disabled={isAiLoading}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200/90 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700/80 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-750 transition-colors whitespace-nowrap cursor-pointer shadow-2xs"
        >
          <ClipboardList className="h-3.5 w-3.5 text-emerald-500" />
          <span>AI Vendor Checklist</span>
        </button>

        {isAiLoading && (
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 animate-pulse ml-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI is structuring your celebration blueprint...</span>
          </div>
        )}
      </div>
    </section>
  );
};
