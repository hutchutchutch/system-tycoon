// Game Constants
export const GAME_CONFIG = {
  MAX_QUESTIONS_PER_MEETING: 3,
  DEFAULT_TIME_LIMIT_SECONDS: 900, // 15 minutes
  MIN_PASSING_SCORE: 60,
  PERFECT_SCORE: 100,
  STARTING_REPUTATION: 0,
  REPUTATION_PER_LEVEL: 100,
} as const;

// Career Titles by Level
export const CAREER_TITLES = [
  'Aspiring Consultant',
  'Junior Developer',
  'System Designer',
  'Solutions Architect',
  'Senior Architect',
  'Principal Engineer',
  'Distinguished Engineer',
  'Industry Expert',
  'Master Architect',
  'System Design Legend',
] as const;

// Component Categories
export const COMPONENT_CATEGORIES = {
  FRONTEND: 'frontend',
  BACKEND: 'backend',
  STORAGE: 'storage',
  NETWORKING: 'networking',
  SECURITY: 'security',
  OPERATIONS: 'operations',
} as const;

// Simulation Phases
export const SIMULATION_PHASES = {
  NORMAL: { name: 'Normal Traffic', multiplier: 1 },
  PEAK: { name: 'Peak Hours', multiplier: 2 },
  VIRAL: { name: 'Viral Spike', multiplier: 10 },
  RECOVERY: { name: 'Recovery', multiplier: 0.5 },
} as const;

// Score Breakdown
export const SCORE_WEIGHTS = {
  REQUIREMENTS_MET: 40,
  PERFORMANCE: 30,
  COST_EFFICIENCY: 20,
  ARCHITECTURE_QUALITY: 10,
} as const;

// Routes
export const ROUTES = {
  HOME: '/',
  AUTH: '/auth',
  SIGN_IN: '/auth',
  SIGN_UP: '/auth',
  GAME: '/game',
  MEETING: '/meeting/:scenarioId',
  MENTOR_SELECT: '/mentor/:scenarioId',
  DESIGN: '/design/:scenarioId',
  SIMULATION: '/simulation/:scenarioId',
  RESULTS: '/results/:attemptId',
  PROFILE: '/profile',
  SETTINGS: '/settings',
} as const;

// API Endpoints (if using custom backend)
export const API_ENDPOINTS = {
  AUTH: {
    SIGN_IN: '/api/auth/signin',
    SIGN_UP: '/api/auth/signup',
    SIGN_OUT: '/api/auth/signout',
    REFRESH: '/api/auth/refresh',
  },
  USER: {
    PROFILE: '/api/user/profile',
    STATS: '/api/user/stats',
    ACHIEVEMENTS: '/api/user/achievements',
  },
  GAME: {
    SCENARIOS: '/api/game/scenarios',
    COMPONENTS: '/api/game/components',
    MENTORS: '/api/game/mentors',
    ATTEMPT: '/api/game/attempt',
    PROGRESS: '/api/game/progress',
  },
} as const;

// OAuth Providers
export const OAUTH_PROVIDERS = {
  GOOGLE: {
    name: 'Google',
    icon: 'google',
    color: '#4285F4',
  },
  GITHUB: {
    name: 'GitHub',
    icon: 'github',
    color: '#333333',
  },
  LINKEDIN: {
    name: 'LinkedIn',
    icon: 'linkedin',
    color: '#0077B5',
  },
} as const;

// Theme Colors
export const THEME_COLORS = {
  primary: '#3B82F6', // Blue
  secondary: '#10B981', // Green
  accent: '#8B5CF6', // Purple
  warning: '#F59E0B', // Orange
  error: '#EF4444', // Red
  success: '#10B981', // Green
  info: '#06B6D4', // Cyan
  neutral: '#6B7280', // Gray
  background: '#FFFFFF',
  surface: '#F9FAFB',
  text: {
    primary: '#111827',
    secondary: '#6B7280',
    inverse: '#FFFFFF',
  },
} as const;

// Animation Durations
export const ANIMATION_DURATIONS = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 1000,
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'system-design-tycoon-auth',
  USER_PREFERENCES: 'system-design-tycoon-prefs',
  GAME_PROGRESS: 'system-design-tycoon-progress',
  TUTORIAL_COMPLETED: 'system-design-tycoon-tutorial',
} as const;