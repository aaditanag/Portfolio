'use client';
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './WireTask.module.css';

const WIRES = [
  { id: 'red',    color: '#e8284a', label: 'RED' },
  { id: 'yellow', color: '#f5c518', label: 'YELLOW' },
  { id: 'teal',   color: '#00c8c8', label: 'TEAL' },
  { id: 'purple', color: '#a78bfa', label: 'PURPLE' },
];

// Shuffle order for right side sockets
const SOCKET_ORDER = ['purple', 'red', 'teal', 'yellow'];

interface WireTaskProps {
  onComplete: () => void;
}

export default function WireTask({ onComplete }: WireTaskProps) {
  const [connections, setConnections] = useState<Record<string, string>>({});
  const [dragging, setDragging] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [wrong, setWrong] = useState<string | null>(null);

  const connected = useCallback((wireId: string) => !!connections[wireId], [connections]);
  const allConnected = WIRES.every(w => connections[w.id] === w.id);

  const handleDrop = useCallback((socketId: string) => {
    if (!dragging) return;

    if (dragging === socketId) {
      // Correct!
      setConnections(prev => {
        const next = { ...prev, [dragging]: socketId };
        const allDone = WIRES.every(w => next[w.id] === w.id);
        if (allDone) {
          setSuccess(true);
          setTimeout(onComplete, 1200);
        }
        return next;
      });
    } else {
      // Wrong
      setWrong(dragging);
      setTimeout(() => setWrong(null), 600);
    }
    setDragging(null);
  }, [dragging, onComplete]);

  return (
    <div className={styles.task}>
      <div className={styles.taskHeader}>
        <span className={styles.taskIcon}>⚡</span>
        <div>
          <h2 className={styles.taskTitle}>FIX WIRING</h2>
          <p className={styles.taskSub}>Drag each wire to its matching colored socket</p>
        </div>
      </div>

      <AnimatePresence>
        {success && (
          <motion.div
            key="wire-success-banner"
            className={styles.successBanner}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring' }}
          >
            ✅ WIRING FIXED! Task complete.
          </motion.div>
        )}
      </AnimatePresence>

      <div className={styles.wireBoard}>
        {/* Left: Wires */}
        <div className={styles.wireSide}>
          <div className={styles.sideLabel}>WIRES</div>
          {WIRES.map(wire => (
            <div key={wire.id} className={styles.wireRow}>
              <div
                className={`${styles.wireEndpoint} ${connected(wire.id) ? styles.connected : ''} ${wrong === wire.id ? styles.wrong : ''}`}
                draggable={!connected(wire.id)}
                onDragStart={() => setDragging(wire.id)}
                onDragEnd={() => setDragging(null)}
                style={{ background: wire.color, boxShadow: `0 0 10px ${wire.color}80` }}
                title={`Drag ${wire.label} wire`}
              />
              <div
                className={styles.wireLine}
                style={{
                  background: connected(wire.id)
                    ? wire.color
                    : dragging === wire.id
                    ? `${wire.color}60`
                    : 'rgba(255,255,255,0.1)',
                  boxShadow: connected(wire.id) ? `0 0 8px ${wire.color}60` : 'none',
                }}
              />
            </div>
          ))}
        </div>

        {/* Center gap */}
        <div className={styles.gap}>
          {dragging && (
            <motion.div
              className={styles.dragHint}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              drop on matching socket →
            </motion.div>
          )}
        </div>

        {/* Right: Sockets */}
        <div className={styles.socketSide}>
          <div className={styles.sideLabel}>SOCKETS</div>
          {SOCKET_ORDER.map(socketId => {
            const wire = WIRES.find(w => w.id === socketId)!;
            const isConnected = Object.values(connections).includes(socketId);
            return (
              <div key={socketId} className={styles.socketRow}>
                <div
                  className={styles.socketLine}
                  style={{ background: isConnected ? wire.color : 'rgba(255,255,255,0.1)' }}
                />
                <div
                  className={`${styles.socket} ${isConnected ? styles.socketFilled : ''}`}
                  onDragOver={e => e.preventDefault()}
                  onDrop={() => handleDrop(socketId)}
                  style={{ borderColor: wire.color, boxShadow: isConnected ? `0 0 12px ${wire.color}60` : 'none' }}
                  aria-label={`${wire.label} socket`}
                >
                  {isConnected && <div className={styles.socketDot} style={{ background: wire.color }} />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className={styles.legend}>
        {WIRES.map(w => (
          <div key={w.id} className={styles.legendItem}>
            <div className={styles.legendDot} style={{ background: w.color }} />
            <span style={{ color: connections[w.id] ? w.color : 'rgba(255,255,255,0.4)' }}>{w.label}</span>
            {connections[w.id] && <span className={styles.legendCheck}>✓</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
