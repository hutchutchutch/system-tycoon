import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardHeader, CardBody, CardFooter } from '../components/atoms/Card';
import { Button } from '../components/atoms/Button';

const meta: Meta<typeof Card> = {
  title: 'Atoms/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    interactive: {
      control: 'boolean',
    },
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

export const Default: Story = {
  args: {
    children: (
      <div className="p-4">
        <h3 className="text-lg font-semibold">Card Title</h3>
        <p className="text-gray-600">This is a basic card with some content.</p>
      </div>
    ),
  },
};

export const Interactive: Story = {
  args: {
    interactive: true,
    children: (
      <div className="p-4">
        <h3 className="text-lg font-semibold">Interactive Card</h3>
        <p className="text-gray-600">This card has hover and focus states.</p>
      </div>
    ),
  },
};

export const Selected: Story = {
  args: {
    interactive: true,
    selected: true,
    children: (
      <div className="p-4">
        <h3 className="text-lg font-semibold">Selected Card</h3>
        <p className="text-gray-600">This card is currently selected.</p>
      </div>
    ),
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: (
      <div className="p-4">
        <h3 className="text-lg font-semibold">Disabled Card</h3>
        <p className="text-gray-600">This card is disabled.</p>
      </div>
    ),
  },
};

export const WithStructure: Story = {
  args: {
    children: (
      <>
        <CardHeader>
          <h3 className="text-lg font-semibold">Structured Card</h3>
        </CardHeader>
        <CardBody>
          <p className="text-gray-600">
            This card uses CardHeader, CardBody, and CardFooter components for proper structure.
          </p>
        </CardBody>
        <CardFooter>
          <div className="flex gap-2">
            <Button variant="primary" size="small">Accept</Button>
            <Button variant="outline" size="small">Cancel</Button>
          </div>
        </CardFooter>
      </>
    ),
  },
};