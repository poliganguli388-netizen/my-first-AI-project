/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * EventCraft AI - Creative Brainstorm & Inspiration Tab
 * 
 * Manages thematic ideas, decorative concepts, interactive activities, and curated
 * experience brainstorm cards tagged by functional domain.
 */

import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { IdeaItem, IdeaTag } from '../../types';

interface IdeasTabProps {
  /** Array of creative brainstorming ideas */
  ideas: IdeaItem[];
  /** Callback to delete an idea by identifier */
  onDeleteIdea: (id: string) => void;
  /** Callback to append a new idea */
  onAddIdea: (title: string, tag: IdeaTag, detail: string) => void;
}

export const IdeasTab: React.FC<IdeasTabProps> = ({
  ideas,
  onDeleteIdea,
  onAddIdea
}) => {
  const [filterTag, setFilterTag] = useState<'All' | IdeaTag>('All');
  const [newIdeaTitle, setNewIdeaTitle] = useState('');
  const [newIdeaTag, setNewIdeaTag] = useState<IdeaTag>('Activity');
  const [newIdeaDetail, setNewIdeaDetail] = useState('');

  /**
   * Handles user submission of a new brainstorm concept.
   */
  const handleAddIdeaSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!newIdeaTitle.trim()) {
      return;
    }
    onAddIdea(newIdeaTitle.trim(), newIdeaTag, newIdeaDetail.trim());
    setNewIdeaTitle('');
    setNewIdeaDetail('');
  };

  const filteredIdeas =
    filterTag === 'All'
      ? ideas
      : ideas.filter((ideaItem) => ideaItem.tag === filterTag);

  /**
   * Resolves visual styling classes for category tag pills.
   */
  const getTagBadgeClass = (tag: IdeaTag): string => {
    switch (tag) {
      case 'Food':
        return 'text-amber-700 bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800';
      case 'Decor':
        return 'text-pink-700 bg-pink-50 border-pink-200 dark:bg-pink-950/40 dark:text-pink-300 dark:border-pink-800';
      case 'Music':
        return 'text-purple-700 bg-purple-50 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800';
      case 'Gift':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800';
      case 'Tech':
        return 'text-cyan-700 bg-cyan-50 border-cyan-200 dark:bg-cyan-950/40 dark:text-cyan-300 dark:border-cyan-800';
      case 'Activity':
      default:
        return 'text-indigo-700 bg-indigo-50 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800';
    }
  };

  return (
    <div className="space-y-4">
      {/* Tag Filters */}
      <div className="flex flex-wrap items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-800">
        {(['All', 'Activity', 'Food', 'Decor', 'Gift', 'Music', 'Tech'] as const).map(
          (categoryTag) => (
            <button
              key={categoryTag}
              onClick={() => setFilterTag(categoryTag)}
              className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer ${
                filterTag === categoryTag
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              {categoryTag}
            </button>
          )
        )}
      </div>

      {/* Ideas Card Grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filteredIdeas.map((ideaItem) => (
          <div
            key={ideaItem.id}
            className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span
                  className={`rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getTagBadgeClass(
                    ideaItem.tag
                  )}`}
                >
                  {ideaItem.tag}
                </span>
                <button
                  onClick={() => onDeleteIdea(ideaItem.id)}
                  className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-rose-600 dark:hover:bg-slate-800 dark:hover:text-rose-400 transition-colors"
                  title="Delete idea"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                {ideaItem.title}
              </h3>

              <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {ideaItem.detail}
              </p>
            </div>
          </div>
        ))}

        {filteredIdeas.length === 0 && (
          <div className="col-span-full py-8 text-center text-sm text-slate-500 dark:text-slate-400">
            No creative ideas saved yet in this category.
          </div>
        )}
      </div>

      {/* Add Idea Form */}
      <form
        onSubmit={handleAddIdeaSubmit}
        className="flex flex-wrap items-center gap-2 pt-3 border-t border-dashed border-slate-200 dark:border-slate-800"
      >
        <input
          type="text"
          value={newIdeaTitle}
          onChange={(event) => setNewIdeaTitle(event.target.value)}
          placeholder="Idea Title (e.g. Vintage Rotary Phone Audio Guestbook)"
          className="flex-1 min-w-[200px] rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        />
        <select
          value={newIdeaTag}
          onChange={(event) => setNewIdeaTag(event.target.value as IdeaTag)}
          className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs font-semibold text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        >
          <option value="Activity">Activity</option>
          <option value="Food">Food & Bar</option>
          <option value="Decor">Decor</option>
          <option value="Gift">Gift & Favor</option>
          <option value="Music">Music & Sound</option>
          <option value="Tech">Tech / Digital</option>
        </select>
        <input
          type="text"
          value={newIdeaDetail}
          onChange={(event) => setNewIdeaDetail(event.target.value)}
          placeholder="Brief description or execution notes..."
          className="flex-1 min-w-[240px] rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        />
        <button
          type="submit"
          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 transition-colors cursor-pointer whitespace-nowrap"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Save Concept</span>
        </button>
      </form>
    </div>
  );
};
