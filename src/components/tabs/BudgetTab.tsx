/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * EventCraft AI - Budget Management Tab
 * 
 * Interactive category breakdown, planned allocation tracking, disbursement monitoring,
 * and real-time overage alert calculations.
 */

import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { BudgetRow } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { COLORS } from '../../data/templates';

interface BudgetTabProps {
  /** List of defined budget categories */
  budgetRows: BudgetRow[];
  /** Active currency symbol */
  currency: string;
  /** Overall event budget ceiling */
  totalBudget: number;
  /** Type-safe callback invoked when modifying category fields */
  onUpdateRow: <K extends keyof BudgetRow>(id: string, field: K, value: BudgetRow[K]) => void;
  /** Callback to delete a category by identifier */
  onDeleteRow: (id: string) => void;
  /** Callback to append a new category row */
  onAddRow: (name: string, planned: number) => void;
}

export const BudgetTab: React.FC<BudgetTabProps> = ({
  budgetRows,
  currency,
  totalBudget,
  onUpdateRow,
  onDeleteRow,
  onAddRow
}) => {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newPlannedAmount, setNewPlannedAmount] = useState('');

  /**
   * Handles user submission of a new budget line item.
   */
  const handleAddCategorySubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!newCategoryName.trim()) {
      return;
    }
    const parsedPlannedAmount = Number(newPlannedAmount) || 0;
    onAddRow(newCategoryName.trim(), parsedPlannedAmount);
    setNewCategoryName('');
    setNewPlannedAmount('');
  };

  const totalPlannedAllocation = budgetRows.reduce(
    (accumulatedTotal, budgetRow) => accumulatedTotal + (budgetRow.planned || 0),
    0
  );
  const totalDisbursedSpend = budgetRows.reduce(
    (accumulatedTotal, budgetRow) => accumulatedTotal + (budgetRow.spent || 0),
    0
  );
  const overageCategoryCount = budgetRows.filter(
    (budgetRow) => (budgetRow.spent || 0) > (budgetRow.planned || 0)
  ).length;

  return (
    <div className="space-y-4">
      {/* Category Micro Summary Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800 text-xs">
        <div className="flex items-center gap-3">
          <span className="text-slate-500 dark:text-slate-400">
            Total Allocated:{' '}
            <b className="font-mono text-slate-900 dark:text-white tabular-nums">
              {formatCurrency(totalPlannedAllocation, currency)}
            </b>
          </span>
          <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
          <span className="text-slate-500 dark:text-slate-400">
            Disbursed:{' '}
            <b className="font-mono text-slate-900 dark:text-white tabular-nums">
              {formatCurrency(totalDisbursedSpend, currency)}
            </b>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {overageCategoryCount > 0 ? (
            <span className="inline-flex items-center gap-1 font-semibold text-rose-600 dark:text-rose-400 text-xs">
              <AlertCircle className="h-3.5 w-3.5" />
              <span>
                {overageCategoryCount}{' '}
                {overageCategoryCount === 1 ? 'category exceeds' : 'categories exceed'} planned budget
              </span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400 text-xs">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>All active disbursements within targets</span>
            </span>
          )}
        </div>
      </div>

      {/* Category List */}
      <div className="space-y-2">
        {budgetRows.map((budgetRow, categoryIndex) => {
          const isCategoryOverBudget = (budgetRow.spent || 0) > (budgetRow.planned || 0);
          const categoryVariance = (budgetRow.planned || 0) - (budgetRow.spent || 0);
          const percentageOfMasterBudget =
            totalBudget > 0
              ? Math.round(((budgetRow.planned || 0) / totalBudget) * 100)
              : 0;
          const disbursementPercentage =
            budgetRow.planned > 0
              ? Math.round(((budgetRow.spent || 0) / budgetRow.planned) * 100)
              : 0;

          return (
            <div
              key={budgetRow.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-200/80 bg-white p-3.5 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 transition-colors shadow-2xs"
            >
              <div className="flex items-center gap-3 flex-1 min-w-[200px]">
                <span
                  style={{ backgroundColor: budgetRow.color || COLORS[categoryIndex % COLORS.length] }}
                  className="h-3 w-3 rounded-full shrink-0 shadow-xs"
                />
                <input
                  type="text"
                  value={budgetRow.name}
                  onChange={(event) => onUpdateRow(budgetRow.id, 'name', event.target.value)}
                  placeholder="Category Name"
                  className="w-full bg-transparent font-bold text-slate-900 focus:outline-none dark:text-white text-sm"
                />
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono shrink-0">
                  {percentageOfMasterBudget}% of total
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                {/* Planned Input */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider dark:text-slate-400">
                    Planned
                  </span>
                  <div className="relative">
                    <span className="absolute left-2 top-1.5 text-xs text-slate-400 font-mono">
                      {currency}
                    </span>
                    <input
                      type="number"
                      value={budgetRow.planned}
                      onChange={(event) =>
                        onUpdateRow(budgetRow.id, 'planned', Number(event.target.value) || 0)
                      }
                      className="w-24 rounded-lg border border-slate-200 bg-slate-50 py-1 pl-6 pr-2 text-right font-mono text-xs font-semibold text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 tabular-nums"
                    />
                  </div>
                </div>

                {/* Paid Input */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider dark:text-slate-400">
                    Paid
                  </span>
                  <div className="relative">
                    <span className="absolute left-2 top-1.5 text-xs text-slate-400 font-mono">
                      {currency}
                    </span>
                    <input
                      type="number"
                      value={budgetRow.spent}
                      onChange={(event) =>
                        onUpdateRow(budgetRow.id, 'spent', Number(event.target.value) || 0)
                      }
                      className="w-24 rounded-lg border border-slate-200 bg-slate-50 py-1 pl-6 pr-2 text-right font-mono text-xs font-semibold text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 tabular-nums"
                    />
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="min-w-[100px] text-right font-mono text-xs">
                  <span
                    className={`inline-block font-semibold ${
                      isCategoryOverBudget
                        ? 'text-rose-600 dark:text-rose-400'
                        : 'text-emerald-600 dark:text-emerald-400'
                    }`}
                  >
                    {isCategoryOverBudget
                      ? `+${formatCurrency(Math.abs(categoryVariance), currency)} over`
                      : `${formatCurrency(categoryVariance, currency)} left`}
                  </span>
                  <div className="text-[10px] text-slate-400 tabular-nums">
                    {disbursementPercentage}% disbursed
                  </div>
                </div>

                <button
                  onClick={() => onDeleteRow(budgetRow.id)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-rose-600 dark:hover:bg-slate-800 dark:hover:text-rose-400 transition-colors cursor-pointer"
                  title="Delete category"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}

        {budgetRows.length === 0 && (
          <div className="py-10 text-center text-sm text-slate-500 dark:text-slate-400">
            No budget categories created yet. Click below or load a starter template!
          </div>
        )}
      </div>

      {/* Add Category Form */}
      <form
        onSubmit={handleAddCategorySubmit}
        className="flex flex-wrap items-center gap-2 pt-4 border-t border-dashed border-slate-200 dark:border-slate-800"
      >
        <input
          type="text"
          value={newCategoryName}
          onChange={(event) => setNewCategoryName(event.target.value)}
          placeholder="New Category (e.g. Return Favors, DJ/Audio, Floral Gate)"
          className="flex-1 min-w-[200px] rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-medium text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        />
        <div className="relative">
          <span className="absolute left-2.5 top-2 text-xs text-slate-400 font-mono">
            {currency}
          </span>
          <input
            type="number"
            value={newPlannedAmount}
            onChange={(event) => setNewPlannedAmount(event.target.value)}
            placeholder="Planned"
            className="w-32 rounded-xl border border-slate-200 bg-slate-50 py-2 pl-6 pr-2 text-xs font-medium text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 font-mono tabular-nums"
          />
        </div>
        <button
          type="submit"
          className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 transition-colors cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Category</span>
        </button>
      </form>
    </div>
  );
};
