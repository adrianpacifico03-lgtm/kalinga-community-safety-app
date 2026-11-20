import type {
  ChecklistCategory,
  ChecklistItem,
  HouseholdPriority,
} from '../types/kalinga';

export interface CategoryProgress {
  category: ChecklistCategory;
  completed: number;
  total: number;
  percent: number;
}

export interface PreparednessMilestone {
  id: string;
  title: string;
  thresholdPercent: number;
  achieved: boolean;
  description: string;
}

export interface PreparednessSummary {
  overallPercent: number;
  completedCount: number;
  totalCount: number;
  remainingCount: number;
  categoryProgress: CategoryProgress[];
  motivationalMessage: string;
  nextAction: ChecklistItem | null;
  milestones: PreparednessMilestone[];
}

const CATEGORIES: ChecklistCategory[] = [
  'Emergency Essentials',
  'Basic Necessities',
  'Communication & Planning',
];

export function calculatePreparednessScore(
  items: ChecklistItem[],
  completedIds: string[],
): PreparednessSummary {
  const completedSet = new Set(completedIds);
  const totalCount = items.length;
  const completedCount = items.filter((item) => completedSet.has(item.id)).length;
  const remainingCount = Math.max(0, totalCount - completedCount);
  const overallPercent =
    totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  const categoryProgress: CategoryProgress[] = CATEGORIES.map((category) => {
    const catItems = items.filter((item) => item.category === category);
    const catCompleted = catItems.filter((item) => completedSet.has(item.id)).length;
    const catTotal = catItems.length;
    const percent =
      catTotal === 0 ? 0 : Math.round((catCompleted / catTotal) * 100);

    return {
      category,
      completed: catCompleted,
      total: catTotal,
      percent,
    };
  });

  const nextAction = getNextIncompleteItem(items, completedIds);
  const motivationalMessage = getMotivationalMessage(overallPercent, completedCount);
  const milestones = buildMilestones(overallPercent, completedCount, categoryProgress);

  return {
    overallPercent,
    completedCount,
    totalCount,
    remainingCount,
    categoryProgress,
    motivationalMessage,
    nextAction,
    milestones,
  };
}

export function getNextIncompleteItem(
  items: ChecklistItem[],
  completedIds: string[],
): ChecklistItem | null {
  const completedSet = new Set(completedIds);
  const prioritized = items.find(
    (item) => item.recommended && !completedSet.has(item.id),
  );
  if (prioritized) return prioritized;
  return items.find((item) => !completedSet.has(item.id)) ?? null;
}

export function getMotivationalMessage(
  overallPercent: number,
  completedCount: number,
): string {
  if (completedCount === 0) {
    return 'Being prepared starts with one small step.';
  }
  if (overallPercent < 30) {
    return 'Good start. Keep adding core essentials for your household.';
  }
  if (overallPercent < 60) {
    return "You're building a safer tomorrow, one item at a time.";
  }
  if (overallPercent < 85) {
    return 'Strong progress. Review your family meeting and evacuation plan next.';
  }
  if (overallPercent < 100) {
    return 'Almost complete. Finish the remaining checks and keep supplies fresh.';
  }
  return 'Checklist complete. Review expiration dates and battery levels regularly.';
}

function buildMilestones(
  overallPercent: number,
  completedCount: number,
  categoryProgress: CategoryProgress[],
): PreparednessMilestone[] {
  const essentials = categoryProgress.find(
    (c) => c.category === 'Emergency Essentials',
  );
  const comms = categoryProgress.find(
    (c) => c.category === 'Communication & Planning',
  );

  return [
    {
      id: 'first-step',
      title: 'First Step Taken',
      thresholdPercent: 5,
      achieved: completedCount >= 1,
      description: 'Checked off your very first preparedness item.',
    },
    {
      id: 'essentials-half',
      title: 'Go-Bag Foundation',
      thresholdPercent: 25,
      achieved: (essentials?.percent ?? 0) >= 50,
      description: 'Completed at least half of your Emergency Essentials.',
    },
    {
      id: 'halfway-ready',
      title: 'Halfway Prepared',
      thresholdPercent: 50,
      achieved: overallPercent >= 50,
      description: 'Reached 50% overall checklist completion.',
    },
    {
      id: 'family-plan-set',
      title: 'Household Aligned',
      thresholdPercent: 75,
      achieved: (comms?.percent ?? 0) === 100,
      description: 'Completed all Communication & Planning steps.',
    },
    {
      id: 'full-readiness',
      title: 'Checklist Complete',
      thresholdPercent: 100,
      achieved: overallPercent === 100,
      description: 'All recommended readiness tasks are checked off.',
    },
  ];
}

export function applyPriorityFocus(
  items: ChecklistItem[],
  priorities: HouseholdPriority[],
): ChecklistItem[] {
  if (priorities.length === 0) {
    return items;
  }
  const prioritySet = new Set(priorities);
  return items.map((item) => ({
    ...item,
    recommended:
      Boolean(item.recommended) ||
      Boolean(item.priorityFocus?.some((focus) => prioritySet.has(focus))),
  }));
}
