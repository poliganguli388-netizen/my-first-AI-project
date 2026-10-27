/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * EventCraft AI - Print & PDF Export View
 * 
 * Provides an ink-optimized, clean black-and-white print layout rendering the master
 * run-of-show schedule, category financial breakdowns, vendor directory, and guest dietary lists.
 */

import React from 'react';
import { EventState } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';

interface PrintViewProps {
  /** Master event state */
  state: EventState;
}

export const PrintView: React.FC<PrintViewProps> = ({ state }) => {
  const masterBudgetTotal = Number(state.budget) || 0;
  const totalPlannedAllocation = state.budgetRows.reduce(
    (accumulatedTotal, budgetRow) => accumulatedTotal + (budgetRow.planned || 0),
    0
  );
  const totalDisbursedSpend = state.budgetRows.reduce(
    (accumulatedTotal, budgetRow) => accumulatedTotal + (budgetRow.spent || 0),
    0
  );
  const totalConfirmedAttendees = state.guestList
    .filter((guestItem) => guestItem.rsvp === 'Confirmed')
    .reduce((accumulatedTotal, guestItem) => accumulatedTotal + (guestItem.count || 1), 0);

  return (
    <div className="hidden print:block p-8 text-black bg-white max-w-4xl mx-auto font-sans">
      {/* Print Header */}
      <div className="border-b-2 border-black pb-4 mb-6">
        <div className="text-xs uppercase tracking-widest text-gray-500 font-mono">
          EventCraft Master Run Sheet & Plan
        </div>
        <h1 className="text-3xl font-extrabold text-black mt-1">
          {state.name}
        </h1>
        <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-700">
          <span>📅 Date: <b>{formatDate(state.date)}</b></span>
          <span>📍 Location: <b>{state.city || 'TBA'}</b></span>
          <span>👥 Expected Guests: <b>{state.guests}</b> ({totalConfirmedAttendees} confirmed)</span>
          <span>💰 Budget: <b>{formatCurrency(masterBudgetTotal, state.currency)}</b></span>
        </div>
        {state.notes && (
          <p className="mt-2 text-xs italic text-gray-600">
            Host Notes: {state.notes}
          </p>
        )}
      </div>

      {/* Section 1: Day-of Run Sheet */}
      <div className="card-print mb-6">
        <h2 className="text-base font-bold uppercase tracking-wider border-b border-gray-300 pb-1 mb-3">
          ⏰ Day-of Master Schedule / Run Sheet
        </h2>
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-gray-300 text-gray-600">
              <th className="py-1.5 w-24">Time</th>
              <th className="py-1.5">Agenda / Milestone</th>
              <th className="py-1.5 w-32">Lead / In-Charge</th>
              <th className="py-1.5 w-32">Location</th>
            </tr>
          </thead>
          <tbody>
            {state.schedule.map((scheduleCue) => (
              <tr key={scheduleCue.id} className="border-b border-gray-200">
                <td className="py-1.5 font-mono font-bold">{scheduleCue.time}</td>
                <td className="py-1.5 font-medium">{scheduleCue.event}</td>
                <td className="py-1.5">{scheduleCue.lead || 'Host'}</td>
                <td className="py-1.5 text-gray-600">{scheduleCue.location || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Section 2: Budget Breakdown */}
      <div className="card-print mb-6">
        <h2 className="text-base font-bold uppercase tracking-wider border-b border-gray-300 pb-1 mb-3">
          💰 Budget & Financial Allocation
        </h2>
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-gray-300 text-gray-600">
              <th className="py-1.5">Category</th>
              <th className="py-1.5 text-right w-28">Planned</th>
              <th className="py-1.5 text-right w-28">Paid Out</th>
              <th className="py-1.5 text-right w-28">Status</th>
            </tr>
          </thead>
          <tbody>
            {state.budgetRows.map((budgetRow) => {
              const varianceAmount = (budgetRow.planned || 0) - (budgetRow.spent || 0);
              return (
                <tr key={budgetRow.id} className="border-b border-gray-200">
                  <td className="py-1.5 font-medium">{budgetRow.name}</td>
                  <td className="py-1.5 text-right font-mono">{formatCurrency(budgetRow.planned, state.currency)}</td>
                  <td className="py-1.5 text-right font-mono">{formatCurrency(budgetRow.spent, state.currency)}</td>
                  <td className="py-1.5 text-right font-semibold">
                    {varianceAmount < 0
                      ? `Over by ${formatCurrency(Math.abs(varianceAmount), state.currency)}`
                      : 'On track'}
                  </td>
                </tr>
              );
            })}
            <tr className="border-t-2 border-black font-bold">
              <td className="py-2">Total Planned: {formatCurrency(totalPlannedAllocation, state.currency)}</td>
              <td className="py-2 text-right">Paid: {formatCurrency(totalDisbursedSpend, state.currency)}</td>
              <td className="py-2 text-right">
                Balance: {formatCurrency(masterBudgetTotal - totalDisbursedSpend, state.currency)}
              </td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Section 3: Vendor Directory */}
      <div className="card-print mb-6">
        <h2 className="text-base font-bold uppercase tracking-wider border-b border-gray-300 pb-1 mb-3">
          🤝 Key Vendor Directory
        </h2>
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-gray-300 text-gray-600">
              <th className="py-1.5">Vendor / Company</th>
              <th className="py-1.5 w-32">Category</th>
              <th className="py-1.5 w-24">Status</th>
              <th className="py-1.5 text-right w-28">Quote</th>
              <th className="py-1.5">Notes</th>
            </tr>
          </thead>
          <tbody>
            {state.vendors.map((vendorRecord) => (
              <tr key={vendorRecord.id} className="border-b border-gray-200">
                <td className="py-1.5 font-bold">{vendorRecord.name}</td>
                <td className="py-1.5">{vendorRecord.cat}</td>
                <td className="py-1.5 uppercase font-mono text-[11px]">{vendorRecord.status}</td>
                <td className="py-1.5 text-right font-mono">{formatCurrency(vendorRecord.quote, state.currency)}</td>
                <td className="py-1.5 text-gray-600">{vendorRecord.note || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Section 4: Confirmed Guest Seating & Dietary */}
      <div className="card-print">
        <h2 className="text-base font-bold uppercase tracking-wider border-b border-gray-300 pb-1 mb-3">
          👥 Guest List & Dietary Split
        </h2>
        <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-xs">
          {state.guestList.map((guestRecord) => (
            <div key={guestRecord.id} className="flex justify-between py-1 border-b border-gray-100">
              <span className="font-medium">
                {guestRecord.name} ({guestRecord.count} pax) {guestRecord.table ? `· ${guestRecord.table}` : ''}
              </span>
              <span className="font-mono text-gray-600">
                {guestRecord.diet} · {guestRecord.rsvp}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
