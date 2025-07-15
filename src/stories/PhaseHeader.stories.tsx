import type { Meta, StoryObj } from '@storybook/react';
import { PhaseHeader } from '../components/molecules/PhaseHeader';
import { Button } from '../components/atoms/Button';

const meta: Meta<typeof PhaseHeader> = {
  title: 'Molecules/PhaseHeader',
  component: PhaseHeader,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'career-map', 'game-phase'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'System Design Challenge',
    subtitle: 'Design a scalable chat application',
    variant: 'default',
  },
};

export const WithSubtitle: Story = {
  args: {
    title: 'Phase 1: Requirements Analysis',
    subtitle: 'Understand the business requirements and technical constraints',
    variant: 'default',
  },
};

export const WithRightContent: Story = {
  args: {
    title: 'Architecture Design',
    subtitle: 'Create a high-level system architecture',
    variant: 'default',
    rightContent: (
      <div className="flex gap-2">
        <Button variant="outline" size="small">Save Draft</Button>
        <Button variant="primary" size="small">Continue</Button>
      </div>
    ),
  },
};

export const CareerMapVariant: Story = {
  args: {
    title: 'Career Journey',
    subtitle: 'Your path to becoming a system architect',
    variant: 'career-map',
    rightContent: (
      <div className="text-sm text-gray-600">
        Level 5 • Senior Developer
      </div>
    ),
  },
};

export const GamePhaseVariant: Story = {
  args: {
    title: 'Design Phase',
    subtitle: 'Time Remaining: 15:30',
    variant: 'game-phase',
    rightContent: (
      <div className="flex items-center gap-3">
        <div className="text-sm">
          <span className="text-gray-600">Score:</span>
          <span className="font-bold text-green-600 ml-1">850</span>
        </div>
        <Button variant="ghost" size="small">Pause</Button>
      </div>
    ),
  },
};

export const LongTitle: Story = {
  args: {
    title: 'Complex Multi-Tenant SaaS Platform Architecture with Microservices',
    subtitle: 'Design a system that handles multiple clients with isolated data and custom configurations while maintaining high availability and scalability',
    variant: 'default',
    rightContent: (
      <Button variant="primary" size="small">Get Help</Button>
    ),
  },
};

export const MinimalGamePhase: Story = {
  args: {
    title: 'Quick Challenge',
    variant: 'game-phase',
  },
};