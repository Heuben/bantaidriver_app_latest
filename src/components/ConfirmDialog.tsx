import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const EASE = [0.23, 1, 0.32, 1] as const;

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel = 'Cancel',
  destructive,
  onConfirm,
  onCancel









}: {open: boolean;title: string;message: string;confirmLabel: string;cancelLabel?: string;destructive?: boolean;onConfirm: () => void;onCancel: () => void;}) {
  return (
    <AnimatePresence>
      {open ?
      <motion.div
        className="pointer-events-auto absolute inset-0 z-50 flex items-center justify-center px-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.16, ease: EASE }}>
        
          <button
          type="button"
          aria-label={cancelLabel}
          onClick={onCancel}
          className="absolute inset-0 bg-black/30" />
        
          <motion.div
          role="alertdialog"
          aria-label={title}
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.98, opacity: 0 }}
          transition={{ duration: 0.18, ease: EASE }}
          className="relative w-[270px] overflow-hidden rounded-[14px] bg-white/95 backdrop-blur-xl dark:bg-[#2C2C2E]/95">
          
            <div className="px-4 pb-4 pt-5 text-center">
              <h2 className="text-[17px] font-semibold text-black dark:text-white">{title}</h2>
              <p className="mt-1 text-[13px] leading-snug text-[rgba(60,60,67,0.75)] dark:text-[rgba(235,235,245,0.7)]">
                {message}
              </p>
            </div>
            <div className="flex border-t border-[rgba(60,60,67,0.2)] dark:border-[rgba(84,84,88,0.6)]">
              <button
              type="button"
              onClick={onCancel}
              className="flex-1 border-r border-[rgba(60,60,67,0.2)] py-[11px] text-[17px] text-safe transition-colors duration-150 ease-ios active:bg-black/[0.05] dark:border-[rgba(84,84,88,0.6)] dark:active:bg-white/[0.08]">
              
                {cancelLabel}
              </button>
              <button
              type="button"
              onClick={onConfirm}
              className={`flex-1 py-[11px] text-[17px] font-semibold transition-colors duration-150 ease-ios active:bg-black/[0.05] dark:active:bg-white/[0.08] ${
              destructive ? 'text-emergency' : 'text-safe'}`
              }>
              
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div> :
      null}
    </AnimatePresence>);

}

export function Toast({ open, message }: {open: boolean;message: string;}) {
  return (
    <AnimatePresence>
      {open ?
      <motion.div
        initial={{ y: -12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -8, opacity: 0 }}
        transition={{ duration: 0.22, ease: EASE }}
        role="status"
        className="pointer-events-none absolute inset-x-0 top-[62px] z-50 flex justify-center">
        
          <span className="rounded-full bg-black/85 px-4 py-2 text-[13px] font-semibold text-white backdrop-blur-md dark:bg-white/90 dark:text-black">
            {message}
          </span>
        </motion.div> :
      null}
    </AnimatePresence>);

}