'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { GitBranch, Link, Mail, Send, CheckCircle } from 'lucide-react';

import styles from './page.module.css';

const SOCIALS = [
  { id: 'github',   label: 'GitHub',   icon: GitBranch, href: 'https://github.com/aaditanag', color: 'var(--teal)' },
  { id: 'linkedin', label: 'LinkedIn', icon: Link,      href: 'https://www.linkedin.com/in/aadita-nag-a49bb1278/', color: 'var(--yellow)' },
  { id: 'email',    label: 'Email',    icon: Mail,      href: 'mailto:aaditanag@gmail.com', color: 'var(--red)' },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSending(true);
    // Simulate send via mailto
    const subject = encodeURIComponent(`Portfolio contact from ${form.name}`);
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`);
    window.open(`mailto:aaditanag@gmail.com?subject=${subject}&body=${body}`);
    setTimeout(() => {
      setSending(false);
      setSent(true);
    }, 800);
  };

  return (
    <div className={styles.page}>
      {/* Header */}
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className={styles.roomTag}>📡 NAVIGATION · COMMUNICATIONS</div>
        <h1 className={styles.title}>
          OPEN <span style={{ color: 'var(--teal)' }}>COMMS</span>
        </h1>
        <p className={styles.subtitle}>Hailing frequency open. No impostors, please.</p>
      </motion.div>

      <div className={styles.layout}>
        {/* Form */}
        <motion.div
          className={styles.formCard}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          {sent ? (
            <div className={styles.successState}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 12 }}
              >
                <CheckCircle size={48} color="var(--teal)" />
              </motion.div>
              <h2 className={styles.successTitle}>MESSAGE SENT!</h2>
              <p className={styles.successSub}>Your mail client should have opened. I&apos;ll respond within 24 solar cycles.</p>
              <button className="btn btn-ghost" onClick={() => { setSent(false); setForm({ name: '', email: '', message: '' }); }}>
                SEND ANOTHER
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.form} noValidate>
              <div className={styles.formHeader}>
                <span className={styles.formTitle}>NEW TRANSMISSION</span>
                <span className={styles.formSubtitle}>All fields required</span>
              </div>

              <div className={styles.field}>
                <label htmlFor="contact-name" className={styles.label}>CREWMATE NAME</label>
                <input
                  id="contact-name"
                  type="text"
                  className={styles.input}
                  placeholder="Your name"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  required
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="contact-email" className={styles.label}>HAILING FREQUENCY (EMAIL)</label>
                <input
                  id="contact-email"
                  type="email"
                  className={styles.input}
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  required
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="contact-message" className={styles.label}>TRANSMISSION</label>
                <textarea
                  id="contact-message"
                  className={`${styles.input} ${styles.textarea}`}
                  placeholder="What's on your mind, crewmate?"
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  required
                  rows={5}
                />
              </div>

              <button
                type="submit"
                className={`btn btn-teal ${styles.submitBtn}`}
                disabled={sending}
              >
                {sending ? (
                  <span className={styles.sendingAnim}>TRANSMITTING...</span>
                ) : (
                  <><Send size={14} /> SEND TRANSMISSION</>
                )}
              </button>
            </form>
          )}
        </motion.div>

        {/* Socials + info */}
        <motion.div
          className={styles.infoPanel}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div className={styles.infoCard}>
            <h2 className={styles.infoTitle}>FIND ME IN THE SHIP</h2>
            <div className={styles.socials}>
              {SOCIALS.map(({ id, label, icon: Icon, href, color }) => (
                <a
                  key={id}
                  id={`social-${id}`}
                  href={href}
                  className={styles.socialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ '--social-color': color } as React.CSSProperties}
                >
                  <span className={styles.socialIcon} style={{ color }}>
                    <Icon size={18} />
                  </span>
                  <div>
                    <div className={styles.socialLabel} style={{ color }}>{label}</div>
                    <div className={styles.socialSub}>{href.replace('https://', '').replace('mailto:', '')}</div>
                  </div>
                  <span className={styles.socialArrow}>→</span>
                </a>
              ))}
            </div>
          </div>

          <div className={styles.availCard}>
            <div className={styles.availDot} />
            <div>
              <div className={styles.availTitle}>AVAILABLE FOR MISSIONS</div>
              <div className={styles.availSub}>Open to freelance, full-time, or co-founder opportunities.</div>
            </div>
          </div>

          <div className={styles.tipCard}>
            <span className={styles.tipIcon}>💡</span>
            <div>
              <div className={styles.tipTitle}>TIP</div>
              <p className={styles.tipText}>You can also reach me via the terminal. Type <code>contact</code> or <code>email</code>.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
