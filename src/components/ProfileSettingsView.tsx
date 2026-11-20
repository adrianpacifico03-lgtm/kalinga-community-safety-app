import React, { useState } from 'react';
import {
  Bell,
  Check,
  Database,
  Lock,
  Moon,
  RotateCcw,
  Shield,
  Sun,
  Trash2,
} from 'lucide-react';
import { PHILIPPINE_CITIES, SAFETY_GUIDES } from '../data/philippinesData';
import type { ReminderItem, UserProfile } from '../types/kalinga';
import { estimateLocalStorageBytes } from '../utils/storage';
import { ConfirmDialog } from './ConfirmDialog';
import { PWAInstallButton } from './PWAInstallButton';

interface ProfileSettingsViewProps {
  profile: UserProfile;
  reminders: ReminderItem[];
  onUpdateProfile: (profile: UserProfile) => void;
  onToggleReminder: (id: string) => void;
  onChangeReminderFrequency: (
    id: string,
    frequency: ReminderItem['frequency'],
  ) => void;
  onMarkReminderChecked: (id: string) => void;
  onRerunOnboarding: () => void;
  onClearAllData: () => void;
}

export const ProfileSettingsView: React.FC<ProfileSettingsViewProps> = ({
  profile,
  reminders,
  onUpdateProfile,
  onToggleReminder,
  onChangeReminderFrequency,
  onMarkReminderChecked,
  onRerunOnboarding,
  onClearAllData,
}) => {
  const [name, setName] = useState(profile.name);
  const [city, setCity] = useState(profile.city);
  const [householdSize, setHouseholdSize] = useState(profile.householdSize);
  const [householdNotes, setHouseholdNotes] = useState(profile.householdNotes);
  const [savedNotice, setSavedNotice] = useState(false);

  const [permissionPromptOpen, setPermissionPromptOpen] = useState(false);
  const [permissionMessage, setPermissionMessage] = useState('');
  const [clearConfirmOpen, setClearConfirmOpen] = useState(false);

  const storageBytes = estimateLocalStorageBytes();
  const storageKb = (storageBytes / 1024).toFixed(1);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...profile,
      name: name.trim(),
      city,
      householdSize: householdSize.trim(),
      householdNotes: householdNotes.trim(),
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  const handleToggleNotifications = () => {
    if (profile.notificationsEnabled) {
      onUpdateProfile({ ...profile, notificationsEnabled: false });
      setPermissionMessage('Safety reminder notifications disabled.');
      return;
    }
    setPermissionPromptOpen(true);
  };

  const handleConfirmEnableNotifications = async () => {
    setPermissionPromptOpen(false);
    if (typeof Notification !== 'undefined') {
      try {
        const result = await Notification.requestPermission();
        if (result === 'granted') {
          onUpdateProfile({ ...profile, notificationsEnabled: true });
          setPermissionMessage('Browser reminder notifications enabled.');
        } else {
          onUpdateProfile({ ...profile, notificationsEnabled: true });
          setPermissionMessage(
            'In-app reminders enabled. Browser popup permission was declined.',
          );
        }
      } catch {
        onUpdateProfile({ ...profile, notificationsEnabled: true });
        setPermissionMessage('In-app reminders enabled locally.');
      }
    } else {
      onUpdateProfile({ ...profile, notificationsEnabled: true });
      setPermissionMessage('In-app reminders enabled locally.');
    }
  };

  return (
    <div className="space-y-6">
      <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-teal-600 dark:text-teal-300">
            Profile, Reminders & Privacy
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
            Settings & Preferences
          </h1>
        </div>
        <PWAInstallButton />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Profile + Household + Reminders */}
        <div className="lg:col-span-7 space-y-6">
          <form
            onSubmit={handleSaveProfile}
            className="rounded-2xl bg-white dark:bg-[#11223A] border border-slate-200 dark:border-slate-700/50 p-6 space-y-4"
          >
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              Personal & Location Preferences
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="profile-name"
                  className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
                >
                  Display Name (optional)
                </label>
                <input
                  id="profile-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Neighbor"
                  className="w-full min-h-[44px] rounded-xl bg-slate-50 dark:bg-[#0A1628] border border-slate-300 dark:border-slate-700 px-3.5 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-teal-400"
                />
              </div>

              <div>
                <label
                  htmlFor="profile-city"
                  className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
                >
                  Preferred City / Municipality
                </label>
                <select
                  id="profile-city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full min-h-[44px] rounded-xl bg-slate-50 dark:bg-[#0A1628] border border-slate-300 dark:border-slate-700 px-3.5 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-teal-400"
                >
                  {PHILIPPINE_CITIES.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name} — {c.region}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="household-size"
                  className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
                >
                  Household Size (optional)
                </label>
                <input
                  id="household-size"
                  type="text"
                  value={householdSize}
                  onChange={(e) => setHouseholdSize(e.target.value)}
                  placeholder="e.g., 4 members"
                  className="w-full min-h-[44px] rounded-xl bg-slate-50 dark:bg-[#0A1628] border border-slate-300 dark:border-slate-700 px-3.5 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-teal-400"
                />
              </div>

              <div>
                <label
                  htmlFor="household-notes"
                  className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
                >
                  Care Notes (optional)
                </label>
                <input
                  id="household-notes"
                  type="text"
                  value={householdNotes}
                  onChange={(e) => setHouseholdNotes(e.target.value)}
                  placeholder="e.g., 1 senior, 1 pet"
                  className="w-full min-h-[44px] rounded-xl bg-slate-50 dark:bg-[#0A1628] border border-slate-300 dark:border-slate-700 px-3.5 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-teal-400"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between gap-4">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Stored privately on this device only.
              </p>
              <button
                type="submit"
                className="min-h-[44px] inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold transition-colors"
              >
                {savedNotice ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Saved</span>
                  </>
                ) : (
                  <span>Save Profile</span>
                )}
              </button>
            </div>
          </form>

          {/* Safety Reminders */}
          <section className="rounded-2xl bg-white dark:bg-[#11223A] border border-slate-200 dark:border-slate-700/50 p-6 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <Bell className="w-5 h-5 text-teal-600 dark:text-teal-300 mt-0.5 shrink-0" />
                <div>
                  <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                    Safety Reminders & Notifications
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    Optional routine preparedness reminders. Disable anytime.
                  </p>
                </div>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={profile.notificationsEnabled}
                onClick={handleToggleNotifications}
                className={`min-h-[44px] px-4 rounded-xl text-xs font-semibold transition-colors shrink-0 ${
                  profile.notificationsEnabled
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                {profile.notificationsEnabled ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            {permissionMessage && (
              <p className="text-xs text-teal-600 dark:text-teal-300">
                {permissionMessage}
              </p>
            )}

            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {reminders.map((rem) => (
                <li
                  key={rem.id}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-slate-900 dark:text-white">
                      {rem.title}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {rem.description}
                      {rem.lastCheckedAt && ` · Last checked ${rem.lastCheckedAt}`}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <select
                      aria-label={`Frequency for ${rem.title}`}
                      value={rem.frequency}
                      onChange={(e) =>
                        onChangeReminderFrequency(
                          rem.id,
                          e.target.value as ReminderItem['frequency'],
                        )
                      }
                      className="min-h-[40px] rounded-xl bg-slate-50 dark:bg-[#0D1B2A] border border-slate-200 dark:border-slate-700 px-2.5 text-xs text-slate-800 dark:text-slate-200"
                    >
                      <option value="weekly">Weekly</option>
                      <option value="biweekly">Bi-weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => onMarkReminderChecked(rem.id)}
                      className="min-h-[40px] px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-teal-600 hover:text-white text-xs font-medium text-slate-700 dark:text-slate-200 transition-colors"
                    >
                      Done
                    </button>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={rem.enabled}
                      aria-label={`Toggle ${rem.title}`}
                      onClick={() => onToggleReminder(rem.id)}
                      className={`min-h-[40px] px-3 rounded-xl text-xs font-semibold transition-colors ${
                        rem.enabled
                          ? 'bg-teal-500/15 text-teal-700 dark:text-teal-300'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                      }`}
                    >
                      {rem.enabled ? 'On' : 'Off'}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Right Column: Theme, Offline Storage, Privacy & Disclaimer */}
        <div className="lg:col-span-5 space-y-5">
          {/* App Theme & Offline Content */}
          <section className="rounded-2xl bg-white dark:bg-[#11223A] border border-slate-200 dark:border-slate-700/50 p-5 space-y-4">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              Appearance & Offline Access
            </h2>

            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-medium text-slate-800 dark:text-slate-200">
                  Theme Preference
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Deep Navy Blue is optimized for low-light emergencies.
                </div>
              </div>

              <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-[#0D1B2A]">
                <button
                  type="button"
                  onClick={() => onUpdateProfile({ ...profile, theme: 'dark' })}
                  aria-pressed={profile.theme === 'dark'}
                  className={`min-h-[40px] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    profile.theme === 'dark'
                      ? 'bg-[#11223A] text-teal-300 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5" />
                  <span>Navy</span>
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateProfile({ ...profile, theme: 'light' })}
                  aria-pressed={profile.theme === 'light'}
                  className={`min-h-[40px] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    profile.theme === 'light'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5" />
                  <span>Light</span>
                </button>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Database className="w-4 h-4 text-teal-600 dark:text-teal-300 shrink-0" />
                <div>
                  <div className="text-sm font-medium text-slate-800 dark:text-slate-200">
                    Offline Safety Content
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                    {SAFETY_GUIDES.length} hazard guides cached · {storageKb} KB
                    local data
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  onUpdateProfile({
                    ...profile,
                    offlineGuidesSaved: !profile.offlineGuidesSaved,
                  })
                }
                className="min-h-[40px] px-3 rounded-xl bg-teal-500/15 text-teal-700 dark:text-teal-300 text-xs font-semibold"
              >
                {profile.offlineGuidesSaved ? 'Ready' : 'Enable'}
              </button>
            </div>
          </section>

          {/* Privacy, About & Disclaimer */}
          <section className="rounded-2xl bg-white dark:bg-[#11223A] border border-slate-200 dark:border-slate-700/50 p-5 space-y-4">
            <div className="flex items-center gap-2 text-teal-600 dark:text-teal-300">
              <Lock className="w-4 h-4" />
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                Privacy & Trust
              </h2>
            </div>
            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              KALINGA stores your checklist progress, personal contacts, and
              household preferences strictly on your local device. We do not
              upload contacts or share your location.
            </p>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-orange-500 dark:text-orange-300">
                <Shield className="w-4 h-4" />
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  About KALINGA & Safety Disclaimer
                </h3>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                KALINGA (Prepared Together. Safer Together.) is a community
                disaster preparedness companion. It is a planning tool and does
                not replace official emergency instructions from DOST-PAGASA,
                PHIVOLCS, NDRRMC, BFP, or local emergency responders.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onRerunOnboarding}
                className="min-h-[44px] inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Revisit Setup</span>
              </button>

              <button
                type="button"
                onClick={() => setClearConfirmOpen(true)}
                className="min-h-[44px] inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 text-xs font-medium transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Local Data</span>
              </button>
            </div>
          </section>
        </div>
      </div>

      {/* Pre-Permission Notification Explanation Modal */}
      <ConfirmDialog
        open={permissionPromptOpen}
        title="Enable Safety Reminders?"
        description="KALINGA requests browser notification permission solely to remind you about checking your supplies, charging your power bank, and reviewing your family emergency plan. You can disable this anytime."
        confirmLabel="Allow Reminders"
        onConfirm={handleConfirmEnableNotifications}
        onCancel={() => setPermissionPromptOpen(false)}
      />

      {/* Clear All Local Data Confirmation */}
      <ConfirmDialog
        open={clearConfirmOpen}
        title="Clear All Local KALINGA Data?"
        description="This will erase your saved profile, checklist progress, custom emergency contacts, and saved locations on this device."
        confirmLabel="Erase All Data"
        variant="danger"
        onConfirm={() => {
          setClearConfirmOpen(false);
          onClearAllData();
        }}
        onCancel={() => setClearConfirmOpen(false)}
      />
    </div>
  );
};
