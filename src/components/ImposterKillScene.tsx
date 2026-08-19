'use client';

/* ─── Types ─────────────────────────────────────────────────────────────────── */
interface CrewmateSVGProps {
  body: string;
  leg: string;
  shade: string;
  stroke: string;
  hasBackpack?: boolean;
}




/* ─── Crewmate SVG ──────────────────────────────────────────────────────────── */
function CrewmateSVG({ body, leg, shade, stroke, hasBackpack = false }: CrewmateSVGProps) {
  return (
    <svg width="175" height="250" viewBox="0 0 140 200" aria-hidden="true" className="au-char">
      <ellipse cx="70" cy="185" rx="45" ry="8" fill="#000" opacity="0.35" />
      <rect x="18" y="140" width="20" height="40" rx="8" fill={leg} stroke={stroke} strokeWidth="2" />
      <rect x="98" y="140" width="20" height="40" rx="8" fill={leg} stroke={stroke} strokeWidth="2" />
      {hasBackpack && (
        <rect x="6" y="70" width="20" height="55" rx="10" fill={leg} stroke={stroke} strokeWidth="2" />
      )}
      <ellipse cx="70" cy="90" rx="60" ry="85" fill={body} stroke={stroke} strokeWidth="2" />
      <path d="M15 95 Q70 108 125 95 Q125 118 70 124 Q15 118 15 95 Z" fill={shade} />
      <ellipse cx="92" cy="55" rx="36" ry="22" fill="#8FCBEF" stroke="#2C5A78" strokeWidth="1.5" />
      <ellipse cx="80" cy="46" rx="14" ry="7" fill="#E6F5FC" opacity="0.8" />
    </svg>
  );
}

/* ─── Scene ─────────────────────────────────────────────────────────────────── */
export default function ImposterKillScene() {

  return (
    <div
      className="au-container"
      role="img"
      aria-label="Impostor kill animation"
      style={{
        position: 'relative',
        width: '100%',
        height: 600,
        overflow: 'hidden',
        containerType: 'inline-size',
      } as React.CSSProperties}
    >
      <style>{`
        /* ── Keyframes ── */

        @keyframes auBob {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-10px); }
        }

        /* Crewmate: visible → vanish at kill → reappear at loop end */
        @keyframes auCrewLife {
          0%, 32%   { opacity: 1; }
          34%       { opacity: 0; }
          96%, 100% { opacity: 0; }
          99%       { opacity: 1; }
        }

        /*
          Impostor travel uses cqw (container query width) so distances are
          relative to the scene column, not the full viewport.
          Enters from left with a nervous sway, lunges to centre, pauses,
          then sprints to the vent on the right and shrinks into it.
        */
        @keyframes auImpMove {
          0%, 20%   { transform: translate(calc(-50% - 30cqw), 0) scale(0.92) rotate(-3deg); }
          24%       { transform: translate(calc(-50% - 30cqw), 0) scale(0.95)  rotate(3deg); }
          29%       { transform: translate(-50%, 0) scale(1.12, 0.9) rotate(0deg); }
          33%, 60%  { transform: translate(-50%, 0) scale(1) rotate(0deg); }
          70%       { transform: translate(calc(-50% + 28cqw), 0) scale(1) rotate(14deg); }
          76%, 100% { transform: translate(calc(-50% + 28cqw), 0) scale(0.1)  rotate(35deg); }
        }
        @keyframes auImpFade {
          0%, 70%   { opacity: 1; }
          76%, 100% { opacity: 0; }
        }

        /* Kill flash — small radial burst at the kill point, not full-screen */
        @keyframes auFlash {
          0%, 30%    { opacity: 0;   transform: translateX(-50%) scale(0);   }
          31%        { opacity: 0.2; transform: translateX(-50%) scale(0.15); }
          33%        { opacity: 1;   transform: translateX(-50%) scale(1);    }
          35%, 100%  { opacity: 0;   transform: translateX(-50%) scale(1.6);  }
        }

        /* Bones pop in after kill */
        @keyframes auBones {
          0%, 33%   { opacity: 0; transform: translate(-50%, 0) scale(0.6); }
          35%, 82%  { opacity: 1; transform: translate(-50%, 0) scale(1); }
          90%, 100% { opacity: 0; transform: translate(-50%, 0) scale(0.9); }
        }

        /* Ghost rises and drifts */
        @keyframes auGhost {
          0%, 34%   { opacity: 0; transform: translate(-50%, 0) scale(0.7); }
          38%       { opacity: 1; transform: translate(-50%, -30px)  scale(1); }
          53%       { transform: translate(calc(-50% + 18px), -80px)  scale(1); }
          66%       { opacity: 0.85; transform: translate(calc(-50% - 16px), -130px) scale(0.95); }
          80%, 100% { opacity: 0; transform: translate(-50%, -190px) scale(0.85); }
        }

        /* Vent glow when impostor dives */
        @keyframes auVentGlow {
          0%, 68%   { box-shadow: 0 0 6px rgba(0,200,200,0.1); }
          73%       { box-shadow: 0 0 30px rgba(0,200,200,0.65), 0 0 60px rgba(0,200,200,0.2); }
          80%, 100% { box-shadow: 0 0 6px rgba(0,200,200,0.1); }
        }

        /* ── Actors ── */

        /* Both characters start at opacity 1 — no fade-in stagger */
        .au-crewmate-wrap {
          position: absolute;
          left: 50%; bottom: 18%;
          transform: translate(-50%, 0);
          z-index: 2;
          opacity: 1;
          animation: auCrewLife 9s ease-in-out infinite;
        }
        .au-crewmate-bob { animation: auBob 2.2s ease-in-out infinite; }

        .au-imposter {
          position: absolute;
          left: 50%; bottom: 18%;
          z-index: 1;
          opacity: 1;
          animation:
            auImpMove 9s ease-in-out infinite,
            auImpFade 9s ease-in-out infinite;
        }

        .au-bones {
          position: absolute;
          left: 50%; bottom: calc(18% + 6px);
          z-index: 2;
          animation: auBones 9s ease-in-out infinite;
        }

        .au-ghost {
          position: absolute;
          left: 50%; bottom: 38%;
          z-index: 3;
          filter: drop-shadow(0 0 12px rgba(180,225,255,0.55));
          animation: auGhost 9s ease-in-out infinite;
        }

        .au-flash {
          position: absolute;
          left: 50%;
          /* Sits just above the ground — covers character bodies */
          bottom: 20%;
          transform: translateX(-50%) scale(0);
          width: 210px;
          height: 210px;
          border-radius: 50%;
          /* Warm explosion: white core → orange → red edge → transparent */
          background: radial-gradient(
            circle at center,
            #ffffff          0%,
            rgba(255,240,200,0.95) 18%,
            rgba(255,170,70,0.65)  44%,
            rgba(255,70,30,0.28)   66%,
            transparent      82%
          );
          filter: blur(1.5px);
          pointer-events: none;
          z-index: 10;
          animation: auFlash 9s ease-in-out infinite;
        }



        /* Vent grate on the right */
        .au-vent {
          position: absolute;
          left: calc(50% + 28cqw - 32px);
          bottom: calc(18% - 14px);
          width: 64px; height: 22px;
          background: #0d1419;
          border-radius: 5px;
          border: 1px solid #1e2d38;
          animation: auVentGlow 9s ease-in-out infinite;
          z-index: 0;
        }
        .au-vent span {
          position: absolute; left: 8px;
          width: 46px; height: 2px;
          background: #1e2d38;
        }
        .au-vent span:first-child { top: 5px; }
        .au-vent span:last-child  { top: 11px; }

        /* Ground line */
        .au-ground {
          position: absolute;
          left: 0; right: 0; bottom: 18%;
          border-top: 1px dashed #1c2b33;
        }

        /* ── Mobile ── */
        @media (max-width: 900px) {
          .au-container { height: 320px !important; }
          .au-char { width: 100px !important; height: 143px !important; }
          .au-ghost svg { width: 70px !important; height: 80px !important; }
        }
        @media (max-width: 480px) {
          .au-container { height: 260px !important; }
          .au-char { width: 80px !important; height: 114px !important; }
          .au-ghost svg { width: 55px !important; height: 63px !important; }
        }
      `}</style>

      {/* Ground */}
      <div className="au-ground" />

      {/* Vent */}
      <div className="au-vent"><span /><span /></div>

      {/* Crewmate (victim) */}
      <div className="au-crewmate-wrap">
        <div className="au-crewmate-bob">
          <CrewmateSVG body="#1D9E75" leg="#0F6E56" shade="#178562" stroke="#04241C" hasBackpack />
        </div>
      </div>

      {/* Bones */}
      <div className="au-bones">
        <svg viewBox="0 0 100 60" width="90" height="54" aria-hidden="true">
          <rect x="10" y="25" width="50" height="8" rx="4" fill="#D9D9D9" transform="rotate(-20 35 29)" />
          <rect x="20" y="10" width="50" height="8" rx="4" fill="#D9D9D9" transform="rotate(25 45 14)" />
          <circle cx="15" cy="28" r="6" fill="#D9D9D9" />
          <circle cx="65" cy="18" r="6" fill="#D9D9D9" />
        </svg>
      </div>

      {/* Ghost */}
      <div className="au-ghost">
        <svg viewBox="0 0 140 160" width="100" height="114" aria-hidden="true">
          <path
            d="M70 10 C100 10 122 35 122 68 L122 140 L108 128 L94 140 L80 128 L66 140 L52 128 L38 140 L18 68 C18 35 40 10 70 10 Z"
            fill="#EAF6FF" opacity="0.92"
          />
          <ellipse cx="55" cy="65" rx="8" ry="10" fill="#0F1A22" />
          <ellipse cx="90" cy="65" rx="8" ry="10" fill="#0F1A22" />
        </svg>
      </div>

      {/* Impostor */}
      <div className="au-imposter">
        <CrewmateSVG body="#B83A3A" leg="#A33636" shade="#8C2A2A" stroke="#3A0F0F" />
      </div>

      {/* Kill flash */}
      <div className="au-flash" aria-hidden="true" />
    </div>
  );
}
