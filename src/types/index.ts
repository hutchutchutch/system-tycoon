// User and Authentication Types
export interface User {
  id: string;
  email: string;
  username: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Profile {
  id: string;
  username: string;
  display_name?: string;
  avatar_url?: string;
  current_level: number;
  reputation_points: number;
  career_title: string;
  preferred_mentor_id?: string;
  created_at: string;
  updated_at: string;
}

export interface UserStats {
  userId: string;
  totalProjectsCompleted: number;
  totalComponentsUsed: number;
  averageScore: number;
  bestScore: number;
  totalTimePlayed: number;
  favoriteComponentId?: string;
  lastPlayedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Scenario Types
export interface Scenario {
  id: string;
  level: number;
  title: string;
  clientName: string;
  description: string;
  budgetLimit: number;
  timeLimitSeconds: number;
  baseRequirements: Requirement[];
  availableQuestions: QuestionSet;
  availableComponents: string[];
  availableMentors: string[];
  successCriteria: SuccessCriteria;
  createdAt: string;
}

export interface Requirement {
  id: string;
  type: 'functional' | 'performance' | 'constraint';
  description: string;
  metric?: string;
  value?: number;
}

export interface QuestionSet {
  [character: string]: Question[];
}

export interface Question {
  id: string;
  text: string;
  impact: {
    requirements?: Requirement[];
    budget?: number;
    timeline?: number;
  };
}

export interface SuccessCriteria {
  minScore: number;
  maxResponseTime?: number;
  minUptime?: number;
  maxErrorRate?: number;
}

// Component Types
export interface Component {
  id: string;
  name: string;
  category: ComponentCategory;
  cost: number;
  capacity: number;
  description: string;
  iconUrl?: string;
  minLevel: number;
  connections: string[];
  properties: ComponentProperties;
  createdAt: string;
}

export type ComponentCategory = 
  | 'frontend' 
  | 'backend' 
  | 'storage' 
  | 'networking' 
  | 'security' 
  | 'operations';

export interface ComponentProperties {
  throughput?: number;
  latency?: number;
  storage?: number;
  bandwidth?: number;
  [key: string]: any;
}

export interface ComponentMastery {
  userId: string;
  componentId: string;
  masteryLevel: MasteryLevel;
  timesUsed: number;
  successfulUses: number;
  lastUsedAt: string;
  unlockedAt: string;
}

export type MasteryLevel = 'novice' | 'bronze' | 'silver' | 'gold';

// Progress Types
export interface ScenarioProgress {
  id: string;
  userId: string;
  scenarioId: string;
  status: ProgressStatus;
  bestScore?: number;
  attempts: number;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type ProgressStatus = 'locked' | 'available' | 'completed';

export interface ScenarioAttempt {
  id: string;
  userId: string;
  scenarioId: string;
  architectureSnapshot: ArchitectureSnapshot;
  questionsAsked: string[];
  mentorSelected?: string;
  componentsUsed: string[];
  totalCost: number;
  performanceMetrics: PerformanceMetrics;
  finalScore: number;
  requirementsMet: boolean[];
  completedAt: string;
  createdAt: string;
}

export interface ArchitectureSnapshot {
  nodes: ArchitectureNode[];
  edges: ArchitectureEdge[];
}

export interface ArchitectureNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: {
    componentId: string;
    label: string;
    [key: string]: any;
  };
}

export interface ArchitectureEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
  animated?: boolean;
  data?: any;
}

export interface PerformanceMetrics {
  responseTime: number;
  throughput: number;
  errorRate: number;
  uptime: number;
  capacityUtilization: number;
}

// Game State Types
export interface GameState {
  currentScreen: GameScreen;
  currentScenario?: Scenario;
  meetingPhase?: MeetingPhaseState;
  designPhase?: DesignPhaseState;
  simulationPhase?: SimulationPhaseState;
  selectedMentor?: Mentor;
}

export type GameScreen = 
  | 'landing'
  | 'auth'
  | 'career-map'
  | 'meeting'
  | 'mentor-selection'
  | 'design'
  | 'simulation'
  | 'results';

export interface MeetingPhaseState {
  questionsRemaining: number;
  questionsAsked: string[];
  currentRequirements: Requirement[];
  budget: number;
  timeline: number;
}

export interface DesignPhaseState {
  timeRemaining: number;
  currentCost: number;
  architecture: ArchitectureSnapshot;
  requirementsMet: boolean[];
}

export interface SimulationPhaseState {
  isRunning: boolean;
  currentPhase: SimulationPhase;
  metrics: PerformanceMetrics;
  componentStates: { [id: string]: ComponentState };
}

export type SimulationPhase = 
  | 'normal' 
  | 'peak' 
  | 'viral' 
  | 'recovery';

export type ComponentState = 
  | 'idle' 
  | 'active' 
  | 'stressed' 
  | 'overloaded' 
  | 'failed';

// Mentor Types
export interface Mentor {
  id: string;
  name: string;
  title: string;
  specialization: string;
  guidanceStyle: string;
  bestForLevels: number[];
  signatureAdvice: string;
  avatarUrl?: string;
  unlockLevel: number;
}

// Achievement Types
export interface Achievement {
  id: string;
  name: string;
  description: string;
  iconUrl?: string;
  category: AchievementCategory;
  criteria: AchievementCriteria;
  rewardType?: RewardType;
  rewardValue?: any;
  createdAt: string;
}

export type AchievementCategory = 
  | 'performance' 
  | 'efficiency' 
  | 'learning' 
  | 'milestone' 
  | 'special';

export interface AchievementCriteria {
  type: string;
  value: number;
  comparison: 'gte' | 'lte' | 'eq';
}

export type RewardType = 
  | 'reputation' 
  | 'component' 
  | 'mentor' 
  | 'cosmetic';

export interface UserAchievement {
  userId: string;
  achievementId: string;
  unlockedAt: string;
  progress?: number;
}