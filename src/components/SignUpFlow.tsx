import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckIcon, ChevronLeftIcon } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { bloodTypes, providers } from '../data/app';
import { Segmented } from './ui';

type Step = 1 | 2;

const EASE = [0.23, 1, 0.32, 1] as const;

export function SignUpFlow({ onBackToSignIn }: {onBackToSignIn: () => void;}) {
  const { registerRider } = useApp();
  const [step, setStep] = useState<Step>(1);
  const [agreed, setAgreed] = useState(false);

  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [provider, setProvider] = useState(providers[0]);
  const [plate, setPlate] = useState('');
  const [motorcycle, setMotorcycle] = useState('');
  const [bodyColor, setBodyColor] = useState('');
  const [bloodType, setBloodType] = useState('O+');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');

  const stepOneValid =
  name.trim().length > 2 && mobile.trim().length >= 10 && email.includes('@') && password.length >= 6;
  const stepTwoValid =
  plate.trim().length >= 5 && motorcycle.trim().length > 2 && emergencyPhone.trim().length >= 10 && agreed;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (stepOneValid) setStep(2);
      return;
    }
    if (!stepTwoValid) return;
    registerRider({
      name: name.trim(),
      callSign: `${provider.slice(0, 3).toUpperCase()}-${plate.replace(/\D/g, '').slice(0, 4) || '0000'}`,
      mobile: mobile.trim(),
      email: email.trim(),
      provider,
      plate: plate.toUpperCase(),
      motorcycle: motorcycle.trim(),
      bodyColor: bodyColor.trim(),
      bloodType,
      emergencyName: emergencyName.trim(),
      emergencyPhone: emergencyPhone.trim()
    });
  };

  return (
    <div className="flex min-h-[740px] flex-col px-6 pb-2 pt-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => step === 1 ? onBackToSignIn() : setStep(1)}
          className="flex items-center gap-0.5 text-[15px] font-medium text-safe">
          
          <ChevronLeftIcon size={19} />
          {step === 1 ? 'Sign In' : 'Back'}
        </button>
        <span className="ml-auto text-[13px] font-semibold text-[rgba(60,60,67,0.6)] dark:text-[rgba(235,235,245,0.6)]">
          Step {step} of 2
        </span>
      </div>

      <div className="mt-3 h-[4px] overflow-hidden rounded-full bg-[rgba(120,120,128,0.18)] dark:bg-[rgba(120,120,128,0.34)]">
        <motion.div
          className="h-full rounded-full bg-safe"
          animate={{ width: step === 1 ? '50%' : '100%' }}
          transition={{ duration: 0.28, ease: EASE }} />
        
      </div>

      <h1 className="mt-6 text-[28px] font-bold leading-tight tracking-[-0.02em] text-black dark:text-white">
        {step === 1 ? 'Create your rider account' : 'Vehicle & safety info'}
      </h1>
      <p className="mt-1.5 text-[15px] leading-snug text-[rgba(60,60,67,0.6)] dark:text-[rgba(235,235,245,0.6)]">
        {step === 1 ?
        'Responders use these details to identify and reach you after a crash.' :
        'Your plate, bike, and blood type are read aloud to responders the moment an SOS fires.'}
      </p>

      <form onSubmit={submit} className="mt-6 flex flex-1 flex-col">
        {step === 1 ?
        <div className="space-y-5">
            <FieldGroup label="Personal">
              <Field label="Full name" value={name} onChange={setName} placeholder="Juan Dela Cruz" autoFocus />
              <Field
              label="Mobile no."
              value={mobile}
              onChange={setMobile}
              placeholder="+63 917 000 0000"
              type="tel" />
            
            </FieldGroup>

            <FieldGroup label="Login">
              <Field label="Email" value={email} onChange={setEmail} placeholder="rider@email.com" type="email" />
              <Field
              label="Password"
              value={password}
              onChange={setPassword}
              placeholder="At least 6 characters"
              type="password" />
            
            </FieldGroup>
          </div> :

        <div className="space-y-5">
            <FieldGroup label="Service provider">
              <div className="px-4 py-3">
                <Segmented
                ariaLabel="Service provider"
                value={provider}
                onChange={setProvider}
                options={providers.map((p) => ({ value: p, label: p }))} />
              
              </div>
            </FieldGroup>

            <FieldGroup label="Vehicle">
              <Field label="Plate no." value={plate} onChange={(v) => setPlate(v.toUpperCase())} placeholder="NCB 4471" />
              <Field
              label="Motorcycle"
              value={motorcycle}
              onChange={setMotorcycle}
              placeholder="Honda Click 160" />
            
              <Field label="Body color" value={bodyColor} onChange={setBodyColor} placeholder="Matte black" />
            </FieldGroup>

            <FieldGroup label="Medical & emergency contact">
              <div className="flex items-center gap-3 px-4 py-3">
                <span className="w-[104px] shrink-0 text-[15px] text-[rgba(60,60,67,0.6)] dark:text-[rgba(235,235,245,0.6)]">
                  Blood type
                </span>
                <select
                value={bloodType}
                onChange={(e) => setBloodType(e.target.value)}
                aria-label="Blood type"
                className="ml-auto rounded-[8px] bg-[rgba(120,120,128,0.12)] px-2.5 py-1.5 text-[15px] font-medium text-black outline-none dark:bg-[rgba(120,120,128,0.3)] dark:text-white">
                
                  {bloodTypes.map((b) =>
                <option key={b}>{b}</option>
                )}
                </select>
              </div>
              <Field
              label="Contact name"
              value={emergencyName}
              onChange={setEmergencyName}
              placeholder="Spouse, parent, or operator" />
            
              <Field
              label="Contact no."
              value={emergencyPhone}
              onChange={setEmergencyPhone}
              placeholder="+63 917 000 0000"
              type="tel" />
            
            </FieldGroup>

            <button
            type="button"
            onClick={() => setAgreed((a) => !a)}
            className="flex w-full items-start gap-3 px-1 text-left">
            
              <span
              className={`mt-0.5 flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border transition-colors duration-150 ease-ios ${
              agreed ?
              'border-safe bg-safe text-white' :
              'border-[rgba(60,60,67,0.3)] dark:border-[rgba(235,235,245,0.35)]'}`
              }>
              
                {agreed ? <CheckIcon size={14} strokeWidth={3} /> : null}
              </span>
              <span className="text-[13px] leading-snug text-[rgba(60,60,67,0.7)] dark:text-[rgba(235,235,245,0.7)]">
                I allow B.A.N.T.A.I. to share my location, plate, and blood type with LGU responders
                and nearby riders during a verified emergency.
              </span>
            </button>
          </div>
        }

        <div className="mt-8 pb-2">
          <button
            type="submit"
            disabled={step === 1 ? !stepOneValid : !stepTwoValid}
            className="w-full rounded-[14px] bg-safe py-[13px] text-[17px] font-semibold text-white transition-transform duration-150 ease-ios active:scale-[0.98] disabled:opacity-40">
            
            {step === 1 ? 'Continue' : 'Create Account'}
          </button>
          <p className="mt-3 text-center text-[12px] text-[rgba(60,60,67,0.5)] dark:text-[rgba(235,235,245,0.45)]">
            {step === 1 ?
            'Next: vehicle and emergency details' :
            'You can edit all of this later in Profile.'}
          </p>
        </div>
      </form>
    </div>);

}

function FieldGroup({ label, children }: {label: string;children: React.ReactNode;}) {
  return (
    <section>
      <h2 className="px-4 pb-2 text-[13px] font-semibold uppercase tracking-[0.06em] text-[rgba(60,60,67,0.6)] dark:text-[rgba(235,235,245,0.6)]">
        {label}
      </h2>
      <div className="overflow-hidden rounded-ios bg-white dark:bg-[#1C1C1E]">
        <div className="divide-y divide-[rgba(60,60,67,0.15)] dark:divide-[rgba(84,84,88,0.45)]">
          {children}
        </div>
      </div>
    </section>);

}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  autoFocus







}: {label: string;value: string;onChange: (v: string) => void;placeholder?: string;type?: string;autoFocus?: boolean;}) {
  return (
    <label className="flex items-center gap-3 px-4 py-3">
      <span className="w-[104px] shrink-0 text-[15px] text-[rgba(60,60,67,0.6)] dark:text-[rgba(235,235,245,0.6)]">
        {label}
      </span>
      <input
        type={type}
        value={value}
        autoFocus={autoFocus}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-[16px] text-black outline-none placeholder:text-[rgba(60,60,67,0.35)] dark:text-white dark:placeholder:text-[rgba(235,235,245,0.3)]" />
      
    </label>);

}