'use client';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './SequenceTask.module.css';

const PANELS = [
  { id: 0, color: '#e8284a', label: 'RED',    glow: 'rgba(232,40,74,0.6)' },
  { id: 1, color: '#f5c518', label: 'YELLOW', glow: 'rgba(245,197,24,0.6)' },
  { id: 2, color: '#00c8c8', label: 'TEAL',   glow: 'rgba(0,200,200,0.6)' },
  { id: 3, color: '#a78bfa', label: 'PURPLE', glow: 'rgba(167,139,250,0.6)' },
];

type Phase = 'showing' | 'input' | 'wrong' | 'roundWin' | 'success';

function randPanel() { return Math.floor(Math.random() * 4); }

interface SequenceTaskProps {
  onComplete: () => void;
}

export default function SequenceTask({ onComplete }: SequenceTaskProps) {
  const [sequence, setSequence]     = useState<number[]>([randPanel()]);
  const [playerSeq, setPlayerSeq]   = useState<number[]>([]);
  const [phase, setPhase]           = useState<Phase>('showing');
  const [showIdx, setShowIdx]       = useState(0);
  const [litPanel, setLitPanel]     = useState<number | null>(null);
  const [round, setRound]           = useState(1);
  const TARGET_ROUNDS = 3;

  // Playback sequence
  useEffect(() => {
    if (phase !== 'showing') return;
    if (showIdx >= sequence.length) {
      setLitPanel(null);
      setTimeout(() => setPhase('input'), 500);
      return;
    }
    const timer = setTimeout(() => {
      setLitPanel(sequence[showIdx]);
      setTimeout(() => {
        setLitPanel(null);
        setShowIdx(i => i + 1);
      }, 600);
    }, 400);
    return () => clearTimeout(timer);
  }, [phase, showIdx, sequence]);

  const handlePress = useCallback((panelId: number) => {
    if (phase !== 'input') return;
    setLitPanel(panelId);
    setTimeout(() => setLitPanel(null), 200);

    const next = [...playerSeq, panelId];
    const pos  = next.length - 1;

    if (next[pos] !== sequence[pos]) {
      // Wrong — restart round
      setPhase('wrong');
      setTimeout(() => {
        setPlayerSeq([]);
        setShowIdx(0);
        setPhase('showing');
      }, 1000);
      return;
    }

    setPlayerSeq(next);

    if (next.length === sequence.length) {
      // Completed this round
      if (round >= TARGET_ROUNDS) {
        setPhase('success');
        setTimeout(onComplete, 1500);
      } else {
        setPhase('roundWin');
        setTimeout(() => {
          setRound(r => r + 1);
          setSequence(s => [...s, randPanel()]);
          setPlayerSeq([]);
          setShowIdx(0);
          setPhase('showing');
        }, 800);
      }
    }
  }, [phase, playerSeq, sequence, round, onComplete]);

  const phaseLabel = {
    showing:  '👁️ WATCH THE SEQUENCE...',
    input:    '🖱️ REPEAT THE SEQUENCE',
    wrong:    '❌ WRONG! Try again...',
    roundWin: `✅ ROUND ${round} COMPLETE!`,
    success:  '🏆 REACTOR STABILIZED!',
  }[phase];

  const phaseColor = {
    showing: 'rgba(255,255,255,0.4)',
    input:   'var(--teal)',
    wrong:   'var(--red)',
    roundWin:'var(--terminal-green)',
    success: 'var(--terminal-green)',
  }[phase];

  return (
    <div className={styles.task}>
      <div className={styles.taskHeader}>
        <span className={styles.taskIcon}>☢️</span>
        <div>
          <h2 className={styles.taskTitle}>MEMORY SEQUENCE</h2>
          <p className={styles.taskSub}>Watch the reactor panels light up, then repeat the pattern</p>
        </div>
      </div>

      {/* Progress rounds */}
      <div className={styles.roundsRow}>
        {Array.from({ length: TARGET_ROUNDS }).map((_, i) => (
          <div
            key={i}
            className={styles.roundDot}
            style={{
              background: i < round - 1 || phase === 'success' ? 'var(--terminal-green)' : i === round - 1 && phase !== 'showing' ? 'var(--yellow)' : 'rgba(255,255,255,0.1)',
              boxShadow: (i < round - 1 || phase === 'success') ? '0 0 8px var(--terminal-green)' : 'none',
            }}
          />
        ))}
        <span className={styles.roundLabel}>ROUND {round}/{TARGET_ROUNDS}</span>
      </div>

      {/* Status */}
      <div className={styles.statusBanner} style={{ color: phaseColor, borderColor: `${phaseColor}40` }}>
        <span className={styles.statusText}>{phaseLabel}</span>
        {phase === 'input' && (
          <span className={styles.progress}>{playerSeq.length}/{sequence.length}</span>
        )}
      </div>

      {/* Panels */}
      <div className={`${styles.panels} ${phase === 'wrong' ? styles.shake : ''}`}>
        {PANELS.map(panel => {
          const isLit = litPanel === panel.id;
          const canPress = phase === 'input';
          return (
            <motion.button
              key={panel.id}
              id={`sequence-panel-${panel.id}`}
              className={`${styles.panel} ${isLit ? styles.panelLit : ''}`}
              style={{
                background: isLit ? panel.color : `${panel.color}22`,
                borderColor: isLit ? panel.color : `${panel.color}44`,
                boxShadow: isLit ? `0 0 30px ${panel.glow}, inset 0 0 20px ${panel.glow}` : 'none',
                cursor: canPress ? 'pointer' : 'default',
              }}
              onClick={() => handlePress(panel.id)}
              disabled={!canPress}
              whileHover={canPress ? { scale: 1.05 } : {}}
              whileTap={canPress ? { scale: 0.93 } : {}}
              aria-label={`Panel ${panel.label}`}
            >
              <span className={styles.panelLabel}>{panel.label}</span>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {phase === 'success' && (
          <motion.div
            key="sequence-success-banner"
            className={styles.successBanner}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            🏆 MELTDOWN PREVENTED · SECRET UNLOCKED
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
