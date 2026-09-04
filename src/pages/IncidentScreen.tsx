import React from 'react';
import { motion } from 'framer-motion';
import {
  AmbulanceIcon,
  HeadphonesIcon,
  ShieldIcon,
  ShieldCheckIcon,
  UsersIcon,
  Volume2Icon,
} from 'lucide-react';
import { PhoneFrame } from '../components/PhoneFrame';
import { GroupedList, Pill, Row, SectionLabel } from '../components/ui';
import { useApp } from '../contexts/AppContext';
import { responders, voiceAnnouncements } from '../data/app';
import { formatDistance } from '../utils/format';
import type { ResponderKind } from '../types/app';

const KIND_ICON: Record<ResponderKind, typeof ShieldIcon> = {
  police: ShieldIcon,
  tanod: UsersIcon,
  ambulance: AmbulanceIcon,
};

export function IncidentScreen() {
  const { sosActive, clearSos, triggerSos } = useApp();

  return (
    <PhoneFrame
      title="Rescue"
      headerRight={
        <span className="pb-1.5">
          <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <Pill tone={sosActive ? 'red' : 'green'} dot glow={sosActive}>
              {sosActive ? 'SOS ACTIVE' : 'No active incident'}
            </Pill>
          </motion.div>
        </span>
      }
    >
      {!sosActive ? (
        <div className="px-4 pt-2">
          <motion.div
            className="rounded-2xl bg-white px-5 py-10 text-center shadow-glass dark:bg-[#1C1C1E]/85 dark:shadow-glass-dark"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
          >
            <span className="relative mx-auto flex h-[56px] w-[56px] items-center justify-center rounded-full bg-safe/15 dark:bg-safe/20">
              <ShieldCheckIcon
                size={28}
                className="text-safe"
                strokeWidth={2.1}
              />
            </span>
            <h2 className="mt-4 text-[19px] font-semibold tracking-[-0.01em] text-black dark:text-white">
              You&apos;re riding safe
            </h2>
            <p className="mx-auto mt-1.5 max-w-[250px] text-[14px] leading-snug text-[rgba(60,60,67,0.6)] dark:text-[rgba(235,235,245,0.6)]">
              If a crash is detected, this screen takes over and your headset narrates every step —
              no touch needed.
            </p>
            <button
              type="button"
              onClick={triggerSos}
              className="press-spring mt-5 text-[15px] font-semibold text-emergency"
            >
              Preview an incident
            </button>
          </motion.div>
        </div>
      ) : (
        <div className="space-y-5 px-4 pt-2">
          {/* Voice beacon — the loudest element because the rider is not looking */}
          <motion.section
            aria-label="Hands-free voice alert"
            className="relative overflow-hidden rounded-2xl bg-emergency shadow-emergency-glow"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
          >
            {/* Pulsing accent layer */}
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-2xl"
              animate={{
                boxShadow: [
                  'inset 0 0 0 0 rgba(255,255,255,0)',
                  'inset 0 0 60px 0 rgba(255,255,255,0.18)',
                  'inset 0 0 0 0 rgba(255,255,255,0)',
                ],
              }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            />

            <div className="relative flex items-center justify-between gap-3 px-4 pt-4">
              <span className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.08em] text-white/85">
                <HeadphonesIcon size={15} strokeWidth={2.4} />
                Auto voice beacon
              </span>
              <EqualizerBars />
            </div>
            <p className="relative px-4 pb-1 pt-3 text-[21px] font-bold leading-[1.22] tracking-[-0.01em] text-white">
              “MDRRMO Ambulance dispatched. ETA 3 minutes. Stay where you are.”
            </p>
            <div className="relative flex items-center gap-2 px-4 pb-4 pt-2 text-[12px] font-medium text-white/85">
              <Volume2Icon size={14} strokeWidth={2.3} />
              Playing on Bluetooth headset · Cardo Freecom 4
            </div>
          </motion.section>

          {/* Responder tracker */}
          <section aria-label="Responder progress">
            <SectionLabel>Active Rescue Progress</SectionLabel>
            <div className="space-y-2">
              {responders.map((r, i) => {
                const Icon = KIND_ICON[r.kind];
                const lead = i === 0;
                return (
                  <motion.article
                    key={r.id}
                    className={`rounded-2xl bg-white px-4 shadow-glass dark:bg-[#1C1C1E]/85 dark:shadow-glass-dark ${
                      lead ? 'py-4' : 'py-3'
                    }`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: 0.08 + i * 0.06,
                      ease: [0.23, 1, 0.32, 1],
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex shrink-0 items-center justify-center rounded-full ${
                          lead
                            ? 'h-[42px] w-[42px] bg-emergency/15 dark:bg-emergency/20 shadow-emergency-glow'
                            : 'h-[34px] w-[34px] bg-[rgba(120,120,128,0.14)] dark:bg-[rgba(120,120,128,0.3)]'
                        }`}
                      >
                        <Icon
                          size={lead ? 21 : 17}
                          strokeWidth={2.2}
                          className={
                            lead
                              ? 'text-emergency'
                              : 'text-[rgba(60,60,67,0.65)] dark:text-[rgba(235,235,245,0.65)]'
                          }
                        />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p
                          className={`truncate font-semibold text-black dark:text-white ${
                            lead ? 'text-[17px]' : 'text-[15px]'
                          }`}
                        >
                          {r.label}
                        </p>
                        <p className="truncate text-[13px] text-[rgba(60,60,67,0.6)] dark:text-[rgba(235,235,245,0.6)]">
                          {r.unit}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p
                          className={`font-bold tabular-nums ${
                            lead
                              ? 'text-[22px] text-emergency'
                              : 'text-[17px] text-black dark:text-white'
                          }`}
                        >
                          {r.etaMinutes}m
                        </p>
                        <p className="text-[12px] tabular-nums text-[rgba(60,60,67,0.6)] dark:text-[rgba(235,235,245,0.6)]">
                          {formatDistance(r.distanceKm)}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 h-[4px] overflow-hidden rounded-full bg-[rgba(120,120,128,0.16)] dark:bg-[rgba(120,120,128,0.32)]">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${[82, 58, 31][i]}%` }}
                        transition={{
                          duration: 0.6,
                          ease: [0.23, 1, 0.32, 1],
                          delay: 0.15 + i * 0.06,
                        }}
                        className={`h-full rounded-full ${
                          lead ? 'bg-emergency' : 'bg-safe'
                        }`}
                      />
                    </div>
                    <p className="mt-2 text-[12px] font-medium capitalize text-[rgba(60,60,67,0.6)] dark:text-[rgba(235,235,245,0.6)]">
                      {r.status.replace('-', ' ')}
                    </p>
                  </motion.article>
                );
              })}
            </div>
          </section>

          {/* Announcement log */}
          <section aria-label="Announcement log">
            <SectionLabel>Announced Hands-Free</SectionLabel>
            <GroupedList>
              {voiceAnnouncements.map((a) => (
                <Row
                  key={a.id}
                  icon={
                    <Volume2Icon
                      size={18}
                      className="text-[rgba(60,60,67,0.5)] dark:text-[rgba(235,235,245,0.5)]"
                    />
                  }
                  title={<span className="whitespace-normal text-[15px]">{a.text}</span>}
                  subtitle={`${a.timestamp} · ${a.channel}`}
                />
              ))}
            </GroupedList>
          </section>

          <button
            type="button"
            onClick={clearSos}
            className="press-spring w-full rounded-2xl bg-white py-[13px] text-[16px] font-semibold text-emergency shadow-glass transition-shadow duration-200 ease-ios active:shadow-glass-lg dark:bg-[#1C1C1E]/85 dark:shadow-glass-dark"
          >
            I&apos;m safe — stand down responders
          </button>
        </div>
      )}
    </PhoneFrame>
  );
}

function EqualizerBars() {
  return (
    <span className="flex items-end gap-[3px]" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.span
          key={i}
          className="w-[3px] rounded-full bg-white"
          animate={{ height: [6, 16, 9, 18, 7] }}
          transition={{
            duration: 1.1,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.09,
          }}
        />
      ))}
    </span>
  );
}
