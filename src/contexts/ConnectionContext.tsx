import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { ConnectionState, ConnectionStatus, DownloadState } from '../types/app';

interface ConnectionContextValue extends ConnectionStatus {
  isOnline: boolean;
  startLocalRecording: () => void;
  stopLocalRecording: () => void;
  syncBufferedClips: () => Promise<void>;
  saveLocally: () => Promise<void>;
  downloadBufferedClip: () => Promise<void>;
}

const ConnectionContext = createContext<ConnectionContextValue | null>(null);

const RECONNECT_TIMEOUT_MS = 5000;
const HEARTBEAT_INTERVAL_MS = 3000;
const MAX_RECONNECT_ATTEMPTS = 3;

/**
 * Monitors network / hardware connectivity and manages local SD-card buffering.
 * Placeholder for the WebSocket heartbeat — replace WS_URL with the actual
 * Pi 5 stream endpoint when available.
 */
export function ConnectionProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ConnectionState>('connected');
  const [since, setSince] = useState(() => Date.now());
  const [localRecordingActive, setLocalRecordingActive] = useState(false);
  const [bufferedDurationSecs, setBufferedDurationSecs] = useState(0);
  const [bufferedClipCount, setBufferedClipCount] = useState(0);
  const [lastSyncTime, setLastSyncTime] = useState<number | null>(null);
  const [downloadState, setDownloadState] = useState<DownloadState>('idle');
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [lastSavedClip, setLastSavedClip] = useState<string | null>(null);

  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const heartbeatTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const reconnectAttempts = useRef(0);
  const isMounted = useRef(true);

  const transition = useCallback((next: ConnectionState) => {
    if (!isMounted.current) return;
    setState(next);
    setSince(Date.now());
  }, []);

  /** Called every HEARTBEAT_INTERVAL_MS to ping the Pi. */
  const pingPi = useCallback(async () => {
    try {
      // TODO: Replace with actual WebSocket or HTTP health-check against the Pi.
      // Example: fetch('http://bantai-pi.local/health', { signal: AbortSignal.timeout(2000) })
      const ok = navigator.onLine; // Placeholder — real impl checks Pi connectivity
      if (!ok && isMounted.current) {
        reconnectAttempts.current += 1;
        if (reconnectAttempts.current >= MAX_RECONNECT_ATTEMPTS) {
          transition('offline');
        } else {
          transition('reconnecting');
        }
      } else if (ok && isMounted.current) {
        if (state !== 'connected') {
          reconnectAttempts.current = 0;
          transition('connected');
          // Sync any buffered clips on reconnection
          if (localRecordingActive) {
            setLocalRecordingActive(false);
            setLastSyncTime(Date.now());
          }
        }
      }
    } catch {
      if (isMounted.current) transition('reconnecting');
    }
  }, [state, localRecordingActive, transition]);

  /** Start polling the Pi. */
  const startHeartbeat = useCallback(() => {
    stopHeartbeat();
    pingPi();
    heartbeatTimer.current = setInterval(pingPi, HEARTBEAT_INTERVAL_MS);
  }, [pingPi]);

  const stopHeartbeat = useCallback(() => {
    if (heartbeatTimer.current !== null) {
      clearInterval(heartbeatTimer.current);
      heartbeatTimer.current = null;
    }
  }, []);

  /** Attempt a manual reconnect (e.g. user-triggered). */
  const attemptReconnect = useCallback(() => {
    if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
    reconnectAttempts.current = 0;
    transition('reconnecting');
    reconnectTimer.current = setTimeout(() => {
      if (isMounted.current) {
        pingPi();
        if (state !== 'connected') startHeartbeat();
      }
    }, RECONNECT_TIMEOUT_MS);
  }, [pingPi, startHeartbeat, state, transition]);

  /** Switch to local SD-card buffering. */
  const startLocalRecording = useCallback(() => {
    setLocalRecordingActive(true);
    setBufferedClipCount((c) => c + 1);
  }, []);

  /** Stop local buffering. */
  const stopLocalRecording = useCallback(() => {
    setLocalRecordingActive(false);
    setLastSyncTime(Date.now());
  }, []);

  /** Upload buffered clips to the operator vault once connectivity is restored. */
  const syncBufferedClips = useCallback(async () => {
    if (state !== 'connected') return;
    setLastSyncTime(Date.now());
    setBufferedDurationSecs(0);
    setBufferedClipCount(0);
  }, [state]);

  /**
   * Save the currently buffered offline footage to local device storage.
   * The actual byte-level retrieval from the Pi's SD card buffer is left as a
   * TODO integration point — for now we simulate a download with progress.
   * Returns a promise that resolves with the saved clip's timestamp.
   */
  const saveLocally = useCallback(async (): Promise<void> => {
    if (downloadState === 'downloading') return;
    if (bufferedClipCount === 0 && !localRecordingActive) {
      setDownloadState('error');
      setDownloadProgress(0);
      // Auto-clear error after a moment so the UI can recover
      setTimeout(() => {
        if (isMounted.current) setDownloadState('idle');
      }, 2400);
      return;
    }

    setDownloadState('downloading');
    setDownloadProgress(0);

    // TODO: Replace with real retrieval of the SD-card buffered clip, e.g.
    //   const resp = await fetch(`http://bantai-pi.local/clips/buffered?since=${since}`);
    //   await pipeToFileSystem(resp.body);
    // Simulated progress — drives the UI bar so the flow can be wired today.
    const totalDuration = Math.max(800, bufferedDurationSecs * 30);
    const tickMs = 120;
    const ticks = Math.ceil(totalDuration / tickMs);
    const inc = 100 / ticks;

    for (let i = 1; i <= ticks; i += 1) {
      await new Promise((r) => setTimeout(r, tickMs));
      if (!isMounted.current) return;
      // Simulate occasional slow chunks (network jitter)
      if (i === Math.floor(ticks * 0.7)) {
        await new Promise((r) => setTimeout(r, 600));
      }
      setDownloadProgress(Math.min(100, Math.round(inc * i)));
    }

    if (!isMounted.current) return;

    const savedAt = new Date().toISOString();
    setLastSavedClip(savedAt);
    setDownloadState('success');
    setDownloadProgress(100);

    // Persist a marker in localStorage so historical saved clips are visible
    try {
      const existing = window.localStorage.getItem('bantai.savedClips');
      const list: string[] = existing ? JSON.parse(existing) : [];
      list.unshift(savedAt);
      window.localStorage.setItem(
        'bantai.savedClips',
        JSON.stringify(list.slice(0, 20))
      );
    } catch {
      // Ignore storage failures (private mode, quota, etc.)
    }

    // Reset download state after a short success window
    setTimeout(() => {
      if (!isMounted.current) return;
      setDownloadState('idle');
      setDownloadProgress(0);
    }, 2200);
  }, [bufferedClipCount, bufferedDurationSecs, downloadState, localRecordingActive, since]);

  /**
   * Alias for saveLocally — exposed to the UI as "Download Buffered Clip".
   * Both methods share the same buffered footage retrieval path.
   */
  const downloadBufferedClip = useCallback(async (): Promise<void> => {
    await saveLocally();
  }, [saveLocally]);

  // Listen for browser-level online/offline events as a baseline signal.
  useEffect(() => {
    const handleOnline = () => {
      reconnectAttempts.current = 0;
      transition('connected');
      startHeartbeat();
    };
    const handleOffline = () => {
      transition('offline');
      startLocalRecording();
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    startHeartbeat();
    return () => {
      isMounted.current = false;
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      stopHeartbeat();
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
    };
  }, [startHeartbeat, stopHeartbeat, startLocalRecording, transition]);

  // Tick the buffered duration counter while recording locally.
  useEffect(() => {
    if (!localRecordingActive) return;
    const t = setInterval(
      () => setBufferedDurationSecs((s) => s + 1),
      1000
    );
    return () => clearInterval(t);
  }, [localRecordingActive]);

  const value = useMemo<ConnectionContextValue>(
    () => ({
      state,
      since,
      localRecordingActive,
      bufferedDurationSecs,
      bufferedClipCount,
      lastSyncTime,
      downloadState,
      downloadProgress,
      lastSavedClip,
      isOnline: state === 'connected',
      startLocalRecording,
      stopLocalRecording,
      syncBufferedClips,
      saveLocally,
      downloadBufferedClip,
    }),
    [
      state,
      since,
      localRecordingActive,
      bufferedDurationSecs,
      bufferedClipCount,
      lastSyncTime,
      downloadState,
      downloadProgress,
      lastSavedClip,
      startLocalRecording,
      stopLocalRecording,
      syncBufferedClips,
      saveLocally,
      downloadBufferedClip,
    ]
  );

  return (
    <ConnectionContext.Provider value={value}>
      {children}
    </ConnectionContext.Provider>
  );
}

export function useConnection(): ConnectionContextValue {
  const ctx = useContext(ConnectionContext);
  if (!ctx)
    throw new Error('useConnection must be used within <ConnectionProvider>');
  return ctx;
}
