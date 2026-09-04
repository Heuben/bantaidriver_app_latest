export type ModuleId =
'auth' |
'session' |
'incident' |
'comms' |
'hardware' |
'profile' |
'settings';

export interface RiderProfile {
  name: string;
  callSign: string;
  mobile: string;
  email: string;
  provider: string;
  plate: string;
  motorcycle: string;
  bodyColor: string;
  bloodType: string;
  emergencyName: string;
  emergencyPhone: string;
}

export type IncidentSeverity = 'critical' | 'moderate' | 'minor';

export interface NearbyIncident {
  id: string;
  callSign: string;
  riderName: string;
  initials: string;
  provider: string;
  plate: string;
  bloodType: string;
  severity: IncidentSeverity;
  detectedBy: 'Auto-AI crash detection' | 'Manual SOS hold';
  crashType: string;
  landmark: string;
  minutesAgo: number;
  distanceKm: number;
  lat: number;
  lng: number;
  respondersEta: string;
  ridersResponding: number;
  notes: string;
}

export type ResponderKind = 'police' | 'tanod' | 'ambulance';

export interface Responder {
  id: string;
  kind: ResponderKind;
  label: string;
  unit: string;
  distanceKm: number;
  etaMinutes: number;
  status: 'dispatched' | 'en-route' | 'arriving';
}

export interface VoiceAnnouncement {
  id: string;
  text: string;
  timestamp: string;
  channel: 'Bluetooth Headset' | 'Handset Speaker';
}

export interface PttMember {
  id: string;
  callSign: string;
  name: string;
  initials: string;
  provider: string;
  priority: boolean;
}

export interface ChatMessage {
  id: string;
  callSign: string;
  initials: string;
  body: string;
  time: string;
  kind: 'text' | 'system';
}

export interface DiagnosticRow {
  id: string;
  label: string;
  detail: string;
  value: string;
  state: 'ok' | 'warn' | 'fail';
  meter?: number;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relation: string;
  phone: string;
}

export type ConnectionState = 'connected' | 'reconnecting' | 'offline';

export type DownloadState = 'idle' | 'downloading' | 'success' | 'error';

export interface ConnectionStatus {
  state: ConnectionState;
  since: number;
  localRecordingActive: boolean;
  bufferedDurationSecs: number;
  bufferedClipCount: number;
  lastSyncTime: number | null;
  downloadState: DownloadState;
  downloadProgress: number; // 0–100
  lastSavedClip: string | null; // ISO timestamp of last manually saved clip
}