export enum AppTab {
  HOME = 'home',
  READY_CHECK = 'ready-check',
  SAFE_SPOTS = 'safe-spots',
  SAFETY_GUIDE = 'safety-guide',
  PROFILE = 'profile',
  CIRCLE_OF_SAFETY = 'circle-of-safety',
}

export type ChecklistCategory =
  | 'Emergency Essentials'
  | 'Basic Necessities'
  | 'Communication & Planning';

export type HouseholdPriority =
  | 'typhoon-flood'
  | 'earthquake-fire'
  | 'family-children'
  | 'seniors-medical';

export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  category: ChecklistCategory;
  priorityFocus?: HouseholdPriority[];
  recommended?: boolean;
}

export type FacilityCategory =
  | 'Evacuation Centers'
  | 'Hospitals'
  | 'Clinics'
  | 'Fire Stations'
  | 'Police Stations'
  | 'Disaster-Response Offices'
  | 'Pharmacies';

export interface SafeFacility {
  id: string;
  name: string;
  category: FacilityCategory;
  address: string;
  city: string;
  contactLabel: string;
  lat: number;
  lng: number;
  notes: string;
  isSample: boolean;
}

export interface SafetyGuideSection {
  phase: string;
  steps: string[];
}

export interface SafetyGuide {
  id: string;
  title: string;
  subtitle: string;
  authoritySource: string;
  imagePath: string;
  summary: string;
  sections: SafetyGuideSection[];
}

export interface EmergencyContact {
  id: string;
  name: string;
  role: string;
  phone: string;
  isPriority: boolean;
  notes?: string;
}

export interface NationalHotline {
  id: string;
  agency: string;
  number: string;
  description: string;
  scope: string;
}

export interface ReminderItem {
  id: string;
  title: string;
  description: string;
  frequency: 'weekly' | 'biweekly' | 'monthly';
  enabled: boolean;
  lastCheckedAt: string | null;
}

export interface UserProfile {
  name: string;
  city: string;
  householdSize: string;
  householdNotes: string;
  priorities: HouseholdPriority[];
  localDrrmoName: string;
  localDrrmoNumber: string;
  theme: 'dark' | 'light';
  notificationsEnabled: boolean;
  offlineGuidesSaved: boolean;
  onboardingCompleted: boolean;
}

export interface CityLocation {
  name: string;
  region: string;
  lat: number;
  lng: number;
}

export interface WeatherAdvisoryState {
  status: 'idle' | 'loading' | 'success' | 'offline' | 'error';
  temperatureC?: number;
  windSpeedKmh?: number;
  precipitationMm?: number;
  conditionLabel?: string;
  updatedAt?: string;
}
