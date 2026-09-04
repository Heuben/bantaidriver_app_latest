import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { TriangleAlertIcon } from 'lucide-react';

const HOLD_MS = 1600;

export function HoldForSos({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const raf = useRef<number | null>(null);
  const start = useRef(0);
  const [active, setActive] = useState(false);

  const stop = useCallback(() => {
    if (raf.current !== null) cancelAnimationFrame(raf.current);
    raf.current = null;
    setProgress(0);
    setActive(false);
  }, []);

  useEffect(() => () => stop(), [stop]);

  const tick = useCallback(() => {
    const p = Math.min(1, (performance.now() - start.current) / HOLD_MS);
    setProgress(p);
    if (p >= 1) {
      stop();
      onComplete();
      return;
    }
    raf.current = requestAnimationFrame(tick);
  }, [onComplete, stop]);

  const begin = useCallback(() => {
    start.current = performance.now();
    setActive(true);
    raf.current = requestAnimationFrame(tick);
  }, [tick]);

  return (
    <div className="relative w-full">
      {/* Outer pulsing ring — shows only while holding */}
      {active && progress > 0 && (
        <motion.div
          className="absolute -inset-3 rounded-2xl border-2 border-emergency/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.6, 0, 0.6], scale: [1, 1.04, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          style={{ pointerEvents: 'none' }}
        />
      )}
      <button
        type="button"
        onPointerDown={begin}
        onPointerUp={stop}
        onPointerLeave={stop}
        onPointerCancel={stop}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') onComplete();
        }}
        aria-label="Hold for manual SOS"
        className="press-spring relative w-full overflow-hidden rounded-2xl bg-emergency py-[17px] shadow-emergency-glow transition-shadow duration-200 active:shadow-[0_0_0_3px_rgba(255,59,48,0.25)] active:brightness-105"
      >
        {/* Fill progress */}
        <motion.span
          aria-hidden="true"
          className="absolute inset-y-0 left-0 bg-white/20"
          style={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.05 }}
        />

        {/* Glow while active */}
        {active && (
          <motion.div
            aria-hidden="true"
            className="absolute inset-0 rounded-2xl"
            animate={{ boxShadow: ['inset 0 0 0px rgba(255,255,255,0)', 'inset 0 0 32px rgba(255,255,255,0.12)', 'inset 0 0 0px rgba(255,255,255,0)'] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
          />
        )}

        <span className="relative flex items-center justify-center gap-2 text-[17px] font-bold uppercase tracking-[0.04em] text-white">
          <TriangleAlertIcon size={20} strokeWidth={2.4} />
          {progress > 0 ? 'Keep holding…' : 'Hold for Manual SOS'}
        </span>
        <span className="relative mt-0.5 block text-[12px] font-medium text-white/80">
          {progress > 0
            ? `Dispatching in ${Math.ceil((1 - progress) * (HOLD_MS / 1000))}s`
            : 'Sends location, plate, and blood type to responders'}
        </span>
      </button>
    </div>
  );
}
