'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useTerminal } from './TerminalProvider';
import styles from './Terminal.module.css';

type LineType = 'input' | 'output' | 'error' | 'success' | 'easter' | 'system';

interface TerminalLine {
  id: number;
  type: LineType;
  content: string;
}

const COMMANDS: Record<string, { route?: string; description: string; type?: LineType }> = {
  projects:  { route: '/projects',  description: 'View project case studies' },
  work:      { route: '/projects',  description: 'Alias for projects' },
  cases:     { route: '/projects',  description: 'Alias for projects' },
  about:     { route: '/about',     description: 'Read bio, skills, timeline' },
  bio:       { route: '/about',     description: 'Alias for about' },
  me:        { route: '/about',     description: 'Alias for about' },
  skills:    { route: '/about',     description: 'Alias for about' },
  tasks:     { route: '/tasks',     description: 'Complete mini-games to unlock content' },
  games:     { route: '/tasks',     description: 'Alias for tasks' },
  mini:      { route: '/tasks',     description: 'Alias for tasks' },
  contact:   { route: '/contact',   description: 'Get in touch, hire me' },
  hire:      { route: '/contact',   description: 'Alias for contact' },
  email:     { route: '/contact',   description: 'Alias for contact' },
  home:      { route: '/',          description: 'Return to arena map' },
  arena:     { route: '/',          description: 'Alias for home' },
  help:      { description: 'List all available commands' },
  clear:     { description: 'Clear terminal output' },
  // Easter eggs
  emergency: { description: '🚨', type: 'easter' },
  sus:       { description: '👁️', type: 'easter' },
  vent:      { description: '🕳️', type: 'easter' },
  impostor:  { description: '🔪', type: 'easter' },
  crewmate:  { description: '🫘', type: 'easter' },
};

const EASTER_EGG_MESSAGES: Record<string, string[]> = {
  emergency: [
    '🚨 EMERGENCY MEETING CALLED 🚨',
    'Everyone stops what they are doing...',
    'Who called this? Who was it?',
    'CREWMATE_AADITA called an emergency meeting.',
    'The impostor is still among us. 👁️',

  ],
  sus: [
    '👁️ RED IS SUS.',
    'I saw red vent in electrical.',
    'Red was not doing tasks.',
    '...',
    'red was The Impostor.',
    '1 Impostor remains.',
  ],
  vent: [
    '🕳️ *whoosh*',
    'You slipped through the vent...',
    'Navigating through maintenance tunnels...',
    'You can see everything from here. 😈',
    'Wait — crewmates don\'t use vents.',
    '[ IMPOSTOR DETECTED ]',
  ],
  impostor: [
    '🔪 Nice try.',
    'Your true colors are showing.',
    'We\'re watching you.',
    '...',
    '[ ACCESS DENIED — YOU\'RE THE IMPOSTOR ]',
  ],
  crewmate: [
    '🫘 Bloop bloop.',
    'Just a bean trying to fix the ship.',
    'Tasks remaining: fix wiring, upload data, fuel engines.',
    'CREWMATE_AADITA is doing tasks.',
    '✅ Crew Victory Condition: 87%',

  ],
};

function levenshtein(a: string, b: string): number {
  const dp = Array.from({ length: a.length + 1 }, (_, i) =>
    Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = a[i-1] === b[j-1]
        ? dp[i-1][j-1]
        : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
    }
  }
  return dp[a.length][b.length];
}

function findClosestCommand(input: string): string | null {
  const keys = Object.keys(COMMANDS);
  let best = { cmd: '', dist: Infinity };
  for (const cmd of keys) {
    const d = levenshtein(input, cmd);
    if (d < best.dist) best = { cmd, dist: d };
  }
  return best.dist <= 2 ? best.cmd : null;
}

const HELP_TEXT = `
AVAILABLE COMMANDS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━
  projects  → Case studies & demos
  about     → Bio, skills, timeline
  tasks     → Mini-game hub (unlock secrets)
  contact   → Hire me, socials, email
  home      → Return to arena map
  clear     → Clear this terminal
━━━━━━━━━━━━━━━━━━━━━━━━━━━
  🥚 Try: emergency · sus · vent · impostor
`.trim();

const BOOT_SEQUENCE = [
  'AMONG_OS v2.4.1 BOOTING...',
  'Initializing ship systems...',
  'Crew manifest loaded. 1 crew detected.',
  'WARNING: 1 impostor may be aboard.',
  '━━━━━━━━━━━━━━━━━━━━━━━━━━━',
  'Type "help" to list available commands.',
  'Navigate the ship by command.',
];

let lineIdCounter = 0;
const mkLine = (type: LineType, content: string): TerminalLine => ({
  id: lineIdCounter++,
  type,
  content,
});

export default function Terminal() {
  const { isOpen, closeTerminal } = useTerminal();
  const router = useRouter();
  const [lines, setLines] = useState<TerminalLine[]>(
    BOOT_SEQUENCE.map((l, i) => mkLine(i === 0 ? 'system' : i < 4 ? 'output' : i === 4 ? 'system' : 'success', l))
  );
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [isEasterEgg, setIsEasterEgg] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeTerminal();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, closeTerminal]);

  const addLines = useCallback((...newLines: TerminalLine[]) => {
    setLines(prev => [...prev, ...newLines]);
  }, []);

  const runEasterEgg = useCallback((cmd: string) => {
    const msgs = EASTER_EGG_MESSAGES[cmd] || [];
    setIsEasterEgg(true);
    msgs.forEach((msg, i) => {
      setTimeout(() => {
        setLines(prev => [...prev, mkLine('easter', msg)]);
        if (i === msgs.length - 1) {
          setTimeout(() => setIsEasterEgg(false), 800);
        }
      }, i * 400);
    });
  }, []);

  const processCommand = useCallback((raw: string) => {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;

    setHistory(prev => [cmd, ...prev]);
    setHistIdx(-1);
    addLines(mkLine('input', `> ${raw}`));

    if (cmd === 'clear') {
      setLines(BOOT_SEQUENCE.map((l, i) => mkLine(i === 0 ? 'system' : i < 4 ? 'output' : i === 4 ? 'system' : 'success', l)));
      return;
    }

    if (cmd === 'help') {
      addLines(mkLine('output', HELP_TEXT));
      return;
    }

    if (COMMANDS[cmd]) {
      const c = COMMANDS[cmd];
      if (c.type === 'easter') {
        runEasterEgg(cmd);
        return;
      }
      if (c.route) {
        addLines(mkLine('success', `Navigating to ${c.route}...`));
        setTimeout(() => {
          router.push(c.route!);
          closeTerminal();
        }, 600);
        return;
      }
    }

    // Fuzzy match
    const closest = findClosestCommand(cmd);
    if (closest) {
      addLines(mkLine('error', `Unknown command: "${cmd}"`));
      addLines(mkLine('output', `Did you mean "${closest}"? Try: ${closest}`));
    } else {
      addLines(
        mkLine('error', `Task not found: "${cmd}"`),
        mkLine('output', 'Type "help" for available commands.')
      );
    }
  }, [addLines, router, closeTerminal, runEasterEgg]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      processCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const next = Math.min(histIdx + 1, history.length - 1);
      setHistIdx(next);
      setInput(history[next] ?? '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = Math.max(histIdx - 1, -1);
      setHistIdx(next);
      setInput(next === -1 ? '' : history[next]);
    }
  };

  const getLineClass = (type: LineType) => {
    switch (type) {
      case 'input':   return styles.lineInput;
      case 'error':   return styles.lineError;
      case 'success': return styles.lineSuccess;
      case 'easter':  return styles.lineEaster;
      case 'system':  return styles.lineSystem;
      default:        return styles.lineOutput;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="terminal-backdrop"
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeTerminal}
          />
          <motion.div
            key="terminal-window"
            className={`${styles.terminal} ${isEasterEgg ? styles.easterGlow : ''}`}
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            role="dialog"
            aria-label="Command Terminal"
            aria-modal="true"
          >
            {/* Header */}
            <div className={styles.header}>
              <div className={styles.headerDots}>
                <span style={{ background: '#ff5f56' }} />
                <span style={{ background: '#ffbd2e' }} />
                <span style={{ background: '#27c93f' }} />
              </div>
              <span className={styles.headerTitle}>AMONG_OS TERMINAL v2.4.1</span>
              <button className={styles.closeBtn} onClick={closeTerminal} aria-label="Close terminal">✕</button>
            </div>

            {/* Body */}
            <div className={styles.body}>
              {lines.map(line => (
                <div key={line.id} className={`${styles.line} ${getLineClass(line.type)}`}>
                  <pre>{line.content}</pre>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className={styles.inputRow}>
              <span className={styles.prompt}>CREW@SKELD:~$</span>
              <input
                ref={inputRef}
                className={styles.input}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                spellCheck={false}
                autoComplete="off"
                aria-label="Terminal input"
                placeholder="type a command..."
              />
              <span className={styles.cursor} aria-hidden="true">█</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
