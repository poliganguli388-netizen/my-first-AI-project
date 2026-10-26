import React, { useState } from 'react';
import { Plus, Trash2, Building2, CheckCircle2, Clock, DollarSign, Tag } from 'lucide-react';
import { VendorItem, VendorStatus } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface VendorsTabProps {
  vendors: VendorItem[];
  currency: string;
  onUpdateVendor: (id: string, field: keyof VendorItem, value: any) => void;
  onDeleteVendor: (id: string) => void;
  onAddVendor: (name: string, cat: string, quote: number, status: VendorStatus, note?: string) => void;
}

export const VendorsTab: React.FC<VendorsTabProps> = ({
  vendors,
  currency,
  onUpdateVendor,
  onDeleteVendor,
  onAddVendor
}) => {
  const [filter, setFilter] = useState<'All' | VendorStatus>('All');
  const [newName, setNewName] = useState('');
  const [newCat, setNewCat] = useState('Venue');
  const [newQuote, setNewQuote] = useState('');
  const [newStatus, setNewStatus] = useState<VendorStatus>('To Contact');
  const [newNote, setNewNote] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    onAddVendor(newName.trim(), newCat.trim() || 'General', Number(newQuote) || 0, newStatus, newNote.trim());
    setNewName('');
    setNewQuote('');
    setNewNote('');
  };

  const filtered = filter === 'All' ? vendors : vendors.filter((v) => v.status === filter);
  const totalCommitted = vendors
    .filter((v) => v.status === 'Booked' || v.status === 'Paid')
    .reduce((sum, v) => sum + (v.quote || 0), 0);
  const totalAllQuotes = vendors.reduce((sum, v) => sum + (v.quote || 0), 0);
  const bookedCount = vendors.filter((v) => v.status === 'Booked' || v.status === 'Paid').length;

  const getStatusColor = (status: VendorStatus) => {
    switch (status) {
      case 'Paid':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800';
      case 'Booked':
        return 'text-indigo-700 bg-indigo-50 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800';
      case 'Quoted':
        return 'text-amber-700 bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800';
      case 'To Contact':
      default:
        return 'text-slate-700 bg-slate-100 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Vendor KPI Strip */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 pb-3 border-b border-slate-100 dark:border-slate-800 text-xs">
        <div className="rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/60">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider dark:text-slate-400">
            Total Quotes Value
          </div>
          <div className="mt-0.5 font-mono text-base font-bold text-slate-900 dark:text-white tabular-nums">
            {formatCurrency(totalAllQuotes, currency)}
          </div>
        </div>

        <div className="rounded-xl bg-indigo-50/70 p-2.5 dark:bg-indigo-950/40">
          <div className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider dark:text-indigo-300">
            Committed / Booked
          </div>
          <div className="mt-0.5 font-mono text-base font-bold text-indigo-700 dark:text-indigo-300 tabular-nums">
            {formatCurrency(totalCommitted, currency)} <span className="text-[11px] font-normal">({bookedCount} vendors)</span>
          </div>
        </div>

        <div className="rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/60 col-span-2 sm:col-span-1">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider dark:text-slate-400">
            Procurement Progress
          </div>
          <div className="mt-0.5 font-mono text-base font-bold text-slate-900 dark:text-white tabular-nums">
            {vendors.length > 0 ? Math.round((bookedCount / vendors.length) * 100) : 0}% locked
          </div>
        </div>
      </div>

      {/* Filters and Header Stats */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Segmented Filter Control */}
        <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
          {(['All', 'To Contact', 'Quoted', 'Booked', 'Paid'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer ${
                filter === st
                  ? 'bg-white text-slate-900 shadow-2xs dark:bg-slate-700 dark:text-white'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400">
          Showing <b>{filtered.length}</b> of <b>{vendors.length}</b> vendors
        </div>
      </div>

      {/* Vendor Rows */}
      <div className="space-y-2">
        {filtered.map((v) => (
          <div
            key={v.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-200/80 bg-white p-3.5 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 transition-colors shadow-2xs"
          >
            <div className="flex items-start gap-3 flex-1 min-w-[220px]">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 shrink-0">
                <Building2 className="h-4 w-4" />
              </div>
              <div className="space-y-0.5">
                <div className="text-sm font-bold text-slate-900 dark:text-white">
                  {v.name}
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{v.cat}</span>
                  {v.note && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>{v.note}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 sm:justify-end">
              {/* Status Select */}
              <select
                value={v.status}
                onChange={(e) => onUpdateVendor(v.id, 'status', e.target.value as VendorStatus)}
                className={`rounded-lg border px-2.5 py-1 text-xs font-semibold focus:outline-none cursor-pointer ${getStatusColor(
                  v.status
                )}`}
              >
                <option value="To Contact">To Contact</option>
                <option value="Quoted">Quoted</option>
                <option value="Booked">Booked</option>
                <option value="Paid">Paid</option>
              </select>

              {/* Quote Input */}
              <div className="relative">
                <span className="absolute left-2.5 top-1.5 text-xs text-slate-400 font-mono">
                  {currency}
                </span>
                <input
                  type="number"
                  value={v.quote}
                  onChange={(e) => onUpdateVendor(v.id, 'quote', Number(e.target.value) || 0)}
                  className="w-28 rounded-lg border border-slate-200 bg-slate-50 py-1 pl-6 pr-2 text-right font-mono text-xs font-semibold text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 tabular-nums"
                />
              </div>

              <button
                onClick={() => onDeleteVendor(v.id)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-rose-600 dark:hover:bg-slate-800 dark:hover:text-rose-400 transition-colors cursor-pointer"
                title="Delete vendor"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="py-10 text-center text-sm text-slate-500 dark:text-slate-400">
            No vendors found matching this filter.
          </div>
        )}
      </div>

      {/* Add Vendor Form */}
      <form onSubmit={handleAdd} className="flex flex-wrap items-center gap-2 pt-4 border-t border-dashed border-slate-200 dark:border-slate-800">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Vendor / Agency Name"
          className="flex-1 min-w-[180px] rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-medium text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        />
        <input
          type="text"
          value={newCat}
          onChange={(e) => setNewCat(e.target.value)}
          placeholder="Category (e.g. DJ, Flowers)"
          className="w-36 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        />
        <div className="relative">
          <span className="absolute left-2.5 top-2 text-xs text-slate-400 font-mono">
            {currency}
          </span>
          <input
            type="number"
            value={newQuote}
            onChange={(e) => setNewQuote(e.target.value)}
            placeholder="Quote"
            className="w-28 rounded-xl border border-slate-200 bg-slate-50 py-2 pl-6 pr-2 text-xs font-medium text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 font-mono tabular-nums"
          />
        </div>
        <select
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value as VendorStatus)}
          className="rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs font-semibold text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 cursor-pointer"
        >
          <option value="To Contact">To Contact</option>
          <option value="Quoted">Quoted</option>
          <option value="Booked">Booked</option>
          <option value="Paid">Paid</option>
        </select>
        <input
          type="text"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Notes (e.g. Advance paid, tasting done)"
          className="w-44 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        />
        <button
          type="submit"
          className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 transition-colors cursor-pointer whitespace-nowrap"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Vendor</span>
        </button>
      </form>
    </div>
  );
};
