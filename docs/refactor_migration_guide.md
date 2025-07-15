# System Tycoon - Game to Browser Migration Guide

## Overview

This guide outlines the migration from the game-based "System Design Tycoon" to the browser-based "System Tycoon - Tech Consultant Simulator".

## Key Conceptual Changes

### 1. Interface Paradigm Shift
**From:** Game scenes (MainMenu, CareerMap, Meeting, Design, Simulation)  
**To:** Browser tabs (Dashboard, Email, Call, Design)

### 2. Narrative Structure
**From:** Abstract career progression through levels  
**To:** Referral-based consulting journey starting with Sarah's bakery

### 3. Player Identity
**From:** Software engineer in a tech company  
**To:** Freelance tech consultant building their own business

### 4. Progression Model
**From:** Level-based unlocks and achievements  
**To:** Reputation-based referrals and organic growth

## Component Migration Map

### UI Components
| Old Component | New Component | Changes |
|--------------|---------------|----------|
| MainMenuPage | Landing/SignIn | Browser-based entry |
| CareerMapScreen | Dashboard Tab | Project overview |
| MeetingRoomScreen | Call Tab | Video interface |
| SystemDesignCanvas | Design Tab | Same core, new context |
| SimulationScreen | Test Results | Integrated validation |

### State Management
| Old State | New State | Purpose |
|-----------|-----------|---------|
| game.level | consultant.reputation | Progression tracking |
| game.score | finance.bankBalance | Success metric |
| game.currentPhase | projects.current.phase | Project stages |
| user.achievements | consultant.completedProjects | History tracking |

## Database Schema Changes

### New Tables
1. **consultant_profiles** - Extended user profiles with financial state
2. **clients** - Client personalities and relationships  
3. **emails** - Communication system
4. **projects** - Consulting engagements
5. **transactions** - Financial history
6. **tutorial_progress** - Track onboarding
7. **tutorial_rewards** - Unlock system

### Key Schema Features

#### Desperate Start State
```sql
-- Players start with:
bank_balance: 0
stress_level: 100
title: 'Laid-off Developer'

-- Auto-generated desperate emails:
- Bank overdraft notice
- Failed credit card payment  
- Insurance cancellation warning
- Rent past due notice
- Sarah's opportunity email
```

#### Client Personality System
```sql
clients:
  personality_type: direct | chatty | nervous | skeptical
  technical_level: non-technical | somewhat-technical | very-technical
  budget_flexibility: fixed | negotiable | quality-focused
  referral_source: tracks networking chain
```

#### Progressive Feature Unlocking
```sql
tutorial_rewards:
  - Email compose (after first project)
  - Video calls (after Sarah's referral)
  - Dashboard (with first repeat client)
  - Advanced components (reputation-based)
```

## Implementation Priorities

### Phase 1: Core Tutorial Experience
1. Inbox of despair scene
2. Sarah's email interaction
3. Broken system fix mechanic
4. First payment celebration

### Phase 2: Browser Interface
1. Tab-based navigation
2. Email client implementation
3. Basic dashboard
4. System design canvas port

### Phase 3: Business Simulation
1. Financial tracking
2. Client personalities
3. Referral system
4. Reputation mechanics

### Phase 4: Advanced Features
1. Video call system
2. Project templates
3. Skill progression
4. Achievement system

## Asset Migration

### Reusable Assets
- Component icons (AWS-style)
- System design canvas
- UI components (buttons, cards)
- Sound effects

### New Assets Needed
- Character portraits (Sarah, Mike, etc.)
- Email UI mockups
- Browser chrome styling
- Video call interface
- Stress/mood indicators

## Technical Considerations

### State Persistence
- Auto-save after key actions
- Cloud sync via Supabase
- Tutorial checkpoint system

### Performance
- Lazy load tab content
- Virtualized email lists
- Memoized selectors
- Component code splitting

### Accessibility
- Keyboard navigation
- Screen reader support
- High contrast mode
- Reduced motion option 