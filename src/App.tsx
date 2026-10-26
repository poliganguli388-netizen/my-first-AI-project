import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  Calendar,
  Clock,
  Briefcase,
  Users,
  Lightbulb,
  CheckCircle2
} from 'lucide-react';
import { EventState, EventType, BudgetRow, TaskItem, ScheduleItem, VendorItem, GuestItem, IdeaItem, VendorStatus, RsvpStatus, DietType, IdeaTag } from './types';
import { buildStateFromTemplate, COLORS } from './data/templates';
import { generateId } from './utils/formatters';
import { Navbar } from './components/Navbar';
import { HeroSummary } from './components/HeroSummary';
import { EventSetupCard } from './components/EventSetupCard';
import { FinancialHealthCard } from './components/FinancialHealthCard';
import { BudgetTab } from './components/tabs/BudgetTab';
import { TimelineTab } from './components/tabs/TimelineTab';
import { ScheduleTab } from './components/tabs/ScheduleTab';
import { VendorsTab } from './components/tabs/VendorsTab';
import { GuestsTab } from './components/tabs/GuestsTab';
import { IdeasTab } from './components/tabs/IdeasTab';
import { AIModal } from './components/AIModal';
import { PrintView } from './components/PrintView';
import { TestSuiteModal } from './components/TestSuiteModal';

const STORAGE_KEY = 'eventcraft_pro_state_v3';

export default function App() {
  const [state, setState] = useState<EventState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse saved state', e);
    }
    return buildStateFromTemplate('wedding');
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiActionName, setAiActionName] = useState('');

  // Modal State
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    title: string;
    type: 'invite' | 'budget' | 'vendor' | 'generic';
    data: any;
  }>({
    isOpen: false,
    title: '',
    type: 'generic',
    data: null
  });

  const [isTestModalOpen, setIsTestModalOpen] = useState<boolean>(false);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Failed to save to localStorage', e);
    }
  }, [state]);

  // Apply Dark/Light theme class to html element
  useEffect(() => {
    if (state.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.theme]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 2800);
  };

  // Theme Toggle
  const toggleTheme = () => {
    setState((prev) => ({
      ...prev,
      theme: prev.theme === 'dark' ? 'light' : 'dark'
    }));
  };

  // Currency Change
  const handleCurrencyChange = (curr: string) => {
    setState((prev) => ({ ...prev, currency: curr }));
    showToast(`Currency set to ${curr}`);
  };

  // Export & Import
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${state.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_plan.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Plan downloaded as JSON backup');
  };

  const handleImportJSON = (imported: EventState) => {
    setState(imported);
    showToast('Event plan successfully loaded!');
  };

  // Template Loader
  const handleLoadTemplate = (type: EventType) => {
    const fresh = buildStateFromTemplate(type);
    setState(fresh);
    showToast(`Loaded ${type.toUpperCase()} starter template!`);
  };

  // AI Actions
  const handleAutoPlan = async () => {
    setIsAiLoading(true);
    setAiActionName('plan');
    try {
      const res = await fetch('/api/ai/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: state.name,
          type: state.type,
          budget: state.budget,
          guests: state.guests,
          city: state.city,
          notes: state.notes
        })
      });
      const data = await res.json();
      if (data.success && data.plan) {
        const { categories, tasks, schedule, vendors, ideas } = data.plan;

        const totalB = Number(state.budget) || 500000;
        let acc = 0;
        const newBudgetRows: BudgetRow[] = (categories || []).map((c: any, idx: number) => {
          let p = Math.round((c.pct / 100) * totalB / 1000) * 1000;
          if (idx === categories.length - 1) p = Math.max(0, totalB - acc);
          acc += p;
          return {
            id: generateId(),
            name: c.name,
            planned: p,
            spent: 0,
            color: COLORS[idx % COLORS.length]
          };
        });

        const newTasks: TaskItem[] = (tasks || []).map((t: any) => ({
          id: generateId(),
          text: t.text,
          weeks: t.weeks || 2,
          done: false
        }));

        const newSchedule: ScheduleItem[] = (schedule || []).map((s: any) => ({
          id: generateId(),
          time: s.time,
          event: s.event,
          lead: s.lead || 'Coordinator',
          location: s.location || ''
        }));

        const newVendors: VendorItem[] = (vendors || []).map((v: any) => ({
          id: generateId(),
          name: v.name,
          cat: v.cat,
          quote: v.quote || 0,
          status: (v.status as VendorStatus) || 'To Contact',
          note: v.note || ''
        }));

        const newIdeas: IdeaItem[] = (ideas || []).map((i: any) => ({
          id: generateId(),
          title: i.title,
          tag: (i.tag as IdeaTag) || 'Activity',
          detail: i.detail || ''
        }));

        setState((prev) => ({
          ...prev,
          budgetRows: newBudgetRows.length > 0 ? newBudgetRows : prev.budgetRows,
          tasks: newTasks.length > 0 ? newTasks : prev.tasks,
          schedule: newSchedule.length > 0 ? newSchedule : prev.schedule,
          vendors: newVendors.length > 0 ? newVendors : prev.vendors,
          ideas: newIdeas.length > 0 ? newIdeas : prev.ideas
        }));

        showToast('✨ AI successfully generated your complete event plan!');
      }
    } catch (err) {
      console.error(err);
      showToast('Error communicating with AI service');
    } finally {
      setIsAiLoading(false);
      setAiActionName('');
    }
  };

  const handleOpenInviteModal = async () => {
    setIsAiLoading(true);
    setAiActionName('invite');
    try {
      const res = await fetch('/api/ai/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: state.name,
          type: state.type,
          date: state.date,
          city: state.city,
          notes: state.notes,
          guests: state.guests
        })
      });
      const data = await res.json();
      if (data.success && data.invites) {
        setModalState({
          isOpen: true,
          title: '✉️ AI Event Invitation Generator',
          type: 'invite',
          data: data.invites
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiLoading(false);
      setAiActionName('');
    }
  };

  const handleOpenBudgetDoctor = async () => {
    setIsAiLoading(true);
    setAiActionName('budget');
    try {
      const res = await fetch('/api/ai/budget-doctor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: state.name,
          type: state.type,
          budget: state.budget,
          guests: state.guests,
          budgetRows: state.budgetRows
        })
      });
      const data = await res.json();
      if (data.success && data.advice) {
        setModalState({
          isOpen: true,
          title: '💡 AI Budget Doctor & Cost Optimization',
          type: 'budget',
          data: data.advice
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiLoading(false);
      setAiActionName('');
    }
  };

  const handleOpenVendorChecklist = async () => {
    setIsAiLoading(true);
    setAiActionName('vendor');
    try {
      const res = await fetch('/api/ai/vendor-checklist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: state.type,
          city: state.city,
          vendors: state.vendors
        })
      });
      const data = await res.json();
      if (data.success && data.checklist) {
        setModalState({
          isOpen: true,
          title: '📋 AI Vendor Interview Questionnaire & Red Flags',
          type: 'vendor',
          data: data.checklist
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiLoading(false);
      setAiActionName('');
    }
  };

  // Budget Row handlers
  const handleUpdateBudgetRow = (id: string, field: keyof BudgetRow, val: any) => {
    setState((prev) => ({
      ...prev,
      budgetRows: prev.budgetRows.map((r) => (r.id === id ? { ...r, [field]: val } : r))
    }));
  };

  const handleDeleteBudgetRow = (id: string) => {
    setState((prev) => ({
      ...prev,
      budgetRows: prev.budgetRows.filter((r) => r.id !== id)
    }));
    showToast('Category deleted');
  };

  const handleAddBudgetRow = (name: string, planned: number) => {
    const newRow: BudgetRow = {
      id: generateId(),
      name,
      planned,
      spent: 0,
      color: COLORS[state.budgetRows.length % COLORS.length]
    };
    setState((prev) => ({
      ...prev,
      budgetRows: [...prev.budgetRows, newRow]
    }));
    showToast('Category added');
  };

  // Task handlers
  const handleToggleTask = (id: string, done: boolean) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === id ? { ...t, done } : t))
    }));
  };

  const handleDeleteTask = (id: string) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== id)
    }));
    showToast('Milestone deleted');
  };

  const handleAddTask = (text: string, weeks: number) => {
    setState((prev) => ({
      ...prev,
      tasks: [...prev.tasks, { id: generateId(), text, weeks, done: false }]
    }));
    showToast('Milestone added');
  };

  // Schedule handlers
  const handleDeleteSchedule = (id: string) => {
    setState((prev) => ({
      ...prev,
      schedule: prev.schedule.filter((s) => s.id !== id)
    }));
    showToast('Cue removed');
  };

  const handleAddSchedule = (time: string, event: string, lead: string, location?: string) => {
    setState((prev) => ({
      ...prev,
      schedule: [...prev.schedule, { id: generateId(), time, event, lead, location }]
    }));
    showToast('Schedule cue added');
  };

  // Vendor handlers
  const handleUpdateVendor = (id: string, field: keyof VendorItem, val: any) => {
    setState((prev) => ({
      ...prev,
      vendors: prev.vendors.map((v) => (v.id === id ? { ...v, [field]: val } : v))
    }));
  };

  const handleDeleteVendor = (id: string) => {
    setState((prev) => ({
      ...prev,
      vendors: prev.vendors.filter((v) => v.id !== id)
    }));
    showToast('Vendor removed');
  };

  const handleAddVendor = (name: string, cat: string, quote: number, status: VendorStatus, note?: string) => {
    setState((prev) => ({
      ...prev,
      vendors: [...prev.vendors, { id: generateId(), name, cat, quote, status, note }]
    }));
    showToast('Vendor added');
  };

  // Guest handlers
  const handleUpdateGuest = (id: string, field: keyof GuestItem, val: any) => {
    setState((prev) => ({
      ...prev,
      guestList: prev.guestList.map((g) => (g.id === id ? { ...g, [field]: val } : g))
    }));
  };

  const handleDeleteGuest = (id: string) => {
    setState((prev) => ({
      ...prev,
      guestList: prev.guestList.filter((g) => g.id !== id)
    }));
    showToast('Guest removed');
  };

  const handleAddGuest = (name: string, count: number, rsvp: RsvpStatus, diet: DietType, notes?: string, table?: string) => {
    setState((prev) => ({
      ...prev,
      guestList: [...prev.guestList, { id: generateId(), name, count, rsvp, diet, notes, table }]
    }));
    showToast('Guest added');
  };

  // Idea handlers
  const handleDeleteIdea = (id: string) => {
    setState((prev) => ({
      ...prev,
      ideas: prev.ideas.filter((i) => i.id !== id)
    }));
    showToast('Idea removed');
  };

  const handleAddIdea = (title: string, tag: IdeaTag, detail: string) => {
    setState((prev) => ({
      ...prev,
      ideas: [...prev.ideas, { id: generateId(), title, tag, detail }]
    }));
    showToast('Concept saved');
  };

  const completedTasksCount = state.tasks.filter((t) => t.done).length;
  const confirmedGuestsCount = state.guestList.filter((g) => g.rsvp === 'Confirmed').reduce((a, b) => a + (b.count || 1), 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors">
      {/* Top Navbar */}
      <Navbar
        theme={state.theme}
        onToggleTheme={toggleTheme}
        currency={state.currency}
        onChangeCurrency={handleCurrencyChange}
        onPrint={() => window.print()}
        onExportJSON={handleExportJSON}
        onImportJSON={handleImportJSON}
        activeTab={state.activeTab}
        onSelectTab={(tab) => setState((p) => ({ ...p, activeTab: tab }))}
        onOpenTestSuite={() => setIsTestModalOpen(true)}
      />

      {/* Hero Summary */}
      <HeroSummary
        name={state.name}
        onChangeName={(val) => setState((p) => ({ ...p, name: val }))}
        date={state.date}
        guests={state.guests}
        city={state.city}
        type={state.type}
      />

      {/* Main Container */}
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 space-y-6">
        {/* Event Setup & Parameters */}
        <EventSetupCard
          type={state.type}
          onChangeType={(t) => setState((p) => ({ ...p, type: t }))}
          date={state.date}
          onChangeDate={(d) => setState((p) => ({ ...p, date: d }))}
          guests={state.guests}
          onChangeGuests={(g) => setState((p) => ({ ...p, guests: g }))}
          budget={state.budget}
          onChangeBudget={(b) => setState((p) => ({ ...p, budget: b }))}
          currency={state.currency}
          city={state.city}
          onChangeCity={(c) => setState((p) => ({ ...p, city: c }))}
          notes={state.notes}
          onChangeNotes={(n) => setState((p) => ({ ...p, notes: n }))}
          onLoadTemplate={handleLoadTemplate}
          onAutoPlan={handleAutoPlan}
          onOpenInviteModal={handleOpenInviteModal}
          onOpenBudgetDoctor={handleOpenBudgetDoctor}
          onOpenVendorChecklist={handleOpenVendorChecklist}
          isAiLoading={isAiLoading}
          aiActionName={aiActionName}
        />

        {/* Financial & Allocation Health */}
        <FinancialHealthCard
          budget={state.budget}
          currency={state.currency}
          guests={state.guests}
          budgetRows={state.budgetRows}
        />

        {/* Tab Modules Container */}
        <section className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-800/90 dark:bg-slate-900/95 transition-all">
          {/* Tabs Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-6 border-b border-slate-100 dark:border-slate-800 scrollbar-none">
            <button
              onClick={() => setState((p) => ({ ...p, activeTab: 'budget' }))}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                state.activeTab === 'budget'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <DollarSign className="h-4 w-4" />
              <span>Budget Breakdown</span>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-mono tabular-nums ${
                state.activeTab === 'budget'
                  ? 'bg-indigo-800/50 text-indigo-100'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
              }`}>
                {state.budgetRows.length}
              </span>
            </button>

            <button
              onClick={() => setState((p) => ({ ...p, activeTab: 'timeline' }))}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                state.activeTab === 'timeline'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Calendar className="h-4 w-4" />
              <span>Timeline & Milestones</span>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-mono tabular-nums ${
                state.activeTab === 'timeline'
                  ? 'bg-indigo-800/50 text-indigo-100'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
              }`}>
                {completedTasksCount}/{state.tasks.length}
              </span>
            </button>

            <button
              onClick={() => setState((p) => ({ ...p, activeTab: 'schedule' }))}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                state.activeTab === 'schedule'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Clock className="h-4 w-4" />
              <span>Day-of Run Sheet</span>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-mono tabular-nums ${
                state.activeTab === 'schedule'
                  ? 'bg-indigo-800/50 text-indigo-100'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
              }`}>
                {state.schedule.length}
              </span>
            </button>

            <button
              onClick={() => setState((p) => ({ ...p, activeTab: 'vendors' }))}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                state.activeTab === 'vendors'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Briefcase className="h-4 w-4" />
              <span>Vendors & Quotes</span>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-mono tabular-nums ${
                state.activeTab === 'vendors'
                  ? 'bg-indigo-800/50 text-indigo-100'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
              }`}>
                {state.vendors.length}
              </span>
            </button>

            <button
              onClick={() => setState((p) => ({ ...p, activeTab: 'guests' }))}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                state.activeTab === 'guests'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Users className="h-4 w-4" />
              <span>Guests & RSVP</span>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-mono tabular-nums ${
                state.activeTab === 'guests'
                  ? 'bg-indigo-800/50 text-indigo-100'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
              }`}>
                {confirmedGuestsCount}
              </span>
            </button>

            <button
              onClick={() => setState((p) => ({ ...p, activeTab: 'ideas' }))}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                state.activeTab === 'ideas'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Lightbulb className="h-4 w-4" />
              <span>Creative Concepts</span>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-mono tabular-nums ${
                state.activeTab === 'ideas'
                  ? 'bg-indigo-800/50 text-indigo-100'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
              }`}>
                {state.ideas.length}
              </span>
            </button>
          </div>

          {/* Active Tab Content */}
          <div>
            {state.activeTab === 'budget' && (
              <BudgetTab
                budgetRows={state.budgetRows}
                currency={state.currency}
                totalBudget={state.budget}
                onUpdateRow={handleUpdateBudgetRow}
                onDeleteRow={handleDeleteBudgetRow}
                onAddRow={handleAddBudgetRow}
              />
            )}

            {state.activeTab === 'timeline' && (
              <TimelineTab
                tasks={state.tasks}
                onToggleTask={handleToggleTask}
                onDeleteTask={handleDeleteTask}
                onAddTask={handleAddTask}
              />
            )}

            {state.activeTab === 'schedule' && (
              <ScheduleTab
                schedule={state.schedule}
                onDeleteSchedule={handleDeleteSchedule}
                onAddSchedule={handleAddSchedule}
              />
            )}

            {state.activeTab === 'vendors' && (
              <VendorsTab
                vendors={state.vendors}
                currency={state.currency}
                onUpdateVendor={handleUpdateVendor}
                onDeleteVendor={handleDeleteVendor}
                onAddVendor={handleAddVendor}
              />
            )}

            {state.activeTab === 'guests' && (
              <GuestsTab
                guestList={state.guestList}
                onUpdateGuest={handleUpdateGuest}
                onDeleteGuest={handleDeleteGuest}
                onAddGuest={handleAddGuest}
              />
            )}

            {state.activeTab === 'ideas' && (
              <IdeasTab
                ideas={state.ideas}
                onDeleteIdea={handleDeleteIdea}
                onAddIdea={handleAddIdea}
              />
            )}
          </div>
        </section>
      </main>

      {/* Print View for PDF generation */}
      <PrintView state={state} />

      {/* AI Modal */}
      <AIModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState((prev) => ({ ...prev, isOpen: false }))}
        title={modalState.title}
        type={modalState.type}
        data={modalState.data}
        onToast={showToast}
      />

      {/* Test Suite & Quality Inspector Modal */}
      <TestSuiteModal
        isOpen={isTestModalOpen}
        onClose={() => setIsTestModalOpen(false)}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white shadow-xl dark:bg-white dark:text-slate-900 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 dark:text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
