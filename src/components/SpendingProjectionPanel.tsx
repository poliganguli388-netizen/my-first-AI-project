import React, { useState, useMemo } from 'react';
import { TrendingUp, AlertTriangle, ShieldCheck, Zap, ArrowUpRight, ArrowDownRight, Compass, Sparkles } from 'lucide-react';
import { BudgetRow } from '../types';
import { formatCurrency } from '../utils/formatters';

interface SpendingProjectionPanelProps {
  budget: number;
  currency: string;
  budgetRows: BudgetRow[];
  guests: number;
}

export type ProjectionModel = 'strict' | 'trend' | 'stress';

export const SpendingProjectionPanel: React.FC<SpendingProjectionPanelProps> = ({
  budget,
  currency,
  budgetRows,
  guests
}) => {
  const [model, setModel] = useState<ProjectionModel>('trend');
  const [renegotiateLever, setRenegotiateLever] = useState(false);

  const totalB = Number(budget) || 0;

  // Analysis of spending patterns across categories
  const analysis = useMemo(() => {
    let totalPlanned = 0;
    let totalSpent = 0;
    let overageCategoriesCount = 0;
    let startedCategoriesCount = 0;
    let sumActivePlanned = 0;
    let sumActiveSpent = 0;

    const categoryDrifts = budgetRows.map((r) => {
      const planned = Number(r.planned) || 0;
      const spent = Number(r.spent) || 0;
      totalPlanned += planned;
      totalSpent += spent;

      const isStarted = spent > 0;
      if (isStarted) {
        startedCategoriesCount++;
        sumActivePlanned += planned;
        sumActiveSpent += spent;
      }

      const diff = spent - planned;
      const ratio = planned > 0 ? spent / planned : 1;
      if (diff > 0) overageCategoriesCount++;

      return {
        id: r.id,
        name: r.name,
        color: r.color,
        planned,
        spent,
        diff,
        ratio,
        isStarted
      };
    });

    // Average drift multiplier on active categories
    const activeDriftMultiplier =
      sumActivePlanned > 0 ? Math.max(0.9, Math.min(1.4, sumActiveSpent / sumActivePlanned)) : 1.0;

    // Uncommitted / pending planned amount
    const unspentPlanned = categoryDrifts
      .filter((c) => !c.isStarted)
      .reduce((acc, c) => acc + c.planned, 0);

    const activeRemaining = categoryDrifts
      .filter((c) => c.isStarted)
      .reduce((acc, c) => acc + Math.max(0, c.planned - c.spent), 0);

    // Compute Projected Final Spend for each model:
    // 1. Strict: Already committed spent + remaining planned
    const strictProjected = categoryDrifts.reduce((acc, c) => {
      return acc + Math.max(c.spent, c.planned);
    }, 0);

    // 2. Trend: Active categories follow their current trend; pending categories follow the activeDriftMultiplier
    const trendMultiplier = activeDriftMultiplier > 1 ? activeDriftMultiplier : 1.04;
    const trendProjected = categoryDrifts.reduce((acc, c) => {
      if (c.isStarted) {
        // If spent already exceeds planned, keep spent or extrapolate slightly if ongoing
        return acc + Math.max(c.spent, c.planned * (c.ratio > 1 ? c.ratio : 1.0));
      }
      // Pending category with trend factor (discounted if lever active)
      const adjusted = c.planned * (renegotiateLever ? 0.92 : trendMultiplier);
      return acc + adjusted;
    }, 0);

    // 3. Stress: Adds a +12% surcharge contingency for overtime, last minute rushes
    const stressProjected = (renegotiateLever ? trendProjected : strictProjected * 1.12);

    let finalProjected = trendProjected;
    if (model === 'strict') finalProjected = strictProjected;
    if (model === 'stress') finalProjected = stressProjected;

    // Variance vs Total Budget
    const projectedVariance = totalB - finalProjected; // positive = savings, negative = overrun
    const isProjectedOver = projectedVariance < 0;

    // Top trending drift categories (sorted by absolute variance or overage)
    const topDrifting = [...categoryDrifts]
      .sort((a, b) => b.diff - a.diff)
      .slice(0, 4);

    return {
      totalPlanned,
      totalSpent,
      startedCategoriesCount,
      overageCategoriesCount,
      activeDriftMultiplier,
      unspentPlanned,
      strictProjected: Math.round(strictProjected),
      trendProjected: Math.round(trendProjected),
      stressProjected: Math.round(stressProjected),
      finalProjected: Math.round(finalProjected),
      projectedVariance: Math.round(projectedVariance),
      isProjectedOver,
      topDrifting
    };
  }, [budgetRows, totalB, model, renegotiateLever]);

  const projectedPerGuest = guests > 0 ? Math.round(analysis.finalProjected / guests) : 0;
  const targetPerGuest = guests > 0 ? Math.round(totalB / guests) : 0;
  const perGuestDiff = projectedPerGuest - targetPerGuest;

  // Visual Gauge percentages (clamped 0 to 100)
  const maxScale = Math.max(totalB, analysis.finalProjected, analysis.totalSpent, 1) * 1.1;
  const spentPct = Math.min(100, (analysis.totalSpent / maxScale) * 100);
  const projectedPct = Math.min(100, (analysis.finalProjected / maxScale) * 100);
  const budgetMarkerPct = Math.min(100, (totalB / maxScale) * 100);

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
            Target: <b className="font-mono text-slate-700 dark:text-slate-300">{formatCurrency(totalB, currency)}</b>
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
              ? `${Math.abs(Math.round((analysis.projectedVariance / (totalB || 1)) * 100))}% above budget ceiling`
              : `${Math.round((analysis.projectedVariance / (totalB || 1)) * 100)}% preserved in liquid reserve`}
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
              <span>Target Budget ({formatCurrency(totalB, currency)})</span>
            </span>
          </div>
        </div>

        {/* Multi-tier Bar */}
        <div className="relative h-5 w-full rounded-md bg-slate-200 dark:bg-slate-700/80 overflow-hidden">
          {/* Target Budget Reference Line */}
          <div
            style={{ left: `${budgetMarkerPct}%` }}
            className="absolute top-0 bottom-0 z-20 w-1 bg-amber-500 shadow-sm"
            title={`Target Budget Limit: ${formatCurrency(totalB, currency)}`}
          />

          {/* Projected Spend Layer */}
          <div
            style={{ width: `${projectedPct}%` }}
            className={`h-full transition-all duration-300 ${
              analysis.isProjectedOver
                ? 'bg-rose-500/35 dark:bg-rose-500/40'
                : 'bg-indigo-600/30 dark:bg-indigo-500/35'
            }`}
          />

          {/* Paid Out Layer (Solid) */}
          <div
            style={{ width: `${spentPct}%` }}
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
            {analysis.topDrifting.map((cat) => {
              const isOver = cat.diff > 0;
              const hasSpend = cat.spent > 0;
              return (
                <div key={cat.id} className="flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 min-w-[140px] truncate">
                    <span
                      style={{ backgroundColor: cat.color || '#6366F1' }}
                      className="h-2.5 w-2.5 rounded-full shrink-0"
                    />
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {cat.name}
                    </span>
                  </div>

                  {/* Spark Bar of category consumption */}
                  <div className="flex-1 max-w-[160px] h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden hidden sm:block">
                    <div
                      style={{
                        width: `${Math.min(100, cat.planned > 0 ? (cat.spent / cat.planned) * 100 : 0)}%`,
                        backgroundColor: isOver ? '#F43F5E' : cat.color || '#6366F1'
                      }}
                      className="h-full rounded-full transition-all"
                    />
                  </div>

                  <div className="flex items-center gap-2 shrink-0 font-mono text-right tabular-nums">
                    <span className="text-slate-500 dark:text-slate-400">
                      {formatCurrency(cat.spent, currency)} / {formatCurrency(cat.planned, currency)}
                    </span>
                    <span
                      className={`text-[11px] font-bold min-w-[65px] ${
                        isOver
                          ? 'text-rose-600 dark:text-rose-400'
                          : hasSpend
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-slate-400'
                      }`}
                    >
                      {isOver ? `+${formatCurrency(cat.diff, currency)}` : hasSpend ? 'On Track' : 'Pending'}
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
                  onChange={(e) => setRenegotiateLever(e.target.checked)}
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
