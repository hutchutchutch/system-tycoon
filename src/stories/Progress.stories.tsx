import type { Meta, StoryObj } from '@storybook/react';
import { Progress } from '../components/atoms/Progress';

const meta: Meta<typeof Progress> = {
  title: 'Atoms/Progress',
  component: Progress,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
    },
    max: {
      control: { type: 'number' },
    },
    variant: {
      control: { type: 'select' },
      options: ['primary', 'success', 'warning', 'destructive'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    showLabel: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 50,
  },
};

export const Primary: Story = {
  args: {
    value: 75,
    variant: 'primary',
  },
};

export const Success: Story = {
  args: {
    value: 100,
    variant: 'success',
  },
};

export const Warning: Story = {
  args: {
    value: 60,
    variant: 'warning',
  },
};

export const Destructive: Story = {
  args: {
    value: 25,
    variant: 'destructive',
  },
};

export const Small: Story = {
  args: {
    value: 45,
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    value: 80,
    size: 'lg',
  },
};

export const WithLabel: Story = {
  args: {
    value: 65,
    showLabel: true,
    label: '65% complete',
  },
};

export const CustomMax: Story = {
  args: {
    value: 150,
    max: 200,
    showLabel: true,
    label: '150 / 200 XP',
  },
};