import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheckIcon } from 'lucide-react';
import { PhoneFrame } from './PhoneFrame';

const EASE = [0.23, 1, 0.32, 1] as const;

export function SplashScreen({ onDone }: {onDone: () => void;}) {
  useEffect(() => {
    const t = window.setTimeout(onDone, 1000);
    return () => window.clearTimeout(t);
  }, [onDone]);

  return (
    <PhoneFrame showChrome={false}>
      <div className="flex min-h-[760px] flex-col items-center justify-center px-10">
        <motion.div
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, ease: EASE }}
          className="relative flex h-[92px] w-[92px] items-center justify-center rounded-[26px] bg-safe">
          
          <motion.span
            className="absolute inset-0 rounded-[26px] bg-safe"
            animate={{ scale: [1, 1.35], opacity: [0.35, 0] }}
            transition={{ duration: 1, repeat: Infinity, ease: 'easeOut' }} />
          
          <motion.span
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.24, delay: 0.06, ease: EASE }}
            className="relative">
            
            <ShieldCheckIcon size={46} className="text-white" strokeWidth={2.2} />
          </motion.span>
        </motion.div>

        <motion.h1
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.26, delay: 0.12, ease: EASE }}
          className="mt-6 text-[26px] font-bold tracking-[-0.02em] text-black dark:text-white">
          
          B.A.N.T.A.I.
        </motion.h1>
        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.26, delay: 0.2, ease: EASE }}
          className="mt-1 text-center text-[14px] font-medium text-[rgba(60,60,67,0.6)] dark:text-[rgba(235,235,245,0.6)]">
          
          Rider crash detection &amp; rescue
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.24, ease: EASE }}
          className="mt-9 h-[3px] w-[132px] overflow-hidden rounded-full bg-[rgba(120,120,128,0.2)] dark:bg-[rgba(120,120,128,0.34)]">
          
          <motion.span
            className="block h-full rounded-full bg-safe"
            initial={{ width: '8%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 0.7, delay: 0.24, ease: EASE }} />
          
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.3, ease: EASE }}
          className="absolute bottom-16 text-[12px] font-medium text-[rgba(60,60,67,0.5)] dark:text-[rgba(235,235,245,0.45)]">
          
          Connecting to Pi 5 unit · MDRRMO network
        </motion.p>
      </div>
    </PhoneFrame>);

}