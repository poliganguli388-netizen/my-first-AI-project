/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * EventCraft AI - Vendor Management & Procurement Tab
 * 
 * Manages external supplier directory, quote comparisons, procurement milestone statuses,
 * committed liabilities, and contact information.
 */

import React, { useState } from 'react';
import { Plus, Trash2, Building2 } from 'lucide-react';
import { VendorItem, VendorStatus } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface VendorsTabProps {
  /** Registry of engaged and candidate vendors */
  vendors: VendorItem[];
  /** Master currency symbol */
  currency: string;
  /** Type-safe callback invoked when updating a vendor record */
  onUpdateVendor: <K extends keyof VendorItem>(id: string, field: K, value: VendorItem[K]) => void;
  /** Callback to delete a vendor by identifier */
  onDeleteVendor: (id: string) => void;
  /** Callback to register a new vendor entry */
  onAddVendor: (
    name: string,
    cat: string,
    quote: number,
    status: VendorStatus,
    note?: string
  ) => void;
}

export const VendorsTab: React.FC<VendorsTabProps> = ({
  vendors,
  currency,
  onUpdateVendor,
  onDeleteVendor,
  onAddVendor
}) => {
  const [filterStatus, setFilterStatus] = useState<'All' | VendorStatus>('All');
  const [newVendorName, setNewVendorName] = useState('');
  const [newVendorCategory, setNewVendorCategory] = useState('Venue');
  const [newVendorQuote, setNewVendorQuote] = useState('');
  const [newVendorStatus, setNewVendorStatus] = useState<VendorStatus>('To Contact');
  const [newVendorNote, setNewVendorNote] = useState('');

  /**
   * Handles user submission of a new vendor entity.
   */
  const handleAddVendorSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!newVendorName.trim()) {
      return;
    }
    onAddVendor(
      newVendorName.trim(),
      newVendorCategory.trim() || 'General',
      Number(newVendorQuote) || 0,
      newVendorStatus,
      newVendorNote.trim()
    );
    setNewVendorName('');
    setNewVendorQuote('');
    setNewVendorNote('');
  };

  const filteredVendors =
    filterStatus === 'All'
      ? vendors
      : vendors.filter((vendor) => vendor.status === filterStatus);

  const totalCommittedSpend = vendors
    .filter((vendor) => vendor.status === 'Booked' || vendor.status === 'Paid')
    .reduce((accumulatedTotal, vendor) => accumulatedTotal + (vendor.quote || 0), 0);

  const totalQuotedValue = vendors.reduce(
    (accumulatedTotal, vendor) => accumulatedTotal + (vendor.quote || 0),
    0
  );

  const bookedVendorCount = vendors.filter(
    (vendor) => vendor.status === 'Booked' || vendor.status === 'Paid'
  ).length;

  /**
   * Resolves visual styling classes for vendor procurement status pills.
   */
  const getStatusBadgeClass = (status: VendorStatus): string => {
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
            {formatCurrency(totalQuotedValue, currency)}
          </div>
        </div>

        <div className="rounded-xl bg-indigo-50/70 p-2.5 dark:bg-indigo-950/40">
          <div className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider dark:text-indigo-300">
            Committed / Booked
          </div>
          <div className="mt-0.5 font-mono text-base font-bold text-indigo-700 dark:text-indigo-300 tabular-nums">
            {formatCurrency(totalCommittedSpend, currency)}{' '}
            <span className="text-[11px] font-normal">({bookedVendorCount} vendors)</span>
          </div>
        </div>

        <div className="rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/60 col-span-2 sm:col-span-1">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider dark:text-slate-400">
            Procurement Progress
          </div>
          <div className="mt-0.5 font-mono text-base font-bold text-slate-900 dark:text-white tabular-nums">
            {vendors.length > 0
              ? Math.round((bookedVendorCount / vendors.length) * 100)
              : 0}
            % locked
          </div>
        </div>
      </div>

      {/* Filters and Header Stats */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Segmented Filter Control */}
        <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
          {(['All', 'To Contact', 'Quoted', 'Booked', 'Paid'] as const).map(
            (statusOption) => (
              <button
                key={statusOption}
                onClick={() => setFilterStatus(statusOption)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer ${
                  filterStatus === statusOption
                    ? 'bg-white text-slate-900 shadow-2xs dark:bg-slate-700 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                {statusOption}
              </button>
            )
          )}
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400">
          Showing <b>{filteredVendors.length}</b> of <b>{vendors.length}</b> vendors
        </div>
      </div>

      {/* Vendor Rows */}
      <div className="space-y-2">
        {filteredVendors.map((vendor) => (
          <div
            key={vendor.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-200/80 bg-white p-3.5 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 transition-colors shadow-2xs"
          >
            <div className="flex items-start gap-3 flex-1 min-w-[220px]">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 shrink-0">
                <Building2 className="h-4 w-4" />
              </div>
              <div className="space-y-0.5">
                <div className="text-sm font-bold text-slate-900 dark:text-white">
                  {vendor.name}
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {vendor.cat}
                  </span>
                  {vendor.note && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>{vendor.note}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 sm:justify-end">
              {/* Status Select */}
              <select
                value={vendor.status}
                onChange={(event) =>
                  onUpdateVendor(vendor.id, 'status', event.target.value as VendorStatus)
                }
                className={`rounded-lg border px-2.5 py-1 text-xs font-semibold focus:outline-none cursor-pointer ${getStatusBadgeClass(
                  vendor.status
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
                  value={vendor.quote}
                  onChange={(event) =>
                    onUpdateVendor(vendor.id, 'quote', Number(event.target.value) || 0)
                  }
                  className="w-28 rounded-lg border border-slate-200 bg-slate-50 py-1 pl-6 pr-2 text-right font-mono text-xs font-semibold text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 tabular-nums"
                />
              </div>

              <button
                onClick={() => onDeleteVendor(vendor.id)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-rose-600 dark:hover:bg-slate-800 dark:hover:text-rose-400 transition-colors cursor-pointer"
                title="Delete vendor"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}

        {filteredVendors.length === 0 && (
          <div className="py-10 text-center text-sm text-slate-500 dark:text-slate-400">
            No vendors found matching this filter.
          </div>
        )}
      </div>

      {/* Add Vendor Form */}
      <form
        onSubmit={handleAddVendorSubmit}
        className="flex flex-wrap items-center gap-2 pt-4 border-t border-dashed border-slate-200 dark:border-slate-800"
      >
        <input
          type="text"
          value={newVendorName}
          onChange={(event) => setNewVendorName(event.target.value)}
          placeholder="Vendor / Agency Name"
          className="flex-1 min-w-[180px] rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-medium text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        />
        <input
          type="text"
          value={newVendorCategory}
          onChange={(event) => setNewVendorCategory(event.target.value)}
          placeholder="Category (e.g. DJ, Flowers)"
          className="w-36 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        />
        <div className="relative">
          <span className="absolute left-2.5 top-2 text-xs text-slate-400 font-mono">
            {currency}
          </span>
          <input
            type="number"
            value={newVendorQuote}
            onChange={(event) => setNewVendorQuote(event.target.value)}
            placeholder="Quote"
            className="w-28 rounded-xl border border-slate-200 bg-slate-50 py-2 pl-6 pr-2 text-xs font-medium text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 font-mono tabular-nums"
          />
        </div>
        <select
          value={newVendorStatus}
          onChange={(event) => setNewVendorStatus(event.target.value as VendorStatus)}
          className="rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs font-semibold text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 cursor-pointer"
        >
          <option value="To Contact">To Contact</option>
          <option value="Quoted">Quoted</option>
          <option value="Booked">Booked</option>
          <option value="Paid">Paid</option>
        </select>
        <input
          type="text"
          value={newVendorNote}
          onChange={(event) => setNewVendorNote(event.target.value)}
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
