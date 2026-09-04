import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FlagIcon,
  LinkIcon,
  QrCodeIcon,
  Unlink2Icon,
  WifiOffIcon,
  RefreshCwIcon,
  CloudUploadIcon,
  DownloadIcon,
  CameraIcon,
} from 'lucide-react';
import { PhoneFrame } from '../components/PhoneFrame';
import { Card, GroupedList, Pill, Row, SectionLabel, Segmented } from '../components/ui';
import { diagnostics } from '../data/app';
import { useConnection } from '../contexts/ConnectionContext';
import { useNotify } from '../contexts/NotificationContext';

type Tab = 'pair' | 'camera';
type CameraFacing = 'front' | 'rear';
type SelfTestState = 'idle' | 'running' | 'passed' | 'failed';

const CAMERA_LABELS: Record<CameraFacing, string> = {
  front: 'Front Camera (180°)',
  rear: 'Rear Camera (180°)',
};

export function HardwareScreen() {
  const [tab, setTab] = useState<Tab>('camera');
  const [activeCamera, setActiveCamera] = useState<CameraFacing>('front');
  const [selfTestState, setSelfTestState] = useState<SelfTestState>('idle');
  const [offloadState, setOffloadState] = useState<'idle' | 'uploading'>('idle');
  const {
    state: connectionState,
    localRecordingActive,
    bufferedClipCount,
    bufferedDurationSecs,
    lastSyncTime,
    startLocalRecording,
    syncBufferedClips,
    downloadState,
    downloadProgress,
    downloadBufferedClip,
  } = useConnection();

  const { notify, dismiss } = useNotify();
  const downloadNotifId = React.useRef<string | null>(null);

  // Drive download progress notification from connection state.
  useEffect(() => {
    if (downloadState === 'downloading') {
      // Replace any prior download notification so only one is visible.
      if (downloadNotifId.current) dismiss(downloadNotifId.current);
      downloadNotifId.current = notify({
        kind: 'info',
        title: `Downloading clip (${downloadProgress}%)…`,
        message: 'Saving buffered footage to device storage',
        duration: 0, // sticky — replaced on completion
      });
    } else if (downloadState === 'success') {
      if (downloadNotifId.current) {
        dismiss(downloadNotifId.current);
        downloadNotifId.current = null;
      }
      notify({
        kind: 'success',
        title: 'Clip saved to device storage',
        message: 'Buffered footage is now in your downloads',
      });
    } else if (downloadState === 'error') {
      if (downloadNotifId.current) {
        dismiss(downloadNotifId.current);
        downloadNotifId.current = null;
      }
      notify({
        kind: 'error',
        title: 'Download failed',
        message: 'No buffered footage found',
      });
    }
  }, [downloadState, downloadProgress, notify, dismiss]);

  const handleRunSelfTest = () => {
    if (selfTestState === 'running') return;
    setSelfTestState('running');
    setTimeout(() => {
      setSelfTestState('passed');
      notify({
        kind: 'success',
        title: 'Self-test passed',
        message: 'All critical Pi 5 checks OK',
      });
    }, 3000);
  };

  const handleOffload = () => {
    if (offloadState === 'uploading') return;
    setOffloadState('uploading');
    setTimeout(() => {
      setOffloadState('idle');
      notify({
        kind: 'success',
        title: 'Clips uploaded to vault',
        message: '12 evidence clips secured',
      });
    }, 2500);
  };

  const handlePairDevice = () => {
    notify({
      kind: 'info',
      title: 'Scanning for nearby B.A.N.T.A.I. devices…',
      message: 'Hold your phone within 1 m of the Pi 5 enclosure',
      duration: 5000,
    });
  };

  const handleUnpair = () => {
    notify({
      kind: 'error',
      title: 'Device unpaired',
      message: 'Restart the app to re-pair a helmet',
    });
  };

  const handleReportLost = () => {
    notify({
      kind: 'warning',
      title: 'Lost-device alert sent',
      message: 'Operator notified — the unit is now locked',
    });
  };

  const streamTone =
    connectionState === 'offline' ? 'amber' : connectionState === 'reconnecting' ? 'amber' : 'green';
  const streamLabel =
    connectionState === 'offline' ? 'OFFLINE' : connectionState === 'reconnecting' ? 'RECONNECTING' : 'LIVE';
  const cameraLabel = localRecordingActive
    ? 'Buffering to SD card'
    : connectionState === 'offline'
    ? 'Stream unavailable'
    : connectionState === 'reconnecting'
    ? 'Reconnecting to Pi…'
    : CAMERA_LABELS[activeCamera];
  const cameraSubtitle = localRecordingActive
    ? `${bufferedClipCount} clip${bufferedClipCount === 1 ? '' : 's'} · ${formatDuration(bufferedDurationSecs)} saved locally`
    : connectionState === 'offline'
    ? 'Footage is being saved locally — no footage will be lost'
    : connectionState === 'reconnecting'
    ? 'Re-establishing stream…'
    : `Showing ${CAMERA_LABELS[activeCamera]} — tap to switch`;

  const connectionRow: DiagnosticRowLike = {
    id: 'd-conn',
    label: 'Pi 5 Connection',
    detail:
      connectionState === 'connected'
        ? lastSyncTime
          ? `Last synced ${formatTimeAgo(lastSyncTime)}`
          : 'Stream stable · low latency'
        : connectionState === 'reconnecting'
        ? 'Reconnecting… Pi heartbeat lost'
        : 'Connection lost — local buffer active',
    value: connectionState === 'connected' ? 'Online' : connectionState === 'reconnecting' ? 'Reconnecting' : 'Offline',
    state: connectionState === 'connected' ? 'ok' : connectionState === 'reconnecting' ? 'warn' : 'fail',
  };

  return (
    <PhoneFrame
      title="Device"
      headerRight={
        <span className="pb-1.5">
          <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.28, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <Pill
              tone={connectionState === 'connected' ? 'green' : 'amber'}
              dot
              glow={connectionState === 'connected'}
            >
              {connectionState === 'connected'
                ? 'Paired'
                : connectionState === 'reconnecting'
                ? 'Reconnecting'
                : 'Offline'}
            </Pill>
          </motion.div>
        </span>
      }
    >
      <div className="space-y-5 px-4 pt-2">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
        >
          <Segmented<Tab>
            ariaLabel="Device view"
            value={tab}
            onChange={setTab}
            options={[
              { value: 'camera', label: 'Camera' },
              { value: 'pair', label: 'Pair Device' },
            ]}
          />
        </motion.div>

        {tab === 'pair' ? (
          <>
            {/* QR Scanner */}
            <motion.section
              aria-label="QR scanner"
              className="glass glass-edge overflow-hidden rounded-2xl"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05, ease: [0.23, 1, 0.32, 1] }}
            >
              <div className="relative m-4 aspect-square overflow-hidden rounded-[14px] bg-[#111]">
                <div className="absolute inset-0 opacity-40 [background:repeating-linear-gradient(0deg,#222_0px,#222_1px,transparent_1px,transparent_14px),repeating-linear-gradient(90deg,#222_0px,#222_1px,transparent_1px,transparent_14px)]" />
                <div className="absolute inset-8 rounded-[10px]">
                  {(
                    [
                      'left-0 top-0 border-l-[3px] border-t-[3px] rounded-tl-[10px]',
                      'right-0 top-0 border-r-[3px] border-t-[3px] rounded-tr-[10px]',
                      'left-0 bottom-0 border-l-[3px] border-b-[3px] rounded-bl-[10px]',
                      'right-0 bottom-0 border-r-[3px] border-b-[3px] rounded-br-[10px]',
                    ] as const
                  ).map((pos) => (
                    <span key={pos} className={`absolute h-9 w-9 border-safe ${pos}`} />
                  ))}
                  <motion.span
                    className="absolute inset-x-3 h-[2px] rounded-full bg-safe"
                    animate={{ top: ['8%', '88%', '8%'] }}
                    transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
                  />

                  <span className="absolute inset-0 flex items-center justify-center">
                    <QrCodeIcon size={54} className="text-white/25" strokeWidth={1.4} />
                  </span>
                </div>
              </div>
              <p className="px-4 pb-4 text-center text-[13px] leading-snug text-[rgba(60,60,67,0.6)] dark:text-[rgba(235,235,245,0.6)]">
                Point at the QR sticker on the Pi 5 enclosure to pair a new device.
              </p>
            </motion.section>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
            >
              <GroupedList>
                <Row
                  icon={<LinkIcon size={19} className="text-safe" />}
                  title="Enter pairing code manually"
                  subtitle="Use the 8-digit code printed under the QR"
                  onClick={handlePairDevice}
                />
                <Row
                  icon={<Unlink2Icon size={19} className="text-emergency" />}
                  title="Unpair BANTAI-PI-4471"
                  subtitle="Stops recording and clears local keys"
                  danger
                  onClick={handleUnpair}
                />
                <Row
                  icon={<FlagIcon size={19} className="text-emergency" />}
                  title="Report lost or stolen device"
                  subtitle="Locks the unit and alerts your operator"
                  danger
                  onClick={handleReportLost}
                />
              </GroupedList>
            </motion.div>
          </>
        ) : (
          <>
            {/* Live Camera View */}
            <motion.section
              aria-label="Live camera view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            >
              <div className="mb-2 flex items-center justify-between px-1">
                <SectionLabel>Live Camera View</SectionLabel>
                {localRecordingActive ? (
                  <Pill tone="amber" dot size="sm" glow>
                    Saving locally
                  </Pill>
                ) : null}
              </div>
              <div
                className={`relative aspect-video overflow-hidden rounded-2xl bg-[#111] ${
                  connectionState === 'offline'
                    ? 'shadow-[0_0_0_2px_rgba(255,159,10,0.5),0_0_20px_-4px_rgba(255,159,10,0.25)]'
                    : 'shadow-glass dark:shadow-glass-dark'
                }`}
              >
                {connectionState === 'offline' || connectionState === 'reconnecting' ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2 text-white/70">
                      <WifiOffIcon
                        size={32}
                        strokeWidth={1.5}
                        className={connectionState === 'reconnecting' ? 'animate-pulse' : ''}
                      />
                      <span className="text-[14px] font-semibold">
                        {connectionState === 'offline' ? 'Connection lost' : 'Reconnecting…'}
                      </span>
                      <span className="px-6 text-center text-[12px] text-white/50">
                        {localRecordingActive
                          ? 'Buffering footage to SD card so nothing is lost'
                          : 'Live stream unavailable'}
                      </span>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    aria-label={`Switch to ${activeCamera === 'front' ? 'rear' : 'front'} camera`}
                    onClick={() => setActiveCamera((c) => (c === 'front' ? 'rear' : 'front'))}
                    className="press-spring absolute inset-0 flex items-center justify-center transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-safe"
                  >
                    <div className="text-center text-white/40">
                      <motion.div
                        key={activeCamera}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.22, ease: [0.34, 1.56, 0.64, 1] }}
                        className="flex flex-col items-center"
                      >
                        <CameraIcon
                          size={28}
                          strokeWidth={1.5}
                          className="mb-2 text-white/30"
                        />
                        <span className="text-[14px] font-medium">
                          {CAMERA_LABELS[activeCamera]}
                        </span>
                        <p className="mt-1 text-[12px]">Tap to switch</p>
                      </motion.div>
                    </div>
                  </button>
                )}
                {/* Stream placeholder grid */}
                <div className="absolute inset-0 [background:repeating-linear-gradient(0deg,rgba(255,255,255,0.03)_0px,rgba(255,255,255,0.03)_1px,transparent_1px,transparent_14px),repeating-linear-gradient(90deg,rgba(255,255,255,0.03)_0px,rgba(255,255,255,0.03)_1px,transparent_1px,transparent_14px)]" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <Pill tone={streamTone} dot size="sm" glow={streamTone === 'green'}>
                    {streamLabel}
                  </Pill>
                  <div className="flex items-center gap-1.5">
                    {localRecordingActive ? (
                      <Pill tone="amber" dot size="sm" glow>
                        SD BUFFER
                      </Pill>
                    ) : null}
                    <Pill tone="neutral" size="sm">
                      1080p · 30fps
                    </Pill>
                  </div>
                </div>
              </div>
              <p className="mt-2 px-1 text-[12px] leading-snug text-[rgba(60,60,67,0.6)] dark:text-[rgba(235,235,245,0.6)]">
                {cameraLabel} — {cameraSubtitle}
              </p>
            </motion.section>

            {/* Save Offline Footage Card */}
            <motion.section
              aria-label="Save offline footage"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.06, ease: [0.23, 1, 0.32, 1] }}
            >
              <Card
                glass
                elevated={localRecordingActive || bufferedClipCount > 0}
                className={
                  localRecordingActive || bufferedClipCount > 0
                    ? 'shadow-warning-glow dark:shadow-warning-glow'
                    : ''
                }
              >
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                        localRecordingActive || bufferedClipCount > 0
                          ? 'bg-warning/15 shadow-[0_0_0_4px_rgba(255,159,10,0.12)]'
                          : 'bg-[rgba(120,120,128,0.12)]'
                      }`}
                    >
                      <DownloadIcon
                        size={20}
                        strokeWidth={2}
                        className={
                          localRecordingActive || bufferedClipCount > 0
                            ? 'text-warning'
                            : 'text-[rgba(60,60,67,0.5)] dark:text-[rgba(235,235,245,0.5)]'
                        }
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-[16px] font-semibold text-black dark:text-white">
                        Save Offline Footage
                      </h3>
                      <p className="mt-0.5 text-[13px] leading-snug text-[rgba(60,60,67,0.6)] dark:text-[rgba(235,235,245,0.6)]">
                        {localRecordingActive || bufferedClipCount > 0
                          ? `${bufferedClipCount} clip${bufferedClipCount === 1 ? '' : 's'} (${formatDuration(bufferedDurationSecs)}) buffered on SD card`
                          : 'Available when a connection drop is detected'}
                      </p>
                    </div>
                  </div>

                  {/* Download progress bar */}
                  {downloadState === 'downloading' && (
                    <div className="mt-3">
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-[12px] font-medium text-[rgba(60,60,67,0.7)] dark:text-[rgba(235,235,245,0.7)]">
                          Downloading…
                        </span>
                        <span className="text-[12px] font-semibold text-warning">{downloadProgress}%</span>
                      </div>
                      <div className="h-[5px] overflow-hidden rounded-full bg-[rgba(120,120,128,0.16)] dark:bg-[rgba(120,120,128,0.32)]">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${downloadProgress}%` }}
                          transition={{ duration: 0.2, ease: 'easeOut' }}
                          className="h-full rounded-full bg-warning"
                        />
                      </div>
                    </div>
                  )}

                  {/* Success state */}
                  {downloadState === 'success' && (
                    <div className="mt-3 flex items-center gap-2 text-[13px] font-medium text-safe">
                      <Pill tone="green" dot size="sm">
                        Saved
                      </Pill>
                      <span>Clip saved to device storage</span>
                    </div>
                  )}

                  {/* Action button */}
                  <button
                    type="button"
                    onClick={() => {
                      void downloadBufferedClip();
                    }}
                    disabled={
                      downloadState === 'downloading' ||
                      (bufferedClipCount === 0 && !localRecordingActive)
                    }
                    className={`press-spring mt-3 flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-[15px] font-semibold transition-all duration-200 ${
                      downloadState === 'downloading'
                        ? 'bg-[rgba(120,120,128,0.12)] text-[rgba(60,60,67,0.55)] dark:bg-[rgba(120,120,128,0.24)] dark:text-[rgba(235,235,245,0.55)]'
                        : localRecordingActive || bufferedClipCount > 0
                        ? 'bg-warning text-white active:brightness-105 active:shadow-[0_0_0_3px_rgba(255,159,10,0.3)]'
                        : 'bg-[rgba(120,120,128,0.12)] text-[rgba(60,60,67,0.55)] dark:bg-[rgba(120,120,128,0.24)] dark:text-[rgba(235,235,245,0.55)]'
                    }`}
                  >
                    {downloadState === 'downloading' ? (
                      <>
                        <RefreshCwIcon size={16} className="animate-spin" />
                        Downloading…
                      </>
                    ) : downloadState === 'success' ? (
                      <>
                        <DownloadIcon size={16} />
                        Saved
                      </>
                    ) : (
                      <>
                        <DownloadIcon size={16} />
                        Download Buffered Clip
                      </>
                    )}
                  </button>
                </div>
              </Card>
            </motion.section>

            {/* Hardware Status */}
            <motion.section
              aria-label="Hardware diagnostics"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
            >
              <SectionLabel>Hardware Status</SectionLabel>
              <GroupedList>
                {[connectionRow, ...diagnostics].map((d) => (
                  <div key={d.id} className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[16px] font-medium text-black dark:text-white">
                          {d.label}
                        </p>
                        <p className="mt-0.5 text-[13px] leading-snug text-[rgba(60,60,67,0.6)] dark:text-[rgba(235,235,245,0.6)]">
                          {d.detail}
                        </p>
                      </div>
                      <Pill
                        tone={d.state === 'ok' ? 'green' : d.state === 'warn' ? 'amber' : 'red'}
                        dot
                        glow={d.state === 'ok'}
                      >
                        {d.value}
                      </Pill>
                    </div>
                    {typeof d.meter === 'number' ? (
                      <div className="mt-2.5 h-[4px] overflow-hidden rounded-full bg-[rgba(120,120,128,0.16)] dark:bg-[rgba(120,120,128,0.32)]">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${d.meter}%` }}
                          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                          className={`h-full rounded-full ${
                            d.meter >= 80
                              ? 'bg-emergency'
                              : d.meter >= 60
                              ? 'bg-warning'
                              : 'bg-safe'
                          }`}
                        />
                      </div>
                    ) : null}
                  </div>
                ))}
              </GroupedList>
            </motion.section>

            {/* Maintenance */}
            <motion.section
              aria-label="Maintenance"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.14, ease: [0.23, 1, 0.32, 1] }}
            >
              <SectionLabel>Maintenance</SectionLabel>
              <GroupedList>
                {connectionState !== 'connected' ? (
                  <Row
                    icon={
                      <RefreshCwIcon
                        size={19}
                        className={`text-safe ${connectionState === 'reconnecting' ? 'animate-spin' : ''}`}
                      />
                    }
                    title={
                      connectionState === 'reconnecting'
                        ? 'Reconnecting to Pi 5…'
                        : 'Try to reconnect now'
                    }
                    subtitle={
                      connectionState === 'reconnecting'
                        ? 'Retrying heartbeat — buffered clips will sync once online'
                        : 'Last connection lost · buffered footage held on SD card'
                    }
                    right={
                      connectionState === 'reconnecting' ? null : (
                        <span className="text-[15px] font-medium text-safe">Retry</span>
                      )
                    }
                    onClick={connectionState === 'reconnecting' ? undefined : startLocalRecording}
                  />
                ) : localRecordingActive || bufferedClipCount > 0 ? (
                  <Row
                    icon={<CloudUploadIcon size={19} className="text-safe" />}
                    title="Sync buffered clips to vault"
                    subtitle={
                      lastSyncTime
                        ? `Last synced ${formatTimeAgo(lastSyncTime)} · ${bufferedClipCount} clip${
                            bufferedClipCount === 1 ? '' : 's'
                          } (${formatDuration(bufferedDurationSecs)}) ready`
                        : `${bufferedClipCount} clip${bufferedClipCount === 1 ? '' : 's'} (${formatDuration(
                            bufferedDurationSecs,
                          )}) ready to upload`
                    }
                    right={<span className="text-[15px] font-medium text-safe">Sync</span>}
                    onClick={syncBufferedClips}
                  />
                ) : null}

                <Row
                  title="Run full self-test"
                  subtitle={
                    selfTestState === 'running'
                      ? 'Running diagnostics on Pi 5…'
                      : selfTestState === 'passed'
                      ? 'Last run just now — all critical checks passed'
                      : selfTestState === 'failed'
                      ? 'Last run failed — see diagnostics above'
                      : 'Last run today, 06:12 — all critical checks passed'
                  }
                  right={
                    selfTestState === 'running' ? (
                      <RefreshCwIcon size={17} className="animate-spin text-safe" />
                    ) : (
                      <span className="text-[15px] font-medium text-safe">Run</span>
                    )
                  }
                  onClick={handleRunSelfTest}
                />

                <Row
                  title="Offload evidence clips"
                  subtitle={
                    offloadState === 'uploading'
                      ? 'Uploading 12 clips to operator vault…'
                      : '12 clips pending upload to the operator vault'
                  }
                  right={
                    offloadState === 'uploading' ? (
                      <RefreshCwIcon size={17} className="animate-spin text-safe" />
                    ) : (
                      <span className="text-[15px] font-medium text-safe">Upload</span>
                    )
                  }
                  onClick={handleOffload}
                />
              </GroupedList>
            </motion.section>
          </>
        )}
      </div>
    </PhoneFrame>
  );
}

interface DiagnosticRowLike {
  id: string;
  label: string;
  detail: string;
  value: string;
  state: 'ok' | 'warn' | 'fail';
  meter?: number;
}

function formatDuration(totalSecs: number): string {
  const m = Math.floor(totalSecs / 60);
  const s = totalSecs % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function formatTimeAgo(ts: number): string {
  const diff = Math.max(0, Math.floor((Date.now() - ts) / 1000));
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}
