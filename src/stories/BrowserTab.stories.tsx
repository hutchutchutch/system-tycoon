import type { Meta, StoryObj } from '@storybook/react';
import { BrowserTab } from '../components/atoms/BrowserTab';

const meta: Meta<typeof BrowserTab> = {
  title: 'Atoms/BrowserTab',
  component: BrowserTab,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Realistic browser tab component for the tech consultant simulator interface.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    active: { control: 'boolean' },
    loading: { control: 'boolean' },
    modified: { control: 'boolean' },
    showClose: { control: 'boolean' },
    onClick: { action: 'clicked' },
    onClose: { action: 'closed' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Email - Service as a Software',
    url: 'https://mail.systemtycoon.com/inbox',
    active: false,
  },
};

export const Active: Story = {
  args: {
    title: 'Dashboard - Service as a Software',
    url: 'https://dashboard.systemtycoon.com',
    active: true,
    favicon: '/api.png',
  },
};

export const Loading: Story = {
  args: {
    title: 'Client Meeting',
    url: 'https://meet.systemtycoon.com/sarah-chen',
    active: true,
    loading: true,
  },
};

export const Modified: Story = {
  args: {
    title: 'System Design Canvas',
    url: 'https://design.systemtycoon.com/project/bakery-fix',
    active: false,
    modified: true,
    favicon: '/database.png',
  },
};

export const LongTitle: Story = {
  args: {
    title: 'Sweet Rises Bakery - System Architecture Redesign Project',
    url: 'https://projects.systemtycoon.com/sweet-rises-bakery',
    active: false,
    favicon: '/compute.png',
  },
};

export const WithoutClose: Story = {
  args: {
    title: 'Financial Status',
    url: 'https://finance.systemtycoon.com/overview',
    active: false,
    showClose: false,
    favicon: '/cache.png',
  },
};

export const TabGroup: Story = {
  render: () => (
    <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb' }}>
      <BrowserTab
        title="Dashboard"
        url="https://dashboard.systemtycoon.com"
        active={true}
        favicon="/api.png"
      />
      <BrowserTab
        title="Email"
        url="https://mail.systemtycoon.com/inbox"
        active={false}
        favicon="/database.png"
      />
      <BrowserTab
        title="Video Call"
        url="https://meet.systemtycoon.com/sarah-chen"
        active={false}
        loading={true}
      />
      <BrowserTab
        title="System Design"
        url="https://design.systemtycoon.com/project/bakery"
        active={false}
        modified={true}
        favicon="/compute.png"
      />
    </div>
  ),
  parameters: {
    layout: 'fullwidth',
  },
}; 