import type { Meta, StoryObj } from '@storybook/react';
import { MetricCard } from '../components/molecules/MetricCard';

const meta: Meta<typeof MetricCard> = {
  title: 'Molecules/MetricCard',
  component: MetricCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    data: {
      control: 'object',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: {
      label: 'Response Time',
      value: 45.2,
      unit: 'ms',
      trend: 'stable',
      status: 'normal',
    },
    onHover: () => {},
  },
};

export const TrendingUp: Story = {
  args: {
    data: {
      label: 'Daily Active Users',
      value: 12450,
      unit: '',
      trend: 'up',
      trendValue: 12.5,
      status: 'normal',
    },
    onHover: () => {},
  },
};

export const TrendingDown: Story = {
  args: {
    data: {
      label: 'Error Rate',
      value: 2.1,
      unit: '%',
      trend: 'down',
      trendValue: -15.3,
      status: 'normal',
    },
    onHover: () => {},
  },
};

export const Warning: Story = {
  args: {
    data: {
      label: 'CPU Usage',
      value: 78.5,
      unit: '%',
      trend: 'up',
      trendValue: 8.2,
      status: 'warning',
      target: 100,
    },
    onHover: () => {},
  },
};

export const Critical: Story = {
  args: {
    data: {
      label: 'Memory Usage',
      value: 92.8,
      unit: '%',
      trend: 'up',
      trendValue: 25.1,
      status: 'critical',
      target: 100,
    },
    onHover: () => {},
  },
};

export const WithTarget: Story = {
  args: {
    data: {
      label: 'Revenue',
      value: 847500,
      unit: '$',
      trend: 'up',
      trendValue: 18.7,
      status: 'normal',
      target: 1000000,
    },
    onHover: () => {},
  },
};

export const LargeNumber: Story = {
  args: {
    data: {
      label: 'Total Requests',
      value: 2847392,
      unit: '',
      trend: 'up',
      trendValue: 5.2,
      status: 'normal',
    },
    onHover: () => {},
  },
};