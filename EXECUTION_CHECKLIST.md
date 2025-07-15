# Atomic Design Restructuring - Execution Checklist

## Phase 1: Template Creation ⏳

### AuthTemplate
- [ ] Create `src/components/templates/AuthTemplate/` directory
- [ ] Create `AuthTemplate.tsx` with layout for auth pages
- [ ] Create `AuthTemplate.types.ts` with TypeScript interfaces
- [ ] Create `index.ts` with barrel export
- [ ] Create `README.md` with state management docs
- [ ] Test with mock data

### GameTemplate
- [ ] Create `src/components/templates/GameTemplate/` directory
- [ ] Create `GameTemplate.tsx` with GameHUD integration
- [ ] Create `GameTemplate.types.ts` with TypeScript interfaces
- [ ] Create `index.ts` with barrel export
- [ ] Create `README.md` with state management docs
- [ ] Test with mock data

### SelectionTemplate
- [ ] Create `src/components/templates/SelectionTemplate/` directory
- [ ] Create `SelectionTemplate.tsx` with grid layout
- [ ] Create `SelectionTemplate.types.ts` with TypeScript interfaces
- [ ] Create `index.ts` with barrel export
- [ ] Create `README.md` with state management docs
- [ ] Test with mock data

### ResultsTemplate
- [ ] Create `src/components/templates/ResultsTemplate/` directory
- [ ] Create `ResultsTemplate.tsx` with metrics display
- [ ] Create `ResultsTemplate.types.ts` with TypeScript interfaces
- [ ] Create `index.ts` with barrel export
- [ ] Create `README.md` with state management docs
- [ ] Test with mock data

### LandingTemplate
- [ ] Create `src/components/templates/LandingTemplate/` directory
- [ ] Create `LandingTemplate.tsx` with hero section
- [ ] Create `LandingTemplate.types.ts` with TypeScript interfaces
- [ ] Create `index.ts` with barrel export
- [ ] Create `README.md` with state management docs
- [ ] Test with mock data

## Phase 2: Page Migration ⏳

### LandingPage
- [ ] Create `src/components/pages/LandingPage/` directory
- [ ] Migrate logic from `screens/LandingPage.tsx`
- [ ] Use LandingTemplate
- [ ] Create types file
- [ ] Add state management documentation
- [ ] Update router import
- [ ] Test functionality

### SignInPage
- [ ] Create `src/components/pages/SignInPage/` directory
- [ ] Migrate logic from `screens/auth/SignInPage.tsx`
- [ ] Use AuthTemplate
- [ ] Create types file
- [ ] Add state management documentation
- [ ] Update router import
- [ ] Test authentication flow

### SignUpPage
- [ ] Create `src/components/pages/SignUpPage/` directory
- [ ] Migrate logic from `screens/auth/SignUpPage.tsx`
- [ ] Use AuthTemplate
- [ ] Create types file
- [ ] Add state management documentation
- [ ] Update router import
- [ ] Test registration flow

### CareerMapPage
- [ ] Create `src/components/pages/CareerMapPage/` directory
- [ ] Migrate logic from `screens/game/CareerMapScreen.tsx`
- [ ] Use GameTemplate
- [ ] Create types file
- [ ] Add state management documentation
- [ ] Update router import
- [ ] Test game functionality

### MeetingRoomPage
- [ ] Create `src/components/pages/MeetingRoomPage/` directory
- [ ] Migrate logic from `screens/game/MeetingRoomScreen.tsx`
- [ ] Use GameTemplate
- [ ] Create types file
- [ ] Add state management documentation
- [ ] Update router import
- [ ] Test meeting functionality

### MentorSelectionPage
- [ ] Create `src/components/pages/MentorSelectionPage/` directory
- [ ] Migrate logic from `screens/game/MentorSelectionScreen.tsx`
- [ ] Use SelectionTemplate
- [ ] Create types file
- [ ] Add state management documentation
- [ ] Update router import
- [ ] Test selection functionality

### ResultsPage
- [ ] Create `src/components/pages/ResultsPage/` directory
- [ ] Migrate logic from `screens/game/ResultsScreen.tsx`
- [ ] Use ResultsTemplate
- [ ] Create types file
- [ ] Add state management documentation
- [ ] Update router import
- [ ] Test results display

### SimulationPage
- [ ] Create `src/components/pages/SimulationPage/` directory
- [ ] Migrate logic from `screens/game/SimulationScreen.tsx`
- [ ] Use GameTemplate
- [ ] Create types file
- [ ] Add state management documentation
- [ ] Update router import
- [ ] Test simulation functionality

### SystemDesignPage
- [ ] Create `src/components/pages/SystemDesignPage/` directory
- [ ] Migrate logic from `screens/game/SystemDesignCanvas.tsx`
- [ ] Use GameTemplate
- [ ] Create types file
- [ ] Add state management documentation
- [ ] Update router import
- [ ] Test canvas functionality

## Phase 3: Component Documentation ⏳

### Atoms
- [ ] Add README.md to Badge with state docs
- [ ] Add README.md to Button with state docs
- [ ] Add README.md to Card with state docs
- [ ] Add README.md to Icon with state docs
- [ ] Add README.md to Input with state docs
- [ ] Add README.md to Progress with state docs

### Molecules
- [ ] Add README.md to CharacterPortrait with state docs
- [ ] Add README.md to ComponentCard with state docs
- [ ] Add README.md to MentorCard with state docs
- [ ] Add README.md to MetricCard with state docs
- [ ] Add README.md to QuestionCard with state docs

### Organisms
- [ ] Add README.md to AchievementToast with state docs
- [ ] Add README.md to CareerMap with state docs
- [ ] Add README.md to ComponentDrawer with state docs
- [ ] Add README.md to GameHUD with state docs
- [ ] Add README.md to MetricsDashboard with state docs
- [ ] Fix MeetingRoom component structure

## Phase 4: Cleanup ⏳

### Router Updates
- [ ] Update all route imports in `src/router/index.tsx`
- [ ] Test all routes work correctly
- [ ] Update any lazy loading imports

### Import Updates
- [ ] Search for all screen imports in the codebase
- [ ] Update to use new page imports
- [ ] Run TypeScript compiler to check for errors

### Final Cleanup
- [ ] Delete `src/screens` directory
- [ ] Update any documentation
- [ ] Run all tests
- [ ] Build project to ensure no errors
- [ ] Update main README.md with new structure

## Verification Steps

### Testing
- [ ] All pages render correctly
- [ ] All routes work
- [ ] Authentication flow works
- [ ] Game functionality intact
- [ ] No TypeScript errors
- [ ] No console errors

### Documentation
- [ ] All components have README.md
- [ ] State management documented
- [ ] Props documented
- [ ] Examples provided

### Code Quality
- [ ] Consistent file naming
- [ ] Proper TypeScript types
- [ ] No unused imports
- [ ] Follows atomic design principles

## Notes
- Keep old screens directory until all migrations complete
- Test each migration before moving to next
- Commit after each successful phase
- Document any issues encountered