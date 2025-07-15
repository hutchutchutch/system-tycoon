import type { Meta, StoryObj } from '@storybook/react';
import { CharacterPortrait } from '../components/molecules/CharacterPortrait';

const meta: Meta<typeof CharacterPortrait> = {
  title: 'Molecules/CharacterPortrait',
  component: CharacterPortrait,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
    isAvailable: {
      control: 'boolean',
    },
    badge: {
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: 'Alex Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    isAvailable: false,
    size: 'medium',
    onClick: () => {},
  },
};

export const Available: Story = {
  args: {
    name: 'Sarah Johnson',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    isAvailable: true,
    size: 'medium',
    onClick: () => {},
  },
};

export const Small: Story = {
  args: {
    name: 'Mike Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    isAvailable: true,
    size: 'small',
    onClick: () => {},
  },
};

export const Large: Story = {
  args: {
    name: 'Emily Davis',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    isAvailable: true,
    size: 'large',
    onClick: () => {},
  },
};

export const WithBadge: Story = {
  args: {
    name: 'David Kim',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    isAvailable: true,
    badge: '3',
    size: 'medium',
    onClick: () => {},
  },
};

export const WithTextBadge: Story = {
  args: {
    name: 'Lisa Wong',
    avatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150&h=150&fit=crop&crop=face',
    isAvailable: true,
    badge: 'NEW',
    size: 'medium',
    onClick: () => {},
  },
};

export const UnavailableWithBadge: Story = {
  args: {
    name: 'Tom Wilson',
    avatar: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face',
    isAvailable: false,
    badge: '!',
    size: 'medium',
    onClick: () => {},
  },
};