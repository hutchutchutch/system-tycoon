import type { Meta, StoryObj } from '@storybook/react';
import { ComponentCard } from '../components/molecules/ComponentCard';

const meta: Meta<typeof ComponentCard> = {
  title: 'Molecules/ComponentCard',
  component: ComponentCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['drawer', 'canvas'],
    },
    status: {
      control: { type: 'select' },
      options: ['healthy', 'stressed', 'overloaded', 'offline'],
    },
    isDragging: {
      control: 'boolean',
    },
    isSelected: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const sampleComponent = {
  id: 'web-server-1',
  name: 'Web Server',
  type: 'server' as const,
  category: 'compute' as const,
  cost: 150,
  capacity: 1000,
  description: 'High-performance web server for handling HTTP requests',
  icon: 'server',
};

export const DrawerVariant: Story = {
  args: {
    data: sampleComponent,
    variant: 'drawer',
    status: 'healthy',
    isDragging: false,
    isSelected: false,
    onSelect: () => {},
  },
};

export const CanvasVariant: Story = {
  args: {
    data: sampleComponent,
    variant: 'canvas',
    status: 'healthy',
    isDragging: false,
    isSelected: false,
    onSelect: () => {},
  },
};

export const Selected: Story = {
  args: {
    data: sampleComponent,
    variant: 'canvas',
    status: 'healthy',
    isDragging: false,
    isSelected: true,
    onSelect: () => {},
  },
};

export const Stressed: Story = {
  args: {
    data: sampleComponent,
    variant: 'canvas',
    status: 'stressed',
    isDragging: false,
    isSelected: false,
    onSelect: () => {},
  },
};

export const Overloaded: Story = {
  args: {
    data: sampleComponent,
    variant: 'canvas',
    status: 'overloaded',
    isDragging: false,
    isSelected: false,
    onSelect: () => {},
  },
};

export const Offline: Story = {
  args: {
    data: sampleComponent,
    variant: 'canvas',
    status: 'offline',
    isDragging: false,
    isSelected: false,
    onSelect: () => {},
  },
};

export const Locked: Story = {
  args: {
    data: {
      ...sampleComponent,
      locked: true,
      name: 'Premium Load Balancer',
      type: 'loadbalancer' as const,
      cost: 500,
    },
    variant: 'drawer',
    status: 'healthy',
    isDragging: false,
    isSelected: false,
    onSelect: () => {},
  },
};

export const Database: Story = {
  args: {
    data: {
      id: 'database-1',
      name: 'PostgreSQL Database',
      type: 'database' as const,
      category: 'storage' as const,
      cost: 200,
      capacity: 500,
      description: 'Reliable relational database for data persistence',
      icon: 'database',
    },
    variant: 'drawer',
    status: 'healthy',
    isDragging: false,
    isSelected: false,
    onSelect: () => {},
  },
};

export const Dragging: Story = {
  args: {
    data: sampleComponent,
    variant: 'drawer',
    status: 'healthy',
    isDragging: true,
    isSelected: false,
    onSelect: () => {},
  },
};