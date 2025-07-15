# Implementation Priorities for Atomic Design Restructuring

## Priority 1: Critical Path (Must Do First)

### 1.1 Create Core Templates
These templates are needed before any pages can be migrated:

1. **GameTemplate** (Most used)
   - Required by: 5 pages
   - Complexity: High (integrates GameHUD)
   - Dependencies: GameHUD organism

2. **AuthTemplate** 
   - Required by: 2 pages
   - Complexity: Low
   - Dependencies: Card atom

3. **LandingTemplate**
   - Required by: 1 page (but it's the entry point)
   - Complexity: Medium
   - Dependencies: ReactFlow integration

### 1.2 Migrate Entry Points
1. **LandingPage** - First user touchpoint
2. **SignInPage** - Authentication flow
3. **SignUpPage** - User onboarding

## Priority 2: Game Flow Pages

### 2.1 Selection Flow
1. **MentorSelectionPage** with SelectionTemplate
2. **CareerMapPage** with GameTemplate

### 2.2 Core Game Loop
1. **SystemDesignPage** - Main gameplay
2. **SimulationPage** - Game execution
3. **ResultsPage** - Feedback loop

### 2.3 Additional Features
1. **MeetingRoomPage** - Secondary gameplay

## Priority 3: Component Structure Updates

### 3.1 Fix Broken Components
1. **MeetingRoom** - Missing main component file

### 3.2 Add State Documentation
Start with most complex components:
1. **GameHUD** - Complex state management
2. **CareerMap** - Multiple Redux connections
3. **SystemDesignCanvas** - Local state heavy

## Execution Order

### Day 1: Foundation
1. Create all template directories
2. Implement AuthTemplate (simplest)
3. Implement GameTemplate (most critical)
4. Migrate SignInPage as proof of concept

### Day 2: Entry Points
1. Implement LandingTemplate
2. Migrate LandingPage
3. Migrate SignUpPage
4. Update router for these 3 pages
5. Test authentication flow

### Day 3: Game Pages
1. Implement SelectionTemplate
2. Implement ResultsTemplate
3. Migrate MentorSelectionPage
4. Migrate CareerMapPage
5. Migrate SystemDesignPage

### Day 4: Completion
1. Migrate remaining pages
2. Add state documentation to 5 key components
3. Fix MeetingRoom structure
4. Update all imports
5. Final testing

### Day 5: Cleanup
1. Remove screens directory
2. Run full test suite
3. Update documentation
4. Create migration guide

## Quick Wins
These can be done anytime without dependencies:
- Add README.md templates
- Create TypeScript interfaces
- Document existing component state
- Set up test files

## Risk Areas
- **ReactFlow Integration**: LandingPage has custom nodes
- **Redux Connections**: Ensure all selectors work
- **Router Updates**: Test protected routes
- **Import Paths**: Many files to update

## Success Metrics
- [ ] 0 TypeScript errors
- [ ] All tests passing
- [ ] All routes functioning
- [ ] Clean component structure
- [ ] Complete documentation