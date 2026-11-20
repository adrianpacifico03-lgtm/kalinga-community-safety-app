import React, { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  MapPin,
  Shield,
  Users,
} from 'lucide-react';
import { PHILIPPINE_CITIES } from '../data/philippinesData';
import type { HouseholdPriority, UserProfile } from '../types/kalinga';

interface OnboardingFlowProps {
  initialProfile: UserProfile;
  onComplete: (updatedProfile: UserProfile) => void;
  onSkip: () => void;
}

const PRIORITY_OPTIONS: Array<{
  id: HouseholdPriority;
  title: string;
  description: string;
}> = [
  {
    id: 'typhoon-flood',
    title: 'Typhoon & Flood Readiness',
    description: 'Prioritize waterproof pouches, drainage checks, radio, and evacuation bags.',
  },
  {
    id: 'earthquake-fire',
    title: 'Earthquake & Urban Fire',
    description: 'Focus on sturdy shoes, whistle, meeting spots, and utility shutoff readiness.',
  },
  {
    id: 'family-children',
    title: 'Family & Children',
    description: 'Highlight extra hygiene packs, ready-to-eat food, and household briefing.',
  },
  {
    id: 'seniors-medical',
    title: 'Seniors or Medical Needs',
    description: 'Prioritize 7-day maintenance medicines, first-aid, and priority contacts.',
  },
];

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({
  initialProfile,
  onComplete,
  onSkip,
}) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState(initialProfile.name);
  const [city, setCity] = useState(initialProfile.city || 'Quezon City');
  const [priorities, setPriorities] = useState<HouseholdPriority[]>(
    initialProfile.priorities.length > 0
      ? initialProfile.priorities
      : ['typhoon-flood', 'earthquake-fire'],
  );

  const togglePriority = (id: HouseholdPriority) => {
    setPriorities((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleFinish = () => {
    onComplete({
      ...initialProfile,
      name: name.trim(),
      city: city.trim() || 'Quezon City',
      priorities,
      onboardingCompleted: true,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0A1628] text-slate-900 dark:text-slate-100 flex flex-col justify-between p-5 sm:p-8">
      <div className="w-full max-w-2xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-teal-500/15 border border-teal-400/30 flex items-center justify-center text-teal-600 dark:text-teal-300">
            <Shield className="w-5 h-5" />
          </div>
          <span className="font-display font-bold tracking-tight text-lg">
            KALINGA
          </span>
        </div>

        <button
          type="button"
          onClick={onSkip}
          className="min-h-[44px] px-3 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-300 transition-colors"
        >
          Skip setup
        </button>
      </div>

      <main className="w-full max-w-2xl mx-auto my-8">
        <div className="flex items-center gap-2 mb-6" aria-label={`Step ${step} of 4`}>
          {[1, 2, 3, 4].map((index) => (
            <div
              key={index}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                index <= step
                  ? 'bg-teal-500'
                  : 'bg-slate-200 dark:bg-slate-800'
              }`}
            />
          ))}
        </div>

        {step === 1 && (
          <section className="rounded-3xl bg-white dark:bg-[#11223A] border border-slate-200 dark:border-slate-700/50 overflow-hidden shadow-xl">
            <div className="aspect-video w-full bg-[#0D1B2A] relative overflow-hidden">
              <img
                src="/src/assets/images/kalinga_community_hero_1795172192799.jpg"
                alt="Resilient Filipino coastal community prepared at dawn"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#11223A] via-transparent to-transparent" />
            </div>
            <div className="p-6 sm:p-8">
              <p className="text-xs font-medium text-teal-600 dark:text-teal-300">
                Welcome to KALINGA · Prepared Together. Safer Together.
              </p>
              <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-[-0.01em] text-slate-900 dark:text-white [text-wrap:balance]">
                Preparedness is a small step that can make a big difference.
              </h1>
              <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300">
                Organize emergency supplies, access offline survival guides, store
                trusted family contacts, and keep essential safety references ready
                before disasters happen.
              </p>
              <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
                Your information stays stored locally on your device. KALINGA is a
                preparedness companion and does not replace official emergency
                responders.
              </p>
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="rounded-3xl bg-white dark:bg-[#11223A] border border-slate-200 dark:border-slate-700/50 p-6 sm:p-8 shadow-xl">
            <div className="w-11 h-11 rounded-2xl bg-teal-500/15 text-teal-600 dark:text-teal-300 flex items-center justify-center mb-4">
              <MapPin className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Select your location
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Choose your city or municipality for local weather awareness and
              directory filtering. Your name is optional.
            </p>

            <div className="mt-6 space-y-5">
              <div>
                <label
                  htmlFor="onboarding-name"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5"
                >
                  First name or nickname (optional)
                </label>
                <input
                  id="onboarding-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Marco"
                  className="w-full min-h-[44px] rounded-xl bg-slate-50 dark:bg-[#0A1628] border border-slate-300 dark:border-slate-700 px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-teal-400"
                />
              </div>

              <div>
                <label
                  htmlFor="onboarding-city"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5"
                >
                  City or Municipality
                </label>
                <select
                  id="onboarding-city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full min-h-[44px] rounded-xl bg-slate-50 dark:bg-[#0A1628] border border-slate-300 dark:border-slate-700 px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-teal-400"
                >
                  {PHILIPPINE_CITIES.map((item) => (
                    <option key={item.name} value={item.name}>
                      {item.name} — {item.region}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="rounded-3xl bg-white dark:bg-[#11223A] border border-slate-200 dark:border-slate-700/50 p-6 sm:p-8 shadow-xl">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Everything you need in one calm place
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Built to work reliably offline and help you prepare step by step.
            </p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl bg-slate-50 dark:bg-[#0D1B2A] border border-slate-200 dark:border-slate-800 p-4">
                <ClipboardCheck className="w-5 h-5 text-teal-600 dark:text-teal-300" />
                <h2 className="mt-2.5 text-sm font-semibold text-slate-900 dark:text-white">
                  Ready Check
                </h2>
                <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  Interactive go-bag and household planning checklist with live
                  preparedness score tracking.
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 dark:bg-[#0D1B2A] border border-slate-200 dark:border-slate-800 p-4">
                <BookOpen className="w-5 h-5 text-sky-600 dark:text-sky-300" />
                <h2 className="mt-2.5 text-sm font-semibold text-slate-900 dark:text-white">
                  Offline Safety Guide
                </h2>
                <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  Step-by-step instructions for earthquakes, typhoons, floods, fires,
                  landslides, and blackouts.
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 dark:bg-[#0D1B2A] border border-slate-200 dark:border-slate-800 p-4">
                <MapPin className="w-5 h-5 text-orange-500 dark:text-orange-300" />
                <h2 className="mt-2.5 text-sm font-semibold text-slate-900 dark:text-white">
                  SafeSpot Directory
                </h2>
                <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  Searchable reference directory of evacuation centers, hospitals,
                  fire stations, and pharmacies.
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 dark:bg-[#0D1B2A] border border-slate-200 dark:border-slate-800 p-4">
                <Users className="w-5 h-5 text-teal-600 dark:text-teal-300" />
                <h2 className="mt-2.5 text-sm font-semibold text-slate-900 dark:text-white">
                  Circle of Safety
                </h2>
                <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  Private emergency contacts list and configurable local DRRMO and
                  national hotlines.
                </p>
              </div>
            </div>
          </section>
        )}

        {step === 4 && (
          <section className="rounded-3xl bg-white dark:bg-[#11223A] border border-slate-200 dark:border-slate-700/50 p-6 sm:p-8 shadow-xl">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Personalize your checklist focus
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Select the hazards or household needs most relevant to you. You can
              still complete all checklist items anytime.
            </p>

            <div className="mt-5 space-y-3">
              {PRIORITY_OPTIONS.map((option) => {
                const selected = priorities.includes(option.id);
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => togglePriority(option.id)}
                    aria-pressed={selected}
                    className={`w-full min-h-[56px] text-left rounded-2xl border p-4 flex items-start justify-between gap-4 transition-colors ${
                      selected
                        ? 'bg-teal-500/10 border-teal-500/60 text-slate-900 dark:text-white'
                        : 'bg-slate-50 dark:bg-[#0D1B2A] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-600'
                    }`}
                  >
                    <div>
                      <div className="text-sm font-semibold">{option.title}</div>
                      <div className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                        {option.description}
                      </div>
                    </div>
                    <CheckCircle2
                      className={`w-5 h-5 shrink-0 mt-0.5 ${
                        selected
                          ? 'text-teal-500'
                          : 'text-slate-300 dark:text-slate-700'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </section>
        )}
      </main>

      <footer className="w-full max-w-2xl mx-auto flex items-center justify-between gap-4 pb-4">
        {step > 1 ? (
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            className="min-h-[44px] px-5 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-sm font-medium text-slate-800 dark:text-slate-200 transition-colors"
          >
            Back
          </button>
        ) : (
          <span />
        )}

        {step < 4 ? (
          <button
            type="button"
            onClick={() => setStep((s) => s + 1)}
            className="min-h-[44px] inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold transition-colors shadow-lg shadow-teal-900/20"
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleFinish}
            className="min-h-[44px] inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold transition-colors shadow-lg shadow-teal-900/20"
          >
            <span>Start Preparing</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </footer>
    </div>
  );
};
