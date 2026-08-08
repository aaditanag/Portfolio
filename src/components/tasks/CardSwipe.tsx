'use client';
import { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import styles from './CardSwipe.module.css';

interface CardSwipeProps {
  onComplete: () => void;
}

const SLOT_X_START = 20;   // % of container where slot starts
const SLOT_X_END   = 80;   // % of container where slot ends
const MIN_SPEED    = 0.4;  // px/ms minimum
const MAX_SPEED    = 3.5;  // px/ms maximum

export default function CardSwipe({ onComplete }: CardSwipeProps) {
  const [status, setStatus] = useState<'idle' | 'dragging' | 'tooFast' | 'tooSlow' | 'success'>('idle');
  const [attempts, setAttempts] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastX = useRef(0);
  const lastTime = useRef(0);
  const speed = useRef(0);
  const dragStartX = useRef(0);
  const dragStartTime = useRef(0);

  const x = useMotionValue(0);
  const cardRotate = useTransform(x, [-200, 0, 200], [-8, 0, 8]);

  const handleDragStart = () => {
    setStatus('dragging');
    const now = Date.now();
    dragStartTime.current = now;
    dragStartX.current = x.get();
    lastTime.current = now;
    lastX.current = x.get();
    speed.current = 0;
  };

  const handleDrag = () => {
    const now = Date.now();
    const dt = now - lastTime.current;
    if (dt > 0) {
      const dx = Math.abs(x.get() - lastX.current);
      speed.current = dx / dt;
      lastX.current = x.get();
      lastTime.current = now;
    }
  };

  const handleDragEnd = () => {
    const containerWidth = containerRef.current?.offsetWidth ?? 400;
    const pos = x.get();
    const pct = (pos / containerWidth + 0.5) * 100;

    // Use average speed over the whole gesture rather than the last sampled
    // instant — pointer velocity naturally drops to ~0 right before release,
    // which made almost every real swipe register as "too slow".
    const elapsed = Date.now() - dragStartTime.current;
    const avgSpeed = elapsed > 0 ? Math.abs(pos - dragStartX.current) / elapsed : 0;

    setAttempts(a => a + 1);

    if (pct > SLOT_X_END) {
      // Card exited far right — check speed
      if (avgSpeed < MIN_SPEED) {
        setStatus('tooSlow');
        animate(x, 0, { type: 'spring', stiffness: 200 });
      } else if (avgSpeed > MAX_SPEED) {
        setStatus('tooFast');
        animate(x, 0, { type: 'spring', stiffness: 200 });
      } else {
        setStatus('success');
        setTimeout(onComplete, 1200);
      }
    } else {
      setStatus('idle');
      animate(x, 0, { type: 'spring', stiffness: 200 });
    }
  };

  const statusMessages: Record<string, string> = {
    tooFast: '⚡ TOO FAST — Slow down!',
    tooSlow: '🐢 TOO SLOW — Swipe faster!',
    success: '✅ CARD ACCEPTED — Access granted!',
    dragging: 'Swipe through the slot →',
    idle: 'Drag the card through the slot at a steady pace',
  };

  return (
    <div className={styles.task}>
      <div className={styles.taskHeader}>
        <span className={styles.taskIcon}>💳</span>
        <div>
          <h2 className={styles.taskTitle}>SWIPE CARD</h2>
          <p className={styles.taskSub}>Swipe at the right speed — not too fast, not too slow</p>
        </div>
      </div>

      <div className={styles.statusBar}>
        <span
          className={styles.statusText}
          style={{
            color: status === 'success' ? 'var(--terminal-green)'
                 : status === 'tooFast' || status === 'tooSlow' ? 'var(--red)'
                 : status === 'dragging' ? 'var(--teal)'
                 : 'rgba(255,255,255,0.4)',
          }}
        >
          {statusMessages[status]}
        </span>
        {attempts > 0 && status !== 'success' && (
          <span className={styles.attempts}>Attempts: {attempts}</span>
        )}
      </div>

      {/* Speed indicator */}
      <div className={styles.speedMeter}>
        <div className={styles.speedLabel}>SPEED ZONE</div>
        <div className={styles.speedTrack}>
          <div className={styles.speedZone} />
          <div className={styles.speedPointer} style={{ left: `${Math.min(speed.current / MAX_SPEED * 100, 100)}%` }} />
        </div>
        <div className={styles.speedLabels}>
          <span>TOO SLOW</span>
          <span style={{ color: 'var(--terminal-green)' }}>✓ GOOD</span>
          <span>TOO FAST</span>
        </div>
      </div>

      {/* Card + slot */}
      <div className={styles.slotContainer} ref={containerRef}>
        {/* Slot track */}
        <div className={styles.slotTrack}>
          <div className={styles.slotEntry} />
          <div className={styles.slotBody} />
          <div className={styles.slotExit} />
        </div>

        {/* Card */}
        {status !== 'success' && (
          <motion.div
            className={styles.card}
            style={{ x, rotate: cardRotate }}
            drag="x"
            dragConstraints={containerRef}
            dragElastic={0.05}
            onDragStart={handleDragStart}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <div className={styles.cardChip} />
            <div className={styles.cardName}>CREWMATE_AADITA</div>
            <div className={styles.cardId}>ID: 0x4A2F</div>
            <div className={styles.cardStripe} />
          </motion.div>
        )}

        {status === 'success' && (
          <motion.div
            className={styles.successCard}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            ✅ ACCESS GRANTED
          </motion.div>
        )}
      </div>
    </div>
  );
}
