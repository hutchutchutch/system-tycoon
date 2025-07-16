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
  data: ComponentData;
  variant?: 'drawer' | 'canvas';
  status?: 'healthy' | 'stressed' | 'overloaded' | 'offline';
  isDragging?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
  onDragStart?: (event: React.DragEvent<HTMLDivElement>, component: ComponentData) => void;
  onDragEnd?: () => void;
  className?: string;
}