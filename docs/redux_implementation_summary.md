# Redux Implementation Summary - System Tycoon

## Overview
This document provides a comprehensive summary of the Redux implementation in System Tycoon, highlighting key patterns, best practices, and the centralized requirements validation system using Redux.

## Store Architecture

### Slice Organization
```
src/store/slices/
├── emailSlice.ts           - Email management with stage-based filtering
├── canvasSlice.ts          - System design canvas persistence  
├── mentorSlice.ts          - Mentor chat and guidance state
└── collaborationSlice.ts   - Collaboration invitations and real-time state

src/features/design/
└── designSlice.ts          - Core design state with requirements validation
```

### Root Store Configuration
- **RTK**: Using Redux Toolkit for simplified store setup
- **Middleware**: Default RTK middleware with proper serialization
- **DevTools**: Redux DevTools enabled for development debugging

## Canvas State Isolation Implementation

### Problem Solved
When switching between mission stages, the canvas retained components from previous stages instead of loading the correct isolated state for each stage.

### Solution Architecture

#### 1. Database Integration
- **Table**: `user_canvas_states` - Stores canvas state per user per stage
- **Schema**:
  ```sql
  CREATE TABLE user_canvas_states (
    id UUID,
    user_id UUID,
    mission_id UUID,
    stage_id UUID,
    canvas_state JSONB,  -- Stores nodes, edges, viewport
    last_saved TIMESTAMP WITH TIME ZONE,
    stage_title TEXT,
    mission_title TEXT
  );
  ```

#### 2. Canvas API Updates
```typescript
// Updated to use user_canvas_states table instead of user_mission_progress
loadCanvasState: builder.query({
  queryFn: async ({ userId, stageId }) => {
    const { data, error } = await supabase
      .from('user_canvas_states')
      .select('canvas_state, last_saved')
      .eq('user_id', userId)
      .eq('stage_id', stageId)
      .single();
    // ...
  }
})
```

#### 3. Design Slice Enhancement
```typescript
// New action for clearing canvas state
clearCanvas: (state, action: PayloadAction<{ keepRequirements?: boolean }>) => {
  // Clear nodes and edges
  state.nodes = [];
  state.edges = [];
  state.selectedNodeId = null;
  
  // Clear drag state and validation
  state.draggedComponent = null;
  state.isDragging = false;
  state.totalCost = 0;
  state.isValidDesign = false;
  state.validationErrors = [];
  
  // Reset viewport
  state.canvasViewport = { x: 0, y: 0, zoom: 1 };
  
  // Optionally preserve requirements when switching stages
  if (!keepRequirements) {
    state.systemRequirements = [];
    state.requirementValidationResults = [];
    // ...
  }
}
```

#### 4. Canvas Initialization Flow
```typescript
// In CrisisSystemDesignCanvas.tsx
const initializeCanvasForStage = useCallback(() => {
  // 1. Clear canvas when loading new stage
  dispatch(clearCanvas({ keepRequirements: false }));
  
  // 2. Check for saved canvas state
  if (savedCanvasData?.canvasState) {
    // Load saved state into design slice
    savedCanvasData.canvasState.nodes.forEach(node => {
      dispatch(addNode({ component: node.data, position: node.position }));
    });
    savedCanvasData.canvasState.edges.forEach(edge => {
      dispatch(addEdgeAction(edge));
    });
  } else {
    // 3. Load initial system state if no saved state
    loadInitialSystemState(missionStageData.id);
  }
}, [dispatch, missionStageData, savedCanvasData]);
```

### Redux Best Practices Applied

#### ✅ State Isolation
- Each mission stage has completely isolated canvas state
- Canvas is cleared before loading new stage data
- Prevents state pollution between stages

#### ✅ Automatic Persistence
- Canvas state auto-saves on changes with debouncing
- Uses RTK Query for optimized caching and updates
- Preserves user work between sessions

#### ✅ Clear Data Flow
1. **Stage Change**: Email clicked → New stage ID
2. **Clear Canvas**: Previous state cleared via Redux action
3. **Load State**: Saved state OR initial state loaded
4. **Auto-Save**: Changes persist automatically

#### ✅ Performance Optimization
- Debounced saves prevent excessive API calls
- Canvas state only loads when stage changes
- Memoized selectors prevent unnecessary re-renders

### Benefits
1. **User Experience**: Each stage starts with correct components
2. **Data Integrity**: No mixing of components between stages
3. **Progress Tracking**: User work is preserved per stage
4. **Scalability**: Easy to add new stages without conflicts

## Design Slice Implementation (Requirements Validation)

### State Shape
```typescript
interface DesignState {
  // React Flow Canvas State
  nodes: Node[];
  edges: Edge[];
  selectedNodeId: string | null;
  
  // Drag and Drop State
  draggedComponent: ComponentData | null;
  isDragging: boolean;
  
  // Design Metrics
  totalCost: number;
  isValidDesign: boolean;
  validationErrors: ValidationError[];
  
  // Canvas Viewport
  canvasViewport: { x: number; y: number; zoom: number };

  // Requirements Validation State (NEW)
  systemRequirements: SystemRequirement[];
  requirementValidationResults: RequirementValidationResult[];
  allRequirementsMet: boolean;
  requirementProgress: {
    completed: number;
    total: number;
    percentage: number;
  };
}
```

### Requirements Validation Flow

#### 1. Mission Stage Loading
```typescript
// In CrisisSystemDesignCanvas.tsx
if (stageData.system_requirements && stageData.system_requirements.length > 0) {
  dispatch(setSystemRequirements(stageData.system_requirements));
  console.log('✅ System requirements dispatched to Redux');
}
```

#### 2. Automatic Validation on Canvas Changes
```typescript
// In designSlice.ts - all canvas modification actions trigger validation
addNode: (state, action) => {
  // ... node addition logic
  designSlice.caseReducers.validateRequirements(state);
  designSlice.caseReducers.validateDesign(state);
},

addEdge: (state, action) => {
  // ... edge addition logic  
  designSlice.caseReducers.validateRequirements(state);
  designSlice.caseReducers.validateDesign(state);
}
```

#### 3. Real-time Validation Engine
```typescript
validateRequirements: (state) => {
  const validationResults: RequirementValidationResult[] = [];
  
  state.systemRequirements.forEach(requirement => {
    let completed = false;
    
    switch (requirement.validation_type) {
      case 'node_count':
        // Validate minimum nodes of specific types
        if (requirement.min_nodes_of_type) {
          const results = Object.entries(requirement.min_nodes_of_type).map(([category, minCount]) => {
            const nodeCount = state.nodes.filter(node => 
              node.data.category === category || 
              (category === 'compute' && ['web_server', 'app_server', 'server'].includes(node.type || ''))
            ).length;
            return { category, required: minCount, actual: nodeCount, met: nodeCount >= minCount };
          });
          completed = results.every(r => r.met);
        }
        break;
        
      case 'edge_connection':
        // Validate required connections between component types
        if (requirement.required_connection) {
          const { from, to } = requirement.required_connection;
          completed = state.edges.some(edge => {
            const sourceNode = state.nodes.find(n => n.id === edge.source);
            const targetNode = state.nodes.find(n => n.id === edge.target);
            return matchesComponentType(sourceNode, from) && matchesComponentType(targetNode, to);
          });
        }
        break;
        
      case 'node_removal':
        // Validate forbidden nodes are removed
        if (requirement.required_nodes) {
          const forbiddenNodesPresent = requirement.required_nodes.filter(forbiddenId => 
            state.nodes.some(node => node.id === forbiddenId)
          );
          completed = forbiddenNodesPresent.length === 0;
        }
        break;
    }
    
    validationResults.push({
      id: requirement.id,
      description: requirement.description,
      completed,
      validationDetails: { /* detailed validation info */ }
    });
  });
  
  // Update progress metrics
  state.requirementValidationResults = validationResults;
  state.allRequirementsMet = validationResults.every(r => r.completed);
  state.requirementProgress = {
    completed: validationResults.filter(r => r.completed).length,
    total: validationResults.length,
    percentage: /* calculated percentage */
  };
}
```

### Redux Best Practices Implementation

#### ✅ Centralized State Management
```typescript
// Requirements state is centralized in Redux, not component props
// Components connect directly to Redux store via selectors

// BAD (old approach): Prop drilling
<Requirements 
  requirements={requirements}
  systemRequirements={missionStageData.system_requirements}
  canvasNodes={nodes}
  canvasEdges={edges}
/>

// GOOD (new approach): Direct Redux connection
<Requirements onTestSystem={handleRunTest} />
```

#### ✅ Memoized Selectors for Performance
```typescript
// Memoized selectors prevent unnecessary re-renders
export const selectRequirementsStatus = createSelector(
  [selectRequirementValidationResults, selectRequirementProgress],
  (validationResults, progress) => ({
    requirements: validationResults,
    progress,
    allMet: validationResults.length > 0 && validationResults.every(req => req.completed),
    completedCount: progress.completed,
    totalCount: progress.total,
    percentage: progress.percentage
  })
);

export const selectCanvasValidation = createSelector(
  [selectNodes, selectEdges, selectIsValidDesign, selectValidationErrors, selectAllRequirementsMet],
  (nodes, edges, isValidDesign, validationErrors, allRequirementsMet) => ({
    isValidDesign,
    validationErrors,
    allRequirementsMet,
    canProceed: isValidDesign && allRequirementsMet,
    hasComponents: nodes.length > 0,
    hasConnections: edges.length > 0
  })
);
```

#### ✅ Component Store Connection
```typescript
// Requirements component connects directly to Redux
export const Requirements: React.FC<RequirementsProps> = ({ onTestSystem, className }) => {
  // Connect to Redux store using memoized selectors (Redux best practice)
  const requirementsStatus = useAppSelector(selectRequirementsStatus);
  const canvasValidation = useAppSelector(selectCanvasValidation);

  const { requirements, progress, allMet } = requirementsStatus;
  const { canProceed } = canvasValidation;

  // Component renders based on Redux state, no props needed
  return (
    <div className={clsx(styles.requirements, className)}>
      {/* UI renders from Redux state */}
    </div>
  );
};
```

#### ✅ Automatic State Updates
```typescript
// Requirements automatically update when canvas changes
// No manual validation calls needed in components

// When user adds a node:
dispatch(addNode({ component, position }));
// ↓ Automatically triggers:
// 1. validateRequirements(state)  
// 2. validateDesign(state)
// 3. Requirements component re-renders with updated status
```

## Collaboration Slice Implementation

### Invitation System Architecture

The collaboration system enables users to invite others to work together on mission stages in real-time. This implementation follows Redux best practices for managing invitations, email notifications, and collaborative state.

#### State Shape
```typescript
interface CollaborationState {
  // Invitation Management
  sentInvitations: CollaborationInvitation[];
  receivedInvitations: CollaborationInvitation[];
  
  // Loading States
  isLoading: boolean;
  isSendingInvitation: boolean;
  isUpdatingInvitation: boolean;
  
  // Error Handling
  error: string | null;
  sendError: string | null;
  
  // UI State
  unreadInvitationsCount: number;
}
```

#### Database Integration
```sql
-- Collaboration invitations table with proper RLS policies
CREATE TABLE collaboration_invitations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  invited_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  mission_stage_id UUID NOT NULL REFERENCES mission_stages(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'expired')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (timezone('utc'::text, now()) + INTERVAL '7 days') NOT NULL,
  UNIQUE(sender_id, invited_id, mission_stage_id)
);
```

#### Async Thunk Implementation
```typescript
// Send collaboration invitation with email generation
export const sendCollaborationInvitation = createAsyncThunk(
  'collaboration/sendInvitation',
  async (params: {
    inviteeEmail: string;
    missionStageId: string;
    missionId: string;
  }, { getState, rejectWithValue }) => {
    try {
      // 1. Validate sender authentication
      // 2. Find recipient by email/username
      // 3. Check for existing invitations
      // 4. Create collaboration invitation record
      // 5. Generate emails for both sender and recipient
      // 6. Return complete invitation data with populated references
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
```

#### Email Integration Flow
When an invitation is sent, the system automatically creates:

1. **Sender Email (Sent Folder)**:
   ```typescript
   // Email confirming invitation was sent
   {
     subject: `Collaboration Invitation Sent to ${recipientData.username}`,
     preview: `You invited ${recipientData.username} to collaborate...`,
     category: 'collaboration',
     is_read: true, // Sender's copy is marked as read
   }
   ```

2. **Recipient Email (Inbox)**:
   ```typescript
   // Invitation email with mission context
   {
     subject: `${senderProfile.username} invited you to collaborate!`,
     preview: `Join ${senderProfile.username} to work together...`,
     category: 'collaboration',
     priority: 'high',
     is_read: false, // Recipient's copy is unread
   }
   ```

#### Custom Hook Pattern
```typescript
// useCollaboration hook following established patterns
export const useCollaboration = () => {
  const dispatch = useAppDispatch();
  
  // Selectors
  const sentInvitations = useAppSelector(state => state.collaboration.sentInvitations);
  const receivedInvitations = useAppSelector(state => state.collaboration.receivedInvitations);
  const isSending = useAppSelector(state => state.collaboration.isSendingInvitation);
  const sendError = useAppSelector(state => state.collaboration.sendError);
  
  // Actions
  const sendInvitation = useCallback(async (params) => {
    return dispatch(sendCollaborationInvitation(params));
  }, [dispatch]);
  
  const loadInvitations = useCallback(() => {
    dispatch(loadCollaborationInvitations());
  }, [dispatch]);
  
  return { sentInvitations, receivedInvitations, isSending, sendError, sendInvitation, loadInvitations };
};
```

#### Component Integration
```typescript
// InviteCollaboratorModal uses Redux instead of direct Supabase calls
export const InviteCollaboratorModal: React.FC<InviteCollaboratorModalProps> = ({
  isOpen, onClose, stageId, missionId
}) => {
  const dispatch = useAppDispatch();
  const isSending = useAppSelector(selectIsSendingInvitation);
  const sendError = useAppSelector(selectSendError);

  const handleInvite = async () => {
    try {
      await dispatch(sendCollaborationInvitation({
        inviteeEmail: inviteEmail.trim(),
        missionStageId: stageId,
        missionId: missionId
      })).unwrap();
      
      // Success handling
    } catch (error) {
      // Error handling managed by Redux state
    }
  };
};
```

### Redux Best Practices in Collaboration System

#### ✅ Type Safety Throughout
- Full TypeScript interfaces for all collaboration data
- Proper typing for async thunks and selectors
- Type-safe error handling with proper error message typing

#### ✅ Error Boundary Separation
- `sendError` for invitation sending errors
- `error` for general collaboration errors
- Clear error states prevent UI confusion

#### ✅ Loading State Management
- Separate loading states for different operations
- `isSendingInvitation`, `isLoading`, `isUpdatingInvitation`
- Prevents race conditions and improves UX

#### ✅ State Normalization
- Invitations stored as arrays with proper relationships
- Related data (profiles, mission stages) populated via joins
- Efficient data access patterns

## Email Slice Implementation

### Stage-Based Filtering Implementation

#### Database Layer
- **Function**: `get_emails_for_current_stage(p_user_id UUID)`
- **Purpose**: Server-side filtering of emails based on user's current mission progress
- **Logic**: 
  - Queries user's current mission stage from `user_mission_progress`
  - Returns only emails associated with the current stage
  - Handles cases where user hasn't started missions (shows stage 1 emails)

#### Redux Integration
```typescript
// Async thunk for loading stage-filtered emails
export const loadUserEmails = createAsyncThunk(
  'email/loadUserEmails',
  async (_, { rejectWithValue }) => {
    try {
      const emails = await fetchEmails(); // Calls database function
      return emails.map(convertToReduxFormat);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
```

### Benefits of Redux-First Approach

1. **Single Source of Truth**: All requirements validation logic in one place
2. **Automatic Updates**: Canvas changes automatically trigger requirement validation
3. **Performance**: Memoized selectors prevent unnecessary re-renders  
4. **Testability**: Pure functions in Redux slices are easy to test
5. **Developer Experience**: Redux DevTools show complete state flow
6. **Consistency**: All components see the same validation state
7. **Scalability**: Easy to add new requirement types and validation logic

## Integration with Other Systems

### Mission Progress Integration
- Requirements are loaded from `mission_stages.system_requirements`
- Validation results help determine mission stage completion
- Progress tracking integrates with user advancement system

### Canvas State Synchronization  
- Canvas changes (add/remove nodes/edges) automatically trigger validation
- Real-time feedback as users build their system architecture
- Validation state persists with canvas state for consistent experience

## Future Enhancements

### Planned Improvements
1. **Advanced Validation Rules**: Support for performance metrics, security requirements
2. **Validation Hints**: Contextual guidance when requirements aren't met
3. **Requirement Dependencies**: Complex validation chains between requirements
4. **Custom Validators**: Plugin system for game-specific validation logic

### Real-Time Collaboration Features (Planned)

The current collaboration implementation handles **invitation flow only**. The following real-time collaborative features are documented but not yet implemented:

#### Missing Components (From @realtime_collaboration.md)
1. **Real-Time Canvas Synchronization**:
   - `design_sessions` table for active collaboration sessions
   - `canvas_components` and `canvas_connections` for real-time sync
   - `session_participants` for active collaborator tracking

2. **Live Cursor Tracking**:
   - `useRealtimeCollaboration` hook with Supabase Realtime
   - `CollaboratorCursor` and `CursorManager` components
   - Presence API integration for cursor positions

3. **Component Synchronization**:
   - Real-time component add/move/delete across clients
   - Conflict resolution for simultaneous edits
   - Optimistic updates with rollback capability

4. **Performance Optimization**:
   - Throttling for cursor movements (50ms)
   - Message batching for component updates
   - Rate limiting for spam prevention

#### Implementation Priority
- **Phase 1** ✅ Invitation system (COMPLETE)
- **Phase 2** 🔄 Real-time cursor tracking and presence
- **Phase 3** 🔄 Component synchronization and conflict resolution
- **Phase 4** 🔄 Performance optimization and polish

This architectural separation allows the invitation system to function independently while providing a foundation for future real-time features.

## Conclusion

The Redux implementation in System Tycoon now follows industry best practices with centralized state management, memoized selectors, and direct component-store connections. Both the requirements validation system and collaboration invitation system demonstrate proper Redux patterns:

- **State centralization** - All validation and collaboration logic in Redux slices
- **Automatic updates** - Canvas changes trigger real-time validation; invitations update email systems
- **Performance optimization** - Memoized selectors prevent unnecessary renders
- **Clean separation** - UI components focus on presentation, Redux handles business logic
- **Type safety** - Full TypeScript support with proper error handling
- **Async flow management** - Proper async thunk patterns for complex operations

This architecture provides a solid foundation for complex system design validation and collaboration features while maintaining excellent performance and developer experience. The collaboration invitation system serves as a foundation for future real-time collaborative features. 