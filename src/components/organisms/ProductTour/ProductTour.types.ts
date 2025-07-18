export interface TourStep {
  id: string;
  title: string;
  content: string;
  target: string; // CSS selector for the element to highlight
  position: 'top' | 'bottom' | 'left' | 'right';
  mentorMessage: string;
}

export interface ProductTourProps {
  isActive: boolean;
  onComplete: () => void;
  className?: string;
} 