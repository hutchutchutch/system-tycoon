import type { Meta, StoryObj } from '@storybook/react';
import { AchievementToast } from '../components/organisms/AchievementToast';

const meta: Meta<typeof AchievementToast> = {
  title: 'Organisms/AchievementToast',
  component: AchievementToast,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    icon: {
      control: 'text',
    },
    duration: {
      control: { type: 'number' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Achievement Unlocked!',
    description: 'You have successfully completed your first system design.',
    onClose: () => {},
    duration: 5000,
  },
};

export const CustomIcon: Story = {
  args: {
    title: 'Level Up!',
    description: 'Congratulations! You are now a Senior Developer.',
    icon: '🚀',
    onClose: () => {},
    duration: 5000,
  },
};

export const LongDescription: Story = {
  args: {
    title: 'Master Architect',
    description: 'You have demonstrated exceptional skill in designing scalable, high-performance systems that can handle millions of users.',
    icon: '🏗️',
    onClose: () => {},
    duration: 5000,
  },
};

export const QuickDismiss: Story = {
  args: {
    title: 'Quick Win',
    description: 'Small victory achieved!',
    icon: '⭐',
    onClose: () => {},
    duration: 2000,
  },
};

export const ErrorRecovery: Story = {
  args: {
    title: 'Recovery Expert',
    description: 'You successfully recovered from a critical system failure.',
    icon: '🛡️',
    onClose: () => {},
    duration: 5000,
  },
};

export const TeamWork: Story = {
  args: {
    title: 'Team Player',
    description: 'Your collaborative approach led to an outstanding project outcome.',
    icon: '🤝',
    onClose: () => {},
    duration: 5000,
  },
};

export const Innovation: Story = {
  args: {
    title: 'Innovation Award',
    description: 'Your creative solution has set a new standard for the team.',
    icon: '💡',
    onClose: () => {},
    duration: 5000,
  },
};