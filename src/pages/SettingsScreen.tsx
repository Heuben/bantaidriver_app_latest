import React, { useState } from 'react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoonIcon,
  ShieldIcon,
  SunIcon,
  Volume2Icon,
} from 'lucide-react';
import { PhoneFrame } from '../components/PhoneFrame';
import { GroupedList, Row, SectionLabel, Segmented, Toggle } from '../components/ui';
import { useApp } from '../contexts/AppContext';
import {
  LegalSheet,
  PRIVACY_POLICY,
  TERMS_OF_SERVICE,
} from '../components/LegalSheet';

export function SettingsScreen() {
  const { dark, toggleDark, voiceVolume, setVoiceVolume, setModule } = useApp();
  const [legal, setLegal] = useState<'privacy' | 'terms' | null>(null);

  return (
    <PhoneFrame
      title="Settings"
      headerRight={
        <button
          type="button"
          onClick={() => setModule('profile')}
          className="mb-2 flex items-center gap-0.5 text-[15px] font-medium text-safe"
        >
          <ChevronLeftIcon size={18} />
          Profile
        </button>
      }
      overlay={
        <>
          <LegalSheet
            open={legal === 'privacy'}
            title="Privacy Policy"
            onClose={() => setLegal(null)}
          >
            {PRIVACY_POLICY}
          </LegalSheet>
          <LegalSheet
            open={legal === 'terms'}
            title="Terms of Service"
            onClose={() => setLegal(null)}
          >
            {TERMS_OF_SERVICE}
          </LegalSheet>
        </>
      }
    >
      <div className="space-y-6 px-4 pt-2">
        <section aria-label="Appearance">
          <SectionLabel>Appearance</SectionLabel>
          <GroupedList>
            <div className="px-4 py-3.5">
              <Segmented
                ariaLabel="Appearance mode"
                value={dark ? 'dark' : 'light'}
                onChange={(v) => {
                  if (v === 'dark' !== dark) toggleDark();
                }}
                options={[
                  { value: 'light', label: 'Light' },
                  { value: 'dark', label: 'Dark' },
                ]}
              />
            </div>
            <Row
              icon={
                dark ? (
                  <MoonIcon size={19} className="text-[rgba(235,235,245,0.6)]" />
                ) : (
                  <SunIcon size={19} className="text-[rgba(60,60,67,0.6)]" />
                )
              }
              title="Match iOS system theme"
              subtitle="Follows Control Center after each ride"
              right={
                <Toggle
                  checked={false}
                  onChange={() => undefined}
                  label="Match system theme"
                />
              }
            />
          </GroupedList>
        </section>

        <section aria-label="Hands-free audio">
          <SectionLabel>Hands-Free Audio</SectionLabel>
          <GroupedList>
            <div className="px-4 py-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[16px] font-medium text-black dark:text-white">
                  Voice alert volume
                </span>
                <span className="text-[15px] font-semibold tabular-nums text-safe">
                  {voiceVolume}%
                </span>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <Volume2Icon
                  size={17}
                  className="shrink-0 text-[rgba(60,60,67,0.5)] dark:text-[rgba(235,235,245,0.5)]"
                />
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={voiceVolume}
                  onChange={(e) => setVoiceVolume(Number(e.target.value))}
                  aria-label="Voice alert volume"
                  className="h-[4px] w-full cursor-pointer appearance-none rounded-full bg-[rgba(120,120,128,0.2)] accent-safe dark:bg-[rgba(120,120,128,0.36)]"
                  style={{
                    background: `linear-gradient(to right, #34C759 ${voiceVolume}%, rgba(120,120,128,0.24) ${voiceVolume}%)`,
                  }}
                />
              </div>
              <p className="mt-2.5 text-[12px] leading-snug text-[rgba(60,60,67,0.55)] dark:text-[rgba(235,235,245,0.5)]">
                Emergency announcements always override this level and duck your music.
              </p>
            </div>
            <Row
              title="Announce responder ETA updates"
              subtitle="Every 30 seconds while help is en route"
              right={
                <Toggle
                  checked
                  onChange={() => undefined}
                  label="Announce responder ETA"
                />
              }
            />
            <Row
              title="Auto-connect Bluetooth headset"
              subtitle="Cardo Freecom 4"
              right={
                <Toggle
                  checked
                  onChange={() => undefined}
                  label="Auto-connect headset"
                />
              }
            />
          </GroupedList>
        </section>

        <section aria-label="Safety and policy">
          <SectionLabel>Safety &amp; Policy</SectionLabel>
          <GroupedList>
            <Row
              icon={<ShieldIcon size={19} className="text-safe" />}
              title="Data sharing with LGU responders"
              right={
                <ChevronRightIcon
                  size={17}
                  className="text-[rgba(60,60,67,0.35)] dark:text-[rgba(235,235,245,0.35)]"
                />
              }
              onClick={() => undefined}
            />
            <Row
              title="Privacy Policy"
              subtitle="How we handle your helmet data and footage"
              right={
                <ChevronRightIcon
                  size={17}
                  className="text-[rgba(60,60,67,0.35)] dark:text-[rgba(235,235,245,0.35)]"
                />
              }
              onClick={() => setLegal('privacy')}
            />
            <Row
              title="Terms of Service"
              subtitle="Acceptable use of B.A.N.T.A.I. hardware & app"
              right={
                <ChevronRightIcon
                  size={17}
                  className="text-[rgba(60,60,67,0.35)] dark:text-[rgba(235,235,245,0.35)]"
                />
              }
              onClick={() => setLegal('terms')}
            />
            <Row
              title="Evidence retention"
              subtitle="Clips auto-delete after 30 days unless flagged"
              right={
                <ChevronRightIcon
                  size={17}
                  className="text-[rgba(60,60,67,0.35)] dark:text-[rgba(235,235,245,0.35)]"
                />
              }
              onClick={() => undefined}
            />
          </GroupedList>
        </section>

        <p className="pb-2 text-center text-[12px] text-[rgba(60,60,67,0.5)] dark:text-[rgba(235,235,245,0.45)]">
          B.A.N.T.A.I. Driver 2.4.1 · Pi firmware 2.4.1
        </p>
      </div>
    </PhoneFrame>
  );
}
