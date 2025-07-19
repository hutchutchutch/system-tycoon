import type { Mentor } from '../types';

export const MENTORS: Record<string, Mentor> = {
  'linda-wu': {
    id: 'linda-wu',
    name: 'Dr. Linda Wu',
    title: 'Senior Systems Architect',
    specialization: 'Foundational architecture patterns and scalability',
    guidanceStyle: 'Patient teacher who explains the "why" behind architectural decisions',
    bestForLevels: [1, 2, 3],
    signatureAdvice: "Let's think about this step by step...",
    unlockLevel: 1,
  },
  'sam-okafor': {
    id: 'sam-okafor',
    name: 'Sam Okafor',
    title: 'Performance Engineer',
    specialization: 'Optimization, caching strategies, and performance tuning',
    guidanceStyle: 'Data-driven, loves metrics and benchmarks',
    bestForLevels: [2, 3, 4],
    signatureAdvice: "The numbers don't lie, here's what the data shows...",
    unlockLevel: 2,
  },
  'maya-patel': {
    id: 'maya-patel',
    name: 'Maya Patel',
    title: 'Cloud Solutions Architect',
    specialization: 'Modern cloud platforms, microservices, and distributed systems',
    guidanceStyle: 'Forward-thinking, prefers cutting-edge solutions',
    bestForLevels: [3, 4, 5],
    signatureAdvice: 'In the cloud, we can leverage...',
    unlockLevel: 3,
  },
  'chen-zhang': {
    id: 'chen-zhang',
    name: 'Chen Zhang',
    title: 'Security Architect',
    specialization: 'Security patterns, compliance frameworks, and risk assessment',
    guidanceStyle: 'Methodical, focuses on threat modeling and defense in depth',
    bestForLevels: [4, 5, 6],
    signatureAdvice: 'From a security standpoint, we need to consider...',
    unlockLevel: 4,
  },
  'jordan-rivera': {
    id: 'jordan-rivera',
    name: 'Jordan Rivera',
    title: 'Startup CTO',
    specialization: 'MVP development, rapid scaling, and technical debt management',
    guidanceStyle: 'Pragmatic, focuses on trade-offs and speed-to-market',
    bestForLevels: [1, 2, 3, 4],
    signatureAdvice: "For an MVP, I'd recommend...",
    unlockLevel: 1,
  },
  'alex-kim': {
    id: 'alex-kim',
    name: 'Alex Kim',
    title: 'Enterprise Architect',
    specialization: 'Large-scale systems, integration patterns, and legacy modernization',
    guidanceStyle: 'Systematic, emphasizes standards and governance',
    bestForLevels: [5, 6, 7, 8],
    signatureAdvice: 'At enterprise scale, governance becomes critical...',
    unlockLevel: 5,
  },
  // Famous tech industry mentors
  'linus-torvalds': {
    id: 'linus-torvalds',
    name: 'Linus Torvalds',
    title: 'Kernel Commander | Open Source Revolutionary',
    specialization: 'Operating systems, open source development, and low-level programming',
    guidanceStyle: 'Direct, honest, and focused on practical solutions',
    bestForLevels: [3, 4, 5, 6],
    signatureAdvice: 'Talk is cheap. Show me the code.',
    unlockLevel: 3,
  },
  'jeff-dean': {
    id: 'jeff-dean',
    name: 'Jeff Dean',
    title: 'Architect of Scale | Google Brain Commander',
    specialization: 'Distributed systems, machine learning infrastructure, and massive scale',
    guidanceStyle: 'Methodical engineer who thinks at Google scale',
    bestForLevels: [4, 5, 6, 7],
    signatureAdvice: 'At scale, even the smallest optimizations matter...',
    unlockLevel: 4,
  },
  'grace-hopper': {
    id: 'grace-hopper',
    name: 'Grace Hopper',
    title: 'Admiral of Algorithms | Bug Slayer',
    specialization: 'Programming languages, debugging, and software engineering principles',
    guidanceStyle: 'Pioneering spirit with focus on making complex things simple',
    bestForLevels: [1, 2, 3, 4],
    signatureAdvice: "It's easier to ask forgiveness than permission.",
    unlockLevel: 1,
  },
  'werner-vogels': {
    id: 'werner-vogels',
    name: 'Werner Vogels',
    title: 'Cloud Architect Supreme | Amazon\'s CTO',
    specialization: 'Cloud architecture, distributed systems, and scalable web services',
    guidanceStyle: 'Evangelist for cloud-native thinking and eventual consistency',
    bestForLevels: [3, 4, 5, 6],
    signatureAdvice: 'Everything fails all the time...',
    unlockLevel: 3,
  },
  'martin-fowler': {
    id: 'martin-fowler',
    name: 'Martin Fowler',
    title: 'Refactoring Master | Pattern Whisperer',
    specialization: 'Software design patterns, refactoring, and enterprise architecture',
    guidanceStyle: 'Thoughtful architect who emphasizes code quality and maintainability',
    bestForLevels: [2, 3, 4, 5],
    signatureAdvice: 'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    unlockLevel: 2,
  },
};

export const getMentorById = (id: string): Mentor | undefined => MENTORS[id];

export const getMentorsForLevel = (level: number): Mentor[] => {
  return Object.values(MENTORS).filter(
    mentor => mentor.unlockLevel <= level && mentor.bestForLevels.includes(level)
  );
};

export const getAvailableMentors = (
  level: number,
  scenarioMentorIds?: string[]
): Mentor[] => {
  const levelMentors = getMentorsForLevel(level);
  
  if (scenarioMentorIds && scenarioMentorIds.length > 0) {
    return levelMentors.filter(mentor => scenarioMentorIds.includes(mentor.id));
  }
  
  return levelMentors;
};