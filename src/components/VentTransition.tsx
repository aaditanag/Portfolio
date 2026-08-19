'use client';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Vent-wipe page transition.
 *
 * Previous approach: detected pathname change AFTER navigation — caused a
 * "sneak" where the new page was briefly visible before the overlay appeared.
 *
 * Fixed approach:
 *   1. Intercept link clicks (pointerdown) BEFORE navigation fires
 *   2. Overlay expands immediately, covering the old page
 *   3. Next.js navigates underneath (new page renders while fully covered)
 *   4. Pathname change detected → short hold → overlay shrinks, revealing new page
 */
export default function VentTransition() {
  const pathname = usePathname();
  const prevPath = useRef<string>(pathname);
  const [phase, setPhase]   = useState<'idle' | 'in' | 'hold' | 'out'>('idle');
  const [navKey, setNavKey] = useState(0);
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const outTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Step 1: intercept clicks BEFORE navigation ──────────────────────────
  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      const anchor = (e.target as Element).closest('a[href]') as HTMLAnchorElement | null;
      if (!anchor) return;

      const href = anchor.getAttribute('href') ?? '';
      // Only internal same-origin page links, not same page, not hash-only
      if (
        !href.startsWith('/') ||
        href === pathname ||
        href.startsWith('/#')
      ) return;

      // Clear any in-progress timers from a rapid previous click
      if (holdTimer.current) clearTimeout(holdTimer.current);
      if (outTimer.current)  clearTimeout(outTimer.current);

      setNavKey(k => k + 1);
      setPhase('in');
    }

    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [pathname]);

  // ── Step 2: once new page is ready, briefly hold then reveal ────────────
  useEffect(() => {
    if (prevPath.current === pathname) return;
    prevPath.current = pathname;

    if (phase === 'idle') return; // no transition was started (e.g. browser back)

    // New page loaded underneath — hold a beat, then shrink out
    holdTimer.current = setTimeout(() => {
      setPhase('out');
      outTimer.current = setTimeout(() => setPhase('idle'), 320);
    }, 80);

    return () => {
      if (holdTimer.current) clearTimeout(holdTimer.current);
      if (outTimer.current)  clearTimeout(outTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  if (phase === 'idle') return null;

  return (
    <AnimatePresence>
      {(phase === 'in' || phase === 'hold') && (
        <motion.div
          key={navKey}
          aria-hidden="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9990,
            pointerEvents: 'all', // block interaction while covering
            background: 'radial-gradient(circle at 50% 50%, #0d0f1a 0%, #070809 100%)',
          }}
          initial={{ clipPath: 'circle(0% at 50% 50%)' }}
          animate={{
            clipPath: 'circle(150% at 50% 50%)',
            transition: { duration: 0.18, ease: [0.55, 0, 1, 0.45] },
          }}
          exit={{
            clipPath: 'circle(0% at 50% 50%)',
            transition: { duration: 0.28, ease: [0, 0.55, 0.45, 1] },
          }}
        />
      )}
    </AnimatePresence>
  );
}
