import type { Meta, StoryObj } from '@storybook/react';
import { EmailClient } from '../components/organisms/EmailClient';
import type { EmailClientProps } from '../components/organisms/EmailClient';

const meta: Meta<typeof EmailClient> = {
  title: 'Organisms/EmailClient',
  component: EmailClient,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Complete email interface mimicking professional email clients.',
      },
    },
  },
  argTypes: {
    onEmailSelect: { action: 'email-selected' },
    onEmailToggleSelect: { action: 'email-toggle-selected' },
    onFolderSelect: { action: 'folder-selected' },
    onSearchChange: { action: 'search-changed' },
    onEmailCompose: { action: 'compose-clicked' },
    onEmailReply: { action: 'reply-clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof EmailClient>;

const mockEmails = [
  {
    id: '1',
    sender: {
      name: 'Sarah Chen',
      email: 'sarah@sweetbites.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    },
    subject: 'URGENT: Website completely down - losing customers!',
    preview: 'Hi there, I hope this email finds you well. Our bakery website has been down for the past 2 hours and we\'re losing online orders...',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    status: 'unread' as const,
    hasAttachments: false,
    priority: 'high' as const,
    tags: ['urgent', 'client'],
  },
  {
    id: '2',
    sender: {
      name: 'LinkedIn Notifications',
      email: 'notifications@linkedin.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=linkedin',
    },
    subject: 'Your profile was viewed by 12 people this week',
    preview: 'See who\'s been checking out your profile and grow your network...',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    status: 'read' as const,
    hasAttachments: false,
    priority: 'normal' as const,
    tags: ['notifications'],
  },
  {
    id: '3',
    sender: {
      name: 'Marcus Rodriguez',
      email: 'marcus@techstartup.io',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=marcus',
    },
    subject: 'Re: System architecture consultation proposal',
    preview: 'Thanks for the detailed proposal. We\'d like to schedule a call to discuss the microservices approach...',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    status: 'replied' as const,
    hasAttachments: true,
    priority: 'normal' as const,
    tags: ['consultation', 'follow-up'],
  },
  {
    id: '4',
    sender: {
      name: 'DevCon 2024',
      email: 'updates@devcon2024.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=devcon',
    },
    subject: 'Early bird tickets now available!',
    preview: 'Don\'t miss out on the biggest developer conference of the year. Get your tickets now...',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    status: 'read' as const,
    hasAttachments: false,
    priority: 'low' as const,
    tags: ['events', 'conference'],
  },
];

const mockFolders = [
  { id: 'inbox', name: 'Inbox', count: 4, icon: 'inbox' },
  { id: 'sent', name: 'Sent', count: 12, icon: 'send' },
  { id: 'drafts', name: 'Drafts', count: 2, icon: 'edit' },
  { id: 'archive', name: 'Archive', count: 156, icon: 'archive' },
  { id: 'trash', name: 'Trash', count: 8, icon: 'trash' },
];

const defaultArgs: Partial<EmailClientProps> = {
  emails: mockEmails,
  folders: mockFolders,
  selectedEmails: [],
  selectedFolder: 'inbox',
  searchQuery: '',
};

export const Default: Story = {
  args: defaultArgs,
};

export const WithSelectedEmails: Story = {
  args: {
    ...defaultArgs,
    selectedEmails: ['1', '3'],
  },
};

export const WithSearchQuery: Story = {
  args: {
    ...defaultArgs,
    searchQuery: 'urgent',
  },
};

export const EmptyInbox: Story = {
  args: {
    ...defaultArgs,
    emails: [],
  },
};

export const DraftsFolder: Story = {
  args: {
    ...defaultArgs,
    selectedFolder: 'drafts',
    emails: [
      {
        id: 'd1',
        sender: {
          name: 'Me',
          email: 'me@example.com',
        },
        subject: 'Draft: Proposal for E-commerce Platform',
        preview: 'Dear Mr. Johnson, I\'m writing to propose a comprehensive e-commerce solution...',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
        status: 'draft' as const,
        hasAttachments: true,
        priority: 'normal' as const,
      },
    ],
  },
}; 