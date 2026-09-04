import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeftIcon } from 'lucide-react';

interface LegalSheetProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export function LegalSheet({ open, title, onClose, children }: LegalSheetProps) {
  // Lock body scroll while the sheet is open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="legal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          // position: absolute + inset:0 pins the backdrop to the phone frame so
          // nothing ever bleeds outside the device container.
          className="absolute inset-0 z-[100] flex items-stretch justify-center rounded-[44px] bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            key="legal-sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.32, ease: [0.23, 1, 0.32, 1] }}
            onClick={(e) => e.stopPropagation()}
            // left/right: 0 makes it fill the full phone width (390px); no max-w
            // constraint so it never overflow.
            className="absolute inset-x-0 bottom-0 top-[54px] overflow-hidden rounded-t-[24px] bg-ios-canvas shadow-2xl dark:bg-[#0C0C0E]"
          >
            <header className="sticky top-0 z-10 flex items-center justify-between border-b border-[rgba(60,60,67,0.15)] bg-ios-canvas px-4 pb-3 pt-4 dark:border-[rgba(84,84,88,0.45)] dark:bg-[#0C0C0E]">
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="flex items-center gap-0.5 text-[15px] font-medium text-safe"
              >
                <ChevronLeftIcon size={18} />
                Back
              </button>
              <h1 className="absolute left-1/2 -translate-x-1/2 text-[17px] font-semibold tracking-[-0.01em] text-black dark:text-white">
                {title}
              </h1>
              <span className="w-12" />
            </header>
            <div className="h-[calc(100%-56px)] overflow-y-auto px-5 py-4 text-[14px] leading-relaxed text-[rgba(60,60,67,0.85)] dark:text-[rgba(235,235,245,0.85)]">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export const PRIVACY_POLICY = (
  <>
    <p className="text-[12px] uppercase tracking-[0.08em] text-[rgba(60,60,67,0.55)] dark:text-[rgba(235,235,245,0.5)]">
      Last updated · January 2026
    </p>
    <h2 className="mt-4 text-[20px] font-bold tracking-[-0.01em] text-black dark:text-white">
      B.A.N.T.A.I. Driver Privacy Policy
    </h2>
    <p className="mt-3">
      B.A.N.T.A.I. Driver ("we", "our", or "us") is committed to protecting the
      privacy of every rider who installs the B.A.N.T.A.I. helmet hardware and
      companion mobile application. This policy describes what data we collect,
      how we use it, and the rights you have over your information.
    </p>

    <h3 className="mt-6 text-[16px] font-semibold text-black dark:text-white">
      1. Data we collect
    </h3>
    <ul className="ml-4 mt-2 list-disc space-y-1.5">
      <li>
        <strong>Account &amp; rider profile</strong> — name, call sign, mobile
        number, plate number, motorcycle, blood type, and emergency contact
        details you provide during sign-up.
      </li>
      <li>
        <strong>Helmet hardware telemetry</strong> — Pi 5 unit ID, front and
        rear camera status, SD card storage usage, and device battery level
        reported by the firmware.
      </li>
      <li>
        <strong>Trip &amp; crash data</strong> — GPS location during an active
        ride, accelerometer readings around a detected impact, and the
        resulting incident timeline shared with responders.
      </li>
      <li>
        <strong>Camera footage</strong> — continuous loop recordings and
        buffered offline footage stored first on the helmet's SD card, with
        flagged clips uploaded to the operator vault.
      </li>
    </ul>

    <h3 className="mt-6 text-[16px] font-semibold text-black dark:text-white">
      2. How we use your data
    </h3>
    <p className="mt-2">
      We process your data solely to (a) deliver crash detection and SOS
      response, (b) store camera evidence on the helmet's local SD card and
      sync flagged clips to the operator vault, (c) provide voice prompts
      over Bluetooth headsets, and (d) improve the safety features of the
      B.A.N.T.A.I. system. We do not sell rider data to advertisers or third
      parties.
    </p>

    <h3 className="mt-6 text-[16px] font-semibold text-black dark:text-white">
      3. Local helmet storage
    </h3>
    <p className="mt-2">
      All camera footage is recorded first to the SD card inside your helmet's
      Pi 5 enclosure. Continuous loop recordings are automatically deleted
      after 30 days unless flagged for an active incident. When the helmet
      loses network connection, the device buffers footage locally so no
      critical evidence is lost; once connectivity is restored, the
      buffered clips are uploaded to the operator vault and the local
      buffer is cleared.
    </p>

    <h3 className="mt-6 text-[16px] font-semibold text-black dark:text-white">
      4. Sharing with responders
    </h3>
    <p className="mt-2">
      When the SOS system is triggered, your live location, plate number,
      motorcycle description, and blood type are shared with the LGU
      responders dispatched to the incident. You can disable LGU data
      sharing at any time from Settings &rarr; Safety &amp; Policy, but doing
      so will limit the detail responders receive during an emergency.
    </p>

    <h3 className="mt-6 text-[16px] font-semibold text-black dark:text-white">
      5. Your rights
    </h3>
    <p className="mt-2">
      You may request a copy of the data we hold about you, ask us to delete
      your account, or revoke LGU data sharing by contacting
      privacy@bantai.driver. Account deletion permanently removes your rider
      profile and disconnects the paired Pi 5 device.
    </p>

    <h3 className="mt-6 text-[16px] font-semibold text-black dark:text-white">
      6. Contact
    </h3>
    <p className="mt-2">
      Questions about this policy can be sent to privacy@bantai.driver or
      via the in-app Help &amp; Support flow.
    </p>
  </>
);

export const TERMS_OF_SERVICE = (
  <>
    <p className="text-[12px] uppercase tracking-[0.08em] text-[rgba(60,60,67,0.55)] dark:text-[rgba(235,235,245,0.5)]">
      Last updated · January 2026
    </p>
    <h2 className="mt-4 text-[20px] font-bold tracking-[-0.01em] text-black dark:text-white">
      B.A.N.T.A.I. Driver Terms of Service
    </h2>
    <p className="mt-3">
      By installing the B.A.N.T.A.I. Driver mobile application and pairing
      it with the B.A.N.T.A.I. helmet hardware, you agree to the following
      terms.
    </p>

    <h3 className="mt-6 text-[16px] font-semibold text-black dark:text-white">
      1. Eligibility &amp; safe use
    </h3>
    <p className="mt-2">
      You must be a licensed motorcycle rider in your jurisdiction to use
      B.A.N.T.A.I. Driver. The app is a safety aid and does not replace
      attentive riding, defensive driving, or compliance with local traffic
      laws.
    </p>

    <h3 className="mt-6 text-[16px] font-semibold text-black dark:text-white">
      2. Hardware pairing
    </h3>
    <p className="mt-2">
      Each B.A.N.T.A.I. helmet enclosure contains a Raspberry Pi 5 unit
      with a unique identifier. Pairing a helmet links it to your rider
      account. Unpairing stops crash detection and clears locally stored
      encryption keys.
    </p>

    <h3 className="mt-6 text-[16px] font-semibold text-black dark:text-white">
      3. Camera footage &amp; local storage
    </h3>
    <p className="mt-2">
      The helmet's front and rear 180° cameras record continuously to the
      on-board SD card. When the connection between the helmet and your
      phone is lost, the device automatically buffers footage locally so
      that no critical evidence is lost. Buffered clips are uploaded to the
      operator vault once connectivity is restored. You may manually save
      buffered offline footage to your device storage at any time via the
      Device tab.
    </p>

    <h3 className="mt-6 text-[16px] font-semibold text-black dark:text-white">
      4. SOS &amp; emergency response
    </h3>
    <p className="mt-2">
      Triggering an SOS (manually or via automatic crash detection) shares
      your live location, plate number, motorcycle description, and blood
      type with LGU responders. False SOS activations may be subject to
      local penalties.
    </p>

    <h3 className="mt-6 text-[16px] font-semibold text-black dark:text-white">
      5. Acceptable use
    </h3>
    <ul className="ml-4 mt-2 list-disc space-y-1.5">
      <li>Do not tamper with the Pi 5 enclosure or remove the SD card.</li>
      <li>
        Do not use the app to record other riders or bystanders without
        their consent where consent is required by law.
      </li>
      <li>
        Do not attempt to disable crash detection while the helmet is in
        active use.
      </li>
    </ul>

    <h3 className="mt-6 text-[16px] font-semibold text-black dark:text-white">
      6. Limitation of liability
    </h3>
    <p className="mt-2">
      B.A.N.T.A.I. Driver is provided "as is" without warranties of
      uninterrupted service. We are not liable for damages resulting from
      network outages, missed crash detections, or delayed emergency
      response.
    </p>

    <h3 className="mt-6 text-[16px] font-semibold text-black dark:text-white">
      7. Changes to these terms
    </h3>
    <p className="mt-2">
      We may update these terms to reflect product changes. Material
      changes will be announced in-app and via the rider's registered
      mobile number.
    </p>
  </>
);
