'use client';
import { motion } from 'framer-motion';
import { ExternalLink, GitBranch as Github, Zap } from 'lucide-react';
import CrewmateBean from '@/components/CrewmateBean';
import styles from './page.module.css';

const PROJECTS = [
  {
    id: 'proj-01',
    code: 'TASK-01',
    title: 'ML-Driven-Smart-Helmet-with-Predictive-Impact-Airbag-System',
    description: 'An untethered, self-contained smart helmet module that continuously captures IMU data at 1000 Hz, classifies the rider state using ML, and deploys an airbag in under 20 ms of a crash event.',
    tags: ['Python', 'Jupyter Notebook', 'ML models', 'Hardware'],
    status: 'ONGOING',
    statusColor: 'var(--teal)',
    liveUrl: 'https://github.com/aaditanag/ML-Driven-Smart-Helmet-with-Predictive-Impact-Airbag-System',
    repoUrl: 'https://github.com/aaditanag/ML-Driven-Smart-Helmet-with-Predictive-Impact-Airbag-System',
    color: 'var(--teal)',
    glow: 'var(--teal-glow)',
    dim: 'var(--teal-dim)',
  },
  {
    id: 'proj-02',
    code: 'TASK-02',
    title: 'AI-Traffic-Violation-Detection-with-Echallan-system',
    description: 'AI automated Traffic violation detection using YOLO ver 8, number plate detect using EasyOCR and then redirecting to a automatic e challan system.',
    tags: ['Python', 'Javascript', 'TensorFlow', 'HTML/CSS'],
    status: 'Completed',
    statusColor: 'var(--yellow)',
    liveUrl: 'https://github.com/aaditanag/AI-Traffic-Violation-Detection-with-Echallan-system',
    repoUrl: 'https://github.com/aaditanag/AI-Traffic-Violation-Detection-with-Echallan-system',
    color: 'var(--yellow)',
    glow: 'var(--yellow-glow)',
    dim: 'var(--yellow-dim)',
  },
  {
    id: 'proj-03',
    code: 'TASK-03',
    title: 'Hospital_Management_System',
    description: 'Project on Hospital management, Its a Hospital Management System web application that allows Admins, Doctors, and Patients to interact with the system based on their roles.',
    tags: ['Python', 'Flask', 'Sqlite3'],
    status: 'COMPLETED',
    statusColor: 'var(--red)',
    liveUrl: 'https://github.com/aaditanag/Hospital_Management_23f2000181',
    repoUrl: 'https://github.com/aaditanag/Hospital_Management_23f2000181',
    color: 'var(--red)',
    glow: 'var(--red-glow)',
    dim: 'var(--red-dim)',
  },
  {
    id: 'proj-04',
    code: 'TASK-04',
    title: 'College-Hackathon-Website',
    description: 'A college hackathon interface where admin can control all functions, add problem statements, and students can register and participate!',
    tags: ['Next.js', 'Tailwind CSS'],
    status: 'Deployed',
    statusColor: 'var(--teal)',
    liveUrl: 'https://svit-hackathon.vercel.app/',
    repoUrl: 'https://github.com/aaditanag/College-Hackathon-Website',
    color: 'var(--teal)',
    glow: 'var(--teal-glow)',
    dim: 'var(--teal-dim)',
  },
  {
    id: 'proj-05',
    code: 'TASK-05',
    title: 'Sthavishtah-WebPortal',
    description: 'WebPortal For a Business',
    tags: ['Typescript', 'SCSS'],
    status: 'Deployed',
    statusColor: 'var(--yellow)',
    liveUrl: 'https://www.sthavishtah.com/',
    repoUrl: 'https://github.com/sthavishtah1234/Sthavishtah-WebPortal',
    color: 'var(--yellow)',
    glow: 'var(--yellow-glow)',
    dim: 'var(--yellow-dim)',
  },
  {
    id: 'proj-06',
    code: 'TASK-06',
    title: 'This Portfolio',
    description: 'You\'re looking at it. An Among Us-themed developer portfolio with CSS-animated crewmates, a live terminal, and mini-game tasks.',
    tags: ['Next.js', 'Framer Motion', 'CSS Modules'],
    status: 'YOU ARE HERE',
    statusColor: 'var(--red)',
    liveUrl: '/',
    repoUrl: 'https://github.com/aaditanag/Portfolio',
    color: 'var(--red)',
    glow: 'var(--red-glow)',
    dim: 'var(--red-dim)',
  },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

export default function ProjectsPage() {
  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <motion.div
          className={styles.headerContent}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className={styles.roomTag}>📋 ADMIN ROOM</div>
          <h1 className={styles.title}>
            PROJECT <span style={{ color: 'var(--teal)' }}>MANIFEST</span>
          </h1>
          <p className={styles.subtitle}>Tasks completed. Evidence of work.</p>
        </motion.div>

        {/* Red crewmate */}
        <motion.div
          className={styles.crewmateCorner}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <CrewmateBean color="red" scale={0.62} />
        </motion.div>
      </div>

      {/* Projects Grid */}
      <motion.div
        className={styles.grid}
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {PROJECTS.map((project) => (
          <motion.article
            key={project.id}
            id={project.id}
            className={styles.card}
            variants={cardVariants}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            style={{ '--card-color': project.color, '--card-glow': project.glow, '--card-dim': project.dim } as React.CSSProperties}
          >
            <div className={styles.cardHeader}>
              <div className={styles.cardCode}>{project.code}</div>
              <div className={styles.cardStatus} style={{ color: project.statusColor }}>
                <Zap size={10} />
                {project.status}
              </div>
            </div>

            <h3 className={styles.cardTitle}>{project.title}</h3>
            <p className={styles.cardDesc}>{project.description}</p>

            <div className={styles.cardTags}>
              {project.tags.map(tag => (
                <span key={tag} className={styles.cardTag}>{tag}</span>
              ))}
            </div>

            <div className={styles.cardActions}>
              {project.liveUrl && project.liveUrl !== '#' && (
                <a
                  href={project.liveUrl}
                  className={styles.cardAction}
                  target={project.liveUrl.startsWith('http') ? '_blank' : '_self'}
                  rel="noopener noreferrer"
                  aria-label={`View ${project.title} live`}
                >
                  <ExternalLink size={14} /> LIVE
                </a>
              )}
              {project.repoUrl && project.repoUrl !== '#' && (
                <a
                  href={project.repoUrl}
                  className={styles.cardAction}
                  target={project.repoUrl.startsWith('http') ? '_blank' : '_self'}
                  rel="noopener noreferrer"
                  aria-label={`View ${project.title} on GitHub`}
                >
                  <Github size={14} /> REPO
                </a>
              )}
            </div>

            {/* Glow line at bottom */}
            <div className={styles.cardGlowLine} />
          </motion.article>
        ))}
      </motion.div>
    </div>
  );
}
