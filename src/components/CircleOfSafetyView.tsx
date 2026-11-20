import React, { useState } from 'react';
import {
  Check,
  Edit3,
  Phone,
  Plus,
  Shield,
  Star,
  Trash2,
  UserPlus,
  X,
} from 'lucide-react';
import { OFFICIAL_NATIONAL_HOTLINES } from '../data/philippinesData';
import type { EmergencyContact, UserProfile } from '../types/kalinga';
import {
  formatDialableTel,
  sortContacts,
  validateContactInput,
  type ContactDraft,
} from '../utils/contacts';
import { ConfirmDialog } from './ConfirmDialog';

interface CircleOfSafetyViewProps {
  contacts: EmergencyContact[];
  profile: UserProfile;
  onSaveContact: (contact: EmergencyContact) => void;
  onDeleteContact: (id: string) => void;
  onTogglePriority: (id: string) => void;
  onUpdateLocalDrrmo: (name: string, number: string) => void;
}

const EMPTY_DRAFT: ContactDraft = {
  name: '',
  role: '',
  phone: '',
  isPriority: false,
  notes: '',
};

export const CircleOfSafetyView: React.FC<CircleOfSafetyViewProps> = ({
  contacts,
  profile,
  onSaveContact,
  onDeleteContact,
  onTogglePriority,
  onUpdateLocalDrrmo,
}) => {
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<ContactDraft>(EMPTY_DRAFT);
  const [errors, setErrors] = useState<{
    name?: string;
    role?: string;
    phone?: string;
  }>({});

  const [deleteTarget, setDeleteTarget] = useState<EmergencyContact | null>(
    null,
  );
  const [dialTarget, setDialTarget] = useState<{
    label: string;
    number: string;
  } | null>(null);

  const [drrmoName, setDrrmoName] = useState(profile.localDrrmoName);
  const [drrmoNumber, setDrrmoNumber] = useState(profile.localDrrmoNumber);
  const [drrmoSavedFeedback, setDrrmoSavedFeedback] = useState(false);

  const sortedContacts = sortContacts(contacts);

  const openAddForm = () => {
    setEditingId(null);
    setDraft(EMPTY_DRAFT);
    setErrors({});
    setFormOpen(true);
  };

  const openEditForm = (contact: EmergencyContact) => {
    setEditingId(contact.id);
    setDraft({
      name: contact.name,
      role: contact.role,
      phone: contact.phone,
      isPriority: contact.isPriority,
      notes: contact.notes ?? '',
    });
    setErrors({});
    setFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateContactInput(draft);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    onSaveContact({
      id: editingId ?? `contact-${Date.now()}`,
      name: draft.name.trim(),
      role: draft.role.trim(),
      phone: draft.phone.trim(),
      isPriority: draft.isPriority,
      notes: draft.notes?.trim() || undefined,
    });

    setFormOpen(false);
    setEditingId(null);
    setDraft(EMPTY_DRAFT);
  };

  const handleSaveDrrmo = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateLocalDrrmo(
      drrmoName.trim() || `${profile.city} DRRMO`,
      drrmoNumber.trim(),
    );
    setDrrmoSavedFeedback(true);
    setTimeout(() => setDrrmoSavedFeedback(false), 2000);
  };

  return (
    <div className="space-y-6">
      <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-teal-600 dark:text-teal-300">
            Circle of Safety · Stored Locally & Private
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
            Emergency Contacts
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Keep trusted family members, neighbors, and verified local hotlines
            ready offline. Dialing always requires your confirmation.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddForm}
          className="min-h-[44px] inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white px-4 py-2.5 text-sm font-semibold transition-colors whitespace-nowrap shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Contact</span>
        </button>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Personal Emergency Contacts */}
        <section className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl bg-white dark:bg-[#11223A] border border-slate-200 dark:border-slate-700/50 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                Personal Circle ({contacts.length})
              </h2>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Never shared publicly
              </span>
            </div>

            {sortedContacts.length === 0 ? (
              <div className="p-8 text-center">
                <UserPlus className="w-8 h-8 text-slate-400 mx-auto" />
                <h3 className="mt-3 text-base font-semibold text-slate-900 dark:text-white">
                  No personal emergency contacts yet
                </h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Add family members, a trusted neighbor, or your barangay
                  contact.
                </p>
                <button
                  type="button"
                  onClick={openAddForm}
                  className="mt-4 min-h-[44px] inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add First Contact</span>
                </button>
              </div>
            ) : (
              <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                {sortedContacts.map((contact) => (
                  <li
                    key={contact.id}
                    className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-semibold text-slate-900 dark:text-white truncate">
                          {contact.name}
                        </h3>
                        {contact.isPriority && (
                          <span className="text-xs font-medium text-orange-600 dark:text-orange-300 shrink-0">
                            · Priority
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                        {contact.role} ·{' '}
                        <span className="font-mono tabular-nums text-slate-700 dark:text-slate-200">
                          {contact.phone}
                        </span>
                      </p>
                      {contact.notes && (
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          {contact.notes}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => onTogglePriority(contact.id)}
                        aria-label={
                          contact.isPriority
                            ? `Remove priority from ${contact.name}`
                            : `Mark ${contact.name} as priority`
                        }
                        aria-pressed={contact.isPriority}
                        className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl transition-colors ${
                          contact.isPriority
                            ? 'text-orange-500 dark:text-orange-300 bg-orange-500/10'
                            : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <Star
                          className="w-4 h-4"
                          fill={contact.isPriority ? 'currentColor' : 'none'}
                        />
                      </button>

                      <button
                        type="button"
                        onClick={() => openEditForm(contact)}
                        aria-label={`Edit ${contact.name}`}
                        className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeleteTarget(contact)}
                        aria-label={`Delete ${contact.name}`}
                        className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setDialTarget({
                            label: contact.name,
                            number: contact.phone,
                          })
                        }
                        aria-label={`Call ${contact.name}`}
                        className="min-h-[44px] inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call</span>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* Official National & Configurable Local Hotlines */}
        <aside className="lg:col-span-5 space-y-5">
          <form
            onSubmit={handleSaveDrrmo}
            className="rounded-2xl bg-white dark:bg-[#11223A] border border-slate-200 dark:border-slate-700/50 p-5 space-y-4"
          >
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                Local DRRMO Hotline ({profile.city})
              </h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Save your verified Barangay or City Disaster Risk Reduction
                office hotline for quick access.
              </p>
            </div>

            <div>
              <label
                htmlFor="drrmo-name"
                className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
              >
                Office Label
              </label>
              <input
                id="drrmo-name"
                type="text"
                value={drrmoName}
                onChange={(e) => setDrrmoName(e.target.value)}
                placeholder={`${profile.city} DRRMO`}
                className="w-full min-h-[44px] rounded-xl bg-slate-50 dark:bg-[#0A1628] border border-slate-300 dark:border-slate-700 px-3.5 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-teal-400"
              />
            </div>

            <div>
              <label
                htmlFor="drrmo-number"
                className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
              >
                Verified Hotline Number
              </label>
              <input
                id="drrmo-number"
                type="tel"
                value={drrmoNumber}
                onChange={(e) => setDrrmoNumber(e.target.value)}
                placeholder="Enter your LGU's verified hotline"
                className="w-full min-h-[44px] rounded-xl bg-slate-50 dark:bg-[#0A1628] border border-slate-300 dark:border-slate-700 px-3.5 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-teal-400"
              />
            </div>

            <div className="flex items-center justify-between gap-3">
              <button
                type="submit"
                className="min-h-[44px] inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 dark:bg-teal-600 hover:bg-slate-800 dark:hover:bg-teal-500 text-white text-xs font-semibold transition-colors"
              >
                {drrmoSavedFeedback ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Saved</span>
                  </>
                ) : (
                  <span>Save Local Hotline</span>
                )}
              </button>

              {drrmoNumber.trim() && (
                <button
                  type="button"
                  onClick={() =>
                    setDialTarget({
                      label: drrmoName.trim() || 'Local DRRMO',
                      number: drrmoNumber.trim(),
                    })
                  }
                  className="min-h-[44px] inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-teal-500/40 text-teal-600 dark:text-teal-300 text-xs font-semibold hover:bg-teal-500/10"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Dial</span>
                </button>
              )}
            </div>
          </form>

          <div className="rounded-2xl bg-white dark:bg-[#11223A] border border-slate-200 dark:border-slate-700/50 p-5">
            <div className="flex items-center gap-2 text-orange-500 dark:text-orange-300">
              <Shield className="w-5 h-5" />
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                National Emergency Hotlines
              </h2>
            </div>

            <ul className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
              {OFFICIAL_NATIONAL_HOTLINES.map((hotline) => (
                <li
                  key={hotline.id}
                  className="py-3.5 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-900 dark:text-white">
                      {hotline.agency}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {hotline.scope} ·{' '}
                      <span className="font-mono tabular-nums text-slate-800 dark:text-slate-200">
                        {hotline.number}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setDialTarget({
                        label: hotline.agency,
                        number: hotline.number,
                      })
                    }
                    aria-label={`Open dialer for ${hotline.agency} at ${hotline.number}`}
                    className="min-h-[44px] inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-[#0D1B2A] hover:bg-orange-500 hover:text-white text-xs font-semibold text-slate-800 dark:text-slate-200 transition-colors shrink-0"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{hotline.number}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      {/* Add / Edit Contact Modal */}
      {formOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-sm p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="contact-form-title"
        >
          <form
            onSubmit={handleSubmit}
            noValidate
            className="w-full max-w-md rounded-2xl bg-white dark:bg-[#11223A] border border-slate-200 dark:border-slate-700/60 p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-start justify-between gap-4">
              <h2
                id="contact-form-title"
                className="text-lg font-bold text-slate-900 dark:text-white"
              >
                {editingId ? 'Edit Emergency Contact' : 'Add Emergency Contact'}
              </h2>
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                aria-label="Close contact form"
                className="min-h-[44px] min-w-[44px] -mr-2 -mt-2 flex items-center justify-center rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label
                htmlFor="contact-name"
                className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
              >
                Full Name
              </label>
              <input
                id="contact-name"
                type="text"
                value={draft.name}
                onChange={(e) =>
                  setDraft((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="e.g., Maria Santos"
                className="w-full min-h-[44px] rounded-xl bg-slate-50 dark:bg-[#0A1628] border border-slate-300 dark:border-slate-700 px-3.5 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-teal-400"
              />
              {errors.name && (
                <p className="mt-1 text-xs text-rose-500">{errors.name}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="contact-role"
                className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
              >
                Relationship or Role
              </label>
              <input
                id="contact-role"
                type="text"
                value={draft.role}
                onChange={(e) =>
                  setDraft((prev) => ({ ...prev, role: e.target.value }))
                }
                placeholder="e.g., Mother, Neighbor, Barangay Responder"
                className="w-full min-h-[44px] rounded-xl bg-slate-50 dark:bg-[#0A1628] border border-slate-300 dark:border-slate-700 px-3.5 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-teal-400"
              />
              {errors.role && (
                <p className="mt-1 text-xs text-rose-500">{errors.role}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="contact-phone"
                className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
              >
                Phone Number
              </label>
              <input
                id="contact-phone"
                type="tel"
                value={draft.phone}
                onChange={(e) =>
                  setDraft((prev) => ({ ...prev, phone: e.target.value }))
                }
                placeholder="+63 917 555 0199"
                className="w-full min-h-[44px] rounded-xl bg-slate-50 dark:bg-[#0A1628] border border-slate-300 dark:border-slate-700 px-3.5 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-teal-400"
              />
              {errors.phone && (
                <p className="mt-1 text-xs text-rose-500">{errors.phone}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="contact-notes"
                className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1"
              >
                Notes (optional)
              </label>
              <input
                id="contact-notes"
                type="text"
                value={draft.notes ?? ''}
                onChange={(e) =>
                  setDraft((prev) => ({ ...prev, notes: e.target.value }))
                }
                placeholder="e.g., Lives 2 blocks away"
                className="w-full min-h-[44px] rounded-xl bg-slate-50 dark:bg-[#0A1628] border border-slate-300 dark:border-slate-700 px-3.5 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-teal-400"
              />
            </div>

            <label className="flex items-center gap-3 min-h-[44px] cursor-pointer">
              <input
                type="checkbox"
                checked={draft.isPriority}
                onChange={(e) =>
                  setDraft((prev) => ({
                    ...prev,
                    isPriority: e.target.checked,
                  }))
                }
                className="w-5 h-5 rounded accent-teal-500"
              />
              <span className="text-sm text-slate-700 dark:text-slate-200">
                Pin as Priority Contact
              </span>
            </label>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="min-h-[44px] px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="min-h-[44px] px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold transition-colors"
              >
                {editingId ? 'Save Changes' : 'Save Contact'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Contact Confirmation */}
      <ConfirmDialog
        open={deleteTarget !== null}
        title="Remove Emergency Contact?"
        description={
          deleteTarget
            ? `Remove ${deleteTarget.name} (${deleteTarget.phone}) from your local Circle of Safety?`
            : ''
        }
        confirmLabel="Delete Contact"
        variant="danger"
        onConfirm={() => {
          if (deleteTarget) {
            onDeleteContact(deleteTarget.id);
          }
          setDeleteTarget(null);
        }}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Explicit Dialer Confirmation (Never auto-calls!) */}
      {dialTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-sm p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="dial-confirm-title"
        >
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-[#11223A] border border-slate-200 dark:border-slate-700/60 p-6 shadow-2xl">
            <h2
              id="dial-confirm-title"
              className="text-lg font-bold text-slate-900 dark:text-white"
            >
              Open Phone Dialer?
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Confirm before opening your device phone app to call{' '}
              <strong className="font-semibold">{dialTarget.label}</strong> at{' '}
              <span className="font-mono tabular-nums">{dialTarget.number}</span>.
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDialTarget(null)}
                className="min-h-[44px] px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-200"
              >
                Cancel
              </button>
              <a
                href={formatDialableTel(dialTarget.number)}
                onClick={() => setDialTarget(null)}
                className="min-h-[44px] inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>Open Dialer</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
