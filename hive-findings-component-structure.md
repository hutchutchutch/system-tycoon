# Design System Component Structure Findings

## Overview
The design system follows **Atomic Design methodology** with a clear hierarchical structure.

## Expected Directory Structure
```
src/
├── components/
│   ├── atoms/          # Basic building blocks
│   ├── molecules/      # Simple component groups  
│   ├── organisms/      # Complex component sections
│   ├── templates/      # Page layouts
│   └── pages/          # Complete pages
```

## Component Categories

### 1. Atoms (Stateless Components)
- **Button**: Primary interactive element
- **Icon**: Consistent icon system using Lucide React
- **Badge**: Status indicators and labels
- **Handle**: React Flow connection points
- **Input**: Text input for forms

### 2. Molecules (Minimal Local State)
- **ComponentCard**: Displays system architecture components
- **MetricCard**: Real-time performance metrics
- **QuestionCard**: Interactive meeting phase cards
- Local UI state only (hover, animations)

### 3. Organisms (Complex State + Context)
- **ComponentDrawer**: Categorized component panel
- **MeetingRoom**: Requirements gathering interface
- **DesignCanvas**: React Flow design workspace
- Complex local state management
- Context consumption

### 4. Templates (State Orchestration)
- **MeetingPhaseTemplate**: Requirements gathering layout
- **DesignPhaseTemplate**: System design layout
- Pure presentational components
- All state passed via props

### 5. Pages (Global State Management)
- **GamePage**: Root component managing game flow
- Central state hub
- Phase transitions
- Data fetching

## State Management Hierarchy

```
Pages (Global State)
  ↓
Templates (State Orchestration)
  ↓
Organisms (Complex Local State + Context)
  ↓
Molecules (UI State Only)
  ↓
Atoms (Stateless)
```

## Key Design Principles

1. **Composability**: Components easily combine to create complex UIs
2. **Reusability**: Atoms and molecules work across different contexts
3. **Predictability**: Clear unidirectional state flows
4. **Accessibility**: WCAG 2.1 AA standards compliance
5. **Performance**: Optimized for 60fps animations

## File Organization Pattern

Each component follows this structure:
```
ComponentName/
├── ComponentName.tsx       # Main component
├── ComponentName.styles.ts # Styled components/CSS
├── ComponentName.test.tsx  # Tests
├── ComponentName.stories.tsx # Storybook stories
└── index.ts               # Exports
```

## State Management Rules

1. **Atoms**: Always stateless, all behavior via props
2. **Molecules**: UI state only (hover, animations)
3. **Organisms**: Complex local state + context consumption
4. **Templates**: State orchestration only, no business logic
5. **Pages**: Global state management and data fetching

## Current Implementation Status

Based on the git status, the design system documentation exists but needs to be implemented in the actual component structure. The expected components include:

- UI components for the game interface
- React Flow integration for system design
- Meeting phase interaction components
- Metrics and monitoring displays
- Drag-and-drop functionality