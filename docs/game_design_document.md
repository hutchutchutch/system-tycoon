# System Tycoon - Tech Consultant Simulator
## Game Design Document

**Version:** 2.1  
**Date:** January 2025  
**Document Type:** Implementation Guide  

---

## Table of Contents
1. [Executive Summary](#1-executive-summary)
2. [Core Concept](#2-core-concept)
3. [Opening Sequence - Rock Bottom to First Gig](#3-opening-sequence)
4. [Gameplay Systems](#4-gameplay-systems)
5. [UI/UX Architecture](#5-uiux-architecture)
6. [State Management](#6-state-management)
7. [Component Architecture](#7-component-architecture)
8. [Database Schema](#8-database-schema)
9. [Technical Implementation](#9-technical-implementation)
10. [Asset Requirements](#10-asset-requirements)
11. [Audio Design](#11-audio-design)

---

## 1. Executive Summary

### Concept
System Tycoon transforms players into desperate laid-off developers who discover consulting through helping a friend, building their way from $0 to a thriving tech consultancy. The game uses a browser-based interface metaphor where players manage their business through realistic tools: email, video calls, and a system design canvas.

### Core Experience
- **Emotional Journey**: Start from financial desperation, find hope through helping friends
- **Browser-Based Interface**: All gameplay happens through familiar web tools
- **Email-Driven Narrative**: Story unfolds through client communications  
- **Video Call Requirements**: Gather requirements through realistic client meetings
- **System Design Canvas**: Build AWS-like architectures for real business needs
- **Progressive Unlocking**: Tools and features unlock as reputation grows

### Educational Value
Players learn:
- Real AWS/cloud architecture patterns
- Cost optimization strategies
- Client communication skills
- Requirements gathering techniques
- System design trade-offs
- Business development fundamentals

---

## 2. Core Concept

### Player Journey
1. **Rock Bottom** ($0, overdue bills, desperation)
2. **First Opportunity** (Friend Sarah needs website help - $500)
3. **Growing Network** (Referrals unlock new features and clients)
4. **Professional Consultant** (Multiple projects, advanced tools)
5. **Agency Owner** (Hire junior consultants, tackle enterprise clients)

### Core Mechanics

#### 1. Email Management
- **Inbox Zero Challenge**: Balance urgent bills with client opportunities
- **Relationship Building**: Thoughtful responses lead to better referrals
- **Story Progression**: Major plot points delivered through emails

#### 2. Video Calls
- **Requirements Gathering**: Extract real needs from vague requests
- **Personality System**: Each client has communication preferences
- **Trust Building**: Good questions unlock budget flexibility

#### 3. System Design
- **Component-Based**: Drag-and-drop AWS-like services
- **Cost Optimization**: Balance performance with budget constraints
- **Real Patterns**: Learn actual cloud architecture best practices

#### 4. Business Management
- **Cash Flow**: Manage expenses vs. project income
- **Reputation**: Success breeds referrals and higher rates
- **Skill Development**: Unlock new components and capabilities

---

## 3. Opening Sequence - Rock Bottom to First Gig

### Scene 1: The Inbox of Despair

```typescript
interface OpeningEmailState {
  playerBankBalance: 0; // Always starts at $0
  overdueAmount: 2847.23;
  daysUnemployed: 47;
  emails: [
    {
      from: "Chase Bank",
      subject: "Your account balance is $0.00",
      preview: "Your account is now overdrawn. Fees may apply...",
      urgent: true,
      timeAgo: "2m"
    },
    {
      from: "Visa", 
      subject: "Payment Failed - Action Required",
      preview: "Your automatic payment of $847.23 could not be...",
      urgent: true,
      timeAgo: "1h"
    },
    {
      from: "State Farm",
      subject: "Final Notice - Policy Canceling", 
      preview: "Your auto insurance will be cancelled in 48 hours...",
      urgent: true,
      timeAgo: "3h"
    },
    {
      from: "Apartment Complex",
      subject: "Rent Past Due - $1,450",
      preview: "This is your final notice before we begin eviction...",
      urgent: true,
      timeAgo: "1d"
    },
    {
      from: "Sarah Chen",
      subject: "Quick favor? (I can pay!)",
      preview: "Hey! I know things have been rough since the layoff...",
      isOpportunity: true,
      unread: true,
      timeAgo: "just now"
    }
  ]
}
```

#### Visual Design
- Subtle screen shake effect (stress)
- Muted color palette except Sarah's email
- Quiet heartbeat sound effect
- Red notification badges on urgent emails

### Scene 2: Sarah's Email - The Lifeline

```
From: Sarah Chen <sarah@sweetrisesbakery.com>
To: Me

Hey!

I know things have been rough since the layoff. I've been there too, 
remember when I started the bakery?

Look, I need help with something and I'd rather pay a friend than 
some random freelancer. I'm trying to set up a website for the bakery 
- just a simple blog where I can post daily specials and pastry photos.

I found this tool online that's supposed to make it easy:
https://systembuilder.tech/project/sarahsbakery

But I think I messed it up? The site keeps crashing and the images 
won't load. You were always good with computers at your old job...

I can pay $500 if you can fix it today. I know it's not much, but 
it's what I can afford right now.

The login is already set up - just click the link!

- Sarah

P.S. If this works out, I know other small business owners who need help too!
```

#### Interaction Design
- Link pulses gently (call to action)
- Clicking anywhere on the link progresses
- No other options - force the desperate choice

### Scene 3: The Broken System Canvas

#### Initial State - Sarah's Overengineered Mess
```typescript
interface BrokenSystemState {
  components: [
    { type: "database", name: "Primary DB", cost: 200, position: {x: 100, y: 100} },
    { type: "database", name: "Backup DB", cost: 200, position: {x: 100, y: 200} },
    { type: "database", name: "Backup DB 2", cost: 200, position: {x: 100, y: 300} },
    { type: "web_server", name: "Web Server", cost: 100, position: {x: 300, y: 100} },
    { type: "web_server", name: "Web Backup", cost: 100, position: {x: 300, y: 200} },
    { type: "web_server", name: "Web Backup 2", cost: 100, position: {x: 300, y: 300} }
  ],
  connections: [], // No connections - nothing is wired correctly!
  errors: [
    "No storage for images",
    "Databases not connected properly", 
    "Excessive redundancy ($847/month)"
  ],
  requirements: {
    "View blog posts": false,
    "Images load quickly (<3s)": false,
    "Handle 100 concurrent visitors": false,
    "Cost under $50/month": false
  }
}
```

#### Tutorial Flow

**Phase 1: Realization (Hover Tooltips)**
```typescript
const hoverThoughts = {
  database_redundancy: "Three databases for a blog? That's $600/month right there...",
  missing_storage: "No wonder images won't load - there's no file storage!",
  no_connections: "These components aren't even connected properly...",
  over_engineering: "Sarah tried to make it 'enterprise-grade' but forgot the basics"
};
```

**Phase 2: Guided Fixing**
1. Tutorial suggests clearing canvas
2. Explains basic blog needs (Web + DB + Storage)
3. Shows component drawer with only essentials
4. Guides connections between components

**Phase 3: Building Correct System**
```typescript
interface CorrectSystemState {
  components: [
    { type: "web_server", name: "Web Server", cost: 20 },
    { type: "database", name: "Database", cost: 15 },
    { type: "storage", name: "File Storage", cost: 5 }
  ],
  totalCost: 40, // Under budget!
  allRequirementsMet: true
}
```

**Phase 4: Testing Success**
- Animated traffic flow visualization
- Green checkmarks appear on requirements
- Cost savings highlighted ($807 saved!)
- Sarah's excited message appears
- Payment notification: +$500
- Bank balance updates: $0 → $500

### Scene 4: The Aftermath - Hope Emerges

```typescript
interface PostSuccessState {
  bankBalance: 500,
  newEmails: [
    {
      from: "Sarah Chen",
      subject: "THANK YOU!!!",
      preview: "You're a lifesaver! Site is perfect! Already getting...",
      hasReferral: true
    },
    {
      from: "PayPal",
      subject: "You've received $500.00",
      preview: "Sarah Chen sent you $500.00 for 'Website help'..."
    }
  ],
  playerThought: "$500 down... $2,347 to go. But wait, Sarah mentioned other business owners. Maybe I could do this as a real job?"
}
```

### Progressive Tool Unlocking

#### Level 1: Bare Minimum (Tutorial)
- Email (receive only)
- SystemBuilder Canvas (basic components)
- Bank balance tracker

#### Level 2: Sarah's First Referral (Mike's Restaurant)
```
"My friend Mike wants help too! He said he prefers to explain 
things over video. I told him you're new to this, so he's 
installing some tools to help:
- Video call software for meetings  
- A simple dashboard to track projects
He's willing to pay $750!"
```
**Unlocks**: Call tab, basic Dashboard

#### Level 3-4: Growing Network
- Email compose functionality
- Project templates
- Component library expansion
- Basic monitoring tools

#### Level 5+: Professional Consultant
- Full CRM features
- Advanced AWS components  
- Automated testing
- Multiple project juggling
- Hiring junior consultants

---

## 4. Gameplay Systems

### Email System

#### Types of Emails
1. **Client Inquiries**: New project opportunities
2. **Project Updates**: Status changes, questions
3. **Referrals**: Satisfied clients recommend others
4. **Bills/Expenses**: Ongoing financial pressure
5. **Learning Resources**: Unlock new knowledge
6. **Network Events**: Conference invites, meetups

#### Email Interaction Mechanics
```typescript
interface EmailInteraction {
  // Reading
  openEmail: (emailId: string) => void;
  markAsRead: (emailId: string) => void;
  
  // Responding (unlocked after Level 2)
  quickReply: (template: 'accept' | 'decline' | 'needInfo') => void;
  composeReply: (customMessage: string) => void;
  
  // Organization (unlocked after Level 3)
  archiveEmail: (emailId: string) => void;
  labelEmail: (emailId: string, label: ClientLabel) => void;
  
  // Automation (unlocked after Level 5)
  createAutoResponse: (trigger: EmailTrigger, response: string) => void;
}
```

### Video Call System

#### Call Flow
1. **Pre-Call Prep**: Review client background
2. **Opening**: Build rapport based on personality
3. **Discovery**: Ask probing questions
4. **Requirements**: Document specific needs
5. **Budget Discussion**: Navigate constraints
6. **Next Steps**: Set clear expectations

#### Client Personality Types
```typescript
interface ClientPersonality {
  technical_level: 'non-technical' | 'somewhat-technical' | 'very-technical';
  communication_style: 'direct' | 'chatty' | 'nervous' | 'skeptical';
  budget_flexibility: 'fixed' | 'negotiable' | 'quality-focused';
  decision_speed: 'immediate' | 'deliberate' | 'committee';
  
  // Affects dialogue options
  preferredQuestions: string[];
  turnOffPhrases: string[];
  budgetUnlockTriggers: string[];
}
```

#### Call Mechanics
- **Dialogue Trees**: Choose questions/responses
- **Trust Meter**: Build rapport for better outcomes
- **Note Taking**: Captured notes become requirements
- **Screen Sharing**: Show system designs live

### System Design Canvas

#### Component Categories
1. **Frontend**: CDN, Web Servers, Load Balancers
2. **Backend**: App Servers, Containers, Functions
3. **Data**: RDS, NoSQL, Cache, Data Warehouse
4. **Network**: API Gateway, VPN, DNS
5. **Security**: WAF, Certificates, Encryption
6. **Monitoring**: Logs, Metrics, Alerts

#### Design Constraints
```typescript
interface ProjectConstraints {
  budget: {
    monthly: number;
    setup: number;
  };
  performance: {
    responseTime: number; // ms
    availability: number; // 99.9%
    concurrent_users: number;
  };
  compliance: string[]; // ['HIPAA', 'PCI-DSS']
  timeline: number; // days
}
```

#### Validation System
- **Real-Time Feedback**: Connections validate as you build
- **Cost Calculator**: Running total with breakdown
- **Performance Estimator**: Based on component specs
- **Best Practices**: Warnings for anti-patterns

### Business Management

#### Financial Tracking
```typescript
interface FinancialState {
  bankBalance: number;
  monthlyExpenses: {
    rent: 1450;
    insurance: 235;
    utilities: 150;
    food: 400;
    minimumPayments: 847;
  };
  projectsPipeline: Project[];
  invoicesOutstanding: Invoice[];
  
  // Calculated
  runway: number; // months until bankruptcy
  stressLevel: number; // affects UI and music
}
```

#### Reputation System
- **Client Satisfaction**: On-time, under-budget, meets requirements
- **Referral Network**: Happy clients bring 1-3 new leads
- **Industry Recognition**: Unlock conference speaking, articles
- **Specializations**: Become known for specific solutions

#### Skill Progression
```typescript
interface ConsultantSkills {
  technical: {
    frontend: number; // 0-100
    backend: number;
    databases: number;
    security: number;
    devops: number;
  };
  business: {
    requirements_gathering: number;
    cost_estimation: number;
    project_management: number;
    client_communication: number;
    sales: number;
  };
  
  // Unlocks
  certifications: string[]; // ['AWS Solutions Architect']
  specializations: string[]; // ['E-commerce', 'SaaS']
  components_available: string[]; // Component IDs
}
```

---

## 5. UI/UX Architecture

### Browser Interface Layout

```typescript
interface BrowserUI {
  tabs: {
    dashboard: DashboardTab;    // Unlocked: Level 2
    email: EmailTab;            // Available: Start
    call: VideoCallTab;         // Unlocked: Level 2
    design: SystemCanvasTab;    // Available: Start
  };
  
  globalElements: {
    bankBalance: FinancialWidget; // Always visible
    notifications: NotificationBar;
    profileMenu: UserMenu;
  };
}
```

### Tab Designs

#### Email Tab
```
┌─────────────────────────────────────────────────────────┐
│ 📧 ProMail                                     ⚙️ 👤    │
├─────────────────────────────────────────────────────────┤
│ Compose │ Inbox(12) Sent Drafts Clients Projects      │
├─────────────────────────────────────────────────────────┤
│ Search emails...                    [All][Unread][★]    │
├─────────────────────────────────────────────────────────┤
│ □ ★ Sarah Chen      Follow-up on bakery site     10m   │
│ □ ⚡ Mike's Pizza    Video call in 30 mins        25m   │
│ □ 💰 Invoice #001   Sarah's payment received     2h    │
│ □ 📎 TechCorp       RFP for migration project    3h    │
└─────────────────────────────────────────────────────────┘
```

#### Dashboard Tab
```
┌─────────────────────────────────────────────────────────┐
│ 📊 Consultant Dashboard              Balance: $1,250    │
├─────────────────────────────────────────────────────────┤
│ Active Projects                  This Month             │
│ ┌─────────────────┐  ┌─────────────────────────────┐  │
│ │ Sarah's Bakery  │  │ Revenue:  $2,500  ↑ 150%  │  │
│ │ ████████░░ 80%  │  │ Expenses: $2,082          │  │
│ │ Due in 2 days   │  │ Profit:   $418            │  │
│ └─────────────────┘  └─────────────────────────────┘  │
│                                                         │
│ Pipeline                  Reputation: ⭐⭐⭐☆☆         │
│ • Mike's Pizza - $750    Recent Reviews:              │
│ • Local Gym - $1,200     "Fixed our site in 1 day!"   │
│ • Dental Office - $500   "Great communication"         │
└─────────────────────────────────────────────────────────┘
```

#### Video Call Tab
```
┌─────────────────────────────────────────────────────────┐
│ 📹 Video Call with Mike Rossi                    29:45 │
├─────────────────────────────────────────────────────────┤
│                     ┌─────────────┐                     │
│                     │             │ Trust: ████░░      │
│                     │   Mike's    │ Mood: 😊 Happy     │
│                     │   Video     │                    │
│                     │             │                    │
│                     └─────────────┘                    │
│                                                         │
│ 💭 "I need online ordering but it has to be simple"    │
│                                                         │
│ Your response:                                          │
│ > Tell me more about your current ordering process     │
│ > What's your budget for this project?                 │
│ > How many orders do you typically get per day?        │
│                                                         │
│ 📝 Notes:              [Share Screen] [End Call]       │
│ - Wants online ordering                                 │
│ - 50-100 orders/day                                    │
│ - Current: phone only                                   │
└─────────────────────────────────────────────────────────┘
```

#### System Design Tab
```
┌─────────────────────────────────────────────────────────┐
│ 🔧 System Designer - Mike's Pizza Ordering             │
├─────────────────────────────────────────────────────────┤
│ Requirements          │ Components        │ Templates   │
│ ✓ Handle 100 orders/hr│ 🌐 Frontend      │ E-commerce │
│ ✗ Process payments    │ ⚙️ Backend       │ Blog       │
│ ✗ Send confirmations  │ 💾 Database      │ SaaS       │
│ ✗ Under $100/month    │ 🔒 Security      │            │
├───────────────────────┴──────────────────┴─────────────┤
│                                                         │
│  Canvas:                          Cost: $95/mo         │
│  ┌─────────────────────────────────────────────┐      │
│  │  [CDN] ──→ [Web Server] ──→ [API Gateway]   │      │
│  │                ↓                    ↓        │      │
│  │         [Order Database]    [Payment API]    │      │
│  │                ↓                             │      │
│  │         [Email Service]                      │      │
│  └─────────────────────────────────────────────┘      │
│                                                         │
│ [Validate] [Estimate Traffic] [Save Template]          │
└─────────────────────────────────────────────────────────┘
```

### Visual Design System

#### Color Palette
```css
:root {
  /* Emotional journey colors */
  --desperation-red: #DC2626;     /* Overdue bills */
  --stress-orange: #F59E0B;       /* Warnings */
  --hope-green: #10B981;          /* Opportunities */
  --success-blue: #3B82F6;        /* Achievements */
  
  /* UI Colors */
  --surface-primary: #FFFFFF;      /* Main background */
  --surface-secondary: #F9FAFB;    /* Tab background */
  --border-color: #E5E7EB;        /* Borders */
  --text-primary: #111827;         /* Main text */
  --text-secondary: #6B7280;       /* Secondary text */
  
  /* Component type colors */
  --component-frontend: #3B82F6;   /* Blue */
  --component-backend: #8B5CF6;    /* Purple */
  --component-data: #10B981;       /* Green */
  --component-network: #F59E0B;    /* Orange */
}
```

#### Typography
```css
/* Using system fonts for authenticity */
--font-ui: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto;
--font-mono: 'Monaco', 'Consolas', 'Courier New', monospace;

/* Type scale */
--text-xs: 0.75rem;    /* Metadata */
--text-sm: 0.875rem;   /* UI labels */
--text-base: 1rem;     /* Body text */
--text-lg: 1.125rem;   /* Headings */
--text-xl: 1.25rem;    /* Page titles */
```

#### Component Styling (Atomic Design)
```typescript
// Atoms
const Button = styled.button<{variant: 'primary' | 'secondary' | 'danger'}>`
  /* Base styles following design system */
`;

const Badge = styled.span<{status: 'success' | 'warning' | 'error'}>`
  /* Status indicators */
`;

// Molecules  
const EmailRow = () => (
  <div className="email-row">
    <Badge status={urgent ? 'error' : 'default'} />
    <Avatar src={sender.avatar} />
    <div className="email-content">
      <h4>{sender.name}</h4>
      <p>{subject}</p>
      <span>{preview}</span>
    </div>
    <time>{timeAgo}</time>
  </div>
);

// Organisms
const InboxView = () => (
  <div className="inbox-view">
    <InboxHeader />
    <EmailFilters />
    <EmailList />
    <InboxFooter />
  </div>
);
```

---

## 6. State Management

### Redux Store Structure

```typescript
interface RootState {
  // Core game state
  game: {
    currentPhase: 'inbox' | 'email' | 'call' | 'design' | 'results';
    tutorialStage: TutorialStage;
    currentLevel: number;
    unlockedFeatures: Set<Feature>;
  };
  
  // Financial state
  finance: {
    bankBalance: number;
    monthlyExpenses: ExpenseBreakdown;
    invoicesOutstanding: Invoice[];
    transactionHistory: Transaction[];
    runway: number; // calculated
  };
  
  // Consultant profile
  consultant: {
    id: string;
    name: string;
    title: string; // "Aspiring Developer" → "Senior Consultant"
    skills: SkillSet;
    reputation: number;
    certifications: string[];
    completedProjects: number;
  };
  
  // Client management
  clients: {
    byId: Record<string, Client>;
    activeIds: string[];
    potentialIds: string[];
    relationships: Record<string, number>; // 0-100
  };
  
  // Project state
  projects: {
    byId: Record<string, Project>;
    activeIds: string[];
    completedIds: string[];
    current: {
      projectId: string;
      phase: ProjectPhase;
      systemDesign: SystemDesign;
      requirements: Requirement[];
    }
  };
  
  // Email state
  emails: {
    inbox: Email[];
    sent: Email[];
    drafts: Email[];
    filters: EmailFilters;
    unreadCount: number;
  };
  
  // UI state
  ui: {
    activeTab: 'dashboard' | 'email' | 'call' | 'design';
    notifications: Notification[];
    modals: {
      isCallSchedulerOpen: boolean;
      isInvoiceModalOpen: boolean;
      isTutorialOpen: boolean;
    };
    theme: 'light' | 'dark';
  };
}
```

### Key Actions

```typescript
// Financial actions
const financialActions = {
  RECEIVE_PAYMENT: (amount: number, clientId: string) => ({
    type: 'finance/RECEIVE_PAYMENT',
    payload: { amount, clientId, timestamp: Date.now() }
  }),
  
  PAY_EXPENSE: (expense: ExpenseType, amount: number) => ({
    type: 'finance/PAY_EXPENSE', 
    payload: { expense, amount }
  }),
  
  UPDATE_RUNWAY: () => ({
    type: 'finance/UPDATE_RUNWAY'
  })
};

// Project actions  
const projectActions = {
  START_PROJECT: (project: Project) => ({
    type: 'projects/START_PROJECT',
    payload: project
  }),
  
  UPDATE_SYSTEM_DESIGN: (components: Component[], connections: Connection[]) => ({
    type: 'projects/UPDATE_SYSTEM_DESIGN',
    payload: { components, connections }
  }),
  
  COMPLETE_PROJECT: (projectId: string, clientSatisfaction: number) => ({
    type: 'projects/COMPLETE_PROJECT',
    payload: { projectId, clientSatisfaction }
  })
};

// Email actions
const emailActions = {
  RECEIVE_EMAIL: (email: Email) => ({
    type: 'emails/RECEIVE_EMAIL',
    payload: email
  }),
  
  SEND_REPLY: (originalId: string, reply: string) => ({
    type: 'emails/SEND_REPLY',
    payload: { originalId, reply }
  }),
  
  TRIGGER_REFERRAL: (fromClientId: string, toClientId: string) => ({
    type: 'emails/TRIGGER_REFERRAL',
    payload: { fromClientId, toClientId }
  })
};
```

### Selectors

```typescript
// Memoized selectors for performance
export const gameSelectors = {
  getCurrentStressLevel: createSelector(
    [state => state.finance.bankBalance, state => state.finance.runway],
    (balance, runway) => {
      if (balance < 0) return 100; // Maximum stress
      if (runway < 1) return 80;   // High stress  
      if (runway < 3) return 50;   // Moderate stress
      return 20;                   // Low stress
    }
  ),
  
  getAvailableClients: createSelector(
    [state => state.clients, state => state.consultant.reputation],
    (clients, reputation) => {
      return Object.values(clients.byId).filter(client => 
        client.minReputation <= reputation && 
        !clients.activeIds.includes(client.id)
      );
    }
  ),
  
  getProjectProfit: createSelector(
    [state => state.projects.current],
    (current) => {
      const revenue = current.project?.budget || 0;
      const costs = current.systemDesign?.totalMonthlyCost || 0;
      return revenue - costs;
    }
  )
};
```

### Middleware

```typescript
// Auto-save middleware
const autoSaveMiddleware = store => next => action => {
  const result = next(action);
  
  // Save to localStorage after state changes
  if (action.type.includes('COMPLETE') || action.type.includes('SAVE')) {
    const state = store.getState();
    localStorage.setItem('systemTycoonSave', JSON.stringify({
      finance: state.finance,
      consultant: state.consultant,
      projects: state.projects.completedIds,
      timestamp: Date.now()
    }));
  }
  
  return result;
};

// Tutorial progression middleware  
const tutorialMiddleware = store => next => action => {
  const result = next(action);
  
  if (action.type === 'projects/COMPLETE_PROJECT') {
    const state = store.getState();
    if (state.game.tutorialStage === 'first_project') {
      // Unlock video calls after first project
      store.dispatch({ type: 'game/UNLOCK_FEATURE', payload: 'video_calls' });
      store.dispatch({ type: 'game/ADVANCE_TUTORIAL' });
    }
  }
  
  return result;
};
```

---

## 7. Component Architecture

### Atomic Design Structure

```typescript
// src/components/atoms/
export { Button } from './Button';
export { Badge } from './Badge';
export { Icon } from './Icon';
export { Input } from './Input';
export { Card } from './Card';
export { Progress } from './Progress';

// src/components/molecules/
export { EmailRow } from './EmailRow';
export { ClientAvatar } from './ClientAvatar';
export { ComponentCard } from './ComponentCard';
export { MetricCard } from './MetricCard';
export { RequirementRow } from './RequirementRow';
export { NotificationToast } from './NotificationToast';

// src/components/organisms/
export { InboxView } from './InboxView';
export { VideoCallInterface } from './VideoCallInterface';
export { SystemCanvas } from './SystemCanvas';
export { ProjectDashboard } from './ProjectDashboard';
export { FinancialOverview } from './FinancialOverview';

// src/components/templates/
export { BrowserLayout } from './BrowserLayout';
export { EmailTemplate } from './EmailTemplate';
export { CallTemplate } from './CallTemplate';
export { DesignTemplate } from './DesignTemplate';

// src/components/pages/
export { GamePage } from './GamePage';
export { TutorialPage } from './TutorialPage';
```

### Key Component Examples

#### EmailRow Component (Molecule)
```typescript
interface EmailRowProps {
  email: Email;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onOpen: (id: string) => void;
}

export const EmailRow: React.FC<EmailRowProps> = ({ 
  email, 
  isSelected, 
  onSelect, 
  onOpen 
}) => {
  const urgencyLevel = useSelector(state => 
    gameSelectors.getEmailUrgency(state, email.id)
  );
  
  return (
    <div 
      className={cn(
        "email-row",
        isSelected && "email-row--selected",
        email.unread && "email-row--unread",
        urgencyLevel === 'high' && "email-row--urgent"
      )}
      onClick={() => onOpen(email.id)}
    >
      <input 
        type="checkbox" 
        checked={isSelected}
        onChange={() => onSelect(email.id)}
        onClick={e => e.stopPropagation()}
      />
      
      <Badge 
        status={email.urgent ? 'error' : 'default'}
        icon={email.hasAttachment ? 'paperclip' : undefined}
      />
      
      <Avatar 
        src={email.sender.avatar} 
        name={email.sender.name}
        size="sm"
      />
      
      <div className="email-row__content">
        <h4>{email.sender.name}</h4>
        <p>{email.subject}</p>
        <span>{email.preview}</span>
      </div>
      
      <time>{formatTimeAgo(email.timestamp)}</time>
    </div>
  );
};
```

#### SystemCanvas Component (Organism)
```typescript
interface SystemCanvasProps {
  projectId: string;
  requirements: Requirement[];
  budget: Budget;
  onValidate: (system: SystemDesign) => ValidationResult;
}

export const SystemCanvas: React.FC<SystemCanvasProps> = ({
  projectId,
  requirements,
  budget,
  onValidate
}) => {
  const [components, setComponents] = useState<Component[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [draggedComponent, setDraggedComponent] = useState<string | null>(null);
  
  const availableComponents = useSelector(state => 
    gameSelectors.getAvailableComponents(state)
  );
  
  const handleDrop = useCallback((e: DragEvent, position: Position) => {
    if (!draggedComponent) return;
    
    const component = availableComponents.find(c => c.id === draggedComponent);
    if (!component) return;
    
    setComponents(prev => [...prev, {
      ...component,
      instanceId: generateId(),
      position
    }]);
  }, [draggedComponent, availableComponents]);
  
  const totalCost = useMemo(() => 
    components.reduce((sum, c) => sum + c.monthlyCost, 0),
    [components]
  );
  
  const validation = useMemo(() => 
    onValidate({ components, connections, totalCost }),
    [components, connections, totalCost, onValidate]
  );
  
  return (
    <div className="system-canvas">
      <ComponentDrawer 
        components={availableComponents}
        onDragStart={setDraggedComponent}
      />
      
      <Canvas
        components={components}
        connections={connections}
        onDrop={handleDrop}
        onConnect={(from, to) => {
          setConnections(prev => [...prev, { from, to, type: 'data' }]);
        }}
      />
      
      <ValidationPanel
        requirements={requirements}
        validation={validation}
        totalCost={totalCost}
        budget={budget}
      />
    </div>
  );
};
```

---

## 8. Database Schema

### Supabase Tables

```sql
-- Consultant profiles (extends auth.users)
CREATE TABLE consultant_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  title TEXT DEFAULT 'Aspiring Developer',
  avatar_url TEXT,
  bio TEXT,
  hourly_rate DECIMAL(10,2) DEFAULT 0,
  total_revenue DECIMAL(12,2) DEFAULT 0,
  reputation_score INTEGER DEFAULT 0,
  bank_balance DECIMAL(12,2) DEFAULT 0, -- Starts at 0!
  stress_level INTEGER DEFAULT 100, -- High stress at start
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clients table
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  industry TEXT,
  company_size TEXT CHECK (company_size IN ('small', 'medium', 'large', 'enterprise')),
  personality_type TEXT CHECK (personality_type IN ('direct', 'chatty', 'nervous', 'skeptical')),
  technical_level TEXT CHECK (technical_level IN ('non-technical', 'somewhat-technical', 'very-technical')),
  budget_flexibility TEXT CHECK (budget_flexibility IN ('fixed', 'negotiable', 'quality-focused')),
  referral_source UUID REFERENCES clients(id), -- Who referred them
  min_reputation INTEGER DEFAULT 0, -- Required reputation to unlock
  personality_traits JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pre-seed Sarah as first client
INSERT INTO clients (id, name, company, email, personality_type, technical_level, budget_flexibility)
VALUES (
  '550e8400-e29b-41d4-a716-446655440001',
  'Sarah Chen',
  'Sweet Rises Bakery', 
  'sarah@sweetrisesbakery.com',
  'chatty',
  'non-technical',
  'fixed'
);

-- Projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultant_id UUID REFERENCES consultant_profiles(id),
  client_id UUID REFERENCES clients(id),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT CHECK (status IN ('inquiry', 'discovery', 'proposal', 'active', 'testing', 'completed', 'cancelled')),
  budget DECIMAL(10,2),
  actual_cost DECIMAL(10,2),
  deadline TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  client_satisfaction INTEGER CHECK (client_satisfaction >= 1 AND client_satisfaction <= 5),
  requirements JSONB DEFAULT '[]',
  system_design JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Emails table
CREATE TABLE emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultant_id UUID REFERENCES consultant_profiles(id),
  sender_type TEXT CHECK (sender_type IN ('client', 'system', 'referral', 'bill')),
  sender_id UUID REFERENCES clients(id), -- NULL for system emails
  subject TEXT NOT NULL,
  preview TEXT,
  body TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  is_urgent BOOLEAN DEFAULT FALSE,
  has_opportunity BOOLEAN DEFAULT FALSE,
  has_attachment BOOLEAN DEFAULT FALSE,
  replied_at TIMESTAMPTZ,
  reply_content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Financial transactions
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultant_id UUID REFERENCES consultant_profiles(id),
  type TEXT CHECK (type IN ('income', 'expense')),
  category TEXT NOT NULL, -- 'project_payment', 'rent', 'utilities', etc.
  description TEXT,
  amount DECIMAL(10,2) NOT NULL,
  balance_after DECIMAL(10,2) NOT NULL,
  related_project_id UUID REFERENCES projects(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Components catalog
CREATE TABLE components (
  id TEXT PRIMARY KEY, -- e.g., 'web_server', 'rds_mysql'
  name TEXT NOT NULL,
  category TEXT CHECK (category IN ('frontend', 'backend', 'data', 'network', 'security', 'monitoring')),
  base_cost DECIMAL(10,2) NOT NULL,
  cost_model JSONB DEFAULT '{}', -- Variable pricing rules
  capacity JSONB DEFAULT '{}', -- Performance characteristics  
  min_level INTEGER DEFAULT 1, -- Unlock requirement
  description TEXT,
  icon_url TEXT,
  prerequisites JSONB DEFAULT '[]' -- Required components
);

-- Skills and certifications
CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultant_id UUID REFERENCES consultant_profiles(id),
  skill_category TEXT CHECK (skill_category IN ('technical', 'business')),
  skill_name TEXT NOT NULL,
  current_level INTEGER DEFAULT 0 CHECK (current_level >= 0 AND current_level <= 100),
  experience_points INTEGER DEFAULT 0,
  unlocked_features JSONB DEFAULT '[]',
  UNIQUE(consultant_id, skill_name)
);

-- Achievements/Milestones
CREATE TABLE achievements (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon_url TEXT,
  unlock_condition JSONB NOT NULL, -- Conditions to unlock
  reward JSONB, -- What unlocks when achieved
  is_hidden BOOLEAN DEFAULT FALSE
);

CREATE TABLE consultant_achievements (
  consultant_id UUID REFERENCES consultant_profiles(id),
  achievement_id TEXT REFERENCES achievements(id),
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (consultant_id, achievement_id)
);

-- Game saves/sessions
CREATE TABLE game_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultant_id UUID REFERENCES consultant_profiles(id),
  save_name TEXT,
  game_state JSONB NOT NULL, -- Complete game state
  playtime_seconds INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tutorial progress
CREATE TABLE tutorial_progress (
  consultant_id UUID PRIMARY KEY REFERENCES consultant_profiles(id),
  current_stage TEXT NOT NULL DEFAULT 'inbox_despair',
  completed_stages JSONB DEFAULT '[]',
  hints_shown JSONB DEFAULT '[]',
  skipped BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Real-time Subscriptions

```typescript
// Subscribe to new emails
const emailSubscription = supabase
  .from('emails')
  .on('INSERT', payload => {
    // Show notification
    dispatch(emailActions.RECEIVE_EMAIL(payload.new));
  })
  .subscribe();

// Subscribe to project status changes  
const projectSubscription = supabase
  .from('projects')
  .on('UPDATE', payload => {
    if (payload.new.status === 'completed') {
      dispatch(projectActions.PROJECT_COMPLETED(payload.new));
    }
  })
  .subscribe();
```

### Row Level Security

```sql
-- Consultants can only see their own data
ALTER TABLE consultant_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON consultant_profiles
  FOR ALL USING (auth.uid() = id);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;  
CREATE POLICY "Users can view own projects" ON projects
  FOR ALL USING (auth.uid() = consultant_id);

ALTER TABLE emails ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own emails" ON emails
  FOR ALL USING (auth.uid() = consultant_id);

-- Public read for game components
ALTER TABLE components ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Components are viewable by all" ON components
  FOR SELECT USING (true);
```

---

## 9. Technical Implementation

### Tech Stack

```typescript
// Frontend
{
  "framework": "React 18 + TypeScript",
  "state": "Redux Toolkit + RTK Query",
  "routing": "React Router v6", 
  "styling": "Tailwind CSS + CSS Modules",
  "animation": "Framer Motion",
  "charts": "Recharts",
  "canvas": "React Flow (for system design)",
  "build": "Vite"
}

// Backend  
{
  "database": "Supabase (PostgreSQL)",
  "auth": "Supabase Auth",
  "realtime": "Supabase Realtime",
  "storage": "Supabase Storage",
  "functions": "Supabase Edge Functions"
}

// Infrastructure
{
  "hosting": "Vercel",
  "monitoring": "Sentry",
  "analytics": "PostHog"
}
```

### Key Implementation Files

```typescript
// src/features/tutorial/TutorialManager.tsx
export const TutorialManager: React.FC = () => {
  const stage = useSelector(state => state.game.tutorialStage);
  const dispatch = useDispatch();
  
  useEffect(() => {
    // Initialize desperate state
    if (stage === 'inbox_despair') {
      dispatch(financeActions.SET_BALANCE(0));
      dispatch(uiActions.ADD_SCREEN_SHAKE());
      dispatch(audioActions.PLAY_HEARTBEAT());
    }
  }, [stage]);
  
  const stages: Record<TutorialStage, React.ComponentType> = {
    inbox_despair: InboxDespairScene,
    sarah_email: SarahEmailScene,
    broken_system: BrokenSystemScene,
    fixing_system: SystemFixingScene,
    first_success: FirstSuccessScene
  };
  
  const CurrentStage = stages[stage];
  
  return (
    <div className="tutorial-wrapper">
      <CurrentStage onComplete={() => dispatch(gameActions.ADVANCE_TUTORIAL())} />
    </div>
  );
};

// src/features/systemDesign/SystemValidator.ts
export class SystemValidator {
  validateRequirements(
    system: SystemDesign,
    requirements: Requirement[]
  ): ValidationResult {
    const results = requirements.map(req => {
      switch (req.type) {
        case 'performance':
          return this.validatePerformance(system, req);
        case 'cost':
          return this.validateCost(system, req);
        case 'availability':
          return this.validateAvailability(system, req);
        case 'scalability':
          return this.validateScalability(system, req);
        default:
          return { met: false, reason: 'Unknown requirement type' };
      }
    });
    
    return {
      allMet: results.every(r => r.met),
      details: results,
      suggestions: this.generateSuggestions(results)
    };
  }
  
  private validatePerformance(
    system: SystemDesign,
    req: PerformanceRequirement
  ): RequirementResult {
    const responseTime = this.calculateResponseTime(system);
    return {
      met: responseTime <= req.maxResponseTime,
      actual: responseTime,
      expected: req.maxResponseTime,
      reason: responseTime > req.maxResponseTime 
        ? `Response time ${responseTime}ms exceeds ${req.maxResponseTime}ms limit`
        : undefined
    };
  }
}

// src/features/email/EmailGenerator.ts
export class EmailGenerator {
  generateReferralEmail(
    referrer: Client,
    referee: Client,
    context: ProjectContext
  ): Email {
    const templates = {
      chatty: `Hey! ${referrer.name} told me you did an amazing job on their ${context.projectType}. 
              I've been struggling with something similar...`,
      direct: `${referrer.name} recommended you. I need help with ${context.need}. 
              Budget: $${referee.budget}. Interested?`,
      nervous: `Hi... I hope it's okay that I'm reaching out. ${referrer.name} said you might 
               be able to help? I'm not very technical but I need...`
    };
    
    return {
      id: generateId(),
      sender: referee,
      subject: this.generateSubject(referee.personality_type),
      body: templates[referee.personality_type],
      hasOpportunity: true,
      urgency: this.calculateUrgency(referee)
    };
  }
}
```

### Performance Optimizations

```typescript
// Memoized selectors
export const expensiveSelectors = {
  getSystemCost: createSelector(
    [state => state.projects.current.systemDesign],
    (design) => {
      if (!design) return 0;
      return design.components.reduce((total, component) => {
        const baseCost = component.monthlyCost;
        const scaleCost = component.costModel?.perUnit 
          ? component.costModel.perUnit * component.quantity
          : 0;
        return total + baseCost + scaleCost;
      }, 0);
    }
  )
};

// React.memo for expensive components
export const SystemCanvas = React.memo<SystemCanvasProps>(({ 
  components,
  connections,
  onUpdate 
}) => {
  // Expensive rendering logic
  return <ReactFlow />;
}, (prevProps, nextProps) => {
  // Custom comparison
  return (
    prevProps.components.length === nextProps.components.length &&
    prevProps.connections.length === nextProps.connections.length
  );
});

// Virtualized email list
export const EmailList: React.FC = () => {
  const emails = useSelector(state => state.emails.inbox);
  
  return (
    <VirtualList
      height={600}
      itemCount={emails.length}
      itemSize={80}
      width="100%"
    >
      {({ index, style }) => (
        <div style={style}>
          <EmailRow email={emails[index]} />
        </div>
      )}
    </VirtualList>
  );
};
```

---

## 9. Asset Requirements

### Visual Assets

#### Character Portraits
- **Sarah Chen**: Friendly bakery owner, warm smile
- **Mike Rossi**: Stressed pizza shop owner
- **Various Clients**: Diverse industries and personalities

#### System Components Icons
```
frontend/
  - cdn.svg (blue cloud icon)
  - web_server.svg (blue server)
  - load_balancer.svg (blue traffic splitter)

backend/
  - app_server.svg (purple server)
  - container.svg (purple box)
  - lambda.svg (purple lightning)

data/
  - rds.svg (green database)
  - nosql.svg (green document)
  - cache.svg (green memory)
  - warehouse.svg (green building)

network/
  - api_gateway.svg (orange gate)
  - vpc.svg (orange network)
  - dns.svg (orange globe)
```

#### UI Elements
- Browser tab icons
- Status indicators (urgent, opportunity, etc.)
- Stress/mood indicators
- Progress bars
- Achievement badges

### Animation Requirements

```typescript
interface AnimationNeeds {
  // Subtle stress effects
  screenShake: {
    trigger: 'low_balance' | 'overdue_bill',
    intensity: 0.001 - 0.005,
    duration: 100 - 500 // ms
  },
  
  // Email notifications
  emailArrive: {
    slideIn: 'from-right',
    duration: 300,
    withSound: true
  },
  
  // System building
  componentDrag: {
    ghost: 0.5, // opacity
    snapToGrid: true,
    gridSize: 20
  },
  
  connectionDraw: {
    type: 'bezier',
    animated: true,
    pulseOnData: true
  },
  
  // Success moments
  requirementMet: {
    checkmark: 'draw-in',
    duration: 400,
    color: 'green'
  },
  
  paymentReceived: {
    numberIncrement: true,
    duration: 1000,
    withConfetti: true
  }
}
```

---

## 10. Audio Design

### Sound Categories

#### Ambient/Background
```typescript
const ambientSounds = {
  // Stress levels
  heartbeat_slow: 'heartbeat_60bpm.ogg',     // Normal
  heartbeat_medium: 'heartbeat_90bpm.ogg',   // Worried  
  heartbeat_fast: 'heartbeat_120bpm.ogg',    // Panicked
  
  // Work ambience
  typing_soft: 'keyboard_mechanical_soft.ogg',
  coffee_shop: 'ambience_coffee_shop.ogg',
  home_office: 'ambience_quiet_room.ogg'
};
```

#### UI Feedback
```typescript  
const uiSounds = {
  // Email
  email_arrive: 'notification_soft.ogg',
  email_urgent: 'notification_urgent.ogg',
  email_send: 'whoosh_send.ogg',
  
  // System design
  component_place: 'click_soft.ogg',
  component_connect: 'connect_wire.ogg',
  component_error: 'error_soft.ogg',
  
  // Success
  requirement_met: 'success_chime.ogg',
  payment_received: 'cash_register.ogg',
  level_up: 'achievement_unlock.ogg',
  
  // Call
  call_ring: 'phone_ring.ogg',
  call_connect: 'call_start.ogg',
  call_end: 'call_end.ogg'
};
```

#### Dynamic Music System
```typescript
interface DynamicMusic {
  layers: {
    base: 'music_base_loop.ogg',        // Always playing
    stress: 'music_stress_layer.ogg',   // Fades in with low money
    success: 'music_success_layer.ogg', // During good moments
    thinking: 'music_thinking_layer.ogg' // During design phase
  };
  
  triggers: {
    bankBalance: (balance: number) => {
      if (balance < 100) return ['base', 'stress'];
      if (balance > 1000) return ['base', 'success'];
      return ['base'];
    },
    
    gamePhase: (phase: string) => {
      if (phase === 'design') return ['base', 'thinking'];
      if (phase === 'call') return ['base'];
      return ['base'];
    }
  };
}
```

### Implementation

```typescript
// Audio manager
export class AudioManager {
  private context: AudioContext;
  private layers: Map<string, AudioBufferSourceNode>;
  private currentStress: number = 0;
  
  async initialize() {
    this.context = new AudioContext();
    await this.loadSounds();
  }
  
  updateStressLevel(stress: number) {
    if (stress !== this.currentStress) {
      this.crossfadeLayers(
        this.getLayersForStress(this.currentStress),
        this.getLayersForStress(stress),
        1000 // 1 second crossfade
      );
      this.currentStress = stress;
    }
  }
  
  playUISound(sound: string, volume: number = 0.5) {
    const source = this.context.createBufferSource();
    source.buffer = this.buffers.get(sound);
    
    const gain = this.context.createGain();
    gain.gain.value = volume;
    
    source.connect(gain);
    gain.connect(this.context.destination);
    source.start();
  }
}
```

---

## Conclusion

This game design document outlines a complete transformation from abstract game mechanics to an emotionally-driven, browser-based consultant simulator. The "rock bottom to first gig" opening creates immediate player investment while teaching core mechanics through a friend helping a friend in need.

Key innovations:
- **Emotional storytelling**: Start from genuine desperation
- **Realistic interface**: Browser tabs feel authentic  
- **Progressive complexity**: Features unlock naturally
- **Educational value**: Learn real cloud architecture
- **Business simulation**: Manage finances and client relationships

The implementation leverages modern web technologies (React, Redux, Supabase) following atomic design principles to create a maintainable, scalable codebase that can grow with the game's ambitions.