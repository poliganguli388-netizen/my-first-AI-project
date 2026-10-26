import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SpendingProjectionPanel } from '../components/SpendingProjectionPanel';
import { FinancialHealthCard } from '../components/FinancialHealthCard';
import { BudgetRow } from '../types';

describe('React Component Suite', () => {
  const sampleRows: BudgetRow[] = [
    { id: '1', name: 'Grand Ballroom', planned: 250000, spent: 250000, color: '#6366f1' },
    { id: '2', name: 'Gourmet Catering', planned: 300000, spent: 150000, color: '#10b981' },
  ];

  describe('SpendingProjectionPanel component', () => {
    it('renders the projection radar header and scenario buttons', () => {
      render(
        <SpendingProjectionPanel
          budget={600000}
          currency="₹"
          budgetRows={sampleRows}
          guests={200}
        />
      );

      expect(
        screen.getByText(/Predictive Spending Projection & Overrun Radar/i)
      ).toBeDefined();
      expect(screen.getByText('Baseline')).toBeDefined();
      expect(screen.getByText('Trend-Weighted')).toBeDefined();
      expect(screen.getByText(/Stress Test/i)).toBeDefined();
    });

    it('renders projected spend and per-guest velocity cards', () => {
      render(
        <SpendingProjectionPanel
          budget={600000}
          currency="₹"
          budgetRows={sampleRows}
          guests={200}
        />
      );

      expect(screen.getByText(/Forecasted Cost \/ Guest/i)).toBeDefined();
      expect(screen.getByText(/Comparative Spending Trajectory/i)).toBeDefined();
    });
  });

  describe('FinancialHealthCard component', () => {
    it('renders overall total budget, planned, spent, and remaining metrics', () => {
      render(
        <FinancialHealthCard
          budget={600000}
          currency="₹"
          budgetRows={sampleRows}
          guests={200}
        />
      );

      expect(screen.getByText(/Target Budget/i)).toBeDefined();
      expect(screen.getByText(/Allocated/i)).toBeDefined();
      expect(screen.getByText(/Disbursed/i)).toBeDefined();
      expect(screen.getByText(/Remaining/i)).toBeDefined();
    });
  });
});
