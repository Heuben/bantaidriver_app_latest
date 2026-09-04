import React, { useRef, useState } from 'react';
import { ChevronRightIcon, CrosshairIcon, MinusIcon, PlusIcon } from 'lucide-react';
import { IncidentMap, MAX_ZOOM, MIN_ZOOM } from './IncidentMap';
import type { IncidentMapHandle } from './IncidentMap';
import { Avatar, Pill, SectionLabel } from './ui';
import { nearbyIncidents } from '../data/app';
import { formatDistance } from '../utils/format';

export function NearbyMapPanel({
  dark,
  selectedId,
  respondingIds,
  onSelect





}: {dark: boolean;selectedId: string | null;respondingIds: string[];onSelect: (id: string) => void;}) {
  const mapRef = useRef<IncidentMapHandle>(null);
  const [zoom, setZoom] = useState(13);

  return (
    <div>
      <div className="relative z-0 h-[290px] w-full overflow-hidden">
        <IncidentMap
          ref={mapRef}
          dark={dark}
          selectedId={selectedId}
          onSelect={onSelect}
          onZoomChange={setZoom} />
        

        <div className="absolute right-3 top-3 z-10 flex flex-col overflow-hidden rounded-[12px] bg-white/90 shadow-[0_2px_10px_rgba(0,0,0,0.18)] backdrop-blur-md dark:bg-black/70">
          <MapControl
            label="Zoom in"
            disabled={zoom >= MAX_ZOOM}
            onClick={() => mapRef.current?.zoomIn()}>
            
            <PlusIcon size={18} strokeWidth={2.4} />
          </MapControl>
          <span className="h-px bg-[rgba(60,60,67,0.18)] dark:bg-[rgba(84,84,88,0.6)]" />
          <MapControl
            label="Zoom out"
            disabled={zoom <= MIN_ZOOM}
            onClick={() => mapRef.current?.zoomOut()}>
            
            <MinusIcon size={18} strokeWidth={2.4} />
          </MapControl>
        </div>

        <div className="absolute inset-x-3 bottom-3 z-10 flex items-end justify-between gap-2">
          <span className="pointer-events-none rounded-full bg-white/85 px-3 py-1.5 text-[12px] font-semibold text-black backdrop-blur-md dark:bg-black/70 dark:text-white">
            Within 3 km of you
          </span>
          <button
            type="button"
            aria-label="Recenter on my position"
            onClick={() => mapRef.current?.recenter()}
            className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-white/90 text-safe shadow-[0_2px_10px_rgba(0,0,0,0.18)] backdrop-blur-md transition-transform duration-150 ease-ios active:scale-95 dark:bg-black/70">
            
            <CrosshairIcon size={17} strokeWidth={2.3} />
          </button>
        </div>
      </div>

      <div className="px-4 pt-4">
        <SectionLabel>Active Incidents</SectionLabel>
        <ul className="space-y-2">
          {nearbyIncidents.map((incident) => {
            const urgentItem = incident.severity !== 'minor';
            return (
              <li key={incident.id}>
                <button
                  type="button"
                  onClick={() => onSelect(incident.id)}
                  className="flex w-full items-center gap-3 rounded-ios bg-white px-4 py-3 text-left transition-colors duration-150 ease-ios hover:bg-black/[0.02] active:bg-black/[0.05] dark:bg-[#1C1C1E] dark:hover:bg-white/[0.04]">
                  
                  <Avatar
                    initials={incident.initials}
                    tone={urgentItem ? 'red' : 'neutral'}
                    size={40} />
                  
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-[16px] font-semibold text-black dark:text-white">
                        {incident.callSign}
                      </p>
                      {urgentItem ?
                      <Pill tone="red">
                          {incident.severity === 'critical' ? 'Critical' : 'Needs help'}
                        </Pill> :
                      null}
                    </div>
                    <p className="mt-0.5 truncate text-[13px] text-[rgba(60,60,67,0.6)] dark:text-[rgba(235,235,245,0.6)]">
                      {incident.landmark}
                    </p>
                    <p className="mt-0.5 truncate text-[12px] text-[rgba(60,60,67,0.5)] dark:text-[rgba(235,235,245,0.5)]">
                      {incident.minutesAgo} min ago · {incident.ridersResponding} riders responding
                      {respondingIds.includes(incident.id) ? ' · you' : ''}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p
                      className={`text-[15px] font-bold tabular-nums ${
                      urgentItem ? 'text-emergency' : 'text-black dark:text-white'}`
                      }>
                      
                      {formatDistance(incident.distanceKm)}
                    </p>
                    <ChevronRightIcon
                      size={16}
                      className="ml-auto mt-1 text-[rgba(60,60,67,0.35)] dark:text-[rgba(235,235,245,0.35)]" />
                    
                  </div>
                </button>
              </li>);

          })}
        </ul>
        <p className="px-1 pt-3 text-[12px] leading-snug text-[rgba(60,60,67,0.55)] dark:text-[rgba(235,235,245,0.5)]">
          Incident pins appear only while an SOS is open, and disappear the moment the rider or
          MDRRMO stands it down.
        </p>
      </div>
    </div>);

}

function MapControl({
  label,
  disabled,
  onClick,
  children





}: {label: string;disabled?: boolean;onClick: () => void;children: React.ReactNode;}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex h-[34px] w-[34px] items-center justify-center text-black transition-colors duration-150 ease-ios hover:bg-black/[0.05] active:bg-black/[0.1] disabled:opacity-30 dark:text-white dark:hover:bg-white/10">
      
      {children}
    </button>);

}