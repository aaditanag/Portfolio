'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

const BOOT_LINES = [
  'INITIALIZING SHIP SYSTEMS...',
  'LOADING CREWMATE_AADITA...',
  'ALL SYSTEMS NOMINAL. WELCOME ABOARD.',
];

const CHAR_DELAY_MS = 36;
const LINE_GAP_MS   = 180;
const HOLD_MS       = 400;

/**
 * Module-level guard: reset in cleanup so React Strict Mode's double-invoke
 * works correctly. The second invocation (the real one) proceeds normally.
 * sessionStorage is only written AFTER typing completes so it isn't consumed
 * by the second run before it starts.
 */
let bootStarted = false;

export default function BootSequence() {
  const pathname = usePathname();

  const [visible,    setVisible]  = useState(false);
  const [typedLines, setTyped]    = useState<string[]>([]);
  const [exiting,    setExiting]  = useState(false);

  useEffect(() => {
    if (pathname !== '/') return;
    if (sessionStorage.getItem('boot-seen')) return;
    if (bootStarted) return;

    bootStarted = true;
    setVisible(true);
    setTyped([]);
    setExiting(false);

    let mounted = true;

    function localDismiss() {
      if (!mounted) return;
      sessionStorage.setItem('boot-seen', '1');
      setExiting(true);
      setTimeout(() => { if (mounted) setVisible(false); }, 460);
    }

    async function run() {
      const result: string[] = [];

      for (let li = 0; li < BOOT_LINES.length; li++) {
        if (!mounted) return;
        result.push('');
        setTyped([...result]);

        const line = BOOT_LINES[li];
        for (let ci = 1; ci <= line.length; ci++) {
          if (!mounted) return;
          await delay(CHAR_DELAY_MS);
          if (!mounted) return;
          result[li] = line.slice(0, ci);
          setTyped([...result]);
        }

        if (li < BOOT_LINES.length - 1) {
          await delay(LINE_GAP_MS);
        }
      }

      await delay(HOLD_MS);
      localDismiss();
    }

    run();

    return () => {
      mounted = false;
      bootStarted = false; // reset so strict-mode's second invoke can proceed
    };
  }, [pathname]);

  if (!visible) return null;

  function skip() {
    sessionStorage.setItem('boot-seen', '1');
    setExiting(true);
    setTimeout(() => setVisible(false), 460);
  }

  return (
    <div
      className={`boot-overlay${exiting ? ' boot-exiting' : ''}`}
      onClick={skip}
      role="presentation"
      aria-hidden="true"
    >
      <style>{`
        .boot-overlay {
          position: fixed;
          inset: 0;
          background-color: #0a0a0f;
          background-color: var(--cloak-black, #0a0a0f);
          z-index: 99999;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;    /* centered horizontally */
          padding: 5vw 8vw;
          cursor: pointer;
          opacity: 1;
          transition: opacity 0.46s cubic-bezier(0.4, 0, 0.2, 1);
          isolation: isolate;
        }
        .boot-overlay.boot-exiting {
          opacity: 0;
          pointer-events: none;
        }
        .boot-overlay::before {
          content: '';
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            0deg, transparent, transparent 2px,
            rgba(0,200,200,0.018) 2px, rgba(0,200,200,0.018) 4px
          );
          pointer-events: none;
          z-index: 0;
        }
        .boot-line {
          font-family: 'VT323', 'Courier New', monospace;
          font-size: clamp(1.15rem, 2.8vw, 1.75rem);
          color: #00c8c8;
          letter-spacing: 0.07em;
          line-height: 2.1;
          text-shadow: 0 0 14px rgba(0,200,200,0.5);
          position: relative;
          z-index: 1;
          white-space: pre;
        }
        .boot-prompt {
          color: rgba(0,200,200,0.45);
          margin-right: 0.6em;
          user-select: none;
        }
        .boot-cursor {
          display: inline-block;
          width: 0.6em;
          height: 0.9em;
          background: #00c8c8;
          margin-left: 2px;
          vertical-align: text-bottom;
          box-shadow: 0 0 8px rgba(0,200,200,0.6);
          animation: bootBlink 0.7s step-end infinite;
        }
        @keyframes bootBlink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        .boot-skip {
          position: absolute;
          bottom: 2rem;
          right: 2.5rem;
          font-family: 'VT323', monospace;
          font-size: clamp(0.85rem, 1.5vw, 1rem);
          color: rgba(0,200,200,0.28);
          letter-spacing: 0.12em;
          z-index: 1;
        }
      `}</style>

      {typedLines.map((text, i) => (
        <div key={i} className="boot-line">
          <span className="boot-prompt">{'>'}</span>
          {text}
          {i === typedLines.length - 1 && !exiting && (
            <span className="boot-cursor" aria-hidden="true" />
          )}
        </div>
      ))}

      <div className="boot-skip">CLICK TO SKIP</div>
    </div>
  );
}

function delay(ms: number) {
  return new Promise<void>(resolve => setTimeout(resolve, ms));
}
