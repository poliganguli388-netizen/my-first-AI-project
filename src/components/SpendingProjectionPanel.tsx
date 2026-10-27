/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * EventCraft AI - Predictive Spending Projection & Overrun Radar Panel
 * 
 * Provides interactive scenario simulations (Baseline, Trend-Weighted, Stress Test),
 * multi-layered runway progress bars, per-guest spending velocity radars, category drift
 * drilldowns, and mitigation levers.
 */

import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Compass
} from 'lucide-react';
import { BudgetRow } from '../types';
import { formatCurrency } from '../utils/formatters';
import {
  computeFinancialAnalytics,
  computePerGuestMetrics,
  ProjectionModel,
  FinancialAnalyticsResult,
} from '../utils/financialAnalytics';

interface SpendingProjectionPanelProps {
  /** Master budget ceiling */
  budget: number;
  /** Active currency symbol */
  currency: string;
  /** Array of category budget rows */
  budgetRows: BudgetRow[];
  /** Expected guest count */
  guests: number;
}

export { type ProjectionModel };

export const SpendingProjectionPanel: React.FC<SpendingProjectionPanelProps> = ({
  budget,
  currency,
  budgetRows,
  guests,
}) => {
  const [model, setModel] = useState<ProjectionModel>('trend');
  const [renegotiateLever, setRenegotiateLever] = useState<boolean>(false);

  const masterBudgetCeiling = Number.isFinite(Number(budget)) ? Math.max(0, Number(budget)) : 0;

  // Memoized statistical spending forecast from pure analytics engine
  const analysis: FinancialAnalyticsResult = useMemo(() => {
    return computeFinancialAnalytics(masterBudgetCeiling, budgetRows, model, renegotiateLever);
  }, [budgetRows, masterBudgetCeiling, model, renegotiateLever]);

  // Per-guest velocity calculation
  const { projectedPerGuest, difference: perGuestDiff } = useMemo(() => {
    return computePerGuestMetrics(analysis.finalProjected, masterBudgetCeiling, guests);
  }, [analysis.finalProjected, masterBudgetCeiling, guests]);

  // Visual Gauge scaling percentages (clamped 0 to 100)
  const maxScale = Math.max(masterBudgetCeiling, analysis.finalProjected, analysis.totalSpent, 1) * 1.1;
  const spentPercentage = Math.min(100, (analysis.totalSpent / maxScale) * 100);
  const projectedPercentage = Math.min(100, (analysis.finalProjected / maxScale) * 100);
  const budgetMarkerPercentage = Math.min(100, (masterBudgetCeiling / maxScale) * 100);

  return (
    <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-800/80">
      {/* Header & Scenario Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
              Predictive Spending Projection & Overrun Radar
            </h3>
          </div>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Real-time statistical forecast based on category disbursements and procurement velocity
          </p>
        </div>

        {/* Model Selector Buttons */}
        <div className="flex items-center gap-1 rounded-lg border border-slate-200/80 bg-slate-100/80 p-0.5 dark:border-slate-700/80 dark:bg-slate-800/80 self-start sm:self-auto">
          <button
            onClick={() => setModel('strict')}
            className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer ${
              model === 'strict'
                ? 'bg-white text-slate-900 shadow-2xs dark:bg-slate-700 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
            title="Assumes remaining categories strictly adhere to baseline allocations"
          >
            Baseline
          </button>
          <button
            onClick={() => setModel('trend')}
            className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer ${
              model === 'trend'
                ? 'bg-white text-slate-900 shadow-2xs dark:bg-slate-700 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
            title="Extrapolates current vendor cost drift into uncommitted categories"
          >
            Trend-Weighted
          </button>
          <button
            onClick={() => setModel('stress')}
            className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer ${
              model === 'stress'
                ? 'bg-white text-slate-900 shadow-2xs dark:bg-slate-700 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
            title="Applies a +12% buffer for last-minute guest additions, overtime & rush fees"
          >
            Stress Test (+12%)
          </button>
        </div>
      </div>

      {/* Projection Scoreboard */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 mb-4">
        {/* Card 1: Projected Total Outlay */}
        <div className="rounded-xl border border-slate-200/80 bg-gradient-to-br from-slate-50/80 to-white p-3.5 shadow-2xs dark:border-slate-800 dark:from-slate-800/40 dark:to-slate-900">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider dark:text-slate-400">
            <span>Projected Final Spend</span>
            <Compass className="h-3.5 w-3.5 text-indigo-500" />
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-mono text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums">
              {formatCurrency(analysis.finalProjected, currency)}
            </span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            Target: <b className="font-mono text-slate-700 dark:text-slate-300">{formatCurrency(masterBudgetCeiling, currency)}</b>
          </div>
        </div>

        {/* Card 2: Projected Net Savings or Overrun */}
        <div
          className={`rounded-xl border p-3.5 shadow-2xs transition-all ${
            analysis.isProjectedOver
              ? 'border-rose-200 bg-rose-50/60 dark:border-rose-900/40 dark:bg-rose-950/20'
              : 'border-emerald-200 bg-emerald-50/60 dark:border-emerald-900/40 dark:bg-emerald-950/20'
          }`}
        >
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider">
            <span className={analysis.isProjectedOver ? 'text-rose-700 dark:text-rose-300' : 'text-emerald-700 dark:text-emerald-300'}>
              {analysis.isProjectedOver ? 'Projected Overrun' : 'Projected Net Savings'}
            </span>
            {analysis.isProjectedOver ? (
              <ArrowUpRight className="h-4 w-4 text-rose-600 dark:text-rose-400" />
            ) : (
              <ArrowDownRight className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            )}
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span
              className={`font-mono text-2xl font-extrabold tabular-nums ${
                analysis.isProjectedOver ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
              }`}
            >
              {analysis.isProjectedOver ? '+' : '-'}
              {formatCurrency(Math.abs(analysis.projectedVariance), currency)}
            </span>
          </div>
          <div className="mt-1 text-[11px] font-medium text-slate-600 dark:text-slate-300">
            {analysis.isProjectedOver
              ? `${Math.abs(Math.round((analysis.projectedVariance / (masterBudgetCeiling || 1)) * 100))}% above budget ceiling`
              : `${Math.round((analysis.projectedVariance / (masterBudgetCeiling || 1)) * 100)}% preserved in liquid reserve`}
          </div>
        </div>

        {/* Card 3: Projected Cost Per Guest Velocity */}
        <div className="rounded-xl border border-slate-200/80 bg-gradient-to-br from-slate-50/80 to-white p-3.5 shadow-2xs dark:border-slate-800 dark:from-slate-800/40 dark:to-slate-900">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider dark:text-slate-400">
            <span>Forecasted Cost / Guest</span>
            <Zap className="h-3.5 w-3.5 text-amber-500" />
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-mono text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums">
              {formatCurrency(projectedPerGuest, currency)}
            </span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            {perGuestDiff === 0 ? (
              'Exactly on target'
            ) : perGuestDiff > 0 ? (
              <span className="text-rose-600 dark:text-rose-400 font-semibold">
                +{formatCurrency(perGuestDiff, currency)} vs baseline
              </span>
            ) : (
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                -{formatCurrency(Math.abs(perGuestDiff), currency)} vs baseline
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Visual Runway Comparative Progress Bar */}
      <div className="rounded-xl border border-slate-200/70 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-800/30 mb-4">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">
          <span>Comparative Spending Trajectory</span>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-xs bg-slate-800 dark:bg-slate-300" />
              <span>Paid Out ({formatCurrency(analysis.totalSpent, currency)})</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className={`h-2.5 w-2.5 rounded-xs ${analysis.isProjectedOver ? 'bg-rose-500' : 'bg-indigo-600'}`} />
              <span>Projected ({formatCurrency(analysis.finalProjected, currency)})</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-3 w-0.5 bg-amber-500" />
              <span>Target Budget ({formatCurrency(masterBudgetCeiling, currency)})</span>
            </span>
          </div>
        </div>

        {/* Multi-tier Bar */}
        <div className="relative h-5 w-full rounded-md bg-slate-200 dark:bg-slate-700/80 overflow-hidden">
          {/* Target Budget Reference Line */}
          <div
            style={{ left: `${budgetMarkerPercentage}%` }}
            className="absolute top-0 bottom-0 z-20 w-1 bg-amber-500 shadow-sm"
            title={`Target Budget Limit: ${formatCurrency(masterBudgetCeiling, currency)}`}
          />

          {/* Projected Spend Layer */}
          <div
            style={{ width: `${projectedPercentage}%` }}
            className={`h-full transition-all duration-300 ${
              analysis.isProjectedOver
                ? 'bg-rose-500/35 dark:bg-rose-500/40'
                : 'bg-indigo-600/30 dark:bg-indigo-500/35'
            }`}
          />

          {/* Paid Out Layer (Solid) */}
          <div
            style={{ width: `${spentPercentage}%` }}
            className="absolute top-0 left-0 bottom-0 bg-slate-800 dark:bg-slate-200 transition-all duration-300"
          />
        </div>

        {/* Bar Subtitle */}
        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <span>0%</span>
          <span>
            {analysis.isProjectedOver ? (
              <span className="text-rose-600 dark:text-rose-400 font-semibold">
                ⚠️ Trajectory breaches ceiling by {formatCurrency(Math.abs(analysis.projectedVariance), currency)}
              </span>
            ) : (
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                ✓ Trajectory stays within budget with {formatCurrency(analysis.projectedVariance, currency)} buffer
              </span>
            )}
          </span>
          <span>Max Range ({formatCurrency(maxScale, currency)})</span>
        </div>
      </div>

      {/* Category Drift Drilldown & Actionable Mitigation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Left: Top Category Drift Drivers */}
        <div className="lg:col-span-7 rounded-xl border border-slate-200/80 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200 mb-2.5">
            <span>High-Impact Category Drift</span>
            <span className="text-[11px] text-slate-500 font-normal">Variance (Spent vs Plan)</span>
          </div>

          <div className="space-y-2">
            {analysis.topDrifting.map((categoryDrift) => {
              const isCategoryOverBudget = categoryDrift.diff > 0;
              const hasSpendActivity = categoryDrift.spent > 0;
              return (
                <div key={categoryDrift.id} className="flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 min-w-[140px] truncate">
                    <span
                      style={{ backgroundColor: categoryDrift.color || '#6366F1' }}
                      className="h-2.5 w-2.5 rounded-full shrink-0"
                    />
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {categoryDrift.name}
                    </span>
                  </div>

                  {/* Spark Bar of category consumption */}
                  <div className="flex-1 max-w-[160px] h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden hidden sm:block">
                    <div
                      style={{
                        width: `${Math.min(
                          100,
                          categoryDrift.planned > 0
                            ? (categoryDrift.spent / categoryDrift.planned) * 100
                            : 0
                        )}%`,
                        backgroundColor: isCategoryOverBudget ? '#F43F5E' : categoryDrift.color || '#6366F1'
                      }}
                      className="h-full rounded-full transition-all"
                    />
                  </div>

                  <div className="flex items-center gap-2 shrink-0 font-mono text-right tabular-nums">
                    <span className="text-slate-500 dark:text-slate-400">
                      {formatCurrency(categoryDrift.spent, currency)} / {formatCurrency(categoryDrift.planned, currency)}
                    </span>
                    <span
                      className={`text-[11px] font-bold min-w-[65px] ${
                        isCategoryOverBudget
                          ? 'text-rose-600 dark:text-rose-400'
                          : hasSpendActivity
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-slate-400'
                      }`}
                    >
                      {isCategoryOverBudget
                        ? `+${formatCurrency(categoryDrift.diff, currency)}`
                        : hasSpendActivity
                        ? 'On Track'
                        : 'Pending'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Actionable Mitigation Strategy Levers */}
        <div className="lg:col-span-5 rounded-xl border border-indigo-100 bg-indigo-50/40 p-3.5 dark:border-indigo-900/30 dark:bg-indigo-950/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900 dark:text-indigo-200 mb-1">
              <ShieldCheck className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <span>Tactical Mitigation Levers</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
              Test cost-control scenarios to maintain fiscal equilibrium before finalizing contracts.
            </p>

            <div className="mt-3 space-y-2">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={renegotiateLever}
                  onChange={(event) => setRenegotiateLever(event.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 cursor-pointer"
                />
                <span>Simulate -8% Vendor Procurement Discount</span>
              </label>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 pl-6">
                Applies package bundling (e.g. photo+video or decor+lighting) to unbooked categories, projecting savings of{' '}
                <b className="font-mono text-indigo-600 dark:text-indigo-400">
                  {formatCurrency(Math.round(analysis.unspentPlanned * 0.08), currency)}
                </b>.
              </p>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-indigo-100 dark:border-indigo-900/30 text-[11px] text-indigo-700 dark:text-indigo-300 font-medium">
            {analysis.isProjectedOver ? (
              <span>💡 Reallocate from remaining unbooked line items to prevent dipping into contingency reserves.</span>
            ) : (
              <span>✨ Fiscal trajectory is healthy. Surplus reserve can fund enhanced guest favors or live artist upgrades.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
