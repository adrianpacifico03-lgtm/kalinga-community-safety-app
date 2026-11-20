import type { FacilityCategory, SafeFacility } from '../types/kalinga';

export interface FacilityFilterOptions {
  query: string;
  category: FacilityCategory | 'All';
  savedOnly: boolean;
  savedIds: string[];
  cityFilter?: string;
}

export function filterFacilities(
  facilities: SafeFacility[],
  options: FacilityFilterOptions,
): SafeFacility[] {
  const normalizedQuery = options.query.trim().toLowerCase();
  const savedSet = new Set(options.savedIds);

  return facilities.filter((facility) => {
    if (options.category !== 'All' && facility.category !== options.category) {
      return false;
    }

    if (options.savedOnly && !savedSet.has(facility.id)) {
      return false;
    }

    if (
      options.cityFilter &&
      options.cityFilter !== 'All Cities' &&
      facility.city.toLowerCase() !== options.cityFilter.toLowerCase()
    ) {
      return false;
    }

    if (normalizedQuery.length > 0) {
      const searchable = `${facility.name} ${facility.address} ${facility.city} ${facility.category} ${facility.notes}`.toLowerCase();
      if (!searchable.includes(normalizedQuery)) {
        return false;
      }
    }

    return true;
  });
}

export function buildExternalMapUrl(facility: SafeFacility): string {
  const query = encodeURIComponent(`${facility.lat},${facility.lng}`);
  return `https://www.openstreetmap.org/?mlat=${facility.lat}&mlon=${facility.lng}#map=16/${query}`;
}
