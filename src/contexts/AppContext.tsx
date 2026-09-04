import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState } from
'react';
import type { ModuleId, RiderProfile } from '../types/app';

const DEFAULT_RIDER: RiderProfile = {
  name: 'Jayson Ramos',
  callSign: 'ANG-2214',
  mobile: '+63 917 555 0142',
  email: 'jayson.ramos@angkas.ph',
  provider: 'Angkas',
  plate: 'NCB 4471',
  motorcycle: 'Honda Click 160',
  bodyColor: 'Matte Black',
  bloodType: 'O+',
  emergencyName: 'Rowena Ramos',
  emergencyPhone: '+63 917 442 8810'
};

interface AppState {
  dark: boolean;
  toggleDark: () => void;
  module: ModuleId;
  setModule: (id: ModuleId) => void;
  commsTab: 'map' | 'radio';
  setCommsTab: (tab: 'map' | 'radio') => void;
  openComms: (tab: 'map' | 'radio') => void;
  signedIn: boolean;
  signIn: () => void;
  signOut: () => void;
  rider: RiderProfile;
  updateRider: (patch: Partial<RiderProfile>) => void;
  registerRider: (patch: Partial<RiderProfile>) => void;
  /** Whether a riding session is currently active. */
  sessionOn: boolean;
  /** Wall-clock ms when the active session started. Null when off. */
  sessionStartedAt: number | null;
  /** Wall-clock ms when the active session will auto-end. Null when off. */
  sessionEndsAt: number | null;
  /** Total length of the active session, in seconds. */
  sessionDurationSecs: number;
  /** Seconds remaining in the active session. 0 when not running. */
  sessionRemainingSecs: number;
  /** Seconds the session has been live (clamped to `sessionDurationSecs`). */
  elapsed: number;
  /** Start a new session with the given total duration. Pass `0` for an open-ended session. */
  startSession: (durationSecs: number) => void;
  /** End the current session. */
  endSession: () => void;
  sosActive: boolean;
  triggerSos: () => void;
  clearSos: () => void;
  voiceVolume: number;
  setVoiceVolume: (v: number) => void;
}

const Ctx = createContext<AppState | null>(null);

export function AppProvider({ children }: {children: React.ReactNode;}) {
  const [dark, setDark] = useState(false);
  const [module, setModule] = useState<ModuleId>('auth');
  const [signedIn, setSignedIn] = useState(false);
  const [sessionOn, setSessionOn] = useState(true);

  // Initialize with an 8-hour session starting 1 hour and 15 mins ago (4520 seconds elapsed)
  const [sessionStartedAt, setSessionStartedAt] = useState<number | null>(() => Date.now() - 4520000);
  const [sessionEndsAt, setSessionEndsAt] = useState<number | null>(() => Date.now() - 4520000 + 8 * 3600000);
  const [sessionDurationSecs, setSessionDurationSecs] = useState<number>(8 * 3600);
  const [sessionRemainingSecs, setSessionRemainingSecs] = useState<number>(8 * 3600 - 4520);
  const [elapsed, setElapsed] = useState(4520);

  const [sosActive, setSosActive] = useState(false);
  const [voiceVolume, setVoiceVolume] = useState(80);
  const [rider, setRider] = useState<RiderProfile>(DEFAULT_RIDER);
  const [commsTab, setCommsTab] = useState<'map' | 'radio'>('map');

  const startSession = useCallback((durationSecs: number) => {
    const now = Date.now();
    setSessionOn(true);
    setSessionStartedAt(now);
    setSessionDurationSecs(durationSecs);
    setElapsed(0);
    if (durationSecs > 0) {
      setSessionEndsAt(now + durationSecs * 1000);
      setSessionRemainingSecs(durationSecs);
    } else {
      setSessionEndsAt(null);
      setSessionRemainingSecs(0);
    }
  }, []);

  const endSession = useCallback(() => {
    setSessionOn(false);
    setSessionStartedAt(null);
    setSessionEndsAt(null);
    setSessionDurationSecs(0);
    setSessionRemainingSecs(0);
    setElapsed(0);
  }, []);

  const openComms = useCallback((tab: 'map' | 'radio') => {
    setCommsTab(tab);
    setModule('comms');
  }, []);

  const updateRider = useCallback((patch: Partial<RiderProfile>) => {
    setRider((r) => ({ ...r, ...patch }));
  }, []);

  // Drive active countdown / stopwatch
  useEffect(() => {
    if (!sessionOn) return;
    const t = window.setInterval(() => {
      setElapsed((e) => {
        const next = e + 1;
        if (sessionDurationSecs > 0 && next >= sessionDurationSecs) {
          // Auto-end session when duration is hit
          setSessionOn(false);
          setSessionStartedAt(null);
          setSessionEndsAt(null);
          setSessionDurationSecs(0);
          setSessionRemainingSecs(0);
          return 0;
        }
        return next;
      });

      if (sessionDurationSecs > 0) {
        setSessionRemainingSecs((r) => Math.max(0, r - 1));
      }
    }, 1000);
    return () => window.clearInterval(t);
  }, [sessionOn, sessionDurationSecs]);

  const signIn = useCallback(() => {
    setSignedIn(true);
    setModule('session');
  }, []);

  const registerRider = useCallback(
    (patch: Partial<RiderProfile>) => {
      updateRider(patch);
      setSignedIn(true);
      setModule('session');
    },
    [updateRider]
  );

  const signOut = useCallback(() => {
    setSignedIn(false);
    setSosActive(false);
    setModule('auth');
  }, []);

  const triggerSos = useCallback(() => {
    setSosActive(true);
    setModule('incident');
  }, []);

  const value = useMemo<AppState>(
    () => ({
      dark,
      toggleDark: () => setDark((d) => !d),
      module,
      setModule,
      commsTab,
      setCommsTab,
      openComms,
      signedIn,
      signIn,
      signOut,
      rider,
      updateRider,
      registerRider,
      sessionOn,
      sessionStartedAt,
      sessionEndsAt,
      sessionDurationSecs,
      sessionRemainingSecs,
      elapsed,
      startSession,
      endSession,
      sosActive,
      triggerSos,
      clearSos: () => setSosActive(false),
      voiceVolume,
      setVoiceVolume
    }),
    [
      dark,
      module,
      commsTab,
      openComms,
      signedIn,
      signIn,
      signOut,
      rider,
      updateRider,
      registerRider,
      sessionOn,
      sessionStartedAt,
      sessionEndsAt,
      sessionDurationSecs,
      sessionRemainingSecs,
      elapsed,
      startSession,
      endSession,
      sosActive,
      triggerSos,
      voiceVolume
    ]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp(): AppState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}