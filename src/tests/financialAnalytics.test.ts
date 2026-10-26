import { describe, it, expect } from 'vitest';
import {
  computeFinancialAnalytics,
  computePerGuestMetrics,
} from '../utils/financialAnalytics';
import { BudgetRow } from '../types';

describe('financialAnalytics suite', () => {
  const sampleRows: BudgetRow[] = [
    { id: '1', name: 'Venue & Decor', planned: 200000, spent: 220000 }, // Over budget (+20k)
    { id: '2', name: 'Catering', planned: 300000, spent: 150000 },      // In progress
    { id: '3', name: 'Photography', planned: 80000, spent: 0 },         // Unstarted
  ];

  describe('computeFinancialAnalytics', () => {
    it('computes total planned and spent accurately', () => {
      const result = computeFinancialAnalytics(600000, sampleRows, 'strict', false);
      expect(result.totalPlanned).toBe(580000);
      expect(result.totalSpent).toBe(370000);
      expect(result.startedCategoriesCount).toBe(2);
      expect(result.overageCategoriesCount).toBe(1);
    });

    it('calculates strict / baseline projection correctly', () => {
      // Venue: max(220k, 200k) = 220k
      // Catering: max(150k, 300k) = 300k
      // Photography: max(0, 80k) = 80k
      // Total Strict = 600k
      const result = computeFinancialAnalytics(600000, sampleRows, 'strict', false);
      expect(result.strictProjected).toBe(600000);
      expect(result.finalProjected).toBe(600000);
      expect(result.projectedVariance).toBe(0);
      expect(result.isProjectedOver).toBe(false);
    });

    it('identifies projected overrun when spending exceeds budget', () => {
      const overRows: BudgetRow[] = [
        { id: '1', name: 'Venue', planned: 100000, spent: 150000 },
        { id: '2', name: 'Catering', planned: 100000, spent: 120000 },
      ];
      const result = computeFinancialAnalytics(200000, overRows, 'strict', false);
      expect(result.isProjectedOver).toBe(true);
      expect(result.projectedVariance).toBeLessThan(0);
      expect(result.savingsOrOverageAmount).toBe(70000);
      expect(result.riskLevel).toBe('critical');
    });

    it('applies stress test contingency (+12%) properly', () => {
      const result = computeFinancialAnalytics(600000, sampleRows, 'stress', false);
      expect(result.stressProjected).toBeGreaterThan(result.strictProjected);
      expect(result.finalProjected).toBe(result.stressProjected);
    });

    it('applies renegotiation lever discount', () => {
      const withoutLever = computeFinancialAnalytics(600000, sampleRows, 'trend', false);
      const withLever = computeFinancialAnalytics(600000, sampleRows, 'trend', true);
      expect(withLever.trendProjected).toBeLessThanOrEqual(withoutLever.trendProjected);
    });

    it('safely handles empty rows and zero budget', () => {
      const result = computeFinancialAnalytics(0, [], 'trend', false);
      expect(result.totalPlanned).toBe(0);
      expect(result.totalSpent).toBe(0);
      expect(result.finalProjected).toBe(0);
      expect(result.projectedVariance).toBe(0);
      expect(result.isProjectedOver).toBe(false);
    });
  });

  describe('computePerGuestMetrics', () => {
    it('calculates per guest spending and variance accurately', () => {
      const metrics = computePerGuestMetrics(500000, 400000, 200);
      expect(metrics.projectedPerGuest).toBe(2500); // 500,000 / 200
      expect(metrics.targetPerGuest).toBe(2000);    // 400,000 / 200
      expect(metrics.difference).toBe(500);
    });

    it('gracefully handles 0 guests without divide-by-zero errors', () => {
      const metrics = computePerGuestMetrics(500000, 400000, 0);
      expect(metrics.projectedPerGuest).toBe(0);
      expect(metrics.targetPerGuest).toBe(0);
      expect(metrics.difference).toBe(0);
    });
  });
});
