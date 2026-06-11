import React, { useEffect, useRef, useState } from 'react';
import { LoaderCircle, FastForward } from 'lucide-react';
import styles from './SimulationOverlay.module.css';

export interface SimulationOverlayProps {
  missionTitle: string | null;
  /** Peak users this stage's system must handle (drives metric targets). */
  userScale: number;
  /** Total runtime before auto-advancing, in ms. */
  durationMs?: number;
  onComplete: () => void;
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Whiteboard overlay shown after a stage's requirements pass.
 * The user's actual design animates underneath (edge traffic, node pulse)
 * while metrics ramp toward their targets, then we hand off to Results.
 */
export const SimulationOverlay: React.FC<SimulationOverlayProps> = ({
  missionTitle,
  userScale,
  durationMs = 8000,
  onComplete,
}) => {
  const [progress, setProgress] = useState(0); // 0..1
  const startRef = useRef<number | null>(null);
  const doneRef = useRef(false);

  useEffect(() => {
    let frame: number;
    const tick = (now: number) => {
      if (startRef.current === null) startRef.current = now;
      const p = Math.min((now - startRef.current) / durationMs, 1);
      setProgress(p);
      if (p < 1) {
        frame = requestAnimationFrame(tick);
      } else if (!doneRef.current) {
        doneRef.current = true;
        onComplete();
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [durationMs, onComplete]);

  const handleSkip = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    onComplete();
  };

  const eased = easeOutCubic(progress);
  const users = Math.round(userScale * eased);
  const rps = Math.round((userScale / 8) * eased);
  const uptime = (95 + 4.9 * eased).toFixed(1);
  const latency = Math.round(250 - 205 * eased);

  return (
    <div className={styles.overlay} role="status" aria-live="polite">
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>
            <LoaderCircle size={20} className={styles.titleIcon} />
            Simulation running
          </h2>
          {missionTitle && <p className={styles.subtitle}>{missionTitle} — traffic flowing through your design</p>}
        </div>
        <button onClick={handleSkip} className={styles.skipButton}>
          <FastForward size={16} /> Skip
        </button>
      </div>

      <div className={styles.metrics}>
        <div className={styles.metric}>
          <p className={styles.metricValue}>{users.toLocaleString()}</p>
          <p className={styles.metricLabel}>Users served</p>
        </div>
        <div className={styles.metric}>
          <p className={styles.metricValue}>{rps.toLocaleString()}</p>
          <p className={styles.metricLabel}>Requests/sec</p>
        </div>
        <div className={styles.metric}>
          <p className={styles.metricValue}>{uptime}%</p>
          <p className={styles.metricLabel}>Uptime</p>
        </div>
        <div className={styles.metric}>
          <p className={styles.metricValue}>{latency}ms</p>
          <p className={styles.metricLabel}>Latency p99</p>
        </div>
      </div>

      <div className={styles.progressTrack}>
        <div className={styles.progressFill} style={{ width: `${progress * 100}%` }} />
      </div>
    </div>
  );
};
