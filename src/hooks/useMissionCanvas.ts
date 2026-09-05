import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { api, ApiError } from '../services/cloudflareApi';
import { useAppDispatch, useAppSelector } from './redux';
import { clearCanvas, restoreGraph, setGameRules, updateRequirementValidationResults } from '../features/design/designSlice';
import { clearDatabaseMission, setDatabaseMission } from '../features/mission/missionSlice';
import { isGraphSnapshot } from '../../shared/game';
import type { CatalogComponent, GameRule, GraphSnapshot } from '../../shared/game';
import type { CompleteStageResponse, MissionStageSummary, ValidationResponse } from '../services/missionService';

interface StagePayload extends MissionStageSummary {
  mission: { id: string; title: string; description: string; slug: string };
  stages: MissionStageSummary[];
  game: { catalog: CatalogComponent[]; rules: GameRule[]; initial: GraphSnapshot };
}
interface DraftResponse { canvasState: GraphSnapshot | null; revision: number; readOnly: boolean; snapshotUnavailable?: boolean }
interface Recovery { baseRevision: number; graph: GraphSnapshot }

export function useMissionCanvas(stageId?: string, emailId?: string) {
  const dispatch = useAppDispatch();
  const userId = useAppSelector(s => s.auth.user?.id);
  const { nodes, edges, canvasViewport, revision: graphRevision } = useAppSelector(s => s.design);
  const [stage, setStage] = useState<StagePayload | null>(null);
  const [phase, setPhase] = useState<'loading' | 'ready' | 'saving' | 'checking' | 'complete' | 'error' | 'conflict'>('loading');
  const [message, setMessage] = useState('');
  const [readOnly, setReadOnly] = useState(false);
  const [completion, setCompletion] = useState<CompleteStageResponse | null>(null);
  const epoch = useRef(0);
  const serverRevision = useRef(0);
  const saved = useRef('');
  const queue = useRef<Promise<void>>(Promise.resolve());
  const locked = useRef(false);
  const key = useRef('');
  const completionKey = useRef(crypto.randomUUID());
  const graph = useMemo<GraphSnapshot>(() => ({ version: 1,
    nodes: nodes.map(n => ({ id: n.id, type: n.type, position: n.position, data: n.data })),
    edges: edges.map(e => ({ id: e.id, source: e.source, target: e.target, sourceHandle: e.sourceHandle, targetHandle: e.targetHandle })),
    viewport: canvasViewport }), [nodes, edges, canvasViewport]);
  const fingerprint = JSON.stringify(graph);
  const live = useRef({ graph, fingerprint, graphRevision });
  live.current = { graph, fingerprint, graphRevision };

  useEffect(() => {
    const generation = ++epoch.current;
    let cancelled = false;
    locked.current = true;
    setStage(null); setCompletion(null); setPhase('loading'); setMessage('');
    dispatch(clearCanvas({}));
    void (async () => {
      let resolved = stageId;
      if (!resolved && emailId) {
        const email = await api.get<{ stage_id: string | null; mission_id: string }>(`/emails/${emailId}`);
        resolved = email.stage_id ?? (await api.get<{ id: string }>(`/missions/first-stage/${email.mission_id}`)).id;
      }
      if (!resolved) throw new Error('Open a mission from your campaign or inbox.');
      const [loaded, draft] = await Promise.all([
        api.get<StagePayload>(`/missions/stage/${resolved}`), api.get<DraftResponse>(`/canvas/${resolved}`),
      ]);
      if (cancelled || epoch.current !== generation) return;
      if (!draft.canvasState || !isGraphSnapshot(draft.canvasState)) throw new Error('This stage is locked. Continue your current stage from the campaign.');
      let initial = draft.canvasState;
      key.current = `canvas-recovery:${userId}:${resolved}`;
      serverRevision.current = draft.revision;
      saved.current = JSON.stringify(initial);
      try {
        const raw = localStorage.getItem(key.current);
        const recovery: Recovery | null = raw ? JSON.parse(raw) : null;
        if (!draft.readOnly && recovery && isGraphSnapshot(recovery.graph)) {
          if (recovery.baseRevision === draft.revision) { initial = recovery.graph; setMessage('Recovered your unsaved changes.'); }
          else { setMessage('A newer server design exists. Your local recovery is preserved; export it before reloading.'); initial = recovery.graph; setPhase('conflict'); }
        }
      } catch { setMessage('Local recovery is unavailable; server saves still work.'); }
      dispatch(setGameRules(loaded.game.rules));
      dispatch(restoreGraph(initial));
      dispatch(setDatabaseMission({ id: loaded.mission.id, title: loaded.mission.title, description: loaded.mission.description,
        slug: loaded.mission.slug, stages: loaded.stages, currentStageIndex: loaded.stage_number - 1 }));
      setStage(loaded); setReadOnly(draft.readOnly);
      if (draft.snapshotUnavailable) setMessage('This stage was completed before design snapshots were recorded. The original graph is unavailable; your completion result is preserved.');
      completionKey.current = crypto.randomUUID();
      locked.current = false;
      setPhase(p => p === 'conflict' ? p : 'ready');
    })().catch(error => {
      if (!cancelled) { setPhase('error'); setMessage(error instanceof Error ? error.message : 'Could not load stage.'); }
    });
    return () => { cancelled = true; epoch.current = generation + 1; locked.current = true; dispatch(clearDatabaseMission()); };
  }, [stageId, emailId, userId, dispatch]);

  const save = useCallback(() => {
    if (!stage || readOnly || locked.current || phase === 'conflict') return queue.current;
    const generation = epoch.current;
    const captured = live.current;
    const task = queue.current.catch(() => {}).then(async () => {
      if (epoch.current !== generation || locked.current || saved.current === captured.fingerprint) return;
      setPhase('saving');
      const result = await api.put<{ revision: number }>('/canvas', { missionId: stage.mission.id, stageId: stage.id,
        canvasState: captured.graph, revision: serverRevision.current });
      if (epoch.current !== generation) return;
      serverRevision.current = result.revision; saved.current = captured.fingerprint;
      try {
        if (live.current.fingerprint === captured.fingerprint) localStorage.removeItem(key.current);
        else localStorage.setItem(key.current, JSON.stringify({ baseRevision: result.revision, graph: live.current.graph }));
      } catch { /* The server save succeeded even when browser storage is unavailable. */ }
      if (!locked.current) { setPhase('ready'); setMessage('Design saved'); }
    });
    queue.current = task;
    void task.catch(error => {
      if (epoch.current !== generation) return;
      setPhase(error instanceof ApiError && error.status === 409 ? 'conflict' : 'error');
      setMessage(error instanceof Error ? error.message : 'Save failed. Your changes remain on this device.');
    });
    return task;
  }, [stage, readOnly, phase]);

  useEffect(() => {
    if (!stage || readOnly || locked.current || fingerprint === saved.current || phase === 'conflict' || phase === 'complete') return;
    try { localStorage.setItem(key.current, JSON.stringify({ baseRevision: serverRevision.current, graph })); }
    catch { setMessage('Browser recovery unavailable. Keep this page open until the server save succeeds.'); }
    if (phase === 'error') return;
    const timer = setTimeout(() => { void save(); }, 1000);
    return () => clearTimeout(timer);
  }, [fingerprint, graph, stage, readOnly, phase, save]);

  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (!readOnly && live.current.fingerprint !== saved.current) { event.preventDefault(); event.returnValue = ''; }
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [readOnly]);

  const check = useCallback(async (finish: boolean) => {
    if (!stage || readOnly || locked.current || phase === 'conflict') return;
    locked.current = true;
    const generation = epoch.current;
    const captured = live.current;
    setPhase('checking'); setMessage('Checking design…');
    try {
      await queue.current;
      const result = await api.post<ValidationResponse>('/missions/validate', { stageId: stage.id, canvasState: captured.graph });
      if (epoch.current !== generation) return;
      dispatch(updateRequirementValidationResults({ revision: captured.graphRevision, requirements: result.requirements,
        summary: { allCompleted: result.summary.allCompleted, completedCount: result.summary.completedRequirements,
          totalCount: result.summary.totalRequirements, percentage: result.summary.completionPercentage } }));
      if (!result.summary.allCompleted || !finish) {
        setMessage(result.summary.allCompleted ? 'All checks pass. Complete this stage when you are ready.' : 'Some checks need attention. See the highlighted requirements.');
        setPhase('ready'); return;
      }
      const completed = await api.post<CompleteStageResponse>('/missions/complete-stage', {
        stageId: stage.id, canvasState: captured.graph, revision: serverRevision.current, idempotencyKey: completionKey.current,
      });
      if (epoch.current !== generation) return;
      saved.current = captured.fingerprint;
      try { localStorage.removeItem(key.current); } catch { /* No local recovery needed after acceptance. */ }
      setCompletion(completed); setPhase('complete'); setReadOnly(true);
    } catch (error) {
      if (epoch.current === generation) {
        setPhase(error instanceof ApiError && error.status === 409 ? 'conflict' : 'error');
        setMessage(error instanceof Error ? error.message : 'Could not check the design. Try again.');
      }
    } finally { if (epoch.current === generation) locked.current = false; }
  }, [stage, readOnly, phase, dispatch]);

  const loadServerVersion = () => {
    try { localStorage.removeItem(key.current); } catch { /* Reload can still retrieve the server version. */ }
    window.location.reload();
  };
  return { stage, graph, phase, message, readOnly, completion, save, check, loadServerVersion, dirty: fingerprint !== saved.current };
}
