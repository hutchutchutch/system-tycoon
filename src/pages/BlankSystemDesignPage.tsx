import { useEffect, useState } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { GameCanvasEditor } from '../components/organisms/GameCanvasEditor';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { restoreGraph, setGameRules, addNode } from '../features/design/designSlice';
import { api } from '../services/cloudflareApi';
import { emptyGraph, gameCost, isGraphSnapshot } from '../../shared/game';
import type { CatalogComponent, GraphSnapshot } from '../../shared/game';

function PracticeCanvas() {
  const dispatch = useAppDispatch();
  const userId = useAppSelector(s => s.auth.user?.id);
  const { nodes, edges, canvasViewport } = useAppSelector(s => s.design);
  const [catalog, setCatalog] = useState<CatalogComponent[]>([]);
  const [title, setTitle] = useState('My system design');
  const [loaded, setLoaded] = useState(false);
  const [status, setStatus] = useState('Loading component library…');
  const storageKey = `practice-canvas:${userId}`;

  useEffect(() => {
    let cancelled = false;
    setLoaded(false);
    void api.get<CatalogComponent[]>('/game/components').then(components => {
      if (cancelled) return;
      setCatalog(components);
      let initial = emptyGraph();
      try {
        const raw = localStorage.getItem(storageKey);
        const saved: { title?: string; graph?: unknown } | null = raw ? JSON.parse(raw) : null;
        if (saved && isGraphSnapshot(saved.graph)) {
          initial = saved.graph;
          setTitle(saved.title ?? 'My system design');
        }
      } catch { setStatus('Local storage is unavailable. Export your work before leaving.'); }
      dispatch(setGameRules([]));
      dispatch(restoreGraph(initial));
      setLoaded(true);
    }).catch(() => { if (!cancelled) setStatus('Could not load the component library. Reload to try again.'); });
    return () => { cancelled = true; };
  }, [dispatch, storageKey]);

  const graph: GraphSnapshot = { version: 1, nodes: nodes.map(n => ({ id: n.id, type: n.type, position: n.position, data: n.data })),
    edges: edges.map(e => ({ id: e.id, source: e.source, target: e.target, sourceHandle: e.sourceHandle, targetHandle: e.targetHandle })), viewport: canvasViewport };
  const serialized = JSON.stringify({ title, graph });
  useEffect(() => {
    if (!loaded) return;
    try { localStorage.setItem(storageKey, serialized); setStatus('Saved on this device'); }
    catch { setStatus('Local save failed. Export your work before leaving.'); }
  }, [serialized, storageKey, loaded]);

  const exportDesign = () => {
    const url = URL.createObjectURL(new Blob([JSON.stringify(graph, null, 2)], { type: 'application/json' }));
    const link = document.createElement('a'); link.href = url; link.download = 'practice-design.json'; link.click(); URL.revokeObjectURL(url);
  };
  return <main style={{ padding: 16 }}>
    <h1>Practice whiteboard</h1>
    <p>Explore your own idea with the full component library. Practice is saved on this device; it does not generate story missions or award Impact.</p>
    <label>Project title <input style={{ fontSize: 16, minHeight: 44 }} value={title} maxLength={120} onChange={e => setTitle(e.target.value)} /></label>
    <p>{gameCost(nodes)} game credits/month · Estimates are game rules, not provider pricing.</p>
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
      <button style={{ minHeight: 44 }} disabled={!loaded} onClick={() => dispatch(addNode({ component: {},
        nodeData: { role: 'client', category: 'stakeholder', label: 'Users', cost: 0 }, position: { x: 100, y: 100 } }))}>Add traffic source</button>
      <button style={{ minHeight: 44 }} disabled={!loaded} onClick={exportDesign}>Export design</button>
      <label>Import design <input type="file" accept=".json,application/json" disabled={!loaded} onChange={async e => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
          if (file.size > 512_000) throw new Error('Choose a design smaller than 512 KB.');
          const imported: unknown = JSON.parse(await file.text());
          if (!isGraphSnapshot(imported)) throw new Error('This file is not a valid version 1 design.');
          if (!window.confirm('Replace this practice design? Export the current design first if you need to keep it.')) return;
          dispatch(restoreGraph(imported));
        } catch (error) { setStatus(error instanceof Error ? error.message : 'Could not import design.'); }
        e.target.value = '';
      }} /></label>
    </div>
    <p role="status">{status}</p>
    {loaded && <div style={{ height: '70vh', minHeight: 520 }}><GameCanvasEditor catalog={catalog} /></div>}
  </main>;
}
export function BlankSystemDesignPage() {
  return <ReactFlowProvider><PracticeCanvas /></ReactFlowProvider>;
}
