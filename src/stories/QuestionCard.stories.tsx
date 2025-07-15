import type { Meta, StoryObj } from '@storybook/react';
import { QuestionCard } from '../components/molecules/QuestionCard';

const meta: Meta<typeof QuestionCard> = {
  title: 'Molecules/QuestionCard',
  component: QuestionCard,
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

const sampleQuestion = {
  id: '1',
  text: 'What database technology would you recommend for this high-traffic application?',
  speaker: 'Client',
  response: 'I would recommend using a distributed database like MongoDB or PostgreSQL with read replicas.',
  category: 'technical' as const,
  impact: [
    { type: 'requirements' as const, value: 2 },
    { type: 'budget' as const, value: -1 },
  ],
};

export const Default: Story = {
  args: {
    question: sampleQuestion,
    selected: false,
    onSelect: () => {},
  },
};

export const Selected: Story = {
  args: {
    question: sampleQuestion,
    selected: true,
    onSelect: () => {},
  },
};

export const BusinessQuestion: Story = {
  args: {
    question: {
      ...sampleQuestion,
      id: '2',
      text: 'What is your timeline for this project?',
      response: 'Based on the scope, I estimate 3-4 months for full delivery.',
      category: 'business' as const,
      impact: [
        { type: 'timeline' as const, value: 1 },
        { type: 'budget' as const, value: 0 },
      ],
    },
    selected: false,
    onSelect: () => {},
  },
};

export const StrategyQuestion: Story = {
  args: {
    question: {
      ...sampleQuestion,
      id: '3',
      text: 'How would you approach the system architecture?',
      response: 'I would design a microservices architecture with API gateways and load balancers.',
      category: 'strategy' as const,
      impact: [
        { type: 'requirements' as const, value: 3 },
        { type: 'complexity' as const, value: 2 },
      ],
    },
    selected: false,
    onSelect: () => {},
  },
};