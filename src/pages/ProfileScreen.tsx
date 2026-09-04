import React, { useEffect, useState } from 'react';
import { ChevronRightIcon, PhoneIcon, PlusIcon, SettingsIcon } from 'lucide-react';
import { PhoneFrame } from '../components/PhoneFrame';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Avatar, GroupedList, Row, SectionLabel } from '../components/ui';
import { useApp } from '../contexts/AppContext';
import { useNotify } from '../contexts/NotificationContext';
import { bloodTypes, emergencyContacts, providers } from '../data/app';
import type { RiderProfile } from '../types/app';

type DialogKind = 'save' | 'discard' | 'signout' | null;

function initialsOf(name: string) {
  return name.
  split(' ').
  filter(Boolean).
  slice(0, 2).
  map((p) => p[0]?.toUpperCase() ?? '').
  join('');
}

export function ProfileScreen() {
  const { setModule, signOut, rider, updateRider } = useApp();
  const { notify } = useNotify();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<RiderProfile>(rider);
  const [dialog, setDialog] = useState<DialogKind>(null);

  useEffect(() => {
    if (!editing) setDraft(rider);
  }, [editing, rider]);

  const dirty = (Object.keys(draft) as (keyof RiderProfile)[]).some((k) => draft[k] !== rider[k]);
  const set = (patch: Partial<RiderProfile>) => setDraft((d) => ({ ...d, ...patch }));

  const requestCancel = () => dirty ? setDialog('discard') : setEditing(false);

  const confirmSave = () => {
    updateRider(draft);
    setDialog(null);
    setEditing(false);
    notify({
      kind: 'success',
      title: 'Profile updated',
      message: 'Your rider info is now visible to responders',
    });
  };

  const dialogProps = {
    save: {
      title: 'Save profile changes?',
      message:
      'Responders read your plate, bike, and blood type aloud during an SOS — make sure they are correct.',
      confirmLabel: 'Save',
      onConfirm: confirmSave
    },
    discard: {
      title: 'Discard changes?',
      message: 'Your edits to this profile will not be saved.',
      confirmLabel: 'Discard',
      destructive: true,
      onConfirm: () => {
        setDraft(rider);
        setDialog(null);
        setEditing(false);
      }
    },
    signout: {
      title: 'Sign out?',
      message: 'Crash detection and SOS stop working until you sign back in.',
      confirmLabel: 'Sign Out',
      destructive: true,
      onConfirm: () => {
        setDialog(null);
        signOut();
      }
    }
  };

  const active = dialog ? dialogProps[dialog] : null;
  const shown = editing ? draft : rider;

  return (
    <PhoneFrame
      title="Profile"
      headerRight={
      editing ?
      <div className="mb-1.5 flex items-center gap-4">
            <button
          type="button"
          onClick={requestCancel}
          className="text-[15px] font-medium text-[rgba(60,60,67,0.7)] dark:text-[rgba(235,235,245,0.7)]">
          
              Cancel
            </button>
            <button
          type="button"
          disabled={!dirty}
          onClick={() => setDialog('save')}
          className="text-[15px] font-semibold text-safe disabled:opacity-40">
          
              Done
            </button>
          </div> :

      <div className="mb-1.5 flex items-center gap-3">
            <button
          type="button"
          onClick={() => setEditing(true)}
          className="text-[15px] font-semibold text-safe">
          
              Edit
            </button>
            <button
          type="button"
          onClick={() => setModule('settings')}
          aria-label="Open app settings"
          className="press-spring flex h-9 w-9 items-center justify-center rounded-full bg-white text-black shadow-glass transition-shadow duration-200 active:scale-95 dark:bg-[#1C1C1E]/85 dark:shadow-glass-dark dark:text-white">
          
              <SettingsIcon size={18} />
            </button>
          </div>

      }
      overlay={
        <ConfirmDialog
          open={Boolean(active)}
          title={active?.title ?? ''}
          message={active?.message ?? ''}
          confirmLabel={active?.confirmLabel ?? ''}
          destructive={(active as { destructive?: boolean } | null)?.destructive}
          onConfirm={() => active?.onConfirm()}
          onCancel={() => setDialog(null)}
        />
      }>
      
      <div className="space-y-6 px-4 pt-2">
        <section className="flex items-center gap-4 rounded-2xl bg-white px-4 py-4 shadow-glass dark:bg-[#1C1C1E]/85 dark:shadow-glass-dark">
          <Avatar initials={initialsOf(shown.name) || 'BI'} tone="green" size={62} />
          <div className="min-w-0 flex-1">
            {editing ?
            <input
              value={draft.name}
              onChange={(e) => set({ name: e.target.value })}
              aria-label="Full name"
              className="w-full bg-transparent text-[20px] font-bold tracking-[-0.01em] text-black outline-none dark:text-white" /> :


            <p className="truncate text-[20px] font-bold tracking-[-0.01em] text-black dark:text-white">
                {shown.name}
              </p>
            }
            <p className="truncate text-[14px] text-[rgba(60,60,67,0.6)] dark:text-[rgba(235,235,245,0.6)]">
              Call sign {shown.callSign} · Verified rider
            </p>
          </div>
        </section>

        <section aria-label="Rider details">
          <SectionLabel>Rider Details</SectionLabel>
          <GroupedList>
            <EditableRow
              label="Mobile no."
              value={shown.mobile}
              editing={editing}
              onChange={(v) => set({ mobile: v })} />
            
            <SelectRow
              label="Blood type"
              value={shown.bloodType}
              options={bloodTypes}
              editing={editing}
              onChange={(v) => set({ bloodType: v })} />
            
            <SelectRow
              label="Provider"
              value={shown.provider}
              options={providers}
              editing={editing}
              onChange={(v) => set({ provider: v })} />
            
          </GroupedList>
        </section>

        <section aria-label="Vehicle">
          <SectionLabel>Vehicle</SectionLabel>
          <GroupedList>
            <EditableRow
              label="Plate no."
              value={shown.plate}
              editing={editing}
              onChange={(v) => set({ plate: v.toUpperCase() })} />
            
            <EditableRow
              label="Motorcycle"
              value={shown.motorcycle}
              editing={editing}
              onChange={(v) => set({ motorcycle: v })} />
            
            <EditableRow
              label="Body color"
              value={shown.bodyColor}
              editing={editing}
              onChange={(v) => set({ bodyColor: v })} />
            
          </GroupedList>
          <p className="px-4 pt-2 text-[12px] leading-snug text-[rgba(60,60,67,0.55)] dark:text-[rgba(235,235,245,0.5)]">
            Blood type, plate, and bike description are read aloud to responders the moment an SOS
            fires.
          </p>
        </section>

        <section aria-label="Emergency contacts">
          <SectionLabel>Emergency Contacts</SectionLabel>
          <GroupedList>
            {editing ?
            <>
                <EditableRow
                label="Contact"
                value={draft.emergencyName}
                editing
                onChange={(v) => set({ emergencyName: v })} />
              
                <EditableRow
                label="Contact no."
                value={draft.emergencyPhone}
                editing
                onChange={(v) => set({ emergencyPhone: v })} />
              
              </> :

            <>
                <Row
                icon={<Avatar initials={initialsOf(shown.emergencyName) || '+'} size={34} />}
                title={shown.emergencyName || 'Add primary contact'}
                subtitle={`Primary contact · ${shown.emergencyPhone || 'No number saved'}`}
                right={
                <span className="flex items-center gap-2">
                      <PhoneIcon size={17} className="text-safe" />
                      <ChevronRightIcon
                    size={17}
                    className="text-[rgba(60,60,67,0.35)] dark:text-[rgba(235,235,245,0.35)]" />
                  
                    </span>
                }
                onClick={() => setEditing(true)} />
              
                {emergencyContacts.slice(1).map((c, i) =>
              c.name ?
              <Row
                key={c.id}
                icon={<Avatar initials={initialsOf(c.name)} size={34} />}
                title={c.name}
                subtitle={`${c.relation} · ${c.phone}`}
                right={
                <ChevronRightIcon
                  size={17}
                  className="text-[rgba(60,60,67,0.35)] dark:text-[rgba(235,235,245,0.35)]" />

                }
                onClick={() => undefined} /> :


              <Row
                key={c.id}
                icon={
                <span className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-safe/12 dark:bg-safe/20">
                          <PlusIcon size={18} className="text-safe" strokeWidth={2.4} />
                        </span>
                }
                title={<span className="text-safe">Add contact {i + 2} of 3</span>}
                subtitle="Notified by SMS with your live map link"
                onClick={() => undefined} />


              )}
              </>
            }
          </GroupedList>
        </section>

        {!editing ?
        <button
          type="button"
          onClick={() => setDialog('signout')}
          className="press-spring w-full rounded-2xl bg-white py-[13px] text-[16px] font-semibold text-emergency shadow-glass transition-shadow duration-200 active:shadow-glass-lg active:scale-[0.98] dark:bg-[#1C1C1E]/85 dark:shadow-glass-dark">
          
            Sign Out
          </button> :
        null}
      </div>
    </PhoneFrame>);

}

function EditableRow({
  label,
  value,
  editing,
  onChange





}: {label: string;value: string;editing: boolean;onChange: (v: string) => void;}) {
  return (
    <label className="flex items-center gap-3 px-4 py-3">
      <span className="w-[104px] shrink-0 text-[16px] text-black dark:text-white">{label}</span>
      {editing ?
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
        className="w-full rounded-[8px] bg-[rgba(120,120,128,0.12)] px-2.5 py-1.5 text-right text-[16px] font-medium text-black outline-none ring-1 ring-transparent transition-colors duration-150 ease-ios focus:ring-safe dark:bg-[rgba(120,120,128,0.3)] dark:text-white" /> :


      <span className="w-full truncate text-right text-[16px] font-medium text-[rgba(60,60,67,0.7)] dark:text-[rgba(235,235,245,0.7)]">
          {value || '—'}
        </span>
      }
    </label>);

}

function SelectRow({
  label,
  value,
  options,
  editing,
  onChange






}: {label: string;value: string;options: string[];editing: boolean;onChange: (v: string) => void;}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <span className="w-[104px] shrink-0 text-[16px] text-black dark:text-white">{label}</span>
      {editing ?
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
        className="ml-auto rounded-[8px] bg-[rgba(120,120,128,0.12)] px-2.5 py-1.5 text-[15px] font-medium text-black outline-none dark:bg-[rgba(120,120,128,0.3)] dark:text-white">
        
          {options.map((o) =>
        <option key={o}>{o}</option>
        )}
        </select> :

      <span className="ml-auto text-[16px] font-medium text-[rgba(60,60,67,0.7)] dark:text-[rgba(235,235,245,0.7)]">
          {value}
        </span>
      }
    </div>);

}