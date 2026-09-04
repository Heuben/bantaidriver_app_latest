import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BatteryChargingIcon,
  ChevronLeftIcon,
  ClockIcon,
  PowerIcon,
  XIcon,
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useNotify } from '../contexts/NotificationContext';

const EASE = [0.23, 1, 0.32, 1] as const;
const SPRING = [0.34, 1.56, 0.64, 1] as const;

// Only 8h and 12h presets — custom handles anything else
const PRESETS: { hours: number; label: string; tag: string }[] = [
  { hours: 8, label: '8 h', tag: 'Standard' },
  { hours: 12, label: '12 h', tag: 'Long ride' },
];

interface SessionSheetProps {
  open: boolean;
  onClose: () => void;
}

export function SessionSheet({ open, onClose }: SessionSheetProps) {
  const { sessionOn, startSession, endSession, sessionDurationSecs, elapsed } = useApp();
  const { notify } = useNotify();

  // Form state — local so cancelling doesn't touch the live session
  const [wantOn, setWantOn] = useState<boolean>(sessionOn);
  const [selectedHours, setSelectedHours] = useState<number | null>(8);
  const [customMode, setCustomMode] = useState<boolean>(false);
  const [customHours, setCustomHours] = useState<number>(2);
  const [customMinutes, setCustomMinutes] = useState<number>(0);

  // Sync form when sheet opens
  useEffect(() => {
    if (!open) return;
    setWantOn(sessionOn);
    if (sessionDurationSecs > 0) {
      const totalHours = sessionDurationSecs / 3600;
      const match = PRESETS.find((p) => p.hours === Math.round(totalHours));
      if (match) {
        setSelectedHours(match.hours);
        setCustomMode(false);
      } else {
        setSelectedHours(null);
        setCustomMode(true);
        setCustomHours(Math.floor(totalHours));
        setCustomMinutes(Math.round((totalHours - Math.floor(totalHours)) * 60));
      }
    } else {
      setSelectedHours(8);
      setCustomMode(false);
    }
  }, [open, sessionOn, sessionDurationSecs]);

  // Body scroll lock while sheet is open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const effectiveHours = customMode
    ? customHours + customMinutes / 60
    : selectedHours ?? 0;
  const totalSeconds = Math.round(effectiveHours * 3600);

  const dirty = wantOn !== sessionOn || (sessionOn && Math.abs(totalSeconds - sessionDurationSecs) > 30);

  // Tapping the banner icon — the master session control
  const handleIconToggle = () => {
    if (wantOn) {
      // Turning off — end immediately, close, notify
      endSession();
      notify({
        kind: 'info',
        title: 'Session ended',
        message: 'Sensors idle — nothing is being recorded.',
      });
      onClose();
    } else {
      // Turning on — activate wantOn so duration picker is visible
      setWantOn(true);
    }
  };

  // Confirm button — starts with selected duration
  const handleConfirm = () => {
    if (totalSeconds <= 0) {
      notify({
        kind: 'error',
        title: 'Pick a duration first',
        message: 'A session needs at least 1 minute to record.',
      });
      return;
    }
    startSession(totalSeconds);
    notify({
      kind: 'success',
      title: 'Session started',
      message: `Recording and broadcasting for ${formatHoursLabel(totalSeconds)}.`,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="session-scrim"
          className="absolute inset-0 z-[100] flex flex-col justify-end rounded-[44px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: EASE }}
        >
          {/* Scrim — tap anywhere outside sheet to dismiss */}
          <button
            type="button"
            aria-label="Close session controls"
            onClick={onClose}
            className="absolute inset-0 bg-black/45 backdrop-blur-sm"
          />

          {/* Sheet body */}
          <motion.section
            key="session-sheet"
            role="dialog"
            aria-label="Session controls"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.36, ease: EASE }}
            className="relative overflow-y-auto rounded-t-[24px] bg-[#F4F4F7] shadow-2xl dark:bg-[#0C0C0E]"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-[#F4F4F7]/90 px-4 pt-2.5 pb-2 backdrop-blur-glass dark:bg-[#0C0C0E]/85">
              <span className="mx-auto mb-2 block h-[5px] w-[38px] rounded-full bg-[rgba(60,60,67,0.3)] dark:bg-[rgba(235,235,245,0.3)]" />
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={onClose}
                  className="press-spring flex items-center gap-0.5 text-[15px] font-medium text-safe"
                >
                  <ChevronLeftIcon size={18} />
                  Back
                </button>
                <h1 className="absolute left-1/2 -translate-x-1/2 text-[16px] font-semibold tracking-[-0.01em] text-black dark:text-white">
                  Session
                </h1>
                <span className="w-12" />
              </div>
            </div>

            {/* Live state banner — power icon IS the toggle */}
            <div className="px-4 pt-3">
              <div
                className={`relative overflow-hidden rounded-2xl p-4 ${
                  wantOn
                    ? 'bg-safe/15 shadow-safe-glow dark:bg-safe/20'
                    : 'bg-[rgba(120,120,128,0.10)] dark:bg-[rgba(120,120,128,0.20)]'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Tappable flickering power icon — master control */}
                  <motion.button
                    type="button"
                    onClick={handleIconToggle}
                    aria-label={wantOn ? 'End session' : 'Start session'}
                    whileTap={{ scale: 0.92 }}
                    transition={{ duration: 0.18, ease: SPRING }}
                    className={`relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-safe focus-visible:ring-offset-2 dark:focus-visible:ring-offset-black ${
                      wantOn
                        ? 'bg-safe/25 dark:bg-safe/35 cursor-pointer'
                        : 'bg-[rgba(120,120,128,0.18)] dark:bg-[rgba(120,120,128,0.34)] cursor-pointer'
                    }`}
                  >
                    {wantOn && (
                      <>
                        {/* Flickering ping halo */}
                        <motion.span
                          className="absolute inset-0 rounded-full bg-safe/30"
                          animate={{ opacity: [0.4, 0.9, 0.4], scale: [0.95, 1.05, 0.95] }}
                          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                        />
                      </>
                    )}
                    <PowerIcon
                      size={22}
                      className={`relative z-10 transition-colors duration-300 ${
                        wantOn ? 'text-safe' : 'text-[rgba(60,60,67,0.6)] dark:text-[rgba(235,235,245,0.65)]'
                      }`}
                      strokeWidth={2.4}
                    />
                  </motion.button>

                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-semibold text-black dark:text-white">
                      {wantOn ? 'Session is live' : 'Session is off'}
                    </p>
                    <p className="mt-0.5 text-[12.5px] leading-snug text-[rgba(60,60,67,0.6)] dark:text-[rgba(235,235,245,0.6)]">
                      {wantOn
                        ? sessionDurationSecs > 0
                          ? `Auto-stops in ${formatRemaining(Math.max(0, sessionDurationSecs - elapsed))}`
                          : 'Open-ended — tap icon to end'
                        : 'Tap the power icon to start recording'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Duration picker — only shown when turning on */}
            <AnimatePresence initial={false}>
              {wantOn && (
                <motion.div
                  key="duration-picker"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.28, ease: EASE }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pt-4">
                    {/* Duration label row */}
                    <div className="mb-2 flex items-center justify-between px-1">
                      <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[rgba(60,60,67,0.55)] dark:text-[rgba(235,235,245,0.55)]">
                        Duration
                      </p>
                      <span className="text-[12px] font-medium text-[rgba(60,60,67,0.55)] dark:text-[rgba(235,235,245,0.55)]">
                        {formatHoursLabel(totalSeconds)} total
                      </span>
                    </div>

                    {/* 8h and 12h preset cards */}
                    <div className="grid grid-cols-2 gap-2">
                      {PRESETS.map((p) => {
                        const active = !customMode && selectedHours === p.hours;
                        return (
                          <motion.button
                            key={p.hours}
                            type="button"
                            onClick={() => {
                              setCustomMode(false);
                              setSelectedHours(p.hours);
                            }}
                            whileTap={{ scale: 0.97 }}
                            transition={{ duration: 0.18, ease: SPRING }}
                            className={`press-spring flex flex-col items-start gap-0.5 rounded-2xl border px-3.5 py-3 text-left transition-all duration-200 ${
                              active
                                ? 'border-safe/40 bg-safe/15 shadow-safe-glow'
                                : 'border-[rgba(60,60,67,0.08)] bg-white/95 shadow-glass dark:border-[rgba(255,255,255,0.06)] dark:bg-[#1C1C1E]/85 dark:shadow-glass-dark'
                            }`}
                          >
                            <span
                              className={`text-[20px] font-semibold tracking-[-0.01em] ${
                                active ? 'text-safe' : 'text-black dark:text-white'
                              }`}
                            >
                              {p.label}
                            </span>
                            <span
                              className={`text-[11px] font-medium uppercase tracking-[0.06em] ${
                                active
                                  ? 'text-safe/80'
                                  : 'text-[rgba(60,60,67,0.55)] dark:text-[rgba(235,235,245,0.55)]'
                              }`}
                            >
                              {p.tag}
                            </span>
                          </motion.button>
                        );
                      })}

                      {/* Custom duration */}
                      <motion.button
                        type="button"
                        onClick={() => {
                          setCustomMode(true);
                          setSelectedHours(null);
                          if (customHours * 60 + customMinutes === 0) {
                            setCustomHours(2);
                            setCustomMinutes(0);
                          }
                        }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ duration: 0.18, ease: SPRING }}
                        className={`press-spring col-span-2 flex items-center justify-between gap-3 rounded-2xl border px-3.5 py-3 text-left transition-all duration-200 ${
                          customMode
                            ? 'border-safe/40 bg-safe/15 shadow-safe-glow'
                            : 'border-[rgba(60,60,67,0.08)] bg-white/95 shadow-glass dark:border-[rgba(255,255,255,0.06)] dark:bg-[#1C1C1E]/85 dark:shadow-glass-dark'
                        }`}
                      >
                        <div className="flex flex-col">
                          <span
                            className={`text-[16px] font-semibold tracking-[-0.01em] ${
                              customMode ? 'text-safe' : 'text-black dark:text-white'
                            }`}
                          >
                            Custom
                          </span>
                          <span
                            className={`text-[12px] font-medium ${
                              customMode
                                ? 'text-safe/80'
                                : 'text-[rgba(60,60,67,0.55)] dark:text-[rgba(235,235,245,0.55)]'
                            }`}
                          >
                            Pick any duration
                          </span>
                        </div>
                        <ClockIcon
                          size={20}
                          className={`flex-shrink-0 ${customMode ? 'text-safe' : 'text-[rgba(60,60,67,0.5)] dark:text-[rgba(235,235,245,0.5)]'}`}
                          strokeWidth={2.2}
                        />
                      </motion.button>
                    </div>

                    {/* Custom hour/minute stepper */}
                    <AnimatePresence initial={false}>
                      {customMode && (
                        <motion.div
                          key="custom-body"
                          initial={{ opacity: 0, y: -4, height: 0 }}
                          animate={{ opacity: 1, y: 0, height: 'auto' }}
                          exit={{ opacity: 0, y: -4, height: 0 }}
                          transition={{ duration: 0.24, ease: EASE }}
                          className="overflow-hidden"
                        >
                          <div className="mt-2 rounded-2xl border border-[rgba(60,60,67,0.08)] bg-white/95 p-3 shadow-glass dark:border-[rgba(255,255,255,0.06)] dark:bg-[#1C1C1E]/85 dark:shadow-glass-dark">
                            <div className="grid grid-cols-2 gap-3">
                              <NumberStepper
                                label="Hours"
                                value={customHours}
                                min={0}
                                max={72}
                                step={1}
                                onChange={setCustomHours}
                              />
                              <NumberStepper
                                label="Minutes"
                                value={customMinutes}
                                min={0}
                                max={59}
                                step={5}
                                onChange={(v) => setCustomMinutes(Math.min(59, v))}
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Battery tip */}
            <div className="mx-4 mt-4 rounded-2xl border border-[rgba(60,60,67,0.06)] bg-white/80 p-3 shadow-glass dark:border-[rgba(255,255,255,0.06)] dark:bg-[#1C1C1E]/70 dark:shadow-glass-dark">
              <div className="flex items-start gap-2.5">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/15">
                  <BatteryChargingIcon
                    size={14}
                    className="text-accent"
                    strokeWidth={2.4}
                  />
                </span>
                <p className="text-[12px] leading-snug text-[rgba(60,60,67,0.7)] dark:text-[rgba(235,235,245,0.7)]">
                  Pi 5 uses about 6% battery per hour. Session auto-stops at zero so your helmet never drains while parked.
                </p>
              </div>
            </div>

            {/* Footer CTA */}
            <div className="sticky bottom-0 z-10 mt-4 bg-gradient-to-t from-[#F4F4F7] via-[#F4F4F7]/95 to-transparent px-4 pb-4 pt-3 dark:from-[#0C0C0E] dark:via-[#0C0C0E]/95">
              <button
                type="button"
                onClick={handleConfirm}
                disabled={!dirty && wantOn === sessionOn}
                className={`press-spring flex h-[50px] w-full items-center justify-center gap-2 rounded-2xl text-[16px] font-semibold transition-all duration-200 active:scale-[0.98] ${
                  wantOn
                    ? 'bg-safe text-white shadow-safe-glow active:brightness-105'
                    : 'bg-[rgba(120,120,128,0.12)] text-[rgba(60,60,67,0.55)] dark:bg-[rgba(120,120,128,0.24)] dark:text-[rgba(235,235,245,0.55)]'
                } ${!dirty && wantOn === sessionOn ? 'opacity-50' : ''}`}
              >
                {wantOn ? (
                  <>
                    <PowerIcon size={17} strokeWidth={2.5} />
                    Start session — {formatHoursLabel(totalSeconds)}
                  </>
                ) : (
                  <>
                    <XIcon size={17} strokeWidth={2.5} />
                    End session now
                  </>
                )}
              </button>
            </div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------ subcomponents ------------------------------ */

function NumberStepper({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  const dec = () => onChange(Math.max(min, value - step));
  const inc = () => onChange(Math.min(max, value + step));

  return (
    <div className="flex flex-col gap-1">
      <span className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[rgba(60,60,67,0.55)] dark:text-[rgba(235,235,245,0.55)]">
        {label}
      </span>
      <div className="flex items-center justify-between rounded-xl border border-[rgba(60,60,67,0.08)] bg-[rgba(120,120,128,0.10)] p-1 dark:border-[rgba(255,255,255,0.06)] dark:bg-[rgba(120,120,128,0.18)]">
        <button
          type="button"
          onClick={dec}
          aria-label={`Decrease ${label}`}
          className="press-spring flex h-9 w-9 items-center justify-center rounded-lg bg-white/90 text-[17px] font-semibold text-black shadow-glass active:scale-95 dark:bg-[#2C2C2E]/90 dark:text-white dark:shadow-glass-dark"
        >
          −
        </button>
        <span className="min-w-[44px] text-center text-[18px] font-semibold tabular-nums tracking-[-0.01em] text-black dark:text-white">
          {String(value).padStart(2, '0')}
        </span>
        <button
          type="button"
          onClick={inc}
          aria-label={`Increase ${label}`}
          className="press-spring flex h-9 w-9 items-center justify-center rounded-lg bg-white/90 text-[17px] font-semibold text-black shadow-glass active:scale-95 dark:bg-[#2C2C2E]/90 dark:text-white dark:shadow-glass-dark"
        >
          +
        </button>
      </div>
    </div>
  );
}

/* --------------------------------- helpers --------------------------------- */

function formatHoursLabel(totalSecs: number): string {
  const h = Math.floor(totalSecs / 3600);
  const m = Math.round((totalSecs - h * 3600) / 60);
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

function formatRemaining(remainingSecs: number): string {
  if (remainingSecs <= 0) return '0m';
  return formatHoursLabel(remainingSecs);
}
