import type { Meta, StoryObj } from '@storybook/react';
import { EmailStatus } from '../components/atoms/EmailStatus';

const meta: Meta<typeof EmailStatus> = {
  title: 'Atoms/EmailStatus',
  component: EmailStatus,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Email status indicator showing read/unread, replied, forwarded, and draft states.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'select',
      options: ['unread', 'read', 'replied', 'forwarded', 'draft'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    showLabel: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Unread: Story = {
  args: {
    status: 'unread',
    size: 'md',
  },
};

export const Read: Story = {
  args: {
    status: 'read',
    size: 'md',
  },
};

export const Replied: Story = {
  args: {
    status: 'replied',
    size: 'md',
  },
};

export const Forwarded: Story = {
  args: {
    status: 'forwarded',
    size: 'md',
  },
};

export const Draft: Story = {
  args: {
    status: 'draft',
    size: 'md',
  },
};

export const WithLabel: Story = {
  args: {
    status: 'unread',
    size: 'md',
    showLabel: true,
  },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <EmailStatus status="unread" size="sm" showLabel />
      <EmailStatus status="unread" size="md" showLabel />
      <EmailStatus status="unread" size="lg" showLabel />
    </div>
  ),
};

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      <EmailStatus status="unread" showLabel />
      <EmailStatus status="read" showLabel />
      <EmailStatus status="replied" showLabel />
      <EmailStatus status="forwarded" showLabel />
      <EmailStatus status="draft" showLabel />
    </div>
  ),
}; 