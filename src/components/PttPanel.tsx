import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LockIcon, MicIcon, SendIcon, TriangleAlertIcon } from 'lucide-react';
import { Avatar, GroupedList, Pill, SectionLabel } from './ui';
import { useApp } from '../contexts/AppContext';
import { chatMessages, pttQueue } from '../data/app';

export function PttPanel() {
  const { sosActive } = useApp();
  const [queued, setQueued] = useState(false);
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState(chatMessages);

  const speaker = sosActive ? pttQueue[0] : pttQueue[1];
  const waiting = pttQueue.filter((m) => m.id !== speaker.id);

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const body = draft.trim();
    if (!body) return;
    setMessages((m) => [
    ...m,
    {
      id: `c${m.length + 1}`,
      callSign: 'ANG-2214',
      initials: 'JR',
      body,
      time: '14:34',
      kind: 'text'
    }]
    );
    setDraft('');
  };

  return (
    <div className="space-y-5 px-4">
      {sosActive ?
      <div className="flex items-start gap-3 rounded-ios bg-emergency px-4 py-3.5">
          <TriangleAlertIcon size={20} className="mt-0.5 shrink-0 text-white" strokeWidth={2.3} />
          <div>
            <p className="text-[15px] font-bold text-white">Priority Emergency Override</p>
            <p className="mt-0.5 text-[13px] leading-snug text-white/85">
              General chit-chat is muted. Only incident traffic and dispatch may key the channel.
            </p>
          </div>
        </div> :
      null}

      <section
        aria-label="Current speaker"
        className="rounded-ios bg-white px-4 py-5 text-center dark:bg-[#1C1C1E]">
        
        <div className="relative mx-auto w-fit">
          {sosActive ?
          <motion.span
            className="absolute -inset-2 rounded-full bg-emergency/15"
            animate={{ scale: [1, 1.12, 1], opacity: [0.7, 0.25, 0.7] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }} /> :

          null}
          <span className="relative block">
            <Avatar initials={speaker.initials} tone={sosActive ? 'red' : 'green'} size={72} />
          </span>
        </div>
        <p className="mt-3 text-[19px] font-bold tracking-[-0.01em] text-black dark:text-white">
          {speaker.callSign}
        </p>
        <p className="text-[13px] text-[rgba(60,60,67,0.6)] dark:text-[rgba(235,235,245,0.6)]">
          {speaker.name} · {speaker.provider} · speaking now
        </p>

        <button
          type="button"
          onClick={() => setQueued((q) => !q)}
          disabled={sosActive}
          className={`mt-4 flex w-full items-center justify-center gap-2 rounded-[14px] py-[13px] text-[16px] font-semibold transition-transform duration-150 ease-ios active:scale-[0.98] disabled:opacity-40 ${
          queued ?
          'bg-[rgba(120,120,128,0.14)] text-black dark:bg-[rgba(120,120,128,0.3)] dark:text-white' :
          'bg-safe text-white'}`
          }>
          
          {sosActive ?
          <LockIcon size={18} strokeWidth={2.3} /> :

          <MicIcon size={18} strokeWidth={2.3} />
          }
          {sosActive ? 'Channel locked by dispatch' : queued ? 'Queued — position 2' : 'Request Channel'}
        </button>
        <p className="mt-2 text-[12px] text-[rgba(60,60,67,0.55)] dark:text-[rgba(235,235,245,0.55)]">
          Token queue prevents two riders from talking over each other.
        </p>
      </section>

      <section aria-label="Talk queue">
        <SectionLabel>Talk Queue · {waiting.length} waiting</SectionLabel>
        <GroupedList>
          {waiting.map((m, i) =>
          <div key={m.id} className="flex items-center gap-3 px-4 py-2.5">
              <span className="w-[14px] shrink-0 text-[13px] font-semibold tabular-nums text-[rgba(60,60,67,0.5)] dark:text-[rgba(235,235,245,0.5)]">
                {i + 1}
              </span>
              <Avatar initials={m.initials} size={32} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-medium text-black dark:text-white">
                  {m.callSign}
                </p>
                <p className="truncate text-[12px] text-[rgba(60,60,67,0.6)] dark:text-[rgba(235,235,245,0.6)]">
                  {m.name} · {m.provider}
                </p>
              </div>
              {m.priority ? <Pill tone="red">Priority</Pill> : null}
            </div>
          )}
        </GroupedList>
      </section>

      <section aria-label="Text chat">
        <SectionLabel>Nearby Rider Chat</SectionLabel>
        <div className="space-y-2.5">
          {messages.map((m) =>
          m.kind === 'system' ?
          <p key={m.id} className="px-2 text-center text-[12px] font-semibold text-emergency">
                {m.body}
              </p> :

          <div key={m.id} className="flex items-start gap-2.5">
                <Avatar
              initials={m.initials}
              size={30}
              tone={m.callSign === 'RESCUE-1' ? 'red' : 'neutral'} />
            
                <div className="min-w-0 flex-1 rounded-ios rounded-tl-[6px] bg-white px-3 py-2 dark:bg-[#1C1C1E]">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="truncate text-[13px] font-semibold text-black dark:text-white">
                      {m.callSign}
                    </span>
                    <span className="shrink-0 text-[11px] tabular-nums text-[rgba(60,60,67,0.5)] dark:text-[rgba(235,235,245,0.5)]">
                      {m.time}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[14px] leading-snug text-black dark:text-white">
                    {m.body}
                  </p>
                </div>
              </div>

          )}
        </div>

        <form onSubmit={send} className="mt-3 flex items-center gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Message nearby riders…"
            aria-label="Message nearby riders"
            className="h-[40px] flex-1 rounded-full bg-white px-4 text-[15px] text-black outline-none ring-1 ring-[rgba(60,60,67,0.15)] placeholder:text-[rgba(60,60,67,0.4)] focus:ring-safe dark:bg-[#1C1C1E] dark:text-white dark:ring-[rgba(84,84,88,0.55)]" />
          
          <button
            type="submit"
            aria-label="Send message"
            className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full bg-safe text-white transition-transform duration-150 ease-ios active:scale-95">
            
            <SendIcon size={17} strokeWidth={2.3} />
          </button>
        </form>
      </section>
    </div>);

}