import type { Meta, StoryObj } from '@storybook/react';
import { EmailCard } from '../components/molecules/EmailCard';
import type { EmailData } from '../components/molecules/EmailCard';

const meta: Meta<typeof EmailCard> = {
  title: 'Molecules/EmailCard',
  component: EmailCard,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Professional email card component for the tech consultant simulator inbox interface.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    selected: { control: 'boolean' },
    compact: { control: 'boolean' },
    onClick: { action: 'clicked' },
    onStatusChange: { action: 'status-changed' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Sample email data
const sarahEmail: EmailData = {
  id: '1',
  sender: {
    name: 'Sarah Chen',
    email: 'sarah@sweetrisesbakery.com',
    avatar: '/database.png',
  },
  subject: 'Website Down - Need Help ASAP!',
  preview: 'Hi! My bakery website has been down since this morning and I\'m losing customers. The error message says something about database connection failed. Can you help me fix this?',
  timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  status: 'unread',
  priority: 'high',
  hasAttachments: true,
  tags: ['urgent', 'client'],
};

const mentorEmail: EmailData = {
  id: '2',
  sender: {
    name: 'Tech Mentor',
    email: 'mentor@techconsulting.com',
  },
  subject: 'Welcome to Tech Consulting!',
  preview: 'Congratulations on starting your consulting journey! Here are some tips to help you succeed with your first clients...',
  timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
  status: 'read',
  priority: 'normal',
  tags: ['welcome', 'tips'],
};

const invoiceEmail: EmailData = {
  id: '3',
  sender: {
    name: 'Payment System',
    email: 'noreply@payments.com',
  },
  subject: 'Payment Received - $500.00',
  preview: 'Thank you! Payment of $500.00 has been received for Invoice #001 - Sweet Rises Bakery Website Fix.',
  timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
  status: 'unread',
  priority: 'normal',
  tags: ['payment', 'success'],
};

export const UnreadUrgent: Story = {
  args: {
    email: sarahEmail,
  },
};

export const ReadNormal: Story = {
  args: {
    email: mentorEmail,
  },
};

export const Selected: Story = {
  args: {
    email: sarahEmail,
    selected: true,
  },
};

export const Compact: Story = {
  args: {
    email: mentorEmail,
    compact: true,
  },
};

export const PaymentReceived: Story = {
  args: {
    email: invoiceEmail,
  },
};

export const EmailInbox: Story = {
  render: () => (
    <div style={{ width: '600px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <EmailCard email={sarahEmail} selected={true} />
      <EmailCard email={invoiceEmail} />
      <EmailCard email={mentorEmail} />
    </div>
  ),
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        story: 'Example showing how EmailCard would be used in the consultant simulator inbox.',
      },
    },
  },
}; 