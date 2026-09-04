import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import L from 'leaflet';
import { nearbyIncidents, riderPosition } from '../data/app';
import type { NearbyIncident } from '../types/app';

const LEAFLET_CSS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';

function ensureLeafletCss() {
  if (typeof document === 'undefined') return;
  if (document.querySelector(`link[href="${LEAFLET_CSS}"]`)) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = LEAFLET_CSS;
  document.head.appendChild(link);
}

const TILES = {
  light: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
  dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
};

const SEVERITY_COLOR: Record<NearbyIncident['severity'], string> = {
  critical: '#FF3B30',
  moderate: '#FF3B30',
  minor: 'rgba(120,120,128,0.9)'
};

function incidentIcon(incident: NearbyIncident, selected: boolean) {
  const color = SEVERITY_COLOR[incident.severity];
  const size = selected ? 42 : 34;
  return L.divIcon({
    className: 'bantai-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    html: `
      <span style="
        display:flex;align-items:center;justify-content:center;
        width:${size}px;height:${size}px;border-radius:9999px;
        background:${color};color:#fff;font-size:${selected ? 13 : 11}px;font-weight:700;
        border:${selected ? 3 : 2}px solid #fff;
        box-shadow:0 4px 12px rgba(0,0,0,.35);
        ${incident.severity !== 'minor' ? 'outline:6px solid rgba(255,59,48,.18);' : ''}
      ">${incident.initials}</span>`
  });
}

function riderIcon() {
  return L.divIcon({
    className: 'bantai-marker',
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    html: `<span style="display:block;width:18px;height:18px;margin:2px;border-radius:9999px;background:#34C759;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.3)"></span>`
  });
}

export const MIN_ZOOM = 11;
export const MAX_ZOOM = 18;

export interface IncidentMapHandle {
  zoomIn: () => void;
  zoomOut: () => void;
  recenter: () => void;
}

interface IncidentMapProps {
  dark: boolean;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onZoomChange?: (zoom: number) => void;
}

export const IncidentMap = forwardRef<IncidentMapHandle, IncidentMapProps>(function IncidentMap(
{ dark, selectedId, onSelect, onZoomChange },
ref)
{
  const hostRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileRef = useRef<L.TileLayer | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});
  const zoomCbRef = useRef(onZoomChange);
  zoomCbRef.current = onZoomChange;

  useImperativeHandle(ref, () => ({
    zoomIn: () => mapRef.current?.zoomIn(1),
    zoomOut: () => mapRef.current?.zoomOut(1),
    recenter: () => {
      mapRef.current?.flyTo([riderPosition.lat, riderPosition.lng], 14, { duration: 0.5 });
    }
  }));

  useEffect(() => {
    if (!hostRef.current || mapRef.current) return;
    ensureLeafletCss();
    const map = L.map(hostRef.current, {
      center: [riderPosition.lat, riderPosition.lng],
      zoom: 13,
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: false,
      doubleClickZoom: true,
      touchZoom: true,
      minZoom: MIN_ZOOM,
      maxZoom: MAX_ZOOM,
      zoomSnap: 0.5
    });
    mapRef.current = map;

    tileRef.current = L.tileLayer(dark ? TILES.dark : TILES.light, { maxZoom: 19 }).addTo(map);

    L.circle([riderPosition.lat, riderPosition.lng], {
      radius: 2200,
      color: '#34C759',
      weight: 1,
      opacity: 0.5,
      fillColor: '#34C759',
      fillOpacity: 0.06
    }).addTo(map);

    L.marker([riderPosition.lat, riderPosition.lng], { icon: riderIcon() }).addTo(map);

    nearbyIncidents.forEach((incident) => {
      const marker = L.marker([incident.lat, incident.lng], {
        icon: incidentIcon(incident, false),
        keyboard: true,
        title: `${incident.callSign} — ${incident.landmark}`
      }).
      addTo(map).
      on('click', () => onSelect(incident.id));
      markersRef.current[incident.id] = marker;
    });

    map.fitBounds(
      L.latLngBounds([
      [riderPosition.lat, riderPosition.lng],
      ...nearbyIncidents.map((i) => [i.lat, i.lng] as [number, number])]
      ),
      { padding: [46, 46] }
    );

    // The map mounts inside a segmented view and a scroll container, so its size
    // can be measured before layout settles — re-measure once the CSS lands.
    const timers = [60, 250, 600].map((ms) =>
    window.setTimeout(() => map.invalidateSize(), ms)
    );
    const observer = new ResizeObserver(() => map.invalidateSize());
    observer.observe(hostRef.current);

    const emitZoom = () => zoomCbRef.current?.(map.getZoom());
    map.on('zoomend', emitZoom);
    emitZoom();

    return () => {
      map.off('zoomend', emitZoom);
      timers.forEach(window.clearTimeout);
      observer.disconnect();
      map.remove();
      mapRef.current = null;
      markersRef.current = {};
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!mapRef.current || !tileRef.current) return;
    tileRef.current.setUrl(dark ? TILES.dark : TILES.light);
  }, [dark]);

  useEffect(() => {
    nearbyIncidents.forEach((incident) => {
      const marker = markersRef.current[incident.id];
      if (marker) marker.setIcon(incidentIcon(incident, incident.id === selectedId));
    });
    if (selectedId && mapRef.current) {
      const incident = nearbyIncidents.find((i) => i.id === selectedId);
      if (incident) mapRef.current.panTo([incident.lat, incident.lng], { animate: true });
    }
  }, [selectedId]);

  return (
    <div
      ref={hostRef}
      className="h-full w-full"
      role="application"
      aria-label="Map of nearby rider incidents" />);


});