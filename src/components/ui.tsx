import React from 'react';

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="px-4 pb-2 pt-1 text-[12px] font-semibold uppercase tracking-[0.08em] text-[rgba(60,60,67,0.55)] dark:text-[rgba(235,235,245,0.55)]">
      {children}
    </h2>
  );
}

export function Card({
  children,
  className = '',
  as: Tag = 'div',
  glass = false,
  elevated = false,
}: {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'section';
  glass?: boolean;
  elevated?: boolean;
}) {
  const base = glass
    ? 'glass glass-edge'
    : 'bg-white/95 dark:bg-[#1C1C1E]/90 border border-[rgba(60,60,67,0.06)] dark:border-[rgba(255,255,255,0.06)]';
  const shadow = elevated
    ? 'shadow-glass-lg dark:shadow-glass-dark-lg'
    : 'shadow-glass dark:shadow-glass-dark';
  return (
    <Tag
      className={`rounded-2xl ${base} ${shadow} transition-shadow duration-200 ease-ios ${className}`}
    >
      {children}
    </Tag>
  );
}

export function GroupedList({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[rgba(60,60,67,0.06)] bg-white/95 shadow-glass dark:border-[rgba(255,255,255,0.06)] dark:bg-[#1C1C1E]/85 dark:shadow-glass-dark">
      <div className="divide-y divide-[rgba(60,60,67,0.08)] dark:divide-[rgba(255,255,255,0.06)]">
        {children}
      </div>
    </div>
  );
}

export function Row({
  icon,
  title,
  subtitle,
  right,
  onClick,
  danger,
}: {
  icon?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  right?: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
}) {
  const inner = (
    <div className="flex w-full items-center gap-3 px-4 py-3 text-left">
      {icon ? <div className="shrink-0">{icon}</div> : null}
      <div className="min-w-0 flex-1">
        <p
          className={`truncate text-[16px] font-medium tracking-[-0.005em] ${
            danger ? 'text-emergency' : 'text-black dark:text-white'
          }`}
        >
          {title}
        </p>
        {subtitle ? (
          <p className="mt-0.5 text-[13px] leading-snug text-[rgba(60,60,67,0.6)] dark:text-[rgba(235,235,245,0.6)]">
            {subtitle}
          </p>
        ) : null}
      </div>
      {right ? <div className="shrink-0">{right}</div> : null}
    </div>
  );

  if (!onClick) return inner;
  return (
    <button
      type="button"
      onClick={onClick}
      className="press-spring w-full transition-colors duration-200 ease-ios hover:bg-black/[0.03] active:bg-black/[0.06] dark:hover:bg-white/[0.04] dark:active:bg-white/[0.08]"
    >
      {inner}
    </button>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
  tone = 'green',
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  tone?: 'green' | 'neutral';
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-[31px] w-[51px] shrink-0 rounded-full transition-colors duration-300 ease-spring focus:outline-none focus-visible:ring-2 focus-visible:ring-safe focus-visible:ring-offset-2 dark:focus-visible:ring-offset-black ${
        checked
          ? tone === 'green'
            ? 'bg-safe shadow-safe-glow'
            : 'bg-accent shadow-accent-glow'
          : 'bg-[rgba(120,120,128,0.22)] dark:bg-[rgba(120,120,128,0.4)]'
      }`}
    >
      <span
        className={`absolute left-0 top-[2px] h-[27px] w-[27px] rounded-full bg-white shadow-[0_2px_6px_rgba(0,0,0,0.25),0_0_0_0.5px_rgba(0,0,0,0.04)] transition-transform duration-300 ease-spring ${
          checked ? 'translate-x-[22px]' : 'translate-x-[2px]'
        }`}
      />
    </button>
  );
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  ariaLabel: string;
}) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className="relative flex gap-0.5 rounded-[10px] border border-[rgba(60,60,67,0.06)] bg-[rgba(120,120,128,0.10)] p-[3px] dark:border-[rgba(255,255,255,0.05)] dark:bg-[rgba(120,120,128,0.18)]"
    >
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            role="tab"
            aria-selected={active}
            type="button"
            onClick={() => onChange(o.value)}
            className={`relative z-10 flex-1 rounded-[8px] px-3 py-[6px] text-[13px] font-semibold transition-colors duration-200 ease-ios press-spring ${
              active
                ? 'bg-white text-black shadow-[0_1px_3px_rgba(0,0,0,0.12),0_0_0_0.5px_rgba(0,0,0,0.04)] dark:bg-[#3A3A3C] dark:text-white'
                : 'text-[rgba(60,60,67,0.65)] dark:text-[rgba(235,235,245,0.65)]'
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export function Pill({
  children,
  tone = 'neutral',
  dot,
  size,
  glow,
}: {
  children: React.ReactNode;
  tone?: 'green' | 'red' | 'amber' | 'neutral';
  dot?: boolean;
  size?: 'sm' | 'md';
  glow?: boolean;
}) {
  const tones = {
    green: 'bg-safe/15 text-[#248A3D] dark:bg-safe/25 dark:text-safe',
    red: 'bg-emergency/15 text-[#C4271E] dark:bg-emergency/25 dark:text-emergency',
    amber:
      'bg-warning/15 text-[#9A5A00] dark:bg-warning/25 dark:text-[#FFB340]',
    neutral:
      'bg-[rgba(120,120,128,0.12)] text-[rgba(60,60,67,0.75)] dark:bg-[rgba(120,120,128,0.28)] dark:text-[rgba(235,235,245,0.75)]',
  };
  const dotColor = {
    green: 'bg-safe',
    red: 'bg-emergency',
    amber: 'bg-warning',
    neutral: 'bg-current',
  };
  const glowShadow = {
    green: 'shadow-[0_0_0_1px_rgba(52,199,89,0.18),0_4px_12px_-4px_rgba(52,199,89,0.4)]',
    red: 'shadow-[0_0_0_1px_rgba(255,59,48,0.18),0_4px_12px_-4px_rgba(255,59,48,0.5)]',
    amber: 'shadow-[0_0_0_1px_rgba(255,159,10,0.22),0_4px_12px_-4px_rgba(255,159,10,0.5)]',
    neutral: '',
  }[tone];
  const sizing =
    size === 'sm' ? 'px-2 py-[3px] text-[11px]' : 'px-2.5 py-[5px] text-[12px]';
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold backdrop-blur-sm ${sizing} ${tones[tone]} ${
        glow ? glowShadow : ''
      }`}
    >
      {dot ? (
        <span className="relative inline-flex">
          <span
            className={`h-[6px] w-[6px] rounded-full ${dotColor[tone]} ${
              tone === 'amber' || tone === 'red' ? 'animate-pulse' : ''
            }`}
          />
          {tone === 'green' || tone === 'red' ? (
            <span
              className={`absolute inset-0 h-[6px] w-[6px] rounded-full ${dotColor[tone]} opacity-50 animate-ping`}
            />
          ) : null}
        </span>
      ) : null}
      {children}
    </span>
  );
}

export function Avatar({
  initials,
  tone = 'neutral',
  size = 40,
}: {
  initials: string;
  tone?: 'green' | 'red' | 'neutral';
  size?: number;
}) {
  const tones = {
    green: 'bg-safe text-white shadow-safe-glow',
    red: 'bg-emergency text-white shadow-emergency-glow',
    neutral:
      'bg-[rgba(120,120,128,0.18)] text-[rgba(60,60,67,0.8)] dark:bg-[rgba(120,120,128,0.34)] dark:text-white',
  };
  return (
    <span
      style={{ width: size, height: size, fontSize: size * 0.36 }}
      className={`inline-flex items-center justify-center rounded-full font-semibold transition-shadow duration-200 ease-ios ${tones[tone]}`}
    >
      {initials}
    </span>
  );
}
