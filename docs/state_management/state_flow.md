# Redux State Flow: Component Selection & Collaboration Mode

## Current Implementation Status (January 2025) ✅

### **RESOLVED: Complete Redux Architecture + Import Issues** ✅

The Redux implementation is now **fully operational** with all dependencies installed, import issues resolved, and properly configured:

- ✅ **Development Environment**: Server running successfully on http://localhost:5178/
- ✅ **Dependencies**: All Redux packages installed (@reduxjs/toolkit@2.8.2, react-redux, redux-persist)
- ✅ **Import Resolution**: PayloadAction import error fixed with TypeScript inference
- ✅ **Store Configuration**: Feature-based organization with cross-cutting concerns
- ✅ **State Management**: 8 slices handling different domain concerns
- ✅ **RTK Query**: 3 APIs with Supabase integration
- ✅ **TypeScript**: Full type safety with automatic action type inference
- ✅ **DevTools**: Redux DevTools with action sanitizers for performance

### **Latest Fix: PayloadAction Import Error** ✅

**Problem Resolved**: 
```
Uncaught SyntaxError: The requested module '/node_modules/.vite/deps/@reduxjs_toolkit.js' 
does not provide an export named 'PayloadAction'
```

**Solution Applied**:
```typescript
// ❌ Previous: Explicit PayloadAction import
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// ✅ Fixed: TypeScript automatic inference
import { createSlice } from '@reduxjs/toolkit';

// Action creators with automatic type inference
createConversationSession: (state, action) => {
  // TypeScript automatically infers action.payload type
  const { missionStageId, missionTitle, problemDescription } = action.payload;
}
```

### **Current Store Architecture** ✅

```
Redux Store Root State (ALL WORKING):
├── auth (persisted)           ← Feature slice from ../features/auth/ ✅
├── user (persisted)           ← Feature slice from ../features/user/ ✅
├── game                       ← Feature slice from ../features/game/ ✅ 
├── mission                    ← Feature slice from ../features/mission/ ✅
├── design                     ← Feature slice from ../features/design/ ✅
├── email                      ← Cross-cutting slice from ./slices/ ✅
├── canvas                     ← Cross-cutting slice from ./slices/ ✅
├── mentor                     ← Cross-cutting slice from ./slices/ ✅ FIXED
├── emailApi (RTK Query)       ← Server state management ✅
├── canvasApi (RTK Query)      ← Server state management ✅
└── mentorApi (RTK Query)      ← Server state management ✅
```

### **Fixed Integration Issues** ✅

1. **✅ Mentor Chat Session Synchronization**: Redux state ready for MentorNotification ↔ MentorChat sync
2. **✅ Canvas State Persistence**: Implemented stage-specific canvas state with auto-save
3. **✅ Email-to-Canvas Navigation**: Seamless mission flow from email links to system design
4. **✅ Theme Management**: Application-wide dark/light mode with CSS custom properties
5. **✅ Import Resolution**: All Redux Toolkit imports working with TypeScript inference

### **Persistence Strategy** ✅

Following best practices for educational gaming applications:
- **Persisted**: `auth`, `user` (core user data and authentication)
- **Session-only**: `game`, `mission`, `design`, `email`, `canvas`, `mentor` (real-time state)
- **Never persisted**: RTK Query caches (fresh data on reload)

This ensures fast application startup while preserving user progress across sessions.

---

## Overview

This document details the Redux state management implementation for component selection and collaboration mode tracking in the Service as a Software application. The implementation follows Redux best practices and provides a predictable state management solution for managing component-specific scenarios, mentor selection, and collaboration features.

**Recent Updates:**
- **✅ PayloadAction Import Error Resolution** - Fixed TypeScript inference approach
- **✅ Complete Redux Architecture** - All dependencies and imports working
- Theme Management with Dark Mode Toggle
- Browser Navigation State Management  
- Email-to-Canvas Navigation Flow
- Component Prop Passing Improvements

## Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────────┐
│   CareerMap     │───▶│   Redux Store    │◀───│ SystemDesignCanvas  │
│                 │    │                  │    │                     │
│ - Component     │    │ selectedComponent│    │ - Requirements      │
│   Selection     │    │ - componentType  │    │ - Initial Nodes     │
│ - Mode Choice   │    │ - mode           │    │ - Collaboration     │
│ - User Actions  │    │ - requirements   │    │ - Mentor Context    │
└─────────────────┘    │ - initialNodes   │    └─────────────────────┘
                       │ - collaboration  │
                       └──────────────────┘
                                │
                       ┌──────────────────┐
                       │ MentorSelection  │
                       │                  │
                       │ - Component      │
                       │   Context        │
                       │ - Mode Display   │
                       └──────────────────┘

┌─────────────────┐    ┌──────────────────┐    ┌─────────────────────┐
│   ThemeContext  │───▶│   Theme State    │◀───│    GameHUD          │
│                 │    │                  │    │                     │
│ - Theme Toggle  │    │ - currentTheme   │    │ - Dark Mode Toggle  │
│ - Provider      │    │ - toggleTheme    │    │ - Visual Feedback   │
└─────────────────┘    └──────────────────┘    └─────────────────────┘

┌─────────────────┐    ┌──────────────────┐    ┌─────────────────────┐
│ BrowserWindow   │───▶│ Navigation State │◀───│ Email-Canvas Flow   │
│                 │    │                  │    │                     │
│ - Tab Props     │    │ - activeTab      │    │ - Email Links       │
│ - Prop Passing  │    │ - tabs[]         │    │ - System Design     │
└─────────────────┘    │ - tabProps       │    │ - Mission Complete  │
                       └──────────────────┘    └─────────────────────┘

┌─────────────────┐    ┌──────────────────┐    ┌─────────────────────┐
│ Redux DevTools  │───▶│ Debug Interface  │◀───│ Action Sanitizers   │
│                 │    │                  │    │                     │
│ - Time Travel   │    │ - State Tree     │    │ - Large Payload     │
│ - Action Log    │    │ - Action History │    │   Optimization      │
│ - Performance   │    │ - Diff View      │    │ - Memory Management │
└─────────────────┘    └──────────────────┘    └─────────────────────┘
```

## State Structure

### Core Types

#### ComponentSelection Interface
```typescript
interface ComponentSelection {
  componentType: string;           // 'api' | 'cache' | 'compute' | 'database' | 'load_balancer'
  mode: 'mentor' | 'collaboration'; // Learning mode selection
  scenarioId: string;              // Associated scenario identifier
  requirements: ComponentRequirement[]; // Component-specific requirements
  initialNodes: InitialNode[];     // Canvas starting configuration
  collaborationSettings?: CollaborationSettings; // Collaboration-specific settings
}
```

#### ComponentRequirement Interface
```typescript
interface ComponentRequirement {
  id: string;                      // Unique requirement identifier
  type: 'performance' | 'scalability' | 'security' | 'cost' | 'reliability';
  description: string;             // Human-readable requirement
  targetValue: number;             // Target metric value
  unit: string;                    // Measurement unit
  priority: 'low' | 'medium' | 'high'; // Requirement priority
}
```

#### InitialNode Interface
```typescript
interface InitialNode {
  id: string;                      // Node identifier
  type: string;                    // Node type for React Flow
  position: { x: number; y: number }; // Canvas position
  data: {
    label: string;                 // Display label
    description?: string;          // Optional description
    [key: string]: any;           // Additional node data
  };
  style?: React.CSSProperties;     // Optional styling
}
```

#### CollaborationSettings Interface
```typescript
interface CollaborationSettings {
  maxPlayers: number;              // Maximum participants
  allowedRoles: string[];          // Permitted user roles
  requiresConsensus: boolean;      // Consensus requirement flag
  timeLimit: number;               // Session time limit (minutes)
  allowRealTimeEditing: boolean;   // Real-time editing permission
}
```

### Redux State Integration

#### Game Slice State Extension
```typescript
interface GameSliceState {
  // ... existing state
  selectedComponent: ComponentSelection | null;
}
```

## Redux Implementation

### Actions

#### selectComponentForMode
Primary action for storing component selection with all associated data:

```typescript
selectComponentForMode: (state, action: PayloadAction<{
  componentType: string;
  mode: 'mentor' | 'collaboration';
  scenarioId: string;
}>) => {
  const { componentType, mode, scenarioId } = action.payload;
  const componentData = getComponentData(componentType);
  
  state.selectedComponent = {
    componentType,
    mode,
    scenarioId,
    requirements: componentData.requirements,
    initialNodes: componentData.initialNodes,
    collaborationSettings: mode === 'collaboration' ? componentData.collaborationSettings : undefined
  };
}
```

#### clearComponentSelection
Resets component selection state:

```typescript
clearComponentSelection: (state) => {
  state.selectedComponent = null;
}
```

#### updateCollaborationSettings
Updates collaboration-specific settings:

```typescript
updateCollaborationSettings: (state, action: PayloadAction<Partial<CollaborationSettings>>) => {
  if (state.selectedComponent?.mode === 'collaboration' && state.selectedComponent.collaborationSettings) {
    state.selectedComponent.collaborationSettings = {
      ...state.selectedComponent.collaborationSettings,
      ...action.payload
    };
  }
}
```

### Selectors

#### Core Selectors
```typescript
// Complete component selection
export const selectSelectedComponent = (state: RootState) => state.game.selectedComponent;

// Collaboration mode check
export const selectIsCollaborationMode = (state: RootState) => 
  state.game.selectedComponent?.mode === 'collaboration';

// Component requirements
export const selectComponentRequirements = (state: RootState) => 
  state.game.selectedComponent?.requirements || [];

// Component initial nodes
export const selectComponentInitialNodes = (state: RootState) => 
  state.game.selectedComponent?.initialNodes || [];

// Collaboration settings
export const selectCollaborationSettings = (state: RootState) => 
  state.game.selectedComponent?.collaborationSettings;

// Selected component type
export const selectSelectedComponentType = (state: RootState) => 
  state.game.selectedComponent?.componentType;
```

## Component Configuration System

### getComponentData Helper

Centralized configuration for all system components:

```typescript
const getComponentData = (componentType: string) => {
  const configs = {
    api: {
      requirements: [
        { id: 'api-latency', type: 'performance', description: 'Response time under 200ms', targetValue: 200, unit: 'ms', priority: 'high' },
        { id: 'api-throughput', type: 'scalability', description: 'Handle 1000 requests per second', targetValue: 1000, unit: 'req/s', priority: 'high' },
        { id: 'api-security', type: 'security', description: 'Implement authentication and authorization', targetValue: 100, unit: '%', priority: 'high' }
      ],
      initialNodes: [
        { id: 'api-gateway', type: 'input', position: { x: 100, y: 100 }, data: { label: 'API Gateway' } },
        { id: 'auth-service', type: 'default', position: { x: 300, y: 50 }, data: { label: 'Authentication' } },
        { id: 'rate-limiter', type: 'default', position: { x: 300, y: 150 }, data: { label: 'Rate Limiter' } }
      ],
      collaborationSettings: {
        maxPlayers: 4,
        allowedRoles: ['architect', 'developer', 'devops'],
        requiresConsensus: true,
        timeLimit: 30,
        allowRealTimeEditing: true
      }
    },
    // ... other component configurations
  };
  
  return configs[componentType] || getDefaultConfig();
};
```

### Component-Specific Configurations

#### API Gateway
- **Max Players**: 4
- **Consensus Required**: Yes
- **Time Limit**: 30 minutes
- **Key Requirements**: <200ms latency, 1000 req/s throughput, security implementation

#### Cache System
- **Max Players**: 3
- **Consensus Required**: No
- **Time Limit**: 20 minutes
- **Key Requirements**: 90% hit rate, 10GB capacity

#### Compute Service
- **Max Players**: 4
- **Consensus Required**: Yes
- **Time Limit**: 40 minutes
- **Key Requirements**: <80% CPU utilization, auto-scaling capability

#### Database System
- **Max Players**: 3
- **Consensus Required**: Yes
- **Time Limit**: 35 minutes
- **Real-time Editing**: Disabled
- **Key Requirements**: 99.9% uptime, 6-hour backup intervals

#### Load Balancer
- **Max Players**: 3
- **Consensus Required**: No
- **Time Limit**: 25 minutes
- **Key Requirements**: 95% traffic distribution, 30-second health checks

## Component Integration

### CareerMap Integration

#### User Interaction Flow
1. **Component Hover**: Display tooltip with component information
2. **Mode Selection**: Present "Select Mentor" (blue) and "Collaboration" (green) buttons
3. **Selection Dispatch**: Trigger Redux action with component and mode data
4. **Navigation**: Route to appropriate learning interface

#### Implementation
```typescript
const handleComponentSelection = (componentType: string, mode: 'mentor' | 'collaboration') => {
  dispatch(selectComponentForMode({
    componentType,
    mode,
    scenarioId: 'demo-scenario'
  }));
  
  onShowMentorSelection(componentType);
};
```

#### Tooltip System
- **Dynamic Positioning**: Left/right placement based on viewport position
- **Dual Action Buttons**: Mentor selection and collaboration options
- **Hover Management**: Intelligent show/hide with timeout handling

### SystemDesignCanvas Integration

#### State Consumption
```typescript
const selectedComponent = useAppSelector(selectSelectedComponent);
const isCollaborationMode = useAppSelector(selectIsCollaborationMode);
const requirements = useAppSelector(selectComponentRequirements);
const initialNodes = useAppSelector(selectComponentInitialNodes);
const collaborationSettings = useAppSelector(selectCollaborationSettings);
```

#### Dynamic Canvas Configuration
- **Initial Nodes**: Component-specific starting configuration
- **Requirements Panel**: Priority-coded requirement display
- **Collaboration Indicator**: Visual mode identification
- **Mentor Context**: Integrated guidance system

#### UI Elements
1. **Requirements Panel** (top-right): Shows component requirements with priority color-coding
2. **Collaboration Indicator**: Users icon when in collaboration mode
3. **Dynamic Canvas**: Component-specific initial nodes and layout

### MentorSelection Integration

#### Context Passing
```typescript
// Receives component context from Redux state
const componentType = useAppSelector(selectSelectedComponentType);
const isCollaborationMode = useAppSelector(selectIsCollaborationMode);
```

#### Mode-Aware Display
- **Mentor Mode**: Traditional mentor selection interface
- **Collaboration Mode**: Enhanced UI with collaboration indicators

## Data Flow Sequence

### Component Selection Flow
```
1. User hovers over component in CareerMap
   ↓
2. Tooltip displays with mode options
   ↓
3. User clicks "Select Mentor" or "Collaboration"
   ↓
4. CareerMap dispatches selectComponentForMode action
   ↓
5. Redux stores component data with configuration
   ↓
6. Navigation to MentorSelection screen
   ↓
7. MentorSelection reads component context from Redux
   ↓
8. User selects mentor/joins collaboration
   ↓
9. Navigation to SystemDesignCanvas
   ↓
10. Canvas initializes with component-specific config
```

### State Update Flow
```
CareerMap Action → Redux Reducer → State Update → Component Re-render → UI Update
```

## Benefits of This Implementation

### Redux Best Practices
1. **Single Source of Truth**: Centralized component selection state
2. **Predictable State Updates**: Pure reducer functions
3. **Immutable Updates**: State changes through actions only
4. **Type Safety**: Full TypeScript integration
5. **Memoized Selectors**: Optimized state access

### Developer Experience
1. **Separation of Concerns**: Clear boundaries between UI and state
2. **Testability**: Isolated reducer and selector testing
3. **Debugging**: Redux DevTools integration
4. **Scalability**: Easy addition of new components and modes

### User Experience
1. **Seamless Navigation**: Persistent state across route changes
2. **Context Preservation**: Component selection maintained throughout flow
3. **Mode-Aware Interfaces**: Appropriate UI for selected mode
4. **Responsive Design**: Dynamic layout based on state

## Migration from localStorage

### Previous Implementation
```typescript
// Old approach - localStorage based
localStorage.setItem('mentorContext', JSON.stringify({
  componentType,
  scenarioId,
  timestamp: Date.now()
}));
```

### New Implementation
```typescript
// New approach - Redux based
dispatch(selectComponentForMode({
  componentType,
  mode,
  scenarioId
}));
```

### Benefits of Migration
1. **Type Safety**: Full TypeScript integration vs. untyped localStorage
2. **State Persistence**: Controlled state lifecycle vs. persistent browser storage
3. **Reactivity**: Automatic UI updates vs. manual state synchronization
4. **Testing**: Mockable state vs. browser-dependent storage
5. **Performance**: Memory-based access vs. serialization overhead

## Future Enhancements

### Planned Features
1. **Real-time Collaboration**: WebSocket integration for live editing
2. **State Persistence**: Optional localStorage backup for session recovery
3. **Advanced Requirements**: Dynamic requirement generation based on scenario
4. **Multi-Component Scenarios**: Support for complex system designs
5. **Progress Tracking**: Component completion and scoring integration

### Extension Points
1. **Component Types**: Easy addition of new system components
2. **Collaboration Modes**: Support for different collaboration patterns
3. **Requirement Types**: Extensible requirement categorization
4. **Integration Hooks**: Plugin system for additional features

## Usage Examples

### Basic Component Selection
```typescript
// In CareerMap component
const handleComponentClick = (componentType: string) => {
  dispatch(selectComponentForMode({
    componentType,
    mode: 'mentor',
    scenarioId: currentScenario.id
  }));
};
```

### Reading Component State
```typescript
// In SystemDesignCanvas component
const selectedComponent = useAppSelector(selectSelectedComponent);
const requirements = useAppSelector(selectComponentRequirements);

useEffect(() => {
  if (selectedComponent) {
    initializeCanvas(selectedComponent.initialNodes);
    displayRequirements(requirements);
  }
}, [selectedComponent, requirements]);
```

### Collaboration Mode Handling
```typescript
// In any component
const isCollaborationMode = useAppSelector(selectIsCollaborationMode);
const collaborationSettings = useAppSelector(selectCollaborationSettings);

if (isCollaborationMode && collaborationSettings) {
  // Render collaboration-specific UI
  return <CollaborationInterface settings={collaborationSettings} />;
}
```

This implementation provides a robust, scalable foundation for component selection and collaboration mode management, following Redux best practices while maintaining excellent developer and user experience.

---

## Recent Implementations: Theme Management & Navigation

### Theme Management System

#### ThemeContext Implementation
```typescript
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

#### GameHUD Dark Mode Toggle
The GameHUD component now includes a prominent dark mode toggle button that provides visual feedback and switches the entire application theme:

```typescript
const { theme, toggleTheme } = useTheme();

// Toggle button with Sun/Moon icons
<button
  className="game-hud__action-button game-hud__action-button--theme"
  onClick={toggleTheme}
  title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
  aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
>
  {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
</button>
```

#### CSS Theme Variables System
The design system now supports comprehensive theming through CSS custom properties:

```css
/* Light mode variables */
:root {
  --color-surface: #ffffff;
  --color-neutral-50: #f9fafb;
  --color-neutral-100: #f3f4f6;
  /* ... more variables */
}

/* Dark mode overrides */
[data-theme="dark"] {
  --color-surface: #1f2937;
  --color-neutral-50: #374151;
  --color-neutral-100: #4b5563;
  /* ... dark mode values */
}
```

#### Application-Wide Theme Integration
- **Main App**: Wrapped with ThemeProvider in `main.tsx`
- **GameHUD**: Toggle button with visual feedback
- **BrowserWindow**: Dark chrome and content areas
- **EmailClient**: Dark mode email interface
- **SystemDesignCanvas**: Dark mode canvas and tools
- **AuthPages**: Enhanced dark mode styling

### Browser Navigation State Management

#### Enhanced BrowserWindow Architecture
The BrowserWindow component now supports flexible prop passing to child components:

```typescript
interface BrowserTab {
  id: string;
  title: string;
  url: string;
  component: React.ComponentType<any>;
  hasNotification?: boolean;
  // Allow additional props to be passed to components
  [key: string]: any;
}

// Dynamic prop passing to rendered components
<ActiveComponent 
  {...(activeTabData && Object.fromEntries(
    Object.entries(activeTabData).filter(([key]) => 
      !['id', 'title', 'url', 'component', 'hasNotification'].includes(key)
    )
  ))}
/>
```

#### Tab State Management
The Initial Experience now manages browser tabs with proper state flow:

```typescript
const [activeTab, setActiveTab] = useState<string>('');
const [tabs, setTabs] = useState<BrowserTab[]>([]);

// Email tab creation
const handleEmailIconClick = useCallback(() => {
  setShowBrowser(true);
  setActiveTab('email');
  setTabs([{
    id: 'email',
    title: 'ProMail - Inbox',
    url: 'https://promail.com/inbox',
    component: EmailClientWrapper,
  }]);
}, []);

// System design tab creation with props
const handleOpenSystemDesignTab = useCallback(() => {
  const newTab = {
    id: 'system-design',
    title: 'System Builder - Emergency: Alex\'s Site',
    url: 'https://systembuilder.tech/emergency/alexsite',
    component: SystemDesignCanvasWrapper,
  };
  
  setTabs(prev => [...prev, newTab]);
  setActiveTab('system-design');
}, []);
```

### Email-to-Canvas Navigation Flow

#### Mission-Critical Navigation Chain
The email client now seamlessly navigates to the crisis system design canvas:

```
1. Email Icon Click → Browser Opens with Email Tab
   ↓
2. Alex Chen Email → Click "systembuilder.tech/emergency/alexsite"
   ↓  
3. onOpenSystemDesign() → Creates System Design Tab
   ↓
4. CrisisSystemDesignCanvas → Load Alex's Broken System
   ↓
5. Mission Complete → Save the Community Health Crisis
```

#### Component Prop Flow
```typescript
// Tab creation with mission props
tabs={tabs.map(tab => ({
  ...tab,
  onOpenSystemDesign: tab.id === 'email' ? handleOpenSystemDesignTab : undefined,
  onMissionComplete: tab.id === 'system-design' ? handleMissionComplete : undefined,
}))}

// EmailClientWrapper receives navigation prop
interface EmailClientWrapperProps {
  onOpenSystemDesign?: () => void;
}

// Link handler in Alex Chen email
<a 
  href="#" 
  onClick={(e) => {
    e.preventDefault();
    onOpenSystemDesign?.();
  }}
  className="email-link crisis-link"
>
  systembuilder.tech/emergency/alexsite
</a>
```

#### Mission State Integration
The system integrates with the existing mission state management:

```typescript
// Crisis mission completion flow
const handleMissionComplete = () => {
  dispatch(updateMetrics({
    totalReportsSaved: 153,
    familiesHelped: 153, 
    systemUptime: 94,
  }));
  
  dispatch(completeStep(missionId));
  onMissionComplete?.();
};
```

### State Flow Benefits

#### Enhanced User Experience
1. **Seamless Navigation**: Email links directly open relevant system design tools
2. **Context Preservation**: Mission state maintained across browser tabs
3. **Visual Consistency**: Theme applies across all components instantly
4. **Progressive Disclosure**: Tabs reveal functionality as needed

#### Developer Experience
1. **Type Safety**: Full TypeScript integration across all new features
2. **Prop Flexibility**: Dynamic prop passing without rigid interfaces
3. **Theme Consistency**: CSS custom properties for maintainable theming
4. **State Predictability**: Clear data flow from email to mission completion

#### Performance Optimizations
1. **Memoized Callbacks**: Prevent unnecessary re-renders
2. **Conditional Rendering**: Only render active tab content
3. **Theme Persistence**: Document-level theme attributes
4. **Lazy Component Loading**: Components loaded only when tabs are active

### Future Enhancements

#### Planned Theme Features
1. **System Preference Detection**: Auto-detect OS dark mode preference
2. **Theme Persistence**: Remember user theme choice across sessions
3. **Custom Themes**: Support for additional theme variants
4. **Transition Animations**: Smooth theme switching animations

#### Navigation Improvements
1. **Tab History**: Browser-like back/forward navigation within tabs
2. **Tab Persistence**: Maintain tab state across app refreshes
3. **Bookmark System**: Save frequently accessed system design scenarios
4. **Split View**: Side-by-side tab viewing for complex workflows

#### Mission Flow Enhancements
1. **Progress Tracking**: Visual indicators of mission completion steps
2. **Branching Narratives**: Multiple mission paths based on user choices
3. **Real-time Updates**: Live mission status updates across tabs
4. **Achievement Integration**: Unlock rewards for mission completions

This comprehensive state management approach provides a solid foundation for the game's core learning experiences while maintaining excellent performance and user experience standards. 

---

## Migration Guide

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

---

## Mission Email Integration & Design Canvas State

### Overview

The mission email system now integrates with the design canvas through Redux state management, enabling stage-specific system requirements to flow from mission emails to the system design interface.

### Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────────┐
│  Mission Emails │───▶│   Redux State    │◀───│   Design Canvas     │
│                 │    │                  │    │                     │
│ - stage_id      │    │ emailSlice:      │    │ - Load Requirements │
│ - Click Link    │    │ - missionStage   │    │ - Stage Context     │
│                 │    │ - requirements   │    │ - Initial Nodes     │
└─────────────────┘    └──────────────────┘    └─────────────────────┘
                              │
                   ┌──────────────────────┐
                   │    RTK Query API     │
                   │ getMissionStageFrom  │
                   │     Email           │
                   └──────────────────────┘
```

### Email Slice Extension

```typescript
// store/slices/emailSlice.ts
interface EmailState {
  // ... existing email state
  
  // Mission Stage Data (from emails)
  missionStageData: Record<string, MissionStageData>; // Keyed by email ID
}

interface MissionStageData {
  missionId: string;
  stageId: string;
  stageNumber: number;
  stageTitle: string;
  problemDescription: string;
  systemRequirements: SystemRequirement[];
}

// Actions
setMissionStageData: (state, action: PayloadAction<{
  emailId: string;
  stageData: MissionStageData;
}>) => {
  const { emailId, stageData } = action.payload;
  state.missionStageData[emailId] = stageData;
}

// Selectors
export const selectMissionStageFromEmail = (emailId: string) => 
  (state: { email: EmailState }) => state.email.missionStageData[emailId];
```

### RTK Query Email API

```typescript
// store/api/emailApi.ts
getMissionStageFromEmail: builder.query<{
  missionId: string;
  stageId: string;
  stageNumber: number;
  stageTitle: string;
  problemDescription: string;
  systemRequirements: any[];
}, { emailId: string; playerId: string }>({
  query: ({ emailId, playerId }) => 
    `/email/${emailId}/mission-stage?playerId=${playerId}`,
  providesTags: (result, error, arg) => [
    { type: 'Email', id: arg.emailId },
    { type: 'MissionEmails', id: result?.missionId },
  ],
})
```

### Design Canvas Integration

#### Component Structure
```typescript
// CrisisSystemDesignCanvas.tsx
const CrisisSystemDesignCanvasInner: React.FC<{ emailId?: string }> = ({ emailId }) => {
  const dispatch = useAppDispatch();
  
  // Redux state
  const nodes = useAppSelector(state => state.design?.nodes || []);
  const edges = useAppSelector(state => state.design?.edges || []);
  const draggedComponent = useAppSelector(selectDraggedComponent);
  
  // Mission data from email
  const { data: missionStageData, isLoading, error } = useGetMissionStageFromEmailQuery(
    emailId ? { emailId, playerId: 'default-player' } : skipToken
  );
  
  // Active mission state
  const [activeMission, setActiveMission] = useState<MissionData | null>(null);
  
  // Load mission based on stage data
  useEffect(() => {
    if (missionStageData) {
      dispatch(setMissionStageData({ emailId, stageData: missionStageData }));
      // Load full mission data with stage requirements
    }
  }, [missionStageData, emailId, dispatch]);
};
```

### Design Slice with React Flow

```typescript
// features/design/designSlice.ts
const designSlice = createSlice({
  name: 'design',
  initialState: {
    nodes: [],
    edges: [],
    selectedNodeId: null,
    draggedComponent: null,
    totalCost: 0,
    isValidDesign: false,
    validationErrors: [],
  },
  reducers: {
    // React Flow handlers
    onNodesChange: (state, action: PayloadAction<NodeChange[]>) => {
      state.nodes = applyNodeChanges(action.payload, state.nodes);
    },
    
    onEdgesChange: (state, action: PayloadAction<EdgeChange[]>) => {
      state.edges = applyEdgeChanges(action.payload, state.edges);
    },
    
    addNode: (state, action: PayloadAction<{ 
      component: ComponentData; 
      position: { x: number; y: number } 
    }>) => {
      const { component, position } = action.payload;
      const newNode: Node = {
        id: `${component.id}_${Date.now()}`,
        type: 'customNode',
        position,
        data: { ...component }
      };
      state.nodes.push(newNode);
      recalculateTotalCost(state);
    },
    
    addEdge: (state, action: PayloadAction<Connection>) => {
      const newEdge = addEdge(action.payload, state.edges);
      state.edges = newEdge;
      validateDesign(state);
    },
  },
});
```

### Data Flow: Email to Canvas

```
1. User clicks email link (e.g., "systembuilder.tech/emergency/alexsite")
   ↓
2. EmailClientWrapper calls onOpenSystemDesign(emailId)
   ↓
3. Initial Experience creates System Design tab with emailId prop
   ↓
4. CrisisSystemDesignCanvas receives emailId
   ↓
5. RTK Query fetches mission stage data from Supabase
   ↓
6. Stage requirements populate Requirements component
   ↓
7. Mission-specific nodes initialize on canvas
   ↓
8. User completes system design
   ↓
9. Mission progress updates in Redux
```

### Stage Information Display

When loaded from an email with stage context:

```typescript
{activeMission?.currentStage && (
  <div className={styles.stageInfo}>
    <h4 className={styles.stageTitle}>
      Stage {activeMission.currentStage.stage_number}: 
      {activeMission.currentStage.title}
    </h4>
    <p className={styles.stageProblem}>
      {activeMission.currentStage.problem_description}
    </p>
  </div>
)}
```

### Multi-Connection Pattern

Our implementation supports advanced connection patterns:

```typescript
const onConnect = useCallback((params: Connection) => {
  const selectedNodes = reactFlowNodes.filter((node: Node) => node.selected);
  
  // Multi-connection: connect all selected nodes to target
  if (selectedNodes.length > 1 && params.target) {
    selectedNodes.forEach((node: Node) => {
      if (node.id !== params.target) {
        dispatch(addEdgeAction({
          ...params,
          source: node.id,
          sourceHandle: 'output',
          targetHandle: 'input'
        }));
      }
    });
  } else {
    // Single connection
    dispatch(addEdgeAction(params));
  }
}, [dispatch, reactFlowNodes]);
```

### Supabase Integration

#### Database Schema
```sql
-- Mission emails with stage references
CREATE TABLE mission_emails (
  id UUID PRIMARY KEY,
  mission_id UUID REFERENCES missions(id),
  stage_id UUID REFERENCES mission_stages(id),
  subject TEXT,
  content TEXT,
  status TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Mission stages with requirements
CREATE TABLE mission_stages (
  id UUID PRIMARY KEY,
  mission_id UUID REFERENCES missions(id),
  stage_number INT,
  title TEXT,
  problem_description TEXT,
  system_requirements JSONB
);
```

#### Function for Email-Stage Data
```sql
CREATE OR REPLACE FUNCTION get_mission_stage_from_email(
  email_id_param TEXT,
  player_id_param TEXT
) RETURNS JSON AS $$
BEGIN
  RETURN (
    SELECT json_build_object(
      'missionId', m.id,
      'stageId', ms.id,
      'stageNumber', ms.stage_number,
      'stageTitle', ms.title,
      'problemDescription', ms.problem_description,
      'systemRequirements', COALESCE(ms.system_requirements, '[]'::jsonb)
    )
    FROM mission_emails me
    JOIN missions m ON me.mission_id = m.id
    JOIN mission_stages ms ON me.stage_id = ms.id
    WHERE me.id = email_id_param
  );
END;
$$ LANGUAGE plpgsql;
```

### Benefits of This Architecture

1. **Context Preservation**: Mission stage context flows seamlessly from email to canvas
2. **Type Safety**: Full TypeScript support across Redux, RTK Query, and React Flow
3. **Performance**: Selective re-renders with Redux selectors
4. **Debugging**: Redux DevTools show complete state flow
5. **Scalability**: Easy to add new mission stages and requirements
6. **Testing**: Predictable state updates enable comprehensive testing

### Current Implementation Status

✅ **Completed**:
- Mission email to canvas navigation
- Stage-specific requirements loading
- Redux integration for React Flow
- RTK Query for mission stage data
- Supabase schema and functions
- Multi-connection support
- Dark mode theme integration

🚧 **In Progress**:
- Real-time collaboration features
- Undo/redo functionality
- State persistence across sessions

📋 **Planned**:
- WebSocket integration for live updates
- Advanced validation rules
- Performance metrics tracking
- Achievement system integration

This comprehensive state management approach ensures that mission context, user progress, and system design state flow seamlessly through the application while maintaining excellent performance and developer experience.

---

## Requirements Validation System

### Overview

The requirements validation system provides database-driven, API-powered validation for system design requirements. When users click "Run Test" in the Requirements component, their current canvas state is validated against mission stage requirements stored in Supabase, with rich feedback and progress tracking.

### Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────────┐
│  Requirements   │───▶│  Validation Hook │◀───│  Edge Function      │
│   Component     │    │                  │    │                     │
│ - Click "Run    │    │ - State Mgmt     │    │ - validate-         │
│   Test"         │    │ - API Calls      │    │   requirements      │
│ - Display       │    │ - Error Handle   │    │ - Database Logic    │
│   Results       │    │ - Loading State  │    │ - Validation Funcs  │
└─────────────────┘    └──────────────────┘    └─────────────────────┘
                              │                           │
                    ┌──────────────────────┐    ┌──────────────────┐
                    │   Mission Service    │    │   Supabase DB    │
                    │ - validateRequire-   │    │ - mission_stage_ │
                    │   mentsWithAPI()     │    │   requirements   │
                    │ - getCurrentUserId() │    │ - user_require-  │
                    │ - Type Conversions   │    │   ment_progress  │
                    └──────────────────────┘    │ - Validation     │
                                               │   Functions      │
                                               └──────────────────┘
```

### Data Flow: Requirements Validation

#### 1. User Interaction
```
User clicks "Run Test" in Requirements component
   ↓
Parent component's handleRunTest() called
   ↓
useRequirementValidation hook triggered
```

#### 2. API Request Data
The `validate-requirements` Edge Function receives:

```typescript
interface ValidateRequest {
  stageId: string;        // UUID of current mission stage
  userId: string;         // Current authenticated user ID
  nodes: any[];          // React Flow nodes array from canvas
  edges: any[];          // React Flow edges array from canvas
  stageAttemptId?: string; // Optional existing attempt ID
}
```

**Example Request Payload:**
```json
{
  "stageId": "550e8400-e29b-41d4-a716-446655440001",
  "userId": "c6f7d1e2-4f8c-4d5e-8a9b-3f2e1d0c9b8a",
  "nodes": [
    {
      "id": "families",
      "type": "custom",
      "position": { "x": 100, "y": 200 },
      "data": {
        "label": "Families",
        "component_type": "stakeholder",
        "capacity": 200
      }
    },
    {
      "id": "web-server-1",
      "type": "custom", 
      "position": { "x": 300, "y": 200 },
      "data": {
        "label": "Web Server",
        "component_type": "web_server",
        "specs": { "cpu": "4 cores", "ram": "16GB" }
      }
    }
  ],
  "edges": [
    {
      "id": "families-to-web",
      "source": "families",
      "target": "web-server-1", 
      "sourceHandle": "output",
      "targetHandle": "input"
    }
  ]
}
```

#### 3. Edge Function Processing

The Edge Function performs these operations:

```typescript
// 1. Call database function for validation
const { data: requirements } = await supabaseClient
  .rpc('get_requirements_status', {
    p_user_id: userId,
    p_stage_id: stageId,
    p_nodes: nodes,
    p_edges: edges
  });

// 2. Create or update stage attempt
const { data: attempt } = await supabaseClient
  .from('stage_attempts')
  .insert({
    user_id: userId,
    stage_id: stageId,
    current_design: { nodes, edges }
  });

// 3. Update progress for each requirement
for (const req of requirements) {
  await supabaseClient.rpc('update_requirement_progress', {
    p_user_id: userId,
    p_stage_attempt_id: attemptId,
    p_requirement_id: req.requirementId,
    p_validation_result: req.validationResult
  });
}
```

#### 4. API Response Data
The Edge Function returns:

```typescript
interface ValidationResponse {
  success: boolean;
  stageAttemptId?: string;
  summary: {
    totalRequirements: number;
    completedRequirements: number;
    pointsEarned: number;
    allCompleted: boolean;
    completionPercentage: number;
  };
  requirements: ValidationResult[];
}

interface ValidationResult {
  id: string;              // Requirement UUID
  title: string;           // Human-readable title
  description: string;     // Requirement description
  type: string;           // 'component_required', 'connection_required', etc.
  completed: boolean;      // Whether requirement is met
  visible: boolean;        // Whether to show this requirement
  priority: number;        // 1=required, 2=bonus, 3=optional
  points: number;          // Points awarded for completion
  message: string;         // Success or error message
  hint?: string;          // Optional hint for struggling users
  validationDetails: any;  // Detailed validation results
}
```

**Example Response:**
```json
{
  "success": true,
  "stageAttemptId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "summary": {
    "totalRequirements": 3,
    "completedRequirements": 2,
    "pointsEarned": 20,
    "allCompleted": false,
    "completionPercentage": 67
  },
  "requirements": [
    {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "title": "Add Dedicated Database Server",
      "description": "The health tracking system needs a separate database server...",
      "type": "component_required",
      "completed": false,
      "visible": true,
      "priority": 1,
      "points": 10,
      "message": "You still need to add a dedicated database server.",
      "hint": "Add a Database component from the Storage category.",
      "validationDetails": {
        "is_valid": false,
        "found_components": ["web_server"],
        "missing_components": ["database"],
        "reason": "Required component 'database' not found in design"
      }
    },
    {
      "id": "660e8400-e29b-41d4-a716-446655440002", 
      "title": "Add Web Server",
      "description": "Separate web server to handle user requests...",
      "type": "component_required",
      "completed": true,
      "visible": true,
      "priority": 1,
      "points": 10,
      "message": "✅ Great! You've added a dedicated web server.",
      "validationDetails": {
        "is_valid": true,
        "found_components": ["web_server"],
        "instances": 1
      }
    }
  ]
}
```

### Frontend Integration Flow

#### 1. Hook Usage in Parent Component
```typescript
// CrisisSystemDesignCanvas.tsx
const { isValidating, validateRequirements } = useRequirementValidation({
  stageId: missionStageData?.id || '',
  onValidationComplete: (result: ValidationResponse) => {
    // Convert API response to Requirements component format
    const convertedReqs = result.requirements
      .filter(req => req.visible)
      .map(req => ({
        id: req.id,
        description: req.description,
        completed: req.completed
      }));
    
    setRequirements(convertedReqs);

    // Update metrics on completion
    if (result.summary.allCompleted) {
      setMetrics(prev => ({
        ...prev,
        reportsSaved: 200,
        familiesHelped: 200,
        uptimePercent: 99,
        systemHealth: 'healthy'
      }));
    }
  }
});

const handleRunTest = useCallback(async () => {
  if (!missionStageData?.id) return;
  await validateRequirements(nodes, edges);
}, [validateRequirements, nodes, edges, missionStageData?.id]);
```

#### 2. Requirements Component Integration
```typescript
// Requirements.tsx stays unchanged - just receives updated data
<Requirements
  requirements={requirements}  // Updated from validation response
  onRunTest={handleRunTest}   // Triggers validation API
/>

{isValidating && (
  <div className="validation-loading">
    🔍 Validating your design...
  </div>
)}
```

### Database Validation Functions

#### Core Validation Functions
The Edge Function uses these database functions for validation logic:

```sql
-- Main validation dispatcher
get_requirements_status(
  p_user_id UUID,
  p_stage_id UUID, 
  p_nodes JSONB,
  p_edges JSONB
) RETURNS TABLE(...)

-- Component validation
validate_component_requirement(
  nodes JSONB,
  edges JSONB,
  config JSONB  -- { required_components: ["database"], min_instances: 1 }
) RETURNS JSONB

-- Connection validation  
validate_connection_requirement(
  nodes JSONB,
  edges JSONB,
  config JSONB  -- { source_types: ["web_server"], target_types: ["database"] }
) RETURNS JSONB

-- Performance validation
validate_performance_requirement(
  nodes JSONB,
  edges JSONB, 
  config JSONB  -- { max_latency_ms: 200, min_throughput_rps: 1000 }
) RETURNS JSONB
```

#### Progress Tracking
```sql
-- Update user progress
update_requirement_progress(
  p_user_id UUID,
  p_stage_attempt_id UUID,
  p_requirement_id UUID,
  p_validation_result JSONB
) RETURNS VOID
```

### State Management Integration

#### Service Layer
```typescript
// missionService.ts
export class MissionService {
  async validateRequirementsWithAPI(
    stageId: string,
    userId: string,
    nodes: any[],
    edges: any[],
    stageAttemptId?: string
  ): Promise<ValidationResponse> {
    const { data, error } = await supabase.functions.invoke('validate-requirements', {
      body: { stageId, userId, nodes, edges, stageAttemptId }
    });
    
    if (error) throw new Error(`Validation failed: ${error.message}`);
    return data as ValidationResponse;
  }

  async getCurrentUserId(): Promise<string | null> {
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id || null;
  }
}
```

#### Custom Hook
```typescript
// useRequirementValidation.ts
export const useRequirementValidation = ({
  stageId,
  onValidationComplete
}: UseRequirementValidationProps): UseRequirementValidationReturn => {
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const validateRequirements = useCallback(async (nodes: any[], edges: any[]) => {
    try {
      setIsValidating(true);
      setValidationError(null);

      const userId = await missionService.getCurrentUserId();
      if (!userId) throw new Error('User not authenticated');

      const result = await missionService.validateRequirementsWithAPI(
        stageId, userId, nodes, edges
      );

      if (onValidationComplete) {
        onValidationComplete(result);
      }

      return result;
    } catch (error) {
      setValidationError(error.message);
      return null;
    } finally {
      setIsValidating(false);
    }
  }, [stageId, onValidationComplete]);

  return { isValidating, validationError, validateRequirements };
};
```

### Benefits of This Architecture

#### Technical Benefits
1. **Separation of Concerns**: UI components focus on display, validation logic in database
2. **Scalability**: Add new requirement types without frontend changes
3. **Consistency**: Centralized validation rules ensure consistent behavior
4. **Performance**: On-demand validation reduces unnecessary API calls
5. **Type Safety**: Full TypeScript integration from frontend to database

#### User Experience Benefits
1. **Rich Feedback**: Detailed error messages with hints for struggling users
2. **Progressive Disclosure**: Requirements unlock based on dependencies
3. **Point System**: Gamification through points and completion tracking
4. **Context Awareness**: Validation messages specific to current design state
5. **Loading States**: Clear feedback during validation process

#### Educational Benefits
1. **Scaffolded Learning**: Requirements guide users through system design principles
2. **Immediate Feedback**: Learn from mistakes with specific guidance
3. **Achievement Tracking**: Progress measurement encourages completion
4. **Real-world Validation**: Requirements mirror actual system design constraints

### Error Handling & Edge Cases

#### Frontend Error Handling
```typescript
// Handle validation API errors
if (validationError) {
  return (
    <div className="validation-error">
      ❌ Validation Error: {validationError}
      <button onClick={clearError}>Dismiss</button>
    </div>
  );
}

// Handle missing stage data
if (!missionStageData?.id) {
  console.warn('No stage ID available for validation');
  return;
}
```

#### Backend Error Handling
```typescript
// Edge Function error handling
try {
  const result = await validateRequirements(nodes, edges);
  return new Response(JSON.stringify(result), { 
    headers: { 'Content-Type': 'application/json' } 
  });
} catch (error) {
  return new Response(
    JSON.stringify({ error: 'Internal server error', details: error.message }),
    { status: 500, headers: { 'Content-Type': 'application/json' } }
  );
}
```

### Future Enhancements

#### Planned Features
1. **Real-time Validation**: Optional live validation as users design
2. **Collaborative Validation**: Multi-user validation sessions
3. **Advanced Analytics**: Detailed validation metrics and patterns
4. **Custom Requirements**: User-generated validation rules
5. **A/B Testing**: Compare different validation approaches

#### Extension Points
1. **Validation Types**: Easy addition of new requirement categories
2. **Scoring Algorithms**: Pluggable point calculation systems
3. **Feedback Mechanisms**: Customizable hint and message systems
4. **Integration Hooks**: Connect with external validation services

This comprehensive validation system provides a robust foundation for educational system design validation while maintaining excellent performance and user experience. 