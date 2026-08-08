'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useTerminal } from '@/components/TerminalProvider';
import CrewmateBean from '@/components/CrewmateBean';
import styles from './page.module.css';


const ROOMS = [
  {
    id: 'cafeteria',
    label: 'CAFETERIA',
    emoji: '☕',
    preview: 'About → Meet the crewmate',
    route: '/about',
    x: 38, y: 12, w: 24, h: 18,
    color: '#f5c518',
    glowColor: 'rgba(245,197,24,0.35)',
  },
  {
    id: 'admin',
    label: 'ADMIN',
    emoji: '📋',
    preview: 'Projects → Case studies & demos',
    route: '/projects',
    x: 66, y: 12, w: 18, h: 14,
    color: '#00c8c8',
    glowColor: 'rgba(0,200,200,0.35)',
  },
  {
    id: 'electrical',
    label: 'ELECTRICAL',
    emoji: '⚡',
    preview: 'Tasks → Mini-games unlock secrets',
    route: '/tasks',
    x: 70, y: 54, w: 20, h: 16,
    color: '#f5c518',
    glowColor: 'rgba(245,197,24,0.35)',
  },
  {
    id: 'medbay',
    label: 'MEDBAY',
    emoji: '🫀',
    preview: 'About → Bio, skills, timeline',
    route: '/about',
    x: 8, y: 42, w: 20, h: 16,
    color: '#e8284a',
    glowColor: 'rgba(232,40,74,0.35)',
  },
  {
    id: 'navigation',
    label: 'NAVIGATION',
    emoji: '📡',
    preview: 'Contact → Get in touch',
    route: '/contact',
    x: 38, y: 68, w: 24, h: 16,
    color: '#00c8c8',
    glowColor: 'rgba(0,200,200,0.35)',
  },
  {
    id: 'reactor',
    label: 'REACTOR',
    emoji: '☢️',
    preview: 'Tasks → Danger zone. Complete tasks.',
    route: '/tasks',
    x: 8, y: 62, w: 18, h: 14,
    color: '#e8284a',
    glowColor: 'rgba(232,40,74,0.35)',
  },
  {
    id: 'storage',
    label: 'STORAGE',
    emoji: '📦',
    preview: 'Projects → All the goods are here',
    route: '/projects',
    x: 66, y: 30, w: 18, h: 14,
    color: '#a78bfa',
    glowColor: 'rgba(167,139,250,0.35)',
  },
];

export default function ArenaPage() {
  const router = useRouter();
  const { openTerminal } = useTerminal();
  const [hoveredRoom, setHoveredRoom] = useState<string | null>(null);

  const hovered = ROOMS.find(r => r.id === hoveredRoom);

  return (
    <div className={styles.page}>
      {/* Hero section */}
      <section className={styles.hero}>
        {/* Left: Text content */}
        <motion.div
          className={styles.heroText}
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className={styles.badge}>
            <span className={styles.badgeDot} />
            ONLINE · DOING TASKS
          </div>

          <h1 className={styles.title}>
            <span className="glow-teal">CREWMATE</span>
            <br />
            <span className={styles.titleSub}>_AADITA</span>
          </h1>

          <p className={styles.role}>Full-Stack Developer</p>
          <p className={styles.desc}>
            Welcome aboard the SKELD. I&apos;m a developer who builds things that matter.
            Explore the ship to learn more — or hit the buzzer to open the terminal.
          </p>

          <div className={styles.heroCtas}>
            <button className={`btn btn-teal ${styles.ctaBtn}`} onClick={() => router.push('/projects')}>
              VIEW PROJECTS
            </button>
            <button className={`btn btn-ghost ${styles.ctaBtn}`} onClick={openTerminal}>
              OPEN TERMINAL
            </button>
          </div>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statNum} style={{ color: 'var(--teal)' }}>∞</span>
              <span className={styles.statLabel}>Cups of coffee</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statNum} style={{ color: 'var(--yellow)' }}>3</span>
              <span className={styles.statLabel}>Tasks to unlock</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statNum} style={{ color: 'var(--red)' }}>0</span>
              <span className={styles.statLabel}>Impostors (probably)</span>
            </div>
          </div>
        </motion.div>

        {/* Right: CSS crewmate hero */}
        <motion.div
          className={styles.splineWrapper}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <div className={styles.splineGlow} />
          <CrewmateBean color="teal" />
        </motion.div>
      </section>

      {/* Arena Map */}
      <section className={styles.mapSection}>
        <motion.div
          className={styles.mapHeader}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={styles.mapTitle}>THE SKELD · NAVIGATION MAP</h2>
          <p className={styles.mapSub}>Click a room to explore · Hover for preview</p>
        </motion.div>

        <motion.div
          className={styles.mapContainer}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          {/* Hover tooltip */}
          <AnimatePresence>
            {hovered && (
              <motion.div
                key={`tooltip-${hovered.id}`}
                className={styles.tooltip}
                initial={{ opacity: 0, y: 8, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.9 }}
                transition={{ duration: 0.15 }}
                style={{ borderColor: hovered.color }}
              >
                <span className={styles.tooltipEmoji}>{hovered.emoji}</span>
                <div>
                  <div className={styles.tooltipName} style={{ color: hovered.color }}>
                    {hovered.label}
                  </div>
                  <div className={styles.tooltipPreview}>{hovered.preview}</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* SVG Ship Map */}
          <svg
            viewBox="0 0 100 90"
            className={styles.mapSvg}
            role="img"
            aria-label="The Skeld ship map"
          >
            {/* Ship hull */}
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <pattern id="grid" width="5" height="5" patternUnits="userSpaceOnUse">
                <path d="M 5 0 L 0 0 0 5" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.2"/>
              </pattern>
            </defs>

            {/* Background grid */}
            <rect x="0" y="0" width="100" height="90" fill="url(#grid)" />

            {/* Corridors */}
            <rect x="30" y="22" width="38" height="4" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.3" rx="1" />
            <rect x="60" y="22" width="4" height="34" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.3" rx="1" />
            <rect x="26" y="50" width="38" height="4" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.3" rx="1" />
            <rect x="26" y="22" width="4" height="32" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.3" rx="1" />

            {/* Rooms */}
            {ROOMS.map((room) => {
              const isHov = hoveredRoom === room.id;
              return (
                <g
                  key={room.id}
                  role="button"
                  tabIndex={0}
                  aria-label={`${room.label}: ${room.preview}`}
                  className={styles.roomGroup}
                  onClick={() => router.push(room.route)}
                  onMouseEnter={() => setHoveredRoom(room.id)}
                  onMouseLeave={() => setHoveredRoom(null)}
                  onKeyDown={(e) => e.key === 'Enter' && router.push(room.route)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Glow layer */}
                  {isHov && (
                    <rect
                      x={room.x - 0.5} y={room.y - 0.5}
                      width={room.w + 1} height={room.h + 1}
                      rx="2"
                      fill={room.glowColor}
                      filter="url(#glow)"
                    />
                  )}
                  {/* Room body */}
                  <rect
                    x={room.x} y={room.y}
                    width={room.w} height={room.h}
                    rx="1.5"
                    fill={isHov ? `${room.color}18` : 'rgba(22,25,41,0.8)'}
                    stroke={isHov ? room.color : 'rgba(255,255,255,0.12)'}
                    strokeWidth={isHov ? '0.6' : '0.3'}
                  />
                  {/* Room label */}
                  <text
                    x={room.x + room.w / 2}
                    y={room.y + room.h / 2 - 1.5}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={isHov ? room.color : 'rgba(255,255,255,0.5)'}
                    fontSize="2.2"
                    fontFamily="'Press Start 2P', monospace"
                    style={{ pointerEvents: 'none' }}
                  >
                    {room.label}
                  </text>
                  {/* Emoji */}
                  <text
                    x={room.x + room.w / 2}
                    y={room.y + room.h / 2 + 3}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="4"
                    style={{ pointerEvents: 'none' }}
                  >
                    {room.emoji}
                  </text>
                </g>
              );
            })}

            {/* Crewmate dot on map */}
            <circle cx="50" cy="46" r="1.5" fill="var(--teal)" filter="url(#glow)" opacity="0.9">
              <animate attributeName="opacity" values="0.9;0.4;0.9" dur="2s" repeatCount="indefinite" />
            </circle>
            <text x="50" y="49.5" textAnchor="middle" fontSize="1.5" fill="rgba(0,200,200,0.6)" fontFamily="'Press Start 2P', monospace">YOU</text>
          </svg>
        </motion.div>
      </section>
    </div>
  );
}
