import React, { useState } from 'react';
import { Plus, Trash2, CheckSquare } from 'lucide-react';
import { TaskItem } from '../../types';

interface TimelineTabProps {
  tasks: TaskItem[];
  onToggleTask: (id: string, done: boolean) => void;
  onDeleteTask: (id: string) => void;
  onAddTask: (text: string, weeks: number) => void;
}

export const TimelineTab: React.FC<TimelineTabProps> = ({
  tasks,
  onToggleTask,
  onDeleteTask,
  onAddTask
}) => {
  const [newText, setNewText] = useState('');
  const [newWeeks, setNewWeeks] = useState('4');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;
    onAddTask(newText.trim(), Number(newWeeks) || 0);
    setNewText('');
  };

  const completedCount = tasks.filter((t) => t.done).length;
  const pctDone = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  // Sort descending by weeks before event so earliest planning comes first
  const sortedTasks = [...tasks].sort((a, b) => b.weeks - a.weeks);

  return (
    <div className="space-y-4">
      {/* Progress Bar & Counter */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-300">
        <div className="flex items-center gap-2">
          <CheckSquare className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          <span>
            <b>{completedCount}</b> of <b>{tasks.length}</b> milestones achieved ({pctDone}%)
          </span>
        </div>
        <div className="w-full sm:w-48 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div
            style={{ width: `${pctDone}%` }}
            className="h-full bg-gradient-to-r from-indigo-600 to-pink-500 rounded-full transition-all duration-300"
          />
        </div>
      </div>

      {/* Task Rows */}
      <div className="space-y-2">
        {sortedTasks.map((t) => (
          <div
            key={t.id}
            className={`flex items-center justify-between gap-3 rounded-lg border p-3 transition-all ${
              t.done
                ? 'border-slate-200 bg-slate-50/70 text-slate-400 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-500'
                : 'border-slate-200 bg-white text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200'
            }`}
          >
            <div className="flex items-center gap-3 flex-1">
              <input
                type="checkbox"
                checked={t.done}
                onChange={(e) => onToggleTask(t.id, e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 cursor-pointer"
              />
              <span
                className={`text-sm font-medium ${
                  t.done ? 'line-through text-slate-400 dark:text-slate-500' : ''
                }`}
              >
                {t.text}
              </span>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs font-mono font-medium text-indigo-600 dark:text-indigo-400 whitespace-nowrap">
                {t.weeks > 0 ? `${t.weeks}w prior` : 'Event week'}
              </span>

              <button
                onClick={() => onDeleteTask(t.id)}
                className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-rose-600 dark:hover:bg-slate-800 dark:hover:text-rose-400 transition-colors"
                title="Delete milestone"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}

        {tasks.length === 0 && (
          <div className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
            No milestones added. Add pre-event deadlines below!
          </div>
        )}
      </div>

      {/* Add Task Toolbar */}
      <form onSubmit={handleAdd} className="flex flex-wrap items-center gap-2 pt-3 border-t border-dashed border-slate-200 dark:border-slate-800">
        <input
          type="text"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          placeholder="New milestone (e.g. Schedule venue walk-through, book cake designer)..."
          className="flex-1 min-w-[200px] rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        />
        <div className="flex items-center gap-1.5">
          <input
            type="number"
            min="0"
            max="52"
            value={newWeeks}
            onChange={(e) => setNewWeeks(e.target.value)}
            className="w-16 rounded-lg border border-slate-200 bg-slate-50 py-2 px-2 text-center text-xs font-mono font-medium text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
          <span className="text-xs text-slate-500 dark:text-slate-400">weeks before</span>
        </div>
        <button
          type="submit"
          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 transition-colors cursor-pointer whitespace-nowrap"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Milestone</span>
        </button>
      </form>
    </div>
  );
};
