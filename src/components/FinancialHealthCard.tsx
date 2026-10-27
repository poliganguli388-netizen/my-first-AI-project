/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * EventCraft AI - Financial Health & Allocation Intelligence Card
 * 
 * Renders master budgetary metrics (Total Budget, Planned Allocations, Realized Spend,
 * Liquid Reserve), proportional category stacked distribution bars, and the predictive
 * Spending Projection Panel.
 */

import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { BudgetRow } from '../types';
import { formatCurrency } from '../utils/formatters';
import { SpendingProjectionPanel } from './SpendingProjectionPanel';

interface FinancialHealthCardProps {
  /** Master budget ceiling */
  budget: number;
  /** Active currency symbol */
  currency: string;
  /** Anticipated guest count */
  guests: number;
  /** Array of category budget rows */
  budgetRows: BudgetRow[];
}

export const FinancialHealthCard: React.FC<FinancialHealthCardProps> = ({
  budget,
  currency,
  guests,
  budgetRows
}) => {
  const [showProjection, setShowProjection] = useState<boolean>(true);

  const masterBudgetAmount = Number(budget) || 0;
  const totalPlannedAllocations = budgetRows.reduce(
    (accumulatedTotal, budgetRow) => accumulatedTotal + (Number(budgetRow.planned) || 0),
    0
  );
  const totalDisbursedSpend = budgetRows.reduce(
    (accumulatedTotal, budgetRow) => accumulatedTotal + (Number(budgetRow.spent) || 0),
    0
  );
  const remainingLiquidBalance = masterBudgetAmount - totalDisbursedSpend;
  const allocationVariance = masterBudgetAmount - totalPlannedAllocations;
  const budgetCapPerGuest = guests > 0 ? Math.round(masterBudgetAmount / guests) : 0;
  const burnRatePercentage =
    masterBudgetAmount > 0
      ? Math.round((totalDisbursedSpend / masterBudgetAmount) * 100)
      : 0;
  const plannedAllocationPercentage =
    masterBudgetAmount > 0
      ? Math.round((totalPlannedAllocations / masterBudgetAmount) * 100)
      : 0;

  const proportionalBarDenominator = Math.max(masterBudgetAmount, totalPlannedAllocations, 1);

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
              <span className="font-mono tabular-nums">{burnRatePercentage}%</span>
              <span>budget disbursed</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
            <span className="text-slate-400 font-normal">Cap:</span>
            <span className="font-mono tabular-nums">{formatCurrency(budgetCapPerGuest, currency)}</span>
            <span className="text-slate-400 font-normal">/ guest</span>
          </div>

          <button
            onClick={() => setShowProjection((previousState) => !previousState)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50/70 px-3 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 dark:border-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-300 dark:hover:bg-indigo-900/50 transition-colors cursor-pointer"
          >
            <TrendingUp className="h-3.5 w-3.5" />
            <span>{showProjection ? 'Hide Forecast' : 'View Forecast Radar'}</span>
            {showProjection ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* 4 Primary Metric Cards */}
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
        {/* Total Budget Ceiling */}
        <div className="rounded-xl border border-slate-200/80 bg-gradient-to-br from-slate-50/90 to-white p-4 dark:border-slate-800 dark:from-slate-800/40 dark:to-slate-900/60 transition-all hover:border-slate-300 dark:hover:border-slate-700 shadow-2xs">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider dark:text-slate-400">
            <span>Total Budget</span>
            <span className="text-slate-400 text-[10px] font-semibold">100%</span>
          </div>
          <div className="mt-1.5 font-mono text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums tracking-tight">
            {formatCurrency(masterBudgetAmount, currency)}
          </div>
          <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            Target expenditure ceiling
          </div>
        </div>

        {/* Planned Allocation */}
        <div className="rounded-xl border border-slate-200/80 bg-gradient-to-br from-indigo-50/30 to-white p-4 dark:border-slate-800 dark:from-indigo-950/20 dark:to-slate-900/60 transition-all hover:border-indigo-300 dark:hover:border-indigo-800/60 shadow-2xs">
          <div className="flex items-center justify-between text-[11px] font-bold text-indigo-600 uppercase tracking-wider dark:text-indigo-400">
            <span>Planned Allocation</span>
            <span className="font-mono text-[10px] tabular-nums font-semibold">{plannedAllocationPercentage}%</span>
          </div>
          <div className="mt-1.5 font-mono text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 tabular-nums tracking-tight">
            {formatCurrency(totalPlannedAllocations, currency)}
          </div>
          <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            {allocationVariance === 0
              ? 'Fully allocated'
              : allocationVariance > 0
              ? `${formatCurrency(allocationVariance, currency)} unassigned`
              : `Exceeds by ${formatCurrency(Math.abs(allocationVariance), currency)}`}
          </div>
        </div>

        {/* Actual Disbursements */}
        <div className="rounded-xl border border-slate-200/80 bg-gradient-to-br from-slate-50/90 to-white p-4 dark:border-slate-800 dark:from-slate-800/40 dark:to-slate-900/60 transition-all hover:border-slate-300 dark:hover:border-slate-700 shadow-2xs">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 uppercase tracking-wider dark:text-slate-300">
            <span>Actual Paid Out</span>
            <span className="font-mono text-[10px] tabular-nums font-semibold">{burnRatePercentage}%</span>
          </div>
          <div className="mt-1.5 font-mono text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums tracking-tight">
            {formatCurrency(totalDisbursedSpend, currency)}
          </div>
          <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            Verified disbursements
          </div>
        </div>

        {/* Remaining Liquid Balance */}
        <div
          className={`rounded-xl border p-4 transition-all shadow-2xs ${
            remainingLiquidBalance < 0
              ? 'border-rose-200/90 bg-rose-50/50 dark:border-rose-900/50 dark:bg-rose-950/20'
              : 'border-emerald-200/90 bg-emerald-50/50 dark:border-emerald-900/50 dark:bg-emerald-950/20'
          }`}
        >
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider">
            <span
              className={
                remainingLiquidBalance < 0
                  ? 'text-rose-700 dark:text-rose-300'
                  : 'text-emerald-700 dark:text-emerald-300'
              }
            >
              {remainingLiquidBalance < 0 ? 'Deficit' : 'Remaining Balance'}
            </span>
            <span className="font-mono text-[10px] font-semibold">
              {masterBudgetAmount > 0
                ? `${Math.round((remainingLiquidBalance / masterBudgetAmount) * 100)}%`
                : '0%'}
            </span>
          </div>
          <div
            className={`mt-1.5 font-mono text-2xl font-extrabold tabular-nums tracking-tight ${
              remainingLiquidBalance < 0
                ? 'text-rose-600 dark:text-rose-400'
                : 'text-emerald-600 dark:text-emerald-400'
            }`}
          >
            {formatCurrency(remainingLiquidBalance, currency)}
          </div>
          <div className="mt-1 text-[11px] font-medium text-slate-600 dark:text-slate-400">
            {remainingLiquidBalance < 0 ? 'Overdraft action needed' : 'Liquid cash available'}
          </div>
        </div>
      </div>

      {/* Category Stacked Share Distribution Bar */}
      <div className="mt-5">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
          <span>Category Share Breakdown</span>
          <span className="font-mono text-[11px] text-slate-500 font-normal">
            {formatCurrency(totalPlannedAllocations, currency)} allocated
          </span>
        </div>

        <div className="flex h-3.5 w-full overflow-hidden rounded-md bg-slate-100 dark:bg-slate-800 p-0.5 gap-0.5">
          {budgetRows.map((budgetRow, categoryIndex) => {
            const barWidthPercentage =
              ((budgetRow.planned || 0) / proportionalBarDenominator) * 100;
            if (barWidthPercentage <= 0) {
              return null;
            }
            return (
              <div
                key={budgetRow.id || categoryIndex}
                style={{ width: `${barWidthPercentage}%`, backgroundColor: budgetRow.color || '#6366F1' }}
                className="h-full rounded-xs transition-all duration-300 relative group cursor-pointer hover:opacity-90"
                title={`${budgetRow.name}: ${formatCurrency(budgetRow.planned, currency)} (${Math.round(
                  (budgetRow.planned / (masterBudgetAmount || 1)) * 100
                )}%)`}
              />
            );
          })}
        </div>

        {/* Legend Chips */}
        <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-600 dark:text-slate-400">
          {budgetRows.slice(0, 6).map((budgetRow, categoryIndex) => (
            <div key={budgetRow.id || categoryIndex} className="inline-flex items-center gap-1.5">
              <span
                style={{ backgroundColor: budgetRow.color || '#6366F1' }}
                className="h-2 w-2 rounded-full shrink-0"
              />
              <span className="truncate max-w-[120px] font-medium">{budgetRow.name}</span>
              <span className="font-mono text-[11px] text-slate-400">
                {Math.round(((budgetRow.planned || 0) / (masterBudgetAmount || 1)) * 100)}%
              </span>
            </div>
          ))}
          {budgetRows.length > 6 && (
            <span className="text-[11px] text-slate-400">+{budgetRows.length - 6} more</span>
          )}
        </div>
      </div>

      {/* Budget Balance Status Banner */}
      <div className="mt-4 flex items-center gap-2.5 rounded-lg border border-slate-200/60 bg-slate-50/60 px-3.5 py-2.5 text-xs dark:border-slate-800 dark:bg-slate-800/40">
        {allocationVariance < 0 ? (
          <>
            <AlertTriangle className="h-4 w-4 text-rose-500 shrink-0" />
            <span className="font-semibold text-rose-600 dark:text-rose-400">
              Allocated category planned spend exceeds your total budget ceiling by{' '}
              {formatCurrency(Math.abs(allocationVariance), currency)}. Trim non-essential allocations.
            </span>
          </>
        ) : allocationVariance > 0 ? (
          <>
            <Info className="h-4 w-4 text-indigo-500 shrink-0" />
            <span className="text-slate-600 dark:text-slate-300">
              You currently maintain{' '}
              <b className="font-mono text-slate-900 dark:text-white">
                {formatCurrency(allocationVariance, currency)}
              </b>{' '}
              ({Math.round((allocationVariance / (masterBudgetAmount || 1)) * 100)}%) uncommitted as an
              emergency reserve buffer.
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

      {/* Visual Component: Spending Projections & Overrun Forecast Radar */}
      {showProjection && (
        <SpendingProjectionPanel
          budget={masterBudgetAmount}
          currency={currency}
          budgetRows={budgetRows}
          guests={guests}
        />
      )}
    </section>
  );
};
