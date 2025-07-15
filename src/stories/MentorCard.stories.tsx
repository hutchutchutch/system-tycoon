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
    disabled: {
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
  tags: ['System Design', 'Distributed Systems', 'Performance'],
  tagline: 'Scale with confidence',
  quote: 'Always consider scalability from day one. Design for failure and monitor everything.',
  signature: {
    legacy: 'Built the foundation for Google\'s search infrastructure',
    knownFor: 'Designing systems that handle billions of requests',
  },
  personality: {
    style: 'Methodical and thorough',
    traits: 'Patient, detail-oriented, pragmatic',
  },
  specialty: {
    tools: ['Kubernetes', 'Go', 'PostgreSQL', 'Redis'],
    domains: ['Distributed Systems', 'Performance Optimization', 'Cloud Architecture'],
  },
  lore: 'Sarah started as a junior developer and worked her way up through the ranks at Google, eventually becoming the architect behind their search infrastructure.',
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

export const Disabled: Story = {
  args: {
    mentor: {
      ...sampleMentor,
      id: '2',
      name: 'Alex Rodriguez',
      title: 'CTO at Meta',
      tags: ['Leadership', 'Architecture', 'Strategy'],
      tagline: 'Lead with vision',
      quote: 'Focus on building team culture alongside technical excellence.',
      signature: {
        legacy: 'Transformed Meta\'s infrastructure team',
        knownFor: 'Building high-performing engineering teams',
      },
      personality: {
        style: 'Visionary and collaborative',
        traits: 'Inspiring, strategic, empathetic',
      },
      specialty: {
        tools: ['React', 'GraphQL', 'Docker', 'AWS'],
        domains: ['Team Leadership', 'System Architecture', 'Product Strategy'],
      },
      lore: 'Alex joined Meta as an individual contributor and rose through the ranks to become CTO, known for transforming engineering culture.',
    },
    selected: false,
    disabled: true,
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
      tags: ['Frontend', 'React', 'TypeScript'],
      tagline: 'Code with clarity',
      quote: 'Start with clean code fundamentals. The rest will follow naturally.',
      signature: {
        legacy: 'Mentored 50+ junior developers',
        knownFor: 'Writing elegant, maintainable code',
      },
      personality: {
        style: 'Supportive and encouraging',
        traits: 'Patient, clear communicator, perfectionist',
      },
      specialty: {
        tools: ['React', 'TypeScript', 'Node.js', 'Jest'],
        domains: ['Frontend Development', 'Code Quality', 'Mentoring'],
      },
      lore: 'Jamie is known for taking complex problems and breaking them down into simple, elegant solutions that anyone can understand.',
    },
    selected: false,
    onSelect: () => {},
  },
};