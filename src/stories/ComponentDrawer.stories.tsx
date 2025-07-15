import type { Meta, StoryObj } from '@storybook/react';
import { ComponentDrawer } from '../components/organisms/ComponentDrawer';
import { useState } from 'react';

const meta: Meta<typeof ComponentDrawer> = {
  title: 'Organisms/ComponentDrawer',
  component: ComponentDrawer,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const sampleCategories = [
  { id: 'compute', name: 'Compute', icon: 'server' },
  { id: 'storage', name: 'Storage', icon: 'database' },
  { id: 'networking', name: 'Networking', icon: 'network' },
  { id: 'security', name: 'Security', icon: 'shield' },
];

const sampleComponents = [
  {
    id: 'web-server',
    name: 'Web Server',
    type: 'server' as const,
    category: 'compute' as const,
    cost: 150,
    capacity: 1000,
    description: 'High-performance web server for handling HTTP requests',
    icon: 'server',
  },
  {
    id: 'load-balancer',
    name: 'Load Balancer',
    type: 'loadbalancer' as const,
    category: 'networking' as const,
    cost: 300,
    capacity: 5000,
    description: 'Distributes incoming requests across multiple servers',
    icon: 'loadbalancer',
  },
  {
    id: 'database',
    name: 'PostgreSQL Database',
    type: 'database' as const,
    category: 'storage' as const,
    cost: 200,
    capacity: 500,
    description: 'Reliable relational database for data persistence',
    icon: 'database',
  },
  {
    id: 'redis-cache',
    name: 'Redis Cache',
    type: 'cache' as const,
    category: 'storage' as const,
    cost: 100,
    capacity: 10000,
    description: 'In-memory data structure store for caching',
    icon: 'cache',
  },
  {
    id: 'api-gateway',
    name: 'API Gateway',
    type: 'api' as const,
    category: 'networking' as const,
    cost: 250,
    capacity: 2000,
    description: 'Manages API requests and provides authentication',
    icon: 'api',
  },
  {
    id: 'cdn',
    name: 'Content Delivery Network',
    type: 'cdn' as const,
    category: 'networking' as const,
    cost: 180,
    capacity: 50000,
    description: 'Global network for fast content delivery',
    icon: 'cdn',
  },
  {
    id: 'premium-server',
    name: 'Premium Server',
    type: 'server' as const,
    category: 'compute' as const,
    cost: 500,
    capacity: 5000,
    description: 'High-end server with premium features',
    icon: 'server',
    locked: true,
  },
];

// Component wrapper to handle state
const ComponentDrawerWrapper = (args: any) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <ComponentDrawer
      {...args}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
    />
  );
};

export const Default: Story = {
  render: ComponentDrawerWrapper,
  args: {
    components: sampleComponents,
    categories: sampleCategories,
    onComponentDragStart: () => {},
    onComponentDragEnd: () => {},
  },
};

export const WithSearch: Story = {
  render: (args) => {
    const [searchQuery, setSearchQuery] = useState('server');
    
    return (
      <ComponentDrawer
        {...args}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
    );
  },
  args: {
    components: sampleComponents,
    categories: sampleCategories,
    onComponentDragStart: () => {},
    onComponentDragEnd: () => {},
  },
};

export const EmptyState: Story = {
  render: ComponentDrawerWrapper,
  args: {
    components: [],
    categories: sampleCategories,
    onComponentDragStart: () => {},
    onComponentDragEnd: () => {},
  },
};

export const SingleCategory: Story = {
  render: ComponentDrawerWrapper,
  args: {
    components: sampleComponents.filter(c => c.category === 'compute'),
    categories: [{ id: 'compute', name: 'Compute', icon: 'server' }],
    onComponentDragStart: () => {},
    onComponentDragEnd: () => {},
  },
};

export const ManyComponents: Story = {
  render: ComponentDrawerWrapper,
  args: {
    components: [
      ...sampleComponents,
      ...Array.from({ length: 15 }, (_, i) => ({
        id: `component-${i}`,
        name: `Component ${i + 1}`,
        type: 'server' as const,
        category: 'compute' as const,
        cost: 100 + i * 10,
        capacity: 500 + i * 100,
        description: `Description for component ${i + 1}`,
        icon: 'server',
      })),
    ],
    categories: sampleCategories,
    onComponentDragStart: () => {},
    onComponentDragEnd: () => {},
  },
};

export const FilteredResults: Story = {
  render: (args) => {
    const [searchQuery, setSearchQuery] = useState('database');
    
    return (
      <ComponentDrawer
        {...args}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
    );
  },
  args: {
    components: sampleComponents,
    categories: sampleCategories,
    onComponentDragStart: () => {},
    onComponentDragEnd: () => {},
  },
};