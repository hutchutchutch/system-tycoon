# Service as a Software - Tech Consultant Simulator Design System

## 1. Introduction
This document provides comprehensive documentation for all components in Service as a Software - Tech Consultant Simulator, organized according to the Atomic Design methodology. The simulator creates a realistic browser-based experience where players navigate the journey from financial desperation to successful tech consulting through authentic digital tools.

### Design Principles
- **Modern Minimalism**: Clean, card-based interface with subtle shadows and professional aesthetics
- **Dark-First Design**: Primary dark theme with high contrast and accessible color ratios
- **Professional Authenticity**: Interface matches contemporary business software and AI tools
- **Clean Hierarchy**: Clear visual structure with consistent spacing and typography
- **Performance-Focused**: Optimized animations and minimal visual complexity
- **Accessibility**: WCAG 2.1 AA compliant with strong contrast ratios

### Visual Style Language
- **Cards**: Elevated surfaces with subtle shadows on dark backgrounds
- **Typography**: Clean, readable fonts with clear hierarchy
- **Colors**: Dark theme with strategic accent colors (green, blue)
- **Spacing**: Generous whitespace with consistent rhythm
- **Icons**: Simple, outlined icons with consistent stroke weights
- **Interactions**: Subtle hover states and smooth transitions

## 2. Design Token System

### Color Philosophy
The design system uses a dark-first approach with professional, high-contrast colors that evoke modern business intelligence and AI tools.

#### Primary Color Palette
- **Dark Surfaces**: Rich dark grays for backgrounds and cards
- **Accent Green**: Success states, positive metrics, AI indicators
- **Accent Blue**: Interactive elements, links, information
- **Text Hierarchy**: High-contrast whites and grays for readability
- **Subtle Accents**: Muted colors for secondary information

#### Color Usage Patterns
```css
/* Background Hierarchy */
--surface-primary: Dark main background
--surface-secondary: Card and panel backgrounds  
--surface-tertiary: Elevated elements (modals, dropdowns)
--surface-interactive: Hover and active states

/* Text Hierarchy */
--text-primary: High contrast main text
--text-secondary: Supporting text and labels
--text-tertiary: Subtle text and placeholders
--text-accent: Accent-colored text for emphasis

/* Functional Colors */
--accent-success: Green for positive states
--accent-info: Blue for informational elements
--accent-warning: Amber for caution states
--accent-error: Red for error states
```

### Typography Scale
Modern, readable typography with clear hierarchy suitable for professional business applications.

#### Font Selection
- **Primary**: System fonts (SF Pro Display, Segoe UI, Inter)
- **Monospace**: For code, metrics, and technical data
- **Weights**: Light (300), Regular (400), Medium (500), Semibold (600)

#### Scale & Hierarchy
```css
/* Display Text */
--text-display-large: 3.5rem/1.2
--text-display-medium: 2.5rem/1.3
--text-display-small: 2rem/1.4

/* Heading Text */
--text-heading-h1: 1.75rem/1.4
--text-heading-h2: 1.5rem/1.4
--text-heading-h3: 1.25rem/1.5
--text-heading-h4: 1.125rem/1.5

/* Body Text */
--text-body-large: 1.125rem/1.6
--text-body-medium: 1rem/1.6
--text-body-small: 0.875rem/1.5
--text-caption: 0.75rem/1.4
```

### Spacing System
Consistent spacing based on 8px grid system for clean alignment and visual rhythm.

#### Base Unit: 8px
```css
--space-1: 0.5rem   /* 8px */
--space-2: 1rem     /* 16px */
--space-3: 1.5rem   /* 24px */
--space-4: 2rem     /* 32px */
--space-6: 3rem     /* 48px */
--space-8: 4rem     /* 64px */
```

#### Component-Specific Spacing
```css
--card-padding: var(--space-3)
--section-gap: var(--space-6)
--element-gap: var(--space-2)
--tight-gap: var(--space-1)
```

### Elevation & Shadows
Subtle shadow system that creates depth without overwhelming the dark theme.

#### Shadow Hierarchy
```css
--shadow-card: Subtle card elevation
--shadow-modal: Modal and overlay elevation
--shadow-tooltip: Small floating elements
--shadow-focus: Interactive focus states
```

## 3. Component Architecture Updates

### Modern Card System
Replace glassmorphic effects with clean, elevated cards.

```typescript
// ModernCard.tsx
interface ModernCardProps {
  variant: 'default' | 'interactive' | 'elevated';
  padding?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
}

export const ModernCard: React.FC<ModernCardProps> = ({
  variant = 'default',
  padding = 'md',
  children,
  onClick,
}) => {
  return (
    <div
      className={clsx(
        'modern-card',
        `modern-card--${variant}`,
        `modern-card--padding-${padding}`,
        { 'modern-card--clickable': onClick }
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
```

### Updated Icon System
Clean, outlined icons with consistent stroke weights.

```typescript
// Icon.tsx - Updated for modern style
interface IconProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  weight?: 'light' | 'regular' | 'medium';
  color?: 'primary' | 'secondary' | 'accent' | 'success';
}
```

### Button System Updates
Modern button styling with clear hierarchy and professional appearance.

```typescript
// Button variants for modern design
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  style?: 'solid' | 'outline' | 'minimal';
}
```

## 4. Layout Patterns

### Grid System
Flexible grid system for consistent layouts.

```css
/* Layout Grid */
.layout-grid {
  display: grid;
  gap: var(--space-3);
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

.layout-grid--compact {
  gap: var(--space-2);
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
}
```

### Dashboard Layouts
Specific patterns for dashboard and business intelligence interfaces.

```css
/* Dashboard Card Grid */
.dashboard-grid {
  display: grid;
  gap: var(--space-3);
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
}

/* Metric Cards */
.metrics-grid {
  display: grid;
  gap: var(--space-2);
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}
```

## 5. Interactive States

### Hover & Focus
Subtle interaction feedback maintaining the professional aesthetic.

```css
/* Modern Hover States */
.interactive-element {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.interactive-element:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-elevated);
}

.interactive-element:focus {
  outline: 2px solid var(--color-accent-primary);
  outline-offset: 2px;
}
```

### Loading States
Clean, minimal loading indicators.

```css
/* Modern Loading Spinner */
.loading-spinner {
  border: 2px solid var(--color-surface-tertiary);
  border-top: 2px solid var(--color-accent-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
```

## 6. Responsive Design

### Breakpoint System
Mobile-first responsive design with clean breakpoints.

```css
/* Breakpoints */
--breakpoint-sm: 640px;
--breakpoint-md: 768px;
--breakpoint-lg: 1024px;
--breakpoint-xl: 1280px;
--breakpoint-2xl: 1536px;
```

### Component Responsiveness
Components adapt gracefully across screen sizes while maintaining the clean aesthetic.

## 7. Animation System

### Micro-Interactions
Subtle, professional animations that enhance UX without being distracting.

```css
/* Standard Transitions */
--transition-fast: 0.15s cubic-bezier(0.4, 0, 0.2, 1);
--transition-normal: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
--transition-slow: 0.5s cubic-bezier(0.4, 0, 0.2, 1);

/* Easing Functions */
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```

## 8. Accessibility Standards

### Color Contrast
All color combinations meet WCAG 2.1 AA standards with minimum 4.5:1 contrast ratios.

### Focus Management
Clear focus indicators and logical tab order throughout the interface.

### Screen Reader Support
Proper ARIA labels and semantic HTML structure for screen reader compatibility.

## 9. Implementation Guidelines

### CSS Module Structure
```
components/
├── atoms/
│   ├── ModernCard/
│   │   ├── ModernCard.tsx
│   │   ├── ModernCard.module.css
│   │   └── index.ts
├── molecules/
│   ├── MetricCard/
│   │   ├── MetricCard.tsx
│   │   ├── MetricCard.module.css
│   │   └── index.ts
```

### Design Token Usage
Always use design tokens instead of hardcoded values:

```css
/* Good */
.component {
  background: var(--color-surface-secondary);
  padding: var(--space-3);
  border-radius: var(--radius-md);
}

/* Avoid */
.component {
  background: #2d3340;
  padding: 24px;
  border-radius: 8px;
}
```

This modern design system creates a professional, clean interface suitable for business and AI applications while maintaining excellent usability and accessibility standards.