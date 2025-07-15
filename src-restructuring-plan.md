# System Tycoon Component Restructuring Plan

## Executive Summary
The current component structure follows a feature-based organization instead of the documented Atomic Design methodology. This plan outlines the migration to achieve 100% compliance with the design system documentation.

## Current vs Target Structure

### Current Structure (Feature-Based)
```
/src/components/
├── common/          # Shared utilities
├── design-system/   # Component showcase
├── game/           # Game-specific components (mixed levels)
├── layout/         # Layout wrappers
└── ui/             # Basic UI components
```

### Target Structure (Atomic Design)
```
/src/components/
├── atoms/          # Stateless building blocks
├── molecules/      # Simple component groups with UI state
├── organisms/      # Complex sections with local state
├── templates/      # Page layouts for state orchestration
└── pages/          # Complete pages with global state
```

## Migration Steps

### Phase 1: Create Directory Structure
```bash
mkdir -p src/components/{atoms,molecules,organisms,templates,pages}
```

### Phase 2: Component Migration Map

#### Atoms (Stateless Components)
1. `ui/Button.tsx` → `atoms/Button/`
2. `ui/Badge.tsx` → `atoms/Badge/`
3. `ui/Card.tsx` → `atoms/Card/`
4. `ui/Progress.tsx` → `atoms/Progress/`
5. CREATE: `atoms/Icon/` (new component)
6. CREATE: `atoms/Handle/` (React Flow handle)
7. CREATE: `atoms/Input/` (form input)

#### Molecules (Simple Groups)
1. `game/QuestionCard.tsx` → `molecules/QuestionCard/`
2. `game/MentorCard.tsx` → `molecules/MentorCard/`
3. `game/CharacterPortrait.tsx` → `molecules/CharacterPortrait/`
4. CREATE: `molecules/ComponentCard/` (for design system)
5. CREATE: `molecules/MetricCard/` (extract from MetricsDashboard)

#### Organisms (Complex Components)
1. `game/MetricsDashboard.tsx` → `organisms/MetricsDashboard/`
2. `game/GameHUD.tsx` → `organisms/GameHUD/`
3. `game/CareerMapGame.tsx` → `organisms/CareerMap/`
4. `game/AchievementToast.tsx` → `organisms/AchievementToast/`
5. CREATE: `organisms/ComponentDrawer/` (for design phase)
6. CREATE: `organisms/MeetingRoom/` (for meeting phase)
7. CREATE: `organisms/DesignCanvas/` (React Flow canvas)

#### Templates (Layout Components)
1. `layout/RootLayout.tsx` → `templates/RootTemplate/`
2. `layout/AuthLayout.tsx` → `templates/AuthTemplate/`
3. `layout/GameLayout.tsx` → `templates/GameTemplate/`
4. CREATE: `templates/MeetingPhaseTemplate/`
5. CREATE: `templates/DesignPhaseTemplate/`
6. CREATE: `templates/SimulationPhaseTemplate/`

#### Pages (Complete Views)
1. MOVE: `screens/*` → `components/pages/*`
2. Maintain screen structure but under pages directory

### Phase 3: File Structure Per Component

Each component should follow this structure:
```
ComponentName/
├── ComponentName.tsx       # Main component
├── ComponentName.styles.ts # Styled components/CSS modules
├── ComponentName.test.tsx  # Component tests
├── ComponentName.stories.tsx # Storybook stories
├── ComponentName.types.ts  # TypeScript interfaces
└── index.ts               # Export barrel
```

### Phase 4: State Management Alignment

According to the Atomic Design hierarchy:
- **Atoms**: NO state (props only)
- **Molecules**: UI state only (hover, toggle, etc.)
- **Organisms**: Complex local state + context
- **Templates**: State orchestration
- **Pages**: Global state + data fetching

### Phase 5: Missing Components to Create

Priority components that need creation:
1. **Icon** atom - Lucide React wrapper
2. **Input** atom - Form input component
3. **Handle** atom - React Flow connection points
4. **ComponentCard** molecule - For component drawer
5. **ComponentDrawer** organism - Component selection panel
6. **MeetingRoom** organism - Requirements gathering UI
7. **DesignCanvas** organism - React Flow workspace

## Implementation Priority

### P0 - Critical (Week 1)
1. Create directory structure
2. Move existing atoms to proper location
3. Create missing critical atoms (Icon, Input)

### P1 - High (Week 2)
1. Migrate molecules with proper file structure
2. Create ComponentCard molecule
3. Migrate organisms

### P2 - Medium (Week 3)
1. Create missing organisms (ComponentDrawer, MeetingRoom, DesignCanvas)
2. Migrate templates
3. Move pages from screens

### P3 - Low (Week 4)
1. Add Storybook stories for all components
2. Add comprehensive tests
3. Update all imports across codebase

## Benefits of Restructuring

1. **Clear Hierarchy**: Developers know exactly where components belong
2. **Predictable State**: State management follows component level
3. **Better Reusability**: Atoms and molecules work across contexts
4. **Easier Testing**: Components tested at appropriate levels
5. **Design Consistency**: Enforces design system principles
6. **Onboarding**: New developers understand structure immediately

## Risk Mitigation

1. **Import Updates**: Use VSCode's "Update imports on file move"
2. **Gradual Migration**: Move one component at a time
3. **Maintain Functionality**: Test after each move
4. **Git History**: Use `git mv` to preserve file history
5. **Backup Branch**: Create feature branch for restructuring

## Success Metrics

- 100% components in Atomic Design structure
- All components have proper file structure
- State management follows documented hierarchy
- Zero broken imports
- All tests passing
- Storybook documentation complete

## Next Steps

1. Review and approve this plan
2. Create feature branch: `feature/atomic-design-restructure`
3. Begin Phase 1 implementation
4. Daily progress updates
5. Component-by-component migration