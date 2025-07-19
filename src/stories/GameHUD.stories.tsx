import type { Meta, StoryObj } from '@storybook/react';
import { GameHUD } from '../components/organisms/GameHUD';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';

// Mock Redux store for Storybook
const mockStore = configureStore({
  reducer: {
    auth: (state = {
      profile: {
        username: 'john_doe',
        current_level: 5,
        reputation_score: 12750,
        career_title: 'Senior Developer',
      }
    }) => state,
  },
});

const meta: Meta<typeof GameHUD> = {
  title: 'Organisms/GameHUD',
  component: GameHUD,
  decorators: [
    (Story) => (
      <Provider store={mockStore}>
        <BrowserRouter>
          <Story />
        </BrowserRouter>
      </Provider>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const HighLevel: Story = {
  decorators: [
    (Story) => {
      const highLevelStore = configureStore({
        reducer: {
          auth: (state = {
            profile: {
              username: 'senior_architect',
              current_level: 12,
              reputation_score: 89500,
              career_title: 'Principal Engineer',
            }
          }) => state,
        },
      });
      
      return (
        <Provider store={highLevelStore}>
          <BrowserRouter>
            <Story />
          </BrowserRouter>
        </Provider>
      );
    },
  ],
  args: {},
};

export const Beginner: Story = {
  decorators: [
    (Story) => {
      const beginnerStore = configureStore({
        reducer: {
          auth: (state = {
            profile: {
              username: 'new_dev',
              current_level: 1,
              reputation_score: 150,
              career_title: 'Junior Developer',
            }
          }) => state,
        },
      });
      
      return (
        <Provider store={beginnerStore}>
          <BrowserRouter>
            <Story />
          </BrowserRouter>
        </Provider>
      );
    },
  ],
  args: {},
};

export const LongUsername: Story = {
  decorators: [
    (Story) => {
      const longUsernameStore = configureStore({
        reducer: {
          auth: (state = {
            profile: {
              username: 'very_long_username_that_might_overflow',
              current_level: 8,
              reputation_score: 45200,
              career_title: 'Tech Lead',
            }
          }) => state,
        },
      });
      
      return (
        <Provider store={longUsernameStore}>
          <BrowserRouter>
            <Story />
          </BrowserRouter>
        </Provider>
      );
    },
  ],
  args: {},
};

export const NoProfile: Story = {
  decorators: [
    (Story) => {
      const noProfileStore = configureStore({
        reducer: {
          auth: (state = { profile: null }) => state,
        },
      });
      
      return (
        <Provider store={noProfileStore}>
          <BrowserRouter>
            <Story />
          </BrowserRouter>
        </Provider>
      );
    },
  ],
  args: {},
};