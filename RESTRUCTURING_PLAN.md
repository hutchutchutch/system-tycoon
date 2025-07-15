# Atomic Design System Restructuring Plan

## Overview
This plan details the migration from the current structure to a complete atomic design system with proper pages and templates directories.

## Current State Analysis

### Existing Structure
- **Atoms**: ✅ Complete (Badge, Button, Card, Icon, Input, Progress)
- **Molecules**: ✅ Complete (CharacterPortrait, ComponentCard, MentorCard, MetricCard, QuestionCard)
- **Organisms**: ✅ Complete (AchievementToast, CareerMap, ComponentDrawer, GameHUD, MetricsDashboard)
- **Templates**: ❌ Directory exists but empty
- **Pages**: ❌ Directory exists but empty
- **Screens**: 9 screens need migration to pages

### Screens to Migrate
1. `LandingPage.tsx` → `pages/LandingPage/`
2. `auth/SignInPage.tsx` → `pages/SignInPage/`
3. `auth/SignUpPage.tsx` → `pages/SignUpPage/`
4. `game/CareerMapScreen.tsx` → `pages/CareerMapPage/`
5. `game/MeetingRoomScreen.tsx` → `pages/MeetingRoomPage/`
6. `game/MentorSelectionScreen.tsx` → `pages/MentorSelectionPage/`
7. `game/ResultsScreen.tsx` → `pages/ResultsPage/`
8. `game/SimulationScreen.tsx` → `pages/SimulationPage/`
9. `game/SystemDesignCanvas.tsx` → `pages/SystemDesignPage/`

## Migration Plan

### Phase 1: Create Template Structure
Templates define page layouts without data. Based on the screens, we need:

1. **AuthTemplate**
   - Shared layout for authentication pages
   - Used by: SignInPage, SignUpPage
   - Structure: Centered card with form area

2. **GameTemplate**
   - Main game layout with HUD
   - Used by: CareerMapPage, MeetingRoomPage, SimulationPage, SystemDesignPage
   - Structure: GameHUD + content area

3. **SelectionTemplate**
   - Selection screen layout
   - Used by: MentorSelectionPage
   - Structure: Grid layout for selection items

4. **ResultsTemplate**
   - Results display layout
   - Used by: ResultsPage
   - Structure: Metrics display + action buttons

5. **LandingTemplate**
   - Landing page specific layout
   - Used by: LandingPage
   - Structure: Hero section + demo area

### Phase 2: Create Page Components
Each page will:
1. Import and use appropriate template
2. Handle state management and data fetching
3. Pass data to template as props
4. Include TypeScript types
5. Include state management documentation

### Phase 3: Update Component Structure
For each existing component that needs updates:

1. **Add State Management Notes**
   - Document Redux connections
   - Document local state usage
   - Document context usage

2. **File Structure Updates**
   - Ensure all components have:
     - `ComponentName.tsx`
     - `ComponentName.types.ts` (if complex props)
     - `ComponentName.test.tsx` (optional)
     - `index.ts` (barrel export)
     - `README.md` (state management docs)

### Phase 4: Update Router and Imports
1. Update router to use new page components
2. Update all imports throughout the codebase
3. Remove old screens directory

## Detailed Execution Steps

### Step 1: Create Templates (Priority: High)
```
src/components/templates/
├── AuthTemplate/
│   ├── AuthTemplate.tsx
│   ├── AuthTemplate.types.ts
│   ├── index.ts
│   └── README.md
├── GameTemplate/
│   ├── GameTemplate.tsx
│   ├── GameTemplate.types.ts
│   ├── index.ts
│   └── README.md
├── SelectionTemplate/
│   ├── SelectionTemplate.tsx
│   ├── SelectionTemplate.types.ts
│   ├── index.ts
│   └── README.md
├── ResultsTemplate/
│   ├── ResultsTemplate.tsx
│   ├── ResultsTemplate.types.ts
│   ├── index.ts
│   └── README.md
└── LandingTemplate/
    ├── LandingTemplate.tsx
    ├── LandingTemplate.types.ts
    ├── index.ts
    └── README.md
```

### Step 2: Migrate Screens to Pages (Priority: High)
For each screen:
1. Create page directory structure
2. Extract logic into page component
3. Use appropriate template
4. Add state management documentation
5. Update imports

Example structure:
```
src/components/pages/
├── SignInPage/
│   ├── SignInPage.tsx
│   ├── SignInPage.types.ts
│   ├── SignInPage.test.tsx
│   ├── index.ts
│   └── README.md
```

### Step 3: Add State Documentation (Priority: Medium)
For each component, add README.md with:
- Redux state connections
- Local state usage
- Context dependencies
- Props flow
- Side effects

### Step 4: Update Existing Components (Priority: Low)
Components needing structure updates:
- MeetingRoom (missing main component file)
- All components need state management documentation

### Step 5: Router and Import Updates (Priority: High)
1. Update `src/router/index.tsx`
2. Search and replace all screen imports
3. Test all routes
4. Remove screens directory

## State Management Documentation Template

```markdown
# ComponentName State Management

## Redux State
- **Slices Used**: gameSlice, userSlice
- **Selectors**: selectCurrentLevel, selectUserProfile
- **Actions**: updateScore, completeLevel

## Local State
- `isLoading`: Controls loading state
- `selectedItem`: Tracks current selection

## Context
- ThemeContext: For theming
- AuthContext: For user authentication

## Props Flow
- Receives: `userId`, `onComplete`
- Passes to children: `itemData`, `handlers`

## Side Effects
- Fetches user data on mount
- Saves progress on unmount
```

## Success Criteria
1. All screens migrated to pages directory
2. All templates created and properly typed
3. All pages using appropriate templates
4. State management documented for all components
5. Router updated with new paths
6. No references to old screens directory
7. All tests passing

## Risk Mitigation
- Create one template and page first as proof of concept
- Keep old screens until migration is complete
- Test each migration thoroughly
- Update imports incrementally
- Maintain backwards compatibility during migration