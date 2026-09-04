import React, { useState } from 'react';
import { EyeIcon, EyeOffIcon, ShieldCheckIcon } from 'lucide-react';
import { PhoneFrame } from '../components/PhoneFrame';
import { SignUpFlow } from '../components/SignUpFlow';
import { useApp } from '../contexts/AppContext';

export function AuthScreen() {
  const { signIn } = useApp();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('jayson.ramos@angkas.ph');
  const [password, setPassword] = useState('bantai2026');
  const [showPassword, setShowPassword] = useState(false);

  if (mode === 'signup') {
    return (
      <PhoneFrame showChrome={false}>
        <SignUpFlow onBackToSignIn={() => setMode('signin')} />
      </PhoneFrame>);

  }

  return (
    <PhoneFrame showChrome={false}>
      <div className="flex min-h-[740px] flex-col px-6 pb-2 pt-10">
        <div className="flex flex-col items-center text-center">
          <span className="flex h-[68px] w-[68px] items-center justify-center rounded-[20px] bg-safe">
            <ShieldCheckIcon size={34} className="text-white" strokeWidth={2.2} />
          </span>
          <h1 className="mt-5 text-[30px] font-bold tracking-[-0.02em] text-black dark:text-white">
            B.A.N.T.A.I. Driver
          </h1>
          <p className="mt-1.5 max-w-[280px] text-[15px] leading-snug text-[rgba(60,60,67,0.6)] dark:text-[rgba(235,235,245,0.6)]">
            AI crash detection and rescue dispatch for motorcycle taxi riders.
          </p>
        </div>

        <div className="mt-8 overflow-hidden rounded-ios bg-white dark:bg-[#1C1C1E]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              signIn();
            }}>
            
            <div className="divide-y divide-[rgba(60,60,67,0.15)] dark:divide-[rgba(84,84,88,0.45)]">
              <label className="flex items-center gap-3 px-4 py-3">
                <span className="w-[76px] shrink-0 text-[15px] text-[rgba(60,60,67,0.6)] dark:text-[rgba(235,235,245,0.6)]">
                  Email
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent text-[16px] text-black outline-none placeholder:text-[rgba(60,60,67,0.35)] dark:text-white"
                  placeholder="rider@email.com" />
                
              </label>
              <label className="flex items-center gap-3 px-4 py-3">
                <span className="w-[76px] shrink-0 text-[15px] text-[rgba(60,60,67,0.6)] dark:text-[rgba(235,235,245,0.6)]">
                  Password
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent text-[16px] text-black outline-none dark:text-white"
                  placeholder="••••••••" />
                
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="shrink-0 text-[rgba(60,60,67,0.5)] dark:text-[rgba(235,235,245,0.5)]">
                  
                  {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                </button>
              </label>
            </div>
            <div className="p-4 pt-3.5">
              <button
                type="submit"
                className="w-full rounded-[14px] bg-safe py-[13px] text-[17px] font-semibold text-white transition-transform duration-150 ease-ios active:scale-[0.98]">
                
                Sign In
              </button>
              <button
                type="button"
                className="mt-3 w-full text-center text-[14px] font-medium text-safe">
                
                Forgot password?
              </button>
            </div>
          </form>
        </div>

        <div className="my-6 flex items-center gap-3">
          <span className="h-px flex-1 bg-[rgba(60,60,67,0.18)] dark:bg-[rgba(84,84,88,0.5)]" />
          <span className="text-[13px] text-[rgba(60,60,67,0.55)] dark:text-[rgba(235,235,245,0.55)]">
            or continue with
          </span>
          <span className="h-px flex-1 bg-[rgba(60,60,67,0.18)] dark:bg-[rgba(84,84,88,0.5)]" />
        </div>

        <div className="space-y-2.5">
          <button
            type="button"
            onClick={signIn}
            className="flex w-full items-center justify-center gap-2.5 rounded-[14px] bg-black py-[13px] text-[16px] font-semibold text-white transition-transform duration-150 ease-ios active:scale-[0.98] dark:bg-white dark:text-black">
            
            <AppleMark />
            Continue with Apple
          </button>
          <button
            type="button"
            onClick={signIn}
            className="flex w-full items-center justify-center gap-2.5 rounded-[14px] bg-white py-[13px] text-[16px] font-semibold text-black ring-1 ring-[rgba(60,60,67,0.18)] transition-transform duration-150 ease-ios active:scale-[0.98] dark:bg-[#1C1C1E] dark:text-white dark:ring-[rgba(84,84,88,0.6)]">
            
            <GoogleMark />
            Continue with Google
          </button>
        </div>

        <div className="mt-auto pt-8">
          <button
            type="button"
            onClick={() => setMode('signup')}
            className="w-full rounded-[14px] border border-safe/40 py-[12px] text-[16px] font-semibold text-safe transition-colors duration-150 ease-ios hover:bg-safe/5 active:bg-safe/10">
            
            New rider? Create an account
          </button>
          <p className="pt-3 text-center text-[12px] leading-relaxed text-[rgba(60,60,67,0.5)] dark:text-[rgba(235,235,245,0.45)]">
            By continuing you allow B.A.N.T.A.I. to share your live location with LGU responders
            during a verified emergency.
          </p>
        </div>
      </div>
    </PhoneFrame>);

}

function AppleMark() {
  return (
    <svg width="17" height="20" viewBox="0 0 17 20" aria-hidden="true" className="fill-current">
      <path d="M14.06 10.6c-.02-2.2 1.8-3.26 1.88-3.31-1.02-1.5-2.62-1.7-3.19-1.72-1.36-.14-2.65.8-3.34.8-.69 0-1.75-.78-2.87-.76-1.48.02-2.84.86-3.6 2.18-1.53 2.66-.39 6.6 1.1 8.76.73 1.06 1.6 2.25 2.74 2.2 1.1-.04 1.52-.71 2.85-.71 1.33 0 1.7.71 2.87.69 1.18-.02 1.93-1.08 2.65-2.14.84-1.23 1.18-2.42 1.2-2.48-.03-.01-2.28-.88-2.3-3.5ZM11.9 3.86c.6-.74 1.01-1.76.9-2.78-.87.04-1.93.58-2.56 1.31-.56.65-1.05 1.7-.92 2.7.97.08 1.96-.5 2.58-1.23Z" />
    </svg>);

}

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z" />
      
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.94v2.33A9 9 0 0 0 9 18Z" />
      
      <path
        fill="#FBBC05"
        d="M3.97 10.72a5.4 5.4 0 0 1 0-3.44V4.95H.94a9 9 0 0 0 0 8.1l3.03-2.33Z" />
      
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.9 11.43 0 9 0A9 9 0 0 0 .94 4.95l3.03 2.33C4.68 5.16 6.66 3.58 9 3.58Z" />
      
    </svg>);

}