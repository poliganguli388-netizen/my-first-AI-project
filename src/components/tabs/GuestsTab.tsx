import React, { useState } from 'react';
import { Plus, Trash2, Users, CheckCircle, Clock, XCircle, Search } from 'lucide-react';
import { GuestItem, RsvpStatus, DietType } from '../../types';

interface GuestsTabProps {
  guestList: GuestItem[];
  onUpdateGuest: (id: string, field: keyof GuestItem, value: any) => void;
  onDeleteGuest: (id: string) => void;
  onAddGuest: (name: string, count: number, rsvp: RsvpStatus, diet: DietType, notes?: string, table?: string) => void;
}

export const GuestsTab: React.FC<GuestsTabProps> = ({
  guestList,
  onUpdateGuest,
  onDeleteGuest,
  onAddGuest
}) => {
  const [filterRsvp, setFilterRsvp] = useState<'All' | RsvpStatus>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const [newName, setNewName] = useState('');
  const [newCount, setNewCount] = useState('1');
  const [newRsvp, setNewRsvp] = useState<RsvpStatus>('Confirmed');
  const [newDiet, setNewDiet] = useState<DietType>('Veg');
  const [newNotes, setNewNotes] = useState('');
  const [newTable, setNewTable] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    onAddGuest(
      newName.trim(),
      Math.max(1, Number(newCount) || 1),
      newRsvp,
      newDiet,
      newNotes.trim(),
      newTable.trim()
    );
    setNewName('');
    setNewCount('1');
    setNewNotes('');
    setNewTable('');
  };

  // Calculations
  const totalHeadcount = guestList.reduce((acc, g) => acc + (g.count || 1), 0);
  const confirmedHeadcount = guestList
    .filter((g) => g.rsvp === 'Confirmed')
    .reduce((acc, g) => acc + (g.count || 1), 0);
  const pendingHeadcount = guestList
    .filter((g) => g.rsvp === 'Pending')
    .reduce((acc, g) => acc + (g.count || 1), 0);
  const declinedHeadcount = guestList
    .filter((g) => g.rsvp === 'Declined')
    .reduce((acc, g) => acc + (g.count || 1), 0);

  // Diet tallies
  const vegCount = guestList
    .filter((g) => g.rsvp === 'Confirmed' && (g.diet === 'Veg' || g.diet === 'Jain'))
    .reduce((acc, g) => acc + (g.count || 1), 0);
  const nonVegCount = guestList
    .filter((g) => g.rsvp === 'Confirmed' && g.diet === 'Non-Veg')
    .reduce((acc, g) => acc + (g.count || 1), 0);

  const filtered = guestList.filter((g) => {
    const matchesRsvp = filterRsvp === 'All' || g.rsvp === filterRsvp;
    const matchesSearch =
      searchQuery === '' ||
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (g.notes && g.notes.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (g.table && g.table.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesRsvp && matchesSearch;
  });

  return (
    <div className="space-y-4">
      {/* RSVP Stats Bar */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="rounded-lg bg-slate-50 p-2.5 dark:bg-slate-800/60">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider dark:text-slate-400">
            Total on List
          </div>
          <div className="mt-0.5 font-mono text-lg font-bold text-slate-900 dark:text-white tabular-nums">
            {totalHeadcount} <span className="text-xs font-normal text-slate-500">pax ({guestList.length} parties)</span>
          </div>
        </div>

        <div className="rounded-lg bg-emerald-50/70 p-2.5 dark:bg-emerald-950/30">
          <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider dark:text-emerald-400">
            Confirmed RSVP
          </div>
          <div className="mt-0.5 font-mono text-lg font-bold text-emerald-700 dark:text-emerald-300 tabular-nums">
            {confirmedHeadcount} <span className="text-xs font-normal text-emerald-600/80">pax</span>
          </div>
        </div>

        <div className="rounded-lg bg-amber-50/70 p-2.5 dark:bg-amber-950/30">
          <div className="text-[10px] font-bold text-amber-600 uppercase tracking-wider dark:text-amber-400">
            Awaiting Response
          </div>
          <div className="mt-0.5 font-mono text-lg font-bold text-amber-700 dark:text-amber-300 tabular-nums">
            {pendingHeadcount} <span className="text-xs font-normal text-amber-600/80">pax</span>
          </div>
        </div>

        <div className="rounded-lg bg-slate-50 p-2.5 dark:bg-slate-800/60">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider dark:text-slate-400">
            Confirmed Diet Split
          </div>
          <div className="mt-0.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
            Veg: <span className="font-mono tabular-nums">{vegCount}</span> · Non-Veg: <span className="font-mono tabular-nums">{nonVegCount}</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
          {(['All', 'Confirmed', 'Pending', 'Declined'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilterRsvp(st)}
              className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer ${
                filterRsvp === st
                  ? 'bg-white text-slate-900 shadow-2xs dark:bg-slate-700 dark:text-white'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-56">
          <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search guest or table..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-3 text-xs font-medium text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </div>
      </div>

      {/* Guest List Rows */}
      <div className="space-y-2">
        {filtered.map((g) => (
          <div
            key={g.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-3 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 transition-colors shadow-2xs"
          >
            <div className="flex items-center gap-3 flex-1 min-w-[200px]">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600 font-bold text-xs dark:bg-slate-800 dark:text-slate-300 shrink-0 font-mono">
                {g.count}
              </div>

              <div className="space-y-0.5">
                <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>{g.name}</span>
                  {g.table && (
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      ({g.table})
                    </span>
                  )}
                </div>
                {g.notes && (
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {g.notes}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 sm:justify-end">
              {/* Dietary Option */}
              <select
                value={g.diet}
                onChange={(e) => onUpdateGuest(g.id, 'diet', e.target.value as DietType)}
                className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <option value="Veg">Veg</option>
                <option value="Non-Veg">Non-Veg</option>
                <option value="Jain">Jain</option>
                <option value="Vegan">Vegan</option>
                <option value="Halal">Halal</option>
                <option value="Gluten-Free">Gluten-Free</option>
                <option value="Any">Any</option>
              </select>

              {/* RSVP Dropdown */}
              <select
                value={g.rsvp}
                onChange={(e) => onUpdateGuest(g.id, 'rsvp', e.target.value as RsvpStatus)}
                className={`rounded-md border px-2 py-1 text-xs font-semibold focus:outline-none ${
                  g.rsvp === 'Confirmed'
                    ? 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                    : g.rsvp === 'Declined'
                    ? 'text-rose-700 bg-rose-50 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800'
                    : 'text-amber-700 bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
                }`}
              >
                <option value="Confirmed">Confirmed</option>
                <option value="Pending">Pending</option>
                <option value="Declined">Declined</option>
              </select>

              <button
                onClick={() => onDeleteGuest(g.id)}
                className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-rose-600 dark:hover:bg-slate-800 dark:hover:text-rose-400 transition-colors"
                title="Delete guest"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
            No guests found matching search query or filter.
          </div>
        )}
      </div>

      {/* Add Guest Form */}
      <form onSubmit={handleAdd} className="flex flex-wrap items-center gap-2 pt-3 border-t border-dashed border-slate-200 dark:border-slate-800">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Guest / Family Name (e.g. Verma Family)"
          className="flex-1 min-w-[180px] rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        />
        <div className="flex items-center gap-1">
          <input
            type="number"
            min="1"
            max="20"
            value={newCount}
            onChange={(e) => setNewCount(e.target.value)}
            className="w-14 rounded-lg border border-slate-200 bg-slate-50 py-2 text-center text-xs font-mono font-medium text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 tabular-nums"
          />
          <span className="text-xs text-slate-500 dark:text-slate-400">seats</span>
        </div>
        <select
          value={newDiet}
          onChange={(e) => setNewDiet(e.target.value as DietType)}
          className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs font-medium text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        >
          <option value="Veg">Veg</option>
          <option value="Non-Veg">Non-Veg</option>
          <option value="Jain">Jain</option>
          <option value="Vegan">Vegan</option>
          <option value="Halal">Halal</option>
          <option value="Gluten-Free">Gluten-Free</option>
        </select>
        <select
          value={newRsvp}
          onChange={(e) => setNewRsvp(e.target.value as RsvpStatus)}
          className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs font-semibold text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        >
          <option value="Confirmed">Confirmed</option>
          <option value="Pending">Pending</option>
          <option value="Declined">Declined</option>
        </select>
        <input
          type="text"
          value={newTable}
          onChange={(e) => setNewTable(e.target.value)}
          placeholder="Table # (e.g. Table 4)"
          className="w-28 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs font-medium text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        />
        <input
          type="text"
          value={newNotes}
          onChange={(e) => setNewNotes(e.target.value)}
          placeholder="Notes (VIP, high chair...)"
          className="w-36 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs font-medium text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        />
        <button
          type="submit"
          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 transition-colors cursor-pointer whitespace-nowrap"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Guest</span>
        </button>
      </form>
    </div>
  );
};
