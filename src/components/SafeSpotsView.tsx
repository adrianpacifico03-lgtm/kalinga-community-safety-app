import React, { useState } from 'react';
import {
  Bookmark,
  ExternalLink,
  Info,
  MapPin,
  Navigation,
  Phone,
  Search,
  X,
} from 'lucide-react';
import {
  FACILITY_CATEGORIES,
  SAMPLE_FACILITIES,
} from '../data/philippinesData';
import type { FacilityCategory, SafeFacility } from '../types/kalinga';
import { buildExternalMapUrl, filterFacilities } from '../utils/facilities';

interface SafeSpotsViewProps {
  preferredCity: string;
  savedIds: string[];
  onToggleSave: (id: string) => void;
}

export const SafeSpotsView: React.FC<SafeSpotsViewProps> = ({
  preferredCity,
  savedIds,
  onToggleSave,
}) => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<FacilityCategory | 'All'>('All');
  const [savedOnly, setSavedOnly] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState<SafeFacility | null>(
    null,
  );

  const filtered = filterFacilities(SAMPLE_FACILITIES, {
    query,
    category,
    savedOnly,
    savedIds,
  });

  return (
    <div className="space-y-6">
      <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-teal-600 dark:text-teal-300">
            SafeSpot Directory · Preferred Area: {preferredCity}
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
            Emergency Location Directory
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSavedOnly((prev) => !prev)}
            aria-pressed={savedOnly}
            className={`min-h-[44px] inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-colors whitespace-nowrap ${
              savedOnly
                ? 'bg-teal-600 border-teal-600 text-white'
                : 'bg-white dark:bg-[#11223A] border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-teal-400'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Saved ({savedIds.length})</span>
          </button>
        </div>
      </section>

      {/* Transparent Sample Data Disclosure */}
      <div className="rounded-2xl bg-amber-500/10 border border-amber-500/30 p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-600 dark:text-amber-300 shrink-0 mt-0.5" />
        <p className="text-xs leading-relaxed text-amber-900 dark:text-amber-100">
          <strong className="font-semibold">
            Sample Reference Directory:
          </strong>{' '}
          Entries below are clearly labeled sample placeholders so you can
          explore SafeSpot offline without fabricated clinic addresses or phone
          numbers. Always confirm active evacuation centers and emergency rooms
          with your Barangay Hall or LGU DRRMO.
        </p>
      </div>

      {/* Search & Category Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <label htmlFor="safespot-search" className="sr-only">
            Search emergency locations
          </label>
          <input
            id="safespot-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by facility name, city, or address..."
            className="w-full min-h-[44px] rounded-xl bg-white dark:bg-[#11223A] border border-slate-200 dark:border-slate-700/60 pl-10 pr-4 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-teal-400"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {FACILITY_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                category === cat
                  ? 'bg-teal-600 text-white'
                  : 'bg-white dark:bg-[#11223A] border border-slate-200 dark:border-slate-700/60 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Directory Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl bg-white dark:bg-[#11223A] border border-slate-200 dark:border-slate-700/50 p-8 text-center">
          <MapPin className="w-8 h-8 text-slate-400 mx-auto" />
          <h2 className="mt-3 text-base font-semibold text-slate-900 dark:text-white">
            No facilities match your filter
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Clear your search query or switch back to All categories.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((facility) => {
            const isSaved = savedIds.includes(facility.id);
            return (
              <article
                key={facility.id}
                className="rounded-2xl bg-white dark:bg-[#11223A] border border-slate-200 dark:border-slate-700/50 p-5 flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-xs font-medium text-teal-600 dark:text-teal-300">
                      {facility.category} · {facility.city}
                    </p>
                    <button
                      type="button"
                      onClick={() => onToggleSave(facility.id)}
                      aria-label={
                        isSaved
                          ? `Remove ${facility.name} from saved`
                          : `Save ${facility.name}`
                      }
                      aria-pressed={isSaved}
                      className={`min-h-[44px] min-w-[44px] -mr-2 -mt-2 flex items-center justify-center rounded-xl transition-colors ${
                        isSaved
                          ? 'text-orange-500 dark:text-orange-300 bg-orange-500/10'
                          : 'text-slate-400 hover:text-slate-700 dark:hover:text-white'
                      }`}
                    >
                      <Bookmark
                        className="w-4 h-4"
                        fill={isSaved ? 'currentColor' : 'none'}
                      />
                    </button>
                  </div>

                  <h2 className="mt-1 text-base font-bold text-slate-900 dark:text-white">
                    {facility.name}
                  </h2>

                  <div className="mt-2.5 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span>{facility.address}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span>{facility.contactLabel}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                  <span className="font-mono text-[11px] tabular-nums text-slate-500 dark:text-slate-400">
                    {facility.lat.toFixed(4)}, {facility.lng.toFixed(4)}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedFacility(facility)}
                    className="min-h-[44px] inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-[#0D1B2A] hover:bg-teal-600 hover:text-white text-xs font-semibold text-slate-800 dark:text-slate-200 transition-colors whitespace-nowrap"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Map & Directions</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Facility Map & Directions Modal */}
      {selectedFacility && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-sm p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="facility-modal-title"
        >
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-[#11223A] border border-slate-200 dark:border-slate-700/60 p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium text-teal-600 dark:text-teal-300">
                  {selectedFacility.category} · Sample Entry
                </p>
                <h2
                  id="facility-modal-title"
                  className="mt-1 text-lg font-bold text-slate-900 dark:text-white"
                >
                  {selectedFacility.name}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedFacility(null)}
                aria-label="Close location details"
                className="min-h-[44px] min-w-[44px] -mr-2 -mt-2 flex items-center justify-center rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Clean Offline-Safe Coordinate Plot */}
            <div className="rounded-xl bg-[#0D1B2A] border border-slate-700/60 p-5 relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, #38bdf8 1px, transparent 1px), linear-gradient(to bottom, #38bdf8 1px, transparent 1px)',
                  backgroundSize: '28px 28px',
                }}
              />
              <div className="relative flex flex-col items-center justify-center py-6 text-center">
                <div className="w-11 h-11 rounded-full bg-teal-500/20 border border-teal-400 flex items-center justify-center text-teal-300">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="mt-2 font-mono text-xs tabular-nums text-slate-200">
                  Coordinates: {selectedFacility.lat.toFixed(4)}° N,{' '}
                  {selectedFacility.lng.toFixed(4)}° E
                </div>
                <div className="mt-1 text-xs text-slate-400">
                  {selectedFacility.city} Reference Area
                </div>
              </div>
            </div>

            <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
              <p>
                <strong className="font-semibold">Address:</strong>{' '}
                {selectedFacility.address}
              </p>
              <p>
                <strong className="font-semibold">Contact:</strong>{' '}
                {selectedFacility.contactLabel}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {selectedFacility.notes}
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedFacility(null)}
                className="min-h-[44px] px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Close
              </button>
              <a
                href={buildExternalMapUrl(selectedFacility)}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold transition-colors"
              >
                <span>Open in Map</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
