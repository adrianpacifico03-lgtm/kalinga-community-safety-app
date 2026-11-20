import React, { useState } from 'react';
import {
  Award,
  Check,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  Target,
} from 'lucide-react';
import type { ChecklistItem } from '../types/kalinga';
import type { PreparednessSummary } from '../utils/preparedness';
import { ConfirmDialog } from './ConfirmDialog';

interface ReadyCheckViewProps {
  items: ChecklistItem[];
  completedIds: string[];
  summary: PreparednessSummary;
  initialFilter?: 'all' | 'incomplete' | 'completed';
  onToggleItem: (id: string) => void;
  onResetChecklist: () => void;
}

export const ReadyCheckView: React.FC<ReadyCheckViewProps> = ({
  items,
  completedIds,
  summary,
  initialFilter = 'all',
  onToggleItem,
  onResetChecklist,
}) => {
  const [filter, setFilter] = useState<'all' | 'incomplete' | 'completed'>(
    initialFilter,
  );
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const completedSet = new Set(completedIds);

  const visibleItems = items.filter((item) => {
    const isDone = completedSet.has(item.id);
    if (filter === 'incomplete') return !isDone;
    if (filter === 'completed') return isDone;
    return true;
  });

  const categories = summary.categoryProgress.map((cp) => ({
    ...cp,
    items: visibleItems.filter((item) => item.category === cp.category),
  }));

  return (
    <div className="space-y-6">
      {/* Header & Score Summary */}
      <section className="rounded-2xl bg-white dark:bg-[#11223A] border border-slate-200 dark:border-slate-700/50 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-teal-600 dark:text-teal-300">
              Ready Check & Preparedness Score
            </p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
              Emergency Preparedness Checklist
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              {summary.motivationalMessage}
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="text-right">
              <div className="font-mono text-3xl font-bold tabular-nums text-teal-600 dark:text-teal-300">
                {summary.overallPercent}%
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                {summary.completedCount} completed · {summary.remainingCount} remaining
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              disabled={completedIds.length === 0}
              aria-label="Reset checklist"
              className="min-h-[44px] inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Category Progress Bars */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {summary.categoryProgress.map((cat) => (
            <div
              key={cat.category}
              className="rounded-xl bg-slate-50 dark:bg-[#0D1B2A] p-4"
            >
              <div className="flex items-center justify-between gap-2 text-xs font-medium">
                <span className="text-slate-800 dark:text-slate-200 truncate">
                  {cat.category}
                </span>
                <span className="font-mono tabular-nums text-teal-600 dark:text-teal-300 shrink-0">
                  {cat.completed}/{cat.total} ({cat.percent}%)
                </span>
              </div>
              <div className="mt-2.5 h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-teal-500 transition-all duration-500 ease-out"
                  style={{ width: `${cat.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Next Action Banner */}
        {summary.nextAction ? (
          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-200">
              <Target className="w-4 h-4 text-orange-500 dark:text-orange-300 shrink-0" />
              <span>
                Suggested next action:{' '}
                <strong className="font-semibold">
                  {summary.nextAction.title}
                </strong>{' '}
                — {summary.nextAction.description}
              </span>
            </div>
            <button
              type="button"
              onClick={() => onToggleItem(summary.nextAction!.id)}
              className="min-h-[44px] px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold whitespace-nowrap shrink-0 transition-colors"
            >
              Complete Next Step
            </button>
          </div>
        ) : (
          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2.5 text-sm text-teal-600 dark:text-teal-300 font-medium">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>
              All {summary.totalCount} checklist items are complete. Remember to
              inspect perishable items every 6 months.
            </span>
          </div>
        )}
      </section>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          className="inline-flex items-center gap-1 p-1 rounded-xl bg-slate-200/80 dark:bg-[#11223A] border border-slate-200 dark:border-slate-800"
          role="group"
          aria-label="Filter checklist items"
        >
          {(
            [
              { id: 'all', label: `All (${summary.totalCount})` },
              { id: 'incomplete', label: `To Do (${summary.remainingCount})` },
              { id: 'completed', label: `Completed (${summary.completedCount})` },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={`min-h-[40px] px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap tabular-nums ${
                filter === tab.id
                  ? 'bg-white dark:bg-teal-600 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          Progress saves automatically on this device.
        </p>
      </div>

      {/* Checklist Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 space-y-5">
          {visibleItems.length === 0 ? (
            <div className="rounded-2xl bg-white dark:bg-[#11223A] border border-slate-200 dark:border-slate-700/50 p-8 text-center">
              <CheckCircle2 className="w-8 h-8 text-teal-500 mx-auto" />
              <h2 className="mt-3 text-base font-semibold text-slate-900 dark:text-white">
                {filter === 'incomplete'
                  ? 'Everything is checked off!'
                  : 'No completed items yet'}
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {filter === 'incomplete'
                  ? 'All tasks in your readiness checklist are marked complete.'
                  : 'Switch to All or To Do to begin organizing your kit.'}
              </p>
            </div>
          ) : (
            categories
              .filter((cat) => cat.items.length > 0)
              .map((cat) => (
                <section
                  key={cat.category}
                  className="rounded-2xl bg-white dark:bg-[#11223A] border border-slate-200 dark:border-slate-700/50 overflow-hidden"
                >
                  <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                    <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                      {cat.category}
                    </h2>
                    <span className="font-mono text-xs tabular-nums text-slate-500 dark:text-slate-400">
                      {cat.completed}/{cat.total} ready
                    </span>
                  </div>

                  <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                    {cat.items.map((item) => {
                      const checked = completedSet.has(item.id);
                      return (
                        <button
                          key={item.id}
                          type="button"
                          role="checkbox"
                          aria-checked={checked}
                          onClick={() => onToggleItem(item.id)}
                          className="w-full min-h-[60px] px-5 py-3.5 text-left flex items-start gap-4 hover:bg-slate-50 dark:hover:bg-[#162B47] transition-colors focus-visible:outline-2 focus-visible:outline-teal-400"
                        >
                          <span
                            className={`mt-0.5 w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 transition-colors ${
                              checked
                                ? 'bg-teal-500 border-teal-500 text-white'
                                : 'border-slate-300 dark:border-slate-600 bg-transparent'
                            }`}
                          >
                            {checked && <Check className="w-4 h-4 stroke-[2.5]" />}
                          </span>

                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span
                                className={`text-sm font-medium ${
                                  checked
                                    ? 'line-through text-slate-400 dark:text-slate-500'
                                    : 'text-slate-900 dark:text-slate-100'
                                }`}
                              >
                                {item.title}
                              </span>
                              {item.recommended && !checked && (
                                <span className="text-[11px] font-medium text-orange-600 dark:text-orange-300">
                                  · Priority
                                </span>
                              )}
                            </div>
                            <p className="mt-0.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                              {item.description}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </section>
              ))
          )}
        </div>

        {/* Milestones & Readiness Disclaimer */}
        <aside className="lg:col-span-4 space-y-5">
          <div className="rounded-2xl bg-white dark:bg-[#11223A] border border-slate-200 dark:border-slate-700/50 p-5">
            <div className="flex items-center gap-2 text-teal-600 dark:text-teal-300">
              <Award className="w-5 h-5" />
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                Readiness Milestones
              </h2>
            </div>

            <ul className="mt-4 space-y-2.5">
              {summary.milestones.map((milestone) => (
                <li
                  key={milestone.id}
                  className={`rounded-xl p-3.5 transition-colors ${
                    milestone.achieved
                      ? 'bg-teal-500/12'
                      : 'bg-slate-50 dark:bg-[#0D1B2A]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                      {milestone.title}
                    </span>
                    <span
                      className={`text-xs font-medium ${
                        milestone.achieved
                          ? 'text-teal-600 dark:text-teal-300'
                          : 'text-slate-400 dark:text-slate-500'
                      }`}
                    >
                      {milestone.achieved ? 'Achieved' : 'In progress'}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                    {milestone.description}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl bg-slate-100 dark:bg-[#0D1B2A] border border-slate-200 dark:border-slate-800 p-4 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
            Preparedness scores measure checklist completion to encourage
            practical planning. Completing items does not guarantee safety during
            an emergency—always follow official evacuation orders.
          </div>
        </aside>
      </div>

      <ConfirmDialog
        open={showResetConfirm}
        title="Reset Preparedness Checklist?"
        description="This will uncheck all completed items on this device so you can start a fresh readiness check."
        confirmLabel="Reset All Items"
        variant="danger"
        onConfirm={() => {
          onResetChecklist();
          setShowResetConfirm(false);
        }}
        onCancel={() => setShowResetConfirm(false)}
      />
    </div>
  );
};
