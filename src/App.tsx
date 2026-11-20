/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useEffect, useMemo, useState } from 'react';
import {
  BookOpen,
  ClipboardCheck,
  Home,
  MapPin,
  PhoneCall,
  Shield,
  User,
} from 'lucide-react';
import { CircleOfSafetyView } from './components/CircleOfSafetyView';
import { HomeDashboard } from './components/HomeDashboard';
import { OfflineIndicator } from './components/OfflineIndicator';
import { OnboardingFlow } from './components/OnboardingFlow';
import { ProfileSettingsView } from './components/ProfileSettingsView';
import { PWAInstallButton } from './components/PWAInstallButton';
import { ReadyCheckView } from './components/ReadyCheckView';
import { SafeSpotsView } from './components/SafeSpotsView';
import { SafetyGuideView } from './components/SafetyGuideView';
import {
  DEFAULT_CHECKLIST_ITEMS,
  DEFAULT_CONTACTS,
  DEFAULT_REMINDERS,
  DEFAULT_USER_PROFILE,
} from './data/philippinesData';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { useWeatherAdvisory } from './hooks/useWeatherAdvisory';
import {
  AppTab,
  type EmergencyContact,
  type ReminderItem,
  type UserProfile,
} from './types/kalinga';
import {
  applyPriorityFocus,
  calculatePreparednessScore,
} from './utils/preparedness';
import {
  clearAllLocalData,
  loadCompletedChecklistIds,
  loadContacts,
  loadReminders,
  loadSavedFacilityIds,
  loadUserProfile,
  saveCompletedChecklistIds,
  saveContacts,
  saveReminders,
  saveSavedFacilityIds,
  saveUserProfile,
} from './utils/storage';

const BOTTOM_NAV_ITEMS: Array<{
  id: AppTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { id: AppTab.HOME, label: 'Home', icon: Home },
  { id: AppTab.READY_CHECK, label: 'Ready Check', icon: ClipboardCheck },
  { id: AppTab.SAFE_SPOTS, label: 'Safe Spots', icon: MapPin },
  { id: AppTab.SAFETY_GUIDE, label: 'Safety Guide', icon: BookOpen },
  { id: AppTab.PROFILE, label: 'Profile', icon: User },
];

export default function App() {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const loaded = loadUserProfile();
    if (
      typeof window !== 'undefined' &&
      new URLSearchParams(window.location.search).get('autostart') === '1'
    ) {
      return { ...loaded, onboardingCompleted: true };
    }
    return loaded;
  });

  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.HOME);
  const [readyCheckFilter, setReadyCheckFilter] = useState<
    'all' | 'incomplete' | 'completed'
  >('all');

  const [completedIds, setCompletedIds] = useState<string[]>(() =>
    loadCompletedChecklistIds(),
  );
  const [contacts, setContacts] = useState<EmergencyContact[]>(() =>
    loadContacts(),
  );
  const [savedFacilityIds, setSavedFacilityIds] = useState<string[]>(() =>
    loadSavedFacilityIds(),
  );
  const [reminders, setReminders] = useState<ReminderItem[]>(() =>
    loadReminders(),
  );

  const isOnline = useOnlineStatus();
  const weather = useWeatherAdvisory(profile.city, isOnline);

  // Sync theme class & theme-color meta tag
  useEffect(() => {
    const isDark = profile.theme === 'dark';
    document.documentElement.classList.toggle('dark', isDark);
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', isDark ? '#0A1628' : '#F8FAFC');
    }
  }, [profile.theme]);

  const checklistItems = useMemo(
    () => applyPriorityFocus(DEFAULT_CHECKLIST_ITEMS, profile.priorities),
    [profile.priorities],
  );

  const preparednessSummary = useMemo(
    () => calculatePreparednessScore(checklistItems, completedIds),
    [checklistItems, completedIds],
  );

  const handleUpdateProfile = (next: UserProfile) => {
    setProfile(next);
    saveUserProfile(next);
  };

  const handleCompleteOnboarding = (updated: UserProfile) => {
    handleUpdateProfile(updated);
    setActiveTab(AppTab.HOME);
  };

  const handleSkipOnboarding = () => {
    handleUpdateProfile({ ...profile, onboardingCompleted: true });
    setActiveTab(AppTab.HOME);
  };

  const handleNavigate = (
    tab: AppTab,
    options?: { filterIncomplete?: boolean },
  ) => {
    if (tab === AppTab.READY_CHECK) {
      setReadyCheckFilter(options?.filterIncomplete ? 'incomplete' : 'all');
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleChecklistItem = (id: string) => {
    setCompletedIds((prev) => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter((item) => item !== id) : [...prev, id];
      saveCompletedChecklistIds(next);
      return next;
    });
  };

  const handleResetChecklist = () => {
    setCompletedIds([]);
    saveCompletedChecklistIds([]);
  };

  const handleSaveContact = (contact: EmergencyContact) => {
    setContacts((prev) => {
      const exists = prev.some((c) => c.id === contact.id);
      const next = exists
        ? prev.map((c) => (c.id === contact.id ? contact : c))
        : [...prev, contact];
      saveContacts(next);
      return next;
    });
  };

  const handleDeleteContact = (id: string) => {
    setContacts((prev) => {
      const next = prev.filter((c) => c.id !== id);
      saveContacts(next);
      return next;
    });
  };

  const handleToggleContactPriority = (id: string) => {
    setContacts((prev) => {
      const next = prev.map((c) =>
        c.id === id ? { ...c, isPriority: !c.isPriority } : c,
      );
      saveContacts(next);
      return next;
    });
  };

  const handleToggleSaveFacility = (id: string) => {
    setSavedFacilityIds((prev) => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter((item) => item !== id) : [...prev, id];
      saveSavedFacilityIds(next);
      return next;
    });
  };

  const handleToggleReminder = (id: string) => {
    setReminders((prev) => {
      const next = prev.map((r) =>
        r.id === id ? { ...r, enabled: !r.enabled } : r,
      );
      saveReminders(next);
      return next;
    });
  };

  const handleChangeReminderFrequency = (
    id: string,
    frequency: ReminderItem['frequency'],
  ) => {
    setReminders((prev) => {
      const next = prev.map((r) =>
        r.id === id ? { ...r, frequency } : r,
      );
      saveReminders(next);
      return next;
    });
  };

  const handleMarkReminderChecked = (id: string) => {
    const today = new Date().toLocaleDateString('en-PH', {
      month: 'short',
      day: 'numeric',
    });
    setReminders((prev) => {
      const next = prev.map((r) =>
        r.id === id ? { ...r, lastCheckedAt: today } : r,
      );
      saveReminders(next);
      return next;
    });
  };

  const handleClearAllData = () => {
    clearAllLocalData();
    setProfile({ ...DEFAULT_USER_PROFILE, onboardingCompleted: false });
    setCompletedIds([]);
    setContacts(DEFAULT_CONTACTS);
    setSavedFacilityIds(['fac-evac-1']);
    setReminders(DEFAULT_REMINDERS);
    setActiveTab(AppTab.HOME);
  };

  if (!profile.onboardingCompleted) {
    return (
      <OnboardingFlow
        initialProfile={profile}
        onComplete={handleCompleteOnboarding}
        onSkip={handleSkipOnboarding}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0A1628] text-slate-900 dark:text-slate-100 flex flex-col lg:flex-row">
      {/* Desktop Persistent Navigation Rail */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white dark:bg-[#0D1B2A] border-r border-slate-200 dark:border-slate-800/80 p-5 justify-between z-30">
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-xl bg-teal-500/15 border border-teal-400/30 flex items-center justify-center text-teal-600 dark:text-teal-300 shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="font-display text-lg font-bold tracking-tight text-slate-900 dark:text-white leading-none">
                KALINGA
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Prepared Together
              </div>
            </div>
          </div>

          <nav aria-label="Primary Navigation" className="space-y-1.5">
            {BOTTOM_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavigate(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl flex items-center gap-3 text-sm font-medium transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#11223A] hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}

            <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => handleNavigate(AppTab.CIRCLE_OF_SAFETY)}
                aria-current={
                  activeTab === AppTab.CIRCLE_OF_SAFETY ? 'page' : undefined
                }
                className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl flex items-center gap-3 text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === AppTab.CIRCLE_OF_SAFETY
                    ? 'bg-orange-500 text-white shadow-sm'
                    : 'text-orange-600 dark:text-orange-300 bg-orange-500/10 hover:bg-orange-500/20'
                }`}
              >
                <PhoneCall className="w-4 h-4 shrink-0" />
                <span>Circle of Safety</span>
              </button>
            </div>
          </nav>
        </div>

        <div className="space-y-3">
          <PWAInstallButton />
          <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400 px-1">
            Local-first storage · Offline safety guides active
          </p>
        </div>
      </aside>

      {/* Mobile Compact Top App Bar (<= 56px) */}
      <header className="lg:hidden sticky top-0 z-30 h-14 px-4 bg-white/90 dark:bg-[#0D1B2A]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => handleNavigate(AppTab.HOME)}
          className="min-h-[44px] flex items-center gap-2.5 whitespace-nowrap shrink-0"
        >
          <div className="w-8 h-8 rounded-lg bg-teal-500/15 border border-teal-400/30 flex items-center justify-center text-teal-600 dark:text-teal-300">
            <Shield className="w-4 h-4" />
          </div>
          <span className="font-display font-bold text-base tracking-tight text-slate-900 dark:text-white">
            KALINGA
          </span>
        </button>

        <div className="flex items-center gap-2 shrink-0">
          <PWAInstallButton compact />
          <button
            type="button"
            onClick={() => handleNavigate(AppTab.CIRCLE_OF_SAFETY)}
            aria-label="Open Circle of Safety emergency contacts"
            className={`min-h-[44px] inline-flex items-center gap-1.5 px-3 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === AppTab.CIRCLE_OF_SAFETY
                ? 'bg-orange-500 text-white'
                : 'bg-orange-500/15 text-orange-700 dark:text-orange-300'
            }`}
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Contacts</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 lg:pl-64 pb-24 lg:pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {activeTab === AppTab.HOME && (
            <HomeDashboard
              profile={profile}
              summary={preparednessSummary}
              checklistItems={checklistItems}
              completedIds={completedIds}
              contacts={contacts}
              reminders={reminders}
              weather={weather}
              onNavigate={handleNavigate}
              onToggleItem={handleToggleChecklistItem}
            />
          )}

          {activeTab === AppTab.READY_CHECK && (
            <ReadyCheckView
              key={readyCheckFilter}
              items={checklistItems}
              completedIds={completedIds}
              summary={preparednessSummary}
              initialFilter={readyCheckFilter}
              onToggleItem={handleToggleChecklistItem}
              onResetChecklist={handleResetChecklist}
            />
          )}

          {activeTab === AppTab.SAFE_SPOTS && (
            <SafeSpotsView
              preferredCity={profile.city}
              savedIds={savedFacilityIds}
              onToggleSave={handleToggleSaveFacility}
            />
          )}

          {activeTab === AppTab.SAFETY_GUIDE && <SafetyGuideView />}

          {activeTab === AppTab.CIRCLE_OF_SAFETY && (
            <CircleOfSafetyView
              contacts={contacts}
              profile={profile}
              onSaveContact={handleSaveContact}
              onDeleteContact={handleDeleteContact}
              onTogglePriority={handleToggleContactPriority}
              onUpdateLocalDrrmo={(localDrrmoName, localDrrmoNumber) =>
                handleUpdateProfile({
                  ...profile,
                  localDrrmoName,
                  localDrrmoNumber,
                })
              }
            />
          )}

          {activeTab === AppTab.PROFILE && (
            <ProfileSettingsView
              profile={profile}
              reminders={reminders}
              onUpdateProfile={handleUpdateProfile}
              onToggleReminder={handleToggleReminder}
              onChangeReminderFrequency={handleChangeReminderFrequency}
              onMarkReminderChecked={handleMarkReminderChecked}
              onRerunOnboarding={() =>
                handleUpdateProfile({ ...profile, onboardingCompleted: false })
              }
              onClearAllData={handleClearAllData}
            />
          )}
        </div>
      </main>

      {/* Mobile Fixed Bottom Navigation Bar (5 destinations, h-16 = 64px) */}
      <nav
        aria-label="Bottom Navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0D1B2A]/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800/80 pb-safe"
      >
        <div className="grid grid-cols-5 h-16 items-center">
          {BOTTOM_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavigate(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`min-h-[48px] flex flex-col items-center justify-center gap-1 px-1 transition-colors ${
                  isActive
                    ? 'text-teal-600 dark:text-teal-300'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium tracking-tight truncate max-w-full">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      <OfflineIndicator />
    </div>
  );
}
