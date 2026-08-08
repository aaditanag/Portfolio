'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTerminal } from './TerminalProvider';
import styles from './Navbar.module.css';

const NAV_LINKS = [
  { href: '/',          label: 'ARENA',    icon: '🗺️' },
  { href: '/projects',  label: 'ADMIN',    icon: '📋' },
  { href: '/about',     label: 'MEDBAY',   icon: '🫀' },
  { href: '/tasks',     label: 'ELEC',     icon: '⚡' },
  { href: '/contact',   label: 'NAV',      icon: '📡' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { openTerminal } = useTerminal();

  return (
    <nav className={styles.nav} role="navigation" aria-label="Main navigation">
      <div className={styles.logo}>
        <span className={styles.logoIcon}>🫘</span>
        <span className={styles.logoText}>CREWMATE_AADITA</span>
      </div>

      <ul className={styles.links} role="list">
        {NAV_LINKS.map(({ href, label, icon }) => (
          <li key={href}>
            <Link
              href={href}
              className={`${styles.link} ${pathname === href ? styles.active : ''}`}
              aria-current={pathname === href ? 'page' : undefined}
            >
              <span className={styles.linkIcon}>{icon}</span>
              <span className={styles.linkLabel}>{label}</span>
              {pathname === href && <span className={styles.activeDot} aria-hidden="true" />}
            </Link>
          </li>
        ))}
      </ul>

      <button
        className={styles.terminalBtn}
        onClick={openTerminal}
        aria-label="Open terminal"
      >
        <span>{'>'}_</span>
        <span className={styles.termBtnLabel}>TERMINAL</span>
      </button>
    </nav>
  );
}
