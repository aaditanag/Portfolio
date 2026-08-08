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
  const [selectedWire, setSelectedWire] = useState<string | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [wrong, setWrong] = useState<string | null>(null);

  const connected = useCallback((wireId: string) => !!connections[wireId], [connections]);

  const handleWireSelect = useCallback((wireId: string) => {
    if (connected(wireId)) return;
    if (selectedWire === wireId) {
      setSelectedWire(null);
      setDragging(null);
    } else {
      setSelectedWire(wireId);
      setDragging(wireId);
    }
  }, [connected, selectedWire]);

  const handleSocketClick = useCallback((socketId: string) => {
    const activeWire = selectedWire || dragging;
    if (!activeWire) return;

    if (activeWire === socketId) {
      // Correct!
      setConnections(prev => {
        const next = { ...prev, [activeWire]: socketId };
        const allDone = WIRES.every(w => next[w.id] === w.id);
        if (allDone) {
          setSuccess(true);
          setTimeout(onComplete, 1200);
        }
        return next;
      });
      setSelectedWire(null);
      setDragging(null);
    } else {
      // Wrong
      setWrong(activeWire);
      setSelectedWire(null);
      setDragging(null);
      setTimeout(() => setWrong(null), 600);
    }
  }, [selectedWire, dragging, onComplete]);

  const activeWire = selectedWire || dragging;

  return (
    <div className={styles.task}>
      <div className={styles.taskHeader}>
        <span className={styles.taskIcon}>⚡</span>
        <div>
          <h2 className={styles.taskTitle}>FIX WIRING</h2>
          <p className={styles.taskSub}>Tap or drag each wire to its matching socket</p>
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
          {WIRES.map(wire => {
            const isConn = connected(wire.id);
            const isSel = selectedWire === wire.id;
            const isWrong = wrong === wire.id;
            return (
              <div key={wire.id} className={styles.wireRow}>
                <button
                  type="button"
                  className={`${styles.wireEndpoint} ${isConn ? styles.connected : ''} ${isSel ? styles.selected : ''} ${isWrong ? styles.wrong : ''}`}
                  draggable={!isConn}
                  onDragStart={() => setDragging(wire.id)}
                  onDragEnd={() => setDragging(null)}
                  onClick={() => handleWireSelect(wire.id)}
                  style={{ background: wire.color, boxShadow: isSel ? `0 0 16px ${wire.color}` : `0 0 10px ${wire.color}80` }}
                  title={`Select/Drag ${wire.label} wire`}
                  aria-label={`Select ${wire.label} wire`}
                />
                <div
                  className={styles.wireLine}
                  style={{
                    background: isConn || isSel
                      ? wire.color
                      : activeWire === wire.id
                      ? `${wire.color}80`
                      : 'rgba(255,255,255,0.1)',
                    boxShadow: isConn || isSel ? `0 0 8px ${wire.color}80` : 'none',
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Center gap */}
        <div className={styles.gap}>
          {activeWire && (
            <motion.div
              className={styles.dragHint}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              tap matching socket →
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
                <button
                  type="button"
                  className={`${styles.socket} ${isConnected ? styles.socketFilled : ''} ${activeWire === socketId ? styles.socketTarget : ''}`}
                  onDragOver={e => e.preventDefault()}
                  onDrop={() => handleSocketClick(socketId)}
                  onClick={() => handleSocketClick(socketId)}
                  style={{ borderColor: wire.color, boxShadow: isConnected ? `0 0 12px ${wire.color}60` : 'none' }}
                  aria-label={`${wire.label} socket`}
                >
                  {isConnected && <div className={styles.socketDot} style={{ background: wire.color }} />}
                </button>
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
