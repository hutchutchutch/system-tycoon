import { useEffect, useMemo, useRef, useState } from 'react';
import { ReactFlow, Controls, Background, Handle, Position, useReactFlow } from '@xyflow/react';
import type { Connection, NodeProps, Node } from '@xyflow/react';
import { Server, Users, Database, Shield, HardDrive, Network, Activity, Zap } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { useTheme } from '../../hooks/useTheme';
import { addNode, addEdge, onNodesChange, onEdgesChange, reconnectEdge, undo, redo, updateViewport, updateNode, deleteNode, deleteEdge } from '../../features/design/designSlice';
import type { DesignNodeData } from '../../features/design/designSlice';
import type { CatalogComponent } from '../../../shared/game';
import styles from './GameCanvasEditor.module.css';
import '@xyflow/react/dist/style.css';

const icons = { compute: Server, database: Database, storage: HardDrive, networking: Network, security: Shield, observability: Activity, cache: Zap, stakeholder: Users };
function GameNode({ id, data, selected, isConnectable }: NodeProps<Node<DesignNodeData>>) {
  const Icon = icons[data.category as keyof typeof icons] ?? Server;
  const client = data.role === 'client';
  return <div className={`${styles.node} ${selected ? styles.selected : ''} ${data.status === 'broken' ? styles.broken : ''}`}>
    {!client && <Handle type="target" position={Position.Left} id={`${id}-input`} isConnectable={isConnectable} />}
    <Icon size={22} aria-hidden="true" />
    <strong>{data.label ?? data.name ?? 'Component'}</strong>
    <small>{client ? 'Traffic source' : data.status === 'broken' ? 'Broken — replace and retire' : data.category}</small>
    <Handle type="source" position={Position.Right} id={`${id}-output`} isConnectable={isConnectable} />
  </div>;
}
const nodeTypes = { custom: GameNode, user: GameNode };

export function GameCanvasEditor({ catalog, disabled = false }: { catalog: CatalogComponent[]; disabled?: boolean }) {
  const dispatch = useAppDispatch();
  const { nodes, edges, past, future, canvasViewport, requirementValidationResults } = useAppSelector(s => s.design);
  const { screenToFlowPosition, setViewport, fitView } = useReactFlow();
  const { theme } = useTheme();
  const surface = useRef<HTMLDivElement>(null);
  const [source, setSource] = useState('');
  const [target, setTarget] = useState('');
  const [connectionMessage, setConnectionMessage] = useState('');
  const [catalogOpen, setCatalogOpen] = useState(true);
  const [search, setSearch] = useState('');
  const selected = nodes.find(n => n.selected);
  const selectedEdge = edges.find(e => e.selected);
  const warned = useMemo(() => new Set(requirementValidationResults.filter(r => !r.completed).flatMap(r => r.nodeIds ?? [])), [requirementValidationResults]);
  const shownNodes = useMemo(() => nodes.map(n => ({ ...n,
    className: warned.has(n.id) ? styles.attention : '', ariaLabel: `${n.data.label ?? n.data.name}, ${n.data.category}` })), [nodes, warned]);

  const place = (component: CatalogComponent, position?: { x: number; y: number }) => {
    if (disabled) return;
    const bounds = surface.current?.getBoundingClientRect();
    const point = position ?? screenToFlowPosition({ x: (bounds?.left ?? 0) + (bounds?.width ?? 800) / 2 + (nodes.length % 4) * 30,
      y: (bounds?.top ?? 0) + (bounds?.height ?? 600) / 2 + (nodes.length % 4) * 30 });
    dispatch(addNode({ component: { ...component, componentId: component.id, label: component.name,
      icon: component.icon_name, description: component.short_description }, position: point }));
  };
  const connect = (connection: Connection) => {
    if (disabled) return;
    if (connection.source === connection.target) { setConnectionMessage('Choose two different components.'); return; }
    if (edges.some(e => e.source === connection.source && e.target === connection.target)) { setConnectionMessage('That directed connection already exists.'); return; }
    dispatch(addEdge(connection)); setConnectionMessage('Connection added. Arrows show the direction of flow.');
  };
  const removeSelected = () => {
    if (disabled) return;
    if (selected) dispatch(deleteNode(selected.id));
    if (selectedEdge) dispatch(deleteEdge(selectedEdge.id));
  };

  useEffect(() => { void setViewport(canvasViewport); }, [canvasViewport, setViewport]);
  useEffect(() => {
    const keyboard = (event: KeyboardEvent) => {
      if (disabled || (event.target instanceof HTMLElement && (event.target.matches('input,textarea,select') || event.target.isContentEditable))) return;
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'z') {
        event.preventDefault(); dispatch(event.shiftKey ? redo() : undo());
      }
    };
    window.addEventListener('keydown', keyboard);
    return () => window.removeEventListener('keydown', keyboard);
  }, [disabled, dispatch]);

  return <div className={styles.editor}>
    <div className={styles.toolbar} role="toolbar" aria-label="Canvas editing">
      <button onClick={() => setCatalogOpen(o => !o)} aria-expanded={catalogOpen}>Components</button>
      {!nodes.some(n => n.data.role === 'client') && <button disabled={disabled} onClick={() => dispatch(addNode({ component: {},
        nodeData: { role: 'client', category: 'stakeholder', label: 'Users', cost: 0 }, position: { x: 0, y: 150 } }))}>Add traffic source</button>}
      <button onClick={() => dispatch(undo())} disabled={disabled || !past.length} title="Undo (Ctrl/Cmd+Z)">Undo</button>
      <button onClick={() => dispatch(redo())} disabled={disabled || !future.length} title="Redo (Ctrl/Cmd+Shift+Z)">Redo</button>
      <button onClick={removeSelected} disabled={disabled || (!selected && !selectedEdge)}>Delete selected</button>
      <button onClick={() => void fitView({ padding: 0.2 })}>Fit design</button>
    </div>
    <div className={styles.workspace}>
      {catalogOpen && <aside className={styles.library} aria-label="Component library">
        <label>Find a component<input type="search" value={search} onChange={e => setSearch(e.target.value)} /></label>
        <p>Click to place, or drag onto the canvas. Multiple instances are supported.</p>
        {catalog.filter(c => `${c.name} ${c.category}`.toLowerCase().includes(search.toLowerCase())).map(component =>
          <button key={component.id} disabled={disabled} draggable={!disabled} onClick={() => place(component)}
            onDragStart={e => { e.dataTransfer.setData('application/component-id', component.id); e.dataTransfer.effectAllowed = 'copy'; }}>
            <strong>{component.name}</strong><small>{component.category} · {component.cost} credits/mo</small>
          </button>)}
      </aside>}
      <div className={styles.surface} ref={surface}>
        <ReactFlow nodes={shownNodes} edges={edges} nodeTypes={nodeTypes} colorMode={theme}
          onNodesChange={changes => dispatch(onNodesChange(disabled ? changes.filter(c => c.type === 'select' || c.type === 'dimensions') : changes))}
          onEdgesChange={changes => dispatch(onEdgesChange(disabled ? changes.filter(c => c.type === 'select') : changes))}
          onConnect={connect} onReconnect={(edge, connection) => { if (!disabled) dispatch(reconnectEdge({ id: edge.id, connection })); }}
          onMoveEnd={(_event, viewport) => dispatch(updateViewport(viewport))}
          onDragOver={e => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; }}
          onDrop={e => { e.preventDefault(); const component = catalog.find(c => c.id === e.dataTransfer.getData('application/component-id'));
            if (component) place(component, screenToFlowPosition({ x: e.clientX, y: e.clientY })); }}
          isValidConnection={c => c.source !== c.target && !nodes.find(n => n.id === c.target)?.data.role}
          nodesDraggable={!disabled} nodesConnectable={!disabled} edgesReconnectable={!disabled}
          deleteKeyCode={disabled ? null : ['Backspace', 'Delete']} minZoom={0.2} maxZoom={2.5} defaultViewport={canvasViewport}>
          <Background gap={20} /><Controls showInteractive={false} />
        </ReactFlow>
      </div>
    </div>
    <details className={styles.inspector}>
      <summary>Connect components or inspect a selection</summary>
      <form onSubmit={e => { e.preventDefault(); connect({ source, target, sourceHandle: `${source}-output`, targetHandle: `${target}-input` }); }}>
        <label>From<select value={source} onChange={e => setSource(e.target.value)} disabled={disabled}>
          <option value="">Choose source</option>{nodes.map((n, i) => <option key={n.id} value={n.id}>{n.data.label ?? n.data.name} (#{i + 1})</option>)}
        </select></label>
        <label>To<select value={target} onChange={e => setTarget(e.target.value)} disabled={disabled}>
          <option value="">Choose target</option>{nodes.filter(n => n.data.role !== 'client').map(n => <option key={n.id} value={n.id}>{n.data.label ?? n.data.name} (#{nodes.indexOf(n) + 1})</option>)}
        </select></label>
        <button disabled={disabled || !source || !target}>Connect</button>
      </form>
      <p role="status">{connectionMessage}</p>
      {selected && <label>Component label<input disabled={disabled} value={selected.data.label ?? selected.data.name ?? ''}
        onChange={e => dispatch(updateNode({ id: selected.id, data: { label: e.target.value } }))} />
        <small>{selected.data.description ?? 'Select a component to inspect its purpose.'}</small>
      </label>}
      {selectedEdge && <p>Selected connection: {nodes.find(n => n.id === selectedEdge.source)?.data.label} → {nodes.find(n => n.id === selectedEdge.target)?.data.label}. Drag an endpoint to reconnect it, or use Delete selected.</p>}
    </details>
  </div>;
}
