'use client';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import CrewmateBean from '@/components/CrewmateBean';
import styles from './page.module.css';

const SKILLS = [
  { category: 'FRONTEND', color: 'var(--teal)', items: ['React', 'Next.js', 'TypeScript', 'CSS Modules', 'Framer Motion', 'Three.js'] },
  { category: 'BACKEND', color: 'var(--red)', items: ['Node.js', 'Python', 'FastAPI', 'GraphQL', 'REST APIs', 'WebSockets'] },
  { category: 'DATA', color: 'var(--yellow)', items: ['PostgreSQL', 'MongoDB', 'Redis', 'Prisma', 'SQL', 'Firebase'] },
  { category: 'DEVOPS', color: 'var(--teal)', items: ['Docker', 'GitHub Actions', 'Vercel', 'AWS', 'Linux', 'nginx'] },
];

const TIMELINE = [
  { year: 'INTERNSHIP', title: 'Social Media Manager & Content Lead', place: 'GO-BRICS Business Lab · Remote (St. Petersburg)', color: 'var(--teal)', desc: 'Managed content creation and led social media strategies for international business initiatives.' },
  { year: '2026-PRESENT', title: 'Treasurer · Coding Club', place: 'Sai Vidya Institute of Technology', color: 'var(--yellow)', desc: 'Managing finances, organizing tech workshops, and driving coding initiatives across campus.' },
  { year: '2025-2026', title: 'Webops Team Lead', place: 'Pichavaram House · IIT Madras', color: 'var(--teal)', desc: 'Leading technical operations for the Webops department, aligning academic data science with practical tech solutions.' },
  { year: '2025-26', title: 'Event Coordinator & Management', place: 'Paradox · IIT Madras', color: 'var(--red)', desc: 'Handling event planning, logistics, and execution for major cultural and technical flagship events.' },
  { year: 'ACADEMICS', title: 'Dual Degree Candidate', place: 'IIT Madras & SVIT', color: 'var(--teal)', desc: 'Pursuing BS in Data Science & Applications at IIT Madras and BE in Computer Science at SVIT.' },
];

function TimelineItem({ item, index }: { item: typeof TIMELINE[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      className={styles.timelineItem}
      initial={{ opacity: 0, x: -30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className={styles.timelineDot} style={{ background: item.color, boxShadow: `0 0 12px ${item.color}` }} />
      <div className={styles.timelineContent}>
        <div className={styles.timelineYear} style={{ color: item.color }}>{item.year}</div>
        <div className={styles.timelineTitle}>{item.title}</div>
        <div className={styles.timelinePlace}>{item.place}</div>
        <p className={styles.timelineDesc}>{item.desc}</p>
      </div>
    </motion.div>
  );
}

export default function AboutPage() {
  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <motion.div
          className={styles.splinePanel}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <div className={styles.splineGlow} />
          <CrewmateBean color="yellow" />
        </motion.div>

        <motion.div
          className={styles.bioPanel}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div className={styles.roomTag}>🫀 MEDBAY · CREW SCAN</div>
          <h1 className={styles.heroTitle}>
            CREWMATE<span style={{ color: 'var(--yellow)' }}>_AADITA</span>
          </h1>
          <p className={styles.heroRole}>Full-Stack Developer & Data Science Student</p>
          <div className={styles.bioText}>
            <p>
              Currently pursuing a Bachelor of Science in Data Science and Applications at IIT Madras and a Bachelor of Engineering in Computer Science at Sai Vidya Institute of Technology. I contribute to technical operations, aligning my academic focus with practical applications in technology and data-driven solutions.
            </p>
            <p>
              My experience includes event coordination and management roles at Paradox, IIT Madras, as well as leadership as Treasurer of the Coding Club at Sai Vidya Institute of Technology. As a passionate fresher focused on event planning, creativity, and collaboration, I strive to contribute to projects that blend technology and innovation.
            </p>
            <p>
              I love the intersection of design and engineering — the place where a beautifully architected system meets a UI that makes people smile. If you've completed the wire task, you already know: I sweat the details.
            </p>
            <p>
              When I&apos;m not coding, I&apos;m probably sketching interfaces on paper, playing
              strategy games, or pretending I didn&apos;t just get voted off. 👁️
            </p>
          </div>

          <div className={styles.bioStats}>
            <div className={styles.bioStat}>
              <span style={{ color: 'var(--teal)' }} className={styles.bioStatNum}>Fresher</span>
              <span>Level</span>
            </div>
            <div className={styles.bioStat}>
              <span style={{ color: 'var(--yellow)' }} className={styles.bioStatNum}>2</span>
              <span>Degrees</span>
            </div>
            <div className={styles.bioStat}>
              <span style={{ color: 'var(--red)' }} className={styles.bioStatNum}>∞</span>
              <span>Bugs Fixed</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Skills */}
      <section className={styles.skillsSection}>
        <motion.h2
          className={styles.sectionTitle}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          SKILL <span style={{ color: 'var(--teal)' }}>MANIFEST</span>
        </motion.h2>

        <div className={styles.skillsGrid}>
          {SKILLS.map((group, gi) => (
            <motion.div
              key={group.category}
              className={styles.skillGroup}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: gi * 0.1 }}
              style={{ '--skill-color': group.color } as React.CSSProperties}
            >
              <div className={styles.skillGroupLabel} style={{ color: group.color }}>{group.category}</div>
              <div className={styles.skillChips}>
                {group.items.map(item => (
                  <span key={item} className={styles.skillChip}>{item}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className={styles.timelineSection}>
        <motion.h2
          className={styles.sectionTitle}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          MISSION <span style={{ color: 'var(--yellow)' }}>HISTORY</span>
        </motion.h2>

        <div className={styles.timeline}>
          <div className={styles.timelineLine} />
          {TIMELINE.map((item, i) => (
            <TimelineItem key={item.year} item={item} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
