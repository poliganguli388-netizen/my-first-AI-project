/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BudgetRow } from '../types';

export type ProjectionModel = 'strict' | 'trend' | 'stress';

export interface CategoryDrift {
  id: string;
  name: string;
  color?: string;
  planned: number;
  spent: number;
  diff: number;
  ratio: number;
  isStarted: boolean;
}

export interface FinancialAnalyticsResult {
  totalPlanned: number;
  totalSpent: number;
  startedCategoriesCount: number;
  overageCategoriesCount: number;
  activeDriftMultiplier: number;
  unspentPlanned: number;
  strictProjected: number;
  trendProjected: number;
  stressProjected: number;
  finalProjected: number;
  projectedVariance: number; // positive = savings, negative = overrun
  isProjectedOver: boolean;
  savingsOrOverageAmount: number; // absolute value
  variancePercentage: number;
  topDrifting: CategoryDrift[];
  categoryDrifts: CategoryDrift[];
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
}

/**
 * Computes predictive spending projection and risk analytics based on planned allocations,
 * actual historical disbursements, and scenario modeling parameters.
 *
 * @param totalBudget Overall event budget ceiling
 * @param budgetRows Breakdown of category line items
 * @param model Active projection model ('strict' | 'trend' | 'stress')
 * @param renegotiateLever Whether procurement negotiation savings discount (8%) is active
 * @returns FinancialAnalyticsResult Comprehensive analytical breakdown
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
    .filter((c) => !c.isStarted)
    .reduce((acc, c) => acc + c.planned, 0);

  // Model 1: Strict / Baseline - Committed spent + remaining planned
  const strictProjected = categoryDrifts.reduce((acc, c) => {
    return acc + Math.max(c.spent, c.planned);
  }, 0);

  // Model 2: Trend-Weighted - Active follow current ratio, pending follow active drift factor
  const trendMultiplier = activeDriftMultiplier > 1 ? activeDriftMultiplier : 1.04;
  const trendProjected = categoryDrifts.reduce((acc, c) => {
    if (c.isStarted) {
      return acc + Math.max(c.spent, c.planned * (c.ratio > 1 ? c.ratio : 1.0));
    }
    const adjusted = c.planned * (renegotiateLever ? 0.92 : trendMultiplier);
    return acc + adjusted;
  }, 0);

  // Model 3: Stress-Test - Adds +12% surcharge contingency for overtime, last-minute rushes
  const stressProjected = renegotiateLever
    ? trendProjected * 1.04
    : strictProjected * 1.12;

  let finalProjected = trendProjected;
  if (model === 'strict') finalProjected = strictProjected;
  if (model === 'stress') finalProjected = stressProjected;

  const roundedFinal = Math.round(finalProjected);
  const projectedVariance = Math.round(safeBudget - roundedFinal);
  const isProjectedOver = projectedVariance < 0;
  const savingsOrOverageAmount = Math.abs(projectedVariance);

  const variancePercentage =
    safeBudget > 0 ? (savingsOrOverageAmount / safeBudget) * 100 : 0;

  // Top drifting categories sorted by highest overage or variance
  const topDrifting = [...categoryDrifts]
    .sort((a, b) => b.diff - a.diff)
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
 * Calculates per-guest spend velocity and target deviation.
 */
export function computePerGuestMetrics(
  finalProjected: number,
  totalBudget: number,
  guestCount: number
): {
  projectedPerGuest: number;
  targetPerGuest: number;
  difference: number;
} {
  const safeGuests = Number.isFinite(guestCount) && guestCount > 0 ? Math.floor(guestCount) : 0;
  if (safeGuests === 0) {
    return { projectedPerGuest: 0, targetPerGuest: 0, difference: 0 };
  }

  const projectedPerGuest = Math.round(finalProjected / safeGuests);
  const targetPerGuest = Math.round(totalBudget / safeGuests);
  return {
    projectedPerGuest,
    targetPerGuest,
    difference: projectedPerGuest - targetPerGuest,
  };
}
