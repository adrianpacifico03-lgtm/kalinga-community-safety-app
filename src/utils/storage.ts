import {
  DEFAULT_CONTACTS,
  DEFAULT_REMINDERS,
  DEFAULT_USER_PROFILE,
} from '../data/philippinesData';
import type {
  EmergencyContact,
  ReminderItem,
  UserProfile,
} from '../types/kalinga';

const KEYS = {
  PROFILE: 'kalinga_v1_profile',
  CHECKLIST: 'kalinga_v1_checklist_completed',
  CONTACTS: 'kalinga_v1_contacts',
  SAVED_FACILITIES: 'kalinga_v1_saved_facilities',
  REMINDERS: 'kalinga_v1_reminders',
} as const;

function safeReadJson<T>(key: string, fallback: T): T {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return fallback;
    }
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeWriteJson<T>(key: string, value: T): void {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage quota or private mode unavailable; keep running smoothly in memory
  }
}

export function loadUserProfile(): UserProfile {
  const stored = safeReadJson<Partial<UserProfile>>(KEYS.PROFILE, {});
  return { ...DEFAULT_USER_PROFILE, ...stored };
}

export function saveUserProfile(profile: UserProfile): void {
  safeWriteJson(KEYS.PROFILE, profile);
}

export function loadCompletedChecklistIds(): string[] {
  return safeReadJson<string[]>(KEYS.CHECKLIST, []);
}

export function saveCompletedChecklistIds(ids: string[]): void {
  safeWriteJson(KEYS.CHECKLIST, ids);
}

export function loadContacts(): EmergencyContact[] {
  return safeReadJson<EmergencyContact[]>(KEYS.CONTACTS, DEFAULT_CONTACTS);
}

export function saveContacts(contacts: EmergencyContact[]): void {
  safeWriteJson(KEYS.CONTACTS, contacts);
}

export function loadSavedFacilityIds(): string[] {
  return safeReadJson<string[]>(KEYS.SAVED_FACILITIES, ['fac-evac-1']);
}

export function saveSavedFacilityIds(ids: string[]): void {
  safeWriteJson(KEYS.SAVED_FACILITIES, ids);
}

export function loadReminders(): ReminderItem[] {
  return safeReadJson<ReminderItem[]>(KEYS.REMINDERS, DEFAULT_REMINDERS);
}

export function saveReminders(reminders: ReminderItem[]): void {
  safeWriteJson(KEYS.REMINDERS, reminders);
}

export function clearAllLocalData(): void {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    Object.values(KEYS).forEach((key) => window.localStorage.removeItem(key));
  } catch {
    // Ignore storage removal errors
  }
}

export function estimateLocalStorageBytes(): number {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return 0;
    return Object.values(KEYS).reduce((acc, key) => {
      const value = window.localStorage.getItem(key) ?? '';
      return acc + key.length + value.length;
    }, 0);
  } catch {
    return 0;
  }
}
