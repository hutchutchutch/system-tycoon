import { useEffect, useRef, useState } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMissionCanvas } from '../../hooks/useMissionCanvas';
import { useAppSelector } from '../../hooks/redux';
import { GameCanvasEditor } from '../../components/organisms/GameCanvasEditor';
import { MentorChat } from '../../components/organisms/MentorChat/MentorChat';
import { gameCost } from '../../../shared/game';
import styles from './MissionCanvas.module.css';

function MissionCanvas() {
  const { stageId, emailId } = useParams<{ stageId: string; emailId: string }>();
  const session = useMissionCanvas(stageId, emailId);
  const navigate = useNavigate();
  const requirements = useAppSelector(s => s.design.requirementValidationResults);
  const allMet = useAppSelector(s => s.design.allRequirementsMet);
  const [seconds, setSeconds] = useState<number | null>(null);
  const checkRef = useRef(session.check);
  checkRef.current = session.check;
  const busy = session.phase === 'checking' || session.phase === 'loading';
  const readonly = session.readOnly || busy || session.phase === 'conflict';

  useEffect(() => { setSeconds(null); }, [stageId, emailId]);
  useEffect(() => {
    if (seconds === null || session.readOnly) return;
    if (seconds === 0) { setSeconds(null); void checkRef.current(false); return; }
    const timer = setInterval(() => {
      if (!document.hidden) setSeconds(s => s === null ? null : Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [seconds, session.readOnly]);

  useEffect(() => {
    if (!session.completion || !session.stage) return;
    navigate(`/results/stage/${session.stage.id}`, { replace: true, state: { completion: session.completion,
      context: { emailId: emailId ?? null, stageTitle: session.stage.title, missionTitle: session.stage.mission.title } } });
  }, [session.completion, session.stage, navigate, emailId]);

  const exportRecovery = () => {
    const blob = new Blob([JSON.stringify(session.graph, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'design-recovery.json'; anchor.click(); URL.revokeObjectURL(url);
  };
  if (!session.stage) return <div className={styles.page} role="status">
    <p>{session.message || 'Loading mission and saved design…'}</p>
    {session.phase === 'error' && <><button onClick={() => window.location.reload()}>Retry loading</button><Link to="/game">Campaign</Link></>}
  </div>;
  const stage = session.stage;
  const budget = stage.game.rules.find(r => r.requirement_type === 'cost_constraint')?.validation_config.max_monthly_cost;
  return <main className={styles.page}>
    <header className={styles.heading}>
      <div><Link to="/game">← Campaign</Link><h1>{stage.mission.title}</h1>
        <p>Stage {stage.stage_number} of {stage.stages.length} · {stage.title}</p></div>
      <div className={styles.cost}><strong>{gameCost(session.graph.nodes)} credits/mo</strong>
        <span>{budget !== undefined ? `Budget: ${budget} credits/mo` : 'Game cost · not a vendor price quote'}</span></div>
    </header>
    <div className={styles.status} role="status" aria-live="polite">
      {session.readOnly ? session.message || 'Completed design — review only.'
        : session.phase === 'saving' ? 'Saving…'
        : session.phase === 'ready' && session.dirty ? 'Unsaved changes — saving shortly…'
        : session.message || 'Ready'}
      {session.phase === 'error' && <button onClick={() => void session.save()}>Retry save</button>}
      {session.phase === 'conflict' && <><button onClick={exportRecovery}>Export local design</button>
        <button onClick={session.loadServerVersion}>Discard local recovery and load server version</button></>}
    </div>
    <div className={styles.layout}>
      <aside className={styles.brief}>
        <h2>Your brief</h2><p>{stage.problem_description}</p>
        <p>Keep the working design from the previous stage. Arrows show the direction of requests and data.</p>
        <h2>Design checks</h2>
        <ul>{requirements.map(r => <li key={r.id}>
          <strong>{r.completed ? '✓ ' : '○ '}{r.description}</strong>
          {!r.completed && <span>{r.message}</span>}
        </li>)}</ul>
        {!session.readOnly && <div className={styles.actions}>
          <button disabled={readonly} onClick={() => void session.check(false)}>{busy ? 'Checking…' : 'Check design'}</button>
          <button disabled={readonly || !allMet} onClick={() => void session.check(true)}>Complete stage</button>
          <button disabled={readonly} onClick={() => setSeconds(s => s === null ? 180 : null)}>
            {seconds === null ? 'Start optional 3-minute challenge' : `Stop challenge · ${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`}
          </button>
          <small>The challenge pauses when this tab is hidden. Time running out checks your design; it does not remove progress.</small>
        </div>}
        {session.readOnly && <Link to={`/results/stage/${stage.id}`}>View completion results</Link>}
      </aside>
      <GameCanvasEditor catalog={stage.game.catalog} disabled={readonly} />
    </div>
    <MentorChat key={stage.id} missionStageId={stage.id} missionTitle={stage.mission.title} problemDescription={stage.problem_description ?? undefined} />
  </main>;
}
export const MissionWhiteboard = () => <ReactFlowProvider><MissionCanvas /></ReactFlowProvider>;
export const CrisisSystemDesignCanvas = MissionWhiteboard;
