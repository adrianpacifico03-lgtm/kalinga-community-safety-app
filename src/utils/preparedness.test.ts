import test from 'node:test';
import assert from 'node:assert/strict';
import {
  applyPriorityFocus,
  calculatePreparednessScore,
} from './preparedness';
import { filterFacilities } from './facilities';
import {
  formatDialableTel,
  sortContacts,
  validateContactInput,
} from './contacts';
import {
  DEFAULT_CHECKLIST_ITEMS,
  SAMPLE_FACILITIES,
} from '../data/philippinesData';

test('calculatePreparednessScore handles zero completed items accurately', () => {
  const result = calculatePreparednessScore(DEFAULT_CHECKLIST_ITEMS, []);
  assert.equal(result.overallPercent, 0);
  assert.equal(result.completedCount, 0);
  assert.equal(result.remainingCount, DEFAULT_CHECKLIST_ITEMS.length);
  assert.equal(result.milestones[0].achieved, false);
  assert.ok(result.nextAction !== null);
});

test('calculatePreparednessScore calculates percentages, categories, and milestones', () => {
  const halfIds = DEFAULT_CHECKLIST_ITEMS.slice(0, 11).map((i) => i.id);
  const result = calculatePreparednessScore(DEFAULT_CHECKLIST_ITEMS, halfIds);

  assert.equal(result.completedCount, 11);
  assert.equal(result.totalCount, DEFAULT_CHECKLIST_ITEMS.length);
  assert.equal(
    result.overallPercent,
    Math.round((11 / DEFAULT_CHECKLIST_ITEMS.length) * 100),
  );
  assert.equal(result.milestones[0].achieved, true); // First Step Taken
  assert.equal(result.milestones[2].achieved, true); // Halfway Prepared
  const essentials = result.categoryProgress.find(
    (c) => c.category === 'Emergency Essentials',
  );
  assert.equal(essentials?.percent, 100);
});

test('applyPriorityFocus marks matching items as recommended', () => {
  const tailored = applyPriorityFocus(DEFAULT_CHECKLIST_ITEMS, ['seniors-medical']);
  const meds = tailored.find((i) => i.id === 'bas-medicines');
  assert.equal(meds?.recommended, true);
});

test('filterFacilities filters by category, search query, and saved state', () => {
  const hospitals = filterFacilities(SAMPLE_FACILITIES, {
    query: '',
    category: 'Hospitals',
    savedOnly: false,
    savedIds: [],
  });
  assert.ok(hospitals.length >= 2);
  assert.ok(hospitals.every((f) => f.category === 'Hospitals'));

  const baguio = filterFacilities(SAMPLE_FACILITIES, {
    query: 'Baguio',
    category: 'All',
    savedOnly: false,
    savedIds: [],
  });
  assert.equal(baguio.length, 1);
  assert.equal(baguio[0].city, 'Baguio City');

  const savedOnly = filterFacilities(SAMPLE_FACILITIES, {
    query: '',
    category: 'All',
    savedOnly: true,
    savedIds: ['fac-fire-1'],
  });
  assert.equal(savedOnly.length, 1);
  assert.equal(savedOnly[0].id, 'fac-fire-1');
});

test('validateContactInput rejects invalid inputs and accepts valid PH numbers', () => {
  const invalid = validateContactInput({
    name: 'A',
    role: '',
    phone: 'abc',
    isPriority: false,
  });
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.name);
  assert.ok(invalid.errors.role);
  assert.ok(invalid.errors.phone);

  const valid = validateContactInput({
    name: 'Elena Santos',
    role: 'Mother',
    phone: '+63 917 555 0199',
    isPriority: true,
  });
  assert.equal(valid.valid, true);
  assert.deepEqual(valid.errors, {});
});

test('sortContacts places priority contacts first then alphabetical', () => {
  const sorted = sortContacts([
    { id: '1', name: 'Zoe', role: 'Neighbor', phone: '1234', isPriority: false },
    { id: '2', name: 'Bea', role: 'Sister', phone: '5678', isPriority: true },
    { id: '3', name: 'Ana', role: 'Mother', phone: '9012', isPriority: false },
  ]);
  assert.deepEqual(
    sorted.map((c) => c.name),
    ['Bea', 'Ana', 'Zoe'],
  );
  assert.equal(formatDialableTel('+63 917-555-0199'), 'tel:+639175550199');
});
