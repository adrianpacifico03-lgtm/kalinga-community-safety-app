import React, { useState } from 'react';
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  Search,
  ShieldAlert,
} from 'lucide-react';
import { SAFETY_GUIDES } from '../data/philippinesData';

export const SafetyGuideView: React.FC = () => {
  const [query, setQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string>('earthquake');

  const normalizedQuery = query.trim().toLowerCase();
  const filteredGuides = SAFETY_GUIDES.filter((guide) => {
    if (!normalizedQuery) return true;
    const text = `${guide.title} ${guide.subtitle} ${guide.summary} ${guide.sections
      .map((s) => `${s.phase} ${s.steps.join(' ')}`)
      .join(' ')}`.toLowerCase();
    return text.includes(normalizedQuery);
  });

  return (
    <div className="space-y-6">
      <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-teal-600 dark:text-teal-300">
            Offline Survival Library · Stored Locally on Device
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
            Safety Guides
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Step-by-step hazard guidance compiled from authoritative Philippine
            disaster-response principles.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <label htmlFor="guide-search" className="sr-only">
            Search safety guides
          </label>
          <input
            id="guide-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search hazard or action..."
            className="w-full min-h-[44px] rounded-xl bg-white dark:bg-[#11223A] border border-slate-200 dark:border-slate-700/60 pl-10 pr-4 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-teal-400"
          />
        </div>
      </section>

      {filteredGuides.length === 0 ? (
        <div className="rounded-2xl bg-white dark:bg-[#11223A] border border-slate-200 dark:border-slate-700/50 p-8 text-center">
          <BookOpen className="w-8 h-8 text-slate-400 mx-auto" />
          <h2 className="mt-3 text-base font-semibold text-slate-900 dark:text-white">
            No matching safety guide found
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Try searching for earthquake, typhoon, flood, fire, landslide, or
            power outage.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredGuides.map((guide) => {
            const isOpen = expandedId === guide.id;
            return (
              <article
                key={guide.id}
                className="rounded-2xl bg-white dark:bg-[#11223A] border border-slate-200 dark:border-slate-700/50 overflow-hidden shadow-sm"
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setExpandedId(isOpen ? '' : guide.id)}
                  className="w-full min-h-[76px] p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-[#162B47] transition-colors"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-16 h-12 rounded-xl overflow-hidden bg-[#0D1B2A] shrink-0 hidden sm:flex items-center justify-center">
                      <img
                        src={guide.imagePath}
                        alt={guide.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-teal-600 dark:text-teal-300">
                        {guide.authoritySource}
                      </p>
                      <h2 className="mt-0.5 text-lg font-bold text-slate-900 dark:text-white truncate">
                        {guide.title}
                      </h2>
                      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                        {guide.subtitle}
                      </p>
                    </div>
                  </div>

                  <span className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-slate-500 dark:text-slate-300 shrink-0">
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 pb-6 pt-2 border-t border-slate-100 dark:border-slate-800 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center pt-3">
                      <div className="md:col-span-4 rounded-xl overflow-hidden bg-[#0D1B2A] aspect-[4/3]">
                        <img
                          src={guide.imagePath}
                          alt={`${guide.title} preparedness illustration`}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="md:col-span-8">
                        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                          {guide.summary}
                        </p>
                        <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <ShieldAlert className="w-4 h-4 text-orange-500 dark:text-orange-300 shrink-0" />
                          <span>
                            Always follow immediate directives from local LGU
                            responders and official advisories.
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {guide.sections.map((section) => (
                        <div
                          key={section.phase}
                          className="rounded-xl bg-slate-50 dark:bg-[#0D1B2A] p-4"
                        >
                          <h3 className="text-sm font-semibold text-teal-700 dark:text-teal-300">
                            {section.phase}
                          </h3>
                          <ul className="mt-3 space-y-2.5">
                            {section.steps.map((stepText, idx) => (
                              <li
                                key={idx}
                                className="text-xs leading-relaxed text-slate-700 dark:text-slate-300 flex items-start gap-2"
                              >
                                <span className="font-mono text-[11px] font-semibold text-slate-400 dark:text-slate-500 mt-0.5 shrink-0">
                                  0{idx + 1}
                                </span>
                                <span>{stepText}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
