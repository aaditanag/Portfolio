'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './CrewPopup.module.css';

const CREW_CAP = 100; // "capacity" of the ship for the progress bar

export default function CrewPopup() {
  const [count, setCount]     = useState<number | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only show once per browser session (not every page refresh)
    const seen = sessionStorage.getItem('crew-popup-seen');
    if (seen) return;

    // Ping the API — POST increments, returns new count
    fetch('/api/visitors', { method: 'POST' })
      .then(r => r.json())
      .then(({ count: c }) => {
        setCount(c);
        setVisible(true);
        sessionStorage.setItem('crew-popup-seen', '1');
      })
      .catch(() => {/* silently fail */});
  }, []);

  // Auto-dismiss after 5 s
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => setVisible(false), 8000);
    return () => clearTimeout(t);
  }, [visible]);

  const pct = count ? Math.min((count / CREW_CAP) * 100, 100) : 0;

  return (
    <div className={styles.overlay}>
      <AnimatePresence>
        {visible && count !== null && (
          <motion.div
            key="crew-popup"
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0,  scale: 1   }}
            exit={{   opacity: 0, y: 40,  scale: 0.9 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          >
            <div className={styles.popupWrap}>
              <button
                className={styles.closeBtn}
                onClick={() => setVisible(false)}
                aria-label="Dismiss"
              >✕</button>

              <div className={styles.popup}>
                <span className={styles.icon}>🚀</span>
                <div className={styles.content}>
                  <div className={styles.headline}>
                    CREWMATE #{count} HAS BOARDED THE SHIP
                  </div>
                  <div className={styles.subline}>
                    {count} CREWMATE{count !== 1 ? 'S' : ''} ONBOARDED SO FAR
                  </div>
                  <div className={styles.bar}>
                    <div className={styles.barFill} style={{ width: `${pct}%` }} />
                  </div>
                  <div className={styles.progress}>
                    <span>{count} BOARDED</span>
                    <span>TYPE &apos;crew&apos; IN TERMINAL FOR LIVE COUNT</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
