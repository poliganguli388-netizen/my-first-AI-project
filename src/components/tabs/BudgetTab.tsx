import React, { useState } from 'react';
import { Plus, Trash2, PieChart, CheckCircle2, AlertCircle } from 'lucide-react';
import { BudgetRow } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { COLORS } from '../../data/templates';

interface BudgetTabProps {
  budgetRows: BudgetRow[];
  currency: string;
  totalBudget: number;
  onUpdateRow: (id: string, field: keyof BudgetRow, value: any) => void;
  onDeleteRow: (id: string) => void;
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
  const [newName, setNewName] = useState('');
  const [newAmt, setNewAmt] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const amt = Number(newAmt) || 0;
    onAddRow(newName.trim(), amt);
    setNewName('');
    setNewAmt('');
  };

  const totalPlanned = budgetRows.reduce((a, b) => a + (b.planned || 0), 0);
  const totalPaid = budgetRows.reduce((a, b) => a + (b.spent || 0), 0);
  const overCount = budgetRows.filter((r) => (r.spent || 0) > (r.planned || 0)).length;

  return (
    <div className="space-y-4">
      {/* Category Micro Summary Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800 text-xs">
        <div className="flex items-center gap-3">
          <span className="text-slate-500 dark:text-slate-400">
            Total Allocated: <b className="font-mono text-slate-900 dark:text-white tabular-nums">{formatCurrency(totalPlanned, currency)}</b>
          </span>
          <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
          <span className="text-slate-500 dark:text-slate-400">
            Disbursed: <b className="font-mono text-slate-900 dark:text-white tabular-nums">{formatCurrency(totalPaid, currency)}</b>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {overCount > 0 ? (
            <span className="inline-flex items-center gap-1 font-semibold text-rose-600 dark:text-rose-400 text-xs">
              <AlertCircle className="h-3.5 w-3.5" />
              <span>{overCount} {overCount === 1 ? 'category exceeds' : 'categories exceed'} planned budget</span>
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
        {budgetRows.map((r, i) => {
          const isOver = (r.spent || 0) > (r.planned || 0);
          const diff = (r.planned || 0) - (r.spent || 0);
          const pctOfTotal = totalBudget > 0 ? Math.round(((r.planned || 0) / totalBudget) * 100) : 0;
          const consumptionPct = r.planned > 0 ? Math.round(((r.spent || 0) / r.planned) * 100) : 0;

          return (
            <div
              key={r.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-200/80 bg-white p-3.5 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 transition-colors shadow-2xs"
            >
              <div className="flex items-center gap-3 flex-1 min-w-[200px]">
                <span
                  style={{ backgroundColor: r.color || COLORS[i % COLORS.length] }}
                  className="h-3 w-3 rounded-full shrink-0 shadow-xs"
                />
                <input
                  type="text"
                  value={r.name}
                  onChange={(e) => onUpdateRow(r.id, 'name', e.target.value)}
                  placeholder="Category Name"
                  className="w-full bg-transparent font-bold text-slate-900 focus:outline-none dark:text-white text-sm"
                />
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono shrink-0">
                  {pctOfTotal}% of total
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
                      value={r.planned}
                      onChange={(e) => onUpdateRow(r.id, 'planned', Number(e.target.value) || 0)}
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
                      value={r.spent}
                      onChange={(e) => onUpdateRow(r.id, 'spent', Number(e.target.value) || 0)}
                      className="w-24 rounded-lg border border-slate-200 bg-slate-50 py-1 pl-6 pr-2 text-right font-mono text-xs font-semibold text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 tabular-nums"
                    />
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="min-w-[100px] text-right font-mono text-xs">
                  <span
                    className={`inline-block font-semibold ${
                      isOver
                        ? 'text-rose-600 dark:text-rose-400'
                        : 'text-emerald-600 dark:text-emerald-400'
                    }`}
                  >
                    {isOver ? `+${formatCurrency(Math.abs(diff), currency)} over` : `${formatCurrency(diff, currency)} left`}
                  </span>
                  <div className="text-[10px] text-slate-400 tabular-nums">
                    {consumptionPct}% disbursed
                  </div>
                </div>

                <button
                  onClick={() => onDeleteRow(r.id)}
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
      <form onSubmit={handleAdd} className="flex flex-wrap items-center gap-2 pt-4 border-t border-dashed border-slate-200 dark:border-slate-800">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New Category (e.g. Return Favors, DJ/Audio, Floral Gate)"
          className="flex-1 min-w-[200px] rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-medium text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        />
        <div className="relative">
          <span className="absolute left-2.5 top-2 text-xs text-slate-400 font-mono">
            {currency}
          </span>
          <input
            type="number"
            value={newAmt}
            onChange={(e) => setNewAmt(e.target.value)}
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
