# System Design Tycoon - Redux State Management Architecture

**Version:** 2.0  
**Date:** July 14, 2025  
**Author:** Engineering Team  

---

## 1. Overview

System Design Tycoon uses Redux Toolkit (RTK) as its primary state management solution, providing predictable state updates, time-travel debugging, and excellent DevTools support. The architecture combines Redux for global state, RTK Query for server state, and local component state for UI-specific concerns.

---

## 2. Redux Architecture Overview

### 2.1 State Structure

```typescript
// types/state.types.ts
interface RootState {
  // Core Game State
  user: UserState;
  game: GameState;
  level: LevelState;
  
  // Phase-Specific State
  meeting: MeetingState;
  mentor: MentorState;
  design: DesignState;
  simulation: SimulationState;
  review: ReviewState;
  
  // UI State
  ui: UIState;
  
  // Multiplayer State
  multiplayer: MultiplayerState;
  
  // API State (RTK Query)
  api: ApiState;
}

interface GameState {
  sessionId: string;
  currentPhase: GamePhase;
  currentLevelId: string;
  startTime: number;
  elapsedTime: number;
  isPaused: boolean;
  isComplete: boolean;
}

interface UserState {
  id: string;
  profile: UserProfile;
  progress: UserProgress;
  preferences: UserPreferences;
  achievements: Achievement[];
}

interface LevelState {
  currentLevel: Level | null;
  availableLevels: LevelMetadata[];
  unlockedLevels: string[];
  levelProgress: Record<string, LevelProgress>;
}
```

### 2.2 Store Configuration

```typescript
// store/store.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Import slices
import userSlice from './slices/userSlice';
import gameSlice from './slices/gameSlice';
import levelSlice from './slices/levelSlice';
import meetingSlice from './slices/meetingSlice';
import mentorSlice from './slices/mentorSlice';
import designSlice from './slices/designSlice';
import simulationSlice from './slices/simulationSlice';
import reviewSlice from './slices/reviewSlice';
import uiSlice from './slices/uiSlice';
import multiplayerSlice from './slices/multiplayerSlice';
import { gameApi } from './api/gameApi';

// Persist configuration
const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['user', 'level'], // Only persist user and level progress
  blacklist: ['game', 'meeting', 'design', 'simulation', 'ui', 'api'],
};

// Root reducer
const rootReducer = combineReducers({
  user: userSlice,
  game: gameSlice,
  level: levelSlice,
  meeting: meetingSlice,
  mentor: mentorSlice,
  design: designSlice,
  simulation: simulationSlice,
  review: reviewSlice,
  ui: uiSlice,
  multiplayer: multiplayerSlice,
  [gameApi.reducerPath]: gameApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        ignoredPaths: ['simulation.packets', 'design.draggedComponent'],
      },
    })
    .concat(gameApi.middleware)
    .concat(gameMiddleware)
    .concat(simulationMiddleware)
    .concat(multiplayerMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);

// Setup listeners for RTK Query
setupListeners(store.dispatch);

// Type exports
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

---

## 3. Redux Slices Implementation

### 3.1 Game Slice (Core Game State)

```typescript
// store/slices/gameSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GamePhase } from '../../types/game.types';

interface GameState {
  sessionId: string;
  currentPhase: GamePhase;
  currentLevelId: string;
  startTime: number;
  elapsedTime: number;
  isPaused: boolean;
  isComplete: boolean;
  score: number;
  phaseHistory: PhaseTransition[];
}

interface PhaseTransition {
  from: GamePhase;
  to: GamePhase;
  timestamp: number;
  duration: number;
}

const initialState: GameState = {
  sessionId: '',
  currentPhase: 'menu',
  currentLevelId: '',
  startTime: 0,
  elapsedTime: 0,
  isPaused: false,
  isComplete: false,
  score: 0,
  phaseHistory: [],
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    // Session Management
    startSession: (state, action: PayloadAction<{ levelId: string; sessionId: string }>) => {
      state.sessionId = action.payload.sessionId;
      state.currentLevelId = action.payload.levelId;
      state.currentPhase = 'meeting';
      state.startTime = Date.now();
      state.elapsedTime = 0;
      state.isPaused = false;
      state.isComplete = false;
      state.score = 0;
      state.phaseHistory = [];
    },
    
    endSession: (state) => {
      state.isComplete = true;
      state.elapsedTime = Date.now() - state.startTime;
    },
    
    // Phase Management
    transitionPhase: (state, action: PayloadAction<GamePhase>) => {
      const previousPhase = state.currentPhase;
      const transition: PhaseTransition = {
        from: previousPhase,
        to: action.payload,
        timestamp: Date.now(),
        duration: Date.now() - (state.phaseHistory[state.phaseHistory.length - 1]?.timestamp || state.startTime),
      };
      
      state.phaseHistory.push(transition);
      state.currentPhase = action.payload;
    },
    
    // Game Control
    pauseGame: (state) => {
      state.isPaused = true;
      state.elapsedTime += Date.now() - state.startTime;
    },
    
    resumeGame: (state) => {
      state.isPaused = false;
      state.startTime = Date.now();
    },
    
    updateScore: (state, action: PayloadAction<number>) => {
      state.score = action.payload;
    },
    
    // Time Management
    updateElapsedTime: (state) => {
      if (!state.isPaused) {
        state.elapsedTime = Date.now() - state.startTime + state.elapsedTime;
      }
    },
  },
});

export const {
  startSession,
  endSession,
  transitionPhase,
  pauseGame,
  resumeGame,
  updateScore,
  updateElapsedTime,
} = gameSlice.actions;

export default gameSlice.reducer;

// Selectors
export const selectCurrentPhase = (state: RootState) => state.game.currentPhase;
export const selectIsGameActive = (state: RootState) => 
  state.game.sessionId !== '' && !state.game.isComplete;
export const selectGameTime = (state: RootState) => ({
  elapsed: state.game.elapsedTime,
  isPaused: state.game.isPaused,
});
```

### 3.2 Meeting Slice (Requirements Gathering)

```typescript
// store/slices/meetingSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Question, TeamMember, Requirement, DialogueEntry } from '../../types/meeting.types';

interface MeetingState {
  teamMembers: TeamMember[];
  availableQuestions: Record<string, Question[]>; // Grouped by speaker
  selectedQuestions: string[];
  maxQuestions: number;
  questionsRemaining: number;
  dialogueHistory: DialogueEntry[];
  baseRequirements: Requirement[];
  modifiedRequirements: Requirement[];
  budget: number;
  constraints: Record<string, any>;
  isLoading: boolean;
  error: string | null;
}

const initialState: MeetingState = {
  teamMembers: [],
  availableQuestions: {},
  selectedQuestions: [],
  maxQuestions: 3,
  questionsRemaining: 3,
  dialogueHistory: [],
  baseRequirements: [],
  modifiedRequirements: [],
  budget: 0,
  constraints: {},
  isLoading: false,
  error: null,
};

// Async thunk for loading meeting data
export const loadMeetingData = createAsyncThunk(
  'meeting/loadData',
  async (levelId: string) => {
    const response = await fetch(`/api/levels/${levelId}/meeting`);
    const data = await response.json();
    return data;
  }
);

const meetingSlice = createSlice({
  name: 'meeting',
  initialState,
  reducers: {
    // Question Selection
    selectQuestion: (state, action: PayloadAction<string>) => {
      const questionId = action.payload;
      
      // Find the question across all speakers
      let selectedQuestion: Question | null = null;
      for (const speaker in state.availableQuestions) {
        const question = state.availableQuestions[speaker].find(q => q.id === questionId);
        if (question) {
          selectedQuestion = question;
          break;
        }
      }
      
      if (!selectedQuestion || state.questionsRemaining <= 0) return;
      
      // Add to selected questions
      state.selectedQuestions.push(questionId);
      state.questionsRemaining--;
      
      // Add dialogue entries
      state.dialogueHistory.push({
        id: `dialogue-${Date.now()}`,
        speaker: 'player',
        text: selectedQuestion.text,
        timestamp: Date.now(),
        type: 'question',
      });
      
      state.dialogueHistory.push({
        id: `dialogue-${Date.now() + 1}`,
        speaker: selectedQuestion.speaker,
        text: selectedQuestion.response,
        timestamp: Date.now() + 100,
        type: 'response',
      });
      
      // Apply question impacts
      selectedQuestion.impacts.forEach(impact => {
        switch (impact.type) {
          case 'add_requirement':
            state.modifiedRequirements.push(impact.requirement);
            break;
            
          case 'modify_budget':
            state.budget = Math.max(0, state.budget + impact.value);
            break;
            
          case 'add_constraint':
            state.constraints[impact.key] = impact.value;
            break;
            
          case 'remove_requirement':
            state.modifiedRequirements = state.modifiedRequirements.filter(
              req => req.id !== impact.requirementId
            );
            break;
        }
      });
    },
    
    // Dialogue Management
    addDialogueEntry: (state, action: PayloadAction<DialogueEntry>) => {
      state.dialogueHistory.push(action.payload);
    },
    
    // Reset for new meeting
    resetMeeting: (state) => {
      state.selectedQuestions = [];
      state.questionsRemaining = state.maxQuestions;
      state.dialogueHistory = [];
      state.modifiedRequirements = [...state.baseRequirements];
      state.constraints = {};
    },
    
    // Manual requirement updates (for testing/admin)
    updateRequirements: (state, action: PayloadAction<Requirement[]>) => {
      state.modifiedRequirements = action.payload;
    },
    
    updateBudget: (state, action: PayloadAction<number>) => {
      state.budget = action.payload;
    },
  },
  
  extraReducers: (builder) => {
    builder
      .addCase(loadMeetingData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadMeetingData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.teamMembers = action.payload.teamMembers;
        state.availableQuestions = action.payload.questions;
        state.baseRequirements = action.payload.requirements;
        state.modifiedRequirements = [...action.payload.requirements];
        state.budget = action.payload.budget;
        state.maxQuestions = action.payload.maxQuestions || 3;
        state.questionsRemaining = action.payload.maxQuestions || 3;
        state.dialogueHistory = action.payload.initialDialogue || [];
      })
      .addCase(loadMeetingData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to load meeting data';
      });
  },
});

export const {
  selectQuestion,
  addDialogueEntry,
  resetMeeting,
  updateRequirements,
  updateBudget,
} = meetingSlice.actions;

export default meetingSlice.reducer;

// Selectors
export const selectAvailableQuestions = (speakerId: string) => (state: RootState) => 
  state.meeting.availableQuestions[speakerId] || [];

export const selectRemainingQuestions = (state: RootState) => 
  state.meeting.questionsRemaining;

export const selectFinalRequirements = (state: RootState) => 
  state.meeting.modifiedRequirements;

export const selectDialogueHistory = (state: RootState) => 
  state.meeting.dialogueHistory;
```

### 3.3 Design Slice (System Architecture)

```typescript
// store/slices/designSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Node, Edge, Connection, NodeChange, EdgeChange, applyNodeChanges, applyEdgeChanges } from '@xyflow/react';
import { SystemComponent, ValidationError } from '../../types/design.types';

interface DesignState {
  nodes: Node[];
  edges: Edge[];
  selectedNodeId: string | null;
  draggedComponent: SystemComponent | null;
  totalCost: number;
  isValidDesign: boolean;
  validationErrors: ValidationError[];
  canvasViewport: {
    x: number;
    y: number;
    zoom: number;
  };
  // Metrics
  totalCapacity: number;
  estimatedLatency: number;
  reliability: number;
  // History for undo/redo
  history: {
    past: { nodes: Node[]; edges: Edge[] }[];
    future: { nodes: Node[]; edges: Edge[] }[];
  };
}

const initialState: DesignState = {
  nodes: [],
  edges: [],
  selectedNodeId: null,
  draggedComponent: null,
  totalCost: 0,
  isValidDesign: false,
  validationErrors: [],
  canvasViewport: { x: 0, y: 0, zoom: 1 },
  totalCapacity: 0,
  estimatedLatency: 0,
  reliability: 0,
  history: {
    past: [],
    future: [],
  },
};

const designSlice = createSlice({
  name: 'design',
  initialState,
  reducers: {
    // Node Management
    addNode: (state, action: PayloadAction<{ component: SystemComponent; position: { x: number; y: number } }>) => {
      const { component, position } = action.payload;
      
      // Save current state to history
      state.history.past.push({ nodes: [...state.nodes], edges: [...state.edges] });
      state.history.future = []; // Clear future on new action
      
      const newNode: Node = {
        id: `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'system',
        position,
        data: {
          ...component,
          status: 'healthy',
          currentLoad: 0,
          metrics: {
            requestsPerSecond: 0,
            averageLatency: 0,
            errorRate: 0,
          },
        },
      };
      
      state.nodes.push(newNode);
      state.totalCost += component.cost;
      
      // Trigger validation
      validateDesign(state);
    },
    
    updateNode: (state, action: PayloadAction<{ id: string; data: Partial<any> }>) => {
      const { id, data } = action.payload;
      const nodeIndex = state.nodes.findIndex(n => n.id === id);
      
      if (nodeIndex !== -1) {
        state.nodes[nodeIndex] = {
          ...state.nodes[nodeIndex],
          data: { ...state.nodes[nodeIndex].data, ...data },
        };
        
        // Recalculate cost if needed
        recalculateTotalCost(state);
        validateDesign(state);
      }
    },
    
    deleteNode: (state, action: PayloadAction<string>) => {
      const nodeId = action.payload;
      const nodeIndex = state.nodes.findIndex(n => n.id === nodeId);
      
      if (nodeIndex !== -1) {
        // Save to history
        state.history.past.push({ nodes: [...state.nodes], edges: [...state.edges] });
        state.history.future = [];
        
        const deletedNode = state.nodes[nodeIndex];
        state.totalCost -= deletedNode.data.cost;
        
        // Remove node
        state.nodes.splice(nodeIndex, 1);
        
        // Remove connected edges
        state.edges = state.edges.filter(
          edge => edge.source !== nodeId && edge.target !== nodeId
        );
        
        // Clear selection if deleted node was selected
        if (state.selectedNodeId === nodeId) {
          state.selectedNodeId = null;
        }
        
        validateDesign(state);
      }
    },
    
    // React Flow handlers
    onNodesChange: (state, action: PayloadAction<NodeChange[]>) => {
      state.nodes = applyNodeChanges(action.payload, state.nodes);
    },
    
    onEdgesChange: (state, action: PayloadAction<EdgeChange[]>) => {
      state.edges = applyEdgeChanges(action.payload, state.edges);
    },
    
    // Edge Management
    addEdge: (state, action: PayloadAction<Connection>) => {
      const connection = action.payload;
      
      // Check if edge already exists
      const exists = state.edges.some(edge => 
        (edge.source === connection.source && edge.target === connection.target) ||
        (edge.source === connection.target && edge.target === connection.source)
      );
      
      if (!exists && connection.source && connection.target) {
        state.history.past.push({ nodes: [...state.nodes], edges: [...state.edges] });
        state.history.future = [];
        
        const newEdge: Edge = {
          id: `edge-${connection.source}-${connection.target}`,
          source: connection.source,
          target: connection.target,
          sourceHandle: connection.sourceHandle || undefined,
          targetHandle: connection.targetHandle || undefined,
          type: 'animated',
          data: {
            bandwidth: 1000, // Mbps
            latency: 1, // ms
            packetLoss: 0, // %
          },
        };
        
        state.edges.push(newEdge);
        validateDesign(state);
      }
    },
    
    deleteEdge: (state, action: PayloadAction<string>) => {
      const edgeId = action.payload;
      state.edges = state.edges.filter(e => e.id !== edgeId);
      validateDesign(state);
    },
    
    // Selection Management
    selectNode: (state, action: PayloadAction<string | null>) => {
      state.selectedNodeId = action.payload;
    },
    
    // Drag and Drop
    setDraggedComponent: (state, action: PayloadAction<SystemComponent | null>) => {
      state.draggedComponent = action.payload;
    },
    
    // Canvas Management
    updateViewport: (state, action: PayloadAction<{ x: number; y: number; zoom: number }>) => {
      state.canvasViewport = action.payload;
    },
    
    // Undo/Redo
    undo: (state) => {
      if (state.history.past.length > 0) {
        const previous = state.history.past[state.history.past.length - 1];
        state.history.past.pop();
        state.history.future.push({ nodes: state.nodes, edges: state.edges });
        
        state.nodes = previous.nodes;
        state.edges = previous.edges;
        
        recalculateTotalCost(state);
        validateDesign(state);
      }
    },
    
    redo: (state) => {
      if (state.history.future.length > 0) {
        const next = state.history.future[state.history.future.length - 1];
        state.history.future.pop();
        state.history.past.push({ nodes: state.nodes, edges: state.edges });
        
        state.nodes = next.nodes;
        state.edges = next.edges;
        
        recalculateTotalCost(state);
        validateDesign(state);
      }
    },
    
    // Clear Design
    clearDesign: (state) => {
      state.history.past.push({ nodes: [...state.nodes], edges: [...state.edges] });
      state.history.future = [];
      
      state.nodes = [];
      state.edges = [];
      state.selectedNodeId = null;
      state.totalCost = 0;
      state.isValidDesign = false;
      state.validationErrors = [];
    },
    
    // Validation
    setValidationErrors: (state, action: PayloadAction<ValidationError[]>) => {
      state.validationErrors = action.payload;
      state.isValidDesign = action.payload.length === 0;
    },
  },
});

// Helper functions
function recalculateTotalCost(state: DesignState) {
  state.totalCost = state.nodes.reduce((sum, node) => sum + (node.data.cost || 0), 0);
}

function validateDesign(state: DesignState) {
  const errors: ValidationError[] = [];
  
  // Check for orphan nodes
  const connectedNodes = new Set<string>();
  state.edges.forEach(edge => {
    connectedNodes.add(edge.source);
    connectedNodes.add(edge.target);
  });
  
  const orphanNodes = state.nodes.filter(node => 
    !connectedNodes.has(node.id) && state.nodes.length > 1
  );
  
  if (orphanNodes.length > 0) {
    errors.push({
      type: 'orphan_nodes',
      severity: 'warning',
      message: `${orphanNodes.length} component(s) are not connected`,
      nodeIds: orphanNodes.map(n => n.id),
    });
  }
  
  // Check for cycles (simplified)
  if (hasCycle(state.nodes, state.edges)) {
    errors.push({
      type: 'circular_dependency',
      severity: 'error',
      message: 'Design contains circular dependencies',
    });
  }
  
  // Calculate metrics
  state.totalCapacity = calculateTotalCapacity(state.nodes);
  state.estimatedLatency = calculateEstimatedLatency(state.nodes, state.edges);
  state.reliability = calculateReliability(state.nodes, state.edges);
  
  state.validationErrors = errors;
  state.isValidDesign = errors.filter(e => e.severity === 'error').length === 0;
}

function hasCycle(nodes: Node[], edges: Edge[]): boolean {
  // Implement cycle detection algorithm
  return false; // Simplified
}

function calculateTotalCapacity(nodes: Node[]): number {
  return nodes.reduce((sum, node) => sum + (node.data.capacity || 0), 0);
}

function calculateEstimatedLatency(nodes: Node[], edges: Edge[]): number {
  // Calculate based on critical path
  return 50; // ms - simplified
}

function calculateReliability(nodes: Node[], edges: Edge[]): number {
  // Calculate based on redundancy and component reliability
  return 0.995; // 99.5% - simplified
}

export const {
  addNode,
  updateNode,
  deleteNode,
  onNodesChange,
  onEdgesChange,
  addEdge,
  deleteEdge,
  selectNode,
  setDraggedComponent,
  updateViewport,
  undo,
  redo,
  clearDesign,
  setValidationErrors,
} = designSlice.actions;

export default designSlice.reducer;

// Selectors
export const selectNodes = (state: RootState) => state.design.nodes;
export const selectEdges = (state: RootState) => state.design.edges;
export const selectTotalCost = (state: RootState) => state.design.totalCost;
export const selectIsValidDesign = (state: RootState) => state.design.isValidDesign;
export const selectValidationErrors = (state: RootState) => state.design.validationErrors;
export const selectCanUndo = (state: RootState) => state.design.history.past.length > 0;
export const selectCanRedo = (state: RootState) => state.design.history.future.length > 0;
```

### 3.4 Simulation Slice

```typescript
// store/slices/simulationSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Packet, MetricSnapshot, SystemFailure, TrafficPattern } from '../../types/simulation.types';

interface SimulationState {
  isRunning: boolean;
  isPaused: boolean;
  currentTime: number;
  duration: number;
  speed: number; // 1x, 2x, 4x
  
  // Traffic
  trafficPattern: TrafficPattern;
  packets: Record<string, Packet>; // Keyed by packet ID for performance
  activePacketIds: string[];
  completedPackets: number;
  failedPackets: number;
  
  // Metrics
  currentMetrics: MetricSnapshot;
  metricsHistory: MetricSnapshot[];
  
  // System Health
  nodeHealth: Record<string, NodeHealth>;
  failures: SystemFailure[];
  
  // Results
  results: SimulationResults | null;
}

interface NodeHealth {
  nodeId: string;
  currentLoad: number;
  maxCapacity: number;
  status: 'healthy' | 'degraded' | 'overloaded' | 'failed';
  processingQueue: string[]; // Packet IDs
  metrics: {
    throughput: number;
    latency: number;
    errorRate: number;
  };
}

const initialState: SimulationState = {
  isRunning: false,
  isPaused: false,
  currentTime: 0,
  duration: 120000, // 2 minutes
  speed: 1,
  
  trafficPattern: 'normal',
  packets: {},
  activePacketIds: [],
  completedPackets: 0,
  failedPackets: 0,
  
  currentMetrics: {
    timestamp: 0,
    throughput: 0,
    latency: 0,
    errorRate: 0,
    systemLoad: 0,
    availability: 100,
  },
  metricsHistory: [],
  
  nodeHealth: {},
  failures: [],
  
  results: null,
};

const simulationSlice = createSlice({
  name: 'simulation',
  initialState,
  reducers: {
    // Simulation Control
    startSimulation: (state, action: PayloadAction<{ nodes: any[]; trafficPattern: TrafficPattern }>) => {
      state.isRunning = true;
      state.isPaused = false;
      state.currentTime = 0;
      state.trafficPattern = action.payload.trafficPattern;
      
      // Initialize node health
      state.nodeHealth = {};
      action.payload.nodes.forEach(node => {
        state.nodeHealth[node.id] = {
          nodeId: node.id,
          currentLoad: 0,
          maxCapacity: node.data.capacity,
          status: 'healthy',
          processingQueue: [],
          metrics: {
            throughput: 0,
            latency: 0,
            errorRate: 0,
          },
        };
      });
      
      // Reset metrics
      state.currentMetrics = {
        timestamp: 0,
        throughput: 0,
        latency: 0,
        errorRate: 0,
        systemLoad: 0,
        availability: 100,
      };
      state.metricsHistory = [state.currentMetrics];
    },
    
    pauseSimulation: (state) => {
      state.isPaused = true;
    },
    
    resumeSimulation: (state) => {
      state.isPaused = false;
    },
    
    stopSimulation: (state) => {
      state.isRunning = false;
      state.isPaused = false;
      
      // Calculate final results
      state.results = calculateSimulationResults(state);
    },
    
    setSimulationSpeed: (state, action: PayloadAction<number>) => {
      state.speed = action.payload;
    },
    
    // Time Management
    updateSimulationTime: (state, action: PayloadAction<number>) => {
      state.currentTime = action.payload;
      
      if (state.currentTime >= state.duration) {
        state.isRunning = false;
        state.results = calculateSimulationResults(state);
      }
    },
    
    // Packet Management
    createPacket: (state, action: PayloadAction<Packet>) => {
      const packet = action.payload;
      state.packets[packet.id] = packet;
      state.activePacketIds.push(packet.id);
      
      // Add to source node's queue
      if (packet.path.length > 0 && state.nodeHealth[packet.path[0]]) {
        state.nodeHealth[packet.path[0]].processingQueue.push(packet.id);
      }
    },
    
    updatePacket: (state, action: PayloadAction<{ id: string; updates: Partial<Packet> }>) => {
      const { id, updates } = action.payload;
      if (state.packets[id]) {
        state.packets[id] = { ...state.packets[id], ...updates };
      }
    },
    
    movePacket: (state, action: PayloadAction<{ id: string; toNode: string; progress: number }>) => {
      const { id, toNode, progress } = action.payload;
      const packet = state.packets[id];
      
      if (packet) {
        packet.currentNode = toNode;
        packet.progress = progress;
        
        // Update node queues
        const currentNodeIndex = packet.path.indexOf(toNode);
        if (currentNodeIndex > 0) {
          const previousNode = packet.path[currentNodeIndex - 1];
          if (state.nodeHealth[previousNode]) {
            state.nodeHealth[previousNode].processingQueue = 
              state.nodeHealth[previousNode].processingQueue.filter(pid => pid !== id);
          }
        }
        
        if (state.nodeHealth[toNode] && progress < 1) {
          if (!state.nodeHealth[toNode].processingQueue.includes(id)) {
            state.nodeHealth[toNode].processingQueue.push(id);
          }
        }
      }
    },
    
    completePacket: (state, action: PayloadAction<string>) => {
      const packetId = action.payload;
      const packet = state.packets[packetId];
      
      if (packet) {
        // Remove from active packets
        state.activePacketIds = state.activePacketIds.filter(id => id !== packetId);
        
        // Update counters
        if (packet.status === 'completed') {
          state.completedPackets++;
        } else {
          state.failedPackets++;
        }
        
        // Remove from node queues
        Object.values(state.nodeHealth).forEach(health => {
          health.processingQueue = health.processingQueue.filter(id => id !== packetId);
        });
        
        // Keep packet in history for analysis
        packet.completedAt = state.currentTime;
      }
    },
    
    // Node Health Management
    updateNodeHealth: (state, action: PayloadAction<{ nodeId: string; health: Partial<NodeHealth> }>) => {
      const { nodeId, health } = action.payload;
      if (state.nodeHealth[nodeId]) {
        state.nodeHealth[nodeId] = { ...state.nodeHealth[nodeId], ...health };
        
        // Determine status based on load
        const loadPercentage = (health.currentLoad || 0) / state.nodeHealth[nodeId].maxCapacity;
        if (loadPercentage < 0.7) {
          state.nodeHealth[nodeId].status = 'healthy';
        } else if (loadPercentage < 0.9) {
          state.nodeHealth[nodeId].status = 'degraded';
        } else if (loadPercentage < 1) {
          state.nodeHealth[nodeId].status = 'overloaded';
        } else {
          state.nodeHealth[nodeId].status = 'failed';
        }
      }
    },
    
    // System Failures
    recordFailure: (state, action: PayloadAction<SystemFailure>) => {
      state.failures.push(action.payload);
      
      // Update node status if node failure
      if (action.payload.type === 'node_failure' && action.payload.nodeId) {
        if (state.nodeHealth[action.payload.nodeId]) {
          state.nodeHealth[action.payload.nodeId].status = 'failed';
        }
      }
    },
    
    // Metrics Updates
    updateMetrics: (state, action: PayloadAction<MetricSnapshot>) => {
      state.currentMetrics = action.payload;
      state.metricsHistory.push(action.payload);
      
      // Keep only last 200 snapshots for performance
      if (state.metricsHistory.length > 200) {
        state.metricsHistory = state.metricsHistory.slice(-200);
      }
    },
    
    // Reset
    resetSimulation: () => initialState,
  },
});

// Helper function to calculate results
function calculateSimulationResults(state: SimulationState): SimulationResults {
  const totalPackets = state.completedPackets + state.failedPackets;
  const successRate = totalPackets > 0 ? state.completedPackets / totalPackets : 0;
  
  // Calculate average metrics
  const avgMetrics = state.metricsHistory.reduce((acc, metric) => ({
    throughput: acc.throughput + metric.throughput,
    latency: acc.latency + metric.latency,
    errorRate: acc.errorRate + metric.errorRate,
    systemLoad: acc.systemLoad + metric.systemLoad,
    availability: acc.availability + metric.availability,
  }), {
    throughput: 0,
    latency: 0,
    errorRate: 0,
    systemLoad: 0,
    availability: 0,
  });
  
  const metricCount = state.metricsHistory.length;
  Object.keys(avgMetrics).forEach(key => {
    avgMetrics[key] /= metricCount;
  });
  
  return {
    duration: state.currentTime,
    totalPackets,
    completedPackets: state.completedPackets,
    failedPackets: state.failedPackets,
    successRate,
    averageMetrics: avgMetrics,
    failures: state.failures,
    nodePerformance: Object.values(state.nodeHealth).map(health => ({
      nodeId: health.nodeId,
      averageLoad: health.currentLoad / health.maxCapacity,
      peakLoad: health.currentLoad, // Simplified - should track peak
      totalProcessed: health.metrics.throughput,
      averageLatency: health.metrics.latency,
      errorRate: health.metrics.errorRate,
    })),
  };
}

export const {
  startSimulation,
  pauseSimulation,
  resumeSimulation,
  stopSimulation,
  setSimulationSpeed,
  updateSimulationTime,
  createPacket,
  updatePacket,
  movePacket,
  completePacket,
  updateNodeHealth,
  recordFailure,
  updateMetrics,
  resetSimulation,
} = simulationSlice.actions;

export default simulationSlice.reducer;

// Selectors
export const selectIsSimulationRunning = (state: RootState) => state.simulation.isRunning;
export const selectSimulationMetrics = (state: RootState) => state.simulation.currentMetrics;
export const selectActivePackets = (state: RootState) => 
  state.simulation.activePacketIds.map(id => state.simulation.packets[id]);
export const selectNodeHealth = (nodeId: string) => (state: RootState) => 
  state.simulation.nodeHealth[nodeId];
export const selectSimulationResults = (state: RootState) => state.simulation.results;
```

### 3.5 Multiplayer Slice

```typescript
// store/slices/multiplayerSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Player, MultiplayerMode, GameRoom } from '../../types/multiplayer.types';

interface MultiplayerState {
  mode: MultiplayerMode | null;
  roomId: string | null;
  players: Record<string, Player>;
  localPlayerId: string | null;
  isHost: boolean;
  connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'error';
  
  // Challenge Mode
  challengeScores: Record<string, number>;
  challengeProgress: Record<string, number>;
  challengeTimeRemaining: number;
  
  // Collaborate Mode
  cursors: Record<string, { x: number; y: number; playerId: string }>;
  componentOwnership: Record<string, string>; // componentId -> playerId
  consensusVotes: Record<string, boolean>; // playerId -> vote
  chatMessages: ChatMessage[];
}

interface ChatMessage {
  id: string;
  playerId: string;
  playerName: string;
  message: string;
  timestamp: number;
}

const initialState: MultiplayerState = {
  mode: null,
  roomId: null,
  players: {},
  localPlayerId: null,
  isHost: false,
  connectionStatus: 'disconnected',
  
  challengeScores: {},
  challengeProgress: {},
  challengeTimeRemaining: 0,
  
  cursors: {},
  componentOwnership: {},
  consensusVotes: {},
  chatMessages: [],
};

const multiplayerSlice = createSlice({
  name: 'multiplayer',
  initialState,
  reducers: {
    // Connection Management
    connectToRoom: (state, action: PayloadAction<{ roomId: string; mode: MultiplayerMode; playerId: string }>) => {
      state.roomId = action.payload.roomId;
      state.mode = action.payload.mode;
      state.localPlayerId = action.payload.playerId;
      state.connectionStatus = 'connecting';
    },
    
    connectionEstablished: (state, action: PayloadAction<{ players: Player[]; isHost: boolean }>) => {
      state.connectionStatus = 'connected';
      state.isHost = action.payload.isHost;
      
      // Initialize players
      action.payload.players.forEach(player => {
        state.players[player.id] = player;
        
        if (state.mode === 'challenge') {
          state.challengeScores[player.id] = 0;
          state.challengeProgress[player.id] = 0;
        }
      });
    },
    
    connectionError: (state, action: PayloadAction<string>) => {
      state.connectionStatus = 'error';
    },
    
    disconnect: (state) => {
      return initialState;
    },
    
    // Player Management
    playerJoined: (state, action: PayloadAction<Player>) => {
      const player = action.payload;
      state.players[player.id] = player;
      
      if (state.mode === 'challenge') {
        state.challengeScores[player.id] = 0;
        state.challengeProgress[player.id] = 0;
      }
    },
    
    playerLeft: (state, action: PayloadAction<string>) => {
      const playerId = action.payload;
      delete state.players[playerId];
      delete state.challengeScores[playerId];
      delete state.challengeProgress[playerId];
      delete state.cursors[playerId];
      delete state.consensusVotes[playerId];
      
      // Transfer component ownership if needed
      Object.keys(state.componentOwnership).forEach(componentId => {
        if (state.componentOwnership[componentId] === playerId) {
          delete state.componentOwnership[componentId];
        }
      });
    },
    
    // Challenge Mode
    updateChallengeScore: (state, action: PayloadAction<{ playerId: string; score: number }>) => {
      const { playerId, score } = action.payload;
      state.challengeScores[playerId] = score;
    },
    
    updateChallengeProgress: (state, action: PayloadAction<{ playerId: string; progress: number }>) => {
      const { playerId, progress } = action.payload;
      state.challengeProgress[playerId] = progress;
    },
    
    updateChallengeTime: (state, action: PayloadAction<number>) => {
      state.challengeTimeRemaining = action.payload;
    },
    
    // Collaborate Mode
    updatePlayerCursor: (state, action: PayloadAction<{ playerId: string; x: number; y: number }>) => {
      const { playerId, x, y } = action.payload;
      state.cursors[playerId] = { x, y, playerId };
    },
    
    claimComponent: (state, action: PayloadAction<{ componentId: string; playerId: string }>) => {
      const { componentId, playerId } = action.payload;
      state.componentOwnership[componentId] = playerId;
    },
    
    releaseComponent: (state, action: PayloadAction<string>) => {
      const componentId = action.payload;
      delete state.componentOwnership[componentId];
    },
    
    // Consensus Voting
    castVote: (state, action: PayloadAction<{ playerId: string; vote: boolean }>) => {
      const { playerId, vote } = action.payload;
      state.consensusVotes[playerId] = vote;
    },
    
    resetVotes: (state) => {
      state.consensusVotes = {};
    },
    
    // Chat
    addChatMessage: (state, action: PayloadAction<Omit<ChatMessage, 'id' | 'timestamp'>>) => {
      const message: ChatMessage = {
        ...action.payload,
        id: `msg-${Date.now()}-${Math.random()}`,
        timestamp: Date.now(),
      };
      
      state.chatMessages.push(message);
      
      // Keep only last 100 messages
      if (state.chatMessages.length > 100) {
        state.chatMessages = state.chatMessages.slice(-100);
      }
    },
  },
});

export const {
  connectToRoom,
  connectionEstablished,
  connectionError,
  disconnect,
  playerJoined,
  playerLeft,
  updateChallengeScore,
  updateChallengeProgress,
  updateChallengeTime,
  updatePlayerCursor,
  claimComponent,
  releaseComponent,
  castVote,
  resetVotes,
  addChatMessage,
} = multiplayerSlice.actions;

export default multiplayerSlice.reducer;

// Selectors
export const selectIsMultiplayer = (state: RootState) => state.multiplayer.mode !== null;
export const selectMultiplayerMode = (state: RootState) => state.multiplayer.mode;
export const selectPlayers = (state: RootState) => Object.values(state.multiplayer.players);
export const selectLocalPlayer = (state: RootState) => 
  state.multiplayer.localPlayerId ? state.multiplayer.players[state.multiplayer.localPlayerId] : null;
export const selectChallengeLeaderboard = (state: RootState) => {
  const scores = state.multiplayer.challengeScores;
  return Object.entries(scores)
    .map(([playerId, score]) => ({
      player: state.multiplayer.players[playerId],
      score,
      progress: state.multiplayer.challengeProgress[playerId] || 0,
    }))
    .sort((a, b) => b.score - a.score);
};
```

---

## 4. Redux Middleware

### 4.1 Game Middleware

```typescript
// store/middleware/gameMiddleware.ts
import { Middleware } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { transitionPhase } from '../slices/gameSlice';
import { resetSimulation } from '../slices/simulationSlice';
import { saveProgress } from '../api/gameApi';

export const gameMiddleware: Middleware<{}, RootState> = (store) => (next) => (action) => {
  const result = next(action);
  const state = store.getState();
  
  // Phase transition side effects
  if (transitionPhase.match(action)) {
    const newPhase = action.payload;
    
    switch (newPhase) {
      case 'design':
        // Clear previous design if starting fresh
        if (state.design.nodes.length === 0) {
          // Initialize with starter components based on level
        }
        break;
        
      case 'simulation':
        // Validate design before simulation
        if (!state.design.isValidDesign) {
          console.warn('Cannot start simulation with invalid design');
          // Revert phase transition
          store.dispatch(transitionPhase('design'));
        }
        break;
        
      case 'review':
        // Calculate final score
        store.dispatch(calculateFinalScore());
        break;
    }
  }
  
  // Auto-save on significant actions
  const autoSaveActions = [
    'meeting/selectQuestion',
    'design/addNode',
    'design/deleteNode',
    'simulation/stopSimulation',
  ];
  
  if (autoSaveActions.some(actionType => action.type.startsWith(actionType))) {
    // Debounce saves
    clearTimeout((window as any).__saveTimeout);
    (window as any).__saveTimeout = setTimeout(() => {
      saveProgress(state);
    }, 5000);
  }
  
  return result;
};
```

### 4.2 Simulation Middleware

```typescript
// store/middleware/simulationMiddleware.ts
import { Middleware } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { 
  startSimulation, 
  createPacket, 
  updateMetrics,
  updateNodeHealth 
} from '../slices/simulationSlice';
import { SimulationEngine } from '../../engine/SimulationEngine';

let simulationEngine: SimulationEngine | null = null;
let animationFrameId: number | null = null;

export const simulationMiddleware: Middleware<{}, RootState> = (store) => (next) => (action) => {
  const result = next(action);
  
  if (startSimulation.match(action)) {
    const state = store.getState();
    
    // Initialize simulation engine
    simulationEngine = new SimulationEngine({
      nodes: state.design.nodes,
      edges: state.design.edges,
      trafficPattern: action.payload.trafficPattern,
      requirements: state.meeting.modifiedRequirements,
      
      onPacketCreate: (packet) => {
        store.dispatch(createPacket(packet));
      },
      
      onMetricsUpdate: (metrics) => {
        store.dispatch(updateMetrics(metrics));
      },
      
      onNodeHealthUpdate: (nodeId, health) => {
        store.dispatch(updateNodeHealth({ nodeId, health }));
      },
    });
    
    // Start animation loop
    const animate = (timestamp: number) => {
      const state = store.getState();
      
      if (state.simulation.isRunning && !state.simulation.isPaused) {
        simulationEngine?.tick(timestamp, state.simulation.speed);
      }
      
      if (state.simulation.isRunning) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };
    
    animationFrameId = requestAnimationFrame(animate);
  }
  
  // Cleanup on stop
  if (action.type === 'simulation/stopSimulation') {
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    
    simulationEngine?.destroy();
    simulationEngine = null;
  }
  
  return result;
};
```

### 4.3 Multiplayer Middleware

```typescript
// store/middleware/multiplayerMiddleware.ts
import { Middleware } from '@reduxjs/toolkit';
import { io, Socket } from 'socket.io-client';
import { RootState } from '../store';
import {
  connectToRoom,
  connectionEstablished,
  playerJoined,
  playerLeft,
  updatePlayerCursor,
  addChatMessage,
} from '../slices/multiplayerSlice';

let socket: Socket | null = null;

export const multiplayerMiddleware: Middleware<{}, RootState> = (store) => (next) => (action) => {
  const result = next(action);
  
  // Handle connection
  if (connectToRoom.match(action)) {
    const { roomId, mode, playerId } = action.payload;
    
    socket = io(process.env.REACT_APP_WEBSOCKET_URL!, {
      query: {
        roomId,
        mode,
        playerId,
      },
    });
    
    // Socket event handlers
    socket.on('connected', (data) => {
      store.dispatch(connectionEstablished(data));
    });
    
    socket.on('player-joined', (player) => {
      store.dispatch(playerJoined(player));
    });
    
    socket.on('player-left', (playerId) => {
      store.dispatch(playerLeft(playerId));
    });
    
    socket.on('cursor-update', (data) => {
      store.dispatch(updatePlayerCursor(data));
    });
    
    socket.on('chat-message', (message) => {
      store.dispatch(addChatMessage(message));
    });
    
    // Sync design changes in collaborate mode
    if (mode === 'collaborate') {
      socket.on('design-update', (data) => {
        // Update local design state with remote changes
        const { type, payload } = data;
        store.dispatch({ type: `design/${type}`, payload });
      });
    }
  }
  
  // Broadcast design actions in collaborate mode
  const state = store.getState();
  if (state.multiplayer.mode === 'collaborate' && socket?.connected) {
    const designActions = [
      'design/addNode',
      'design/updateNode',
      'design/deleteNode',
      'design/addEdge',
      'design/deleteEdge',
    ];
    
    if (designActions.includes(action.type)) {
      socket.emit('design-action', {
        type: action.type.replace('design/', ''),
        payload: action.payload,
        playerId: state.multiplayer.localPlayerId,
      });
    }
  }
  
  // Handle disconnect
  if (action.type === 'multiplayer/disconnect') {
    socket?.disconnect();
    socket = null;
  }
  
  return result;
};

// Helper functions for emitting events
export const emitCursorPosition = (x: number, y: number) => {
  socket?.emit('cursor-move', { x, y });
};

export const emitChatMessage = (message: string) => {
  socket?.emit('chat-message', { message });
};

export const emitComponentClaim = (componentId: string) => {
  socket?.emit('claim-component', { componentId });
};
```

---

## 5. Redux Selectors

### 5.1 Memoized Selectors

```typescript
// store/selectors/index.ts
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

// Game Progress Selectors
export const selectGameProgress = createSelector(
  [(state: RootState) => state.user.progress, (state: RootState) => state.level.currentLevel],
  (progress, currentLevel) => {
    if (!currentLevel) return null;
    
    return {
      currentLevel: currentLevel.id,
      completedLevels: progress.completedLevels,
      totalScore: progress.totalScore,
      isCurrentLevelComplete: progress.completedLevels.includes(currentLevel.id),
    };
  }
);

// Requirements Status Selector
export const selectRequirementsStatus = createSelector(
  [
    (state: RootState) => state.meeting.modifiedRequirements,
    (state: RootState) => state.design.nodes,
    (state: RootState) => state.design.edges,
  ],
  (requirements, nodes, edges) => {
    return requirements.map(req => ({
      ...req,
      isMet: evaluateRequirement(req, nodes, edges),
    }));
  }
);

// Design Validation Selector
export const selectDesignValidation = createSelector(
  [
    (state: RootState) => state.design.nodes,
    (state: RootState) => state.design.edges,
    (state: RootState) => state.design.totalCost,
    (state: RootState) => state.meeting.budget,
    selectRequirementsStatus,
  ],
  (nodes, edges, totalCost, budget, requirementsStatus) => {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];
    
    // Budget validation
    if (totalCost > budget) {
      errors.push({
        type: 'budget_exceeded',
        severity: 'error',
        message: `Budget exceeded by $${totalCost - budget}`,
      });
    } else if (totalCost > budget * 0.9) {
      warnings.push({
        type: 'budget_warning',
        severity: 'warning',
        message: 'Using over 90% of budget',
      });
    }
    
    // Requirements validation
    const unmetRequirements = requirementsStatus.filter(req => !req.isMet);
    unmetRequirements.forEach(req => {
      errors.push({
        type: 'requirement_unmet',
        severity: 'error',
        message: `Requirement not met: ${req.description}`,
      });
    });
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      score: calculateDesignScore(nodes, edges, requirementsStatus, totalCost, budget),
    };
  }
);

// Simulation Performance Selector
export const selectSimulationPerformance = createSelector(
  [
    (state: RootState) => state.simulation.metricsHistory,
    (state: RootState) => state.simulation.failures,
  ],
  (metricsHistory, failures) => {
    if (metricsHistory.length === 0) return null;
    
    // Calculate averages
    const totals = metricsHistory.reduce((acc, metric) => ({
      throughput: acc.throughput + metric.throughput,
      latency: acc.latency + metric.latency,
      errorRate: acc.errorRate + metric.errorRate,
      availability: acc.availability + metric.availability,
    }), { throughput: 0, latency: 0, errorRate: 0, availability: 0 });
    
    const count = metricsHistory.length;
    
    return {
      averageThroughput: totals.throughput / count,
      averageLatency: totals.latency / count,
      averageErrorRate: totals.errorRate / count,
      averageAvailability: totals.availability / count,
      totalFailures: failures.length,
      criticalFailures: failures.filter(f => f.severity === 'critical').length,
    };
  }
);

// Helper functions
function evaluateRequirement(
  requirement: Requirement,
  nodes: Node[],
  edges: Edge[]
): boolean {
  switch (requirement.type) {
    case 'min_capacity':
      const totalCapacity = nodes.reduce((sum, node) => sum + node.data.capacity, 0);
      return totalCapacity >= requirement.value;
      
    case 'max_latency':
      // Check if design can meet latency requirement
      return true; // Simplified
      
    case 'redundancy':
      // Check for redundant paths
      return hasRedundancy(nodes, edges, requirement.value);
      
    default:
      return true;
  }
}

function calculateDesignScore(
  nodes: Node[],
  edges: Edge[],
  requirements: any[],
  cost: number,
  budget: number
): number {
  let score = 0;
  
  // Requirements met (40%)
  const metRequirements = requirements.filter(r => r.isMet).length;
  score += (metRequirements / requirements.length) * 40;
  
  // Cost efficiency (20%)
  const costEfficiency = 1 - (cost / budget);
  score += costEfficiency * 20;
  
  // Architecture quality (40%)
  // Check for best practices
  if (hasLoadBalancer(nodes)) score += 10;
  if (hasCaching(nodes)) score += 10;
  if (hasMonitoring(nodes)) score += 10;
  if (hasRedundancy(nodes, edges, 2)) score += 10;
  
  return Math.round(score);
}
```

---

## 6. Redux Hooks

### 6.1 Typed Hooks

```typescript
// hooks/redux.ts
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

### 6.2 Custom Game Hooks

```typescript
// hooks/useGamePhase.ts
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './redux';
import { transitionPhase } from '../store/slices/gameSlice';
import { selectCurrentPhase } from '../store/selectors';

export const useGamePhase = () => {
  const dispatch = useAppDispatch();
  const currentPhase = useAppSelector(selectCurrentPhase);
  
  const goToPhase = useCallback((phase: GamePhase) => {
    dispatch(transitionPhase(phase));
  }, [dispatch]);
  
  const nextPhase = useCallback(() => {
    const phaseOrder: GamePhase[] = [
      'meeting',
      'mentor-selection',
      'design',
      'simulation',
      'review',
    ];
    
    const currentIndex = phaseOrder.indexOf(currentPhase);
    if (currentIndex < phaseOrder.length - 1) {
      dispatch(transitionPhase(phaseOrder[currentIndex + 1]));
    }
  }, [currentPhase, dispatch]);
  
  return {
    currentPhase,
    goToPhase,
    nextPhase,
  };
};

// hooks/useDesignCanvas.ts
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './redux';
import {
  addNode,
  deleteNode,
  addEdge,
  selectNode,
  undo,
  redo,
} from '../store/slices/designSlice';
import { selectCanUndo, selectCanRedo } from '../store/selectors';

export const useDesignCanvas = () => {
  const dispatch = useAppDispatch();
  const canUndo = useAppSelector(selectCanUndo);
  const canRedo = useAppSelector(selectCanRedo);
  
  const handleAddNode = useCallback((component: SystemComponent, position: XYPosition) => {
    dispatch(addNode({ component, position }));
  }, [dispatch]);
  
  const handleDeleteNode = useCallback((nodeId: string) => {
    dispatch(deleteNode(nodeId));
  }, [dispatch]);
  
  const handleConnect = useCallback((connection: Connection) => {
    dispatch(addEdge(connection));
  }, [dispatch]);
  
  const handleUndo = useCallback(() => {
    if (canUndo) {
      dispatch(undo());
    }
  }, [dispatch, canUndo]);
  
  const handleRedo = useCallback(() => {
    if (canRedo) {
      dispatch(redo());
    }
  }, [dispatch, canRedo]);
  
  return {
    addNode: handleAddNode,
    deleteNode: handleDeleteNode,
    connect: handleConnect,
    selectNode: (id: string | null) => dispatch(selectNode(id)),
    undo: handleUndo,
    redo: handleRedo,
    canUndo,
    canRedo,
  };
};
```

---

## 7. RTK Query API

### 7.1 Game API Definition

```typescript
// store/api/gameApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Level, UserProgress, LeaderboardEntry } from '../../types/api.types';

export const gameApi = createApi({
  reducerPath: 'gameApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).user.authToken;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Level', 'Progress', 'Leaderboard', 'User'],
  endpoints: (builder) => ({
    // Level Data
    getLevel: builder.query<Level, string>({
      query: (levelId) => `levels/${levelId}`,
      providesTags: (result, error, levelId) => [{ type: 'Level', id: levelId }],
    }),
    
    getLevels: builder.query<Level[], void>({
      query: () => 'levels',
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Level' as const, id })), 'Level']
          : ['Level'],
    }),
    
    // User Progress
    getUserProgress: builder.query<UserProgress, string>({
      query: (userId) => `users/${userId}/progress`,
      providesTags: (result, error, userId) => [{ type: 'Progress', id: userId }],
    }),
    
    saveProgress: builder.mutation<void, Partial<UserProgress>>({
      query: (progress) => ({
        url: 'progress',
        method: 'POST',
        body: progress,
      }),
      invalidatesTags: ['Progress'],
    }),
    
    // Leaderboard
    getLeaderboard: builder.query<LeaderboardEntry[], { levelId: string; mode: string }>({
      query: ({ levelId, mode }) => `leaderboard/${levelId}?mode=${mode}`,
      providesTags: (result, error, { levelId }) => [{ type: 'Leaderboard', id: levelId }],
    }),
    
    submitScore: builder.mutation<void, { levelId: string; score: number; design: any }>({
      query: (submission) => ({
        url: 'scores',
        method: 'POST',
        body: submission,
      }),
      invalidatesTags: ['Leaderboard'],
    }),
    
    // Achievements
    unlockAchievement: builder.mutation<void, string>({
      query: (achievementId) => ({
        url: `achievements/${achievementId}/unlock`,
        method: 'POST',
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useGetLevelQuery,
  useGetLevelsQuery,
  useGetUserProgressQuery,
  useSaveProgressMutation,
  useGetLeaderboardQuery,
  useSubmitScoreMutation,
  useUnlockAchievementMutation,
} = gameApi;
```

---

## 8. State Persistence

### 8.1 Redux Persist Configuration

```typescript
// store/persistConfig.ts
import storage from 'redux-persist/lib/storage';
import { createTransform } from 'redux-persist';

// Transform to handle React Flow node/edge serialization
const designTransform = createTransform(
  // Transform state on its way to being serialized and persisted
  (inboundState: any, key) => {
    if (key === 'design') {
      return {
        ...inboundState,
        // Remove non-serializable data
        draggedComponent: null,
        history: { past: [], future: [] }, // Reset history
      };
    }
    return inboundState;
  },
  // Transform state being rehydrated
  (outboundState: any, key) => {
    if (key === 'design') {
      return {
        ...outboundState,
        // Reinitialize non-serializable data
        validationErrors: [],
        isValidDesign: false,
      };
    }
    return outboundState;
  }
);

export const persistConfig = {
  key: 'system-design-tycoon',
  version: 1,
  storage,
  whitelist: ['user', 'level'], // Only persist these reducers
  blacklist: ['game', 'meeting', 'design', 'simulation', 'multiplayer', 'ui', 'api'],
  transforms: [designTransform],
  migrate: (state: any) => {
    // Handle migrations between versions
    return Promise.resolve(state);
  },
};
```

---

## 9. Performance Optimization

### 9.1 State Normalization

```typescript
// store/slices/entitiesSlice.ts
import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

// Normalize components for efficient lookups
const componentsAdapter = createEntityAdapter<SystemComponent>({
  selectId: (component) => component.id,
  sortComparer: (a, b) => a.category.localeCompare(b.category),
});

// Normalize achievements
const achievementsAdapter = createEntityAdapter<Achievement>({
  selectId: (achievement) => achievement.id,
  sortComparer: (a, b) => a.order - b.order,
});

const entitiesSlice = createSlice({
  name: 'entities',
  initialState: {
    components: componentsAdapter.getInitialState(),
    achievements: achievementsAdapter.getInitialState(),
  },
  reducers: {
    componentsLoaded: (state, action) => {
      componentsAdapter.setAll(state.components, action.payload);
    },
    achievementsLoaded: (state, action) => {
      achievementsAdapter.setAll(state.achievements, action.payload);
    },
  },
});

// Export selectors
export const {
  selectAll: selectAllComponents,
  selectById: selectComponentById,
  selectIds: selectComponentIds,
} = componentsAdapter.getSelectors((state: RootState) => state.entities.components);
```

### 9.2 Redux DevTools Configuration

```typescript
// store/devtools.ts
export const devToolsConfig = {
  name: 'System Design Tycoon',
  trace: true,
  traceLimit: 25,
  features: {
    pause: true,
    lock: true,
    persist: true,
    export: true,
    import: 'custom',
    jump: true,
    skip: true,
    reorder: true,
    dispatch: true,
    test: true,
  },
  // Action sanitizers
  actionSanitizer: (action: any) => {
    // Remove large payloads from DevTools
    if (action.type === 'simulation/updateMetrics' && action.payload) {
      return {
        ...action,
        payload: '<<METRICS_DATA>>',
      };
    }
    return action;
  },
  // State sanitizers
  stateSanitizer: (state: any) => {
    if (state.simulation?.packets && Object.keys(state.simulation.packets).length > 50) {
      return {
        ...state,
        simulation: {
          ...state.simulation,
          packets: '<<LARGE_PACKET_DATA>>',
        },
      };
    }
    return state;
  },
};
```

---

## 10. Testing State Management

### 10.1 Store Testing

```typescript
// store/__tests__/gameSlice.test.ts
import { configureStore } from '@reduxjs/toolkit';
import gameReducer, { startSession, transitionPhase } from '../slices/gameSlice';

describe('gameSlice', () => {
  let store: ReturnType<typeof configureStore>;
  
  beforeEach(() => {
    store = configureStore({
      reducer: { game: gameReducer },
    });
  });
  
  test('should start a new session', () => {
    store.dispatch(startSession({ levelId: 'level-1', sessionId: 'session-123' }));
    
    const state = store.getState().game;
    expect(state.currentLevelId).toBe('level-1');
    expect(state.sessionId).toBe('session-123');
    expect(state.currentPhase).toBe('meeting');
  });
  
  test('should transition between phases', () => {
    store.dispatch(startSession({ levelId: 'level-1', sessionId: 'session-123' }));
    store.dispatch(transitionPhase('design'));
    
    const state = store.getState().game;
    expect(state.currentPhase).toBe('design');
    expect(state.phaseHistory).toHaveLength(1);
    expect(state.phaseHistory[0].from).toBe('meeting');
    expect(state.phaseHistory[0].to).toBe('design');
  });
});

// Integration test with multiple slices
describe('Game Flow Integration', () => {
  let store: AppStore;
  
  beforeEach(() => {
    store = configureStore({
      reducer: {
        game: gameReducer,
        meeting: meetingReducer,
        design: designReducer,
      },
    });
  });
  
  test('should maintain state consistency across phase transitions', async () => {
    // Start game
    store.dispatch(startSession({ levelId: 'level-1', sessionId: 'session-123' }));
    
    // Load meeting data
    await store.dispatch(loadMeetingData('level-1'));
    
    // Select questions
    store.dispatch(selectQuestion('q1'));
    store.dispatch(selectQuestion('q2'));
    
    // Transition to design
    store.dispatch(transitionPhase('design'));
    
    // Verify requirements carried over
    const designState = store.getState().design;
    const meetingState = store.getState().meeting;
    
    expect(designState.requirements).toEqual(meetingState.modifiedRequirements);
  });
});
```

---

## 11. Summary

The Redux state management architecture for System Design Tycoon provides:

1. **Predictable State Updates**: All state changes go through reducers with clear action types
2. **Time-Travel Debugging**: Redux DevTools integration for debugging complex game flows
3. **Performance Optimization**: Normalized state, memoized selectors, and efficient middleware
4. **Multiplayer Support**: WebSocket integration through middleware for real-time collaboration
5. **Persistence**: Selective state persistence for user progress and preferences
6. **Type Safety**: Full TypeScript support with typed hooks and selectors
7. **Scalability**: Modular slice architecture that can grow with the game

The architecture separates concerns effectively:
- **Slices** handle domain-specific logic
- **Middleware** manages side effects and external integrations
- **Selectors** compute derived state efficiently
- **RTK Query** handles all server state management
- **Hooks** provide clean component interfaces

This approach ensures maintainable, testable, and performant state management throughout the game's lifecycle.