import type { ComponentData, ComponentCategory } from '../../molecules/ComponentCard/ComponentCard.types';

export interface ComponentDrawerProps {
  components: ComponentData[];
  categories: ComponentCategory[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onComponentDragStart: (component: ComponentData) => void;
  onComponentDragEnd: () => void;
  className?: string;
}