import styles from './CrewmateBean.module.css';

type CrewColor = 'teal' | 'red' | 'yellow';

const COLOR_VARS: Record<CrewColor, React.CSSProperties> = {
  teal: {
    '--crew-light': '#00e0e0',
    '--crew-mid': '#008a8a',
    '--crew-dark': '#005f5f',
    '--crew-rgb': '0, 200, 200',
  } as React.CSSProperties,
  red: {
    '--crew-light': '#ff4d6d',
    '--crew-mid': '#c81f3d',
    '--crew-dark': '#6e0e21',
    '--crew-rgb': '232, 40, 74',
  } as React.CSSProperties,
  yellow: {
    '--crew-light': '#ffdb4d',
    '--crew-mid': '#d1a30f',
    '--crew-dark': '#7a5c08',
    '--crew-rgb': '245, 197, 24',
  } as React.CSSProperties,
};

interface CrewmateBeanProps {
  color?: CrewColor;
  scale?: number;
}

export default function CrewmateBean({ color = 'teal', scale = 1 }: CrewmateBeanProps) {
  return (
    <div
      className={styles.cssCrewmate}
      style={{ ...COLOR_VARS[color], transform: scale !== 1 ? `scale(${scale})` : undefined }}
      aria-hidden="true"
    >
      <div className={styles.crewRing} />
      <div className={styles.crewRing2} />
      <div className={styles.crewBody}>
        <div className={styles.crewVisor}>
          <div className={styles.crewVisorShine} />
        </div>
        <div className={styles.crewPack}>
          <div className={styles.crewPackVent} />
        </div>
        <div className={styles.crewLegs}>
          <div className={styles.crewLegL} />
          <div className={styles.crewLegR} />
        </div>
      </div>
      <div className={styles.crewShadow} />
    </div>
  );
}
