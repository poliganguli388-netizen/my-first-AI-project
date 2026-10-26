import React, { useState } from 'react';
import { Plus, Trash2, Clock, MapPin, User } from 'lucide-react';
import { ScheduleItem } from '../../types';

interface ScheduleTabProps {
  schedule: ScheduleItem[];
  onDeleteSchedule: (id: string) => void;
  onAddSchedule: (time: string, event: string, lead: string, location?: string) => void;
}

export const ScheduleTab: React.FC<ScheduleTabProps> = ({
  schedule,
  onDeleteSchedule,
  onAddSchedule
}) => {
  const [newTime, setNewTime] = useState('12:00 PM');
  const [newEvent, setNewEvent] = useState('');
  const [newLead, setNewLead] = useState('Host');
  const [newLocation, setNewLocation] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.trim()) return;
    onAddSchedule(newTime.trim() || '12:00 PM', newEvent.trim(), newLead.trim() || 'Host', newLocation.trim());
    setNewEvent('');
    setNewLocation('');
  };

  return (
    <div className="space-y-4">
      {/* Run Sheet Items */}
      <div className="space-y-2">
        {schedule.map((item) => (
          <div
            key={item.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-3.5 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 transition-colors shadow-2xs"
          >
            <div className="flex items-start sm:items-center gap-3 flex-1">
              <div className="flex items-center gap-1.5 min-w-[90px] text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 shrink-0">
                <Clock className="h-3.5 w-3.5 text-indigo-500" />
                <span className="tabular-nums">{item.time}</span>
              </div>

              <div className="space-y-0.5">
                <div className="text-sm font-bold text-slate-900 dark:text-white">
                  {item.event}
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="inline-flex items-center gap-1">
                    <User className="h-3 w-3 text-slate-400" />
                    <span>Lead: <b className="text-slate-700 dark:text-slate-200">{item.lead || 'Coordinator'}</b></span>
                  </span>
                  {item.location && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-slate-400" />
                        <span>{item.location}</span>
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={() => onDeleteSchedule(item.id)}
              className="self-end sm:self-center rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-rose-600 dark:hover:bg-slate-800 dark:hover:text-rose-400 transition-colors"
              title="Delete cue"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}

        {schedule.length === 0 && (
          <div className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
            No day-of schedule cues created. Add timing milestones below!
          </div>
        )}
      </div>

      {/* Add Cue Toolbar */}
      <form onSubmit={handleAdd} className="flex flex-wrap items-center gap-2 pt-3 border-t border-dashed border-slate-200 dark:border-slate-800">
        <input
          type="text"
          value={newTime}
          onChange={(e) => setNewTime(e.target.value)}
          placeholder="Time (e.g. 02:30 PM)"
          className="w-28 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 font-mono text-xs font-semibold text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        />
        <input
          type="text"
          value={newEvent}
          onChange={(e) => setNewEvent(e.target.value)}
          placeholder="Milestone cue (e.g. Baraat welcome, Cake cutting, Cocktail toast)..."
          className="flex-1 min-w-[200px] rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        />
        <input
          type="text"
          value={newLead}
          onChange={(e) => setNewLead(e.target.value)}
          placeholder="Lead / Assigned to"
          className="w-36 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs font-medium text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        />
        <input
          type="text"
          value={newLocation}
          onChange={(e) => setNewLocation(e.target.value)}
          placeholder="Location (Optional)"
          className="w-32 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs font-medium text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        />
        <button
          type="submit"
          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 transition-colors cursor-pointer whitespace-nowrap"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Cue</span>
        </button>
      </form>
    </div>
  );
};
