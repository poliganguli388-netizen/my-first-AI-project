/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * EventCraft AI - Celebration & Event Planner Master Application
 * 
 * Central application orchestrator managing reactive state, offline local storage
 * synchronization, dark/light theme toggling, AI assistance integrations, export/import
 * backup pipelines, and sub-module navigation.
 */

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
import {
  EventState,
  EventType,
  BudgetRow,
  TaskItem,
  ScheduleItem,
  VendorItem,
  GuestItem,
  IdeaItem,
  VendorStatus,
  RsvpStatus,
  DietType,
  IdeaTag,
  ModalState
} from './types';
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

/* ========================================================================== */
/* SECTION: CONSTANTS & CONFIGURATION                                         */
/* ========================================================================== */

const LOCAL_STORAGE_CACHE_KEY = 'eventcraft_pro_state_v3';

/* ========================================================================== */
/* SECTION: MAIN APPLICATION COMPONENT                                        */
/* ========================================================================== */

export default function App(): React.ReactElement {
  // Master Event State with localStorage hydration
  const [state, setState] = useState<EventState>(() => {
    try {
      const persistedStateJson = localStorage.getItem(LOCAL_STORAGE_CACHE_KEY);
      if (persistedStateJson) {
        return JSON.parse(persistedStateJson) as EventState;
      }
    } catch (parseError) {
      console.warn('Failed to parse cached event state from localStorage:', parseError);
    }
    return buildStateFromTemplate('wedding');
  });

  // Ephemeral Feedback & AI Loading States
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [aiActionName, setAiActionName] = useState<string>('');

  // Structured AI Intelligence Modal State
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    title: '',
    type: 'generic',
    data: null
  });

  // Automated Testing & Code Quality Inspector Modal State
  const [isTestModalOpen, setIsTestModalOpen] = useState<boolean>(false);

  /* ======================================================================== */
  /* SECTION: REACT EFFECTS & PERSISTENCE                                     */
  /* ======================================================================== */

  /**
   * Automatically persists master state mutations to browser localStorage.
   */
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_CACHE_KEY, JSON.stringify(state));
    } catch (storageError) {
      console.warn('Failed to commit event state to localStorage:', storageError);
    }
  }, [state]);

  /**
   * Synchronizes dark/light theme class with the root HTML document element.
   */
  useEffect(() => {
    if (state.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.theme]);

  /* ======================================================================== */
  /* SECTION: TOAST NOTIFICATIONS & PREFERENCES                               */
  /* ======================================================================== */

  /**
   * Displays an animated toast notification banner.
   * 
   * @param message - User-facing notification text.
   */
  const showToast = (message: string): void => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((currentMessage) => (currentMessage === message ? null : currentMessage));
    }, 2800);
  };

  /**
   * Toggles the active color scheme between light and dark modes.
   */
  const toggleTheme = (): void => {
    setState((previousState) => ({
      ...previousState,
      theme: previousState.theme === 'dark' ? 'light' : 'dark'
    }));
  };

  /**
   * Updates the primary monetary currency symbol.
   * 
   * @param targetCurrency - Chosen currency symbol (e.g., '₹', '$', '€', '£').
   */
  const handleCurrencyChange = (targetCurrency: string): void => {
    setState((previousState) => ({
      ...previousState,
      currency: targetCurrency
    }));
    showToast(`Currency set to ${targetCurrency}`);
  };

  /* ======================================================================== */
  /* SECTION: BACKUP & DATA PORTABILITY (EXPORT / IMPORT)                     */
  /* ======================================================================== */

  /**
   * Serializes current event state into a formatted JSON backup file and triggers download.
   */
  const handleExportJSON = (): void => {
    const serializedJson = JSON.stringify(state, null, 2);
    const dataUrlPayload = 'data:text/json;charset=utf-8,' + encodeURIComponent(serializedJson);
    const downloadAnchorElement = document.createElement('a');
    const sanitizedFileName = `${state.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_plan.json`;

    downloadAnchorElement.setAttribute('href', dataUrlPayload);
    downloadAnchorElement.setAttribute('download', sanitizedFileName);
    document.body.appendChild(downloadAnchorElement);
    downloadAnchorElement.click();
    downloadAnchorElement.remove();

    showToast('Plan downloaded as JSON backup');
  };

  /**
   * Ingests and hydrates a valid imported EventState backup.
   * 
   * @param importedPlanState - Parsed JSON event plan state.
   */
  const handleImportJSON = (importedPlanState: EventState): void => {
    setState(importedPlanState);
    showToast('Event plan successfully loaded!');
  };

  /**
   * Loads a pre-built starter template archetype.
   * 
   * @param eventType - Selected event type template (e.g., 'wedding', 'birthday').
   */
  const handleLoadTemplate = (eventType: EventType): void => {
    const initializedState = buildStateFromTemplate(eventType);
    setState(initializedState);
    showToast(`Loaded ${eventType.toUpperCase()} starter template!`);
  };

  /* ======================================================================== */
  /* SECTION: AI INTELLIGENCE & COPILOT ORCHESTRATION                         */
  /* ======================================================================== */

  /**
   * Generates a complete end-to-end event plan using server-side Gemini intelligence.
   */
  const handleAutoPlan = async (): Promise<void> => {
    setIsAiLoading(true);
    setAiActionName('plan');

    try {
      const response = await fetch('/api/ai/plan', {
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

      const responsePayload = await response.json();

      if (responsePayload.success && responsePayload.plan) {
        const { categories, tasks, schedule, vendors, ideas } = responsePayload.plan;

        const masterBudgetAmount = Number(state.budget) || 500000;
        let cumulativePlannedTotal = 0;

        const newBudgetRows: BudgetRow[] = (categories || []).map(
          (categoryItem: { name: string; pct: number }, categoryIndex: number) => {
            let plannedAmount = Math.round(((categoryItem.pct / 100) * masterBudgetAmount) / 1000) * 1000;
            if (categoryIndex === categories.length - 1) {
              plannedAmount = Math.max(0, masterBudgetAmount - cumulativePlannedTotal);
            }
            cumulativePlannedTotal += plannedAmount;

            return {
              id: generateId(),
              name: categoryItem.name,
              planned: plannedAmount,
              spent: 0,
              color: COLORS[categoryIndex % COLORS.length]
            };
          }
        );

        const newTasks: TaskItem[] = (tasks || []).map(
          (taskItem: { text: string; weeks?: number }) => ({
            id: generateId(),
            text: taskItem.text,
            weeks: taskItem.weeks || 2,
            done: false
          })
        );

        const newSchedule: ScheduleItem[] = (schedule || []).map(
          (scheduleCue: { time: string; event: string; lead?: string; location?: string }) => ({
            id: generateId(),
            time: scheduleCue.time,
            event: scheduleCue.event,
            lead: scheduleCue.lead || 'Coordinator',
            location: scheduleCue.location || ''
          })
        );

        const newVendors: VendorItem[] = (vendors || []).map(
          (vendorItem: { name: string; cat: string; quote?: number; status?: string; note?: string }) => ({
            id: generateId(),
            name: vendorItem.name,
            cat: vendorItem.cat,
            quote: vendorItem.quote || 0,
            status: (vendorItem.status as VendorStatus) || 'To Contact',
            note: vendorItem.note || ''
          })
        );

        const newIdeas: IdeaItem[] = (ideas || []).map(
          (brainstormIdea: { title: string; tag?: string; detail?: string }) => ({
            id: generateId(),
            title: brainstormIdea.title,
            tag: (brainstormIdea.tag as IdeaTag) || 'Activity',
            detail: brainstormIdea.detail || ''
          })
        );

        setState((previousState) => ({
          ...previousState,
          budgetRows: newBudgetRows.length > 0 ? newBudgetRows : previousState.budgetRows,
          tasks: newTasks.length > 0 ? newTasks : previousState.tasks,
          schedule: newSchedule.length > 0 ? newSchedule : previousState.schedule,
          vendors: newVendors.length > 0 ? newVendors : previousState.vendors,
          ideas: newIdeas.length > 0 ? newIdeas : previousState.ideas
        }));

        showToast('✨ AI successfully generated your complete event plan!');
      }
    } catch (networkError) {
      console.error('Failed to communicate with AI planning service:', networkError);
      showToast('Error communicating with AI service');
    } finally {
      setIsAiLoading(false);
      setAiActionName('');
    }
  };

  /**
   * Requests customized digital invitation messages formatted for WhatsApp, Email, and SMS.
   */
  const handleOpenInviteModal = async (): Promise<void> => {
    setIsAiLoading(true);
    setAiActionName('invite');

    try {
      const response = await fetch('/api/ai/invite', {
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

      const responsePayload = await response.json();

      if (responsePayload.success && responsePayload.invites) {
        setModalState({
          isOpen: true,
          title: '✉️ AI Event Invitation Generator',
          type: 'invite',
          data: responsePayload.invites
        });
      }
    } catch (networkError) {
      console.error('Failed to communicate with AI invitation service:', networkError);
      showToast('Error generating invitations');
    } finally {
      setIsAiLoading(false);
      setAiActionName('');
    }
  };

  /**
   * Dispatches current financial allocations to AI Budget Doctor for cost optimization advice.
   */
  const handleOpenBudgetDoctor = async (): Promise<void> => {
    setIsAiLoading(true);
    setAiActionName('budget');

    try {
      const response = await fetch('/api/ai/budget-doctor', {
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

      const responsePayload = await response.json();

      if (responsePayload.success && responsePayload.advice) {
        setModalState({
          isOpen: true,
          title: '💡 AI Budget Doctor & Cost Optimization',
          type: 'budget',
          data: responsePayload.advice
        });
      }
    } catch (networkError) {
      console.error('Failed to communicate with AI Budget Doctor:', networkError);
      showToast('Error consulting Budget Doctor');
    } finally {
      setIsAiLoading(false);
      setAiActionName('');
    }
  };

  /**
   * Generates interview questionnaires and contract red flag warnings for registered vendor categories.
   */
  const handleOpenVendorChecklist = async (): Promise<void> => {
    setIsAiLoading(true);
    setAiActionName('vendor');

    try {
      const response = await fetch('/api/ai/vendor-checklist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: state.type,
          city: state.city,
          vendors: state.vendors
        })
      });

      const responsePayload = await response.json();

      if (responsePayload.success && responsePayload.checklist) {
        setModalState({
          isOpen: true,
          title: '📋 AI Vendor Interview Questionnaire & Red Flags',
          type: 'vendor',
          data: responsePayload.checklist
        });
      }
    } catch (networkError) {
      console.error('Failed to communicate with AI vendor service:', networkError);
      showToast('Error generating vendor interview checklist');
    } finally {
      setIsAiLoading(false);
      setAiActionName('');
    }
  };

  /* ======================================================================== */
  /* SECTION: CRUD STATE HANDLERS                                             */
  /* ======================================================================== */

  /**
   * Updates an individual field on a specific budget line item with strict type safety.
   */
  const handleUpdateBudgetRow = <K extends keyof BudgetRow>(
    id: string,
    field: K,
    value: BudgetRow[K]
  ): void => {
    setState((previousState) => ({
      ...previousState,
      budgetRows: previousState.budgetRows.map((budgetRow) =>
        budgetRow.id === id ? { ...budgetRow, [field]: value } : budgetRow
      )
    }));
  };

  /**
   * Removes a budget category line item by identifier.
   */
  const handleDeleteBudgetRow = (id: string): void => {
    setState((previousState) => ({
      ...previousState,
      budgetRows: previousState.budgetRows.filter((budgetRow) => budgetRow.id !== id)
    }));
    showToast('Category deleted');
  };

  /**
   * Appends a new budget category line item.
   */
  const handleAddBudgetRow = (name: string, planned: number): void => {
    const newBudgetRow: BudgetRow = {
      id: generateId(),
      name,
      planned,
      spent: 0,
      color: COLORS[state.budgetRows.length % COLORS.length]
    };
    setState((previousState) => ({
      ...previousState,
      budgetRows: [...previousState.budgetRows, newBudgetRow]
    }));
    showToast('Category added');
  };

  /**
   * Toggles completion status for a timeline milestone task.
   */
  const handleToggleTask = (id: string, done: boolean): void => {
    setState((previousState) => ({
      ...previousState,
      tasks: previousState.tasks.map((taskItem) =>
        taskItem.id === id ? { ...taskItem, done } : taskItem
      )
    }));
  };

  /**
   * Removes a milestone task by identifier.
   */
  const handleDeleteTask = (id: string): void => {
    setState((previousState) => ({
      ...previousState,
      tasks: previousState.tasks.filter((taskItem) => taskItem.id !== id)
    }));
    showToast('Milestone deleted');
  };

  /**
   * Appends a new chronological milestone task.
   */
  const handleAddTask = (text: string, weeks: number): void => {
    setState((previousState) => ({
      ...previousState,
      tasks: [...previousState.tasks, { id: generateId(), text, weeks, done: false }]
    }));
    showToast('Milestone added');
  };

  /**
   * Removes a schedule cue by identifier.
   */
  const handleDeleteSchedule = (id: string): void => {
    setState((previousState) => ({
      ...previousState,
      schedule: previousState.schedule.filter((scheduleCue) => scheduleCue.id !== id)
    }));
    showToast('Cue removed');
  };

  /**
   * Appends a new run-of-show schedule cue.
   */
  const handleAddSchedule = (
    time: string,
    event: string,
    lead: string,
    location?: string
  ): void => {
    setState((previousState) => ({
      ...previousState,
      schedule: [...previousState.schedule, { id: generateId(), time, event, lead, location }]
    }));
    showToast('Schedule cue added');
  };

  /**
   * Updates an individual field on a vendor record with strict type safety.
   */
  const handleUpdateVendor = <K extends keyof VendorItem>(
    id: string,
    field: K,
    value: VendorItem[K]
  ): void => {
    setState((previousState) => ({
      ...previousState,
      vendors: previousState.vendors.map((vendorItem) =>
        vendorItem.id === id ? { ...vendorItem, [field]: value } : vendorItem
      )
    }));
  };

  /**
   * Removes a vendor contract entry by identifier.
   */
  const handleDeleteVendor = (id: string): void => {
    setState((previousState) => ({
      ...previousState,
      vendors: previousState.vendors.filter((vendorItem) => vendorItem.id !== id)
    }));
    showToast('Vendor removed');
  };

  /**
   * Appends a new vendor entry to the registry.
   */
  const handleAddVendor = (
    name: string,
    cat: string,
    quote: number,
    status: VendorStatus,
    note?: string
  ): void => {
    setState((previousState) => ({
      ...previousState,
      vendors: [...previousState.vendors, { id: generateId(), name, cat, quote, status, note }]
    }));
    showToast('Vendor added');
  };

  /**
   * Updates an individual field on a guest record with strict type safety.
   */
  const handleUpdateGuest = <K extends keyof GuestItem>(
    id: string,
    field: K,
    value: GuestItem[K]
  ): void => {
    setState((previousState) => ({
      ...previousState,
      guestList: previousState.guestList.map((guestItem) =>
        guestItem.id === id ? { ...guestItem, [field]: value } : guestItem
      )
    }));
  };

  /**
   * Removes a guest entry from the attendee directory.
   */
  const handleDeleteGuest = (id: string): void => {
    setState((previousState) => ({
      ...previousState,
      guestList: previousState.guestList.filter((guestItem) => guestItem.id !== id)
    }));
    showToast('Guest removed');
  };

  /**
   * Appends a new guest party to the guest list.
   */
  const handleAddGuest = (
    name: string,
    count: number,
    rsvp: RsvpStatus,
    diet: DietType,
    notes?: string,
    table?: string
  ): void => {
    setState((previousState) => ({
      ...previousState,
      guestList: [
        ...previousState.guestList,
        { id: generateId(), name, count, rsvp, diet, notes, table }
      ]
    }));
    showToast('Guest added');
  };

  /**
   * Removes a creative concept by identifier.
   */
  const handleDeleteIdea = (id: string): void => {
    setState((previousState) => ({
      ...previousState,
      ideas: previousState.ideas.filter((brainstormIdea) => brainstormIdea.id !== id)
    }));
    showToast('Idea removed');
  };

  /**
   * Appends a new brainstorm concept.
   */
  const handleAddIdea = (title: string, tag: IdeaTag, detail: string): void => {
    setState((previousState) => ({
      ...previousState,
      ideas: [...previousState.ideas, { id: generateId(), title, tag, detail }]
    }));
    showToast('Concept saved');
  };

  /* ======================================================================== */
  /* SECTION: DERIVED METRICS FOR TAB COUNTERS                                */
  /* ======================================================================== */

  const completedTasksCount = state.tasks.filter((taskItem) => taskItem.done).length;
  const confirmedGuestsCount = state.guestList
    .filter((guestItem) => guestItem.rsvp === 'Confirmed')
    .reduce((accumulatedCount, guestItem) => accumulatedCount + (guestItem.count || 1), 0);

  /* ======================================================================== */
  /* SECTION: COMPONENT PRESENTATION (RENDER)                                 */
  /* ======================================================================== */

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors">
      {/* Top Navigation Bar */}
      <Navbar
        theme={state.theme}
        onToggleTheme={toggleTheme}
        currency={state.currency}
        onChangeCurrency={handleCurrencyChange}
        onPrint={() => window.print()}
        onExportJSON={handleExportJSON}
        onImportJSON={handleImportJSON}
        activeTab={state.activeTab}
        onSelectTab={(selectedTab) =>
          setState((previousState) => ({ ...previousState, activeTab: selectedTab }))
        }
        onOpenTestSuite={() => setIsTestModalOpen(true)}
      />

      {/* Hero Event Summary Banner */}
      <HeroSummary
        name={state.name}
        onChangeName={(updatedName) =>
          setState((previousState) => ({ ...previousState, name: updatedName }))
        }
        date={state.date}
        guests={state.guests}
        city={state.city}
        type={state.type}
      />

      {/* Primary Workspace Container */}
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 space-y-6">
        {/* Event Setup & Parameters Card */}
        <EventSetupCard
          type={state.type}
          onChangeType={(selectedType) =>
            setState((previousState) => ({ ...previousState, type: selectedType }))
          }
          date={state.date}
          onChangeDate={(selectedDate) =>
            setState((previousState) => ({ ...previousState, date: selectedDate }))
          }
          guests={state.guests}
          onChangeGuests={(guestCount) =>
            setState((previousState) => ({ ...previousState, guests: guestCount }))
          }
          budget={state.budget}
          onChangeBudget={(budgetAmount) =>
            setState((previousState) => ({ ...previousState, budget: budgetAmount }))
          }
          currency={state.currency}
          city={state.city}
          onChangeCity={(cityName) =>
            setState((previousState) => ({ ...previousState, city: cityName }))
          }
          notes={state.notes}
          onChangeNotes={(notesContent) =>
            setState((previousState) => ({ ...previousState, notes: notesContent }))
          }
          onLoadTemplate={handleLoadTemplate}
          onAutoPlan={handleAutoPlan}
          onOpenInviteModal={handleOpenInviteModal}
          onOpenBudgetDoctor={handleOpenBudgetDoctor}
          onOpenVendorChecklist={handleOpenVendorChecklist}
          isAiLoading={isAiLoading}
          aiActionName={aiActionName}
        />

        {/* Financial & Predictive Allocation Health Card */}
        <FinancialHealthCard
          budget={state.budget}
          currency={state.currency}
          guests={state.guests}
          budgetRows={state.budgetRows}
        />

        {/* Tabbed Planning Modules Section */}
        <section className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-800/90 dark:bg-slate-900/95 transition-all">
          {/* Module Selector Tab Navigation */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-6 border-b border-slate-100 dark:border-slate-800 scrollbar-none">
            <button
              onClick={() =>
                setState((previousState) => ({ ...previousState, activeTab: 'budget' }))
              }
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                state.activeTab === 'budget'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <DollarSign className="h-4 w-4" />
              <span>Budget Breakdown</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-mono tabular-nums ${
                  state.activeTab === 'budget'
                    ? 'bg-indigo-800/50 text-indigo-100'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                }`}
              >
                {state.budgetRows.length}
              </span>
            </button>

            <button
              onClick={() =>
                setState((previousState) => ({ ...previousState, activeTab: 'timeline' }))
              }
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                state.activeTab === 'timeline'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Calendar className="h-4 w-4" />
              <span>Timeline & Milestones</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-mono tabular-nums ${
                  state.activeTab === 'timeline'
                    ? 'bg-indigo-800/50 text-indigo-100'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                }`}
              >
                {completedTasksCount}/{state.tasks.length}
              </span>
            </button>

            <button
              onClick={() =>
                setState((previousState) => ({ ...previousState, activeTab: 'schedule' }))
              }
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                state.activeTab === 'schedule'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Clock className="h-4 w-4" />
              <span>Day-of Run Sheet</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-mono tabular-nums ${
                  state.activeTab === 'schedule'
                    ? 'bg-indigo-800/50 text-indigo-100'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                }`}
              >
                {state.schedule.length}
              </span>
            </button>

            <button
              onClick={() =>
                setState((previousState) => ({ ...previousState, activeTab: 'vendors' }))
              }
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                state.activeTab === 'vendors'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Briefcase className="h-4 w-4" />
              <span>Vendors & Quotes</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-mono tabular-nums ${
                  state.activeTab === 'vendors'
                    ? 'bg-indigo-800/50 text-indigo-100'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                }`}
              >
                {state.vendors.length}
              </span>
            </button>

            <button
              onClick={() =>
                setState((previousState) => ({ ...previousState, activeTab: 'guests' }))
              }
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                state.activeTab === 'guests'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Users className="h-4 w-4" />
              <span>Guests & RSVP</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-mono tabular-nums ${
                  state.activeTab === 'guests'
                    ? 'bg-indigo-800/50 text-indigo-100'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                }`}
              >
                {confirmedGuestsCount}
              </span>
            </button>

            <button
              onClick={() =>
                setState((previousState) => ({ ...previousState, activeTab: 'ideas' }))
              }
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                state.activeTab === 'ideas'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Lightbulb className="h-4 w-4" />
              <span>Creative Concepts</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-mono tabular-nums ${
                  state.activeTab === 'ideas'
                    ? 'bg-indigo-800/50 text-indigo-100'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                }`}
              >
                {state.ideas.length}
              </span>
            </button>
          </div>

          {/* Active Tab Component Render */}
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

      {/* Print View for Clean PDF Generation */}
      <PrintView state={state} />

      {/* AI Intelligence Modal */}
      <AIModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState((previousState) => ({ ...previousState, isOpen: false }))}
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

      {/* Floating Animated Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white shadow-xl dark:bg-white dark:text-slate-900 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 dark:text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
