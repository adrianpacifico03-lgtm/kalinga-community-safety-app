import React, { useState } from 'react';
import {
  ArrowRight,
  Bell,
  BookOpen,
  CheckCircle2,
  CloudRain,
  Compass,
  MapPin,
  PhoneCall,
  RefreshCw,
  ShieldCheck,
  TrendingUp,
  Users,
} from 'lucide-react';
import {
  COMMUNITY_ADVISORIES,
  DAILY_TIPS,
} from '../data/philippinesData';
import {
  AppTab,
  type ChecklistItem,
  type EmergencyContact,
  type ReminderItem,
  type UserProfile,
  type WeatherAdvisoryState,
} from '../types/kalinga';
import type { PreparednessSummary } from '../utils/preparedness';

interface HomeDashboardProps {
  profile: UserProfile;
  summary: PreparednessSummary;
  checklistItems: ChecklistItem[];
  completedIds: string[];
  contacts: EmergencyContact[];
  reminders: ReminderItem[];
  weather: WeatherAdvisoryState;
  onNavigate: (tab: AppTab, options?: { filterIncomplete?: boolean }) => void;
  onToggleItem: (id: string) => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  profile,
  summary,
  checklistItems,
  completedIds,
  contacts,
  reminders,
  weather,
  onNavigate,
  onToggleItem,
}) => {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
      (1000 * 60 * 60 * 24),
  );
  const [tipOffset, setTipOffset] = useState(0);
  const activeTip = DAILY_TIPS[(dayOfYear + tipOffset) % DAILY_TIPS.length];

  const todayFormatted = new Date().toLocaleDateString('en-PH', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const hour = new Date().getHours();
  const timeGreeting =
    hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const displayName = profile.name.trim() || 'Neighbor';

  const completedSet = new Set(completedIds);
  const recentCompleted = checklistItems
    .filter((item) => completedSet.has(item.id))
    .slice(-3)
    .reverse();

  const activeRemindersCount = reminders.filter((r) => r.enabled).length;

  // SVG progress circle calculations
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (summary.overallPercent / 100) * circumference;

  return (
    <div className="space-y-6">
      {/* Greeting & Date Header */}
      <section className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <p className="text-xs font-medium text-teal-600 dark:text-teal-300">
            {todayFormatted} · {profile.city}
          </p>
          <h1 className="mt-1 text-2xl sm:text-3xl font-bold tracking-[-0.01em] text-slate-900 dark:text-white [text-wrap:balance]">
            {timeGreeting}, {displayName}
          </h1>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Prepared Together · Safer Together
        </p>
      </section>

      {/* Primary Hero Card + Weather / Awareness Split */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Preparedness Status Card */}
        <div className="lg:col-span-7 rounded-2xl bg-white dark:bg-[#11223A] border border-slate-200 dark:border-slate-700/50 p-5 sm:p-6 shadow-sm flex flex-col justify-between">
          <div className="flex flex-row items-center gap-5 sm:gap-6">
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 shrink-0 flex items-center justify-center">
              <svg
                className="w-full h-full -rotate-90"
                viewBox="0 0 120 120"
                aria-label={`Preparedness score ${summary.overallPercent}%`}
              >
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="10"
                  className="text-slate-100 dark:text-slate-800"
                />
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className="text-teal-500 dark:text-teal-400 transition-all duration-700 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="font-mono text-2xl font-bold tabular-nums text-slate-900 dark:text-white">
                  {summary.overallPercent}%
                </span>
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  Ready
                </span>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Your Preparedness ·{' '}
                <span className="tabular-nums">
                  {summary.completedCount} of {summary.totalCount} tasks
                </span>
              </p>
              <h2 className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
                {summary.overallPercent}% Ready
              </h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {summary.motivationalMessage}
              </p>

              {summary.nextAction && (
                <div className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                  Suggested next step:{' '}
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {summary.nextAction.title}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() =>
                onNavigate(AppTab.READY_CHECK, { filterIncomplete: true })
              }
              className="min-h-[44px] inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white px-5 py-2.5 text-sm font-semibold transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-teal-300"
            >
              <span>Continue Preparing</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate(AppTab.CIRCLE_OF_SAFETY)}
              className="min-h-[44px] inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500/15 hover:bg-orange-500/25 text-orange-700 dark:text-orange-300 border border-orange-500/30 px-4 py-2.5 text-sm font-semibold transition-colors whitespace-nowrap shrink-0"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Emergency Contacts ({contacts.length})</span>
            </button>
          </div>
        </div>

        {/* Weather & Local Awareness Card */}
        <div className="lg:col-span-5 rounded-2xl bg-white dark:bg-[#11223A] border border-slate-200 dark:border-slate-700/50 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-sky-600 dark:text-sky-300">
                <CloudRain className="w-5 h-5" />
                <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                  Local Weather & Awareness
                </h2>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {profile.city}
              </span>
            </div>

            {weather.status === 'loading' && (
              <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                Checking local weather conditions for {profile.city}...
              </p>
            )}

            {weather.status === 'success' && (
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-slate-50 dark:bg-[#0D1B2A] p-3">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Temp
                  </div>
                  <div className="mt-1 font-mono text-lg font-bold tabular-nums text-slate-900 dark:text-white">
                    {weather.temperatureC}°C
                  </div>
                </div>
                <div className="rounded-xl bg-slate-50 dark:bg-[#0D1B2A] p-3">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Wind
                  </div>
                  <div className="mt-1 font-mono text-lg font-bold tabular-nums text-slate-900 dark:text-white">
                    {weather.windSpeedKmh} km/h
                  </div>
                </div>
                <div className="rounded-xl bg-slate-50 dark:bg-[#0D1B2A] p-3">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Rain
                  </div>
                  <div className="mt-1 font-mono text-lg font-bold tabular-nums text-slate-900 dark:text-white">
                    {weather.precipitationMm} mm
                  </div>
                </div>
                <div className="col-span-3 text-xs text-slate-600 dark:text-slate-300">
                  Condition: {weather.conditionLabel} · Updated {weather.updatedAt}
                </div>
              </div>
            )}

            {(weather.status === 'offline' || weather.status === 'error') && (
              <div className="mt-4 rounded-xl bg-slate-50 dark:bg-[#0D1B2A] p-4 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                Live weather telemetry is currently unavailable (
                {weather.status === 'offline' ? 'device offline' : 'feed unreachable'}
                ). Offline safety guides and local checklists remain ready.
              </div>
            )}
          </div>

          <p className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-500 dark:text-slate-400">
            Weather data via Open-Meteo. Verify tropical cyclone signals and
            flood warnings directly with DOST-PAGASA.
          </p>
        </div>
      </section>

      {/* Quick Access Grid */}
      <section aria-labelledby="quick-access-heading">
        <h2
          id="quick-access-heading"
          className="text-base font-semibold text-slate-900 dark:text-white mb-3"
        >
          Quick Access
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <button
            type="button"
            onClick={() => onNavigate(AppTab.CIRCLE_OF_SAFETY)}
            className="min-h-[96px] rounded-2xl bg-white dark:bg-[#11223A] border border-slate-200 dark:border-slate-700/50 hover:border-orange-400/60 p-4 text-left transition-colors group"
          >
            <Users className="w-5 h-5 text-orange-500 dark:text-orange-300" />
            <div className="mt-2.5 text-sm font-semibold text-slate-900 dark:text-white group-hover:text-orange-500 dark:group-hover:text-orange-300 transition-colors">
              Circle of Safety
            </div>
            <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Contacts & 911 / 143 hotlines
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate(AppTab.SAFETY_GUIDE)}
            className="min-h-[96px] rounded-2xl bg-white dark:bg-[#11223A] border border-slate-200 dark:border-slate-700/50 hover:border-teal-400/60 p-4 text-left transition-colors group"
          >
            <BookOpen className="w-5 h-5 text-teal-600 dark:text-teal-300" />
            <div className="mt-2.5 text-sm font-semibold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-300 transition-colors">
              Offline Guides
            </div>
            <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              6 hazard manuals ready offline
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate(AppTab.SAFE_SPOTS)}
            className="min-h-[96px] rounded-2xl bg-white dark:bg-[#11223A] border border-slate-200 dark:border-slate-700/50 hover:border-sky-400/60 p-4 text-left transition-colors group"
          >
            <MapPin className="w-5 h-5 text-sky-600 dark:text-sky-300" />
            <div className="mt-2.5 text-sm font-semibold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-300 transition-colors">
              Safe Spots
            </div>
            <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Evacuation & clinic directory
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate(AppTab.READY_CHECK)}
            className="min-h-[96px] rounded-2xl bg-white dark:bg-[#11223A] border border-slate-200 dark:border-slate-700/50 hover:border-teal-400/60 p-4 text-left transition-colors group"
          >
            <TrendingUp className="w-5 h-5 text-teal-600 dark:text-teal-300" />
            <div className="mt-2.5 text-sm font-semibold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-300 transition-colors">
              Readiness Score
            </div>
            <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 tabular-nums">
              {summary.remainingCount} tasks remaining
            </div>
          </button>
        </div>
      </section>

      {/* Tip of the Day, Recent Checklist Progress & Safety Announcements */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Tip of the Day + Recent Checklist */}
        <div className="lg:col-span-7 space-y-5">
          <div className="rounded-2xl bg-white dark:bg-[#11223A] border border-slate-200 dark:border-slate-700/50 p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-teal-600 dark:text-teal-300">
                <Compass className="w-5 h-5" />
                <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                  Preparedness Tip of the Day
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setTipOffset((prev) => prev + 1)}
                className="min-h-[44px] inline-flex items-center gap-1.5 px-3 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Next tip</span>
              </button>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
              {activeTip}
            </p>
          </div>

          <div className="rounded-2xl bg-white dark:bg-[#11223A] border border-slate-200 dark:border-slate-700/50 p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                Recent Checklist Progress
              </h2>
              <button
                type="button"
                onClick={() => onNavigate(AppTab.READY_CHECK)}
                className="text-xs font-medium text-teal-600 dark:text-teal-300 hover:underline"
              >
                View full list
              </button>
            </div>

            {recentCompleted.length === 0 ? (
              <div className="mt-4 rounded-xl bg-slate-50 dark:bg-[#0D1B2A] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  No items checked off yet. Start with drinking water or saving
                  your emergency contacts.
                </p>
                {summary.nextAction && (
                  <button
                    type="button"
                    onClick={() => onToggleItem(summary.nextAction!.id)}
                    className="min-h-[44px] px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold whitespace-nowrap shrink-0 transition-colors"
                  >
                    Mark "{summary.nextAction.title}" ready
                  </button>
                )}
              </div>
            ) : (
              <ul className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
                {recentCompleted.map((item) => (
                  <li
                    key={item.id}
                    className="py-3 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <CheckCircle2 className="w-5 h-5 text-teal-500 shrink-0" />
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-slate-900 dark:text-white truncate">
                          {item.title}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {item.category}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-teal-600 dark:text-teal-300 shrink-0">
                      Ready
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Important Safety Announcements & Reminders Summary */}
        <div className="lg:col-span-5 space-y-5">
          <div className="rounded-2xl bg-white dark:bg-[#11223A] border border-slate-200 dark:border-slate-700/50 p-6">
            <div className="flex items-center gap-2 text-orange-500 dark:text-orange-300">
              <ShieldCheck className="w-5 h-5" />
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                Safety Announcements
              </h2>
            </div>

            <div className="mt-4 space-y-4">
              {COMMUNITY_ADVISORIES.map((adv) => (
                <article
                  key={adv.id}
                  className="rounded-xl bg-slate-50 dark:bg-[#0D1B2A] p-4"
                >
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {adv.source}
                  </p>
                  <h3 className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                    {adv.title}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                    {adv.body}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-white dark:bg-[#11223A] border border-slate-200 dark:border-slate-700/50 p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/15 text-teal-600 dark:text-teal-300 flex items-center justify-center shrink-0">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white">
                  Safety Reminders
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                  {activeRemindersCount} active routine checks
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNavigate(AppTab.PROFILE)}
              className="min-h-[44px] px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200 transition-colors whitespace-nowrap shrink-0"
            >
              Manage
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
