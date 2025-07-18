// Organisms - Complex components with business logic

// Browser simulation
export { BrowserWindow } from './BrowserWindow';
export type { BrowserWindowProps, BrowserTab } from './BrowserWindow';

// Email interface
export { EmailClient } from './EmailClient';
export type { EmailClientProps, EmailFolder } from './EmailClient';

// Authentication interface
export { AuthCard } from './AuthCard';
export type { AuthCardProps } from './AuthCard';

export { AuthPromoBanner } from './AuthPromoBanner';
export type { AuthPromoBannerProps } from './AuthPromoBanner';

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
export { ProductTour } from './ProductTour';
export type { ProductTourProps, TourStep } from './ProductTour';
export { SystemDesignCanvas } from './SystemDesignCanvas';
export type { SystemDesignCanvasProps } from './SystemDesignCanvas';
export { CollaborationPanel } from './CollaborationPanel';
export type { CollaborationPanelProps } from './CollaborationPanel';
export { CursorManager } from './CursorManager';
export type { CursorManagerProps } from './CursorManager';

// News and content organisms
export { BentoGrid } from '../molecules/BentoGrid';
export type { BentoGridProps } from '../molecules/BentoGrid';

// Game-specific organisms
export { default as CrisisAlert } from './CrisisAlert/CrisisAlert';
export { default as MissionShowcase } from './MissionShowcase/MissionShowcase';
export { MentorSelectionModal } from './MentorSelectionModal';
export type { MentorSelectionModalProps } from './MentorSelectionModal';
export { EmailComposer } from './EmailComposer';
export type { EmailComposerProps } from './EmailComposer';
// TODO: Implement remaining game components
// export { ImpactDashboard } from './ImpactDashboard';
// export { LearningPaths } from './LearningPaths';
// export { CollaborationFeature } from './CollaborationFeature';
// export { Certification } from './Certification';