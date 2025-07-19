// Molecules - Simple component groups with UI state

// Authentication components
export { AuthForm } from './AuthForm';
export type { AuthFormProps } from './AuthForm';

export { AvatarGroup } from './AvatarGroup';
export type { AvatarGroupProps } from './AvatarGroup';

// Email system components
export { EmailCard } from './EmailCard';
export type { EmailCardProps } from './EmailCard';

// Contact and client management
export { ContactAvatar } from './ContactAvatar';
export type { ContactAvatarProps, ContactSize, OnlineStatus } from './ContactAvatar';

export { HeroContextCard } from './HeroContextCard';
export type { HeroContextCardProps } from './HeroContextCard';

// export { ClientCard } from './ClientCard';
// export type { ClientCardProps } from './ClientCard';

// Browser interface components (removed - functionality moved to GameHUD)

// Communication components (TODO: Implement these)
// export { CallParticipant } from './CallParticipant';
// export type { CallParticipantProps } from './CallParticipant';

// Layout and grid components
export { BentoGrid, BentoCard } from './BentoGrid';
export type { BentoGridProps, BentoCardProps } from './BentoGrid';

// Business and design molecules (keep existing for now)
export { ComponentCard } from './ComponentCard';
export type { ComponentCardProps } from './ComponentCard';

export { ComponentDetailModal } from './ComponentDetailModal';
export type { ComponentDetail } from './ComponentDetailModal';

export { ImageComparison } from './ImageComparison';
export type { ImageComparisonProps } from './ImageComparison';

export { MentorCard } from './MentorCard';
export type { MentorCardProps } from './MentorCard';

export { MetricCard } from './MetricCard';
export type { MetricCardProps } from './MetricCard';

export { PhaseHeader } from './PhaseHeader';

export { ProblemCard } from './ProblemCard';
export type { ProblemCardProps } from './ProblemCard';
export type { PhaseHeaderProps } from './PhaseHeader';

export { QuestionCard } from './QuestionCard';
export type { QuestionCardProps } from './QuestionCard';

// Landing page molecules
export { MissionCard } from './MissionCard';
export { LearningTrackCard } from './LearningTrackCard';
export { PricingCard } from './PricingCard';
export { StatCounter } from './StatCounter';
export { CountdownTimer } from './CountdownTimer';
export { AnimatedCounter } from './AnimatedCounter';
export { SkillTree } from './SkillTree';
export { StepCard } from './StepCard';
export { EmailTabs, type EmailTab } from './EmailTabs';
export { EmailSidebar, type EmailFolder } from './EmailSidebar';
export { EmailToolbar } from './EmailToolbar';
export { Requirements } from './Requirements';
export { MultiConnectionLine } from './MultiConnectionLine';
export { MessageRecommendations } from './MessageRecommendations';
export { MentorChat } from './MentorChat';
export type { MentorChatProps, ChatMessage, MentorChatState } from './MentorChat';

// Onboarding components
export { MentorSelectionCard } from './MentorSelectionCard';
export type { MentorSelectionCardProps } from './MentorSelectionCard';

export { MentorDetailCard } from './MentorDetailCard';
export type { MentorDetailCardProps } from './MentorDetailCard';