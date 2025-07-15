import type { Meta, StoryObj } from '@storybook/react';
import { NotificationDot } from '../components/atoms/NotificationDot';

const meta: Meta<typeof NotificationDot> = {
  title: 'Atoms/NotificationDot',
  component: NotificationDot,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Notification indicator with count display and various visual states.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    count: { control: 'number' },
    max: { control: 'number' },
    variant: {
      control: 'select',
      options: ['primary', 'danger', 'warning', 'success', 'info'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    showWhenZero: { control: 'boolean' },
    pulse: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    count: 3,
    variant: 'primary',
    size: 'md',
  },
};

export const SimpleIndicator: Story = {
  args: {
    count: 0,
    variant: 'danger',
    showWhenZero: true,
  },
};

export const HighCount: Story = {
  args: {
    count: 150,
    max: 99,
    variant: 'primary',
  },
};

export const Pulsing: Story = {
  args: {
    count: 5,
    variant: 'danger',
    pulse: true,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <NotificationDot count={1} variant="primary" />
      <NotificationDot count={2} variant="danger" />
      <NotificationDot count={3} variant="warning" />
      <NotificationDot count={4} variant="success" />
      <NotificationDot count={5} variant="info" />
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <NotificationDot count={3} size="sm" variant="primary" />
      <NotificationDot count={3} size="md" variant="primary" />
      <NotificationDot count={3} size="lg" variant="primary" />
    </div>
  ),
};

export const EmailUnreadExample: Story = {
  render: () => (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <div style={{ 
        width: '40px', 
        height: '40px', 
        background: '#f3f4f6', 
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px'
      }}>
        📧
      </div>
      <div style={{ position: 'absolute', top: '-4px', right: '-4px' }}>
        <NotificationDot count={12} variant="danger" size="sm" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example of how NotificationDot would be used with an email icon.',
      },
    },
  },
}; 