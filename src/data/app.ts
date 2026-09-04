import type {
  ChatMessage,
  DiagnosticRow,
  EmergencyContact,
  NearbyIncident,
  PttMember,
  Responder,
  VoiceAnnouncement } from
'../types/app';

export const riderPosition = { lat: 14.5701, lng: 121.0603 };

export const nearbyIncidents: NearbyIncident[] = [
{
  id: 'i1',
  callSign: 'JOY-0871',
  riderName: 'Marlon Dizon',
  initials: 'MD',
  provider: 'JoyRide',
  plate: 'NBH 8821',
  bloodType: 'B+',
  severity: 'critical',
  detectedBy: 'Auto-AI crash detection',
  crashType: 'Side impact · rider down, no movement for 40 s',
  landmark: 'C5 Service Rd. cor. Kalayaan Ave.',
  minutesAgo: 2,
  distanceKm: 0.9,
  lat: 14.5648,
  lng: 121.0651,
  respondersEta: 'MDRRMO Ambulance · ETA 3 min',
  ridersResponding: 4,
  notes: 'Passenger conscious. Rider pinned under bike — needs 2 people to lift.'
},
{
  id: 'i2',
  callSign: 'ANG-1190',
  riderName: 'Kevin Alarcon',
  initials: 'KA',
  provider: 'Angkas',
  plate: 'NCA 2210',
  bloodType: 'O−',
  severity: 'moderate',
  detectedBy: 'Manual SOS hold',
  crashType: 'Skid on wet road · rider mobile',
  landmark: 'Shaw Blvd. near Kapitolyo flyover',
  minutesAgo: 6,
  distanceKm: 1.7,
  lat: 14.5762,
  lng: 121.0538,
  respondersEta: 'Barangay Tanod · ETA 6 min',
  ridersResponding: 2,
  notes: 'Needs help clearing the bike from the inner lane. Minor leg abrasion.'
},
{
  id: 'i3',
  callSign: 'MOV-3390',
  riderName: 'Aldrin Bautista',
  initials: 'AB',
  provider: 'Move It',
  plate: 'NDD 7714',
  bloodType: 'A+',
  severity: 'minor',
  detectedBy: 'Auto-AI crash detection',
  crashType: 'Low-speed tip-over at a stop',
  landmark: 'Ortigas Ave. cor. Meralco Ave.',
  minutesAgo: 14,
  distanceKm: 2.6,
  lat: 14.5828,
  lng: 121.0645,
  respondersEta: 'Stood down — no responder needed',
  ridersResponding: 1,
  notes: 'Rider okay. Waiting for a jumpstart, bike battery drained.'
}];


export const responders: Responder[] = [
{
  id: 'r1',
  kind: 'ambulance',
  label: 'MDRRMO Ambulance',
  unit: 'Unit AMB-04 · Pasig Rescue',
  distanceKm: 0.8,
  etaMinutes: 3,
  status: 'arriving'
},
{
  id: 'r2',
  kind: 'police',
  label: 'PNP Mobile Patrol',
  unit: 'Car 12 · Station 6',
  distanceKm: 1.6,
  etaMinutes: 5,
  status: 'en-route'
},
{
  id: 'r3',
  kind: 'tanod',
  label: 'Barangay Tanod',
  unit: 'Brgy. Kapitolyo Outpost',
  distanceKm: 2.4,
  etaMinutes: 8,
  status: 'dispatched'
}];


export const voiceAnnouncements: VoiceAnnouncement[] = [
{
  id: 'v1',
  text: 'MDRRMO Ambulance dispatched. ETA 3 minutes. Stay where you are.',
  timestamp: '14:32:09',
  channel: 'Bluetooth Headset'
},
{
  id: 'v2',
  text: 'Crash detected on C5 Service Road. Emergency contacts notified.',
  timestamp: '14:31:44',
  channel: 'Bluetooth Headset'
},
{
  id: 'v3',
  text: 'Front and rear clips locked. 90 seconds saved to evidence vault.',
  timestamp: '14:31:41',
  channel: 'Handset Speaker'
}];


export const pttQueue: PttMember[] = [
{
  id: 'p1',
  callSign: 'RESCUE-1',
  name: 'MDRRMO Dispatch',
  initials: 'MD',
  provider: 'MDRRMO',
  priority: true
},
{
  id: 'p2',
  callSign: 'ANG-2214',
  name: 'Jayson Ramos',
  initials: 'JR',
  provider: 'Angkas',
  priority: false
},
{
  id: 'p3',
  callSign: 'JOY-0871',
  name: 'Marlon Dizon',
  initials: 'MD',
  provider: 'JoyRide',
  priority: false
}];


export const chatMessages: ChatMessage[] = [
{
  id: 'c1',
  callSign: 'System',
  initials: 'SY',
  body: 'Emergency override engaged. Channel locked to incident traffic.',
  time: '14:31',
  kind: 'system'
},
{
  id: 'c2',
  callSign: 'MOV-3390',
  initials: 'AB',
  body: 'Nasa Kapitolyo ako, 2 mins away. Papunta na ako sa location.',
  time: '14:32',
  kind: 'text'
},
{
  id: 'c3',
  callSign: 'ANG-2214',
  initials: 'JR',
  body: 'May traffic sa service road, dumaan kayo sa Shaw side.',
  time: '14:33',
  kind: 'text'
},
{
  id: 'c4',
  callSign: 'RESCUE-1',
  initials: 'MD',
  body: 'Copy. Ambulance turning into C5 now. Clear the lane.',
  time: '14:33',
  kind: 'text'
}];


export const diagnostics: DiagnosticRow[] = [
{
  id: 'd1',
  label: 'Raspberry Pi 5 Unit',
  detail: 'BANTAI-PI-4471 · Firmware 2.4.1',
  value: 'Online',
  state: 'ok'
},
{
  id: 'd2',
  label: 'Front Camera (180°)',
  detail: '1080p · 30fps stream stable',
  value: 'Connected',
  state: 'ok'
},
{
  id: 'd3',
  label: 'Rear Camera (180°)',
  detail: 'Lens obstruction detected — wipe lens',
  value: 'Degraded',
  state: 'warn'
},
{
  id: 'd4',
  label: 'SD Card Storage',
  detail: '46.2 GB of 64 GB used · loop recording',
  value: '72%',
  state: 'ok',
  meter: 72
},
{
  id: 'd5',
  label: 'Device Battery',
  detail: 'Running on bike power · charging',
  value: '84%',
  state: 'ok',
  meter: 84
}];


export const emergencyContacts: EmergencyContact[] = [
{ id: 'e1', name: 'Rowena Ramos', relation: 'Spouse', phone: '+63 917 442 8810' },
{ id: 'e2', name: 'Angkas Ops Hotline', relation: 'Operator', phone: '+63 2 8888 2200' },
{ id: 'e3', name: '', relation: '', phone: '' }];


export const bloodTypes = ['A+', 'A−', 'B+', 'B−', 'AB+', 'AB−', 'O+', 'O−'];

export const providers = ['Angkas', 'JoyRide', 'Move It', 'Independent'];