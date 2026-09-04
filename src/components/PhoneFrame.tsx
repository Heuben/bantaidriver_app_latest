import React from 'react';
import { motion } from 'framer-motion';
import {
  BikeIcon,
  CpuIcon,
  RadioIcon,
  SirenIcon,
  UserIcon,
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { NotificationLayer } from '../contexts/NotificationContext';
import type { ModuleId } from '../types/app';

const TABS: { id: ModuleId; label: string; Icon: typeof BikeIcon }[] = [
  { id: 'session', label: 'Ride', Icon: BikeIcon },
  { id: 'incident', label: 'Rescue', Icon: SirenIcon },
  { id: 'hardware', label: 'Device', Icon: CpuIcon },
  { id: 'comms', label: 'Comms', Icon: RadioIcon },
  { id: 'profile', label: 'Profile', Icon: UserIcon },
];

export function PhoneFrame({
  title,
  headerRight,
  children,
  overlay,
  showChrome = true,
}: {
  title?: string;
  headerRight?: React.ReactNode;
  children: React.ReactNode;
  overlay?: React.ReactNode;
  showChrome?: boolean;
}) {
  const { module, setModule, sosActive } = useApp();

  return (
    <div className="relative h-[844px] w-[390px] shrink-0 rounded-[54px] bg-black p-[11px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.45),0_0_0_0.5px_rgba(0,0,0,0.2)]">
      <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[44px] bg-ios-canvas dark:bg-black">
        {/* Status bar */}
        <div className="relative z-30 flex h-[54px] shrink-0 items-end justify-between px-8 pb-1.5 text-[15px] font-semibold text-black dark:text-white">
          <span>9:41</span>
          <div className="absolute left-1/2 top-[9px] h-[32px] w-[110px] -translate-x-1/2 rounded-full bg-black" />
          <div className="flex items-center gap-1.5">
            <SignalGlyph />
            <WifiGlyph />
            <BatteryGlyph />
          </div>
        </div>

        {/* Header — always shows glass blur since content always fills viewport */}
        {showChrome && title ? (
          <header className="relative z-20 shrink-0 border-b border-[rgba(60,60,67,0.12)] bg-white/65 px-4 pb-2 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] backdrop-blur-glass dark:border-[rgba(255,255,255,0.06)] dark:bg-black/55 dark:shadow-[0_2px_8px_-2px_rgba(0,0,0,0.3)]">
            <div className="flex items-end justify-between gap-3">
              <h1 className="text-[30px] font-bold leading-tight tracking-[-0.02em] text-black dark:text-white">
                {title}
              </h1>
              {headerRight}
            </div>
          </header>
        ) : null}

        {/* Content — allow internal scrolling inside the phone frame but hide scrollbar */}
        <div className="relative flex-1 overflow-auto no-scrollbar">
          {children}
          {showChrome ? <div className="h-[104px]" /> : <div className="h-6" />}
        </div>

        {/* In-app notification stack — always rendered inside the phone so
            toasts/banners can never escape the device frame. */}
        <NotificationLayer />

        {overlay ? (
          <div className="absolute inset-0 z-40 pointer-events-none">
            <div
              className={
                React.isValidElement(overlay) && (overlay as any).props?.open ? 'pointer-events-auto' : ''
              }
            >
              {overlay}
            </div>
          </div>
        ) : null}

        {/* Tab bar */}
        {showChrome ? (
          <nav aria-label="Primary" className="absolute inset-x-0 bottom-0 z-20 pb-6">
            <div className="flex items-center justify-center px-4">
              <ul className="relative flex w-full max-w-[340px] items-center justify-between rounded-2xl bg-white/95 px-3 py-2 shadow-glass dark:bg-[#0C0C0E]/85">
                {TABS.map(({ id, label, Icon }) => {
                  const active = module === id || (module === 'settings' && id === 'profile');
                  const alert = id === 'incident' && sosActive;
                  return (
                    <li key={id} className="flex-1 relative flex justify-center">
                      {active ? (
                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-safe text-white shadow-lg dark:bg-safe/80">
                          <Icon size={24} strokeWidth={2.4} />
                        </span>
                      ) : null}

                      <button
                        type="button"
                        onClick={() => setModule(id)}
                        aria-current={active ? 'page' : undefined}
                        className={`group flex w-full flex-col items-center transition-transform duration-200 ease-spring ${
                          active ? 'pt-6 pb-1' : 'pt-2 pb-1'
                        }`}
                      >
                        <span className="relative">
                          <Icon
                            size={20}
                            strokeWidth={active ? 2.4 : 1.9}
                            className={`transition-colors duration-200 ease-ios ${
                              alert
                                ? 'text-emergency'
                                : active
                                ? 'text-transparent'
                                : 'text-[rgba(60,60,67,0.55)] dark:text-[rgba(235,235,245,0.5)]'
                            }`}
                          />
                          {alert && !active ? (
                            <motion.span
                              className="absolute -right-1 -top-0.5 h-[8px] w-[8px] rounded-full bg-emergency ring-2 ring-white dark:ring-[#0A0A0A]"
                              animate={{ scale: [1, 1.25, 1], opacity: [1, 0.7, 1] }}
                              transition={{ duration: 1.4, repeat: Infinity }}
                            />
                          ) : null}
                        </span>
                        <span
                          className={`text-[10px] font-medium leading-none transition-colors duration-200 ease-ios ${
                            alert
                              ? 'text-emergency'
                              : active
                              ? 'text-safe'
                              : 'text-[rgba(60,60,67,0.55)] dark:text-[rgba(235,235,245,0.5)]'
                          }`}
                        >
                          {label}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </nav>
        ) : (
          <div className="absolute bottom-[8px] left-1/2 z-20 h-[5px] w-[134px] -translate-x-1/2 rounded-full bg-black/85 dark:bg-white/60" />
        )}
      </div>
    </div>
  );
}

function SignalGlyph() {
  return (
    <span className="flex items-end gap-[2px]" aria-hidden="true">
      {[4, 6, 8, 10].map((h) => (
        <span
          key={h}
          style={{ height: h }}
          className="w-[3px] rounded-[1px] bg-black dark:bg-white"
        />
      ))}
    </span>
  );
}

function WifiGlyph() {
  return (
    <svg
      width="16"
      height="12"
      viewBox="0 0 16 12"
      aria-hidden="true"
      className="fill-black dark:fill-white"
    >
      <path d="M8 11.2 5.9 8.9a3 3 0 0 1 4.2 0L8 11.2Zm-4-4.4L2.6 5.3a7.6 7.6 0 0 1 10.8 0L12 6.8a5.6 5.6 0 0 0-8 0ZM8 .8c2.9 0 5.6 1.1 7.6 3l-1.4 1.5A9 9 0 0 0 8 2.8 9 9 0 0 0 1.8 5.3L.4 3.8A11 11 0 0 1 8 .8Z" />
    </svg>
  );
}

function BatteryGlyph() {
  return (
    <span className="flex items-center gap-[2px]" aria-hidden="true">
      <span className="relative h-[12px] w-[24px] rounded-[4px] border border-black/40 p-[2px] dark:border-white/50">
        <span className="block h-full w-[78%] rounded-[2px] bg-black dark:bg-white" />
      </span>
      <span className="h-[4px] w-[1.5px] rounded-r bg-black/40 dark:bg-white/50" />
    </span>
  );
}
