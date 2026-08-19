'use client';
import { useState, useEffect, useRef } from 'react';

const KONAMI = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'b', 'a',
];

export default function KonamiEgg() {
  const [active, setActive] = useState(false);
  const bufRef = useRef<string[]>([]);

  useEffect(() => {
    // Console easter egg — visible to any curious dev who opens DevTools
    console.log(
      '%c\n' +
      '    🫘  CREWMATE_AADITA  🫘    \n' +
      '┌────────────────────────────┐\n' +
      '│  you opened devtools.      │\n' +
      '│  that makes you sus  👁️    │\n' +
      '│                            │\n' +
      '│  try the konami code  🕹️   │\n' +
      '│  ↑ ↑ ↓ ↓ ← → ← → B A     │\n' +
      '└────────────────────────────┘\n',
      'color:#00c8c8; font-family:monospace; font-size:13px; line-height:1.6;',
    );

    function onKey(e: KeyboardEvent) {
      bufRef.current = [...bufRef.current, e.key].slice(-KONAMI.length);
      if (bufRef.current.join(',') === KONAMI.join(',')) {
        setActive(true);
        bufRef.current = [];
      }
    }

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Auto-dismiss after 4s
  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => setActive(false), 4000);
    return () => clearTimeout(t);
  }, [active]);

  if (!active) return null;

  return (
    <div
      className="konami-overlay"
      onClick={() => setActive(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Emergency meeting easter egg"
    >
      <style>{`
        @keyframes konamiPulse {
          0%, 100% { background: #160303; }
          50%       { background: #2e0606; }
        }
        @keyframes konamiRise {
          from { transform: translateY(-30px); opacity: 0; }
          to   { transform: translateY(0);     opacity: 1; }
        }
        @keyframes sirenSpin {
          from { filter: hue-rotate(0deg)   drop-shadow(0 0 20px #e8284a); }
          to   { filter: hue-rotate(360deg) drop-shadow(0 0 40px #e8284a); }
        }

        .konami-overlay {
          position: fixed;
          inset: 0;
          z-index: 99999;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
          animation: konamiPulse 0.5s ease-in-out infinite;
          cursor: pointer;
          padding: 2rem;
        }

        /* Scanline overlay on emergency screen */
        .konami-overlay::before {
          content: '';
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            0deg, transparent, transparent 3px,
            rgba(232,40,74,0.04) 3px, rgba(232,40,74,0.04) 6px
          );
          pointer-events: none;
        }

        .konami-siren {
          font-size: clamp(3.5rem, 10vw, 6rem);
          animation: sirenSpin 1s linear infinite;
          position: relative;
          z-index: 1;
        }
        .konami-title {
          font-family: var(--font-pixel);
          font-size: clamp(0.6rem, 3vw, 1.1rem);
          color: var(--red);
          letter-spacing: 0.14em;
          text-shadow: 0 0 24px var(--red-glow), 0 0 60px var(--red-glow);
          animation: konamiRise 0.35s 0.05s ease-out both;
          text-align: center;
          position: relative;
          z-index: 1;
        }
        .konami-msg {
          font-family: var(--font-terminal);
          font-size: clamp(1.1rem, 3.5vw, 1.8rem);
          color: rgba(255, 255, 255, 0.85);
          letter-spacing: 0.06em;
          text-align: center;
          animation: konamiRise 0.35s 0.12s ease-out both;
          line-height: 1.9;
          position: relative;
          z-index: 1;
        }
        .konami-sub {
          font-family: var(--font-pixel);
          font-size: clamp(0.3rem, 1vw, 0.42rem);
          color: rgba(232, 40, 74, 0.5);
          letter-spacing: 0.14em;
          animation: konamiRise 0.35s 0.2s ease-out both;
          text-align: center;
          position: relative;
          z-index: 1;
        }
      `}</style>

      <div className="konami-siren" aria-hidden="true">🚨</div>
      <div className="konami-title">EMERGENCY MEETING</div>
      <div className="konami-msg">
        AADITA WAS NOT THE IMPOSTOR.<br />
        She was a developer all along.
      </div>
      <div className="konami-sub">
        CLICK TO DISMISS &nbsp;·&nbsp; ↑↑↓↓←→←→BA
      </div>
    </div>
  );
}
