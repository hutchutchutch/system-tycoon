import type { Meta, StoryObj } from '@storybook/react';
import { BrowserWindow } from '../components/organisms/BrowserWindow';
import type { BrowserWindowProps } from '../components/organisms/BrowserWindow';
import { EmailClient } from '../components/organisms/EmailClient';

const meta: Meta<typeof BrowserWindow> = {
  title: 'Organisms/BrowserWindow',
  component: BrowserWindow,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Main browser chrome containing all application interfaces.',
      },
    },
  },
  argTypes: {
    onTabChange: { action: 'tab-changed' },
    onTabClose: { action: 'tab-closed' },
    onNewTab: { action: 'new-tab' },
  },
};

export default meta;
type Story = StoryObj<typeof BrowserWindow>;

// Mock components for demonstration
const EmailComponent = () => <div style={{ padding: '20px', height: '400px', background: '#f8f9fa' }}>Email Client Content</div>;
const DashboardComponent = () => <div style={{ padding: '20px', height: '400px', background: '#e3f2fd' }}>Dashboard Content</div>;
const VideoCallComponent = () => <div style={{ padding: '20px', height: '400px', background: '#f3e5f5' }}>Video Call Content</div>;
const DesignCanvasComponent = () => <div style={{ padding: '20px', height: '400px', background: '#e8f5e8' }}>Design Canvas Content</div>;

const mockTabs = [
  {
    id: 'email',
    title: 'Inbox - TechConsultant',
    url: 'https://mail.techconsultant.com/inbox',
    component: EmailComponent,
  },
  {
    id: 'dashboard',
    title: 'Business Dashboard',
    url: 'https://dashboard.techconsultant.com',
    component: DashboardComponent,
  },
  {
    id: 'call',
    title: 'Video Call - Sarah Chen',
    url: 'https://meet.techconsultant.com/room/sarah-chen',
    component: VideoCallComponent,
    hasNotification: true,
  },
  {
    id: 'design',
    title: 'System Design Canvas',
    url: 'https://design.techconsultant.com/project/bakery',
    component: DesignCanvasComponent,
  },
];

const defaultArgs: Partial<BrowserWindowProps> = {
  tabs: mockTabs,
  activeTab: 'email',
};

export const Default: Story = {
  args: defaultArgs,
};

export const MultipleTabsWithNotifications: Story = {
  args: {
    ...defaultArgs,
    tabs: [
      ...mockTabs.slice(0, 2),
      {
        ...mockTabs[2],
        hasNotification: true,
      },
      mockTabs[3],
    ],
  },
};

export const SingleTab: Story = {
  args: {
    ...defaultArgs,
    tabs: [mockTabs[0]],
  },
};

export const ActiveVideoCall: Story = {
  args: {
    ...defaultArgs,
    activeTab: 'call',
  },
};

export const DesignCanvas: Story = {
  args: {
    ...defaultArgs,
    activeTab: 'design',
  },
};

export const WithManyTabs: Story = {
  args: {
    ...defaultArgs,
    tabs: [
      ...mockTabs,
      {
        id: 'docs',
        title: 'Documentation - React',
        url: 'https://reactjs.org/docs',
        component: () => <div style={{ padding: '20px' }}>React Documentation</div>,
      },
      {
        id: 'github',
        title: 'GitHub - My Repositories',
        url: 'https://github.com/username',
        component: () => <div style={{ padding: '20px' }}>GitHub Repository</div>,
      },
      {
        id: 'stackoverflow',
        title: 'Stack Overflow - Questions',
        url: 'https://stackoverflow.com',
        component: () => <div style={{ padding: '20px' }}>Stack Overflow</div>,
      },
    ],
  },
};

export const WithNewTabButton: Story = {
  args: {
    ...defaultArgs,
    onNewTab: () => console.log('New tab clicked'),
  },
}; 