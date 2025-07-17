import type { ComponentData } from '../../molecules/ComponentCard/ComponentCard.types';

// High-level component type shown in drawer
export interface DrawerComponent {
  id: string;
  name: string;
  icon: string;
  color: string;
  shortDescription: string;
  category: string;
}

// Vendor offering of a component
export interface ComponentOffering {
  id: string;
  name: string;
  vendor: string;
  vendorIcon?: string;
  description: string;
  pricing: string;
  specs: {
    cpu?: string;
    memory?: string;
    storage?: string;
    bandwidth?: string;
    [key: string]: string | undefined;
  };
  initially_selectable: boolean;
  unlockConditions?: {
    mission?: string;
    concept?: string;
    level?: number;
  };
}

// Detailed view when component is expanded
export interface DetailedComponentView {
  component: DrawerComponent;
  
  sections: {
    overview: {
      description: string;
      concepts: string[];
      useCases: string[];
    };
    
    implementations: {
      cloud: ComponentOffering[];      // AWS, GCP, Azure
      selfHosted: ComponentOffering[];  // Kubernetes, Docker
      enthusiast: ComponentOffering[];  // Raspberry Pi, Old laptop
    };
    
    guidance: {
      whenToUse: string;
      alternatives: DrawerComponent[];
      nextSteps: string[];
    };
  };
}

// Selection rules result
export interface SelectionResult {
  allowed: boolean;
  message?: string;
  showAlternatives?: boolean;
  suggestedOfferings?: ComponentOffering[];
}

export interface CategoryData {
  id: string;
  name: string;
  icon: string;
}

export interface ComponentDrawerProps {
  components: DrawerComponent[];
  categories: CategoryData[];
  searchQuery: string;
  selectedComponent?: string;
  expandedComponent?: string;
  userProgress?: {
    completedMissions: string[];
    unlockedConcepts: string[];
    level: number;
  };
  onSearchChange: (query: string) => void;
  onComponentSelect?: (component: DrawerComponent) => void;
  onComponentExpand?: (component: DrawerComponent) => void;
  onOfferingDragStart?: (offering: ComponentOffering, component: DrawerComponent) => void;
  onOfferingDragEnd?: () => void;
  getDetailedView?: (componentId: string) => DetailedComponentView | null;
  checkSelectionRules?: (offering: ComponentOffering) => SelectionResult;
  className?: string;
}