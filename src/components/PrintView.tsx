import React from 'react';
import { EventState } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';

interface PrintViewProps {
  state: EventState;
}

export const PrintView: React.FC<PrintViewProps> = ({ state }) => {
  const totalB = Number(state.budget) || 0;
  const planned = state.budgetRows.reduce((a, b) => a + (b.planned || 0), 0);
  const spent = state.budgetRows.reduce((a, b) => a + (b.spent || 0), 0);
  const confirmedGuests = state.guestList.filter((g) => g.rsvp === 'Confirmed').reduce((a, b) => a + (b.count || 1), 0);

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
          <span>👥 Expected Guests: <b>{state.guests}</b> ({confirmedGuests} confirmed)</span>
          <span>💰 Budget: <b>{formatCurrency(totalB, state.currency)}</b></span>
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
            {state.schedule.map((s) => (
              <tr key={s.id} className="border-b border-gray-200">
                <td className="py-1.5 font-mono font-bold">{s.time}</td>
                <td className="py-1.5 font-medium">{s.event}</td>
                <td className="py-1.5">{s.lead || 'Host'}</td>
                <td className="py-1.5 text-gray-600">{s.location || '-'}</td>
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
            {state.budgetRows.map((r) => {
              const diff = (r.planned || 0) - (r.spent || 0);
              return (
                <tr key={r.id} className="border-b border-gray-200">
                  <td className="py-1.5 font-medium">{r.name}</td>
                  <td className="py-1.5 text-right font-mono">{formatCurrency(r.planned, state.currency)}</td>
                  <td className="py-1.5 text-right font-mono">{formatCurrency(r.spent, state.currency)}</td>
                  <td className="py-1.5 text-right font-semibold">
                    {diff < 0 ? `Over by ${formatCurrency(Math.abs(diff), state.currency)}` : 'On track'}
                  </td>
                </tr>
              );
            })}
            <tr className="border-t-2 border-black font-bold">
              <td className="py-2">Total Planned: {formatCurrency(planned, state.currency)}</td>
              <td className="py-2 text-right">Paid: {formatCurrency(spent, state.currency)}</td>
              <td className="py-2 text-right">Balance: {formatCurrency(totalB - spent, state.currency)}</td>
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
            {state.vendors.map((v) => (
              <tr key={v.id} className="border-b border-gray-200">
                <td className="py-1.5 font-bold">{v.name}</td>
                <td className="py-1.5">{v.cat}</td>
                <td className="py-1.5 uppercase font-mono text-[11px]">{v.status}</td>
                <td className="py-1.5 text-right font-mono">{formatCurrency(v.quote, state.currency)}</td>
                <td className="py-1.5 text-gray-600">{v.note || '-'}</td>
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
          {state.guestList.map((g) => (
            <div key={g.id} className="flex justify-between py-1 border-b border-gray-100">
              <span className="font-medium">{g.name} ({g.count} pax) {g.table ? `· ${g.table}` : ''}</span>
              <span className="font-mono text-gray-600">{g.diet} · {g.rsvp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
