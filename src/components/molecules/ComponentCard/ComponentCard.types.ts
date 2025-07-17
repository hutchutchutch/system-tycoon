import type { DrawerComponent } from '../../organisms/ComponentDrawer/ComponentDrawer.types';

export type ComponentType = 'server' | 'database' | 'cache' | 'loadbalancer' | 'api' | 'cdn' | 'queue' | 'storage';
export type ComponentCategory = 'compute' | 'storage' | 'networking' | 'security' | 'operations';

export interface ComponentData {
  id: string;
  name: string;
  type: ComponentType;
  category: ComponentCategory;
  cost: number;
  capacity: number;
  description: string;
  locked?: boolean;
  icon?: string;
}

export interface ComponentCardProps {
  // Old data prop for backward compatibility
  data?: ComponentData;
  // New drawer component prop for the updated drawer view
  drawerComponent?: DrawerComponent;
  variant?: 'drawer' | 'canvas';
  status?: 'healthy' | 'stressed' | 'overloaded' | 'offline';
  isDragging?: boolean;
  isSelected?: boolean;
  isExpanded?: boolean;
  onClick?: () => void;
  onDragStart?: (event: React.DragEvent<HTMLDivElement>, component: ComponentData | DrawerComponent) => void;
  onDragEnd?: () => void;
  className?: string;
}