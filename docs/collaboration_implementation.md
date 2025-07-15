Based on the Game Design Document, here are the recommended additions for the collaboration feature:
Game Design Document - Collaboration Feature Additions
Section 2: Game Overview - Updates
2.3 Core Gameplay Features (Addition)
6. Real-Time Collaboration
   - Invite friends to solve missions together
   - Shared system design canvas with live cursors
   - Collaborative problem-solving for complex challenges
   - Mentor/mentee dynamics for skill sharing
Section 9: Multiplayer and Social Features - Major Addition
9.3 Mission Collaboration System
9.3.1 Invitation Flow
typescriptinterface CollaborationInvite {
  id: string;
  missionId: string;
  missionTitle: string;
  currentStep: string;
  inviterProfile: {
    name: string;
    level: number;
    avatarUrl: string;
  };
  inviteType: 'email' | 'sms';
  inviteCode: string; // Unique code for joining
  expiresAt: Date;
  message: string; // Customizable invite message
}
Email Invitation Template:
Subject: Help me save the neighborhood! 🆘

Hey [Friend's Name],

I'm working on an urgent mission in System Design Tycoon and could really use your help!

Mission: The Neighborhood Crisis
Current Challenge: The site is crashing under load - we need to implement a load balancer

Alex's daughter Emma and other kids are sick, and we're building a system to track symptoms and find the cause. The more minds on this, the better!

Click here to join me: [https://systemtycoon.game/collab/INVITE_CODE]

We'll be able to work on the same canvas in real-time. I'll show you the ropes!

- [Your Name]

P.S. - This is actually teaching us real system design. Pretty cool!
9.3.2 Collaborative Canvas System
typescriptinterface CollaborativeCanvasState {
  sessionId: string;
  participants: Map<string, ParticipantInfo>;
  sharedComponents: Component[];
  sharedConnections: Connection[];
  
  // Real-time cursor tracking
  cursorPositions: Map<string, CursorPosition>;
  
  // Collaboration features
  currentSpeaker?: string; // Who has "control"
  votingActive?: VoteSession;
  chatMessages: ChatMessage[];
}

interface ParticipantInfo {
  userId: string;
  displayName: string;
  cursorColor: string;
  role: 'host' | 'collaborator';
  permissions: {
    canAddComponents: boolean;
    canDeleteComponents: boolean;
    canModifyConnections: boolean;
  };
  skillLevel: number; // For matchmaking
}
Real-Time Features:
typescriptclass CollaborativeCanvas extends SystemCanvas {
  private realtimeConnection: RealtimeConnection;
  private participants: Map<string, Participant>;
  
  create() {
    super.create();
    this.initializeCollaboration();
  }
  
  initializeCollaboration() {
    // Show other participants' cursors
    this.realtimeConnection.on('cursor-move', (data) => {
      this.updateParticipantCursor(data.userId, data.position);
    });
    
    // Sync component changes
    this.realtimeConnection.on('component-added', (data) => {
      this.addSharedComponent(data.component, data.userId);
      this.showNotification(`${data.userName} added ${data.component.type}`);
    });
    
    // Live voice/text chat integration
    this.createChatInterface();
    
    // Collaborative features
    this.createVotingSystem(); // For design decisions
    this.createDrawingTools(); // For sketching ideas
  }
}
9.3.3 Collaborative Mechanics
Turn-Based Control Mode:
typescriptinterface ControlMode {
  type: 'free-for-all' | 'turn-based' | 'vote-based';
  
  turnBased?: {
    currentController: string;
    turnDuration: number; // seconds
    queue: string[]; // User IDs waiting for turn
  };
  
  voteBased?: {
    proposalActive: boolean;
    proposal: DesignChange;
    votes: Map<string, boolean>;
    requiredApproval: number; // percentage
  };
}
Skill-Based Matchmaking:
typescriptinterface CollaborationMatchmaking {
  // Pair experienced players with newcomers
  mentorMode: {
    mentorMinLevel: 10;
    studentMaxLevel: 5;
    bonusXP: 1.5; // Multiplier for teaching
  };
  
  // Equal skill collaboration
  peerMode: {
    maxLevelDifference: 3;
    sharedXP: true; // Both get full XP
  };
}
Section 8: UI/UX Design - Collaboration UI Updates
8.3.4 Collaboration Interface Elements
Email Compose View (Invitation):
┌─────────────────────────────────────────────────────────────┐
│ 📧 Invite Friend to Mission                                 │
├─────────────────────────────────────────────────────────────┤
│ To: [friend@email.com                                    ] │
│                                                             │
│ Mission: The Neighborhood Crisis                            │
│ Current Step: Implementing Load Balancer                    │
│                                                             │
│ Message:                                                    │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Hey! I'm stuck on this mission about helping sick kids  │ │
│ │ track symptoms. Could use another brain on this!        │ │
│ │                                                          │ │
│ │ We'll be able to see each other's work in real-time.   │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ [ ] Include my current progress                             │
│ [ ] Allow friend to make changes                            │
│                                                             │
│ [Send Invitation] [Cancel]                                  │
└─────────────────────────────────────────────────────────────┘
Collaborative Canvas UI:
┌─────────────────────────────────────────────────────────────┐
│ 🔧 System Designer - Collaborative Session                  │
├─────────────────────────────────────────────────────────────┤
│ Participants: You, Sarah (typing...), Mike                  │
│                                                             │
│ ┌─────────────────────────────────────┬──────────────────┐ │
│ │                                     │ 💬 Team Chat     │ │
│ │   [Canvas with multiple cursors]    │ ─────────────────│ │
│ │                                     │ Sarah: Try adding│ │
│ │   Sarah's cursor (blue) →           │ a cache here?    │ │
│ │                                     │                  │ │
│ │   Your cursor (green) →             │ Mike: Good idea! │ │
│ │                                     │                  │ │
│ │   Mike adding component...          │ You: Let's test  │ │
│ │                                     │ it first         │ │
│ └─────────────────────────────────────┴──────────────────┘ │
│                                                             │
│ [Request Control] [Suggest Change] [Vote on Design]         │
└─────────────────────────────────────────────────────────────┘
Section 7: Game Systems - Shared State Management
7.4.3 Collaborative State Synchronization
typescriptinterface CollaborativeGameState extends GameState {
  collaboration: {
    sessions: Map<string, CollabSession>;
    pendingInvites: CollaborationInvite[];
    activeSession?: {
      id: string;
      role: 'host' | 'guest';
      sharedState: SharedMissionState;
    };
  };
}

interface SharedMissionState {
  // Synchronized across all participants
  missionProgress: {
    currentStep: number;
    completedSteps: string[];
    sharedDecisions: Decision[];
  };
  
  systemDesign: {
    components: Component[];
    connections: Connection[];
    lastModified: {
      userId: string;
      timestamp: number;
      action: string;
    };
  };
  
  performance: {
    isRunning: boolean;
    metrics: SystemMetrics;
    errors: SystemError[];
  };
}
Section 10: Technical Requirements - Infrastructure Updates
10.4 Real-Time Collaboration Infrastructure
typescriptinterface RealtimeInfrastructure {
  // WebSocket connection for real-time updates
  connection: {
    protocol: 'WebSocket' | 'WebRTC';
    fallback: 'long-polling';
    maxLatency: 100; // ms
  };
  
  // Conflict resolution
  conflictResolution: {
    strategy: 'last-write-wins' | 'operational-transform';
    componentLocking: boolean; // Prevent simultaneous edits
    undoBuffer: number; // Number of actions to store
  };
  
  // Session management
  session: {
    maxParticipants: 4;
    inactivityTimeout: 300; // seconds
    persistentSessions: boolean; // Rejoin after disconnect
  };
}
Supabase Real-Time Implementation:
typescript// Database schema additions
interface Tables {
  collaboration_sessions: {
    id: string;
    mission_id: string;
    host_id: string;
    created_at: Date;
    expires_at: Date;
    max_participants: number;
    current_state: JSON; // Serialized canvas state
  };
  
  session_participants: {
    session_id: string;
    user_id: string;
    joined_at: Date;
    role: 'host' | 'collaborator';
    cursor_color: string;
    is_active: boolean;
  };
  
  collaboration_invites: {
    id: string;
    session_id: string;
    inviter_id: string;
    invitee_email: string;
    invite_code: string;
    mission_context: JSON;
    created_at: Date;
    accepted_at?: Date;
  };
}
Section 3: Core Mechanics - Collaborative Problem Solving
3.5 Collaborative Mechanics
typescriptinterface CollaborativeMechanics {
  // Shared decision making
  decisionPoints: {
    componentPlacement: 'individual' | 'consensus';
    connectionDrawing: 'individual' | 'vote';
    systemTesting: 'any-player' | 'all-ready';
  };
  
  // Role-based permissions
  roles: {
    mentor: {
      canOverride: true;
      canAnnotate: true;
      canPause: true;
    };
    peer: {
      canSuggest: true;
      canVote: true;
      equalControl: true;
    };
  };
  
  // Collaborative rewards
  rewards: {
    sharedXP: true;
    collaborationBonus: 1.25; // XP multiplier
    uniqueAchievements: ['TeamPlayer', 'MentorBadge', 'PerfectSync'];
  };
}
Section 11: Monetization Strategy - Collaboration Features
11.2.3 Premium Collaboration Features
Free Tier:
- Invite 1 friend per mission
- 30-minute collaboration sessions
- Basic cursor sharing

Premium Tier:
- Unlimited collaboration invites
- Unlimited session duration
- Voice chat integration
- Session recording and replay
- Private collaboration rooms
- Advanced annotation tools
Implementation Priority & Technical Notes
High Priority:

Basic invitation system via email
Real-time cursor synchronization
Shared component state
Simple turn-based control

Medium Priority:

Voice/text chat integration
Voting mechanisms
Session persistence
Conflict resolution

Low Priority:

Session replay
Advanced annotation tools
Spectator mode
Tournament collaboration mode

Technical Considerations:

Use Supabase Realtime for WebSocket connections
Implement optimistic updates for responsive feel
Add reconnection logic for dropped connections
Consider Redis for session state caching
Implement rate limiting for invite spam prevention

This collaboration feature transforms the tutorial crisis into a shared experience, reinforcing the theme that "solving big problems requires teamwork" while teaching real-world collaborative development practices.