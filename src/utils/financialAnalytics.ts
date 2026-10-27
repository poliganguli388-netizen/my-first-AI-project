/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * EventCraft AI - Predictive Financial Analytics & Scenario Modeling Engine
 * 
 * Provides statistical algorithms, burn-rate velocity calculations, and predictive
 * econometric forecasting models (Strict Baseline, Trend-Weighted, and Stress-Testing)
 * to estimate budget variances, cost overruns, and potential savings.
 */

import { BudgetRow } from '../types';

/** Simulation model scenario options for financial forecasting */
export type ProjectionModel = 'strict' | 'trend' | 'stress';

/**
 * Detailed telemetry and variance metric for an individual budget line item.
 */
export interface CategoryDrift {
  /** Identifier of the line item */
  id: string;
  /** Human-readable category designation */
  name: string;
  /** Accent color identifier for visual graphing */
  color?: string;
  /** Baseline allocated amount */
  planned: number;
  /** Actual disbursed amount */
  spent: number;
  /** Absolute difference (spent - planned); positive values signify overages */
  diff: number;
  /** Velocity ratio (spent / planned) */
  ratio: number;
  /** True if any actual spending has been recorded */
  isStarted: boolean;
}

/**
 * Comprehensive analytical breakdown of current financial posture and predictive outlook.
 */
export interface FinancialAnalyticsResult {
  /** Sum of planned allocations across all line items */
  totalPlanned: number;
  /** Sum of realized expenditures to date */
  totalSpent: number;
  /** Number of categories that have initiated financial activity */
  startedCategoriesCount: number;
  /** Number of categories currently exceeding their planned ceiling */
  overageCategoriesCount: number;
  /** Empirical burn-rate drift factor observed across active categories */
  activeDriftMultiplier: number;
  /** Uncommitted planned allocations for categories with zero current spend */
  unspentPlanned: number;
  /** Strict baseline projection (committed spend + unspent planned allocations) */
  strictProjected: number;
  /** Trend-weighted forecast extrapolating current category spending velocities */
  trendProjected: number;
  /** High-stress scenario incorporating risk buffers (+12%) for rush premiums */
  stressProjected: number;
  /** Active forecast selected according to the active projection model */
  finalProjected: number;
  /** Expected monetary variance relative to the total budget (positive = savings, negative = overrun) */
  projectedVariance: number;
  /** Boolean flag indicating whether the projection breaches the event budget ceiling */
  isProjectedOver: boolean;
  /** Absolute variance amount in primary currency units */
  savingsOrOverageAmount: number;
  /** Percentage ratio of variance relative to total budget */
  variancePercentage: number;
  /** Priority ranked categories contributing most significantly to budget drift */
  topDrifting: CategoryDrift[];
  /** Complete list of category drift analyses */
  categoryDrifts: CategoryDrift[];
  /** Overall financial health assessment score */
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
}

/**
 * Computes predictive spending projection and risk analytics based on planned allocations,
 * actual historical disbursements, and scenario modeling parameters.
 *
 * @param totalBudget - Overall event budget ceiling in primary currency.
 * @param budgetRows - Array of category budget items.
 * @param model - Active forecast model ('strict' | 'trend' | 'stress').
 * @param renegotiateLever - Whether the 8% procurement negotiation discount is applied.
 * @returns Comprehensive analytical financial health breakdown.
 * 
 * @example
 * computeFinancialAnalytics(1000000, rows, 'trend', false);
 */
export function computeFinancialAnalytics(
  totalBudget: number,
  budgetRows: BudgetRow[] = [],
  model: ProjectionModel = 'trend',
  renegotiateLever: boolean = false
): FinancialAnalyticsResult {
  const safeBudget = Number.isFinite(totalBudget) ? Math.max(0, totalBudget) : 0;

  let totalPlanned = 0;
  let totalSpent = 0;
  let overageCategoriesCount = 0;
  let startedCategoriesCount = 0;
  let sumActivePlanned = 0;
  let sumActiveSpent = 0;

  const categoryDrifts: CategoryDrift[] = (budgetRows || []).map((row) => {
    const rawPlanned = Number(row?.planned);
    const rawSpent = Number(row?.spent);

    const planned = Number.isFinite(rawPlanned) ? Math.max(0, rawPlanned) : 0;
    const spent = Number.isFinite(rawSpent) ? Math.max(0, rawSpent) : 0;

    totalPlanned += planned;
    totalSpent += spent;

    const isStarted = spent > 0;
    if (isStarted) {
      startedCategoriesCount++;
      sumActivePlanned += planned;
      sumActiveSpent += spent;
    }

    const diff = spent - planned;
    const ratio = planned > 0 ? spent / planned : spent > 0 ? 2.0 : 1.0;
    if (diff > 0) {
      overageCategoriesCount++;
    }

    return {
      id: row?.id || `cat-${Math.random().toString(36).substring(2, 7)}`,
      name: row?.name || 'Unspecified Category',
      color: row?.color,
      planned,
      spent,
      diff,
      ratio,
      isStarted,
    };
  });

  // Average drift multiplier on categories where spending has started
  const activeDriftMultiplier =
    sumActivePlanned > 0
      ? Math.max(0.85, Math.min(1.45, sumActiveSpent / sumActivePlanned))
      : 1.0;

  // Uncommitted / pending planned allocations
  const unspentPlanned = categoryDrifts
    .filter((category) => !category.isStarted)
    .reduce((accumulatedTotal, category) => accumulatedTotal + category.planned, 0);

  // Model 1: Strict / Baseline - Committed spent + remaining planned
  const strictProjected = categoryDrifts.reduce((accumulatedTotal, category) => {
    return accumulatedTotal + Math.max(category.spent, category.planned);
  }, 0);

  // Model 2: Trend-Weighted - Active follow current ratio, pending follow active drift factor
  const trendMultiplier = activeDriftMultiplier > 1 ? activeDriftMultiplier : 1.04;
  const trendProjected = categoryDrifts.reduce((accumulatedTotal, category) => {
    if (category.isStarted) {
      return accumulatedTotal + Math.max(category.spent, category.planned * (category.ratio > 1 ? category.ratio : 1.0));
    }
    const adjustedPlanned = category.planned * (renegotiateLever ? 0.92 : trendMultiplier);
    return accumulatedTotal + adjustedPlanned;
  }, 0);

  // Model 3: Stress-Test - Adds +12% surcharge contingency for overtime, last-minute rushes
  const stressProjected = renegotiateLever
    ? trendProjected * 1.04
    : strictProjected * 1.12;

  let finalProjected = trendProjected;
  if (model === 'strict') {
    finalProjected = strictProjected;
  }
  if (model === 'stress') {
    finalProjected = stressProjected;
  }

  const roundedFinal = Math.round(finalProjected);
  const projectedVariance = Math.round(safeBudget - roundedFinal);
  const isProjectedOver = projectedVariance < 0;
  const savingsOrOverageAmount = Math.abs(projectedVariance);

  const variancePercentage =
    safeBudget > 0 ? (savingsOrOverageAmount / safeBudget) * 100 : 0;

  // Top drifting categories sorted by highest overage or variance
  const topDrifting = [...categoryDrifts]
    .sort((firstCategory, secondCategory) => secondCategory.diff - firstCategory.diff)
    .slice(0, 4);

  // Determine risk level
  let riskLevel: 'low' | 'moderate' | 'high' | 'critical' = 'low';
  if (isProjectedOver) {
    if (variancePercentage > 20) {
      riskLevel = 'critical';
    } else if (variancePercentage > 8) {
      riskLevel = 'high';
    } else {
      riskLevel = 'moderate';
    }
  } else if (overageCategoriesCount >= 2) {
    riskLevel = 'moderate';
  }

  return {
    totalPlanned: Math.round(totalPlanned),
    totalSpent: Math.round(totalSpent),
    startedCategoriesCount,
    overageCategoriesCount,
    activeDriftMultiplier: Number(activeDriftMultiplier.toFixed(2)),
    unspentPlanned: Math.round(unspentPlanned),
    strictProjected: Math.round(strictProjected),
    trendProjected: Math.round(trendProjected),
    stressProjected: Math.round(stressProjected),
    finalProjected: roundedFinal,
    projectedVariance,
    isProjectedOver,
    savingsOrOverageAmount,
    variancePercentage: Number(variancePercentage.toFixed(1)),
    topDrifting,
    categoryDrifts,
    riskLevel,
  };
}

/**
 * Computes attendee per-capita spending velocity and target variance metrics.
 * 
 * @param projectedTotal - Projected total event expenditure.
 * @param targetBudget - Master target budget ceiling.
 * @param guestCount - Total confirmed or estimated guest count.
 * @returns Per-guest baseline and projected velocity metrics.
 */
export function computePerGuestMetrics(
  projectedTotal: number,
  targetBudget: number,
  guestCount: number
): {
  projectedPerGuest: number;
  targetPerGuest: number;
  difference: number;
  budgetPerGuest: number;
  perGuestVariance: number;
} {
  const safeGuestCount = guestCount > 0 ? guestCount : 0;
  if (safeGuestCount === 0) {
    return {
      projectedPerGuest: 0,
      targetPerGuest: 0,
      difference: 0,
      budgetPerGuest: 0,
      perGuestVariance: 0,
    };
  }

  const projectedPerGuest = Math.round(projectedTotal / safeGuestCount);
  const targetPerGuest = Math.round(targetBudget / safeGuestCount);
  const difference = projectedPerGuest - targetPerGuest;

  return {
    projectedPerGuest,
    targetPerGuest,
    difference,
    budgetPerGuest: targetPerGuest,
    perGuestVariance: difference,
  };
}
