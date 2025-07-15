import type { Meta, StoryObj } from '@storybook/react';
import { ImageComparison } from '../components/molecules/ImageComparison';

const meta: Meta<typeof ImageComparison> = {
  title: 'Molecules/ImageComparison',
  component: ImageComparison,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    initialPosition: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
    },
    disabled: {
      control: 'boolean',
    },
    showLabels: {
      control: 'boolean',
    },
    leftLabel: {
      control: 'text',
    },
    rightLabel: {
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    initialPosition: 50,
    showLabels: true,
    leftLabel: 'ProblemVille',
    rightLabel: 'DataWorld',
  },
};

export const StartAtProblem: Story = {
  args: {
    initialPosition: 80,
    showLabels: true,
    leftLabel: 'ProblemVille',
    rightLabel: 'DataWorld',
  },
};

export const StartAtSolution: Story = {
  args: {
    initialPosition: 20,
    showLabels: true,
    leftLabel: 'ProblemVille',
    rightLabel: 'DataWorld',
  },
};

export const NoLabels: Story = {
  args: {
    initialPosition: 50,
    showLabels: false,
  },
};

export const CustomLabels: Story = {
  args: {
    initialPosition: 50,
    showLabels: true,
    leftLabel: 'Before',
    rightLabel: 'After',
  },
};

export const Disabled: Story = {
  args: {
    initialPosition: 50,
    showLabels: true,
    leftLabel: 'ProblemVille',
    rightLabel: 'DataWorld',
    disabled: true,
  },
};

export const WithCallback: Story = {
  args: {
    initialPosition: 50,
    showLabels: true,
    leftLabel: 'ProblemVille',
    rightLabel: 'DataWorld',
    onPositionChange: (position) => {
      console.log(`Slider position: ${position}%`);
    },
  },
};