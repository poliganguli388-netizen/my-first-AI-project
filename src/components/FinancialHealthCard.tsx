import React, { useState } from 'react';
import { BarChart3, TrendingUp, AlertTriangle, CheckCircle2, Info, ChevronDown, ChevronUp, Sparkles, PieChart } from 'lucide-react';
import { BudgetRow } from '../types';
import { formatCurrency } from '../utils/formatters';
import { SpendingProjectionPanel } from './SpendingProjectionPanel';

interface FinancialHealthCardProps {
  budget: number;
  currency: string;
  guests: number;
  budgetRows: BudgetRow[];
}

export const FinancialHealthCard: React.FC<FinancialHealthCardProps> = ({
  budget,
  currency,
  guests,
  budgetRows
}) => {
  const [showProjection, setShowProjection] = useState(true);

  const totalB = Number(budget) || 0;
  const planned = budgetRows.reduce((acc, r) => acc + (Number(r.planned) || 0), 0);
  const spent = budgetRows.reduce((acc, r) => acc + (Number(r.spent) || 0), 0);
  const remaining = totalB - spent;
  const diffPlanned = totalB - planned;
  const perGuest = guests > 0 ? Math.round(totalB / guests) : 0;
  const burnRatePct = totalB > 0 ? Math.round((spent / totalB) * 100) : 0;
  const plannedPct = totalB > 0 ? Math.round((planned / totalB) * 100) : 0;

  const denominator = Math.max(totalB, planned, 1);

  return (
    <section className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-800/90 dark:bg-slate-900/95 transition-all">
      {/* Header */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
            <BarChart3 className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
              Financial & Allocation Intelligence
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span>{budgetRows.length} active categories</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">{burnRatePct}%</span>
              <span>budget disbursed</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
            <span className="text-slate-400 font-normal">Cap:</span>
            <span className="font-mono tabular-nums">{formatCurrency(perGuest, currency)}</span>
            <span className="text-slate-400 font-normal">/ guest</span>
          </div>

          <button
            onClick={() => setShowProjection((prev) => !prev)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50/70 px-3 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 dark:border-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-300 dark:hover:bg-indigo-900/50 transition-colors cursor-pointer"
          >
            <TrendingUp className="h-3.5 w-3.5" />
            <span>{showProjection ? 'Hide Forecast' : 'View Forecast Radar'}</span>
            {showProjection ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* 4 Premium Metric Cards */}
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
        {/* Total Budget */}
        <div className="rounded-xl border border-slate-200/80 bg-gradient-to-br from-slate-50/90 to-white p-4 dark:border-slate-800 dark:from-slate-800/40 dark:to-slate-900/60 transition-all hover:border-slate-300 dark:hover:border-slate-700 shadow-2xs">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider dark:text-slate-400">
            <span>Total Budget</span>
            <span className="text-slate-400 text-[10px] font-semibold">100%</span>
          </div>
          <div className="mt-1.5 font-mono text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums tracking-tight">
            {formatCurrency(totalB, currency)}
          </div>
          <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            Target expenditure ceiling
          </div>
        </div>

        {/* Planned Allocation */}
        <div className="rounded-xl border border-slate-200/80 bg-gradient-to-br from-indigo-50/30 to-white p-4 dark:border-slate-800 dark:from-indigo-950/20 dark:to-slate-900/60 transition-all hover:border-indigo-300 dark:hover:border-indigo-800/60 shadow-2xs">
          <div className="flex items-center justify-between text-[11px] font-bold text-indigo-600 uppercase tracking-wider dark:text-indigo-400">
            <span>Planned Allocation</span>
            <span className="font-mono text-[10px] tabular-nums font-semibold">{plannedPct}%</span>
          </div>
          <div className="mt-1.5 font-mono text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 tabular-nums tracking-tight">
            {formatCurrency(planned, currency)}
          </div>
          <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            {diffPlanned === 0 ? 'Fully allocated' : diffPlanned > 0 ? `${formatCurrency(diffPlanned, currency)} unassigned` : `Exceeds by ${formatCurrency(Math.abs(diffPlanned), currency)}`}
          </div>
        </div>

        {/* Actual Paid Out */}
        <div className="rounded-xl border border-slate-200/80 bg-gradient-to-br from-slate-50/90 to-white p-4 dark:border-slate-800 dark:from-slate-800/40 dark:to-slate-900/60 transition-all hover:border-slate-300 dark:hover:border-slate-700 shadow-2xs">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 uppercase tracking-wider dark:text-slate-300">
            <span>Actual Paid Out</span>
            <span className="font-mono text-[10px] tabular-nums font-semibold">{burnRatePct}%</span>
          </div>
          <div className="mt-1.5 font-mono text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums tracking-tight">
            {formatCurrency(spent, currency)}
          </div>
          <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            Verified disbursements
          </div>
        </div>

        {/* Remaining Balance */}
        <div
          className={`rounded-xl border p-4 transition-all shadow-2xs ${
            remaining < 0
              ? 'border-rose-200/90 bg-rose-50/50 dark:border-rose-900/50 dark:bg-rose-950/20'
              : 'border-emerald-200/90 bg-emerald-50/50 dark:border-emerald-900/50 dark:bg-emerald-950/20'
          }`}
        >
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider">
            <span className={remaining < 0 ? 'text-rose-700 dark:text-rose-300' : 'text-emerald-700 dark:text-emerald-300'}>
              {remaining < 0 ? 'Deficit' : 'Remaining Balance'}
            </span>
            <span className="font-mono text-[10px] font-semibold">
              {totalB > 0 ? `${Math.round((remaining / totalB) * 100)}%` : '0%'}
            </span>
          </div>
          <div
            className={`mt-1.5 font-mono text-2xl font-extrabold tabular-nums tracking-tight ${
              remaining < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
            }`}
          >
            {formatCurrency(remaining, currency)}
          </div>
          <div className="mt-1 text-[11px] font-medium text-slate-600 dark:text-slate-400">
            {remaining < 0 ? 'Overdraft action needed' : 'Liquid cash available'}
          </div>
        </div>
      </div>

      {/* Visual Proportional Category Stacked Bar */}
      <div className="mt-5">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
          <span>Category Share Breakdown</span>
          <span className="font-mono text-[11px] text-slate-500 font-normal">
            {formatCurrency(planned, currency)} allocated
          </span>
        </div>

        <div className="flex h-3.5 w-full overflow-hidden rounded-md bg-slate-100 dark:bg-slate-800 p-0.5 gap-0.5">
          {budgetRows.map((r, idx) => {
            const width = ((r.planned || 0) / denominator) * 100;
            if (width <= 0) return null;
            return (
              <div
                key={r.id || idx}
                style={{ width: `${width}%`, backgroundColor: r.color || '#6366F1' }}
                className="h-full rounded-xs transition-all duration-300 relative group cursor-pointer hover:opacity-90"
                title={`${r.name}: ${formatCurrency(r.planned, currency)} (${Math.round((r.planned / (totalB || 1)) * 100)}%)`}
              />
            );
          })}
        </div>

        {/* Legend Chips (Unboxed, clean metadata) */}
        <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-600 dark:text-slate-400">
          {budgetRows.slice(0, 6).map((r, i) => (
            <div key={r.id || i} className="inline-flex items-center gap-1.5">
              <span
                style={{ backgroundColor: r.color || '#6366F1' }}
                className="h-2 w-2 rounded-full shrink-0"
              />
              <span className="truncate max-w-[120px] font-medium">{r.name}</span>
              <span className="font-mono text-[11px] text-slate-400">
                {Math.round(((r.planned || 0) / (totalB || 1)) * 100)}%
              </span>
            </div>
          ))}
          {budgetRows.length > 6 && (
            <span className="text-[11px] text-slate-400">+{budgetRows.length - 6} more</span>
          )}
        </div>
      </div>

      {/* Budget Insight Note */}
      <div className="mt-4 flex items-center gap-2.5 rounded-lg border border-slate-200/60 bg-slate-50/60 px-3.5 py-2.5 text-xs dark:border-slate-800 dark:bg-slate-800/40">
        {diffPlanned < 0 ? (
          <>
            <AlertTriangle className="h-4 w-4 text-rose-500 shrink-0" />
            <span className="font-semibold text-rose-600 dark:text-rose-400">
              Allocated category planned spend exceeds your total budget ceiling by {formatCurrency(Math.abs(diffPlanned), currency)}. Trim non-essential allocations.
            </span>
          </>
        ) : diffPlanned > 0 ? (
          <>
            <Info className="h-4 w-4 text-indigo-500 shrink-0" />
            <span className="text-slate-600 dark:text-slate-300">
              You currently maintain <b className="font-mono text-slate-900 dark:text-white">{formatCurrency(diffPlanned, currency)}</b> ({Math.round((diffPlanned / (totalB || 1)) * 100)}%) uncommitted as an emergency reserve buffer.
            </span>
          </>
        ) : (
          <>
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              100% of your total budget is mathematically balanced and categorized.
            </span>
          </>
        )}
      </div>

      {/* New Visual Component: Spending Projections & Overrun Forecast Radar */}
      {showProjection && (
        <SpendingProjectionPanel
          budget={totalB}
          currency={currency}
          budgetRows={budgetRows}
          guests={guests}
        />
      )}
    </section>
  );
};
