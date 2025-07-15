import type { Meta, StoryObj } from '@storybook/react';
import { MetricsDashboard } from '../components/organisms/MetricsDashboard';

const meta: Meta<typeof MetricsDashboard> = {
  title: 'Organisms/MetricsDashboard',
  component: MetricsDashboard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: { type: 'select' },
      options: ['normal', 'warning', 'critical'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const sampleMetrics = [
  {
    label: 'CPU Usage',
    value: 45,
    unit: '%',
    trend: 'stable' as const,
    max: 100,
    status: 'normal' as const,
  },
  {
    label: 'Memory Usage',
    value: 2048,
    unit: 'MB',
    trend: 'up' as const,
    trendValue: '+5%',
    max: 8192,
    status: 'normal' as const,
  },
  {
    label: 'Active Users',
    value: 1250,
    trend: 'up' as const,
    trendValue: '+12%',
    status: 'normal' as const,
  },
  {
    label: 'Response Time',
    value: 89,
    unit: 'ms',
    trend: 'down' as const,
    trendValue: '-8%',
    max: 1000,
    status: 'normal' as const,
  },
];

export const Default: Story = {
  args: {
    title: 'System Metrics',
    metrics: sampleMetrics,
    status: 'normal',
  },
};

export const Warning: Story = {
  args: {
    title: 'System Performance',
    metrics: [
      {
        label: 'CPU Usage',
        value: 78,
        unit: '%',
        trend: 'up' as const,
        trendValue: '+15%',
        max: 100,
        status: 'warning' as const,
      },
      {
        label: 'Memory Usage',
        value: 6144,
        unit: 'MB',
        trend: 'up' as const,
        trendValue: '+25%',
        max: 8192,
        status: 'warning' as const,
      },
      {
        label: 'Error Rate',
        value: 15,
        unit: '%',
        trend: 'up' as const,
        trendValue: '+300%',
        max: 20,
        status: 'warning' as const,
      },
    ],
    status: 'warning',
  },
};

export const Critical: Story = {
  args: {
    title: 'System Alert',
    metrics: [
      {
        label: 'CPU Usage',
        value: 95,
        unit: '%',
        trend: 'up' as const,
        trendValue: '+40%',
        max: 100,
        status: 'critical' as const,
      },
      {
        label: 'Memory Usage',
        value: 7936,
        unit: 'MB',
        trend: 'up' as const,
        trendValue: '+50%',
        max: 8192,
        status: 'critical' as const,
      },
      {
        label: 'Response Time',
        value: 2500,
        unit: 'ms',
        trend: 'up' as const,
        trendValue: '+400%',
        max: 3000,
        status: 'critical' as const,
      },
    ],
    status: 'critical',
  },
};

export const DatabaseMetrics: Story = {
  args: {
    title: 'Database Performance',
    metrics: [
      {
        label: 'Query Time',
        value: 25,
        unit: 'ms',
        trend: 'stable' as const,
        max: 100,
        status: 'normal' as const,
      },
      {
        label: 'Connections',
        value: 145,
        trend: 'up' as const,
        trendValue: '+8%',
        max: 500,
        status: 'normal' as const,
      },
      {
        label: 'Cache Hit Rate',
        value: 94,
        unit: '%',
        trend: 'stable' as const,
        max: 100,
        status: 'normal' as const,
      },
      {
        label: 'Storage Used',
        value: 256,
        unit: 'GB',
        trend: 'up' as const,
        trendValue: '+2%',
        max: 1000,
        status: 'normal' as const,
      },
    ],
    status: 'normal',
  },
};

export const NetworkMetrics: Story = {
  args: {
    title: 'Network Statistics',
    metrics: [
      {
        label: 'Bandwidth Usage',
        value: 125,
        unit: 'Mbps',
        trend: 'up' as const,
        trendValue: '+18%',
        max: 1000,
        status: 'normal' as const,
      },
      {
        label: 'Packet Loss',
        value: 0.2,
        unit: '%',
        trend: 'down' as const,
        trendValue: '-50%',
        max: 5,
        status: 'normal' as const,
      },
      {
        label: 'Latency',
        value: 12,
        unit: 'ms',
        trend: 'stable' as const,
        max: 100,
        status: 'normal' as const,
      },
    ],
    status: 'normal',
  },
};

export const SingleMetric: Story = {
  args: {
    title: 'API Health',
    metrics: [
      {
        label: 'Uptime',
        value: 99.95,
        unit: '%',
        trend: 'stable' as const,
        max: 100,
        status: 'normal' as const,
      },
    ],
    status: 'normal',
  },
};