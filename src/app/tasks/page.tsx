'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Lock } from 'lucide-react';
import WireTask from '@/components/tasks/WireTask';
import CardSwipe from '@/components/tasks/CardSwipe';
import SequenceTask from '@/components/tasks/SequenceTask';
import styles from './page.module.css';

export type TaskKey = 'wire' | 'card' | 'sequence';

const TASK_DEFS = [
  {
    key: 'wire' as TaskKey,
    code: 'TASK-01',
    title: 'FIX WIRING',
    room: 'ELECTRICAL',
    emoji: '⚡',
    desc: 'Match the colored wires to complete the circuit.',
    reward: '🔓 Unlocks: Fun Facts about me',
    color: 'var(--yellow)',
    glow: 'var(--yellow-glow)',
    dim: 'var(--yellow-dim)',
  },
  {
    key: 'card' as TaskKey,
    code: 'TASK-02',
    title: 'SWIPE CARD',
    room: 'ADMIN',
    emoji: '💳',
    desc: 'Drag the ID card through the reader at the right speed.',
    reward: '🔓 Unlocks: Resume download',
    color: 'var(--teal)',
    glow: 'var(--teal-glow)',
    dim: 'var(--teal-dim)',
  },
  {
    key: 'sequence' as TaskKey,
    code: 'TASK-03',
    title: 'MEMORY SEQUENCE',
    room: 'REACTOR',
    emoji: '☢️',
    desc: 'Repeat the pattern shown on the reactor panels.',
    reward: '🔓 Unlocks: Secret Project',
    color: 'var(--red)',
    glow: 'var(--red-glow)',
    dim: 'var(--red-dim)',
  },
];

const FUN_FACTS = [
  'I love painting 🎨',
  'I know 6 languages 🗣️',
  'I won an album in an Among Us tournament 🏆',
  'This website was fully my idea — NOTHING WAS STOLEN 🚀',
];

export default function TasksPage() {
  const [completed, setCompleted] = useState<Record<TaskKey, boolean>>({
    wire: false,
    card: false,
    sequence: false,
  });
  const [activeTask, setActiveTask] = useState<TaskKey | null>(null);

  const completeTask = (key: TaskKey) => {
    setCompleted(prev => ({ ...prev, [key]: true }));
    setActiveTask(null);
  };

  const allDone = Object.values(completed).every(Boolean);
  const doneCount = Object.values(completed).filter(Boolean).length;

  return (
    <div className={styles.page}>
      {/* Header */}
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className={styles.roomTag}>⚡ TASK STATION</div>
        <h1 className={styles.title}>
          COMPLETE <span style={{ color: 'var(--yellow)' }}>TASKS</span>
        </h1>
        <p className={styles.subtitle}>Complete tasks to unlock hidden content. Impostors cannot complete tasks.</p>

        {/* Progress bar */}
        <div className={styles.progressBar}>
          <div className={styles.progressLabel}>
            <span>CREW TASKS</span>
            <span style={{ color: 'var(--teal)' }}>{doneCount}/3 COMPLETE</span>
          </div>
          <div className={styles.progressTrack}>
            <motion.div
              className={styles.progressFill}
              initial={{ width: 0 }}
              animate={{ width: `${(doneCount / 3) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {allDone && (
          <motion.div
            className={styles.victoryBanner}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 10 }}
          >
            🏆 ALL TASKS COMPLETE · CREW WINS
          </motion.div>
        )}
      </motion.div>

      {/* Task Cards */}
      <div className={styles.taskGrid}>
        {TASK_DEFS.map((task, i) => (
          <motion.div
            key={task.key}
            className={`${styles.taskCard} ${completed[task.key] ? styles.taskDone : ''}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            style={{ '--task-color': task.color, '--task-glow': task.glow, '--task-dim': task.dim } as React.CSSProperties}
          >
            <div className={styles.taskCardHeader}>
              <span className={styles.taskCode}>{task.code}</span>
              <span className={styles.taskRoom} style={{ color: task.color }}>{task.room}</span>
            </div>

            <div className={styles.taskEmoji}>{task.emoji}</div>
            <h3 className={styles.taskTitle}>{task.title}</h3>
            <p className={styles.taskDesc}>{task.desc}</p>
            <div className={styles.taskReward}>{task.reward}</div>

            <button
              className={styles.taskBtn}
              onClick={() => setActiveTask(task.key)}
              disabled={completed[task.key]}
              style={completed[task.key] ? {} : { borderColor: task.color, color: task.color }}
              aria-label={`Start ${task.title}`}
            >
              {completed[task.key] ? (
                <><CheckCircle size={14} /> COMPLETE</>
              ) : (
                'START TASK →'
              )}
            </button>
          </motion.div>
        ))}
      </div>

      {/* Unlocked rewards */}
      <AnimatePresence>
        {completed.wire && (
          <motion.section
            key="reward-wire"
            className={styles.rewardSection}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.5 }}
          >
            <div className={styles.rewardHeader}>
              <span>⚡</span>
              <h2 className={styles.rewardTitle}>FUN FACTS · UNLOCKED</h2>
            </div>
            <div className={styles.factsGrid}>
              {FUN_FACTS.map((f, i) => (
                <motion.div
                  key={i}
                  className={styles.factCard}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <span className={styles.factNum}>#{i + 1}</span>
                  <p>{f}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {completed.card && (
          <motion.section
            key="reward-card"
            className={styles.rewardSection}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.5 }}
          >
            <div className={styles.rewardHeader}>
              <span>💳</span>
              <h2 className={styles.rewardTitle}>RESUME · UNLOCKED</h2>
            </div>
            <div className={styles.resumeCard}>
              <p>Your clearance level is sufficient. Download the full mission report.</p>
              <a
                id="resume-download"
                href="/Resume_AaditaNag.pdf"
                download="Resume_AaditaNag.pdf"
                className="btn btn-teal"
              >
                ⬇ DOWNLOAD RESUME
              </a>
            </div>
          </motion.section>
        )}

        {completed.sequence && (
          <motion.section
            key="reward-sequence"
            className={styles.rewardSection}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.5 }}
          >
            <div className={styles.rewardHeader}>
              <span>☢️</span>
              <h2 className={styles.rewardTitle}>SECRET PROJECT · UNLOCKED</h2>
            </div>
            <div className={styles.secretCard}>
              <div className={styles.secretBadge}>CLASSIFIED</div>
              <h3 className={styles.secretTitle}>Project OMEGA</h3>
              <p className={styles.secretDesc}>
                An experimental AI-powered tool I built in secret. It predicts Among Us impostors
                with 73% accuracy using behavioral analysis. Currently in stealth.
              </p>
              <div className={styles.secretTags}>
                {['Python', 'ML', 'Spooky', 'Top Secret'].map(t => (
                  <span key={t} className="chip chip-red">{t}</span>
                ))}
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Task Modals */}
      <AnimatePresence>
        {activeTask && (
          <motion.div
            key="task-modal-overlay"
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveTask(null)}
          >
            <motion.div
              className={styles.modal}
              initial={{ scale: 0.85, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 40 }}
              transition={{ type: 'spring', damping: 22 }}
              onClick={e => e.stopPropagation()}
            >
              <button className={styles.modalClose} onClick={() => setActiveTask(null)} aria-label="Close task">✕</button>
              {activeTask === 'wire'     && <WireTask     onComplete={() => completeTask('wire')} />}
              {activeTask === 'card'     && <CardSwipe    onComplete={() => completeTask('card')} />}
              {activeTask === 'sequence' && <SequenceTask onComplete={() => completeTask('sequence')} />}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
