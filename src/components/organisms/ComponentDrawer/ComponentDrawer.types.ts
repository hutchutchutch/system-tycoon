import { ComponentData, ComponentCategory } from '../../molecules/ComponentCard';

export interface ComponentDrawerProps {
  components: ComponentData[];
  categories: ComponentCategory[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onComponentDragStart: (component: ComponentData) => void;
  onComponentDragEnd: () => void;
  className?: string;
}