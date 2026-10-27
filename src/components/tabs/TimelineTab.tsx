/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * EventCraft AI - Timeline & Milestone Planning Tab
 * 
 * Provides milestone scheduling, completion status tracking, chronological sorting,
 * and completion progress visualization.
 */

import React, { useState } from 'react';
import { Plus, Trash2, CheckSquare } from 'lucide-react';
import { TaskItem } from '../../types';

interface TimelineTabProps {
  /** Array of chronological milestone tasks */
  tasks: TaskItem[];
  /** Callback to toggle task completion */
  onToggleTask: (id: string, done: boolean) => void;
  /** Callback to delete a task by identifier */
  onDeleteTask: (id: string) => void;
  /** Callback to append a new milestone */
  onAddTask: (text: string, weeks: number) => void;
}

export const TimelineTab: React.FC<TimelineTabProps> = ({
  tasks,
  onToggleTask,
  onDeleteTask,
  onAddTask
}) => {
  const [newTaskText, setNewTaskText] = useState('');
  const [newWeeksLeadTime, setNewWeeksLeadTime] = useState('4');

  /**
   * Handles user submission of a new milestone task.
   */
  const handleAddTaskSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!newTaskText.trim()) {
      return;
    }
    onAddTask(newTaskText.trim(), Number(newWeeksLeadTime) || 0);
    setNewTaskText('');
  };

  const completedMilestoneCount = tasks.filter((taskItem) => taskItem.done).length;
  const percentageCompleted =
    tasks.length > 0 ? Math.round((completedMilestoneCount / tasks.length) * 100) : 0;

  // Sort descending by weeks before event so earliest planning milestones appear first
  const sortedMilestoneTasks = [...tasks].sort(
    (earlierTask, laterTask) => laterTask.weeks - earlierTask.weeks
  );

  return (
    <div className="space-y-4">
      {/* Progress Bar & Counter */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-300">
        <div className="flex items-center gap-2">
          <CheckSquare className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          <span>
            <b>{completedMilestoneCount}</b> of <b>{tasks.length}</b> milestones achieved (
            {percentageCompleted}%)
          </span>
        </div>
        <div className="w-full sm:w-48 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div
            style={{ width: `${percentageCompleted}%` }}
            className="h-full bg-gradient-to-r from-indigo-600 to-pink-500 rounded-full transition-all duration-300"
          />
        </div>
      </div>

      {/* Task Rows */}
      <div className="space-y-2">
        {sortedMilestoneTasks.map((taskItem) => (
          <div
            key={taskItem.id}
            className={`flex items-center justify-between gap-3 rounded-lg border p-3 transition-all ${
              taskItem.done
                ? 'border-slate-200 bg-slate-50/70 text-slate-400 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-500'
                : 'border-slate-200 bg-white text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200'
            }`}
          >
            <div className="flex items-center gap-3 flex-1">
              <input
                type="checkbox"
                checked={taskItem.done}
                onChange={(event) => onToggleTask(taskItem.id, event.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 cursor-pointer"
              />
              <span
                className={`text-sm font-medium ${
                  taskItem.done ? 'line-through text-slate-400 dark:text-slate-500' : ''
                }`}
              >
                {taskItem.text}
              </span>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs font-mono font-medium text-indigo-600 dark:text-indigo-400 whitespace-nowrap">
                {taskItem.weeks > 0 ? `${taskItem.weeks}w prior` : 'Event week'}
              </span>

              <button
                onClick={() => onDeleteTask(taskItem.id)}
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
      <form
        onSubmit={handleAddTaskSubmit}
        className="flex flex-wrap items-center gap-2 pt-3 border-t border-dashed border-slate-200 dark:border-slate-800"
      >
        <input
          type="text"
          value={newTaskText}
          onChange={(event) => setNewTaskText(event.target.value)}
          placeholder="New milestone (e.g. Schedule venue walk-through, book cake designer)..."
          className="flex-1 min-w-[200px] rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        />
        <div className="flex items-center gap-1.5">
          <input
            type="number"
            min="0"
            max="52"
            value={newWeeksLeadTime}
            onChange={(event) => setNewWeeksLeadTime(event.target.value)}
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
