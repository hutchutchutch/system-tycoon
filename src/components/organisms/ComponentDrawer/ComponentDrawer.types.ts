import type { ComponentData } from '../../molecules/ComponentCard/ComponentCard.types';

export interface CategoryData {
  id: string;
  name: string;
  icon: string;
}

export interface ComponentDrawerProps {
  components: ComponentData[];
  categories: CategoryData[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onComponentDragStart: (component: ComponentData) => void;
  onComponentDragEnd: () => void;
  className?: string;
}