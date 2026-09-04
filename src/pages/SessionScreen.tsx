import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CameraIcon,
  ChevronRightIcon,
  CircleCheckIcon,
  FilmIcon,
  MapIcon,
  MapPinIcon,
  PowerIcon,
  RouteIcon,
  TimerIcon,
  WifiIcon,
} from 'lucide-react';
import { PhoneFrame } from '../components/PhoneFrame';
import { SessionSheet } from '../components/SessionSheet';
import { HoldForSos } from '../components/HoldForSos';
import { GroupedList, Pill, Row, SectionLabel } from '../components/ui';
import { useApp } from '../contexts/AppContext';
import { formatDuration } from '../utils/format';

export function SessionScreen() {
  const {
    sessionOn,
    elapsed,
    sessionRemainingSecs,
    sessionDurationSecs,
    endSession,
    triggerSos,
    sosActive,
    openComms,
  } = useApp();

  const [sheetOpen, setSheetOpen] = useState(false);

  const displaySecs = sessionOn
    ? sessionDurationSecs > 0
      ? Math.max(0, sessionRemainingSecs)
      : elapsed
    : 0;

  const isCountdown = sessionOn && sessionDurationSecs > 0;

  // Toggling from the card's power icon — quick on/off without opening the sheet
  const handlePowerToggle = () => {
    if (sessionOn) {
      endSession();
    } else {
      setSheetOpen(true);
    }
  };

  return (
    <PhoneFrame
      title="Ride"
      headerRight={
        <span className="pb-1.5">
          <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.28, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <Pill tone={sessionOn ? 'green' : 'neutral'} dot glow={sessionOn}>
              {sessionOn ? 'Live' : 'Off'}
            </Pill>
          </motion.div>
        </span>
      }
      overlay={<SessionSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />}
    >
      <div className="flex flex-col gap-y-4 px-4 pt-1.5">
        {/* ── SOS section ── */}
        <motion.section
          aria-label="SOS activation"
          className="overflow-hidden rounded-2xl border border-transparent glass-edge glass"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
        >
          <div className="flex items-start gap-3 px-4 pb-3 pt-3.5">
            <span className="relative mt-0.5 flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-safe/15 dark:bg-safe/20">
              <span className="absolute inset-0 rounded-full bg-safe/25 animate-ping" />
              <CameraIcon size={17} className="relative z-10 text-safe" strokeWidth={2.2} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-[14px] font-semibold text-black dark:text-white">
                  Auto-AI Crash Detection
                </p>
                <span className="relative flex h-[7px] w-[7px]">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-safe opacity-70" />
                  <span className="relative inline-flex h-[7px] w-[7px] rounded-full bg-safe" />
                </span>
              </div>
              <p className="mt-0.5 text-[12px] leading-snug text-[rgba(60,60,67,0.6)] dark:text-[rgba(235,235,245,0.6)]">
                ACTIVE — Pi 5 watching impact, tilt &amp; sudden stop.
              </p>
            </div>
          </div>
          <div className="px-4 pb-3">
            <HoldForSos onComplete={triggerSos} />
          </div>
        </motion.section>

        {/* ── Session control card ── */}
        <motion.section
          aria-label="Riding session"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05, ease: [0.23, 1, 0.32, 1] }}
        >
          <button
            type="button"
            onClick={handlePowerToggle}
            className="press-spring w-full overflow-hidden rounded-2xl bg-white shadow-glass transition-shadow duration-200 active:scale-[0.99] dark:bg-[#1C1C1E]/85 dark:shadow-glass-dark"
            aria-label="Toggle riding session"
          >
            <div className="flex items-center gap-3 px-4 py-3">
              {/* Flickering power icon — master control */}
              <motion.span
                animate={
                  sessionOn
                    ? { opacity: [0.7, 1, 0.7], scale: [0.96, 1.04, 0.96] }
                    : {}
                }
                transition={{ duration: 1.8, repeat: sessionOn ? Infinity : 0, ease: 'easeInOut' }}
                className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${
                  sessionOn
                    ? 'bg-safe/20 dark:bg-safe/25'
                    : 'bg-[rgba(120,120,128,0.12)] dark:bg-[rgba(120,120,128,0.25)]'
                }`}
              >
                {sessionOn && (
                  <span className="absolute inset-0 rounded-full bg-safe/20 animate-ping" />
                )}
                <PowerIcon
                  size={18}
                  className={`relative z-10 transition-colors duration-300 ${
                    sessionOn ? 'text-safe' : 'text-[rgba(60,60,67,0.5)] dark:text-[rgba(235,235,245,0.5)]'
                  }`}
                  strokeWidth={2.4}
                />
              </motion.span>

              {/* Status + timer */}
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-semibold text-black dark:text-white">
                  {sessionOn ? 'Session is live' : 'Session is off'}
                </p>
                <p className="text-[12px] leading-snug text-[rgba(60,60,67,0.6)] dark:text-[rgba(235,235,245,0.6)]">
                  {sessionOn
                    ? sessionDurationSecs > 0
                      ? `Auto-stops in ${formatDuration(displaySecs)}`
                      : 'Open-ended — tap to end'
                    : 'Tap to configure and start'}
                </p>
              </div>

              {/* WS + GPS pills */}
              <div className="flex items-center gap-1.5">
                <motion.div
                  animate={sessionOn ? { scale: [1, 1.04, 1] } : {}}
                  transition={{ duration: 2.5, repeat: Infinity }}
                >
                  <Pill tone={sessionOn ? 'green' : 'neutral'} dot glow={sessionOn}>
                    <WifiIcon size={10} strokeWidth={2.6} />
                    WS
                  </Pill>
                </motion.div>
                <motion.div
                  animate={sessionOn ? { scale: [1, 1.04, 1] } : {}}
                  transition={{ duration: 2.5, repeat: Infinity, delay: 0.8 }}
                >
                  <Pill tone={sessionOn ? 'green' : 'neutral'} dot glow={sessionOn}>
                    <MapPinIcon size={10} strokeWidth={2.6} />
                    GPS
                  </Pill>
                </motion.div>
              </div>
            </div>
          </button>
        </motion.section>

        {/* ── Telemetry ── */}
        <motion.section
          aria-label="Live telemetry"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
        >
          <SectionLabel>Live Telemetry</SectionLabel>
          <div className="grid grid-cols-3 gap-2">
            {[
              { icon: <TimerIcon size={14} strokeWidth={2.2} />, label: 'Duration', value: formatDuration(sessionOn ? elapsed : 0), mono: true },
              { icon: <RouteIcon size={14} strokeWidth={2.2} />, label: 'Distance', value: '38.4 km', mono: false },
              { icon: <FilmIcon size={14} strokeWidth={2.2} />, label: 'Clips', value: '12', mono: false },
            ].map(({ icon, label, value, mono }, i) => (
              <div
                key={label}
                className="flex flex-col rounded-xl bg-white px-3 py-2.5 shadow-glass dark:bg-[#1C1C1E]/85 dark:shadow-glass-dark"
              >
                <span className="flex items-center gap-1 text-[11px] font-medium text-[rgba(60,60,67,0.6)] dark:text-[rgba(235,235,245,0.6)]">
                  {icon}
                  {label}
                </span>
                <span className={`mt-auto pt-1.5 text-[17px] font-semibold tracking-[-0.01em] text-black dark:text-white ${mono ? 'tabular-nums' : ''}`}>
                  {value}
                </span>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ── Nearby ── */}
        <motion.section
          aria-label="Nearby incidents"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, delay: 0.14, ease: [0.23, 1, 0.32, 1] }}
        >
          <SectionLabel>Nearby</SectionLabel>
          <GroupedList>
            <Row
              icon={
                <span className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-emergency/12 dark:bg-emergency/20">
                  <MapIcon size={16} className="text-emergency" strokeWidth={2.2} />
                </span>
              }
              title="2 riders need help within 3 km"
              subtitle="Nearest: JOY-0871 down · C5 Service Rd · 900 m"
              right={
                <ChevronRightIcon
                  size={16}
                  className="text-[rgba(60,60,67,0.35)] dark:text-[rgba(235,235,245,0.35)]"
                />
              }
              onClick={() => openComms('map')}
            />
          </GroupedList>
        </motion.section>

        {/* ── Today ── */}
        <motion.section
          aria-label="Today"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, delay: 0.18, ease: [0.23, 1, 0.32, 1] }}
        >
          <SectionLabel>Today</SectionLabel>
          <GroupedList>
            <Row
              icon={<CircleCheckIcon size={18} className="text-safe" />}
              title="Pre-ride check passed"
              subtitle="Cameras, storage &amp; headset · 06:12"
            />
            <Row
              icon={<FilmIcon size={18} className="text-[rgba(60,60,67,0.5)] dark:text-[rgba(235,235,245,0.5)]" />}
              title="Hard-brake clip · Ortigas Ave."
              subtitle="18 s saved automatically · 11:04"
              right={<span className="text-[12px] font-medium text-safe">Review</span>}
              onClick={() => undefined}
            />
          </GroupedList>
        </motion.section>
      </div>
    </PhoneFrame>
  );
}
