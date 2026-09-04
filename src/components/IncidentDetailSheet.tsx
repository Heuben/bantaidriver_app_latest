import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ClockIcon,
  DropletIcon,
  MapPinIcon,
  NavigationIcon,
  PhoneIcon,
  ScanEyeIcon,
  UsersIcon,
  XIcon } from
'lucide-react';
import { Avatar, Pill } from './ui';
import { formatDistance } from '../utils/format';
import type { NearbyIncident } from '../types/app';

const EASE = [0.23, 1, 0.32, 1] as const;

export function IncidentDetailSheet({
  incident,
  responding,
  onRespond,
  onClose





}: {incident: NearbyIncident | null;responding: boolean;onRespond: () => void;onClose: () => void;}) {
  return (
    <AnimatePresence>
      {incident ?
      <motion.div
        key="scrim"
        className="pointer-events-auto absolute inset-0 z-40 flex flex-col justify-end"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: EASE }}>
        
          <button
          type="button"
          aria-label="Close incident details"
          onClick={onClose}
          className="absolute inset-0 bg-black/35" />
        
          <motion.section
          role="dialog"
          aria-label={`Incident details for ${incident.callSign}`}
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ duration: 0.28, ease: EASE }}
          className="relative max-h-[74%] overflow-y-auto rounded-t-[22px] bg-ios-canvas pb-8 dark:bg-black">
          
            <div className="sticky top-0 z-10 bg-ios-canvas/85 px-4 pb-2 pt-2.5 backdrop-blur-xl dark:bg-black/80">
              <span className="mx-auto mb-2.5 block h-[5px] w-[38px] rounded-full bg-[rgba(60,60,67,0.3)] dark:bg-[rgba(235,235,245,0.3)]" />
              <div className="flex items-start gap-3">
                <Avatar
                initials={incident.initials}
                tone={incident.severity === 'minor' ? 'neutral' : 'red'}
                size={46} />
              
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="truncate text-[19px] font-bold tracking-[-0.01em] text-black dark:text-white">
                      {incident.callSign}
                    </h2>
                    <Pill tone={incident.severity === 'minor' ? 'neutral' : 'red'} dot>
                      {incident.severity === 'critical' ?
                    'Critical' :
                    incident.severity === 'moderate' ?
                    'Needs help' :
                    'Minor'}
                    </Pill>
                  </div>
                  <p className="truncate text-[13px] text-[rgba(60,60,67,0.6)] dark:text-[rgba(235,235,245,0.6)]">
                    {incident.riderName} · {incident.provider} · {incident.minutesAgo} min ago
                  </p>
                </div>
                <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-full bg-[rgba(120,120,128,0.16)] text-[rgba(60,60,67,0.7)] dark:bg-[rgba(120,120,128,0.34)] dark:text-white">
                
                  <XIcon size={15} strokeWidth={2.6} />
                </button>
              </div>
            </div>

            <div className="space-y-4 px-4 pt-3">
              <div
              className={`rounded-ios px-4 py-3.5 ${
              incident.severity === 'minor' ?
              'bg-white dark:bg-[#1C1C1E]' :
              'bg-emergency text-white'}`
              }>
              
                <span
                className={`flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.07em] ${
                incident.severity === 'minor' ?
                'text-[rgba(60,60,67,0.6)] dark:text-[rgba(235,235,245,0.6)]' :
                'text-white/85'}`
                }>
                
                  <ScanEyeIcon size={13} strokeWidth={2.5} />
                  {incident.detectedBy}
                </span>
                <p
                className={`mt-1.5 text-[16px] font-semibold leading-snug ${
                incident.severity === 'minor' ? 'text-black dark:text-white' : 'text-white'}`
                }>
                
                  {incident.crashType}
                </p>
              </div>

              <div className="overflow-hidden rounded-ios bg-white dark:bg-[#1C1C1E]">
                <div className="divide-y divide-[rgba(60,60,67,0.15)] dark:divide-[rgba(84,84,88,0.45)]">
                  <Detail
                  icon={<MapPinIcon size={17} />}
                  label="Location"
                  value={incident.landmark}
                  trailing={`${formatDistance(incident.distanceKm)} away`} />
                
                  <Detail
                  icon={<ClockIcon size={17} />}
                  label="Responders"
                  value={incident.respondersEta} />
                
                  <Detail
                  icon={<DropletIcon size={17} />}
                  label="Rider info"
                  value={`Plate ${incident.plate} · Blood type ${incident.bloodType}`} />
                
                  <Detail
                  icon={<UsersIcon size={17} />}
                  label="Riders responding"
                  value={`${incident.ridersResponding + (responding ? 1 : 0)} nearby riders on the way`} />
                
                </div>
              </div>

              <div className="rounded-ios bg-white px-4 py-3.5 dark:bg-[#1C1C1E]">
                <p className="text-[12px] font-semibold uppercase tracking-[0.06em] text-[rgba(60,60,67,0.6)] dark:text-[rgba(235,235,245,0.6)]">
                  What help is needed
                </p>
                <p className="mt-1.5 text-[15px] leading-snug text-black dark:text-white">
                  {incident.notes}
                </p>
              </div>

              <div className="space-y-2.5">
                <button
                type="button"
                onClick={onRespond}
                className={`w-full rounded-[14px] py-[13px] text-[17px] font-semibold transition-transform duration-150 ease-ios active:scale-[0.98] ${
                responding ?
                'bg-[rgba(120,120,128,0.16)] text-black dark:bg-[rgba(120,120,128,0.32)] dark:text-white' :
                'bg-safe text-white'}`
                }>
                
                  {responding ? "You're marked as responding" : "I'm responding — notify the channel"}
                </button>
                <div className="flex gap-2.5">
                  <SheetAction icon={<NavigationIcon size={17} />} label="Navigate" />
                  <SheetAction icon={<PhoneIcon size={17} />} label="Call dispatch" />
                </div>
              </div>

              <p className="pb-1 text-center text-[12px] leading-snug text-[rgba(60,60,67,0.5)] dark:text-[rgba(235,235,245,0.45)]">
                Only ride in if it is safe. Never move an unconscious rider unless traffic makes it
                unavoidable.
              </p>
            </div>
          </motion.section>
        </motion.div> :
      null}
    </AnimatePresence>);

}

function Detail({
  icon,
  label,
  value,
  trailing





}: {icon: React.ReactNode;label: string;value: string;trailing?: string;}) {
  return (
    <div className="flex items-start gap-3 px-4 py-3">
      <span className="mt-0.5 shrink-0 text-[rgba(60,60,67,0.5)] dark:text-[rgba(235,235,245,0.5)]">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[12px] font-medium text-[rgba(60,60,67,0.6)] dark:text-[rgba(235,235,245,0.6)]">
          {label}
        </p>
        <p className="mt-0.5 text-[15px] leading-snug text-black dark:text-white">{value}</p>
      </div>
      {trailing ?
      <span className="shrink-0 pt-3 text-[13px] font-semibold tabular-nums text-safe">
          {trailing}
        </span> :
      null}
    </div>);

}

function SheetAction({ icon, label }: {icon: React.ReactNode;label: string;}) {
  return (
    <button
      type="button"
      className="flex flex-1 items-center justify-center gap-2 rounded-[14px] bg-white py-[12px] text-[15px] font-semibold text-black transition-transform duration-150 ease-ios active:scale-[0.98] dark:bg-[#1C1C1E] dark:text-white">
      
      {icon}
      {label}
    </button>);

}