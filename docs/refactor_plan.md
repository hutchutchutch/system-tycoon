Based on your transition to a browser-based interface for the "tech consultant" experience, here's a comprehensive refactor plan and recommended GDD updates:

## Refactor Plan: CareerMapGame → Browser View Interface

### Phase 1: Scene Architecture Restructuring (Week 1)

**1.1 Create New Scene Structure**
```typescript
// Current Structure (to be refactored)
- MainMenuScene
- CareerMapScene
- MeetingScene
- DesignCanvasScene
- SimulationScene

// New Structure
- TabBarScene (persistent overlay)
- DashboardScene (replaces CareerMapScene)
- EmailScene (new - client communications)
- ClientCallScene (replaces/enhances MeetingScene)
- DesignCanvasScene (enhanced with browser chrome)
- SimulationScene (integrated into DesignCanvas)
```

**1.2 Implement TabBarScene**
- Create persistent tab bar that remains visible across all scenes
- Implement scene switching logic
- Add visual feedback (glow effects, active states)
- Consider hybrid HTML/Phaser approach for sharper text

### Phase 2: Scene Conversion (Week 2-3)

**2.1 Dashboard Scene (formerly CareerMapScene)**
```typescript
// Convert career map to a project dashboard
- Active projects list (current level scenarios)
- Completed projects portfolio
- Client testimonials/referrals
- Revenue/reputation metrics
- Calendar widget showing upcoming meetings
```

**2.2 Email Scene (new)**
```typescript
// Client communication hub
- Inbox with project inquiries
- Referral emails from past clients
- Requirements clarifications
- Project status updates
- Unlocks new projects based on reputation
```

**2.3 ClientCallScene (enhanced MeetingScene)**
```typescript
// Video call interface
- Webcam-style frames for participants
- Screen sharing area for requirements
- Chat sidebar for questions
- Meeting notes panel
- "End Call" → transitions to Design phase
```

### Phase 3: Integration Updates (Week 4)

**3.1 State Management Migration**
```typescript
// Add browser-specific state
interface BrowserState {
  activeTab: 'Dashboard' | 'Email' | 'Call' | 'Design';
  unreadEmails: number;
  activeMeeting: boolean;
  currentProject: ProjectData;
  consultantProfile: ConsultantProfile;
}
```

**3.2 Asset Updates**
- Browser UI elements (tabs, window chrome, buttons)
- Email interface components
- Video call UI elements
- Professional dashboard widgets

## Recommended Game Design Document Updates

### 1. Executive Summary Updates

**Updated Tagline:**
*"From Side Projects to System Architect - Build Your Tech Consulting Empire"*

**Core Gameplay Loop (revised):**
**Email Inquiry** → **Client Video Call** → **Requirements Clarification** → **System Design** → **Live Deployment** → **Client Feedback** → **Referral Generation** → **New Opportunities**

### 2. Game Overview Updates

**2.1 Core Concept (revised)**
System Design Tycoon transforms you into a freelance tech consultant working from your laptop. Through a realistic browser interface, you'll manage client communications via email, conduct requirements gathering through video calls, and design systems in your development environment. Watch as your solutions go live and handle real traffic, building your reputation from neighborhood helper to industry authority.

**2.4 Game Flow (revised)**
```
Browser Launch → Dashboard (Project Overview) → 
Email (New Inquiry) → Accept Project → 
Video Call (Requirements Gathering) → 
Design Tab (System Architecture) → 
Deployment Simulation → Client Review → 
Email (Referral/Payment) → Dashboard Update
```

### 3. Story and Narrative Updates

**4.1 Story Synopsis (enhanced)**
You're a tech enthusiast turned freelance consultant, managing your entire business through your laptop browser. Each tab represents a crucial aspect of your consulting practice:
- **Dashboard**: Your command center showing active projects, revenue, and reputation
- **Email**: Where new opportunities arrive through referrals  
- **Call**: Face-to-face client meetings to understand their needs
- **Design**: Your development environment powered by modern tools

**New Narrative Elements:**
- Email chains showing referral paths
- Video call transcripts that feel authentic
- Dashboard metrics reflecting your growing business
- Browser notifications for urgent client needs

### 4. Character Updates

**5.2 Team Members (recontextualized as Video Call Participants)**
Instead of abstract meeting rooms, characters now appear in video call frames:
- **Sarah (Original Client)**: Appears in calls for referrals, showing pride in your growth
- **Client Representatives**: Unique avatars for each company/project
- **Technical Stakeholders**: Join calls for complex requirements
- **Investors/Board Members**: Appear in late-game enterprise calls

### 5. Level Design Updates

**6.1 Level Design Philosophy (enhanced)**
Each "level" is now a client project that arrives via email, progresses through video calls, and concludes with deployed solutions and referrals.

**6.2 New Level Structure Example:**

**Level 1.1: "Sarah's Bakery Website"**
```
Email Phase:
- Subject: "Re: You helped my friend Mike!"
- Sarah's request for website help
- Reply options to accept/clarify/schedule

Video Call Phase:
- Sarah in her bakery (background)
- Screen share of current Squarespace site
- Live Q&A about requirements
- Meeting notes auto-generated

Design Phase:
- Browser developer tools aesthetic
- Component drawer as "npm packages"
- Deploy button when ready

Results Phase:
- Live traffic simulation
- Cost savings calculator
- Sarah's happy response
- Referral email generated
```

### 6. UI/UX Updates

**8.1 UI Flow (completely revised)**
```
Browser Window
├── Tab Bar (persistent)
│   ├── Dashboard Tab
│   ├── Email Tab (with unread badge)
│   ├── Call Tab (with active indicator)
│   └── Design Tab (with project name)
├── URL Bar (shows current "site")
├── Content Area (active scene)
└── Status Bar (consultant stats)
```

**8.2 New UI Elements**
- **Email Client**: Gmail-inspired interface
- **Video Call UI**: Zoom/Meet-inspired layout
- **Dashboard Widgets**: Revenue charts, project cards, testimonials
- **Browser Chrome**: Authentic browser window styling

### 7. Multiplayer Updates

**Challenge Mode (revised):**
- Competitors shown as other "browser windows"
- Email leaderboards showing who won the contract
- Shared video calls for collaborative requirements gathering

**Collaborate Mode (revised):**
- Screen sharing metaphor for joint design
- Group video calls with role assignments
- Shared browser tabs for real-time collaboration

### 8. Technical Requirements Updates

**10.1 Scene Management**
```typescript
// Persistent scenes
- TabBarScene: always active
- NotificationSystem: browser-style alerts

// Swappable content scenes
- DashboardScene
- EmailScene  
- ClientCallScene
- DesignCanvasScene

// Scene communication
- EventEmitter for tab switches
- State preservation between switches
```

### 9. New Gameplay Features

**Email Management System:**
- Inbox prioritization
- Quick replies vs detailed responses
- Referral chain tracking
- Spam/irrelevant filter mini-game

**Video Call Mechanics:**
- Timed question opportunities
- Visual cues for stakeholder mood
- Screen annotation tools
- Meeting recording for reference

**Browser-Based Progression:**
- Bookmark important resources
- Browser history as project portfolio
- Cookies as saved client preferences
- Extensions unlock (represents new tools/skills)

This refactor maintains the core educational value while creating a more immersive, realistic consultant experience that mirrors actual tech industry workflows.