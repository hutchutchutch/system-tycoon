# Storybook Stories

This directory contains Storybook stories for all components following the atomic design pattern.

## Structure

### Atoms (4 stories)
- **Button.stories.tsx** - Various button variants, sizes, and states
- **Badge.stories.tsx** - Different badge styles and sizes with icons
- **Card.stories.tsx** - Basic cards with interactive states and structured layouts
- **Progress.stories.tsx** - Progress bars with variants, sizes, and custom targets

### Molecules (6 stories)
- **QuestionCard.stories.tsx** - Question cards for different categories (technical, business, strategy)
- **MentorCard.stories.tsx** - Mentor profile cards with specializations and availability states
- **MetricCard.stories.tsx** - Animated metric cards with trends and status indicators
- **CharacterPortrait.stories.tsx** - Character avatars with availability states and badges
- **ComponentCard.stories.tsx** - System component cards for drawer and canvas variants
- **PhaseHeader.stories.tsx** - Page headers with different variants and right content

### Organisms (4 stories)
- **AchievementToast.stories.tsx** - Toast notifications for achievements with various icons
- **GameHUD.stories.tsx** - Game heads-up display with user info and stats (includes Redux mocking)
- **MetricsDashboard.stories.tsx** - System metrics dashboard with different status levels
- **ComponentDrawer.stories.tsx** - Collapsible component drawer with search and categories

## Features

- **Complete Coverage**: All atomic design components have comprehensive stories
- **Interactive Controls**: Storybook controls for all component props
- **Multiple Variants**: Different states, sizes, and use cases for each component
- **Mock Data**: Realistic sample data for complex components
- **Redux Integration**: GameHUD includes mock Redux store for testing
- **Accessibility**: ARIA labels and proper semantic markup
- **Documentation**: Auto-generated docs with argTypes and descriptions

## Usage

These stories serve as:
1. **Component Documentation** - Visual reference for all available components
2. **Development Tool** - Isolated component development and testing
3. **Design System** - Consistent component usage across the application
4. **Testing Reference** - Examples of different component states and configurations

## Manual Installation Note

These stories were created manually due to Storybook dependency conflicts with Vite 7.0.4. When the dependency issues are resolved, a full Storybook installation can be completed to run these stories in the Storybook UI.

## Total Files: 14 story files + 1 index file + this README