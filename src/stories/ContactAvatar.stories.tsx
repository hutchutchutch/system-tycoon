import type { Meta, StoryObj } from '@storybook/react';
import { ContactAvatar } from '../components/molecules/ContactAvatar';

const meta: Meta<typeof ContactAvatar> = {
  title: 'Molecules/ContactAvatar',
  component: ContactAvatar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Contact avatar with fallback initials and online status indicators for professional communication.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    status: {
      control: 'select',
      options: ['online', 'away', 'busy', 'offline'],
    },
    showStatus: { control: 'boolean' },
    clickable: { control: 'boolean' },
    onClick: { action: 'clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: 'Sarah Chen',
    size: 'md',
  },
};

export const WithImage: Story = {
  args: {
    name: 'John Thompson',
    src: '/api.png', // Using a placeholder from public folder
    size: 'md',
  },
};

export const WithStatus: Story = {
  args: {
    name: 'Sarah Chen',
    size: 'md',
    status: 'online',
    showStatus: true,
  },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <ContactAvatar name="Sarah Chen" size="xs" />
      <ContactAvatar name="Sarah Chen" size="sm" />
      <ContactAvatar name="Sarah Chen" size="md" />
      <ContactAvatar name="Sarah Chen" size="lg" />
      <ContactAvatar name="Sarah Chen" size="xl" />
    </div>
  ),
};

export const AllStatuses: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <ContactAvatar name="Sarah Chen" status="online" showStatus />
        <div style={{ marginTop: '8px', fontSize: '12px' }}>Online</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <ContactAvatar name="John Doe" status="away" showStatus />
        <div style={{ marginTop: '8px', fontSize: '12px' }}>Away</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <ContactAvatar name="Mike Smith" status="busy" showStatus />
        <div style={{ marginTop: '8px', fontSize: '12px' }}>Busy</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <ContactAvatar name="Emma Wilson" status="offline" showStatus />
        <div style={{ marginTop: '8px', fontSize: '12px' }}>Offline</div>
      </div>
    </div>
  ),
};

export const BusinessContacts: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
      <ContactAvatar name="Sarah Chen" size="lg" status="online" showStatus clickable />
      <ContactAvatar name="Tech Mentor" size="lg" status="away" showStatus clickable />
      <ContactAvatar name="Client Services" size="lg" status="busy" showStatus clickable />
      <ContactAvatar name="System Admin" size="lg" status="offline" showStatus clickable />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example showing how ContactAvatar would be used in the consultant simulator for business contacts.',
      },
    },
  },
}; 