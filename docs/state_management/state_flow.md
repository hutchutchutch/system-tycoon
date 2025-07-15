# Redux State Flow: Component Selection & Collaboration Mode

## Overview

This document details the Redux state management implementation for component selection and collaboration mode tracking in the System Tycoon application. The implementation follows Redux best practices and provides a predictable state management solution for managing component-specific scenarios, mentor selection, and collaboration features.

**Recent Updates:**
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