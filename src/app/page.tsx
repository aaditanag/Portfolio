'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useTerminal } from '@/components/TerminalProvider';
import ImposterKillScene from '@/components/ImposterKillScene';
import styles from './page.module.css';

// Room hotspots calibrated to the actual Skeld map image
const ROOMS = [
  {
    id: 'cafeteria',
    label: 'CAFETERIA',
    emoji: '☕',
    preview: 'Meet the crewmate',
    route: '/about',
    top: '3%', left: '38%', width: '22%', height: '30%',
    color: '#f5c518',
    glowColor: 'rgba(245,197,24,0.3)',
    noTask: false,
  },
  {
    id: 'admin',
    label: 'ADMIN',
    emoji: '📋',
    preview: 'Projects & case studies',
    route: '/projects',
    top: '40%', left: '58%', width: '16%', height: '28%',
    color: '#00c8c8',
    glowColor: 'rgba(0,200,200,0.3)',
    noTask: false,
  },
  {
    id: 'medbay',
    label: 'MEDBAY',
    emoji: '🫀',
    preview: 'Bio, skills & timeline',
    route: '/about',
    top: '23%', left: '17%', width: '15%', height: '25%',
    color: '#e8284a',
    glowColor: 'rgba(232,40,74,0.3)',
    noTask: false,
  },
  {
    id: 'electrical',
    label: 'ELECTRICAL',
    emoji: '⚡',
    preview: 'No tasks assigned here.',
    route: null,
    top: '44%', left: '18%', width: '16%', height: '26%',
    color: '#f5c518',
    glowColor: 'rgba(245,197,24,0.3)',
    noTask: true,
  },
  {
    id: 'navigation',
    label: 'NAVIGATION',
    emoji: '📡',
    preview: 'Get in touch',
    route: '/contact',
    top: '27%', left: '80%', width: '14%', height: '28%',
    color: '#00c8c8',
    glowColor: 'rgba(0,200,200,0.3)',
    noTask: false,
  },
  {
    id: 'reactor',
    label: 'REACTOR',
    emoji: '☢️',
    preview: 'No tasks assigned here.',
    route: null,
    top: '22%', left: '1%', width: '12%', height: '38%',
    color: '#a78bfa',
    glowColor: 'rgba(167,139,250,0.3)',
    noTask: true,
  },
  {
    id: 'storage',
    label: 'STORAGE',
    emoji: '📦',
    preview: 'All the goods are here',
    route: '/projects',
    top: '55%', left: '37%', width: '18%', height: '35%',
    color: '#a78bfa',
    glowColor: 'rgba(167,139,250,0.3)',
    noTask: false,
  },
];

export default function ArenaPage() {
  const router = useRouter();
  const { openTerminal } = useTerminal();
  const [hoveredRoom, setHoveredRoom] = useState<string | null>(null);
  const [noTaskRoom, setNoTaskRoom] = useState<string | null>(null);
  const [visitorCount, setVisitorCount] = useState<number | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/visitors')
      .then(r => r.json())
      .then(({ count }) => setVisitorCount(count))
      .catch(() => {/* silent */});
  }, []);

  // Dismiss "no tasks" after 2.5s
  useEffect(() => {
    if (noTaskRoom) {
      const t = setTimeout(() => setNoTaskRoom(null), 2500);
      return () => clearTimeout(t);
    }
  }, [noTaskRoom]);

  const hovered = ROOMS.find(r => r.id === hoveredRoom);

  const handleRoomClick = (room: typeof ROOMS[0]) => {
    if (room.noTask) {
      setNoTaskRoom(room.id);
    } else if (room.route) {
      router.push(room.route);
    }
  };

  const scrollToMap = () => {
    mapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className={styles.page}>
      {/* Hero section */}
      <section className={styles.hero} style={{ position: 'relative' }}>
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
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statNum} style={{ color: 'var(--teal)' }}>
                {visitorCount !== null ? visitorCount : '…'}
              </span>
              <span className={styles.statLabel}>Crewmates boarded</span>
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
          <ImposterKillScene />
        </motion.div>

        {/* Scroll indicator — anchored to bottom of hero, always visible */}
        <motion.div
          className={styles.scrollIndicator}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          onClick={scrollToMap}
        >
          <span className={styles.scrollLabel}>NAVIGATE THE SHIP</span>
          <motion.div
            className={styles.scrollArrow}
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>
        </motion.div>
      </section>

      {/* Arena Map */}
      <section className={styles.mapSection} ref={mapRef}>
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
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* Tooltip on hover */}
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

          {/* No Tasks notification */}
          <AnimatePresence>
            {noTaskRoom && (
              <motion.div
                key={`notask-${noTaskRoom}`}
                className={styles.noTaskBanner}
                initial={{ opacity: 0, scale: 0.85, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.85, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <span className={styles.noTaskIcon}>🚫</span>
                <span>NO TASKS</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Map image + hotspots */}
          <div className={styles.mapImageWrapper}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/skeld-map.png"
              alt="The Skeld spaceship map"
              className={styles.mapImage}
              draggable={false}
            />

            {/* Clickable room hotspots */}
            {ROOMS.map((room) => (
              <button
                key={room.id}
                className={`${styles.roomHotspot} ${noTaskRoom === room.id ? styles.roomHotspotShake : ''}`}
                style={{
                  top: room.top,
                  left: room.left,
                  width: room.width,
                  height: room.height,
                  '--room-glow': room.glowColor,
                  '--room-color': room.color,
                } as React.CSSProperties}
                onClick={() => handleRoomClick(room)}
                onMouseEnter={() => setHoveredRoom(room.id)}
                onMouseLeave={() => setHoveredRoom(null)}
                aria-label={`${room.label}: ${room.preview}`}
                title={room.label}
              >
                {/* Label that appears on hover */}
                <span className={styles.roomLabel} style={{ color: room.color }}>
                  {room.label}
                </span>
              </button>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
}
