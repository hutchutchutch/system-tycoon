// Organisms - Complex components with business logic

// Browser simulation
export { BrowserWindow } from './BrowserWindow';
export type { BrowserWindowProps, BrowserTab } from './BrowserWindow';

// Email interface
export { EmailClient } from './EmailClient';
export type { EmailClientProps, EmailFolder } from './EmailClient';

// Communication systems (TODO: Implement these)
// export { VideoCallWindow } from './VideoCallWindow';
// export type { VideoCallWindowProps } from './VideoCallWindow';

// Business and client management (TODO: Implement these)
// export { ClientDashboard } from './ClientDashboard';
// export type { ClientDashboardProps } from './ClientDashboard';

// export { FinancialStatusWidget } from './FinancialStatusWidget';
// export type { FinancialStatusWidgetProps } from './FinancialStatusWidget';

// System design tools (TODO: Transform existing ComponentDrawer)
// export { SystemDesignToolbox } from './SystemDesignToolbox';
// export type { SystemDesignToolboxProps } from './SystemDesignToolbox';

// export { BusinessMetricsDashboard } from './BusinessMetricsDashboard';
// export type { BusinessMetricsDashboardProps } from './BusinessMetricsDashboard';

// Keep existing organisms temporarily
export { AchievementToast } from './AchievementToast';
export * from './CareerMap';
export { ComponentDrawer } from './ComponentDrawer';
export { GameHUD } from './GameHUD';
export { MetricsDashboard } from './MetricsDashboard';

// Landing page organisms
export { default as LandingHero } from './LandingHero/LandingHero';
export { default as CrisisAlert } from './CrisisAlert/CrisisAlert';
export { default as HowItWorks } from './HowItWorks/HowItWorks';
export { default as MissionShowcase } from './MissionShowcase/MissionShowcase';
export { default as FooterCTA } from './FooterCTA/FooterCTA';
export { MentorSelectionModal } from './MentorSelectionModal';
export type { MentorSelectionModalProps } from './MentorSelectionModal';
export { EmailComposer } from './EmailComposer';
export type { EmailComposerProps } from './EmailComposer';
// TODO: Implement remaining landing page components
// export { ImpactDashboard } from './ImpactDashboard';
// export { LearningPaths } from './LearningPaths';
// export { Partners } from './Partners';
// export { CollaborationFeature } from './CollaborationFeature';
// export { Certification } from './Certification';
// export { Pricing } from './Pricing';