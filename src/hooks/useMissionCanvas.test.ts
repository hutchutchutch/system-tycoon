// @vitest-environment jsdom
import { act, createElement, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useMissionCanvas } from './useMissionCanvas';
import design, { addNode, clearDesign, updateViewport } from '../features/design/designSlice';
import mission from '../features/mission/missionSlice';
import { emptyGraph } from '../../shared/game';
import { ApiError } from '../services/cloudflareApi';

const mocks = vi.hoisted(() => ({ get: vi.fn(), put: vi.fn(), post: vi.fn() }));
vi.mock('../services/cloudflareApi', () => ({ api: mocks, ApiError: class extends Error {
  status: number;
  constructor(message: string, status: number) { super(message); this.status = status; }
} }));

function makeStore() {
  return configureStore({ reducer: { design, mission, auth: () => ({ user: { id: 'alice' } }) } });
}
function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (error: Error) => void;
  const promise = new Promise<T>((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}
function stagePayload(id = 'stage-m2-001') {
  return { id, stage_number: 1, title: 'Triage', problem_description: 'Help families', mission: { id: 'mission', title: 'School', description: '', slug: 'school' },
    stages: [{ id, stage_number: 1, title: 'Triage' }], game: { catalog: [], rules: [], initial: emptyGraph() } };
}
const passed = { requirements: [], summary: { allCompleted: true, completedRequirements: 1, totalRequirements: 1, completionPercentage: 100 } };
let store: ReturnType<typeof makeStore>;
let root: ReturnType<typeof createRoot>;
let latest: ReturnType<typeof useMissionCanvas>;
function Harness({ stageId }: { stageId: string }) {
  latest = useMissionCanvas(stageId);
  return createElement('output', null, latest.phase);
}
async function render(stageId = 'stage-m2-001') {
  await act(async () => { root.render(createElement(StrictMode, null, createElement(Provider, { store, children: createElement(Harness, { stageId }) }))); });
}
function add(label = 'Web Server') {
  store.dispatch(addNode({ component: { id: 'web_server', category: 'compute', cost: 50, name: label }, position: { x: 100, y: 100 } }));
}
beforeEach(() => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
  vi.useFakeTimers();
  localStorage.clear();
  mocks.get.mockReset().mockImplementation(async (path: string) => path.startsWith('/missions/stage/') ? stagePayload(path.split('/').pop())
    : { canvasState: emptyGraph(), revision: 0, readOnly: false });
  mocks.put.mockReset().mockResolvedValue({ revision: 1 });
  mocks.post.mockReset().mockImplementation(async (path: string) => path.endsWith('/validate') ? passed : { success: true });
  store = makeStore();
  root = createRoot(document.createElement('div'));
});
afterEach(async () => {
  await act(async () => root.unmount());
  vi.useRealTimers(); vi.unstubAllGlobals();
});

describe('mission canvas lifecycle', () => {
  it('loads once without re-seeding an empty saved graph, then preserves unsaved edits and viewport on remount', async () => {
    await render();
    expect(latest.phase).toBe('ready');
    expect(latest.graph.nodes).toEqual([]);
    await act(async () => { add(); store.dispatch(updateViewport({ x: 73, y: 44, zoom: 0.6 })); });
    expect(localStorage.getItem('canvas-recovery:alice:stage-m2-001')).toContain('Web Server');
    await act(async () => root.unmount());
    root = createRoot(document.createElement('div'));
    store = makeStore();
    await render();
    expect(latest.graph.nodes).toHaveLength(1);
    expect(latest.graph.viewport).toEqual({ x: 73, y: 44, zoom: 0.6 });
    expect(latest.message).toBe('Recovered your unsaved changes.');
  });

  it('saves a deletion to an empty graph and removes recovery only after acknowledgement', async () => {
    await render();
    await act(async () => add());
    await act(async () => vi.advanceTimersByTimeAsync(1000));
    expect(mocks.put).toHaveBeenCalledTimes(1);
    expect(latest.dirty).toBe(false);
    await act(async () => store.dispatch(clearDesign()));
    await act(async () => vi.advanceTimersByTimeAsync(1000));
    expect(mocks.put.mock.calls[1][1]).toMatchObject({ revision: 1, canvasState: { nodes: [], edges: [] } });
    expect(localStorage.getItem('canvas-recovery:alice:stage-m2-001')).toBeNull();
  });

  it('waits for an in-flight save and completes the latest graph with the acknowledged revision', async () => {
    const saving = deferred<{ revision: number }>();
    mocks.put.mockImplementationOnce(() => saving.promise);
    await render();
    await act(async () => add());
    await act(async () => vi.advanceTimersByTimeAsync(1000));
    await act(async () => add('Replica'));
    let completion!: Promise<void>;
    await act(async () => { completion = latest.check(true); });
    expect(latest.phase).toBe('checking');
    expect(mocks.post).not.toHaveBeenCalled();
    await act(async () => { saving.resolve({ revision: 7 }); await completion; });
    expect(mocks.post.mock.calls[1][1].canvasState.nodes).toHaveLength(2);
    expect(mocks.post.mock.calls[1][1].revision).toBe(7);
    expect(latest.phase).toBe('complete');
    expect(latest.readOnly).toBe(true);
  });

  it('completes before the autosave debounce without losing the current design', async () => {
    await render();
    await act(async () => add());
    await act(async () => latest.check(true));
    expect(mocks.put).not.toHaveBeenCalled();
    expect(mocks.post.mock.calls[1][1]).toMatchObject({ revision: 0, canvasState: { nodes: [expect.objectContaining({ data: expect.objectContaining({ componentId: 'web_server' }) })] } });
  });

  it('preserves local edits on conflict and never automatically overwrites the server version', async () => {
    mocks.put.mockRejectedValue(new ApiError('A newer design exists', 409));
    await render();
    await act(async () => add());
    await act(async () => vi.advanceTimersByTimeAsync(1000));
    expect(latest.phase).toBe('conflict');
    await act(async () => vi.advanceTimersByTimeAsync(10_000));
    expect(mocks.put).toHaveBeenCalledTimes(1);
    expect(localStorage.getItem('canvas-recovery:alice:stage-m2-001')).toContain('Web Server');
  });

  it('stops automatic retries after network failure and permits explicit retry', async () => {
    mocks.put.mockRejectedValueOnce(new Error('Offline'));
    await render();
    await act(async () => add());
    await act(async () => vi.advanceTimersByTimeAsync(1000));
    expect(latest.phase).toBe('error');
    await act(async () => vi.advanceTimersByTimeAsync(10_000));
    expect(mocks.put).toHaveBeenCalledTimes(1);
    await act(async () => latest.save());
    expect(latest.phase).toBe('ready');
    expect(latest.dirty).toBe(false);
  });

  it('ignores a late load from the previous route', async () => {
    const old = deferred<ReturnType<typeof stagePayload>>();
    mocks.get.mockImplementation(async (path: string) => path === '/missions/stage/old' ? old.promise
      : path.startsWith('/missions/stage/') ? stagePayload(path.split('/').pop()) : { canvasState: emptyGraph(), revision: 0, readOnly: false });
    await render('old');
    await render('new');
    await act(async () => add('New stage design'));
    await act(async () => old.resolve(stagePayload('old')));
    expect(latest.stage?.id).toBe('new');
    expect(latest.graph.nodes[0].data.label).toBe('New stage design');
  });
});
