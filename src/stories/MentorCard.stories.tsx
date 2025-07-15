import type { Meta, StoryObj } from '@storybook/react';
import { MentorCard } from '../components/molecules/MentorCard';

const meta: Meta<typeof MentorCard> = {
  title: 'Molecules/MentorCard',
  component: MentorCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    selected: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const sampleMentor = {
  id: '1',
  name: 'Sarah Chen',
  title: 'Principal Engineer at Google',
  avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
  specializations: ['System Design', 'Distributed Systems', 'Performance'],
  advicePreview: 'Always consider scalability from day one. Design for failure and monitor everything.',
  levelRange: 'Mid to Senior',
  isRecommended: true,
  isLocked: false,
};

export const Default: Story = {
  args: {
    mentor: sampleMentor,
    selected: false,
    onSelect: () => {},
  },
};

export const Selected: Story = {
  args: {
    mentor: sampleMentor,
    selected: true,
    onSelect: () => {},
  },
};

export const Recommended: Story = {
  args: {
    mentor: {
      ...sampleMentor,
      isRecommended: true,
    },
    selected: false,
    onSelect: () => {},
  },
};

export const Locked: Story = {
  args: {
    mentor: {
      ...sampleMentor,
      id: '2',
      name: 'Alex Rodriguez',
      title: 'CTO at Meta',
      specializations: ['Leadership', 'Architecture', 'Strategy'],
      advicePreview: 'Focus on building team culture alongside technical excellence.',
      levelRange: 'Senior to Executive',
      isRecommended: false,
      isLocked: true,
    },
    selected: false,
    onSelect: () => {},
  },
};

export const JuniorMentor: Story = {
  args: {
    mentor: {
      ...sampleMentor,
      id: '3',
      name: 'Jamie Park',
      title: 'Senior Developer at Stripe',
      specializations: ['Frontend', 'React', 'TypeScript'],
      advicePreview: 'Start with clean code fundamentals. The rest will follow naturally.',
      levelRange: 'Entry to Mid',
      isRecommended: false,
      isLocked: false,
    },
    selected: false,
    onSelect: () => {},
  },
};