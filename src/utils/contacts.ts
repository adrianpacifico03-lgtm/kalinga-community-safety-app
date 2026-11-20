import type { EmergencyContact } from '../types/kalinga';

export interface ContactDraft {
  name: string;
  role: string;
  phone: string;
  isPriority: boolean;
  notes?: string;
}

export interface ContactValidationResult {
  valid: boolean;
  errors: {
    name?: string;
    role?: string;
    phone?: string;
  };
}

export function validateContactInput(
  draft: ContactDraft,
): ContactValidationResult {
  const errors: ContactValidationResult['errors'] = {};
  const name = draft.name.trim();
  const role = draft.role.trim();
  const phone = draft.phone.trim();

  if (name.length < 2) {
    errors.name = 'Please enter a contact name (at least 2 characters).';
  }

  if (role.length < 2) {
    errors.role = 'Please specify a relationship or role.';
  }

  const digitsOnly = phone.replace(/[^\d]/g, '');
  if (!phone) {
    errors.phone = 'Please enter a phone or hotline number.';
  } else if (!/^[+\d()\s-]+$/.test(phone) || digitsOnly.length < 3) {
    errors.phone = 'Enter a valid phone number (at least 3 digits).';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function sortContacts(contacts: EmergencyContact[]): EmergencyContact[] {
  return [...contacts].sort((a, b) => {
    if (a.isPriority !== b.isPriority) {
      return a.isPriority ? -1 : 1;
    }
    return a.name.localeCompare(b.name);
  });
}

export function formatDialableTel(phone: string): string {
  const cleaned = phone.replace(/[^\d+]/g, '');
  return `tel:${cleaned}`;
}
