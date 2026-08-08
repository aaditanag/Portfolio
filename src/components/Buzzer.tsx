'use client';
import { useTerminal } from './TerminalProvider';
import styles from './Buzzer.module.css';

export default function Buzzer() {
  const { openTerminal } = useTerminal();

  return (
    <button
      id="emergency-buzzer"
      className={styles.buzzer}
      onClick={openTerminal}
      aria-label="Open Emergency Terminal"
      title="EMERGENCY MEETING"
    >
      <span className={styles.pulseRing} aria-hidden="true" />
      <span className={styles.pulseRing2} aria-hidden="true" />
      <span className={styles.icon}>!</span>
      <span className={styles.label}>EMERGENCY</span>
    </button>
  );
}
