React Flow Complete Guide
Table of Contents

Installation & Setup
Core Concepts
Nodes
Edges
Handles
Viewport & Controls
State Management
Styling & Theming
Advanced Features
Testing
TypeScript
Common Errors & Troubleshooting


Installation & Setup
Basic Installation
bashnpm install @xyflow/react
Essential Setup
jsximport { ReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css'; // Required styles

// Parent container needs width and height
function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow nodes={nodes} edges={edges} />
    </div>
  );
}
With Provider (for hooks)
jsximport { ReactFlowProvider } from '@xyflow/react';

function App() {
  return (
    <ReactFlowProvider>
      <div style={{ width: '100vw', height: '100vh' }}>
        <Flow />
      </div>
    </ReactFlowProvider>
  );
}

Core Concepts
Basic Flow Structure
jsxconst initialNodes = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Input Node' },
    position: { x: 250, y: 25 },
  },
  {
    id: '2',
    data: { label: 'Default Node' },
    position: { x: 100, y: 125 },
  },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2' }
];
Controlled Flow Pattern
jsxfunction Flow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  
  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      fitView
    />
  );
}

Nodes
Node Structure
typescriptinterface Node {
  id: string;
  type?: string;
  position: { x: number; y: number };
  data: any;
  
  // Optional properties
  width?: number;  // Fixed width (v12+)
  height?: number; // Fixed height (v12+)
  selected?: boolean;
  draggable?: boolean;
  selectable?: boolean;
  deletable?: boolean;
  parentId?: string; // For sub-flows
  extent?: 'parent' | CoordinateExtent;
  hidden?: boolean;
  zIndex?: number;
  style?: CSSProperties;
  className?: string;
  dragHandle?: string; // CSS selector for drag handle
  handles?: HandleDefinition[]; // For SSR
  measured?: { // Set by React Flow after measurement
    width: number;
    height: number;
  };
}
Custom Nodes
jsx// Define custom node component
function CustomNode({ data, selected }) {
  return (
    <div className={`custom-node ${selected ? 'selected' : ''}`}>
      <Handle type="target" position={Position.Top} />
      <div>{data.label}</div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

// Register node types (MUST be outside component or memoized)
const nodeTypes = {
  custom: CustomNode,
};

// Use in ReactFlow
<ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} />
Built-in Node Types

input: Source node with no target handle
output: Target node with no source handle
default: Node with both handles
group: Node without handles for grouping

Node Operations
jsxconst { updateNodeData, addNodes, deleteElements } = useReactFlow();

// Update node data
updateNodeData(nodeId, { label: 'New Label' });

// Add new node
addNodes({
  id: 'new-node',
  position: { x: 100, y: 100 },
  data: { label: 'New Node' },
});

// Delete nodes
deleteElements({ nodes: [{ id: nodeId }] });

Edges
Edge Structure
typescriptinterface Edge {
  id: string;
  source: string;
  target: string;
  
  // Optional properties
  sourceHandle?: string;
  targetHandle?: string;
  type?: string;
  animated?: boolean;
  selected?: boolean;
  selectable?: boolean;
  deletable?: boolean;
  hidden?: boolean;
  data?: any;
  style?: CSSProperties;
  className?: string;
  label?: string | ReactNode;
  labelStyle?: CSSProperties;
  markerStart?: EdgeMarker;
  markerEnd?: EdgeMarker;
}
Custom Edges
jsxfunction CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
        >
          <button onClick={() => deleteElements({ edges: [{ id }] })}>×</button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
Built-in Edge Types

default (bezier)
straight
step
smoothstep

Path Utilities
jsximport {
  getBezierPath,
  getStraightPath,
  getSmoothStepPath,
  getSimpleBezierPath
} from '@xyflow/react';

Handles
Handle Component
jsx<Handle
  type="source" // or "target"
  position={Position.Bottom}
  id="handle-1" // Required for multiple handles
  style={{ background: '#555' }}
  isConnectable={true}
  isValidConnection={(connection) => connection.source !== connection.target}
/>
Multiple Handles
jsxfunction MultiHandleNode() {
  return (
    <div>
      <Handle type="target" position={Position.Left} id="input-1" />
      <Handle type="target" position={Position.Left} id="input-2" style={{ top: 30 }} />
      <div>Multi Handle Node</div>
      <Handle type="source" position={Position.Right} id="output-1" />
      <Handle type="source" position={Position.Right} id="output-2" style={{ top: 30 }} />
    </div>
  );
}

Controlling Handle Visibility
Complete Control Over Handle Visibility
jsx// Example: Authentication Service Node with only left and bottom handles
function AuthServiceNode() {
  return (
    <div className="auth-service-node">
      {/* Target handle on the left - receives connections */}
      <Handle 
        type="target" 
        position={Position.Left} 
        // No id needed for single handle of this type
        style={{ background: '#3b82f6' }}
      />
      
      <div className="node-content">
        <ServerIcon />
        <h3>Authentication Service</h3>
        <p>Validates credentials</p>
      </div>
      
      {/* Source handle on the bottom - sends connections */}
      <Handle 
        type="source" 
        position={Position.Bottom} 
        id="bottom" // ID required when connecting to specific handles
        style={{ background: '#3b82f6' }}
      />
      
      {/* Note: No top or right handles - they simply don't exist */}
    </div>
  );
}

// Example: Database Node with only top handle
function DatabaseNode() {
  return (
    <div className="database-node">
      {/* Only top handle - receives connections from above */}
      <Handle 
        type="target" 
        position={Position.Top} 
        id="top"
        style={{ background: '#f59e0b' }}
      />
      
      <div className="node-content">
        <DatabaseIcon />
        <h3>Database</h3>
        <p>User data storage</p>
      </div>
      
      {/* No other handles - completely controlled visibility */}
    </div>
  );
}

Handle Positioning and Styling
jsx// Precise handle positioning
<Handle
  type="source"
  position={Position.Right}
  id="output-1"
  style={{
    top: '25%',           // Position from top of node
    background: '#10b981',
    width: '12px',
    height: '12px',
    border: '2px solid white',
    borderRadius: '50%'
  }}
/>

// Hidden but functional handles
<Handle
  type="target"
  position={Position.Left}
  style={{
    opacity: 0,          // Invisible but still functional
    width: '20px',       // Larger hit area
    height: '20px'
  }}
/>

Connecting Edges to Specific Handles
Edge Configuration with Handle IDs
jsx// Edge connecting specific handles
const edges = [
  {
    id: 'auth-to-db',
    source: 'auth-service',     // Source node ID
    target: 'database',         // Target node ID
    sourceHandle: 'bottom',     // Connect from bottom handle of source
    targetHandle: 'top',        // Connect to top handle of target
    style: { stroke: '#64748b', strokeWidth: 2 }
  }
];

// Multiple edges from different handles of the same node
const edges = [
  {
    id: 'e1',
    source: 'node1',
    target: 'node2',
    sourceHandle: 'output-1',   // From first output
    targetHandle: 'input-1'
  },
  {
    id: 'e2',
    source: 'node1',
    target: 'node3',
    sourceHandle: 'output-2',   // From second output
    targetHandle: 'input-1'
  }
];

Handle ID Requirements
jsx// ✅ Correct: IDs required for multiple handles of same type
function MultiOutputNode() {
  return (
    <div>
      <Handle type="source" position={Position.Right} id="primary" />
      <Handle type="source" position={Position.Right} id="secondary" style={{ top: 30 }} />
    </div>
  );
}

// ✅ Correct: No ID needed for single handle of each type
function SimpleNode() {
  return (
    <div>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

// ❌ Incorrect: Missing IDs for multiple handles
function BadMultiHandleNode() {
  return (
    <div>
      <Handle type="source" position={Position.Right} />
      <Handle type="source" position={Position.Right} style={{ top: 30 }} />
    </div>
  );
}

Connection Validation with Handles
jsx// Validate connections based on handle types
<Handle
  type="target"
  position={Position.Left}
  id="data-input"
  isValidConnection={(connection) => {
    const sourceNode = getNode(connection.source);
    const sourceHandle = connection.sourceHandle;
    
    // Only accept data connections
    return sourceHandle === 'data-output';
  }}
/>

// Global connection validation
<ReactFlow
  isValidConnection={(connection) => {
    const { source, target, sourceHandle, targetHandle } = connection;
    
    // Prevent self-connections
    if (source === target) return false;
    
    // Handle-specific validation
    if (sourceHandle === 'control' && targetHandle !== 'control-input') {
      return false;
    }
    
    return true;
  }}
/>

Dynamic Handle Updates
jsx// Update node internals after handle changes
const updateNodeInternals = useUpdateNodeInternals();

useEffect(() => {
  updateNodeInternals(nodeId);
}, [handleCount]);

// Example: Dynamic handle creation based on node data
function DynamicHandleNode({ data }) {
  const inputCount = data.inputs || 1;
  const outputCount = data.outputs || 1;
  
  return (
    <div>
      {/* Dynamic input handles */}
      {Array.from({ length: inputCount }, (_, i) => (
        <Handle
          key={`input-${i}`}
          type="target"
          position={Position.Left}
          id={`input-${i}`}
          style={{ top: `${25 + (i * 30)}%` }}
        />
      ))}
      
      <div>Node Content</div>
      
      {/* Dynamic output handles */}
      {Array.from({ length: outputCount }, (_, i) => (
        <Handle
          key={`output-${i}`}
          type="source"
          position={Position.Right}
          id={`output-${i}`}
          style={{ top: `${25 + (i * 30)}%` }}
        />
      ))}
    </div>
  );
}

Viewport & Controls
Viewport Control
jsx<ReactFlow
  defaultViewport={{ x: 0, y: 0, zoom: 1 }}
  minZoom={0.1}
  maxZoom={2}
  fitView
  fitViewOptions={{
    padding: 0.2,
    includeHiddenNodes: false,
    nodes: [{ id: 'specific-node' }] // Fit specific nodes
  }}
  panOnDrag={true}
  panOnScroll={false}
  zoomOnScroll={true}
  zoomOnPinch={true}
  zoomOnDoubleClick={true}
  preventScrolling={true}
  nodeOrigin={[0.5, 0.5]} // Center of node
/>
Built-in Components
jsximport { 
  Background, 
  Controls, 
  MiniMap, 
  Panel 
} from '@xyflow/react';

<ReactFlow>
  <Background color="#aaa" variant={BackgroundVariant.Dots} />
  <Controls />
  <MiniMap nodeColor={(node) => node.type === 'input' ? 'red' : 'blue'} />
  <Panel position="top-left">Custom Panel Content</Panel>
</ReactFlow>
Programmatic Control
jsxconst { fitView, zoomIn, zoomOut, setViewport, getViewport } = useReactFlow();

// Fit view
fitView({ duration: 800, padding: 0.2 });

// Set specific viewport
setViewport({ x: 100, y: 50, zoom: 1.5 }, { duration: 800 });

State Management
Built-in Hooks
jsx// State hooks
const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

// Access hooks
const nodes = useNodes();
const edges = useEdges();
const selectedNodes = useNodes().filter(node => node.selected);

// Store access
const nodesCount = useStore((s) => s.nodes.length);
const transform = useStore((s) => s.transform);

// React Flow instance
const { project, getNodes, getEdges, fitView } = useReactFlow();
External State Management (Zustand Example)
jsximport { create } from 'zustand';
import { applyNodeChanges, applyEdgeChanges } from '@xyflow/react';

const useStore = create((set, get) => ({
  nodes: [],
  edges: [],
  
  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  
  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  
  updateNodeData: (nodeId, data) => {
    set({
      nodes: get().nodes.map(node =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...data } }
          : node
      ),
    });
  },
}));

Styling & Theming
CSS Classes
css/* Utility classes */
.nodrag /* Prevents dragging */
.nopan  /* Prevents panning */
.nowheel /* Prevents wheel zoom */

/* Node styling */
.react-flow__node-custom {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
}

/* Handle styling */
.react-flow__handle {
  width: 10px;
  height: 10px;
  background: #555;
  border: 2px solid #fff;
}

/* Handle states */
.react-flow__handle.connecting { /* During connection */ }
.react-flow__handle.valid { /* Valid connection target */ }
Dark Mode (v12+)
jsx<ReactFlow colorMode="dark"> {/* or "light" or "system" */}
CSS Variables
css:root {
  --xy-edge-stroke-default: #b1b1b7;
  --xy-edge-stroke-selected-default: #555;
  --xy-connectionline-stroke: #b1b1b7;
  --xy-node-border-default: transparent;
  --xy-node-border-selected-default: #555;
}

Advanced Features
Sub Flows
jsxconst nodes = [
  {
    id: 'parent',
    type: 'group',
    position: { x: 0, y: 0 },
    style: { width: 300, height: 200 },
  },
  {
    id: 'child',
    parentId: 'parent', // v12+, was parentNode
    extent: 'parent',
    position: { x: 50, y: 50 }, // Relative to parent
    data: { label: 'Child Node' },
  },
];
Computing Flows
jsx// Handle connections between nodes
const connections = useNodeConnections({ nodeId, handleType: 'target' });
const connectedNodesData = useNodesData(connections.map(c => c.source));

// Update based on connected nodes
useEffect(() => {
  const sum = connectedNodesData.reduce((acc, node) => {
    return acc + (node?.data?.value || 0);
  }, 0);
  
  updateNodeData(nodeId, { result: sum });
}, [connectedNodesData]);
Server Side Rendering (v12+)
jsx// Define dimensions for SSR
const nodes = [
  {
    id: '1',
    position: { x: 0, y: 0 },
    data: { label: 'SSR Node' },
    width: 150,
    height: 40,
    handles: [
      {
        type: 'source',
        position: Position.Bottom,
        x: 75,
        y: 40,
      },
    ],
  },
];

// With container dimensions
<ReactFlow 
  nodes={nodes} 
  edges={edges} 
  width={1000} 
  height={500} 
  fitView 
/>
Accessibility
jsx<ReactFlow
  nodesFocusable={true}
  edgesFocusable={true}
  disableKeyboardA11y={false}
  autoPanOnNodeFocus={true}
  ariaLabelConfig={{
    'node.a11yDescription.default': 'Custom instruction text',
  }}
/>

// Node with ARIA attributes
const nodes = [{
  id: '1',
  data: { label: 'Accessible Node' },
  ariaRole: 'button',
  domAttributes: {
    'aria-roledescription': 'flow chart node',
    'aria-label': 'Start Process',
  },
}];

Testing
With Cypress/Playwright
No additional setup needed.
With Jest
javascript// mockReactFlow.js
class ResizeObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe(target) {
    this.callback([{ target }], this);
  }
  unobserve() {}
  disconnect() {}
}

class DOMMatrixReadOnly {
  constructor(transform) {
    const scale = transform?.match(/scale\(([1-9.])\)/)?.[1];
    this.m22 = scale !== undefined ? +scale : 1;
  }
}

export const mockReactFlow = () => {
  global.ResizeObserver = ResizeObserver;
  global.DOMMatrixReadOnly = DOMMatrixReadOnly;
  
  Object.defineProperties(global.HTMLElement.prototype, {
    offsetHeight: {
      get() { return parseFloat(this.style.height) || 1; },
    },
    offsetWidth: {
      get() { return parseFloat(this.style.width) || 1; },
    },
  });
  
  global.SVGElement.prototype.getBBox = () => ({
    x: 0, y: 0, width: 0, height: 0,
  });
};

// In test setup
import { mockReactFlow } from './mockReactFlow';
mockReactFlow();

TypeScript
Basic Types
typescriptimport { Node, Edge, Connection, NodeChange, EdgeChange } from '@xyflow/react';

// Custom node types
type NumberNode = Node<{ value: number }, 'number'>;
type TextNode = Node<{ text: string }, 'text'>;
type AppNode = NumberNode | TextNode;

// Custom edge types
type CustomEdge = Edge<{ label: string }, 'custom'>;
Component Props
typescriptimport { NodeProps, EdgeProps } from '@xyflow/react';

function CustomNode({ data, selected }: NodeProps<NumberNode>) {
  return <div>{data.value}</div>;
}

function CustomEdge({ id, source, target }: EdgeProps<CustomEdge>) {
  return <BaseEdge id={id} path={edgePath} />;
}
Typed Hooks
typescriptconst { getNodes, getEdges } = useReactFlow<AppNode, CustomEdge>();
const onNodesChange: OnNodesChange<AppNode> = useCallback((changes) => {
  setNodes((nds) => applyNodeChanges(changes, nds));
}, []);

Common Errors & Troubleshooting
1. "Seems like you have not used zustand provider as an ancestor"
Causes:

Multiple versions of @reactflow/core installed
Accessing React Flow state outside context

Solutions:
jsx// ❌ Wrong - accessing state outside ReactFlow
function Component() {
  const reactFlowInstance = useReactFlow(); // Error!
  return <ReactFlow />;
}

// ✅ Correct - wrap with provider
function Component() {
  return (
    <ReactFlowProvider>
      <FlowComponent />
    </ReactFlowProvider>
  );
}

function FlowComponent() {
  const reactFlowInstance = useReactFlow(); // Works!
  return <ReactFlow />;
}
2. "The React Flow parent container needs a width and a height"
Solution:
jsx// ❌ Wrong
<div>
  <ReactFlow />
</div>

// ✅ Correct
<div style={{ width: '100vw', height: '100vh' }}>
  <ReactFlow />
</div>
3. "Node type not found. Using fallback type 'default'"
Causes:

Missing nodeTypes prop
Mismatch between node.type and nodeTypes key

Solution:
jsx// ❌ Wrong
const nodes = [{ id: '1', type: 'custom' }];
<ReactFlow nodes={nodes} /> // Missing nodeTypes

// ✅ Correct
const nodeTypes = { custom: CustomNode };
<ReactFlow nodes={nodes} nodeTypes={nodeTypes} />
4. "It looks like you have created a new nodeTypes/edgeTypes object"
Cause: Creating object inside render
Solutions:
jsx// ❌ Wrong
function Flow() {
  const nodeTypes = { custom: CustomNode }; // New object each render
  return <ReactFlow nodeTypes={nodeTypes} />;
}

// ✅ Correct - Option 1
const nodeTypes = { custom: CustomNode }; // Outside component
function Flow() {
  return <ReactFlow nodeTypes={nodeTypes} />;
}

// ✅ Correct - Option 2
function Flow() {
  const nodeTypes = useMemo(() => ({ custom: CustomNode }), []);
  return <ReactFlow nodeTypes={nodeTypes} />;
}
5. "Only child nodes can use a parent extent"
Solution:
jsx// ❌ Wrong
const nodes = [{
  id: '1',
  extent: 'parent', // No parent!
}];

// ✅ Correct
const nodes = [{
  id: '1',
  parentId: 'parent-node',
  extent: 'parent',
}];
6. Mouse Events Not Working in Custom Nodes
Solution: Add nodrag class to interactive elements
jsx<input className="nodrag" type="range" />
<button className="nodrag">Click me</button>
7. Edges Not Displaying
Common Causes & Solutions:

Missing styles
jsximport '@xyflow/react/dist/style.css';

Hidden handles
css/* ❌ Wrong */
.react-flow__handle { display: none; }

/* ✅ Correct */
.react-flow__handle { 
  opacity: 0; 
  /* or visibility: hidden; */
}

Missing handles in custom nodes
jsx// ✅ Ensure handles exist
<Handle type="source" position={Position.Bottom} />
<Handle type="target" position={Position.Top} />

Multiple handles without IDs
jsx// ✅ Add unique IDs
<Handle type="source" position={Position.Right} id="a" />
<Handle type="source" position={Position.Right} id="b" />


8. Performance Issues
Solutions:

Memoize callbacks
jsxconst onNodesChange = useCallback((changes) => {
  setNodes((nds) => applyNodeChanges(changes, nds));
}, []);

Use shallow equality for store selectors
jsxconst { nodes, edges } = useStore(selector, shallow);

Limit node count - Consider virtualization for 1000+ nodes
Optimize custom nodes
jsxconst CustomNode = memo(({ data }) => {
  return <div>{data.label}</div>;
});


9. State Update Issues
Problem: Direct mutations don't trigger updates
Solution: Always create new objects
jsx// ❌ Wrong
setNodes((nodes) => {
  nodes[0].data.label = 'New Label';
  return nodes;
});

// ✅ Correct
setNodes((nodes) => nodes.map(node => 
  node.id === targetId 
    ? { ...node, data: { ...node.data, label: 'New Label' } }
    : node
));
10. Connection Validation Issues
Solution: Use isValidConnection
jsx<ReactFlow
  isValidConnection={(connection) => {
    // Global validation
    return connection.source !== connection.target;
  }}
/>

// Or on specific handles
<Handle
  type="target"
  isValidConnection={(connection) => {
    const sourceNode = getNode(connection.source);
    return sourceNode?.type === 'input';
  }}
/>

11. Nodes Exist in DOM but Not Visible (CSS Override Issue)
**Symptoms:**
- Console shows nodes exist in React Flow state
- DOM inspection shows correct number of `.react-flow__node` elements
- Container has proper dimensions
- Nodes have `display: 'none'` and `visibility: 'hidden'` in computed styles
- MiniMap shows no nodes (blank)
- `fitView` executes but viewport doesn't change meaningfully

**Debugging Process:**
1. **Verify State Management:**
   ```javascript
   console.log('nodes from state:', nodes);
   console.log('nodes length:', nodes?.length || 0);
   ```

2. **Check Node Properties:**
   ```javascript
   nodes.forEach((node, index) => {
     console.log(`Node ${index + 1}:`, {
       id: node.id,
       position: node.position,
       type: node.type,
       measured: node.measured,
       hasStyle: !!node.style
     });
   });
   ```

3. **DOM Inspection:**
   ```javascript
   const reactFlowNodes = document.querySelectorAll('.react-flow__node');
   console.log('Number of .react-flow__node elements:', reactFlowNodes.length);
   
   reactFlowNodes.forEach((node, index) => {
     const styles = getComputedStyle(node);
     console.log(`Node ${index + 1} DOM styles:`, {
       display: styles.display,
       visibility: styles.visibility,
       opacity: styles.opacity,
       width: styles.width,
       height: styles.height
     });
   });
   ```

4. **Container Verification:**
   ```javascript
   const reactFlowWrapper = document.querySelector('.react-flow');
   console.log('React Flow wrapper dimensions:', {
     width: reactFlowWrapper.clientWidth,
     height: reactFlowWrapper.clientHeight,
     display: getComputedStyle(reactFlowWrapper).display,
     visibility: getComputedStyle(reactFlowWrapper).visibility
   });
   ```

**Root Cause:**
CSS styles (possibly from global stylesheets, CSS reset, or theme conflicts) were setting:
```css
.react-flow__node {
  display: none;
  visibility: hidden;
}
```

**Solution:**
Force override the problematic CSS with `!important`:
```jsx
<ReactFlow nodes={nodes} edges={edges}>
  {/* Other components */}
  
  {/* CSS OVERRIDE to force nodes visible */}
  <style>{`
    .react-flow__node {
      display: block !important;
      visibility: visible !important;
      opacity: 1 !important;
    }
    .react-flow__edge {
      display: block !important;
      visibility: visible !important;
      opacity: 1 !important;
    }
  `}</style>
</ReactFlow>
```

**Prevention:**
- Ensure React Flow styles are loaded after global styles: `import '@xyflow/react/dist/style.css';`
- Check for CSS conflicts in global stylesheets
- Use CSS specificity to avoid overriding React Flow classes
- Consider using CSS modules or styled-components for component isolation

Error Prevention Best Practices

Always define nodeTypes/edgeTypes outside components
Always import React Flow styles
Always set container dimensions
Use nodrag class on interactive elements
Create new objects for state updates
Use proper TypeScript types
Wrap with ReactFlowProvider when using hooks
Memoize expensive computations
Handle loading states for async data
Test thoroughly with mock setup for Jest

## Redux Integration for React Flow (System Design Tycoon)

### Overview
In System Design Tycoon, we integrate React Flow with Redux Toolkit for centralized state management. This approach provides better control over the application state and enables features like undo/redo, state persistence, and real-time collaboration.

### State Structure
```typescript
// features/design/designSlice.ts
interface DesignState {
  // React Flow state
  nodes: Node[];
  edges: Edge[];
  selectedNodeId: string | null;
  
  // Drag and drop state
  draggedComponent: ComponentData | null;
  isDragging: boolean;
  
  // Design metrics
  totalCost: number;
  isValidDesign: boolean;
  validationErrors: string[];
  
  // Canvas viewport
  canvasViewport: {
    x: number;
    y: number;
    zoom: number;
  };
}
```

### Key Differences from Standard React Flow

#### 1. State Management
Instead of using React Flow's built-in hooks:
```typescript
// ❌ Standard React Flow approach
const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

// ✅ Our Redux approach
const nodes = useAppSelector(selectNodes);
const edges = useAppSelector(selectEdges);
const dispatch = useAppDispatch();
```

#### 2. Node and Edge Updates
```typescript
// Redux actions for state updates
dispatch(onNodesChange(changes)); // Handles node position updates
dispatch(onEdgesChange(changes)); // Handles edge updates
dispatch(addNode({ component, position })); // Add new node
dispatch(addEdge(connection)); // Add new edge
```

#### 3. Connection Handling
```typescript
const onConnect = useCallback((params: Connection) => {
  // Get selected nodes from Redux state
  const selectedNodes = useAppSelector(selectNodes).filter(node => node.selected);
  
  // Multi-connection support
  if (selectedNodes.length > 1 && params.target) {
    selectedNodes.forEach((node: Node) => {
      if (node.id !== params.target) {
        dispatch(addEdgeAction({
          ...params,
          source: node.id,
          sourceHandle: 'output',
          targetHandle: 'input'
        } as Connection));
      }
    });
  } else {
    dispatch(addEdgeAction(params as Connection));
  }
}, [dispatch]);
```

### Selectors
```typescript
// Design slice selectors
export const selectNodes = (state: { design: DesignState }) => state.design.nodes;
export const selectEdges = (state: { design: DesignState }) => state.design.edges;
export const selectTotalCost = (state: { design: DesignState }) => state.design.totalCost;
export const selectIsValidDesign = (state: { design: DesignState }) => state.design.isValidDesign;
export const selectValidationErrors = (state: { design: DesignState }) => state.design.validationErrors;
export const selectDraggedComponent = (state: { design: DesignState }) => state.design.draggedComponent;
```

### Component Pattern
```typescript
// CrisisSystemDesignCanvas.tsx
const CrisisSystemDesignCanvasInner: React.FC<Props> = ({ emailId }) => {
  const dispatch = useAppDispatch();
  const nodes = useAppSelector(selectNodes);
  const edges = useAppSelector(selectEdges);
  const draggedComponent = useAppSelector(selectDraggedComponent);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={(changes) => dispatch(onNodesChange(changes))}
      onEdgesChange={(changes) => dispatch(onEdgesChange(changes))}
      onConnect={onConnect}
      // ... other props
    />
  );
};

// Wrap with ReactFlowProvider
export const CrisisSystemDesignCanvas: React.FC<Props> = (props) => (
  <ReactFlowProvider>
    <CrisisSystemDesignCanvasInner {...props} />
  </ReactFlowProvider>
);
```

### Mission-Specific Node Initialization
```typescript
// Initialize nodes based on mission data
useEffect(() => {
  if (nodes.length === 0 && !loading && activeMission) {
    dispatch(addNode({
      component: {
        id: 'families',
        name: 'Families',
        type: 'families',
        category: 'stakeholder',
        cost: 0,
        capacity: 200,
        description: 'Affected families trying to report',
        icon: 'users'
      },
      position: { x: 250, y: 50 }
    }));
  }
}, [nodes.length, dispatch, loading, activeMission]);
```

### Drag and Drop Integration
```typescript
const handleDrop = useCallback((event: React.DragEvent) => {
  event.preventDefault();
  const position = screenToFlowPosition({
    x: event.clientX,
    y: event.clientY,
  });
  
  if (draggedComponent) {
    dispatch(addNode({ component: draggedComponent, position }));
    dispatch(setDraggedComponent(null));
  }
}, [screenToFlowPosition, draggedComponent, dispatch]);
```

### Benefits of Redux Integration

1. **Centralized State**: All canvas state in one place, accessible throughout the app
2. **Time Travel Debugging**: Redux DevTools for debugging state changes
3. **Undo/Redo Support**: Easy to implement with Redux state history
4. **Persistence**: Can persist design state across sessions
5. **Real-time Collaboration**: Easier to sync state across multiple users
6. **Type Safety**: Full TypeScript support with Redux Toolkit
7. **Performance**: Optimized re-renders with selective subscriptions
8. **Testing**: Easier to test with predictable state updates

### Common Patterns

#### Pattern 1: Component-Driven Node Creation
```typescript
// From component drawer
const availableComponents = useMemo(() => {
  if (!activeMission) return [];
  return activeMission.components.map(comp => ({
    id: comp.id,
    name: comp.name,
    category: comp.category,
    cost: comp.cost,
    capacity: 1000,
    description: comp.short_description,
    icon: comp.icon_name
  }));
}, [activeMission]);
```

#### Pattern 2: Mission-Based Requirements
```typescript
// Requirements from active mission
<Requirements 
  requirements={activeMission?.requirements || []}
  onRunTest={handleRunTest}
/>
```

#### Pattern 3: Multi-Connection Support
Our implementation supports creating multiple connections at once by selecting multiple source nodes before connecting to a target.

### Migration Guide

If migrating from standard React Flow to Redux:

1. Replace `useNodesState` and `useEdgesState` with Redux selectors
2. Replace set functions with dispatch actions
3. Move node/edge change handlers to Redux actions
4. Update connection handlers to dispatch Redux actions
5. Ensure ReactFlowProvider wraps the component using React Flow hooks

### Performance Considerations

1. **Memoize Selectors**: Use `createSelector` for computed values
2. **Shallow Equality**: Use `shallowEqual` for multi-value selectors
3. **Batch Updates**: Redux automatically batches updates in event handlers
4. **Component Memoization**: Use `React.memo` for custom node components