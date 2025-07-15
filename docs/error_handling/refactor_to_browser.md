<file_map>
/Users/hutch/Documents/projects/gauntlet/p5/system-tycoon
└── src
    ├── components
    │   ├── atoms
    │   │   ├── Badge
    │   │   │   ├── Badge.tsx
    │   │   │   └── index.ts
    │   │   ├── Button
    │   │   │   ├── Button.test.tsx
    │   │   │   ├── Button.tsx
    │   │   │   ├── Button.types.ts
    │   │   │   └── index.ts
    │   │   ├── Card
    │   │   │   ├── Card.tsx
    │   │   │   └── index.ts
    │   │   ├── Icon
    │   │   │   ├── Icon.tsx
    │   │   │   ├── Icon.types.ts
    │   │   │   └── index.ts
    │   │   ├── Input
    │   │   │   ├── index.ts
    │   │   │   ├── Input.tsx
    │   │   │   └── Input.types.ts
    │   │   ├── Progress
    │   │   │   ├── index.ts
    │   │   │   └── Progress.tsx
    │   │   └── index.ts
    │   ├── common
    │   │   └── ProtectedRoute.tsx
    │   ├── layout
    │   │   ├── AuthLayout.tsx
    │   │   ├── GameLayout.tsx
    │   │   └── RootLayout.tsx
    │   ├── molecules
    │   │   ├── CharacterPortrait
    │   │   │   ├── CharacterPortrait.tsx
    │   │   │   └── index.ts
    │   │   ├── ComponentCard
    │   │   │   ├── ComponentCard.tsx
    │   │   │   ├── ComponentCard.types.ts
    │   │   │   └── index.ts
    │   │   ├── ImageComparison
    │   │   │   ├── ImageComparison.tsx
    │   │   │   ├── ImageComparison.types.ts
    │   │   │   ├── index.ts
    │   │   │   └── README.md
    │   │   ├── MentorCard
    │   │   │   ├── index.ts
    │   │   │   └── MentorCard.tsx
    │   │   ├── MetricCard
    │   │   │   ├── index.ts
    │   │   │   ├── MetricCard.tsx
    │   │   │   └── MetricCard.types.ts
    │   │   ├── PhaseHeader
    │   │   │   ├── index.ts
    │   │   │   └── PhaseHeader.tsx
    │   │   ├── QuestionCard
    │   │   │   ├── index.ts
    │   │   │   ├── QuestionCard.tsx
    │   │   │   └── QuestionCard.types.ts
    │   │   └── index.ts
    │   ├── organisms
    │   │   ├── AchievementToast
    │   │   │   ├── AchievementToast.tsx
    │   │   │   └── index.ts
    │   │   ├── CareerMap
    │   │   │   ├── CareerMap.tsx
    │   │   │   ├── index.ts
    │   │   │   └── MentorSelectionScene.tsx
    │   │   ├── ComponentDrawer
    │   │   │   ├── ComponentDrawer.tsx
    │   │   │   ├── ComponentDrawer.types.ts
    │   │   │   └── index.ts
    │   │   ├── GameHUD
    │   │   │   ├── GameHUD.tsx
    │   │   │   └── index.ts
    │   │   ├── MeetingRoom
    │   │   │   └── MeetingRoom.types.ts
    │   │   ├── MetricsDashboard
    │   │   │   ├── index.ts
    │   │   │   └── MetricsDashboard.tsx
    │   │   └── index.ts
    │   ├── pages
    │   │   ├── BattlePage
    │   │   │   ├── BattlePage.tsx
    │   │   │   └── index.ts
    │   │   ├── DesignPage
    │   │   │   ├── DesignPage.tsx
    │   │   │   └── index.ts
    │   │   ├── GamePage
    │   │   │   ├── GamePage.tsx
    │   │   │   └── index.ts
    │   │   ├── MainMenuPage
    │   │   │   ├── index.ts
    │   │   │   └── MainMenuPage.tsx
    │   │   ├── MeetingPage
    │   │   │   ├── index.ts
    │   │   │   └── MeetingPage.tsx
    │   │   └── index.ts
    │   ├── templates
    │   │   ├── BattleTemplate
    │   │   │   ├── BattleTemplate.tsx
    │   │   │   └── index.ts
    │   │   ├── DesignPhaseTemplate
    │   │   │   ├── DesignPhaseTemplate.tsx
    │   │   │   └── index.ts
    │   │   ├── HudTemplate
    │   │   │   ├── HudTemplate.tsx
    │   │   │   └── index.ts
    │   │   ├── MapTemplate
    │   │   │   ├── index.ts
    │   │   │   └── MapTemplate.tsx
    │   │   ├── MeetingPhaseTemplate
    │   │   │   ├── index.ts
    │   │   │   └── MeetingPhaseTemplate.tsx
    │   │   ├── MenuTemplate
    │   │   │   ├── index.ts
    │   │   │   └── MenuTemplate.tsx
    │   │   └── index.ts
    │   └── index.ts
    ├── constants
    │   ├── index.ts
    │   └── mentors.ts
    ├── contexts
    │   └── ThemeContext.tsx
    ├── features
    │   ├── auth
    │   │   └── authSlice.ts
    │   ├── game
    │   │   └── gameSlice.ts
    │   └── user
    │       └── userSlice.ts
    ├── hooks
    │   └── redux.ts
    ├── router
    │   └── index.tsx
    ├── screens
    │   ├── auth
    │   │   ├── SignInPage.tsx
    │   │   └── SignUpPage.tsx
    │   ├── game
    │   │   ├── CareerMapScreen.tsx
    │   │   ├── MeetingRoomScreen.tsx
    │   │   ├── MentorSelectionScreen.tsx
    │   │   ├── ResultsScreen.tsx
    │   │   ├── SimulationScreen.tsx
    │   │   └── SystemDesignCanvas.tsx
    │   └── LandingPage.tsx
    ├── services
    │   └── supabase.ts
    ├── store
    │   └── index.ts
    ├── stories
    │   ├── AchievementToast.stories.tsx
    │   ├── Badge.stories.tsx
    │   ├── Button.stories.tsx
    │   ├── Card.stories.tsx
    │   ├── CharacterPortrait.stories.tsx
    │   ├── ComponentCard.stories.tsx
    │   ├── ComponentDrawer.stories.tsx
    │   ├── GameHUD.stories.tsx
    │   ├── ImageComparison.stories.tsx
    │   ├── index.ts
    │   ├── MentorCard.stories.tsx
    │   ├── MetricCard.stories.tsx
    │   ├── MetricsDashboard.stories.tsx
    │   ├── PhaseHeader.stories.tsx
    │   ├── Progress.stories.tsx
    │   ├── QuestionCard.stories.tsx
    │   └── README.md
    ├── styles
    │   └── design-system
    │       ├── auth-pages.css
    │       ├── career-map.css
    │       ├── components.css
    │       ├── game-components.css
    │       ├── index.css
    │       ├── landing-page.css
    │       ├── react-flow-components.css
    │       ├── tokens.css
    │       └── ui-components.css
    ├── types
    │   └── index.ts
    ├── App.tsx
    ├── index.css
    ├── main.tsx
    └── vite-env.d.ts

</file_map>

<file_contents>
File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/components/atoms/Badge/Badge.tsx
```tsx
import React from 'react';
import { clsx } from 'clsx';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'destructive' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

/**
 * Badge - Atom component for status indicators and labels
 * 
 * Redux State Usage:
 * - Often displays values from state.game.player.level
 * - Shows achievement counts from state.game.achievements
 * - Indicates component rarity from state.game.inventory[].rarity
 * - Displays notification counts from state.ui.notifications.length
 */
export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'md',
  icon,
  className,
  children,
  ...props
}) => {
  const classes = clsx(
    'badge',
    `badge--${variant}`,
    `badge--${size}`,
    className
  );

  return (
    <span className={classes} {...props}>
      {icon && <span className="badge__icon">{icon}</span>}
      {children}
    </span>
  );
};
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/components/atoms/Badge/index.ts
```ts
export { Badge } from './Badge';
export type { BadgeProps } from './Badge';
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/components/atoms/Button/Button.test.tsx
```tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when loading', () => {
    render(<Button loading>Loading...</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('applies correct variant classes', () => {
    const { rerender } = render(<Button variant="primary">Button</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn--primary');
    
    rerender(<Button variant="danger">Button</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn--danger');
  });

  it('renders icon in correct position', () => {
    const icon = <span data-testid="icon">🚀</span>;
    
    const { rerender } = render(
      <Button icon={icon} iconPosition="left">Text</Button>
    );
    const button = screen.getByRole('button');
    expect(button.firstElementChild).toHaveClass('btn__icon');
    
    rerender(<Button icon={icon} iconPosition="right">Text</Button>);
    expect(button.lastElementChild).toHaveClass('btn__icon');
  });
});
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/components/atoms/Button/Button.tsx
```tsx
import React from 'react';
import { clsx } from 'clsx';
import type { ButtonProps } from './Button.types';

/**
 * Button Component
 * 
 * Purpose: Primary interactive element for user actions throughout the game
 * 
 * State Management:
 * - Stateless component - all behavior controlled via props
 * - No local state or Redux connections
 * - Parent components handle onClick events and loading states
 * 
 * @example
 * <Button variant="primary" onClick={handleAction}>Start Game</Button>
 */

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  disabled,
  children,
  className,
  ...props
}) => {
  const classes = clsx(
    'btn',
    `btn--${variant}`,
    size !== 'medium' && `btn--${size}`,
    loading && 'btn--loading',
    fullWidth && 'w-full',
    className
  );

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {icon && iconPosition === 'left' && !loading && (
        <span className="btn__icon">{icon}</span>
      )}
      {children}
      {icon && iconPosition === 'right' && !loading && (
        <span className="btn__icon">{icon}</span>
      )}
    </button>
  );
};
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/components/atoms/Button/Button.types.ts
```ts
import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large' | 'icon-only';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/components/atoms/Button/index.ts
```ts
export { Button } from './Button';
export type { ButtonProps } from './Button.types';
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/components/atoms/Card/Card.tsx
```tsx
import React from 'react';
import { clsx } from 'clsx';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
  selected?: boolean;
  disabled?: boolean;
}

/**
 * Card - Atom component for content containers
 * 
 * Redux State Usage:
 * - Often wraps content that displays state.game.player data
 * - Used in inventory to show state.game.inventory items
 * - Displays state.game.achievements in achievement lists
 * - Shows state.battle.actions in battle UI
 */
export const Card: React.FC<CardProps> = ({
  interactive = false,
  selected = false,
  disabled = false,
  className,
  children,
  ...props
}) => {
  const classes = clsx(
    'card',
    interactive && 'card--interactive',
    selected && 'card--selected',
    disabled && 'card--disabled',
    className
  );

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardHeader: React.FC<CardHeaderProps> = ({ className, children, ...props }) => {
  return (
    <div className={clsx('card__header', className)} {...props}>
      {children}
    </div>
  );
};

export interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardBody: React.FC<CardBodyProps> = ({ className, children, ...props }) => {
  return (
    <div className={clsx('card__body', className)} {...props}>
      {children}
    </div>
  );
};

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardFooter: React.FC<CardFooterProps> = ({ className, children, ...props }) => {
  return (
    <div className={clsx('card__footer', className)} {...props}>
      {children}
    </div>
  );
};
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/components/atoms/Card/index.ts
```ts
export { Card, CardHeader, CardBody, CardFooter } from './Card';
export type { CardProps, CardHeaderProps, CardBodyProps, CardFooterProps } from './Card';
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/components/atoms/Icon/Icon.tsx
```tsx
import React from 'react';
import * as LucideIcons from 'lucide-react';
import { clsx } from 'clsx';
import type { IconProps } from './Icon.types';

const iconSizes = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
};

// Map icon names to Lucide components
const iconMap: Record<string, React.ComponentType<any>> = {
  'server': LucideIcons.Server,
  'database': LucideIcons.Database,
  'globe': LucideIcons.Globe,
  'shield': LucideIcons.Shield,
  'activity': LucideIcons.Activity,
  'arrow-right': LucideIcons.ArrowRight,
  'arrow-left': LucideIcons.ArrowLeft,
  'check': LucideIcons.Check,
  'x': LucideIcons.X,
  'plus': LucideIcons.Plus,
  'minus': LucideIcons.Minus,
  'lock': LucideIcons.Lock,
  'unlock': LucideIcons.Unlock,
  'user': LucideIcons.User,
  'users': LucideIcons.Users,
  'settings': LucideIcons.Settings,
  'play': LucideIcons.Play,
  'pause': LucideIcons.Pause,
  'stop': LucideIcons.Square,
  'refresh': LucideIcons.RefreshCw,
  'download': LucideIcons.Download,
  'upload': LucideIcons.Upload,
  'maximize': LucideIcons.Maximize,
  'minimize': LucideIcons.Minimize,
  'zoom-in': LucideIcons.ZoomIn,
  'zoom-out': LucideIcons.ZoomOut,
  'edit': LucideIcons.Edit,
  'trash': LucideIcons.Trash2,
  'save': LucideIcons.Save,
  'search': LucideIcons.Search,
  'filter': LucideIcons.Filter,
  'chevron-up': LucideIcons.ChevronUp,
  'chevron-down': LucideIcons.ChevronDown,
  'chevron-left': LucideIcons.ChevronLeft,
  'chevron-right': LucideIcons.ChevronRight,
  'menu': LucideIcons.Menu,
  'grid': LucideIcons.Grid,
  'list': LucideIcons.List,
  'alert-circle': LucideIcons.AlertCircle,
  'info': LucideIcons.Info,
  'help-circle': LucideIcons.HelpCircle,
  'star': LucideIcons.Star,
  'heart': LucideIcons.Heart,
  'clock': LucideIcons.Clock,
  'calendar': LucideIcons.Calendar,
  'mail': LucideIcons.Mail,
  'message-circle': LucideIcons.MessageCircle,
  'bell': LucideIcons.Bell,
  'volume': LucideIcons.Volume2,
  'volume-x': LucideIcons.VolumeX,
  'wifi': LucideIcons.Wifi,
  'wifi-off': LucideIcons.WifiOff,
  'battery': LucideIcons.Battery,
  'battery-low': LucideIcons.BatteryLow,
  'cpu': LucideIcons.Cpu,
  'hard-drive': LucideIcons.HardDrive,
  'monitor': LucideIcons.Monitor,
  'smartphone': LucideIcons.Smartphone,
  'cloud': LucideIcons.Cloud,
  'cloud-off': LucideIcons.CloudOff,
  'link': LucideIcons.Link,
  'link-off': LucideIcons.Link2Off,
  'external-link': LucideIcons.ExternalLink,
  'trending-up': LucideIcons.TrendingUp,
  'trending-down': LucideIcons.TrendingDown,
  'bar-chart': LucideIcons.BarChart,
  'pie-chart': LucideIcons.PieChart,
  'terminal': LucideIcons.Terminal,
  'code': LucideIcons.Code,
  'git-branch': LucideIcons.GitBranch,
  'git-commit': LucideIcons.GitCommit,
  'git-merge': LucideIcons.GitMerge,
  'git-pull-request': LucideIcons.GitPullRequest,
  'package': LucideIcons.Package,
  'layers': LucideIcons.Layers,
  'sliders': LucideIcons.Sliders,
  'toggle-left': LucideIcons.ToggleLeft,
  'toggle-right': LucideIcons.ToggleRight,
  'loader': LucideIcons.Loader2,
};

export const Icon: React.FC<IconProps> = ({
  name,
  size = 'md',
  color = 'currentColor',
  className,
  'aria-label': ariaLabel,
}) => {
  const IconComponent = iconMap[name];
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return (
    <IconComponent
      size={iconSizes[size]}
      color={color}
      className={clsx('icon', `icon--${size}`, className)}
      aria-label={ariaLabel}
      aria-hidden={!ariaLabel}
    />
  );
};
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/components/atoms/Icon/Icon.types.ts
```ts
export type IconName = 
  | 'server' 
  | 'database' 
  | 'globe' 
  | 'shield' 
  | 'activity'
  | 'arrow-right'
  | 'arrow-left'
  | 'check'
  | 'x'
  | 'plus'
  | 'minus'
  | 'lock'
  | 'unlock'
  | 'user'
  | 'users'
  | 'settings'
  | 'play'
  | 'pause'
  | 'stop'
  | 'refresh'
  | 'download'
  | 'upload'
  | 'maximize'
  | 'minimize'
  | 'zoom-in'
  | 'zoom-out'
  | 'edit'
  | 'trash'
  | 'save'
  | 'search'
  | 'filter'
  | 'chevron-up'
  | 'chevron-down'
  | 'chevron-left'
  | 'chevron-right'
  | 'menu'
  | 'grid'
  | 'list'
  | 'alert-circle'
  | 'info'
  | 'help-circle'
  | 'star'
  | 'heart'
  | 'clock'
  | 'calendar'
  | 'mail'
  | 'message-circle'
  | 'bell'
  | 'volume'
  | 'volume-x'
  | 'wifi'
  | 'wifi-off'
  | 'battery'
  | 'battery-low'
  | 'cpu'
  | 'hard-drive'
  | 'monitor'
  | 'smartphone'
  | 'cloud'
  | 'cloud-off'
  | 'link'
  | 'link-off'
  | 'external-link'
  | 'trending-up'
  | 'trending-down'
  | 'bar-chart'
  | 'pie-chart'
  | 'terminal'
  | 'code'
  | 'git-branch'
  | 'git-commit'
  | 'git-merge'
  | 'git-pull-request'
  | 'package'
  | 'layers'
  | 'sliders'
  | 'toggle-left'
  | 'toggle-right'
  | 'loader';

export interface IconProps {
  name: IconName;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  className?: string;
  'aria-label'?: string;
}
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/components/atoms/Icon/index.ts
```ts
export { Icon } from './Icon';
export type { IconProps, IconName } from './Icon.types';
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/components/atoms/Input/index.ts
```ts
export { Input } from './Input';
export type { InputProps } from './Input.types';
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/components/atoms/Input/Input.tsx
```tsx
import React, { useCallback } from 'react';
import { clsx } from 'clsx';
import type { InputProps } from './Input.types';

export const Input: React.FC<InputProps> = ({
  type = 'text',
  value,
  onChange,
  placeholder,
  disabled = false,
  error = false,
  errorMessage,
  leftIcon,
  rightIcon,
  size = 'medium',
  fullWidth = false,
  className,
  'aria-label': ariaLabel,
  'data-testid': dataTestId,
  ...props
}) => {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  }, [onChange]);

  return (
    <div className={clsx('input-wrapper', { 'w-full': fullWidth })}>
      <div className={clsx(
        'input-container',
        `input-container--${size}`,
        {
          'input-container--error': error,
          'input-container--disabled': disabled,
          'input-container--with-left-icon': leftIcon,
          'input-container--with-right-icon': rightIcon,
        }
      )}>
        {leftIcon && (
          <span className="input__icon input__icon--left" aria-hidden="true">
            {leftIcon}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          className={clsx(
            'input',
            `input--${size}`,
            {
              'input--error': error,
              'input--with-left-icon': leftIcon,
              'input--with-right-icon': rightIcon,
            },
            className
          )}
          aria-label={ariaLabel}
          aria-invalid={error}
          aria-describedby={errorMessage ? `${dataTestId}-error` : undefined}
          data-testid={dataTestId}
          {...props}
        />
        {rightIcon && (
          <span className="input__icon input__icon--right" aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </div>
      {errorMessage && (
        <span 
          id={`${dataTestId}-error`}
          className="input__error-message"
          role="alert"
        >
          {errorMessage}
        </span>
      )}
    </div>
  );
};
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/components/atoms/Input/Input.types.ts
```ts
import React from 'react';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange'> {
  type?: 'text' | 'email' | 'password' | 'search' | 'number' | 'tel' | 'url';
  value: string;
  onChange: (value: string) => void;
  size?: 'small' | 'medium' | 'large';
  error?: boolean;
  errorMessage?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/components/atoms/Progress/index.ts
```ts
export { Progress } from './Progress';
export type { ProgressProps } from './Progress';
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/components/atoms/Progress/Progress.tsx
```tsx
import React from 'react';
import { clsx } from 'clsx';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  variant?: 'primary' | 'success' | 'warning' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: string;
}

/**
 * Progress - Atom component for progress indicators
 * 
 * Redux State Usage:
 * - Displays state.game.player.experience progress
 * - Shows state.game.player.health/maxHealth
 * - Indicates state.battle.turnTimer countdown
 * - Tracks state.game.questProgress percentage
 * - Shows state.ui.loadingProgress for async operations
 */
export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  variant = 'primary',
  size = 'md',
  showLabel = false,
  label,
  className,
  ...props
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const classes = clsx(
    'progress',
    `progress--${size}`,
    variant !== 'primary' && `progress--${variant}`,
    className
  );

  return (
    <div className={classes} {...props}>
      <div
        className="progress__bar"
        style={{ width: `${percentage}%` }}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      />
      {showLabel && (
        <span className="sr-only">
          {label || `${percentage.toFixed(0)}%`}
        </span>
      )}
    </div>
  );
};
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/components/atoms/index.ts
```ts
// Atoms - Stateless building blocks
export { Button } from './Button';
export type { ButtonProps } from './Button';

export { Badge } from './Badge';
export type { BadgeProps } from './Badge';

export { Card, CardHeader, CardBody, CardFooter } from './Card';
export type { CardProps, CardHeaderProps, CardBodyProps, CardFooterProps } from './Card';

export { Progress } from './Progress';
export type { ProgressProps } from './Progress';

export { Icon } from './Icon';
export type { IconProps, IconName } from './Icon';

export { Input } from './Input';
export type { InputProps } from './Input';
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/components/common/ProtectedRoute.tsx
```tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks/redux';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const isLoading = useAppSelector((state) => state.auth.isLoading);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/signin" replace />;
  }

  return <>{children}</>;
};
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/components/layout/AuthLayout.tsx
```tsx
import React from 'react';
import { Outlet, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../hooks/redux';
import { Button } from '../atoms/Button';

export const AuthLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  // If already authenticated, redirect to career map
  if (isAuthenticated) {
    return <Navigate to="/career" replace />;
  }

  const isSignIn = location.pathname === '/auth/signin';
  const isSignUp = location.pathname === '/auth/signup';

  return (
    <div className="auth-layout">
      {/* Navigation */}
      <nav className="auth-layout__nav">
        <div className="auth-layout__nav-container">
          <button 
            className="auth-layout__logo"
            onClick={() => navigate('/')}
          >
            System Design Tycoon
          </button>
          <div className="auth-layout__nav-actions">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="auth-layout__nav-button"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Auth Container */}
      <div className="auth-layout__container">
        <div className="auth-layout__content">
          {/* Auth Form Container */}
          <div className="auth-layout__form-container">
            {/* Tab Navigation */}
            <div className="auth-layout__tabs">
              <button
                className={`auth-layout__tab ${isSignIn ? 'auth-layout__tab--active' : ''}`}
                onClick={() => navigate('/auth/signin')}
              >
                Sign In
              </button>
              <button
                className={`auth-layout__tab ${isSignUp ? 'auth-layout__tab--active' : ''}`}
                onClick={() => navigate('/auth/signup')}
              >
                Sign Up
              </button>
            </div>

            {/* Form Content */}
            <div className="auth-layout__form-content">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/components/layout/GameLayout.tsx
```tsx
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { GameHUD } from '../organisms/GameHUD';

export const GameLayout: React.FC = () => {
  const location = useLocation();
  
  // Hide GameHUD on career and design pages since they have their own integrated HUD
  const shouldShowGameHUD = !location.pathname.startsWith('/career') && 
                           !location.pathname.startsWith('/design');

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {shouldShowGameHUD && <GameHUD />}
      <main className={shouldShowGameHUD ? "h-screen pt-16" : "h-screen"}>
        <Outlet />
      </main>
    </div>
  );
};
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/components/layout/RootLayout.tsx
```tsx
import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/redux';
import { checkAuth } from '../../features/auth/authSlice';

export const RootLayout: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Check for existing session on mount
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Outlet />
    </div>
  );
};
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/components/molecules/CharacterPortrait/CharacterPortrait.tsx
```tsx
import React from 'react';
import { clsx } from 'clsx';

export interface CharacterPortraitProps {
  name: string;
  avatar: string;
  isAvailable?: boolean;
  badge?: string | number;
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
}

export const CharacterPortrait: React.FC<CharacterPortraitProps> = ({
  name,
  avatar,
  isAvailable = false,
  badge,
  size = 'medium',
  onClick,
}) => {
  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-[120px] h-[120px]',
    large: 'w-32 h-32',
  };

  const classes = clsx(
    'character-portrait',
    isAvailable && 'character-portrait--available',
    sizeClasses[size],
    onClick && 'cursor-pointer'
  );

  return (
    <div className={classes} onClick={onClick}>
      <div className="character-portrait__glow" />
      <img
        src={avatar}
        alt={name}
        className="character-portrait__image"
      />
      {badge && (
        <div className="character-portrait__badge">
          {badge}
        </div>
      )}
    </div>
  );
};
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/components/molecules/CharacterPortrait/index.ts
```ts
export { CharacterPortrait } from './CharacterPortrait';
export type { CharacterPortraitProps } from './CharacterPortrait';
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/components/molecules/ComponentCard/ComponentCard.tsx
```tsx
import React, { useState, useCallback } from 'react';
import { clsx } from 'clsx';
import { useDraggable } from '@dnd-kit/core';
import { Icon } from '../../atoms/Icon';
import { Badge } from '../../atoms/Badge';
import type { ComponentCardProps } from './ComponentCard.types';

/**
 * ComponentCard
 * 
 * Purpose: Displays system architecture components in drawer and on canvas
 * 
 * State Management:
 * - Local state for hover effects and UI interactions only
 * - Component data passed via props from parent
 * - Dragging state managed by DnD context
 * - Selection state controlled by parent
 * 
 * Redux Integration:
 * - Parent reads components from design.availableComponents
 * - Parent dispatches addNode when dropped on canvas
 */

export const ComponentCard: React.FC<ComponentCardProps> = ({
  data,
  variant = 'drawer',
  status = 'healthy',
  isDragging = false,
  isSelected = false,
  onSelect,
  className,
}) => {
  // Local UI state for hover effects
  const [isHovered, setIsHovered] = useState(false);
  
  // Draggable setup for drawer variant
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: data.id,
    data: data,
    disabled: data.locked || variant === 'canvas',
  });

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={variant === 'drawer' ? setNodeRef : undefined}
      style={style}
      className={clsx(
        'component-card',
        `component-card--${variant}`,
        `component-card--${status}`,
        {
          'component-card--dragging': isDragging,
          'component-card--selected': isSelected,
          'component-card--locked': data.locked,
          'component-card--hovered': isHovered,
        },
        className
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onSelect}
      role={variant === 'canvas' ? 'button' : undefined}
      tabIndex={variant === 'canvas' ? 0 : undefined}
      {...(variant === 'drawer' ? { ...attributes, ...listeners } : {})}
    >
      <div className="component-card__header">
        <Icon 
          name={data.icon as any || 'server'} 
          size="md" 
          className="component-card__icon"
        />
        <h3 className="component-card__name">{data.name}</h3>
        {data.locked && (
          <Icon 
            name="lock" 
            size="sm" 
            className="component-card__lock-icon"
            aria-label="Component locked"
          />
        )}
      </div>
      
      {variant === 'canvas' && (
        <div className="component-card__metrics">
          <div className="component-card__metric">
            <span className="component-card__metric-label">Load</span>
            <span className="component-card__metric-value">
              {Math.round((data.capacity / 100) * 75)}%
            </span>
          </div>
          <div className="component-card__metric">
            <span className="component-card__metric-label">Cost</span>
            <span className="component-card__metric-value">${data.cost}/mo</span>
          </div>
        </div>
      )}
      
      {variant === 'drawer' && (
        <div className="component-card__footer">
          <span className="component-card__cost">${data.cost}/mo</span>
          <Badge variant="info" size="sm">
            {data.capacity} req/s
          </Badge>
        </div>
      )}
    </div>
  );
};
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/components/molecules/ComponentCard/ComponentCard.types.ts
```ts
export type ComponentType = 'server' | 'database' | 'cache' | 'loadbalancer' | 'api' | 'cdn' | 'queue' | 'storage';
export type ComponentCategory = 'compute' | 'storage' | 'networking' | 'security' | 'operations';

export interface ComponentData {
  id: string;
  name: string;
  type: ComponentType;
  category: ComponentCategory;
  cost: number;
  capacity: number;
  description: string;
  locked?: boolean;
  icon?: string;
}

export interface ComponentCardProps {
  data: ComponentData;
  variant?: 'drawer' | 'canvas';
  status?: 'healthy' | 'stressed' | 'overloaded' | 'offline';
  isDragging?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
  className?: string;
}
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/components/molecules/ComponentCard/index.ts
```ts
export { ComponentCard } from './ComponentCard';
export type { ComponentCardProps, ComponentData, ComponentType, ComponentCategory } from './ComponentCard.types';
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/components/molecules/ImageComparison/ImageComparison.tsx
```tsx
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { clsx } from 'clsx';
import type { ImageComparisonProps } from './ImageComparison.types';

// Import assets
import treePineImg from '../../../assets/tree_pine.png';
import treeRoundImg from '../../../assets/tree_round.png';
import rocksImg from '../../../assets/rocks.png';
import boulderImg from '../../../assets/boulder.png';
import apiImg from '../../../assets/api.png';
import databaseImg from '../../../assets/database.png';
import computeImg from '../../../assets/compute.png';
import cacheImg from '../../../assets/cache.png';
import loadBalancerImg from '../../../assets/load_balancer.png';

/**
 * ImageComparison Component
 * 
 * Purpose: Interactive comparison slider between ProblemVille and DataWorld themes
 * Shows the transition from nature-based problems to tech-based solutions
 * 
 * State Management:
 * - Local state for slider position
 * - Callbacks for position changes
 * - No Redux connections needed
 * 
 * @example
 * <ImageComparison 
 *   initialPosition={50}
 *   onPositionChange={(pos) => console.log('Position:', pos)}
 * />
 */
export const ImageComparison: React.FC<ImageComparisonProps> = ({
  className,
  initialPosition = 50,
  onPositionChange,
  showLabels = true,
  leftLabel = 'ProblemVille',
  rightLabel = 'DataWorld',
  disabled = false,
}) => {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate position based on mouse/touch event
  const calculatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    
    return Math.max(0, Math.min(100, percentage));
  }, []);

  // Handle mouse down
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (disabled) return;
    e.preventDefault();
    setIsDragging(true);
  }, [disabled]);

  // Handle mouse move
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || disabled) return;
    
    const newPosition = calculatePosition(e.clientX);
    if (newPosition !== undefined) {
      setPosition(newPosition);
      onPositionChange?.(newPosition);
    }
  }, [isDragging, disabled, calculatePosition, onPositionChange]);

  // Handle mouse up
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Handle touch events
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (disabled) return;
    e.preventDefault();
    setIsDragging(true);
  }, [disabled]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging || disabled) return;
    
    const touch = e.touches[0];
    const newPosition = calculatePosition(touch.clientX);
    if (newPosition !== undefined) {
      setPosition(newPosition);
      onPositionChange?.(newPosition);
    }
  }, [isDragging, disabled, calculatePosition, onPositionChange]);

  // Set up event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove]);

  const containerClasses = clsx(
    'relative w-full h-full overflow-hidden rounded-lg select-none',
    disabled && 'opacity-50 cursor-not-allowed',
    className
  );

  const sliderClasses = clsx(
    'absolute top-0 bottom-0 w-1 bg-white z-30',
    'before:content-[""] before:absolute before:top-1/2 before:-translate-y-1/2',
    'before:left-1/2 before:-translate-x-1/2 before:w-10 before:h-10',
    'before:bg-white before:rounded-full before:shadow-lg',
    'after:content-[""] after:absolute after:top-1/2 after:-translate-y-1/2',
    'after:left-1/2 after:-translate-x-1/2 after:w-6 after:h-6',
    'after:border-2 after:border-gray-400 after:rounded-full',
    !disabled && 'cursor-ew-resize hover:before:scale-110 transition-transform',
    isDragging && 'before:scale-110'
  );

  return (
    <div 
      ref={containerRef}
      className={containerClasses}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {/* ProblemVille Side (Green/Nature) */}
      <div className="absolute inset-0 bg-gradient-to-b from-green-400 to-green-600">
        {/* Nature Assets */}
        <img 
          src={treePineImg} 
          alt="Pine Tree" 
          className="absolute bottom-10 left-10 w-24 h-32 object-contain"
        />
        <img 
          src={treeRoundImg} 
          alt="Round Tree" 
          className="absolute bottom-20 right-20 w-28 h-28 object-contain"
        />
        <img 
          src={rocksImg} 
          alt="Rocks" 
          className="absolute bottom-5 left-1/3 w-20 h-16 object-contain"
        />
        <img 
          src={boulderImg} 
          alt="Boulder" 
          className="absolute bottom-12 right-1/3 w-24 h-20 object-contain"
        />
        <img 
          src={treePineImg} 
          alt="Pine Tree" 
          className="absolute bottom-5 left-1/2 w-20 h-28 object-contain opacity-80"
        />
      </div>

      {/* DataWorld Side (Blue/Tech) */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-blue-600 to-blue-800"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        {/* Tech Assets */}
        <img 
          src={apiImg} 
          alt="API" 
          className="absolute top-20 left-10 w-20 h-20 object-contain animate-pulse"
        />
        <img 
          src={databaseImg} 
          alt="Database" 
          className="absolute bottom-20 right-10 w-24 h-24 object-contain"
        />
        <img 
          src={computeImg} 
          alt="Compute" 
          className="absolute top-1/3 right-1/4 w-28 h-28 object-contain"
        />
        <img 
          src={cacheImg} 
          alt="Cache" 
          className="absolute bottom-1/3 left-1/4 w-20 h-20 object-contain"
        />
        <img 
          src={loadBalancerImg} 
          alt="Load Balancer" 
          className="absolute top-1/4 left-1/2 w-24 h-24 object-contain"
        />
        
        {/* Connection lines between tech assets */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <line 
            x1="20%" y1="30%" 
            x2="50%" y2="25%" 
            stroke="rgba(255,255,255,0.3)" 
            strokeWidth="2"
            strokeDasharray="5,5"
          />
          <line 
            x1="50%" y1="25%" 
            x2="75%" y2="40%" 
            stroke="rgba(255,255,255,0.3)" 
            strokeWidth="2"
            strokeDasharray="5,5"
          />
          <line 
            x1="25%" y1="65%" 
            x2="75%" y2="75%" 
            stroke="rgba(255,255,255,0.3)" 
            strokeWidth="2"
            strokeDasharray="5,5"
          />
        </svg>
      </div>

      {/* Slider Handle */}
      <div 
        className={sliderClasses}
        style={{ left: `${position}%` }}
      />

      {/* Labels */}
      {showLabels && (
        <>
          <div className="absolute top-4 left-4 z-20">
            <h3 className="text-white text-2xl font-bold drop-shadow-lg">
              {leftLabel}
            </h3>
            <p className="text-white/80 text-sm drop-shadow">
              Where problems grow wild
            </p>
          </div>
          <div className="absolute top-4 right-4 z-20 text-right">
            <h3 className="text-white text-2xl font-bold drop-shadow-lg">
              {rightLabel}
            </h3>
            <p className="text-white/80 text-sm drop-shadow">
              Where solutions scale
            </p>
          </div>
        </>
      )}
    </div>
  );
};
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/components/molecules/ImageComparison/ImageComparison.types.ts
```ts
export interface ImageComparisonProps {
  /**
   * Additional CSS classes to apply to the component
   */
  className?: string;
  
  /**
   * Initial position of the slider (0-100)
   * @default 50
   */
  initialPosition?: number;
  
  /**
   * Callback when the slider position changes
   */
  onPositionChange?: (position: number) => void;
  
  /**
   * Whether to show labels for each side
   * @default true
   */
  showLabels?: boolean;
  
  /**
   * Custom label for the left side (ProblemVille)
   * @default "ProblemVille"
   */
  leftLabel?: string;
  
  /**
   * Custom label for the right side (DataWorld)
   * @default "DataWorld"
   */
  rightLabel?: string;
  
  /**
   * Whether the component is disabled
   * @default false
   */
  disabled?: boolean;
}
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/components/molecules/ImageComparison/index.ts
```ts
export { ImageComparison } from './ImageComparison';
export type { ImageComparisonProps } from './ImageComparison.types';
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/components/molecules/ImageComparison/README.md
```md
# ImageComparison Component

An interactive slider component that shows the transition between ProblemVille (nature/green theme) and DataWorld (tech/blue theme).

## Usage

```tsx
import { ImageComparison } from '@/components/molecules/ImageComparison';

function LandingPageHero() {
  const [sliderPosition, setSliderPosition] = useState(50);

  return (
    <section className="hero-section h-screen">
      <ImageComparison
        initialPosition={50}
        onPositionChange={setSliderPosition}
        showLabels={true}
      />
      
      {/* Additional hero content */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-center">
        <h1 className="text-4xl font-bold text-white mb-4">
          From Problems to Solutions
        </h1>
        <p className="text-xl text-white/80">
          Drag to explore the transformation
        </p>
      </div>
    </section>
  );
}
```

## Props

- `initialPosition` (number): Initial slider position (0-100), default: 50
- `onPositionChange` (function): Callback when slider moves
- `showLabels` (boolean): Show/hide side labels, default: true
- `leftLabel` (string): Custom label for left side, default: "ProblemVille"
- `rightLabel` (string): Custom label for right side, default: "DataWorld"
- `disabled` (boolean): Disable interaction, default: false
- `className` (string): Additional CSS classes

## Features

- Touch and mouse support
- Smooth dragging interaction
- Animated tech assets on the DataWorld side
- Nature assets on the ProblemVille side
- Customizable labels
- Responsive design
- Accessibility-friendly with proper event handling

## Styling

The component uses Tailwind CSS classes and can be customized via the `className` prop. The component takes the full width and height of its container, so wrap it in a sized element:

```tsx
<div className="w-full h-[500px]">
  <ImageComparison />
</div>
```
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/components/molecules/MentorCard/index.ts
```ts
export { MentorCard } from './MentorCard';
export type { MentorCardProps, Mentor } from './MentorCard';
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/components/molecules/MentorCard/MentorCard.tsx
```tsx
import React from 'react';
import { clsx } from 'clsx';

export interface Mentor {
  id: string;
  name: string;
  title: string;
  tags: string[];
  tagline: string;
  quote: string;
  signature: {
    legacy: string;
    knownFor: string;
  };
  personality: {
    style: string;
    traits: string;
  };
  specialty: {
    tools: string[];
    domains: string[];
  };
  lore: string;
  created_at?: string;
  updated_at?: string;
}

export interface MentorCardProps {
  mentor: Mentor;
  selected?: boolean;
  onSelect?: (mentor: Mentor) => void;
  disabled?: boolean;
}

export const MentorCard: React.FC<MentorCardProps> = ({
  mentor,
  selected = false,
  onSelect,
  disabled = false,
}) => {
  const handleClick = () => {
    if (!disabled && onSelect) {
      onSelect(mentor);
    }
  };

  const classes = clsx(
    'mentor-card',
    selected && 'mentor-card--selected',
    disabled && 'mentor-card--disabled'
  );

  return (
    <div className={classes} onClick={handleClick}>
      <div className="mentor-card__header">
        <div className="mentor-card__avatar">
          <span className="text-2xl font-bold">
            {mentor.name.split(' ').map(n => n[0]).join('')}
          </span>
        </div>
        <div className="mentor-card__info">
          <h3 className="mentor-card__name">{mentor.name}</h3>
          <p className="mentor-card__title">{mentor.title}</p>
          <p className="mentor-card__tagline">{mentor.tagline}</p>
        </div>
      </div>

      <div className="mentor-card__tags">
        {mentor.tags.map((tag) => (
          <span key={tag} className="mentor-card__tag">
            {tag}
          </span>
        ))}
      </div>

      <div className="mentor-card__quote">
        <em>"{mentor.quote}"</em>
      </div>

      <div className="mentor-card__specialty">
        <h4 className="mentor-card__specialty-title">Specializes in:</h4>
        <div className="mentor-card__domains">
          {mentor.specialty.domains.slice(0, 3).map((domain) => (
            <span key={domain} className="mentor-card__domain">
              {domain}
            </span>
          ))}
        </div>
      </div>

      <div className="mentor-card__tools">
        <strong>Key Tools:</strong>
        <span className="mentor-card__tools-list">
          {mentor.specialty.tools.slice(0, 4).join(', ')}
        </span>
      </div>

      <div className="mentor-card__legacy">
        <strong>Known for:</strong> {mentor.signature.knownFor}
      </div>

      {disabled && (
        <div className="mentor-card__locked-overlay">
          <svg className="mentor-card__lock-icon" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          <span>Unlock at higher level</span>
        </div>
      )}
    </div>
  );
};
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/components/molecules/MetricCard/index.ts
```ts
export { MetricCard } from './MetricCard';
export type { MetricCardProps, MetricData } from './MetricCard.types';
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/components/molecules/MetricCard/MetricCard.tsx
```tsx
import React, { useState, useEffect, useRef } from 'react';
import { clsx } from 'clsx';
import { Icon } from '../../atoms/Icon';
import { MetricCardProps } from './MetricCard.types';

export const MetricCard: React.FC<MetricCardProps> = ({
  data,
  onHover,
  className,
}) => {
  // Local state for animation
  const [displayValue, setDisplayValue] = useState(data.value);
  const [isAnimating, setIsAnimating] = useState(false);
  const prevValueRef = useRef(data.value);

  // Animate value changes
  useEffect(() => {
    if (prevValueRef.current !== data.value) {
      setIsAnimating(true);
      
      // Animate from old value to new value
      const startValue = prevValueRef.current;
      const endValue = data.value;
      const duration = 500;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        
        const currentValue = startValue + (endValue - startValue) * easeOutQuart;
        setDisplayValue(currentValue);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setIsAnimating(false);
          prevValueRef.current = endValue;
        }
      };

      requestAnimationFrame(animate);
    }
  }, [data.value]);

  const getTrendIcon = () => {
    switch (data.trend) {
      case 'up':
        return <Icon name="trending-up" size="sm" />;
      case 'down':
        return <Icon name="trending-down" size="sm" />;
      default:
        return <Icon name="minus" size="sm" />;
    }
  };

  const progressPercentage = data.target 
    ? Math.min((data.value / data.target) * 100, 100)
    : 0;

  return (
    <div
      className={clsx(
        'metric-card',
        `metric-card--${data.status || 'normal'}`,
        {
          'metric-card--animating': isAnimating,
        },
        className
      )}
      onMouseEnter={() => onHover?.(data)}
    >
      <div className="metric-card__header">
        <span className="metric-card__label">{data.label}</span>
        {data.trend && (
          <div className={clsx('metric-card__trend', `metric-card__trend--${data.trend}`)}>
            {getTrendIcon()}
            {data.trendValue && (
              <span className="metric-card__trend-value">
                {data.trendValue > 0 ? '+' : ''}{data.trendValue}%
              </span>
            )}
          </div>
        )}
      </div>
      
      <div className="metric-card__value">
        <span className="metric-card__number">
          {displayValue.toFixed(1)}
        </span>
        <span className="metric-card__unit">{data.unit}</span>
      </div>
      
      {data.target && (
        <div className="metric-card__progress">
          <div 
            className="metric-card__progress-bar"
            style={{ width: `${progressPercentage}%` }}
            role="progressbar"
            aria-valuenow={data.value}
            aria-valuemin={0}
            aria-valuemax={data.target}
          />
        </div>
      )}
    </div>
  );
};
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/components/molecules/MetricCard/MetricCard.types.ts
```ts
export interface MetricData {
  label: string;
  value: number;
  unit: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: number;
  status?: 'normal' | 'warning' | 'critical';
  target?: number;
}

export interface MetricCardProps {
  data: MetricData;
  onHover?: (metric: MetricData) => void;
  className?: string;
}
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/components/molecules/PhaseHeader/index.ts
```ts
export { PhaseHeader } from './PhaseHeader';
export type { PhaseHeaderProps } from './PhaseHeader'; 
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/components/molecules/PhaseHeader/PhaseHeader.tsx
```tsx
import React from 'react';
import { clsx } from 'clsx';

export interface PhaseHeaderProps {
  title: string;
  subtitle?: string;
  rightContent?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'career-map' | 'game-phase';
}

export const PhaseHeader: React.FC<PhaseHeaderProps> = ({
  title,
  subtitle,
  rightContent,
  className,
  variant = 'default',
}) => {
  return (
    <header className={clsx(
      'phase-header',
      `phase-header--${variant}`,
      className
    )}>
      <div className="phase-header__content">
        <div className="phase-header__title-section">
          <h1 className="phase-header__title">{title}</h1>
          {subtitle && (
            <p className="phase-header__subtitle">{subtitle}</p>
          )}
        </div>
        
        {rightContent && (
          <div className="phase-header__right-section">
            {rightContent}
          </div>
        )}
      </div>
    </header>
  );
}; 
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/components/molecules/QuestionCard/index.ts
```ts
export { QuestionCard } from './QuestionCard';
export type { QuestionCardProps, Question, RequirementImpact } from './QuestionCard.types';
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/components/molecules/QuestionCard/QuestionCard.tsx
```tsx
import React, { useState, useCallback } from 'react';
import { clsx } from 'clsx';
import { Icon } from '../../atoms/Icon';
import { Badge } from '../../atoms/Badge';
import { QuestionCardProps } from './QuestionCard.types';

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  isSelected,
  isDisabled,
  onSelect,
  className,
}) => {
  // Local state for preview
  const [showImpactPreview, setShowImpactPreview] = useState(false);

  const handleClick = useCallback(() => {
    if (!isDisabled && !isSelected) {
      onSelect(question.id);
    }
  }, [isDisabled, isSelected, onSelect, question.id]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }, [handleClick]);

  const getCategoryColor = () => {
    const colors = {
      product: 'primary',
      business: 'success',
      marketing: 'warning',
      technical: 'info',
    };
    return colors[question.category] || 'default';
  };

  return (
    <div
      className={clsx(
        'question-card',
        `question-card--${question.category}`,
        {
          'question-card--selected': isSelected,
          'question-card--disabled': isDisabled,
        },
        className
      )}
      onClick={handleClick}
      onKeyPress={handleKeyPress}
      onMouseEnter={() => setShowImpactPreview(true)}
      onMouseLeave={() => setShowImpactPreview(false)}
      role="button"
      tabIndex={isDisabled ? -1 : 0}
      aria-pressed={isSelected}
      aria-disabled={isDisabled}
    >
      <div className="question-card__category-indicator" />
      
      <div className="question-card__content">
        <p className="question-card__text">{question.text}</p>
        <div className="question-card__speaker">
          <Icon name="user" size="xs" />
          <span>{question.speaker.name}</span>
        </div>
      </div>

      <div className="question-card__impact-icons">
        {question.impact.map((impact) => (
          <div 
            key={impact.type}
            className="question-card__impact-icon"
            title={impact.description}
          >
            <Icon name={impact.icon as any} size="xs" />
          </div>
        ))}
      </div>

      {showImpactPreview && !isDisabled && (
        <div className="question-card__impact-preview">
          <h4>This question will:</h4>
          <ul>
            {question.impact.map((impact) => (
              <li key={impact.type}>{impact.description}</li>
            ))}
          </ul>
        </div>
      )}

      {isSelected && (
        <div className="question-card__selected-badge">
          <Icon name="check" size="sm" />
        </div>
      )}
    </div>
  );
};
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/components/molecules/QuestionCard/QuestionCard.types.ts
```ts
export interface Question {
  id: string;
  text: string;
  speaker: {
    id: string;
    name: string;
    role: string;
  };
  category: 'product' | 'business' | 'marketing' | 'technical';
  impact: RequirementImpact[];
  response: string;
}

export interface RequirementImpact {
  type: 'add_requirement' | 'modify_budget' | 'add_constraint' | 'remove_requirement';
  description: string;
  icon: string;
  value?: number;
  requirement?: any;
  requirementId?: string;
  key?: string;
}

export interface QuestionCardProps {
  question: Question;
  isSelected: boolean;
  isDisabled: boolean;
  onSelect: (questionId: string) => void;
  className?: string;
}
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/components/molecules/index.ts
```ts
// Molecules - Simple component groups with UI state
export { QuestionCard } from './QuestionCard';
export type { QuestionCardProps, Question, RequirementImpact } from './QuestionCard';

export { MentorCard } from './MentorCard';
export type { MentorCardProps } from './MentorCard';

export { CharacterPortrait } from './CharacterPortrait';
export type { CharacterPortraitProps } from './CharacterPortrait';

export { ComponentCard } from './ComponentCard';
export type { ComponentCardProps, ComponentData, ComponentType, ComponentCategory } from './ComponentCard';

export { MetricCard } from './MetricCard';
export type { MetricCardProps, MetricData } from './MetricCard';

export { PhaseHeader } from './PhaseHeader';
export type { PhaseHeaderProps } from './PhaseHeader';

export { ImageComparison } from './ImageComparison';
export type { ImageComparisonProps } from './ImageComparison';
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/components/organisms/AchievementToast/AchievementToast.tsx
```tsx
import React, { useEffect } from 'react';
import { clsx } from 'clsx';

export interface AchievementToastProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  onClose: () => void;
  duration?: number;
}

export const AchievementToast: React.FC<AchievementToastProps> = ({
  title,
  description,
  icon = '🏆',
  onClose,
  duration = 5000,
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="achievement-toast">
      <div className="achievement-toast__border" />
      <div className="achievement-toast__content">
        <div className="achievement-toast__icon">
          {icon}
        </div>
        <div className="achievement-toast__text">
          <h4 className="achievement-toast__title">{title}</h4>
          <p className="achievement-toast__description">{description}</p>
        </div>
      </div>
      <button
        className="achievement-toast__close"
        onClick={onClose}
        aria-label="Close"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
};
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/components/organisms/AchievementToast/index.ts
```ts
export { AchievementToast } from './AchievementToast';
export type { AchievementToastProps } from './AchievementToast';
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/components/organisms/CareerMap/CareerMap.tsx
```tsx
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Phaser from 'phaser';
import { MentorCard, type Mentor } from '../../molecules/MentorCard';
import { supabase } from '../../../services/supabase';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { updateCareerMapViewport, updateCareerMapData, selectCareerMapData, selectComponentForMode } from '../../../features/game/gameSlice';
import { MentorSelectionScene } from './MentorSelectionScene';

interface CareerMapGameProps {
  scenarios: any[];
  progress: any[];
  onScenarioClick: (scenarioId: string) => void;
  onComponentClick?: (componentType: string) => void;
}

interface ScenarioNode {
  id: string;
  title: string;
  level: number;
  x: number;
  y: number;
  isLocked: boolean;
  isCompleted: boolean;
  clientName: string;
  bestScore?: number;
}

interface HoverTooltip {
  visible: boolean;
  x: number;
  y: number;
  content: string;
  componentType: string;
}

interface SceneState {
  mode: 'career-map' | 'mentor-selection';
  selectedComponent?: string;
  scenarioId?: string;
}



class CareerMapScene extends Phaser.Scene {
  private scenarios: ScenarioNode[] = [];
  private onScenarioClick: (scenarioId: string) => void;
  private onComponentClick: (componentType: string) => void;
  private onShowMentorSelection: (componentType: string) => void;
  private dispatch: any; // Redux dispatch function
  private selectComponentForModeAction: any; // Redux action creator
  private gameScene!: Phaser.GameObjects.RenderTexture;
  private floorSprite!: Phaser.GameObjects.Sprite;
  private selectorSprite!: Phaser.GameObjects.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private selectedTile: { x: number; y: number } = { x: 2, y: 2 };
  private backgroundSprite!: Phaser.GameObjects.TileSprite;
  private tooltipContainer!: Phaser.GameObjects.Container;
  private tooltipBackground!: Phaser.GameObjects.Rectangle;
  private tooltipText!: Phaser.GameObjects.Text;
  private tooltipButton!: Phaser.GameObjects.Container;
  private currentHoveredComponent: string | null = null;
  private tooltipHideTimeout: number | null = null;
  
  // Isometric grid settings
  private readonly GRID_WIDTH = 8;
  private readonly GRID_HEIGHT = 6;
  private readonly TILE_WIDTH = 60;
  private readonly BORDER_OFFSET = { x: 300, y: 100 };
  private readonly FLOOR_GRAPHIC_WIDTH = 103;
  private readonly FLOOR_GRAPHIC_HEIGHT = 53;
  
  // Level data - 0 = floor, 1 = wall, 2 = selector position
  private levelData: number[][] = [
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,2,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0]
  ];

  constructor() {
    super({ key: 'CareerMapScene' });
    this.onScenarioClick = () => {};
    this.onComponentClick = () => {};
    this.onShowMentorSelection = () => {};
  }

  init(data: { 
    onScenarioClick: (scenarioId: string) => void; 
    onComponentClick?: (componentType: string) => void;
    onShowMentorSelection?: (componentType: string) => void;
    dispatch?: any;
    selectComponentForModeAction?: any;
  }) {
    this.onScenarioClick = data.onScenarioClick;
    this.onComponentClick = data.onComponentClick || (() => {});
    this.onShowMentorSelection = data.onShowMentorSelection || (() => {});
    this.dispatch = data.dispatch || (() => {});
    this.selectComponentForModeAction = data.selectComponentForModeAction;
    // Scenarios will be loaded via updateScenariosData from Redux
    this.scenarios = [];
  }

  // Method for selective updates without scene restart
  updateScenariosData(scenarios: any[], progress: any[]) {
    // Update internal scenarios data
    this.scenarios = this.processScenarios(scenarios, progress);
    
    // Clear existing scenario nodes (find them by a data property)
    this.children.list.forEach(child => {
      if (child.getData && child.getData('type') === 'scenario-node') {
        child.destroy();
      }
    });
    
    // Re-add scenario nodes with updated data
    this.addScenarioNodes();
    console.log('🔄 Scenarios updated:', this.scenarios.length, 'scenarios now displayed');
  }

  private processScenarios(scenarios: any[], progress: any[]): ScenarioNode[] {
    // Calculate world center for positioning scenarios
    const worldWidth = Math.max(2000, this.cameras.main.width * 3);
    const worldHeight = Math.max(1500, this.cameras.main.height * 3);
    const centerX = worldWidth / 2;
    const centerY = worldHeight / 2;
    
    // If no scenarios provided, create test scenarios
    if (!scenarios || scenarios.length === 0) {
      console.log('⚠️ No scenarios provided, creating test scenarios');
      const testScenarios = [
        { id: 'test-1', title: 'Test Scenario 1', level: 1, clientName: 'Test Client A' },
        { id: 'test-2', title: 'Test Scenario 2', level: 2, clientName: 'Test Client B' },
        { id: 'test-3', title: 'Test Scenario 3', level: 3, clientName: 'Test Client C' },
      ];
      scenarios = testScenarios;
    }
    
    return scenarios.map((scenario, index) => {
      const scenarioProgress = progress.find(p => p.scenarioId === scenario.id);
      const isLocked = scenario.level > 1 && !scenarioProgress;
      const isCompleted = scenarioProgress?.status === 'completed';
      
      // Create a path-like layout centered in the world
      const pathWidth = 600;
      const pathHeight = 400;
      const nodesPerRow = 3;
      const row = Math.floor(index / nodesPerRow);
      const col = index % nodesPerRow;
      
      // Position relative to center, creating a path layout
      const baseX = centerX - pathWidth/2 + (col * (pathWidth / nodesPerRow));
      const baseY = centerY - pathHeight/2 + (row * 120);
      
      // Add some randomness for a more natural path
      const offsetX = (Math.random() - 0.5) * 60;
      const offsetY = (Math.random() - 0.5) * 40;
      
      return {
        id: scenario.id,
        title: scenario.title,
        level: scenario.level,
        clientName: scenario.clientName,
        x: baseX + offsetX,
        y: baseY + offsetY,
        isLocked,
        isCompleted,
        bestScore: scenarioProgress?.bestScore
      };
    });
  }

  preload() {
    console.log('🎮 CareerMapScene: Starting preload...');
    
    // Add error handlers for asset loading
    this.load.on('loaderror', (file: any) => {
      console.error('❌ Failed to load asset:', file.src || file.key);
    });
    
    this.load.on('complete', () => {
      console.log('✅ All assets loaded successfully');
    });
    
    // Load background image
    this.load.image('day_background', '/day_background.png');
    
    // Load system component images with proper asset paths
    this.load.image('api', '/api.png');
    this.load.image('cache', '/cache.png');
    this.load.image('compute', '/compute.png');
    this.load.image('database', '/database.png');
    this.load.image('load_balancer', '/load_balancer.png');
    
    // Load nature assets
    this.load.image('tree_pine', '/tree_pine.png');
    this.load.image('tree_round', '/tree_round.png');
    this.load.image('rocks', '/rocks.png');
    this.load.image('boulder', '/boulder.png');
    
    // Create simple colored rectangles for nodes
    this.load.image('node-available', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
    this.load.image('node-completed', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
    this.load.image('node-locked', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
  }

  create() {
    console.log('🎮 CareerMapScene: Starting create...');
    
    // Add tiled background that covers the entire world - ensure minimum panning space
    const worldWidth = Math.max(2000, this.cameras.main.width * 3);
    const worldHeight = Math.max(1500, this.cameras.main.height * 3);
    
    console.log('🌍 World dimensions:', { worldWidth, worldHeight });
    console.log('📷 Camera dimensions:', { width: this.cameras.main.width, height: this.cameras.main.height });
    
    // Create tile sprite that covers the entire world, positioned at origin
    try {
      this.backgroundSprite = this.add.tileSprite(0, 0, worldWidth, worldHeight, 'day_background');
      this.backgroundSprite.setOrigin(0, 0);
      this.backgroundSprite.setDepth(-10);
      console.log('✅ Background sprite created successfully');
    } catch (error) {
      console.error('❌ Failed to create background sprite:', error);
      // Fallback: create a colored rectangle background
      const fallbackBg = this.add.rectangle(worldWidth/2, worldHeight/2, worldWidth, worldHeight, 0x2a4d3a);
      fallbackBg.setDepth(-10);
      console.log('🔄 Created fallback green background');
    }
    
    // Set camera bounds based on world size - ensure there's room to pan
    this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);
    
    // Center camera initially so user can pan in all directions
    const centerX = (worldWidth - this.cameras.main.width) / 2;
    const centerY = (worldHeight - this.cameras.main.height) / 2;
    this.cameras.main.scrollX = centerX;
    this.cameras.main.scrollY = centerY;
    
    // Create render texture for depth sorting - use viewport dimensions
    this.gameScene = this.add.renderTexture(0, 0, this.cameras.main.width, this.cameras.main.height);
    this.add.existing(this.gameScene);
    
    // Create sprite objects for rendering
    this.floorSprite = this.make.sprite({ x: 0, y: 0, key: 'database' });
    this.floorSprite.setScale(0.4);
    this.floorSprite.setTint(0x666666);
    
    this.selectorSprite = this.make.sprite({ x: 0, y: 0, key: 'database' });
    this.selectorSprite.setScale(0.5);
    this.selectorSprite.setTint(0x00ff00);
    
    // Set up keyboard controls
    this.cursors = this.input.keyboard!.createCursorKeys();
    
    // Initialize selector position from level data
    this.findSelectorPosition();
    
    // Create tooltip system
    this.createTooltipSystem();
    
    // Add system component decorations
    this.addSystemComponents();
    
    // Add scenario nodes
    console.log('📊 Scenarios data:', this.scenarios.length, 'scenarios loaded');
    this.addScenarioNodes();
    
    // Initial render
    this.renderScene();
    
    console.log('✨ CareerMapScene create() completed');
    
    // Set up camera controls
    this.setupCameraControls();
    
    // Initialize Redux state with current camera position
    this.updateCameraViewportState();
    
    // Handle resize events
    this.scale.on('resize', this.handleResize, this);
  }

  private createTooltipSystem() {
    // Create tooltip container
    this.tooltipContainer = this.add.container(0, 0);
    this.tooltipContainer.setDepth(1000); // Ensure it's on top
    this.tooltipContainer.setVisible(false);

    // Create tooltip background (wider to accommodate both buttons)
    this.tooltipBackground = this.add.rectangle(0, 0, 400, 120, 0x1a1a1a, 0.95);
    this.tooltipBackground.setStrokeStyle(2, 0x333333);
    this.tooltipContainer.add(this.tooltipBackground);

    // Create tooltip text
    this.tooltipText = this.add.text(0, -20, '', {
      fontSize: '14px',
      color: '#ffffff',
      align: 'center',
      wordWrap: { width: 380 }
    });
    this.tooltipText.setOrigin(0.5);
    this.tooltipContainer.add(this.tooltipText);

    // Create button container with both mentor and collaboration options
    this.tooltipButton = this.add.container(0, 30);
    this.tooltipContainer.add(this.tooltipButton);
    
    // Mentor Selection Button
    const mentorButtonBg = this.add.rectangle(-75, 0, 140, 30, 0x4f46e5);
    const mentorButtonText = this.add.text(-75, 0, 'Select Mentor', {
      fontSize: '12px',
      color: '#ffffff',
      fontStyle: 'bold'
    });
    mentorButtonText.setOrigin(0.5);
    
    // Collaboration Button
    const collabButtonBg = this.add.rectangle(75, 0, 140, 30, 0x059669);
    const collabButtonText = this.add.text(75, 0, 'Collaboration', {
      fontSize: '12px',
      color: '#ffffff',
      fontStyle: 'bold'
    });
    collabButtonText.setOrigin(0.5);
    
    this.tooltipButton.add([mentorButtonBg, mentorButtonText, collabButtonBg, collabButtonText]);
    
    // Make mentor button interactive
    mentorButtonBg.setInteractive();
    mentorButtonBg.on('pointerover', () => {
      mentorButtonBg.setFillStyle(0x6366f1);
      this.clearTooltipHideTimeout();
    });
    mentorButtonBg.on('pointerout', () => {
      mentorButtonBg.setFillStyle(0x4f46e5);
      this.scheduleTooltipHide(300);
    });
    mentorButtonBg.on('pointerdown', () => {
      if (this.currentHoveredComponent) {
        this.handleComponentSelection(this.currentHoveredComponent, 'mentor');
      }
    });
    
    // Make collaboration button interactive
    collabButtonBg.setInteractive();
    collabButtonBg.on('pointerover', () => {
      collabButtonBg.setFillStyle(0x16a34a);
      this.clearTooltipHideTimeout();
    });
    collabButtonBg.on('pointerout', () => {
      collabButtonBg.setFillStyle(0x059669);
      this.scheduleTooltipHide(300);
    });
    collabButtonBg.on('pointerdown', () => {
      if (this.currentHoveredComponent) {
        this.handleComponentSelection(this.currentHoveredComponent, 'collaboration');
      }
    });

    // Make the tooltip container interactive to prevent hiding when hovering over it
    this.tooltipBackground.setInteractive();
    this.tooltipBackground.on('pointerover', () => {
      this.clearTooltipHideTimeout();
    });
    this.tooltipBackground.on('pointerout', (pointer: Phaser.Input.Pointer) => {
      // Schedule hide with a longer delay to allow moving to button
      this.scheduleTooltipHide(300);
    });
  }

  private showTooltip(worldX: number, worldY: number, componentType: string) {
    this.clearTooltipHideTimeout();
    this.currentHoveredComponent = componentType;
    
    // Update tooltip content
    const content = this.getTooltipContent(componentType);
    this.tooltipText.setText(content);
    
    // Convert world coordinates to screen coordinates
    const camera = this.cameras.main;
    const screenX = worldX - camera.scrollX;
    const screenY = worldY - camera.scrollY;
    
    // Get current viewport dimensions
    const viewportWidth = camera.width;
    const viewportHeight = camera.height;
    const viewportCenterX = viewportWidth / 2;
    
    // Determine if asset is on left or right side of current view
    const isOnLeftSide = screenX < viewportCenterX;
    
    // Calculate tooltip position based on side
    const tooltipWidth = 400;
    const tooltipHeight = 120;
    const padding = 20;
    
    let tooltipX: number;
    let tooltipY: number;
    
    if (isOnLeftSide) {
      // Asset on left side - place tooltip to the right
      tooltipX = screenX + 50; // 50px to the right of asset
      // Ensure tooltip doesn't go off right edge
      if (tooltipX + tooltipWidth > viewportWidth - padding) {
        tooltipX = viewportWidth - tooltipWidth - padding;
      }
    } else {
      // Asset on right side - place tooltip to the left  
      tooltipX = screenX - tooltipWidth - 50; // 50px to the left of asset
      // Ensure tooltip doesn't go off left edge
      if (tooltipX < padding) {
        tooltipX = padding;
      }
    }
    
    // Vertical positioning - prefer above asset, but adjust if off-screen
    tooltipY = screenY - tooltipHeight - 20; // 20px above asset
    if (tooltipY < padding) {
      tooltipY = screenY + 50; // Place below if not enough space above
    }
    if (tooltipY + tooltipHeight > viewportHeight - padding) {
      tooltipY = viewportHeight - tooltipHeight - padding;
    }
    
    // Apply screen coordinates to tooltip (convert back to world for container)
    const worldTooltipX = tooltipX + camera.scrollX;
    const worldTooltipY = tooltipY + camera.scrollY;
    
    this.tooltipContainer.setPosition(worldTooltipX, worldTooltipY);
    this.tooltipContainer.setVisible(true);
    
    // Add subtle fade-in animation
    this.tooltipContainer.setAlpha(0);
    this.tweens.add({
      targets: this.tooltipContainer,
      alpha: 1,
      duration: 200,
      ease: 'Power2'
    });
  }

  private hideTooltip() {
    this.clearTooltipHideTimeout();
    this.tooltipContainer.setVisible(false);
    this.currentHoveredComponent = null;
  }

  private getTooltipContent(componentType: string): string {
    const tooltips = {
      api: 'API Gateway\nManage API endpoints and routing',
      cache: 'Caching Layer\nImprove performance with data caching',
      compute: 'Compute Service\nHandle application processing',
      database: 'Database System\nStore and manage your data',
      load_balancer: 'Load Balancer\nDistribute traffic across servers'
    };
    return tooltips[componentType as keyof typeof tooltips] || 'System Component\nExplore this component';
  }

  private handleResize(gameSize: Phaser.Structs.Size) {
    // Check if camera is available before accessing bounds
    if (!this.cameras.main) {
      console.warn('⚠️ Camera not available during resize, skipping...');
      return;
    }
    
    // Store current camera position as a percentage of the world
    const bounds = this.cameras.main.getBounds();
    if (!bounds) {
      console.warn('⚠️ Camera bounds not available during resize, skipping...');
      return;
    }
    
    const currentWorldWidth = bounds.width;
    const currentWorldHeight = bounds.height;
    const scrollXPercent = this.cameras.main.scrollX / currentWorldWidth;
    const scrollYPercent = this.cameras.main.scrollY / currentWorldHeight;
    
    // Update render texture size
    this.gameScene.setSize(gameSize.width, gameSize.height);
    
    // Update background tile sprite to ensure it covers the entire world - maintain panning space
    const worldWidth = Math.max(2000, gameSize.width * 3);
    const worldHeight = Math.max(1500, gameSize.height * 3);
    if (this.backgroundSprite) {
      this.backgroundSprite.setSize(worldWidth, worldHeight);
      this.backgroundSprite.setPosition(0, 0);
      this.backgroundSprite.setOrigin(0, 0);
    }
    
    // Update camera bounds to maintain panning space
    this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);
    
    // Restore camera position proportionally or center if first time
    if (currentWorldWidth > 0) {
      this.cameras.main.scrollX = scrollXPercent * worldWidth;
      this.cameras.main.scrollY = scrollYPercent * worldHeight;
    } else {
      // Center camera if this is initial resize
      const centerX = (worldWidth - gameSize.width) / 2;
      const centerY = (worldHeight - gameSize.height) / 2;
      this.cameras.main.scrollX = centerX;
      this.cameras.main.scrollY = centerY;
    }
    
    // Re-render scene with new dimensions
    this.renderScene();
  }

  private findSelectorPosition() {
    for (let i = 0; i < this.levelData.length; i++) {
      for (let j = 0; j < this.levelData[i].length; j++) {
        if (this.levelData[i][j] === 2) {
          this.selectedTile = { x: j, y: i };
          return;
        }
      }
    }
  }

  private renderScene() {
    this.gameScene.clear();
    
    // Draw all tiles in depth order
    for (let i = 0; i < this.levelData.length; i++) {
      for (let j = 0; j < this.levelData[i].length; j++) {
        this.drawTileIso(i, j);
        
        // Draw selector if at this position
        if (i === this.selectedTile.y && j === this.selectedTile.x) {
          this.drawSelectorIso();
        }
      }
    }
  }

  private drawTileIso(i: number, j: number) {
    const cartPt = { x: j * this.TILE_WIDTH, y: i * this.TILE_WIDTH };
    const isoPt = this.cartesianToIsometric(cartPt);
    
    this.gameScene.draw(
      this.floorSprite,
      isoPt.x + this.BORDER_OFFSET.x,
      isoPt.y + this.BORDER_OFFSET.y
    );
  }

  private drawSelectorIso() {
    const cartPt = { 
      x: this.selectedTile.x * this.TILE_WIDTH, 
      y: this.selectedTile.y * this.TILE_WIDTH 
    };
    const isoPt = this.cartesianToIsometric(cartPt);
    
    this.gameScene.draw(
      this.selectorSprite,
      isoPt.x + this.BORDER_OFFSET.x,
      isoPt.y + this.BORDER_OFFSET.y - 10 // Slightly elevated
    );
  }

  private cartesianToIsometric(cartPt: { x: number; y: number }): { x: number; y: number } {
    return {
      x: cartPt.x - cartPt.y,
      y: (cartPt.x + cartPt.y) / 2
    };
  }

  private isometricToCartesian(isoPt: { x: number; y: number }): { x: number; y: number } {
    return {
      x: (2 * isoPt.y + isoPt.x) / 2,
      y: (2 * isoPt.y - isoPt.x) / 2
    };
  }

  private getTileCoordinates(cartPt: { x: number; y: number }): { x: number; y: number } {
    return {
      x: Math.floor(cartPt.x / this.TILE_WIDTH),
      y: Math.floor(cartPt.y / this.TILE_WIDTH)
    };
  }

  update() {
    // Handle keyboard input for tile selection
    if (Phaser.Input.Keyboard.JustDown(this.cursors.left!) && this.selectedTile.x > 0) {
      this.selectedTile.x--;
      this.updateLevel();
    }
    else if (Phaser.Input.Keyboard.JustDown(this.cursors.right!) && this.selectedTile.x < this.GRID_WIDTH - 1) {
      this.selectedTile.x++;
      this.updateLevel();
    }
    else if (Phaser.Input.Keyboard.JustDown(this.cursors.up!) && this.selectedTile.y > 0) {
      this.selectedTile.y--;
      this.updateLevel();
    }
    else if (Phaser.Input.Keyboard.JustDown(this.cursors.down!) && this.selectedTile.y < this.GRID_HEIGHT - 1) {
      this.selectedTile.y++;
      this.updateLevel();
    }
  }

  private updateLevel() {
    // Update level data to reflect new selector position
    for (let i = 0; i < this.levelData.length; i++) {
      for (let j = 0; j < this.levelData[i].length; j++) {
        if (this.levelData[i][j] === 2) {
          this.levelData[i][j] = 0; // Clear old position
        }
      }
    }
    this.levelData[this.selectedTile.y][this.selectedTile.x] = 2; // Set new position
    
    // Re-render the scene
    this.renderScene();
  }

  private addSystemComponents() {
    // Calculate world center for positioning components
    const worldWidth = Math.max(2000, this.cameras.main.width * 3);
    const worldHeight = Math.max(1500, this.cameras.main.height * 3);
    const centerX = worldWidth / 2;
    const centerY = worldHeight / 2;
    
    const components = ['api', 'cache', 'compute', 'database', 'load_balancer'];
    // Position components relative to center with spread around the area
    const componentPositions = [
      { x: centerX - 400, y: centerY - 200 },
      { x: centerX + 300, y: centerY - 150 },
      { x: centerX - 200, y: centerY + 100 },
      { x: centerX + 200, y: centerY + 50 },
      { x: centerX, y: centerY + 200 },
      { x: centerX - 350, y: centerY + 50 },
      { x: centerX + 350, y: centerY + 150 },
      { x: centerX - 100, y: centerY - 100 },
    ];

    componentPositions.forEach((pos, index) => {
      const componentKey = components[index % components.length];
      const component = this.add.image(pos.x, pos.y, componentKey);
      component.setScale(0.3);
      component.setAlpha(0.4);
      component.setDepth(-1); // Place behind other elements
      
      // Make all components clickable
      component.setInteractive();
      component.setAlpha(0.6); // Make it slightly more visible
      
      let componentClickStart = { x: 0, y: 0, time: 0 };
      let hoverTimeout: number | null = null;
      
      component.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
        componentClickStart = { x: pointer.x, y: pointer.y, time: Date.now() };
      });
      
      component.on('pointerup', (pointer: Phaser.Input.Pointer) => {
        const dragDistance = Phaser.Math.Distance.Between(componentClickStart.x, componentClickStart.y, pointer.x, pointer.y);
        const clickTime = Date.now() - componentClickStart.time;
        
        // Only trigger click if it's not a drag (small movement and quick)
        if (dragDistance < 5 && clickTime < 500) {
          console.log(`🖱️ Component clicked: ${componentKey.toUpperCase()}`);
          console.log(`📊 Click details:`, {
            component: componentKey,
            position: { x: pos.x, y: pos.y },
            dragDistance,
            clickTime,
            timestamp: new Date().toISOString()
          });
          this.onComponentClick(componentKey);
        }
      });
      
      // Add hover effect with tooltip
      component.on('pointerover', (pointer: Phaser.Input.Pointer) => {
        component.setAlpha(0.8);
        component.setTint(0xffffff);
        
        // Clear any pending hide timeout
        this.clearTooltipHideTimeout();
        
        // Show tooltip after a brief delay
        hoverTimeout = window.setTimeout(() => {
          this.showTooltip(pos.x, pos.y, componentKey);
        }, 500);
      });
      
      component.on('pointerout', () => {
        component.setAlpha(0.6);
        component.clearTint();
        
        // Clear hover timeout
        if (hoverTimeout) {
          clearTimeout(hoverTimeout);
          hoverTimeout = null;
        }
        
        // Schedule tooltip to hide with delay (allows moving to tooltip)
        this.scheduleTooltipHide(200);
      });
      
      // Add subtle floating animation
      this.tweens.add({
        targets: component,
        y: pos.y + 10,
        duration: 3000 + Math.random() * 2000,
        ease: 'Sine.easeInOut',
        yoyo: true,
        repeat: -1,
        delay: Math.random() * 1000
      });
    });
    
    // Add nature assets for environment decoration
    this.addNatureAssets(centerX, centerY);
  }
  
  private addNatureAssets(centerX: number, centerY: number) {
    const natureAssets = [
      { key: 'tree_pine', scale: 0.4, positions: [
        { x: centerX - 500, y: centerY - 300 },
        { x: centerX + 450, y: centerY - 250 },
        { x: centerX - 300, y: centerY + 300 },
        { x: centerX + 200, y: centerY + 280 }
      ]},
      { key: 'tree_round', scale: 0.35, positions: [
        { x: centerX - 450, y: centerY - 100 },
        { x: centerX + 400, y: centerY + 100 },
        { x: centerX - 150, y: centerY + 250 },
        { x: centerX + 300, y: centerY - 200 }
      ]},
      { key: 'rocks', scale: 0.3, positions: [
        { x: centerX - 350, y: centerY + 150 },
        { x: centerX + 320, y: centerY - 100 },
        { x: centerX - 100, y: centerY + 300 },
        { x: centerX + 150, y: centerY - 250 }
      ]},
      { key: 'boulder', scale: 0.4, positions: [
        { x: centerX - 480, y: centerY + 200 },
        { x: centerX + 380, y: centerY - 180 },
        { x: centerX + 100, y: centerY + 320 }
      ]}
    ];
    
    natureAssets.forEach(asset => {
      asset.positions.forEach(pos => {
        const natureSprite = this.add.image(pos.x, pos.y, asset.key);
        natureSprite.setScale(asset.scale);
        natureSprite.setAlpha(0.7);
        natureSprite.setDepth(-2); // Place behind system components
        
        // Add subtle swaying animation to trees
        if (asset.key.includes('tree')) {
          this.tweens.add({
            targets: natureSprite,
            rotation: 0.05,
            duration: 4000 + Math.random() * 2000,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1,
            delay: Math.random() * 2000
          });
        }
      });
    });
  }
  
  private addScenarioNodes() {
    this.scenarios.forEach((scenario, index) => {
      // Create scenario node based on status
      let nodeColor = 0x666666; // locked
      let nodeAlpha = 0.5;
      let nodeScale = 0.8;
      
      if (scenario.isCompleted) {
        nodeColor = 0x22c55e; // green - completed
        nodeAlpha = 1.0;
        nodeScale = 1.0;
      } else if (!scenario.isLocked) {
        nodeColor = 0x3b82f6; // blue - available
        nodeAlpha = 0.9;
        nodeScale = 0.9;
      }
      
      // Create main node circle
      const nodeGraphics = this.add.graphics();
      nodeGraphics.fillStyle(nodeColor, nodeAlpha);
      nodeGraphics.fillCircle(0, 0, 30);
      nodeGraphics.setPosition(scenario.x, scenario.y);
      nodeGraphics.setScale(nodeScale);
      nodeGraphics.setDepth(10); // Above background elements
      nodeGraphics.setData('type', 'scenario-node'); // Mark for selective updates
      
      // Add scenario title text
      const titleText = this.add.text(scenario.x, scenario.y - 50, scenario.title, {
        fontSize: '14px',
        color: '#ffffff',
        fontStyle: 'bold',
        align: 'center',
        wordWrap: { width: 120 }
      });
      titleText.setOrigin(0.5);
      titleText.setDepth(11);
      titleText.setData('type', 'scenario-node'); // Mark for selective updates
      
      // Add client name text
      const clientText = this.add.text(scenario.x, scenario.y + 45, scenario.clientName, {
        fontSize: '12px',
        color: '#cccccc',
        align: 'center'
      });
      clientText.setOrigin(0.5);
      clientText.setDepth(11);
      clientText.setData('type', 'scenario-node'); // Mark for selective updates
      
      // Add completion indicator for completed scenarios
      if (scenario.isCompleted && scenario.bestScore) {
        const scoreText = this.add.text(scenario.x, scenario.y + 60, `${scenario.bestScore}%`, {
          fontSize: '10px',
          color: '#22c55e',
          fontStyle: 'bold',
          align: 'center'
        });
        scoreText.setOrigin(0.5);
        scoreText.setDepth(11);
        scoreText.setData('type', 'scenario-node'); // Mark for selective updates
      }
      
      // Make clickable if not locked
      if (!scenario.isLocked) {
        nodeGraphics.setInteractive(new Phaser.Geom.Circle(0, 0, 30), Phaser.Geom.Circle.Contains);
        
        nodeGraphics.on('pointerover', () => {
          nodeGraphics.setScale(nodeScale * 1.1);
          nodeGraphics.setAlpha(Math.min(nodeAlpha + 0.2, 1.0));
        });
        
        nodeGraphics.on('pointerout', () => {
          nodeGraphics.setScale(nodeScale);
          nodeGraphics.setAlpha(nodeAlpha);
        });
        
        nodeGraphics.on('pointerup', () => {
          console.log(`🎯 Scenario clicked: ${scenario.title}`);
          this.onScenarioClick(scenario.id);
        });
        
        // Add pulsing animation for available scenarios
        if (!scenario.isCompleted) {
          this.tweens.add({
            targets: nodeGraphics,
            alpha: nodeAlpha + 0.3,
            duration: 1500,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1,
            delay: index * 200
          });
        }
      }
      
      // Add lock icon for locked scenarios
      if (scenario.isLocked) {
        const lockText = this.add.text(scenario.x, scenario.y, '🔒', {
          fontSize: '16px'
        });
        lockText.setOrigin(0.5);
        lockText.setDepth(12);
      }
    });
  }

  private setupCameraControls() {
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let clickStartTime = 0;
    
    // Enable camera dragging with proper drag detection
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      isDragging = false;
      dragStartX = pointer.x;
      dragStartY = pointer.y;
      clickStartTime = Date.now();
    });
    
    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (pointer.isDown) {
        const dragDistance = Phaser.Math.Distance.Between(dragStartX, dragStartY, pointer.x, pointer.y);
        const dragTime = Date.now() - clickStartTime;
        
        // Consider it a drag if moved more than 5 pixels or held for more than 100ms
        if (dragDistance > 5 || dragTime > 100) {
          isDragging = true;
        }
        
        if (isDragging) {
          this.cameras.main.scrollX -= (pointer.x - pointer.prevPosition.x) / this.cameras.main.zoom;
          this.cameras.main.scrollY -= (pointer.y - pointer.prevPosition.y) / this.cameras.main.zoom;
          
          // Update Redux state when camera moves
          this.updateCameraViewportState();
        }
      }
    });
    
    this.input.on('pointerup', () => {
      isDragging = false;
      // Final state update when dragging ends
      this.updateCameraViewportState();
    });

    // Enable zoom with mouse wheel
    this.input.on('wheel', (pointer: Phaser.Input.Pointer, gameObjects: Phaser.GameObjects.GameObject[], deltaX: number, deltaY: number) => {
      const zoomFactor = deltaY > 0 ? 0.9 : 1.1;
      const newZoom = Phaser.Math.Clamp(this.cameras.main.zoom * zoomFactor, 0.5, 2);
      this.cameras.main.setZoom(newZoom);
      
      // Update Redux state when zoom changes
      this.updateCameraViewportState();
    });
  }
  
  private updateCameraViewportState() {
    if (!this.dispatch) return;
    
    const camera = this.cameras.main;
    const worldWidth = Math.max(2000, camera.width * 3);
    const worldHeight = Math.max(1500, camera.height * 3);
    
    this.dispatch(updateCareerMapViewport({
      scrollX: camera.scrollX,
      scrollY: camera.scrollY,
      zoom: camera.zoom,
      worldWidth,
      worldHeight,
      viewportWidth: camera.width,
      viewportHeight: camera.height,
    }));
  }
  
  private isAssetOnLeftSideOfView(worldX: number): boolean {
    const camera = this.cameras.main;
    const screenX = worldX - camera.scrollX;
    const viewportCenterX = camera.width / 2;
    return screenX < viewportCenterX;
  }

  private clearTooltipHideTimeout() {
    if (this.tooltipHideTimeout) {
      clearTimeout(this.tooltipHideTimeout);
      this.tooltipHideTimeout = null;
    }
  }

  private scheduleTooltipHide(delay: number = 300) {
    this.clearTooltipHideTimeout();
    this.tooltipHideTimeout = window.setTimeout(() => {
      this.hideTooltip();
    }, delay);
  }
  
  private handleComponentSelection(componentType: string, mode: 'mentor' | 'collaboration') {
    console.log(`🎯 Component selected: ${componentType} in ${mode} mode`);
    
    // Dispatch Redux action to store component selection
    if (this.dispatch && this.selectComponentForModeAction) {
      this.dispatch(this.selectComponentForModeAction({
        componentType,
        mode,
        scenarioId: 'demo-scenario', // Use actual scenario ID in production
      }));
    }
    
    // Navigate to mentor selection scene (same for both modes)
    this.onShowMentorSelection(componentType);
  }
}

export const CareerMapGame: React.FC<CareerMapGameProps> = ({ scenarios, progress, onScenarioClick, onComponentClick }) => {
  const gameRef = useRef<HTMLDivElement>(null);
  const phaserGameRef = useRef<Phaser.Game | null>(null);
  const sceneRef = useRef<CareerMapScene | null>(null);
  const navigate = useNavigate();
  const [sceneState, setSceneState] = useState<SceneState>({ mode: 'career-map' });
  const dispatch = useAppDispatch();
  const careerMapViewport = useAppSelector(state => state.game.careerMapViewport);
  const careerMapData = useAppSelector(selectCareerMapData);

  // Debug logging
  React.useEffect(() => {
    console.log('🎮 CareerMapGame props:', {
      scenarios: scenarios?.length || 0,
      progress: progress?.length || 0,
      scenariosData: scenarios,
      progressData: progress
    });
  }, [scenarios, progress]);

  const handleShowMentorSelection = (componentType: string) => {
    console.log(`🎯 Switching to mentor selection for: ${componentType}`);
    
    // Update scene state first
    const mentorSelectionData = {
      mode: 'mentor-selection' as const,
      selectedComponent: componentType,
      scenarioId: 'demo-scenario'
    };
    setSceneState(mentorSelectionData);
    
    if (phaserGameRef.current) {
      // Switch to MentorSelectionScene with mentor selection handler that has access to componentType
      phaserGameRef.current.scene.start('MentorSelectionScene', {
        onMentorSelected: (mentor: Mentor) => handleMentorSelected(mentor, componentType, 'demo-scenario'),
        onBack: handleMentorSelectionBack,
        componentType: componentType,
        scenarioId: 'demo-scenario'
      });
      // Stop the current CareerMapScene
      phaserGameRef.current.scene.stop('CareerMapScene');
    }
  };

  const handleMentorSelectionBack = () => {
    console.log(`🔙 Returning to career map`);
    if (phaserGameRef.current) {
      // Switch back to CareerMapScene
      phaserGameRef.current.scene.start('CareerMapScene', { 
        onScenarioClick,
        onComponentClick,
        onShowMentorSelection: handleShowMentorSelection,
        dispatch,
        selectComponentForModeAction: selectComponentForMode
      });
      // Stop the MentorSelectionScene
      phaserGameRef.current.scene.stop('MentorSelectionScene');
    }
    setSceneState({ mode: 'career-map' });
  };

  const handleMentorSelected = (mentor: Mentor, componentType?: string, scenarioId?: string) => {
    const finalComponentType = componentType || sceneState.selectedComponent;
    const finalScenarioId = scenarioId || sceneState.scenarioId || 'demo-scenario';
    
    console.log(`✅ Mentor selected: ${mentor.name} for ${finalComponentType}`);
    
    // Store selected mentor in localStorage or state management
    localStorage.setItem('selectedMentor', JSON.stringify(mentor));
    localStorage.setItem('mentorContext', JSON.stringify({
      componentType: finalComponentType,
      scenarioId: finalScenarioId,
      timestamp: Date.now()
    }));
    
    // Show success feedback
    console.log(`🎉 Mentor ${mentor.name} is now guiding you through ${finalComponentType} design!`);
    
    // Navigate to the SystemDesignCanvas with the scenario ID
    navigate(`/design/${finalScenarioId}`);
  };

  useEffect(() => {
    if (gameRef.current && !phaserGameRef.current) {
      console.log('🚀 Initializing Phaser game...');
      
      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        width: window.innerWidth,
        height: window.innerHeight,
        parent: gameRef.current,
        backgroundColor: '#1a1a1a',
        scene: [CareerMapScene, MentorSelectionScene], // Add MentorSelectionScene to the config
        physics: {
          default: 'arcade',
          arcade: {
            gravity: { y: 0, x: 0 },
            debug: false
          }
        },
        scale: {
          mode: Phaser.Scale.RESIZE,
          autoCenter: Phaser.Scale.CENTER_BOTH
        }
      };

      try {
        phaserGameRef.current = new Phaser.Game(config);
        console.log('✅ Phaser game created successfully');
      } catch (error) {
        console.error('❌ Failed to create Phaser game:', error);
        return;
      }
      
      // Pass callbacks and dispatch to the scene (data will come from Redux)
      phaserGameRef.current.scene.start('CareerMapScene', { 
        onScenarioClick,
        onComponentClick,
        onShowMentorSelection: handleShowMentorSelection,
        dispatch,
        selectComponentForModeAction: selectComponentForMode
      });
      
      // Store scene reference for selective updates
      const scene = phaserGameRef.current.scene.getScene('CareerMapScene') as CareerMapScene;
      sceneRef.current = scene;
      
      // Initialize Redux state with current data
      dispatch(updateCareerMapData({ scenarios, progress }));

      // Handle window resize
      const handleResize = () => {
        if (phaserGameRef.current) {
          phaserGameRef.current.scale.resize(window.innerWidth, window.innerHeight);
        }
      };

      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }

    return () => {
      if (phaserGameRef.current) {
        phaserGameRef.current.destroy(true);
        phaserGameRef.current = null;
        sceneRef.current = null;
      }
    };
  }, []); // Empty dependency array - only run once on mount

  // Update Redux state when props change (but don't restart scene)
  useEffect(() => {
    dispatch(updateCareerMapData({ scenarios, progress }));
  }, [scenarios, progress, dispatch]);

  // Selectively update scene when Redux state changes
  useEffect(() => {
    if (sceneRef.current && careerMapData.lastUpdate > 0) {
      // Use selective updates instead of restarting the entire scene
      sceneRef.current.updateScenariosData(careerMapData.scenarios, careerMapData.progress);
    }
  }, [careerMapData]);

  return (
    <div className="career-map__phaser-container relative">
      <div ref={gameRef} className="w-full h-full" />
    </div>
  );
}; 
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/components/organisms/CareerMap/index.ts
```ts
export { CareerMapGame } from './CareerMap';
export { MentorSelectionScene } from './MentorSelectionScene';
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/components/organisms/CareerMap/MentorSelectionScene.tsx
```tsx
import Phaser from 'phaser';
import { supabase } from '../../../services/supabase';
import type { Mentor } from '../../molecules/MentorCard';

interface MentorSelectionSceneData {
  onMentorSelected: (mentor: Mentor) => void;
  onBack: () => void;
  componentType?: string;
  scenarioId?: string;
}

export class MentorSelectionScene extends Phaser.Scene {
  private mentors: Mentor[] = [];
  private selectedMentor: Mentor | null = null;
  private onMentorSelected: (mentor: Mentor) => void;
  private onBack: () => void;
  private componentType: string;
  private scenarioId: string;
  
  // UI Elements
  private headerContainer!: Phaser.GameObjects.Container;
  private mentorCardsContainer!: Phaser.GameObjects.Container;
  private confirmationContainer!: Phaser.GameObjects.Container;
  private scrollOffset = 0;
  private maxScrollOffset = 0;
  private isLoading = true;
  private errorMessage = '';
  
  // Card dimensions and layout
  private readonly CARD_WIDTH = 320;
  private readonly CARD_HEIGHT = 480;
  private readonly CARD_SPACING = 40;
  private readonly CARDS_PER_ROW = 3;
  private readonly HEADER_HEIGHT = 120;
  
  constructor() {
    super({ key: 'MentorSelectionScene' });
    this.onMentorSelected = () => {};
    this.onBack = () => {};
    this.componentType = '';
    this.scenarioId = '';
  }

  init(data: MentorSelectionSceneData) {
    this.onMentorSelected = data.onMentorSelected;
    this.onBack = data.onBack;
    this.componentType = data.componentType || 'system-component';
    this.scenarioId = data.scenarioId || 'default';
    this.selectedMentor = null;
    this.scrollOffset = 0;
    this.isLoading = true;
    this.errorMessage = '';
  }

  preload() {
    // Create colored rectangles for UI elements
    this.load.image('card-bg', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
    this.load.image('button-bg', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
  }

  async create() {
    console.log('🎮 MentorSelectionScene: Creating scene...');
    
    // Create dark background
    const bg = this.add.rectangle(
      this.cameras.main.centerX, 
      this.cameras.main.centerY,
      this.cameras.main.width, 
      this.cameras.main.height,
      0x1a1a1a
    );
    bg.setDepth(-10);

    // Create header section
    this.createHeader();
    
    // Start with loading screen
    this.createLoadingScreen();
    
    // Set up input handlers
    this.setupInputHandlers();
    
    console.log('✅ MentorSelectionScene: Scene created successfully');
    
    // Fetch mentors data after scene is created
    await this.fetchMentors();
  }

  private async fetchMentors() {
    try {
      console.log('📡 Fetching mentors from Supabase...');
      
      const { data, error } = await supabase
        .from('mentors')
        .select('*')
        .order('name');

      if (error) {
        throw error;
      }

      this.mentors = data || [];
      this.isLoading = false;
      console.log(`✅ Fetched ${this.mentors.length} mentors successfully`);
      
      // Refresh the scene content after mentors are loaded
      this.refreshSceneContent();
    } catch (error) {
      console.error('❌ Error fetching mentors:', error);
      this.errorMessage = 'Failed to load mentors. Please try again.';
      this.isLoading = false;
      
      // Refresh the scene to show error state
      this.refreshSceneContent();
    }
  }

  private refreshSceneContent() {
    // Clear existing content containers (except header and background)
    if (this.mentorCardsContainer) {
      this.mentorCardsContainer.destroy();
      this.mentorCardsContainer = null as any;
    }
    
    // Clear loading/error screens by removing all containers except header
    const childrenToDestroy: Phaser.GameObjects.GameObject[] = [];
    this.children.list.forEach(child => {
      if (child !== this.headerContainer && 
          child instanceof Phaser.GameObjects.Container) {
        childrenToDestroy.push(child);
      } else if (child instanceof Phaser.GameObjects.Graphics ||
                 child instanceof Phaser.GameObjects.Text) {
        // Also destroy standalone loading elements
        if (child.depth >= 50) { // Loading/error elements have depth 50+
          childrenToDestroy.push(child);
        }
      }
    });
    
    childrenToDestroy.forEach(child => child.destroy());
    
    // Create appropriate content based on current state
    if (this.isLoading) {
      this.createLoadingScreen();
    } else if (this.errorMessage) {
      this.createErrorScreen();
    } else {
      this.createMentorCards();
    }
  }

  private createHeader() {
    this.headerContainer = this.add.container(0, 0);
    
    // Header background
    const headerBg = this.add.rectangle(
      this.cameras.main.centerX,
      this.HEADER_HEIGHT / 2,
      this.cameras.main.width,
      this.HEADER_HEIGHT,
      0x2a2a2a,
      0.8
    );
    this.headerContainer.add(headerBg);
    
    // Back button
    const backButton = this.createButton(60, 40, 'Back', 0x666666, () => {
      this.onBack();
    });
    this.headerContainer.add(backButton);
    
    // Title
    const title = this.add.text(this.cameras.main.centerX, 30, 'Choose Your Mentor', {
      fontSize: '32px',
      color: '#ffffff',
      fontStyle: 'bold'
    });
    title.setOrigin(0.5, 0);
    this.headerContainer.add(title);
    
    // Subtitle
    const subtitle = this.add.text(this.cameras.main.centerX, 70, 
      `Select an expert to guide you through ${this.componentType} design`, {
      fontSize: '16px',
      color: '#cccccc'
    });
    subtitle.setOrigin(0.5, 0);
    this.headerContainer.add(subtitle);
    
    this.headerContainer.setDepth(100);
  }

  private createLoadingScreen() {
    const loadingContainer = this.add.container(this.cameras.main.centerX, this.cameras.main.centerY);
    
    // Loading spinner (simple rotating circle)
    const spinner = this.add.graphics();
    spinner.lineStyle(4, 0x3b82f6);
    spinner.arc(0, 0, 30, 0, Math.PI * 1.5);
    loadingContainer.add(spinner);
    
    // Rotate the spinner
    this.tweens.add({
      targets: spinner,
      rotation: Math.PI * 2,
      duration: 1000,
      repeat: -1,
      ease: 'Linear'
    });
    
    // Loading text
    const loadingText = this.add.text(0, 60, 'Loading mentors...', {
      fontSize: '18px',
      color: '#ffffff'
    });
    loadingText.setOrigin(0.5);
    loadingContainer.add(loadingText);
    
    loadingContainer.setDepth(50);
  }

  private createErrorScreen() {
    const errorContainer = this.add.container(this.cameras.main.centerX, this.cameras.main.centerY);
    
    // Error icon
    const errorIcon = this.add.text(0, -40, '⚠️', {
      fontSize: '48px'
    });
    errorIcon.setOrigin(0.5);
    errorContainer.add(errorIcon);
    
    // Error message
    const errorText = this.add.text(0, 20, this.errorMessage, {
      fontSize: '18px',
      color: '#ff6b6b',
      align: 'center',
      wordWrap: { width: 400 }
    });
    errorText.setOrigin(0.5);
    errorContainer.add(errorText);
    
    // Retry button
    const retryButton = this.createButton(0, 80, 'Try Again', 0x3b82f6, async () => {
      this.isLoading = true;
      this.errorMessage = '';
      errorContainer.destroy();
      this.createLoadingScreen();
      await this.fetchMentors();
      this.scene.restart();
    });
    errorContainer.add(retryButton);
    
    errorContainer.setDepth(50);
  }

  private createMentorCards() {
    this.mentorCardsContainer = this.add.container(0, this.HEADER_HEIGHT + 20);
    
    if (this.mentors.length === 0) {
      this.createNoMentorsMessage();
      return;
    }
    
    // Calculate grid layout
    const startX = (this.cameras.main.width - (this.CARDS_PER_ROW * this.CARD_WIDTH + (this.CARDS_PER_ROW - 1) * this.CARD_SPACING)) / 2 + this.CARD_WIDTH / 2;
    const startY = 40;
    
    this.mentors.forEach((mentor, index) => {
      const row = Math.floor(index / this.CARDS_PER_ROW);
      const col = index % this.CARDS_PER_ROW;
      
      const x = startX + col * (this.CARD_WIDTH + this.CARD_SPACING);
      const y = startY + row * (this.CARD_HEIGHT + this.CARD_SPACING);
      
      const mentorCard = this.createMentorCard(mentor, x, y);
      this.mentorCardsContainer.add(mentorCard);
    });
    
    // Calculate max scroll offset
    const totalRows = Math.ceil(this.mentors.length / this.CARDS_PER_ROW);
    const totalHeight = totalRows * (this.CARD_HEIGHT + this.CARD_SPACING);
    const visibleHeight = this.cameras.main.height - this.HEADER_HEIGHT - 40;
    this.maxScrollOffset = Math.max(0, totalHeight - visibleHeight);
    
    this.mentorCardsContainer.setDepth(10);
  }

  private createMentorCard(mentor: Mentor, x: number, y: number): Phaser.GameObjects.Container {
    const cardContainer = this.add.container(x, y);
    
    // Card background
    const cardBg = this.add.rectangle(0, 0, this.CARD_WIDTH, this.CARD_HEIGHT, 0x2a2a2a);
    cardBg.setStrokeStyle(2, 0x404040);
    cardContainer.add(cardBg);
    
    // Avatar circle
    const avatar = this.add.circle(0, -180, 40, 0x4a5568);
    cardContainer.add(avatar);
    
    // Avatar initials
    const initials = mentor.name.split(' ').map(n => n[0]).join('');
    const avatarText = this.add.text(0, -180, initials, {
      fontSize: '20px',
      color: '#ffffff',
      fontStyle: 'bold'
    });
    avatarText.setOrigin(0.5);
    cardContainer.add(avatarText);
    
    // Name
    const nameText = this.add.text(0, -120, mentor.name, {
      fontSize: '18px',
      color: '#ffffff',
      fontStyle: 'bold',
      align: 'center',
      wordWrap: { width: this.CARD_WIDTH - 20 }
    });
    nameText.setOrigin(0.5);
    cardContainer.add(nameText);
    
    // Title
    const titleText = this.add.text(0, -95, mentor.title, {
      fontSize: '14px',
      color: '#a0a0a0',
      align: 'center',
      wordWrap: { width: this.CARD_WIDTH - 20 }
    });
    titleText.setOrigin(0.5);
    cardContainer.add(titleText);
    
    // Tags
    const tagsY = -60;
    mentor.tags.slice(0, 3).forEach((tag, index) => {
      const tagBg = this.add.rectangle(
        -60 + index * 40, tagsY, 35, 20, 
        this.getTagColor(tag), 0.8
      );
      tagBg.setStrokeStyle(1, 0x666666);
      cardContainer.add(tagBg);
      
      const tagText = this.add.text(-60 + index * 40, tagsY, tag.slice(0, 3), {
        fontSize: '10px',
        color: '#ffffff',
        fontStyle: 'bold'
      });
      tagText.setOrigin(0.5);
      cardContainer.add(tagText);
    });
    
    // Tagline
    const taglineText = this.add.text(0, -20, `"${mentor.tagline}"`, {
      fontSize: '12px',
      color: '#e0e0e0',
      fontStyle: 'italic',
      align: 'center',
      wordWrap: { width: this.CARD_WIDTH - 30 }
    });
    taglineText.setOrigin(0.5);
    cardContainer.add(taglineText);
    
    // Specialties
    const specialtyTitle = this.add.text(0, 20, 'Specializes in:', {
      fontSize: '12px',
      color: '#ffffff',
      fontStyle: 'bold'
    });
    specialtyTitle.setOrigin(0.5);
    cardContainer.add(specialtyTitle);
    
    const domains = mentor.specialty.domains.slice(0, 3).join(' • ');
    const domainsText = this.add.text(0, 40, domains, {
      fontSize: '11px',
      color: '#b0b0b0',
      align: 'center',
      wordWrap: { width: this.CARD_WIDTH - 20 }
    });
    domainsText.setOrigin(0.5);
    cardContainer.add(domainsText);
    
    // Tools
    const toolsTitle = this.add.text(0, 80, 'Key Tools:', {
      fontSize: '12px',
      color: '#ffffff',
      fontStyle: 'bold'
    });
    toolsTitle.setOrigin(0.5);
    cardContainer.add(toolsTitle);
    
    const tools = mentor.specialty.tools.slice(0, 4).join(' • ');
    const toolsText = this.add.text(0, 100, tools, {
      fontSize: '11px',
      color: '#b0b0b0',
      align: 'center',
      wordWrap: { width: this.CARD_WIDTH - 20 }
    });
    toolsText.setOrigin(0.5);
    cardContainer.add(toolsText);
    
    // Known for
    const knownForText = this.add.text(0, 140, `Known for: ${mentor.signature.knownFor}`, {
      fontSize: '10px',
      color: '#a0a0a0',
      align: 'center',
      wordWrap: { width: this.CARD_WIDTH - 20 }
    });
    knownForText.setOrigin(0.5);
    cardContainer.add(knownForText);
    
    // Select button
    const selectButton = this.createButton(0, 200, `Choose ${mentor.name.split(' ')[0]}`, 0x3b82f6, () => {
      this.selectMentor(mentor);
    });
    cardContainer.add(selectButton);
    
    // Make card interactive
    cardBg.setInteractive();
    cardBg.on('pointerover', () => {
      cardBg.setStrokeStyle(3, 0x3b82f6);
      this.tweens.add({
        targets: cardContainer,
        scaleX: 1.05,
        scaleY: 1.05,
        duration: 200,
        ease: 'Power2'
      });
    });
    
    cardBg.on('pointerout', () => {
      if (this.selectedMentor?.id !== mentor.id) {
        cardBg.setStrokeStyle(2, 0x404040);
        this.tweens.add({
          targets: cardContainer,
          scaleX: 1,
          scaleY: 1,
          duration: 200,
          ease: 'Power2'
        });
      }
    });
    
    cardBg.on('pointerdown', () => {
      this.selectMentor(mentor);
    });
    
    return cardContainer;
  }

  private createNoMentorsMessage() {
    const messageContainer = this.add.container(this.cameras.main.centerX, this.cameras.main.centerY);
    
    const icon = this.add.text(0, -40, '👥', {
      fontSize: '64px'
    });
    icon.setOrigin(0.5);
    messageContainer.add(icon);
    
    const title = this.add.text(0, 20, 'No Mentors Available', {
      fontSize: '24px',
      color: '#ffffff',
      fontStyle: 'bold'
    });
    title.setOrigin(0.5);
    messageContainer.add(title);
    
    const subtitle = this.add.text(0, 50, 'Mentors are currently being prepared for your journey.', {
      fontSize: '16px',
      color: '#a0a0a0'
    });
    subtitle.setOrigin(0.5);
    messageContainer.add(subtitle);
    
    messageContainer.setDepth(50);
  }

  private selectMentor(mentor: Mentor) {
    console.log(`🎯 Mentor selected: ${mentor.name}`);
    
    // Update selection state
    this.selectedMentor = mentor;
    
    // Update card appearances
    this.mentorCardsContainer.each((child: any) => {
      const cardBg = child.list[0]; // First child is the background rectangle
      cardBg.setStrokeStyle(2, 0x404040);
      this.tweens.add({
        targets: child,
        scaleX: 1,
        scaleY: 1,
        duration: 200,
        ease: 'Power2'
      });
    });
    
    // Highlight selected card
    const selectedCardIndex = this.mentors.findIndex(m => m.id === mentor.id);
    if (selectedCardIndex >= 0) {
      const selectedCard = this.mentorCardsContainer.list[selectedCardIndex] as Phaser.GameObjects.Container;
      const cardBg = selectedCard.list[0];
      (cardBg as Phaser.GameObjects.Rectangle).setStrokeStyle(3, 0x22c55e);
      this.tweens.add({
        targets: selectedCard,
        scaleX: 1.05,
        scaleY: 1.05,
        duration: 200,
        ease: 'Power2'
      });
    }
    
    // Show confirmation UI
    this.createConfirmationUI();
  }

  private createConfirmationUI() {
    if (!this.selectedMentor) return;
    
    // Remove existing confirmation UI
    if (this.confirmationContainer) {
      this.confirmationContainer.destroy();
    }
    
    this.confirmationContainer = this.add.container(0, 0);
    
    // Semi-transparent overlay
    const overlay = this.add.rectangle(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      this.cameras.main.width,
      this.cameras.main.height,
      0x000000,
      0.7
    );
    overlay.setInteractive();
    this.confirmationContainer.add(overlay);
    
    // Confirmation panel
    const panelWidth = 500;
    const panelHeight = 300;
    const panel = this.add.rectangle(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      panelWidth,
      panelHeight,
      0x2a2a2a
    );
    panel.setStrokeStyle(2, 0x3b82f6);
    this.confirmationContainer.add(panel);
    
    // Mentor avatar
    const avatar = this.add.circle(this.cameras.main.centerX - 150, this.cameras.main.centerY - 50, 30, 0x4a5568);
    this.confirmationContainer.add(avatar);
    
    const initials = this.selectedMentor.name.split(' ').map(n => n[0]).join('');
    const avatarText = this.add.text(this.cameras.main.centerX - 150, this.cameras.main.centerY - 50, initials, {
      fontSize: '16px',
      color: '#ffffff',
      fontStyle: 'bold'
    });
    avatarText.setOrigin(0.5);
    this.confirmationContainer.add(avatarText);
    
    // Confirmation text
    const confirmTitle = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 80, 
      `You've selected ${this.selectedMentor.name}`, {
      fontSize: '20px',
      color: '#ffffff',
      fontStyle: 'bold'
    });
    confirmTitle.setOrigin(0.5);
    this.confirmationContainer.add(confirmTitle);
    
    const confirmSubtitle = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 50, 
      this.selectedMentor.title, {
      fontSize: '14px',
      color: '#a0a0a0'
    });
    confirmSubtitle.setOrigin(0.5);
    this.confirmationContainer.add(confirmSubtitle);
    
    // Benefits
    const benefits = [
      `Expert guidance in ${this.selectedMentor.specialty.domains[0]}`,
      `Optimized for ${this.componentType} design`,
      `Access to specialized knowledge and best practices`
    ];
    
    benefits.forEach((benefit, index) => {
      const bulletText = this.add.text(this.cameras.main.centerX - 200, this.cameras.main.centerY + index * 20, 
        `• ${benefit}`, {
        fontSize: '12px',
        color: '#b0b0b0',
        wordWrap: { width: 400 }
      });
      this.confirmationContainer.add(bulletText);
    });
    
    // Action buttons
    const confirmButton = this.createButton(
      this.cameras.main.centerX + 80, 
      this.cameras.main.centerY + 100, 
      `Continue with ${this.selectedMentor.name.split(' ')[0]}`, 
      0x22c55e, 
      () => {
        this.confirmSelection();
      }
    );
    this.confirmationContainer.add(confirmButton);
    
    const backButton = this.createButton(
      this.cameras.main.centerX - 80, 
      this.cameras.main.centerY + 100, 
      'Back', 
      0x666666, 
      () => {
        this.confirmationContainer.destroy();
      }
    );
    this.confirmationContainer.add(backButton);
    
    this.confirmationContainer.setDepth(200);
  }

  private confirmSelection() {
    if (this.selectedMentor) {
      console.log(`✅ Confirmed mentor selection: ${this.selectedMentor.name}`);
      this.onMentorSelected(this.selectedMentor);
    }
  }

  private createButton(x: number, y: number, text: string, color: number, onClick: () => void): Phaser.GameObjects.Container {
    const button = this.add.container(x, y);
    
    const bg = this.add.rectangle(0, 0, text.length * 8 + 20, 35, color);
    bg.setStrokeStyle(1, 0x666666);
    button.add(bg);
    
    const buttonText = this.add.text(0, 0, text, {
      fontSize: '14px',
      color: '#ffffff',
      fontStyle: 'bold'
    });
    buttonText.setOrigin(0.5);
    button.add(buttonText);
    
    bg.setInteractive();
    bg.on('pointerover', () => {
      bg.setFillStyle(color === 0x666666 ? 0x888888 : color + 0x222222);
    });
    
    bg.on('pointerout', () => {
      bg.setFillStyle(color);
    });
    
    bg.on('pointerdown', onClick);
    
    return button;
  }

  private getTagColor(tag: string): number {
    // Color-code tags based on type
    if (tag.includes('Leader') || tag.includes('Architect')) return 0x3b82f6; // Blue
    if (tag.includes('Performance') || tag.includes('Systems')) return 0xf59e0b; // Orange  
    if (tag.includes('Academic') || tag.includes('Research')) return 0x8b5cf6; // Purple
    if (tag.includes('Pioneer') || tag.includes('Revolutionary')) return 0x22c55e; // Green
    return 0x6b7280; // Gray default
  }

  private setupInputHandlers() {
    // Mouse wheel scrolling
    this.input.on('wheel', (pointer: any, gameObjects: any, deltaX: number, deltaY: number) => {
      if (this.mentorCardsContainer && this.maxScrollOffset > 0) {
        const scrollSpeed = 50;
        this.scrollOffset = Phaser.Math.Clamp(
          this.scrollOffset + (deltaY > 0 ? scrollSpeed : -scrollSpeed),
          0,
          this.maxScrollOffset
        );
        this.mentorCardsContainer.y = this.HEADER_HEIGHT + 20 - this.scrollOffset;
      }
    });
    
    // Keyboard controls
    const cursors = this.input.keyboard?.createCursorKeys();
    if (cursors) {
      this.input.keyboard?.on('keydown-ESC', () => {
        if (this.confirmationContainer) {
          this.confirmationContainer.destroy();
        } else {
          this.onBack();
        }
      });
    }
  }

  update() {
    // Update any animations or ongoing effects here if needed
  }
} 
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/components/organisms/ComponentDrawer/ComponentDrawer.tsx
```tsx
import React, { useState, useCallback, useMemo } from 'react';
import { clsx } from 'clsx';
import { Icon } from '../../atoms/Icon';
import { Input } from '../../atoms/Input';
import { ComponentCard } from '../../molecules/ComponentCard';
import { ComponentDrawerProps } from './ComponentDrawer.types';

export const ComponentDrawer: React.FC<ComponentDrawerProps> = ({
  components,
  categories,
  searchQuery,
  onSearchChange,
  onComponentDragStart,
  onComponentDragEnd,
  className,
}) => {
  // Local state for category expansion
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(categories.map(c => c.id))
  );

  // Filter components based on search
  const filteredComponents = useMemo(() => {
    if (!searchQuery) return components;
    
    const query = searchQuery.toLowerCase();
    return components.filter(component => 
      component.name.toLowerCase().includes(query) ||
      component.description.toLowerCase().includes(query) ||
      component.category.toLowerCase().includes(query)
    );
  }, [components, searchQuery]);

  // Group filtered components by category
  const groupedComponents = useMemo(() => {
    return categories.reduce((acc, category) => {
      acc[category.id] = filteredComponents.filter(
        component => component.category === category.id
      );
      return acc;
    }, {} as Record<string, ComponentData[]>);
  }, [categories, filteredComponents]);

  const toggleCategory = useCallback((categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  }, []);

  return (
    <div className={clsx('component-drawer', className)}>
      <div className="component-drawer__header">
        <h2 className="component-drawer__title">Components</h2>
        <Input
          type="search"
          value={searchQuery}
          onChange={onSearchChange}
          placeholder="Search components..."
          leftIcon={<Icon name="search" size="sm" />}
          className="component-drawer__search"
          aria-label="Search components"
        />
      </div>

      <div className="component-drawer__categories">
        {categories.map(category => {
          const categoryComponents = groupedComponents[category.id] || [];
          const isExpanded = expandedCategories.has(category.id);
          
          return (
            <div key={category.id} className="component-drawer__category">
              <button
                className="component-drawer__category-header"
                onClick={() => toggleCategory(category.id)}
                aria-expanded={isExpanded}
                aria-controls={`category-${category.id}`}
              >
                <Icon name={category.icon as any} size="md" />
                <span className="component-drawer__category-title">{category.name}</span>
                <span className="component-drawer__category-count">
                  {categoryComponents.length}
                </span>
                <Icon 
                  name={isExpanded ? 'chevron-up' : 'chevron-down'}
                  className={clsx('component-drawer__chevron', {
                    'component-drawer__chevron--expanded': isExpanded,
                  })}
                  size="sm"
                />
              </button>
              
              {isExpanded && (
                <div 
                  id={`category-${category.id}`}
                  className="component-drawer__category-items"
                >
                  {categoryComponents.length === 0 ? (
                    <p className="component-drawer__empty-message">
                      No components found
                    </p>
                  ) : (
                    categoryComponents.map(component => (
                      <ComponentCard
                        key={component.id}
                        data={component}
                        variant="drawer"
                        onDragStart={() => onComponentDragStart(component)}
                        onDragEnd={onComponentDragEnd}
                      />
                    ))
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/components/organisms/ComponentDrawer/ComponentDrawer.types.ts
```ts
import { ComponentData, ComponentCategory } from '../../molecules/ComponentCard';

export interface ComponentDrawerProps {
  components: ComponentData[];
  categories: ComponentCategory[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onComponentDragStart: (component: ComponentData) => void;
  onComponentDragEnd: () => void;
  className?: string;
}
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/components/organisms/ComponentDrawer/index.ts
```ts
export { ComponentDrawer } from './ComponentDrawer';
export type { ComponentDrawerProps } from './ComponentDrawer.types';
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/components/organisms/GameHUD/GameHUD.tsx
```tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../../hooks/redux';
import { CAREER_TITLES } from '../../../constants';

interface GameHUDProps {
  className?: string;
}

export const GameHUD: React.FC<GameHUDProps> = ({ className = '' }) => {
  const { profile } = useAppSelector(state => state.auth);
  
  if (!profile) {
    return null;
  }

  const username = profile.username || 'Unknown User';
  const currentLevel = profile.current_level || 1;
  const reputationPoints = profile.reputation_points || 0;
  const careerTitle = profile.career_title || CAREER_TITLES[Math.min(currentLevel - 1, CAREER_TITLES.length - 1)];

  return (
    <div className={`game-hud ${className}`}>
      <div className="game-hud__user-info">
        <div className="game-hud__avatar">
          {username[0]?.toUpperCase() || 'U'}
        </div>
        <div className="game-hud__user-details">
          <div className="text-sm font-medium">{username}</div>
          <div className="text-xs text-gray-600">
            {careerTitle}
          </div>
        </div>
      </div>
      
      <div className="game-hud__stats">
        <div className="game-hud__stat">
          <div className="text-xs text-gray-600">Level</div>
          <div className="text-xl font-bold">{currentLevel}</div>
        </div>
        <div className="game-hud__stat">
          <div className="text-xs text-gray-600">Reputation</div>
          <div className="text-lg font-semibold">
            {reputationPoints.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/components/organisms/GameHUD/index.ts
```ts
export { GameHUD } from './GameHUD';
export type { GameHUDProps } from './GameHUD';
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/components/organisms/MeetingRoom/MeetingRoom.types.ts
```ts
import { Question } from '../../molecules/QuestionCard';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
}

export interface DialogueEntry {
  id: string;
  speaker: string;
  text: string;
  timestamp: number;
  type: 'question' | 'response' | 'narration';
}

export interface MeetingRoomProps {
  teamMembers: TeamMember[];
  availableQuestions: Question[];
  selectedQuestions: string[];
  maxQuestions: number;
  dialogueHistory: DialogueEntry[];
  onQuestionSelect: (questionId: string) => void;
  onProceedToDesign: () => void;
  className?: string;
}
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/components/organisms/MetricsDashboard/index.ts
```ts
export { MetricsDashboard } from './MetricsDashboard';
export type { MetricsDashboardProps } from './MetricsDashboard';
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/components/organisms/MetricsDashboard/MetricsDashboard.tsx
```tsx
import React from 'react';
import { clsx } from 'clsx';

export interface MetricData {
  label: string;
  value: number;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  max?: number;
  status?: 'normal' | 'warning' | 'critical';
}

export interface MetricsDashboardProps {
  title?: string;
  metrics: MetricData[];
  status?: 'normal' | 'warning' | 'critical';
}

export const MetricsDashboard: React.FC<MetricsDashboardProps> = ({
  title = 'System Metrics',
  metrics,
  status = 'normal',
}) => {
  return (
    <div className="metrics-dashboard">
      <div className="metrics-dashboard__header">
        <h3 className="metrics-dashboard__title">{title}</h3>
        <div className="metrics-dashboard__status">
          <div className={clsx(
            'metrics-dashboard__status-indicator',
            status === 'warning' && 'metrics-dashboard__status-indicator--warning',
            status === 'critical' && 'metrics-dashboard__status-indicator--critical'
          )} />
          <span className="text-sm capitalize">{status}</span>
        </div>
      </div>

      <div className="metrics-dashboard__body">
        {metrics.map((metric, index) => (
          <MetricCard key={index} metric={metric} />
        ))}
      </div>
    </div>
  );
};

interface MetricCardProps {
  metric: MetricData;
}

const MetricCard: React.FC<MetricCardProps> = ({ metric }) => {
  const progressPercentage = metric.max ? (metric.value / metric.max) * 100 : 0;
  const progressStatus = 
    progressPercentage >= 90 ? 'critical' :
    progressPercentage >= 70 ? 'warning' :
    'normal';

  return (
    <div className="metric-card">
      <div className="metric-card__header">
        <span className="metric-card__label">{metric.label}</span>
        {metric.trend && (
          <div className={clsx(
            'metric-card__trend',
            `metric-card__trend--${metric.trend}`
          )}>
            {metric.trend === 'up' ? '↑' : metric.trend === 'down' ? '↓' : '→'}
            {metric.trendValue && <span className="ml-1">{metric.trendValue}</span>}
          </div>
        )}
      </div>
      
      <div className="metric-card__value">
        {metric.value.toLocaleString()}
        {metric.unit && (
          <span className="metric-card__unit">{metric.unit}</span>
        )}
      </div>

      {metric.max && (
        <div className="metric-card__progress">
          <div
            className={clsx(
              'metric-card__progress-bar',
              progressStatus === 'warning' && 'metric-card__progress-bar--warning',
              progressStatus === 'critical' && 'metric-card__progress-bar--critical'
            )}
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          />
        </div>
      )}
    </div>
  );
};
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/components/organisms/index.ts
```ts
export { AchievementToast } from './AchievementToast';
export { CareerMap } from './CareerMap';
export { ComponentDrawer } from './ComponentDrawer';
export { GameHUD } from './GameHUD';
export { MetricsDashboard } from './MetricsDashboard';
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/components/pages/BattlePage/BattlePage.tsx
```tsx
import React from 'react';
import { useAppSelector, useAppDispatch } from '../../../hooks/redux';
import { BattleTemplate } from '../../templates/BattleTemplate';
import { Button } from '../../atoms/Button';
import { Card } from '../../atoms/Card';
import { Progress } from '../../atoms/Progress';
import styles from './BattlePage.module.css';

/**
 * BattlePage - System architecture battle page
 * 
 * Redux State Management:
 * - battle.isActive: Whether a battle is in progress
 * - battle.playerActions: Available player actions this turn
 * - battle.enemyActions: Enemy's queued actions
 * - battle.turnTimer: Time remaining for current turn
 * - battle.rewards: Potential rewards for winning
 */
export const BattlePage: React.FC = () => {
  const dispatch = useAppDispatch();
  
  // Redux state selectors
  const battle = useAppSelector((state) => state.battle);
  const playerActions = useAppSelector((state) => state.battle.playerActions);
  const turnTimer = useAppSelector((state) => state.battle.turnTimer);

  const handleAction = (actionId: string) => {
    // Dispatch battle action
    dispatch({ type: 'battle/executeAction', payload: actionId });
  };

  return (
    <BattleTemplate>
      <div className={styles.battleControls}>
        <Card className={styles.actionPanel}>
          <h3>System Actions</h3>
          <div className={styles.actions}>
            {playerActions.map((action) => (
              <Button
                key={action.id}
                onClick={() => handleAction(action.id)}
                variant={action.type === 'attack' ? 'destructive' : 'default'}
                disabled={!action.available}
              >
                {action.name}
              </Button>
            ))}
          </div>
        </Card>
        
        <Card className={styles.statusPanel}>
          <h3>Battle Status</h3>
          <div className={styles.timer}>
            <span>Turn Timer</span>
            <Progress value={turnTimer} max={30} />
          </div>
        </Card>
      </div>
    </BattleTemplate>
  );
};

export default BattlePage;
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/components/pages/BattlePage/index.ts
```ts
export { BattlePage } from './BattlePage';
export default BattlePage;
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/components/pages/DesignPage/DesignPage.tsx
```tsx
import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../../hooks/redux';
import { DesignPhaseTemplate } from '../../templates/DesignPhaseTemplate';
import { ComponentDrawer } from '../../organisms/ComponentDrawer';
import { MetricsDashboard } from '../../organisms/MetricsDashboard';
import styles from './DesignPage.module.css';

/**
 * DesignPage
 * 
 * Purpose: System architecture design phase page
 * 
 * State Management:
 * - Connects to Redux design slice for nodes/edges
 * - Local state for UI concerns (search, drag state)
 * - Manages design validation and metrics
 * - Orchestrates between drawer, canvas, and metrics
 * 
 * Redux connections:
 * - Reads: design.nodes, design.edges, design.totalCost, design.isValidDesign
 * - Writes: addNode, deleteNode, addEdge, updateNode
 */

export const DesignPage: React.FC = () => {
  const dispatch = useAppDispatch();
  
  // Local UI state
  const [searchQuery, setSearchQuery] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  
  // Redux state selectors
  const designState = useAppSelector(state => state.design);
  const requirements = useAppSelector(state => state.meeting.modifiedRequirements);
  const budget = useAppSelector(state => state.meeting.budget);
  
  const handleComponentDragStart = (component: any) => {
    setIsDragging(true);
    console.log('Dragging component:', component);
  };
  
  const handleComponentDragEnd = () => {
    setIsDragging(false);
  };
  
  // Mock data for now
  const availableComponents = [
    { id: '1', name: 'Web Server', category: 'compute', cost: 100 },
    { id: '2', name: 'Database', category: 'storage', cost: 200 },
  ];
  
  const categories = [
    { id: 'compute', name: 'Compute', icon: 'server' },
    { id: 'storage', name: 'Storage', icon: 'database' },
  ];
  
  const metrics = {
    totalCost: designState.totalCost || 0,
    totalCapacity: 0,
    estimatedLatency: 0,
    reliability: 0,
  };
  
  return (
    <DesignPhaseTemplate
      header={<h1>System Design Phase</h1>}
      sidebar={
        <ComponentDrawer
          components={availableComponents}
          categories={categories}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onComponentDragStart={handleComponentDragStart}
          onComponentDragEnd={handleComponentDragEnd}
        />
      }
      canvas={
        <div className={styles.canvasPlaceholder}>
          Design canvas (React Flow) will be implemented here
        </div>
      }
      metrics={
        <MetricsDashboard
          metrics={metrics}
          requirements={requirements || []}
          budget={budget || 10000}
        />
      }
    />
  );
};
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/components/pages/DesignPage/index.ts
```ts
export { DesignPage } from './DesignPage';
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/components/pages/GamePage/GamePage.tsx
```tsx
import React from 'react';
import { useAppSelector, useAppDispatch } from '../../../hooks/redux';
import { MapTemplate } from '../../templates/MapTemplate';
import { ComponentDrawer } from '../../organisms/ComponentDrawer';
import styles from './GamePage.module.css';

/**
 * GamePage - Main gameplay page showing the career map
 * 
 * Redux State Management:
 * - game.currentLocation: Player's position on the map
 * - game.availableActions: Actions available at current location
 * - ui.showComponentDrawer: Component discovery drawer state
 * - game.inventory: Player's collected components
 */
export const GamePage: React.FC = () => {
  const dispatch = useAppDispatch();
  
  // Redux state selectors
  const currentLocation = useAppSelector((state) => state.game.currentLocation);
  const availableActions = useAppSelector((state) => state.game.availableActions);
  const showDrawer = useAppSelector((state) => state.ui.showComponentDrawer);
  const inventory = useAppSelector((state) => state.game.inventory);

  return (
    <MapTemplate>
      <div className={styles.gameContent}>
        {/* Location-specific content and interactions */}
        {currentLocation && (
          <div className={styles.locationInfo}>
            <h2>{currentLocation.name}</h2>
            <p>{currentLocation.description}</p>
          </div>
        )}
        
        {/* Component discovery drawer */}
        {showDrawer && <ComponentDrawer />}
      </div>
    </MapTemplate>
  );
};

export default GamePage;
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/components/pages/GamePage/index.ts
```ts
export { GamePage } from './GamePage';
export default GamePage;
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/components/pages/MainMenuPage/index.ts
```ts
export { MainMenuPage } from './MainMenuPage';
export default MainMenuPage;
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/components/pages/MainMenuPage/MainMenuPage.tsx
```tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../../hooks/redux';
import { MenuTemplate } from '../../templates/MenuTemplate';
import { Button } from '../../atoms/Button';
import { Card } from '../../atoms/Card';
import styles from './MainMenuPage.module.css';

/**
 * MainMenuPage - Game main menu
 * 
 * Redux State Management:
 * - auth.isAuthenticated: User authentication status
 * - game.hasSaveGame: Whether user has existing save
 * - ui.menuAnimation: Menu transition states
 * - settings.soundEnabled: Audio settings for menu sounds
 */
export const MainMenuPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  // Redux state selectors
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const hasSaveGame = useAppSelector((state) => state.game.hasSaveGame);
  const soundEnabled = useAppSelector((state) => state.settings.soundEnabled);

  const handleNewGame = () => {
    dispatch({ type: 'game/newGame' });
    navigate('/game');
  };

  const handleContinue = () => {
    dispatch({ type: 'game/loadSave' });
    navigate('/game');
  };

  const handleSettings = () => {
    navigate('/settings');
  };

  return (
    <MenuTemplate>
      <Card className={styles.menuCard}>
        <div className={styles.menuOptions}>
          {hasSaveGame && (
            <Button
              onClick={handleContinue}
              size="lg"
              className={styles.menuButton}
            >
              Continue Game
            </Button>
          )}
          
          <Button
            onClick={handleNewGame}
            size="lg"
            variant={hasSaveGame ? 'outline' : 'default'}
            className={styles.menuButton}
          >
            New Game
          </Button>
          
          <Button
            onClick={handleSettings}
            size="lg"
            variant="outline"
            className={styles.menuButton}
          >
            Settings
          </Button>
          
          {!isAuthenticated && (
            <Button
              onClick={() => navigate('/auth/login')}
              size="lg"
              variant="secondary"
              className={styles.menuButton}
            >
              Login / Register
            </Button>
          )}
        </div>
      </Card>
    </MenuTemplate>
  );
};

export default MainMenuPage;
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/components/pages/MeetingPage/index.ts
```ts
export { MeetingPage } from './MeetingPage';
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/components/pages/MeetingPage/MeetingPage.tsx
```tsx
import React from 'react';
import { useAppSelector, useAppDispatch } from '../../../hooks/redux';
import { MeetingPhaseTemplate } from '../../templates/MeetingPhaseTemplate';
import { MeetingRoom } from '../../organisms/MeetingRoom';
import styles from './MeetingPage.module.css';

/**
 * MeetingPage
 * 
 * Purpose: Requirements gathering phase page component
 * 
 * State Management:
 * - Connects to Redux meeting slice for questions and dialogue
 * - Manages phase transitions through game slice
 * - Handles question selection and dialogue updates
 * - Passes formatted data to template and organisms
 * 
 * Redux connections:
 * - Reads: meeting.availableQuestions, meeting.selectedQuestions, meeting.dialogueHistory
 * - Writes: selectQuestion, addDialogueEntry, transitionPhase
 */

export const MeetingPage: React.FC = () => {
  const dispatch = useAppDispatch();
  
  // Redux state selectors
  const meetingState = useAppSelector(state => state.meeting);
  const gameState = useAppSelector(state => state.game);
  
  const handleQuestionSelect = (questionId: string) => {
    // Dispatch action to select question
    console.log('Question selected:', questionId);
    // dispatch(selectQuestion(questionId));
  };
  
  const handleProceedToMentorSelection = () => {
    // Transition to next phase
    console.log('Proceeding to mentor selection');
    // dispatch(transitionPhase('mentor-selection'));
  };
  
  const meetingData = {
    teamMembers: meetingState.teamMembers || [],
    availableQuestions: meetingState.availableQuestions || [],
    selectedQuestions: meetingState.selectedQuestions || [],
    maxQuestions: meetingState.maxQuestions || 3,
    questionsRemaining: meetingState.questionsRemaining || 3,
    dialogueHistory: meetingState.dialogueHistory || [],
  };
  
  return (
    <MeetingPhaseTemplate
      meetingData={meetingData}
      onQuestionSelect={handleQuestionSelect}
      onProceedToMentorSelection={handleProceedToMentorSelection}
    >
      {/* MeetingRoom organism will be rendered here when complete */}
      <div className={styles.meetingContent}>
        <p>Meeting room implementation will go here</p>
      </div>
    </MeetingPhaseTemplate>
  );
};
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/components/pages/index.ts
```ts
export { GamePage } from './GamePage';
export { BattlePage } from './BattlePage';
export { MainMenuPage } from './MainMenuPage';
export { MeetingPage } from './MeetingPage';
export { DesignPage } from './DesignPage';
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/components/templates/BattleTemplate/BattleTemplate.tsx
```tsx
import React from 'react';
import { useAppSelector, useAppDispatch } from '../../../hooks/redux';

interface BattleTemplateProps {
  children?: React.ReactNode;
}

/**
 * BattleTemplate - Template for system architecture battles
 * 
 * Redux State Management:
 * - battle.currentBattle: Active battle state and participants
 * - battle.playerHealth: Player's system health/integrity
 * - battle.enemyHealth: Opponent's system health
 * - battle.turnOrder: Current turn and action queue
 * - battle.availableActions: Player's available moves
 * - battle.battleLog: History of battle actions
 */
export const BattleTemplate: React.FC<BattleTemplateProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  
  // Redux state selectors
  const currentBattle = useAppSelector((state) => state.battle.currentBattle);
  const playerHealth = useAppSelector((state) => state.battle.playerHealth);
  const enemyHealth = useAppSelector((state) => state.battle.enemyHealth);
  const turnOrder = useAppSelector((state) => state.battle.turnOrder);
  const battleLog = useAppSelector((state) => state.battle.battleLog);

  return (
    <div className="battle-template">
      <header className="battle-template__header">
        <h1>System Architecture Battle</h1>
      </header>
      
      <main className="battle-template__content">
        {children}
      </main>
      
      <footer className="battle-template__footer">
        {/* Battle controls and status */}
      </footer>
    </div>
  );
};

export default BattleTemplate;
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/components/templates/BattleTemplate/index.ts
```ts
export { BattleTemplate } from './BattleTemplate';
export type { BattleTemplateProps } from './BattleTemplate';
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/components/templates/DesignPhaseTemplate/DesignPhaseTemplate.tsx
```tsx
import React from 'react';
import { ReactFlowProvider } from '@xyflow/react';

/**
 * DesignPhaseTemplate
 * 
 * Purpose: Layout template for the system design phase
 * 
 * State Management:
 * - Pure presentational template
 * - ReactFlowProvider for canvas context
 * - All design state passed from page component
 * - No direct Redux connections
 */

interface DesignPhaseTemplateProps {
  sidebar?: React.ReactNode;
  canvas?: React.ReactNode;
  metrics?: React.ReactNode;
  mentor?: React.ReactNode;
  header?: React.ReactNode;
}

export const DesignPhaseTemplate: React.FC<DesignPhaseTemplateProps> = ({
  sidebar,
  canvas,
  metrics,
  mentor,
  header
}) => {
  return (
    <ReactFlowProvider>
      <div className="design-phase-template">
        {header && (
          <header className="design-phase-template__header">
            {header}
          </header>
        )}
        
        <div className="design-phase-template__workspace">
          {sidebar && (
            <aside className="design-phase-template__sidebar">
              {sidebar}
            </aside>
          )}
          
          <main className="design-phase-template__canvas">
            {canvas || (
              <div className="design-phase-template__placeholder">
                Design canvas will be rendered here
              </div>
            )}
          </main>
          
          {metrics && (
            <aside className="design-phase-template__metrics">
              {metrics}
            </aside>
          )}
        </div>
        
        {mentor && (
          <div className="design-phase-template__mentor">
            {mentor}
          </div>
        )}
      </div>
    </ReactFlowProvider>
  );
};
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/components/templates/DesignPhaseTemplate/index.ts
```ts
export { DesignPhaseTemplate } from './DesignPhaseTemplate';
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/components/templates/HudTemplate/HudTemplate.tsx
```tsx
import React from 'react';
import { useAppSelector } from '../../../hooks/redux';
import GameHUD from '../../organisms/GameHUD';

interface HudTemplateProps {
  children?: React.ReactNode;
  showMetrics?: boolean;
}

/**
 * HudTemplate - Basic template with HUD for game screens
 * 
 * Redux State Management:
 * - game.player: Player stats and resources
 * - game.metrics: Performance metrics and scores
 * - ui.notifications: Active notifications/toasts
 * - ui.hudSettings: HUD display preferences
 */
export const HudTemplate: React.FC<HudTemplateProps> = ({ 
  children,
  showMetrics = true 
}) => {
  // Redux state selectors
  const player = useAppSelector((state) => state.game.player);
  const metrics = useAppSelector((state) => state.game.metrics);
  const notifications = useAppSelector((state) => state.ui.notifications);

  return (
    <div className="hud-template">
      <div className="hud-template__hud">
        <GameHUD showMetrics={showMetrics} />
      </div>
      <main className="hud-template__content">
        {children}
      </main>
    </div>
  );
};

export default HudTemplate;
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/components/templates/HudTemplate/index.ts
```ts
export { HudTemplate } from './HudTemplate';
export type { HudTemplateProps } from './HudTemplate';
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/components/templates/MapTemplate/index.ts
```ts
export { MapTemplate } from './MapTemplate';
export type { MapTemplateProps } from './MapTemplate';
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/components/templates/MapTemplate/MapTemplate.tsx
```tsx
import React from 'react';
import { useAppSelector } from '../../../hooks/redux';
import GameHUD from '../../organisms/GameHUD';
import CareerMap from '../../organisms/CareerMap';

interface MapTemplateProps {
  children?: React.ReactNode;
}

/**
 * MapTemplate - Template for the main game map view
 * 
 * Redux State Management:
 * - game.player: Current player data and stats
 * - game.currentLocation: Player's current position on map
 * - game.unlockedLocations: Available locations to travel to
 * - ui.activeModal: Current modal/dialog state
 */
export const MapTemplate: React.FC<MapTemplateProps> = ({ children }) => {
  // Redux state selectors
  const player = useAppSelector((state) => state.game.player);
  const currentLocation = useAppSelector((state) => state.game.currentLocation);
  const unlockedLocations = useAppSelector((state) => state.game.unlockedLocations);

  return (
    <div className="map-template">
      <div className="map-template__hud">
        <GameHUD />
      </div>
      <main className="map-template__content">
        <CareerMap 
          currentLocation={currentLocation}
          unlockedLocations={unlockedLocations}
        />
        {children}
      </main>
    </div>
  );
};

export default MapTemplate;
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/components/templates/MeetingPhaseTemplate/index.ts
```ts
export { MeetingPhaseTemplate } from './MeetingPhaseTemplate';
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/components/templates/MeetingPhaseTemplate/MeetingPhaseTemplate.tsx
```tsx
import React from 'react';

/**
 * MeetingPhaseTemplate
 * 
 * Purpose: Layout template for the requirements gathering phase
 * 
 * State Management:
 * - Pure presentational template
 * - All state passed via props from page component
 * - No local state or Redux connections
 * 
 * Props receive game state from pages that use this template
 */

interface MeetingPhaseTemplateProps {
  meetingData: any; // Will be properly typed when implementing
  onQuestionSelect: (questionId: string) => void;
  onProceedToMentorSelection: () => void;
  children?: React.ReactNode;
}

export const MeetingPhaseTemplate: React.FC<MeetingPhaseTemplateProps> = ({
  meetingData,
  onQuestionSelect,
  onProceedToMentorSelection,
  children
}) => {
  return (
    <div className="meeting-phase-template">
      <header className="meeting-phase-template__header">
        <h1>Requirements Gathering</h1>
        {/* Timer and other header content will be added */}
      </header>
      
      <main className="meeting-phase-template__content">
        {children || (
          <div className="design-phase-template__placeholder">
            Meeting room content will be rendered here
          </div>
        )}
      </main>
      
      <footer className="meeting-phase-template__footer">
        <button onClick={onProceedToMentorSelection}>
          Proceed to Mentor Selection
        </button>
      </footer>
    </div>
  );
};
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/components/templates/MenuTemplate/index.ts
```ts
export { MenuTemplate } from './MenuTemplate';
export type { MenuTemplateProps } from './MenuTemplate';
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/components/templates/MenuTemplate/MenuTemplate.tsx
```tsx
import React from 'react';
import { useAppSelector } from '../../../hooks/redux';

interface MenuTemplateProps {
  children?: React.ReactNode;
  title?: string;
}

/**
 * MenuTemplate - Template for menu screens (main menu, settings, etc.)
 * 
 * Redux State Management:
 * - ui.menuState: Current menu navigation state
 * - game.saveSlots: Available save game slots
 * - settings: User preferences and game settings
 * - auth.user: Current user authentication state
 */
export const MenuTemplate: React.FC<MenuTemplateProps> = ({ 
  children,
  title = 'System Tycoon' 
}) => {
  // Redux state selectors
  const menuState = useAppSelector((state) => state.ui.menuState);
  const user = useAppSelector((state) => state.auth.user);
  const settings = useAppSelector((state) => state.settings);

  return (
    <div className="menu-template">
      <header className="menu-template__header">
        <h1 className="menu-template__title">{title}</h1>
      </header>
      <main className="menu-template__content">
        {children}
      </main>
      <footer className="menu-template__footer">
        <p className="menu-template__version">v1.0.0</p>
      </footer>
    </div>
  );
};

export default MenuTemplate;
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/components/templates/index.ts
```ts
export { MapTemplate } from './MapTemplate';
export { BattleTemplate } from './BattleTemplate';
export { HudTemplate } from './HudTemplate';
export { MenuTemplate } from './MenuTemplate';
export { MeetingPhaseTemplate } from './MeetingPhaseTemplate';
export { DesignPhaseTemplate } from './DesignPhaseTemplate';
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/components/index.ts
```ts
// Atoms
export * from './atoms';

// Molecules
export * from './molecules';

// Organisms
export * from './organisms';

// Templates
export * from './templates';

// Pages
export * from './pages';

// Layout components
export { RootLayout } from './layout/RootLayout';
export { GameLayout } from './layout/GameLayout';
export { AuthLayout } from './layout/AuthLayout';

// Common components
export { ProtectedRoute } from './common/ProtectedRoute';
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/constants/index.ts
```ts
// Game Constants
export const GAME_CONFIG = {
  MAX_QUESTIONS_PER_MEETING: 3,
  DEFAULT_TIME_LIMIT_SECONDS: 900, // 15 minutes
  MIN_PASSING_SCORE: 60,
  PERFECT_SCORE: 100,
  STARTING_REPUTATION: 0,
  REPUTATION_PER_LEVEL: 100,
} as const;

// Career Titles by Level
export const CAREER_TITLES = [
  'Aspiring Consultant',
  'Junior Developer',
  'System Designer',
  'Solutions Architect',
  'Senior Architect',
  'Principal Engineer',
  'Distinguished Engineer',
  'Industry Expert',
  'Master Architect',
  'System Design Legend',
] as const;

// Component Categories
export const COMPONENT_CATEGORIES = {
  FRONTEND: 'frontend',
  BACKEND: 'backend',
  STORAGE: 'storage',
  NETWORKING: 'networking',
  SECURITY: 'security',
  OPERATIONS: 'operations',
} as const;

// Simulation Phases
export const SIMULATION_PHASES = {
  NORMAL: { name: 'Normal Traffic', multiplier: 1 },
  PEAK: { name: 'Peak Hours', multiplier: 2 },
  VIRAL: { name: 'Viral Spike', multiplier: 10 },
  RECOVERY: { name: 'Recovery', multiplier: 0.5 },
} as const;

// Score Breakdown
export const SCORE_WEIGHTS = {
  REQUIREMENTS_MET: 40,
  PERFORMANCE: 30,
  COST_EFFICIENCY: 20,
  ARCHITECTURE_QUALITY: 10,
} as const;

// Routes
export const ROUTES = {
  HOME: '/',
  AUTH: '/auth',
  SIGN_IN: '/auth/signin',
  SIGN_UP: '/auth/signup',
  CAREER_MAP: '/career',
  MEETING: '/meeting/:scenarioId',
  MENTOR_SELECT: '/mentor/:scenarioId',
  DESIGN: '/design/:scenarioId',
  SIMULATION: '/simulation/:scenarioId',
  RESULTS: '/results/:attemptId',
  PROFILE: '/profile',
  SETTINGS: '/settings',
} as const;

// API Endpoints (if using custom backend)
export const API_ENDPOINTS = {
  AUTH: {
    SIGN_IN: '/api/auth/signin',
    SIGN_UP: '/api/auth/signup',
    SIGN_OUT: '/api/auth/signout',
    REFRESH: '/api/auth/refresh',
  },
  USER: {
    PROFILE: '/api/user/profile',
    STATS: '/api/user/stats',
    ACHIEVEMENTS: '/api/user/achievements',
  },
  GAME: {
    SCENARIOS: '/api/game/scenarios',
    COMPONENTS: '/api/game/components',
    MENTORS: '/api/game/mentors',
    ATTEMPT: '/api/game/attempt',
    PROGRESS: '/api/game/progress',
  },
} as const;

// OAuth Providers
export const OAUTH_PROVIDERS = {
  GOOGLE: {
    name: 'Google',
    icon: 'google',
    color: '#4285F4',
  },
  GITHUB: {
    name: 'GitHub',
    icon: 'github',
    color: '#333333',
  },
  LINKEDIN: {
    name: 'LinkedIn',
    icon: 'linkedin',
    color: '#0077B5',
  },
} as const;

// Theme Colors
export const THEME_COLORS = {
  primary: '#3B82F6', // Blue
  secondary: '#10B981', // Green
  accent: '#8B5CF6', // Purple
  warning: '#F59E0B', // Orange
  error: '#EF4444', // Red
  success: '#10B981', // Green
  info: '#06B6D4', // Cyan
  neutral: '#6B7280', // Gray
  background: '#FFFFFF',
  surface: '#F9FAFB',
  text: {
    primary: '#111827',
    secondary: '#6B7280',
    inverse: '#FFFFFF',
  },
} as const;

// Animation Durations
export const ANIMATION_DURATIONS = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 1000,
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'system-design-tycoon-auth',
  USER_PREFERENCES: 'system-design-tycoon-prefs',
  GAME_PROGRESS: 'system-design-tycoon-progress',
  TUTORIAL_COMPLETED: 'system-design-tycoon-tutorial',
} as const;
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/constants/mentors.ts
```ts
import { Mentor } from '../types';

export const MENTORS: Record<string, Mentor> = {
  'linda-wu': {
    id: 'linda-wu',
    name: 'Dr. Linda Wu',
    title: 'Senior Systems Architect',
    specialization: 'Foundational architecture patterns and scalability',
    guidanceStyle: 'Patient teacher who explains the "why" behind architectural decisions',
    bestForLevels: [1, 2, 3],
    signatureAdvice: "Let's think about this step by step...",
    unlockLevel: 1,
  },
  'sam-okafor': {
    id: 'sam-okafor',
    name: 'Sam Okafor',
    title: 'Performance Engineer',
    specialization: 'Optimization, caching strategies, and performance tuning',
    guidanceStyle: 'Data-driven, loves metrics and benchmarks',
    bestForLevels: [2, 3, 4],
    signatureAdvice: "The numbers don't lie, here's what the data shows...",
    unlockLevel: 2,
  },
  'maya-patel': {
    id: 'maya-patel',
    name: 'Maya Patel',
    title: 'Cloud Solutions Architect',
    specialization: 'Modern cloud platforms, microservices, and distributed systems',
    guidanceStyle: 'Forward-thinking, prefers cutting-edge solutions',
    bestForLevels: [3, 4, 5],
    signatureAdvice: 'In the cloud, we can leverage...',
    unlockLevel: 3,
  },
  'chen-zhang': {
    id: 'chen-zhang',
    name: 'Chen Zhang',
    title: 'Security Architect',
    specialization: 'Security patterns, compliance frameworks, and risk assessment',
    guidanceStyle: 'Methodical, focuses on threat modeling and defense in depth',
    bestForLevels: [4, 5, 6],
    signatureAdvice: 'From a security standpoint, we need to consider...',
    unlockLevel: 4,
  },
  'jordan-rivera': {
    id: 'jordan-rivera',
    name: 'Jordan Rivera',
    title: 'Startup CTO',
    specialization: 'MVP development, rapid scaling, and technical debt management',
    guidanceStyle: 'Pragmatic, focuses on trade-offs and speed-to-market',
    bestForLevels: [1, 2, 3, 4],
    signatureAdvice: "For an MVP, I'd recommend...",
    unlockLevel: 1,
  },
  'alex-kim': {
    id: 'alex-kim',
    name: 'Alex Kim',
    title: 'Enterprise Architect',
    specialization: 'Large-scale systems, integration patterns, and legacy modernization',
    guidanceStyle: 'Systematic, emphasizes standards and governance',
    bestForLevels: [5, 6, 7, 8],
    signatureAdvice: 'At enterprise scale, governance becomes critical...',
    unlockLevel: 5,
  },
};

export const getMentorById = (id: string): Mentor | undefined => MENTORS[id];

export const getMentorsForLevel = (level: number): Mentor[] => {
  return Object.values(MENTORS).filter(
    mentor => mentor.unlockLevel <= level && mentor.bestForLevels.includes(level)
  );
};

export const getAvailableMentors = (
  level: number,
  scenarioMentorIds?: string[]
): Mentor[] => {
  const levelMentors = getMentorsForLevel(level);
  
  if (scenarioMentorIds && scenarioMentorIds.length > 0) {
    return levelMentors.filter(mentor => scenarioMentorIds.includes(mentor.id));
  }
  
  return levelMentors;
};
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/contexts/ThemeContext.tsx
```tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

export type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = 'light',
}) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme) return savedTheme;
    
    // Check system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    return defaultTheme;
  });

  useEffect(() => {
    // Update document attribute for CSS
    document.documentElement.setAttribute('data-theme', theme);
    
    // Save to localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/features/auth/authSlice.ts
```ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { User, Profile } from '../../types';
import { supabase } from '../../services/supabase';

interface AuthState {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  profile: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
};

// Async thunks
export const signInWithEmail = createAsyncThunk(
  'auth/signInWithEmail',
  async ({ email, password }: { email: string; password: string }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    
    // Fetch profile - using 'id' column instead of 'user_id'
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();
    
    if (profileError) throw profileError;
    
    return { user: data.user, profile };
  }
);

export const signUpWithEmail = createAsyncThunk(
  'auth/signUpWithEmail',
  async ({ email, password, username }: { email: string; password: string; username: string }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
      },
    });
    
    if (error) throw error;
    
    if (data.user) {
      // Create profile record in profiles table - database defaults will handle most fields
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .insert([{
          id: data.user.id,
          username: username,
        }])
        .select()
        .single();
      
      if (profileError) {
        console.error('Profile creation error:', profileError);
        // Don't throw here as the user was created successfully
      }
      
      return { user: data.user, profile };
    }
    
    return { user: data.user };
  }
);

export const signInWithOAuth = createAsyncThunk(
  'auth/signInWithOAuth',
  async (provider: 'google' | 'github' | 'linkedin') => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    
    if (error) throw error;
  }
);

export const signOut = createAsyncThunk(
  'auth/signOut',
  async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }
);

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return null;
    }
    
    // Fetch profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (profileError) {
      console.error('Profile fetch error:', profileError);
      return null;
    }
    
    return { user, profile };
  }
);

export const demoSignIn = createAsyncThunk(
  'auth/demoSignIn',
  async (profileId: string) => {
    // Create a mock user for demo purposes
    const mockUser = {
      id: profileId,
      email: 'demo@example.com',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      aud: 'authenticated',
      role: 'authenticated',
      app_metadata: {},
      user_metadata: {},
    };
    
    // Create a mock profile based on the expected structure
    const mockProfile = {
      id: profileId,
      username: 'hutchenbach',
      display_name: undefined,
      avatar_url: undefined,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      current_level: 1,
      reputation_points: 0,
      career_title: 'Aspiring Developer',
      preferred_mentor_id: undefined,
    };
    
    return { user: mockUser, profile: mockProfile };
  }
);

// Slice definition
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateProfile: (state, action: PayloadAction<Partial<Profile>>) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    // Sign in with email
    builder
      .addCase(signInWithEmail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signInWithEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user as any;
        state.profile = action.payload.profile;
        state.isAuthenticated = true;
      })
      .addCase(signInWithEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to sign in';
      });
    
    // Sign up with email
    builder
      .addCase(signUpWithEmail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signUpWithEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user as any;
        state.profile = action.payload.profile;
        state.isAuthenticated = true;
      })
      .addCase(signUpWithEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to sign up';
      });
    
    // OAuth sign in
    builder
      .addCase(signInWithOAuth.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signInWithOAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'OAuth sign in failed';
      });
    
    // Sign out
    builder
      .addCase(signOut.fulfilled, (state) => {
        state.user = null;
        state.profile = null;
        state.isAuthenticated = false;
      });
    
    // Check auth
    builder
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.user = action.payload.user as any;
          state.profile = action.payload.profile;
          state.isAuthenticated = true;
        }
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
      });
    
    // Demo sign in
    builder
      .addCase(demoSignIn.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(demoSignIn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user as any;
        state.profile = action.payload.profile;
        state.isAuthenticated = true;
      })
      .addCase(demoSignIn.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Demo sign in failed';
      });
  },
});

export const { clearError, updateProfile } = authSlice.actions;
export default authSlice.reducer;
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/features/game/gameSlice.ts
```ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { 
  GameState, 
  Scenario, 
  Component, 
  ScenarioProgress, 
  Mentor,
  Requirement,
  ArchitectureSnapshot,
  PerformanceMetrics,
  ComponentState,
  SimulationPhase,
  ComponentSelection,
  ComponentRequirement,
  InitialNode,
  CollaborationSettings,
} from '../../types';
import { supabase } from '../../services/supabase';

interface GameSliceState extends GameState {
  scenarios: Scenario[];
  components: Component[];
  progress: ScenarioProgress[];
  isLoading: boolean;
  error: string | null;
  // Add camera viewport state for Phaser scene tracking
  careerMapViewport: {
    scrollX: number;
    scrollY: number;
    zoom: number;
    worldWidth: number;
    worldHeight: number;
    viewportWidth: number;
    viewportHeight: number;
  };
  careerMapData: {
    scenarios: any[];
    progress: any[];
    lastUpdate: number;
  };
  // Component Selection State
  selectedComponent: ComponentSelection | null;
}

const initialState: GameSliceState = {
  currentScreen: 'landing',
  scenarios: [],
  components: [],
  progress: [],
  isLoading: false,
  error: null,
  careerMapViewport: {
    scrollX: 0,
    scrollY: 0,
    zoom: 1,
    worldWidth: 2000,
    worldHeight: 1500,
    viewportWidth: 800,
    viewportHeight: 600,
  },
  careerMapData: {
    scenarios: [],
    progress: [],
    lastUpdate: 0,
  },
  selectedComponent: null,
};

// Async thunks
export const fetchScenarios = createAsyncThunk(
  'game/fetchScenarios',
  async () => {
    const { data, error } = await supabase
      .from('scenarios')
      .select('*')
      .order('level', { ascending: true });
    
    if (error) throw error;
    return data;
  }
);

export const fetchComponents = createAsyncThunk(
  'game/fetchComponents',
  async () => {
    const { data, error } = await supabase
      .from('components')
      .select('*')
      .order('min_level', { ascending: true });
    
    if (error) throw error;
    return data;
  }
);

export const fetchUserProgress = createAsyncThunk(
  'game/fetchUserProgress',
  async (userId: string) => {
    const { data, error } = await supabase
      .from('scenario_progress')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    return data;
  }
);

export const startScenario = createAsyncThunk(
  'game/startScenario',
  async (scenarioId: string) => {
    const { data, error } = await supabase
      .from('scenarios')
      .select('*')
      .eq('id', scenarioId)
      .single();
    
    if (error) throw error;
    return data;
  }
);

export const submitDesign = createAsyncThunk(
  'game/submitDesign',
  async ({ 
    scenarioId, 
    architecture, 
    questionsAsked,
    mentorId,
    componentsUsed,
    totalCost,
  }: {
    scenarioId: string;
    architecture: ArchitectureSnapshot;
    questionsAsked: string[];
    mentorId?: string;
    componentsUsed: string[];
    totalCost: number;
  }) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');
    
    // Create scenario attempt
    const { data, error } = await supabase
      .from('scenario_attempts')
      .insert({
        user_id: user.id,
        scenario_id: scenarioId,
        architecture_snapshot: architecture,
        questions_asked: questionsAsked,
        mentor_selected: mentorId,
        components_used: componentsUsed,
        total_cost: totalCost,
        performance_metrics: {}, // Will be updated during simulation
        final_score: 0, // Will be calculated after simulation
        requirements_met: [],
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
);

// Helper function to get component-specific data
const getComponentData = (componentType: string) => {
  const componentConfigs: Record<string, {
    requirements: ComponentRequirement[];
    initialNodes: InitialNode[];
    collaborationSettings: CollaborationSettings;
  }> = {
    api: {
      requirements: [
        {
          id: 'api-latency',
          type: 'performance',
          description: 'API response time should be under 200ms',
          target: 200,
          unit: 'ms',
          priority: 'critical',
        },
        {
          id: 'api-throughput',
          type: 'scalability',
          description: 'Handle at least 1000 requests per second',
          target: 1000,
          unit: 'req/s',
          priority: 'high',
        },
        {
          id: 'api-security',
          type: 'security',
          description: 'Implement authentication and rate limiting',
          target: 100,
          unit: '%',
          priority: 'critical',
        },
      ],
      initialNodes: [
        {
          id: 'api-gateway',
          type: 'custom',
          position: { x: 100, y: 100 },
          data: {
            label: 'API Gateway',
            componentType: 'api-gateway',
            cost: 25,
            capacity: 5000,
            description: 'Manage API requests',
            category: 'networking',
          },
          style: { background: '#4f46e5', color: 'white' },
        },
      ],
      collaborationSettings: {
        maxPlayers: 4,
        allowedRoles: ['architect', 'engineer'],
        consensusRequired: true,
        timeLimit: 1800, // 30 minutes
        allowRealTimeEditing: true,
      },
    },
    cache: {
      requirements: [
        {
          id: 'cache-hit-rate',
          type: 'performance',
          description: 'Achieve 90% cache hit rate',
          target: 90,
          unit: '%',
          priority: 'high',
        },
        {
          id: 'cache-capacity',
          type: 'scalability',
          description: 'Handle 10GB of cached data',
          target: 10,
          unit: 'GB',
          priority: 'medium',
        },
      ],
      initialNodes: [
        {
          id: 'redis-cache',
          type: 'custom',
          position: { x: 100, y: 100 },
          data: {
            label: 'Redis Cache',
            componentType: 'cache',
            cost: 30,
            capacity: 10000,
            description: 'Speed up data access',
            category: 'storage',
          },
          style: { background: '#dc2626', color: 'white' },
        },
      ],
      collaborationSettings: {
        maxPlayers: 3,
        allowedRoles: ['architect', 'engineer'],
        consensusRequired: false,
        timeLimit: 1200, // 20 minutes
        allowRealTimeEditing: true,
      },
    },
    compute: {
      requirements: [
        {
          id: 'compute-utilization',
          type: 'performance',
          description: 'Maintain CPU utilization under 80%',
          target: 80,
          unit: '%',
          priority: 'high',
        },
        {
          id: 'compute-auto-scaling',
          type: 'scalability',
          description: 'Auto-scale based on demand',
          target: 100,
          unit: '%',
          priority: 'critical',
        },
      ],
      initialNodes: [
        {
          id: 'compute-instance',
          type: 'custom',
          position: { x: 100, y: 100 },
          data: {
            label: 'Compute Instance',
            componentType: 'compute',
            cost: 80,
            capacity: 800,
            description: 'General computation',
            category: 'compute',
          },
          style: { background: '#059669', color: 'white' },
        },
      ],
      collaborationSettings: {
        maxPlayers: 4,
        allowedRoles: ['architect', 'engineer', 'reviewer'],
        consensusRequired: true,
        timeLimit: 2400, // 40 minutes
        allowRealTimeEditing: true,
      },
    },
    database: {
      requirements: [
        {
          id: 'db-availability',
          type: 'reliability',
          description: 'Maintain 99.9% uptime',
          target: 99.9,
          unit: '%',
          priority: 'critical',
        },
        {
          id: 'db-backup',
          type: 'reliability',
          description: 'Automated backups every 6 hours',
          target: 6,
          unit: 'hours',
          priority: 'high',
        },
      ],
      initialNodes: [
        {
          id: 'primary-database',
          type: 'custom',
          position: { x: 100, y: 100 },
          data: {
            label: 'Primary Database',
            componentType: 'database',
            cost: 100,
            capacity: 500,
            description: 'Store and retrieve data',
            category: 'storage',
          },
          style: { background: '#dc2626', color: 'white' },
        },
      ],
      collaborationSettings: {
        maxPlayers: 3,
        allowedRoles: ['architect', 'engineer'],
        consensusRequired: true,
        timeLimit: 2100, // 35 minutes
        allowRealTimeEditing: false, // More careful editing for databases
      },
    },
    load_balancer: {
      requirements: [
        {
          id: 'lb-distribution',
          type: 'performance',
          description: 'Evenly distribute traffic across instances',
          target: 95,
          unit: '%',
          priority: 'critical',
        },
        {
          id: 'lb-health-checks',
          type: 'reliability',
          description: 'Detect unhealthy instances within 30 seconds',
          target: 30,
          unit: 'seconds',
          priority: 'high',
        },
      ],
      initialNodes: [
        {
          id: 'application-lb',
          type: 'custom',
          position: { x: 100, y: 100 },
          data: {
            label: 'Load Balancer',
            componentType: 'load_balancer',
            cost: 75,
            capacity: 2000,
            description: 'Distribute traffic',
            category: 'networking',
          },
          style: { background: '#4f46e5', color: 'white' },
        },
      ],
      collaborationSettings: {
        maxPlayers: 3,
        allowedRoles: ['architect', 'engineer'],
        consensusRequired: false,
        timeLimit: 1500, // 25 minutes
        allowRealTimeEditing: true,
      },
    },
  };

  return componentConfigs[componentType] || componentConfigs.api; // fallback to api
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setCurrentScreen: (state, action: PayloadAction<GameState['currentScreen']>) => {
      state.currentScreen = action.payload;
    },
    setCurrentScenario: (state, action: PayloadAction<Scenario>) => {
      state.currentScenario = action.payload;
    },
    selectMentor: (state, action: PayloadAction<Mentor>) => {
      state.selectedMentor = action.payload;
    },
    updateMeetingPhase: (state, action: PayloadAction<Partial<GameState['meetingPhase']>>) => {
      state.meetingPhase = {
        ...state.meetingPhase,
        ...action.payload,
      } as GameState['meetingPhase'];
    },
    addRequirement: (state, action: PayloadAction<Requirement>) => {
      if (state.meetingPhase) {
        state.meetingPhase.currentRequirements.push(action.payload);
      }
    },
    askQuestion: (state, action: PayloadAction<string>) => {
      if (state.meetingPhase) {
        state.meetingPhase.questionsAsked.push(action.payload);
        state.meetingPhase.questionsRemaining -= 1;
      }
    },
    updateDesignPhase: (state, action: PayloadAction<Partial<GameState['designPhase']>>) => {
      state.designPhase = {
        ...state.designPhase,
        ...action.payload,
      } as GameState['designPhase'];
    },
    updateArchitecture: (state, action: PayloadAction<ArchitectureSnapshot>) => {
      if (state.designPhase) {
        state.designPhase.architecture = action.payload;
      }
    },
    updateSimulationPhase: (state, action: PayloadAction<Partial<GameState['simulationPhase']>>) => {
      state.simulationPhase = {
        ...state.simulationPhase,
        ...action.payload,
      } as GameState['simulationPhase'];
    },
    updateComponentState: (state, action: PayloadAction<{ id: string; state: ComponentState }>) => {
      if (state.simulationPhase) {
        state.simulationPhase.componentStates[action.payload.id] = action.payload.state;
      }
    },
    updatePerformanceMetrics: (state, action: PayloadAction<PerformanceMetrics>) => {
      if (state.simulationPhase) {
        state.simulationPhase.metrics = action.payload;
      }
    },
    setSimulationPhase: (state, action: PayloadAction<SimulationPhase>) => {
      if (state.simulationPhase) {
        state.simulationPhase.currentPhase = action.payload;
      }
    },
    updateCareerMapViewport: (state, action: PayloadAction<{
      scrollX: number;
      scrollY: number;
      zoom: number;
      worldWidth: number;
      worldHeight: number;
      viewportWidth: number;
      viewportHeight: number;
    }>) => {
      state.careerMapViewport = action.payload;
    },
    
    updateCareerMapData: (state, action: PayloadAction<{ scenarios: any[]; progress: any[] }>) => {
      state.careerMapData = {
        scenarios: action.payload.scenarios,
        progress: action.payload.progress,
        lastUpdate: Date.now(),
      };
    },
    
    // Component Selection Actions
    selectComponentForMode: (state, action: PayloadAction<{
      componentType: string;
      mode: 'mentor' | 'collaboration';
      scenarioId: string;
    }>) => {
      const { componentType, mode, scenarioId } = action.payload;
      
      // Define component-specific requirements and initial nodes
      const componentData = getComponentData(componentType);
      
      state.selectedComponent = {
        componentType,
        mode,
        scenarioId,
        requirements: componentData.requirements,
        initialNodes: componentData.initialNodes,
        collaborationSettings: mode === 'collaboration' ? componentData.collaborationSettings : undefined,
        selectedAt: Date.now(),
      };
    },
    
    clearComponentSelection: (state) => {
      state.selectedComponent = null;
    },
    
    updateCollaborationSettings: (state, action: PayloadAction<Partial<CollaborationSettings>>) => {
      if (state.selectedComponent && state.selectedComponent.mode === 'collaboration') {
        state.selectedComponent.collaborationSettings = {
          ...state.selectedComponent.collaborationSettings!,
          ...action.payload,
        };
      }
    },
    
    resetGameState: (state) => {
      state.currentScenario = undefined;
      state.meetingPhase = undefined;
      state.designPhase = undefined;
      state.simulationPhase = undefined;
      state.selectedMentor = undefined;
    },
  },
  extraReducers: (builder) => {
    // Fetch scenarios
    builder
      .addCase(fetchScenarios.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchScenarios.fulfilled, (state, action) => {
        state.isLoading = false;
        state.scenarios = action.payload;
      })
      .addCase(fetchScenarios.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch scenarios';
      });
    
    // Fetch components
    builder
      .addCase(fetchComponents.fulfilled, (state, action) => {
        state.components = action.payload;
      });
    
    // Fetch user progress
    builder
      .addCase(fetchUserProgress.fulfilled, (state, action) => {
        state.progress = action.payload;
      });
    
    // Start scenario
    builder
      .addCase(startScenario.fulfilled, (state, action) => {
        state.currentScenario = action.payload;
        state.currentScreen = 'meeting';
        state.meetingPhase = {
          questionsRemaining: 3,
          questionsAsked: [],
          currentRequirements: action.payload.base_requirements || [],
          budget: action.payload.budget_limit,
          timeline: action.payload.time_limit_seconds,
        };
      });
  },
});

export const {
  setCurrentScreen,
  setCurrentScenario,
  selectMentor,
  updateMeetingPhase,
  addRequirement,
  askQuestion,
  updateDesignPhase,
  updateArchitecture,
  updateSimulationPhase,
  updateComponentState,
  updatePerformanceMetrics,
  setSimulationPhase,
  updateCareerMapViewport,
  updateCareerMapData,
  selectComponentForMode,
  clearComponentSelection,
  updateCollaborationSettings,
  resetGameState,
} = gameSlice.actions;

// Selectors for camera viewport state
export const selectCareerMapViewport = (state: any) => state.game.careerMapViewport;

export const selectCareerMapData = (state: any) => state.game.careerMapData;

export const selectIsAssetOnLeftSide = (worldX: number) => (state: any) => {
  const viewport = state.game.careerMapViewport;
  const screenX = worldX - viewport.scrollX;
  const viewportCenterX = viewport.viewportWidth / 2;
  return screenX < viewportCenterX;
};

// Component Selection Selectors
export const selectSelectedComponent = (state: any) => state.game.selectedComponent;

export const selectIsCollaborationMode = (state: any) => 
  state.game.selectedComponent?.mode === 'collaboration';

export const selectComponentRequirements = (state: any) => 
  state.game.selectedComponent?.requirements || [];

export const selectComponentInitialNodes = (state: any) => 
  state.game.selectedComponent?.initialNodes || [];

export const selectCollaborationSettings = (state: any) => 
  state.game.selectedComponent?.collaborationSettings;

export const selectSelectedComponentType = (state: any) => 
  state.game.selectedComponent?.componentType;

export default gameSlice.reducer;
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/features/user/userSlice.ts
```ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { UserStats, Achievement, UserAchievement, ComponentMastery } from '../../types';
import { supabase } from '../../services/supabase';

interface UserSliceState {
  stats: UserStats | null;
  achievements: Achievement[];
  userAchievements: UserAchievement[];
  componentMastery: ComponentMastery[];
  isLoading: boolean;
  error: string | null;
}

const initialState: UserSliceState = {
  stats: null,
  achievements: [],
  userAchievements: [],
  componentMastery: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchUserStats = createAsyncThunk(
  'user/fetchStats',
  async (userId: string) => {
    const { data, error } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) throw error;
    return data;
  }
);

export const fetchAchievements = createAsyncThunk(
  'user/fetchAchievements',
  async () => {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    return data;
  }
);

export const fetchUserAchievements = createAsyncThunk(
  'user/fetchUserAchievements',
  async (userId: string) => {
    const { data, error } = await supabase
      .from('user_achievements')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    return data;
  }
);

export const fetchComponentMastery = createAsyncThunk(
  'user/fetchComponentMastery',
  async (userId: string) => {
    const { data, error } = await supabase
      .from('component_mastery')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    return data;
  }
);

export const updateComponentMastery = createAsyncThunk(
  'user/updateComponentMastery',
  async ({ userId, componentId, success }: {
    userId: string;
    componentId: string;
    success: boolean;
  }) => {
    // First, try to get existing mastery
    const { data: existing } = await supabase
      .from('component_mastery')
      .select('*')
      .eq('user_id', userId)
      .eq('component_id', componentId)
      .single();
    
    if (existing) {
      // Update existing mastery
      const timesUsed = existing.times_used + 1;
      const successfulUses = success ? existing.successful_uses + 1 : existing.successful_uses;
      
      // Calculate new mastery level
      let masteryLevel: ComponentMastery['masteryLevel'] = 'novice';
      if (successfulUses >= 20) masteryLevel = 'gold';
      else if (successfulUses >= 10) masteryLevel = 'silver';
      else if (successfulUses >= 5) masteryLevel = 'bronze';
      
      const { data, error } = await supabase
        .from('component_mastery')
        .update({
          times_used: timesUsed,
          successful_uses: successfulUses,
          mastery_level: masteryLevel,
          last_used_at: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .eq('component_id', componentId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } else {
      // Create new mastery record
      const { data, error } = await supabase
        .from('component_mastery')
        .insert({
          user_id: userId,
          component_id: componentId,
          mastery_level: 'novice',
          times_used: 1,
          successful_uses: success ? 1 : 0,
          last_used_at: new Date().toISOString(),
          unlocked_at: new Date().toISOString(),
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addAchievement: (state, action: PayloadAction<UserAchievement>) => {
      state.userAchievements.push(action.payload);
    },
    updateStats: (state, action: PayloadAction<Partial<UserStats>>) => {
      if (state.stats) {
        state.stats = { ...state.stats, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch user stats
    builder
      .addCase(fetchUserStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload;
      })
      .addCase(fetchUserStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch user stats';
      });
    
    // Fetch achievements
    builder
      .addCase(fetchAchievements.fulfilled, (state, action) => {
        state.achievements = action.payload;
      });
    
    // Fetch user achievements
    builder
      .addCase(fetchUserAchievements.fulfilled, (state, action) => {
        state.userAchievements = action.payload;
      });
    
    // Fetch component mastery
    builder
      .addCase(fetchComponentMastery.fulfilled, (state, action) => {
        state.componentMastery = action.payload;
      });
    
    // Update component mastery
    builder
      .addCase(updateComponentMastery.fulfilled, (state, action) => {
        const index = state.componentMastery.findIndex(
          m => m.componentId === action.payload.component_id
        );
        
        if (index >= 0) {
          state.componentMastery[index] = action.payload as any;
        } else {
          state.componentMastery.push(action.payload as any);
        }
      });
  },
});

export const { addAchievement, updateStats } = userSlice.actions;
export default userSlice.reducer;
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/hooks/redux.ts
```ts
import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from '../store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/router/index.tsx
```tsx
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { RootLayout } from '../components/layout/RootLayout';
import { AuthLayout } from '../components/layout/AuthLayout';
import { GameLayout } from '../components/layout/GameLayout';
import { ProtectedRoute } from '../components/common/ProtectedRoute';

// Screens
import { LandingPage } from '../screens/LandingPage';
import { SignInPage } from '../screens/auth/SignInPage';
import { SignUpPage } from '../screens/auth/SignUpPage';
import { CareerMapScreen } from '../screens/game/CareerMapScreen';
import { MeetingRoomScreen } from '../screens/game/MeetingRoomScreen';
import { MentorSelectionScreen } from '../screens/game/MentorSelectionScreen';
import { SystemDesignCanvas } from '../screens/game/SystemDesignCanvas';
import { SimulationScreen } from '../screens/game/SimulationScreen';
import { ResultsScreen } from '../screens/game/ResultsScreen';


export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: 'auth',
        element: <AuthLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="/auth/signin" replace />,
          },
          {
            path: 'signin',
            element: <SignInPage />,
          },
          {
            path: 'signup',
            element: <SignUpPage />,
          },
          {
            path: 'callback',
            element: <div>Processing authentication...</div>, // OAuth callback handler
          },
        ],
      },
      {
        path: 'career',
        element: (
          <ProtectedRoute>
            <GameLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <CareerMapScreen />,
          },
        ],
      },
      {
        path: 'meeting/:scenarioId',
        element: (
          <ProtectedRoute>
            <GameLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <MeetingRoomScreen />,
          },
        ],
      },
      {
        path: 'mentor/:scenarioId',
        element: (
          <ProtectedRoute>
            <GameLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <MentorSelectionScreen />,
          },
        ],
      },
      {
        path: 'design/:scenarioId',
        element: (
          <ProtectedRoute>
            <GameLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <SystemDesignCanvas />,
          },
        ],
      },
      {
        path: 'simulation/:scenarioId',
        element: (
          <ProtectedRoute>
            <GameLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <SimulationScreen />,
          },
        ],
      },
      {
        path: 'results/:attemptId',
        element: (
          <ProtectedRoute>
            <GameLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <ResultsScreen />,
          },
        ],
      },
    ],
  },
]);
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/screens/auth/SignInPage.tsx
```tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { signInWithEmail, signInWithOAuth, clearError, demoSignIn } from '../../features/auth/authSlice';
import { OAUTH_PROVIDERS } from '../../constants';

export const SignInPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(signInWithEmail(formData));
    if (signInWithEmail.fulfilled.match(result)) {
      navigate('/career');
    }
  };

  const handleOAuthSignIn = (provider: 'google' | 'github' | 'linkedin') => {
    dispatch(signInWithOAuth(provider));
  };

  const handleDemoSignIn = async () => {
    const result = await dispatch(demoSignIn('1c8d0b3a-0fae-4916-9c8a-987473c0a24e'));
    if (demoSignIn.fulfilled.match(result)) {
      navigate('/career');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) dispatch(clearError());
  };

  return (
    <div className="auth-page">
      <div className="auth-page__header">
        <h1 className="auth-page__title">Welcome Back</h1>
        <p className="auth-page__subtitle">Sign in to continue your journey</p>
      </div>

      {/* OAuth Providers */}
      <div className="auth-page__oauth-providers">
        {Object.entries(OAUTH_PROVIDERS).map(([key, provider]) => (
          <button
            key={key}
            onClick={() => handleOAuthSignIn(key.toLowerCase() as any)}
            disabled={isLoading}
            className="auth-page__oauth-button"
          >
            <span className="auth-page__oauth-icon">{getProviderIcon(provider.name)}</span>
            <span>Continue with {provider.name}</span>
          </button>
        ))}
      </div>

      {/* Demo Button */}
      <div className="auth-page__demo-section">
        <button
          onClick={handleDemoSignIn}
          disabled={isLoading}
          className="auth-page__demo-button"
        >
          <span className="auth-page__oauth-icon">🎮</span>
          <span>Demo Mode</span>
        </button>
      </div>

      <div className="auth-page__divider">
        <span className="auth-page__divider-text">Or continue with email</span>
      </div>

      {/* Email Sign In Form */}
      <form onSubmit={handleSubmit} className="auth-page__form">
        {error && (
          <div className="auth-page__error-message">
            {error}
          </div>
        )}

        <div className="auth-page__form-group">
          <label htmlFor="email" className="auth-page__form-label">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="auth-page__form-input"
            placeholder="you@example.com"
          />
        </div>

        <div className="auth-page__form-group">
          <label htmlFor="password" className="auth-page__form-label">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            className="auth-page__form-input"
            placeholder="••••••••"
          />
        </div>

        <div className="auth-page__form-actions">
          <div className="auth-page__checkbox-group">
            <input type="checkbox" id="remember" className="auth-page__checkbox" />
            <label htmlFor="remember" className="auth-page__checkbox-label">Remember me</label>
          </div>
          <a href="#" className="auth-page__link">
            Forgot password?
          </a>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="auth-page__submit-button"
        >
          {isLoading ? (
            <span className="auth-page__loading">Signing in...</span>
          ) : (
            'Sign In'
          )}
        </button>
      </form>
    </div>
  );
};

function getProviderIcon(provider: string): string {
  switch (provider) {
    case 'Google':
      return '🔍';
    case 'GitHub':
      return '🐙';
    case 'LinkedIn':
      return '💼';
    default:
      return '🔗';
  }
}
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/screens/auth/SignUpPage.tsx
```tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { signUpWithEmail, signInWithOAuth, clearError } from '../../features/auth/authSlice';
import { OAUTH_PROVIDERS } from '../../constants';

export const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      errors.email = 'Please enter a valid email address';
    }

    if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const result = await dispatch(signUpWithEmail({
      email: formData.email,
      password: formData.password,
      username: formData.username,
    }));

    if (signUpWithEmail.fulfilled.match(result)) {
      navigate('/career');
    }
  };

  const handleOAuthSignIn = (provider: 'google' | 'github' | 'linkedin') => {
    dispatch(signInWithOAuth(provider));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) dispatch(clearError());
    if (validationErrors[e.target.name]) {
      setValidationErrors({ ...validationErrors, [e.target.name]: '' });
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-page__header">
        <h1 className="auth-page__title">Create Your Account</h1>
        <p className="auth-page__subtitle">Start your system design journey today</p>
      </div>

      {/* OAuth Providers */}
      <div className="auth-page__oauth-providers">
        {Object.entries(OAUTH_PROVIDERS).map(([key, provider]) => (
          <button
            key={key}
            onClick={() => handleOAuthSignIn(key.toLowerCase() as any)}
            disabled={isLoading}
            className="auth-page__oauth-button"
          >
            <span className="auth-page__oauth-icon">{getProviderIcon(provider.name)}</span>
            <span>Continue with {provider.name}</span>
          </button>
        ))}
      </div>

      <div className="auth-page__divider">
        <span className="auth-page__divider-text">Or sign up with email</span>
      </div>

      {/* Sign Up Form */}
      <form onSubmit={handleSubmit} className="auth-page__form">
        {error && (
          <div className="auth-page__error-message">
            {error}
          </div>
        )}

        <div className="auth-page__form-group">
          <label htmlFor="username" className="auth-page__form-label">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
            className={`auth-page__form-input ${
              validationErrors.username ? 'auth-page__form-input--error' : ''
            }`}
            placeholder="johndoe"
          />
          {validationErrors.username && (
            <div className="auth-page__form-error-text">{validationErrors.username}</div>
          )}
        </div>

        <div className="auth-page__form-group">
          <label htmlFor="email" className="auth-page__form-label">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className={`auth-page__form-input ${
              validationErrors.email ? 'auth-page__form-input--error' : ''
            }`}
            placeholder="you@example.com"
          />
          {validationErrors.email && (
            <div className="auth-page__form-error-text">{validationErrors.email}</div>
          )}
        </div>

        <div className="auth-page__form-group">
          <label htmlFor="password" className="auth-page__form-label">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            className={`auth-page__form-input ${
              validationErrors.password ? 'auth-page__form-input--error' : ''
            }`}
            placeholder="••••••••"
          />
          {validationErrors.password && (
            <div className="auth-page__form-error-text">{validationErrors.password}</div>
          )}
        </div>

        <div className="auth-page__form-group">
          <label htmlFor="confirmPassword" className="auth-page__form-label">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required
            className={`auth-page__form-input ${
              validationErrors.confirmPassword ? 'auth-page__form-input--error' : ''
            }`}
            placeholder="••••••••"
          />
          {validationErrors.confirmPassword && (
            <div className="auth-page__form-error-text">{validationErrors.confirmPassword}</div>
          )}
        </div>

        <div className="auth-page__terms-group">
          <input
            type="checkbox"
            id="terms"
            required
            className="auth-page__terms-checkbox auth-page__checkbox"
          />
          <label htmlFor="terms" className="auth-page__terms-label">
            I agree to the{' '}
            <a href="/terms">Terms of Service</a>{' '}
            and{' '}
            <a href="/privacy">Privacy Policy</a>
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="auth-page__submit-button"
        >
          {isLoading ? (
            <span className="auth-page__loading">Creating account...</span>
          ) : (
            'Create Account'
          )}
        </button>
      </form>
    </div>
  );
};

function getProviderIcon(provider: string): string {
  switch (provider) {
    case 'Google':
      return '🔍';
    case 'GitHub':
      return '🐙';
    case 'LinkedIn':
      return '💼';
    default:
      return '🔗';
  }
}
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/screens/game/CareerMapScreen.tsx
```tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchScenarios, fetchUserProgress } from '../../features/game/gameSlice';
import { CareerMapGame } from '../../components/organisms/CareerMap/CareerMap';
import { PhaseHeader } from '../../components/molecules/PhaseHeader';
import { Progress } from '../../components/atoms/Progress';
import { Badge } from '../../components/atoms/Badge';

export const CareerMapScreen: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { scenarios, progress, isLoading } = useAppSelector((state) => state.game);
  const user = useAppSelector((state) => state.auth.user);
  const profile = useAppSelector((state) => state.auth.profile);

  useEffect(() => {
    dispatch(fetchScenarios());
    if (user?.id) {
      dispatch(fetchUserProgress(user.id));
    }
  }, [dispatch, user?.id]);

  const handleScenarioClick = (scenarioId: string) => {
    // Navigate to the scenario or meeting room
    navigate(`/simulation/${scenarioId}`);
  };

  const handleComponentClick = (componentType: string) => {
    console.log(`🎮 Career Map - Component interaction: ${componentType}`);
    
    // You can add additional logic here based on your game design:
    // - Track analytics
    // - Update game state
    // - Show additional information
    // - Trigger achievements
    
    // For now, this provides a hook for future functionality
    // The main mentor selection logic is handled within the CareerMapGame component
  };

  if (isLoading) {
    return (
      <div className="career-map__loading">
        <div className="career-map__spinner"></div>
      </div>
    );
  }

  const currentLevel = profile?.current_level || 1;
  const reputationPoints = profile?.reputation_points || 0;
  const careerTitle = profile?.career_title || 'Junior Developer';
  const completedScenarios = progress?.filter(p => p.status === 'completed').length || 0;
  const totalScenarios = scenarios?.length || 0;
  const progressPercentage = totalScenarios > 0 ? (completedScenarios / totalScenarios) * 100 : 0;

  return (
    <div className="career-map career-map--fullscreen">
      <PhaseHeader
        title="ProblemVille"
        subtitle={`Level ${currentLevel} - ${careerTitle}`}
        variant="career-map"
        rightContent={
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm opacity-80">Progress</div>
              <div className="text-lg font-semibold">{completedScenarios}/{totalScenarios}</div>
            </div>
            <Progress 
              value={progressPercentage} 
              max={100} 
              variant="success"
              className="w-24"
            />
            <Badge variant="primary" size="md">
              {reputationPoints.toLocaleString()} Rep
            </Badge>
          </div>
        }
      />
      <CareerMapGame 
        scenarios={scenarios} 
        progress={progress} 
        onScenarioClick={handleScenarioClick}
        onComponentClick={handleComponentClick}
      />
    </div>
  );
};
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/screens/game/MeetingRoomScreen.tsx
```tsx
import React from 'react';
import { useParams } from 'react-router-dom';

export const MeetingRoomScreen: React.FC = () => {
  const { scenarioId } = useParams();

  return (
    <div className="h-full bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Meeting Room</h1>
        <p className="text-gray-400 mb-8">
          Scenario ID: {scenarioId}
        </p>
        
        <div className="p-6 bg-yellow-900 border border-yellow-700 rounded-lg">
          <p className="text-yellow-300">
            🚧 Meeting Room with dialogue system is under construction!
          </p>
          <p className="text-yellow-300 mt-2">
            This screen will feature:
          </p>
          <ul className="list-disc list-inside mt-2 text-yellow-300">
            <li>Interactive character conversations</li>
            <li>Question selection system</li>
            <li>Requirements gathering</li>
            <li>Dynamic narrative based on your choices</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/screens/game/MentorSelectionScreen.tsx
```tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MentorCard, type Mentor } from '../../components/molecules/MentorCard';
import { supabase } from '../../services/supabase';

export const MentorSelectionScreen: React.FC = () => {
  const { scenarioId } = useParams();
  const navigate = useNavigate();
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from('mentors')
        .select('*')
        .order('name');

      if (supabaseError) {
        throw supabaseError;
      }

      setMentors(data || []);
    } catch (err) {
      console.error('Error fetching mentors:', err);
      setError('Failed to load mentors. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleMentorSelect = (mentor: Mentor) => {
    setSelectedMentor(mentor);
  };

  const handleConfirmSelection = () => {
    if (selectedMentor && scenarioId) {
      // Store selected mentor in localStorage or state management
      localStorage.setItem('selectedMentor', JSON.stringify(selectedMentor));
      
      // Navigate to the actual game screen
      navigate(`/game/scenario/${scenarioId}/design`);
    }
  };

  if (loading) {
    return (
      <div className="h-full bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-300">Loading mentors...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 text-white flex items-center justify-center">
        <div className="text-center max-w-md p-8">
          <div className="text-red-400 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2">Failed to Load Mentors</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={fetchMentors}
            className="btn btn--primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mentor-selection text-white overflow-auto">
      <div className="max-w-7xl mx-auto p-8">
        <div className="mentor-selection__header">
          <h1 className="mentor-selection__title">
            Choose Your Mentor
          </h1>
          <p className="mentor-selection__subtitle">
            Select an expert to guide you through this challenge
          </p>
          <p className="mentor-selection__description">
            Each mentor brings unique expertise and perspective to help you succeed
          </p>
        </div>

        {mentors.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">No Mentors Available</h3>
            <p className="text-gray-400">
              Mentors are currently being prepared for your journey.
            </p>
          </div>
        ) : (
          <>
            <div className="mentor-selection__grid">
              {mentors.map((mentor) => (
                <MentorCard
                  key={mentor.id}
                  mentor={mentor}
                  selected={selectedMentor?.id === mentor.id}
                  onSelect={handleMentorSelect}
                />
              ))}
            </div>

            {selectedMentor && (
              <div className="mentor-selection__confirmation">
                <div className="mentor-selection__confirmation-content">
                  <div className="mentor-selection__confirmation-info">
                    <div className="mentor-selection__confirmation-avatar">
                      {selectedMentor.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="mentor-selection__confirmation-details">
                      <h4>{selectedMentor.name}</h4>
                      <p>{selectedMentor.title}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleConfirmSelection}
                    className="btn btn--primary px-6 py-2"
                  >
                    Continue with {selectedMentor.name.split(' ')[0]}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/screens/game/ResultsScreen.tsx
```tsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export const ResultsScreen: React.FC = () => {
  const { attemptId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="h-full bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Results</h1>
          
          <div className="mb-8">
            <p className="text-6xl font-bold text-yellow-400 mb-2">85%</p>
            <div className="flex justify-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className={`text-3xl ${star <= 4 ? 'text-yellow-400' : 'text-gray-600'}`}>
                  ★
                </span>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-700 rounded p-4">
              <p className="text-gray-400 text-sm">Requirements Met</p>
              <p className="text-xl font-bold">34/40</p>
            </div>
            <div className="bg-gray-700 rounded p-4">
              <p className="text-gray-400 text-sm">Performance</p>
              <p className="text-xl font-bold">26/30</p>
            </div>
            <div className="bg-gray-700 rounded p-4">
              <p className="text-gray-400 text-sm">Cost Efficiency</p>
              <p className="text-xl font-bold">15/20</p>
            </div>
            <div className="bg-gray-700 rounded p-4">
              <p className="text-gray-400 text-sm">Architecture</p>
              <p className="text-xl font-bold">10/10</p>
            </div>
          </div>
          
          <div className="p-6 bg-yellow-900 border border-yellow-700 rounded-lg mb-8">
            <p className="text-yellow-300">
              🚧 Full results analysis coming soon!
            </p>
          </div>
          
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/career')}
              className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Return to Map
            </button>
            <button
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
            <button
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Next Scenario
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/screens/game/SimulationScreen.tsx
```tsx
import React from 'react';
import { useParams } from 'react-router-dom';

export const SimulationScreen: React.FC = () => {
  const { scenarioId } = useParams();

  return (
    <div className="h-full bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">System Simulation</h1>
        
        <div className="p-6 bg-yellow-900 border border-yellow-700 rounded-lg">
          <p className="text-yellow-300">
            🚧 Simulation visualization with Phaser.js is coming soon!
          </p>
          <p className="text-yellow-300 mt-2">
            This screen will show:
          </p>
          <ul className="list-disc list-inside mt-2 text-yellow-300">
            <li>Animated data packets flowing through your system</li>
            <li>Real-time performance metrics</li>
            <li>Component stress visualization</li>
            <li>Traffic spike simulations</li>
          </ul>
        </div>
        
        {/* Mock Metrics Dashboard */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="text-gray-400 text-sm">Response Time</p>
            <p className="text-2xl font-bold">0ms</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="text-gray-400 text-sm">Throughput</p>
            <p className="text-2xl font-bold">0 req/s</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="text-gray-400 text-sm">Error Rate</p>
            <p className="text-2xl font-bold">0%</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="text-gray-400 text-sm">Uptime</p>
            <p className="text-2xl font-bold">100%</p>
          </div>
        </div>
      </div>
    </div>
  );
};
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/screens/game/SystemDesignCanvas.tsx
```tsx
import React, { useCallback, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  Panel,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant,
} from '@xyflow/react';
import type { Connection, Edge, Node } from '@xyflow/react';
import type { Mentor } from '../../components/molecules/MentorCard';
import { Search, ChevronDown, Minimize2, ChevronsRight, Users } from 'lucide-react';
import { Input } from '../../components/atoms/Input';
import { Icon } from '../../components/atoms/Icon';
import { useAppSelector } from '../../hooks/redux';
import { 
  selectSelectedComponent, 
  selectIsCollaborationMode, 
  selectComponentRequirements, 
  selectComponentInitialNodes,
  selectCollaborationSettings 
} from '../../features/game/gameSlice';
import '@xyflow/react/dist/style.css';
import '../../styles/design-system/index.css';

// Ensure React Flow container has proper styling
const reactFlowStyle = {
  width: '100%',
  height: '100%',
  backgroundColor: 'var(--color-neutral-50)'
};

const containerStyle = {
  width: '100vw',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column' as const,
  overflow: 'hidden'
};

const mainLayoutStyle = {
  flex: 1,
  display: 'flex',
  minHeight: 0
};

// Component categories and data
const componentCategories = [
  { id: 'compute', name: 'Compute', icon: 'cpu' as const },
  { id: 'storage', name: 'Storage', icon: 'database' as const },
  { id: 'networking', name: 'Networking', icon: 'globe' as const },
  { id: 'security', name: 'Security', icon: 'shield' as const },
];

const availableComponents = [
  { id: 'web-server', name: 'Web Server', category: 'compute', cost: 50, capacity: 1000, description: 'Handle HTTP requests', icon: 'server' as const },
  { id: 'database', name: 'Database', category: 'storage', cost: 100, capacity: 500, description: 'Store and retrieve data', icon: 'database' as const },
  { id: 'load-balancer', name: 'Load Balancer', category: 'networking', cost: 75, capacity: 2000, description: 'Distribute traffic', icon: 'globe' as const },
  { id: 'api-gateway', name: 'API Gateway', category: 'networking', cost: 25, capacity: 5000, description: 'Manage API requests', icon: 'external-link' as const },
  { id: 'cache', name: 'Cache', category: 'storage', cost: 30, capacity: 10000, description: 'Speed up data access', icon: 'activity' as const },
  { id: 'compute', name: 'Compute Instance', category: 'compute', cost: 80, capacity: 800, description: 'General computation', icon: 'cpu' as const },
];

// Default nodes when no specific component is selected
const defaultInitialNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Load Balancer' },
    position: { x: 100, y: 100 },
    style: { background: '#4f46e5', color: 'white' },
  },
  {
    id: '2',
    data: { label: 'Web Server' },
    position: { x: 300, y: 100 },
    style: { background: '#059669', color: 'white' },
  },
  {
    id: '3',
    data: { label: 'Database' },
    position: { x: 500, y: 100 },
    style: { background: '#dc2626', color: 'white' },
  },
];

const defaultInitialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e2-3', source: '2', target: '3', animated: true },
];

export const SystemDesignCanvas: React.FC = () => {
  const { scenarioId } = useParams();
  
  // Redux selectors
  const selectedComponent = useAppSelector(selectSelectedComponent);
  const isCollaborationMode = useAppSelector(selectIsCollaborationMode);
  const componentRequirements = useAppSelector(selectComponentRequirements);
  const componentInitialNodes = useAppSelector(selectComponentInitialNodes);
  const collaborationSettings = useAppSelector(selectCollaborationSettings);
  
  // Get initial nodes from Redux or use defaults
  const initialNodes = componentInitialNodes.length > 0 ? componentInitialNodes : defaultInitialNodes;
  const initialEdges = defaultInitialEdges;
  
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  
  // Component drawer state
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['compute', 'storage', 'networking'])
  );
  const [isDrawerCollapsed, setIsDrawerCollapsed] = useState(false);
  
  // Mentor panel state
  const [isMentorCollapsed, setIsMentorCollapsed] = useState(true);

  useEffect(() => {
    // Load selected mentor from localStorage only once
    const mentorData = localStorage.getItem('selectedMentor');
    
    if (mentorData && !selectedMentor) {
      try {
        const mentor = JSON.parse(mentorData);
        setSelectedMentor(mentor);
        console.log(`👨‍🏫 Loaded mentor: ${mentor.name}`);
      } catch (error) {
        console.error('Failed to parse mentor data:', error);
      }
    }
    
    // Log Redux component selection state
    if (selectedComponent) {
      console.log(`📋 Component selection from Redux:`, selectedComponent);
      console.log(`🎯 Component type: ${selectedComponent.componentType}`);
      console.log(`🎯 Mode: ${selectedComponent.mode}`);
      console.log(`🎯 Scenario ID: ${selectedComponent.scenarioId}`);
      console.log(`📋 Requirements:`, componentRequirements);
      
      if (isCollaborationMode) {
        console.log(`👥 Collaboration mode active:`, collaborationSettings);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedComponent, componentRequirements, isCollaborationMode, collaborationSettings]); // Dependencies for Redux state

  // Update nodes when component selection changes
  useEffect(() => {
    if (componentInitialNodes.length > 0) {
      console.log(`🔄 Updating canvas with component-specific nodes:`, componentInitialNodes);
      setNodes(componentInitialNodes);
    }
  }, [componentInitialNodes, setNodes]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Component drawer functions
  const filteredComponents = React.useMemo(() => {
    if (!searchQuery) return availableComponents;
    const query = searchQuery.toLowerCase();
    return availableComponents.filter(component => 
      component.name.toLowerCase().includes(query) ||
      component.description.toLowerCase().includes(query) ||
      component.category.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const groupedComponents = React.useMemo(() => {
    return componentCategories.reduce((acc, category) => {
      acc[category.id] = filteredComponents.filter(
        component => component.category === category.id
      );
      return acc;
    }, {} as Record<string, typeof availableComponents>);
  }, [filteredComponents]);

  const toggleCategory = useCallback((categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  }, []);

  return (
    <div style={{ ...containerStyle, backgroundColor: 'var(--color-neutral-50)' }} className="text-gray-800">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        style={reactFlowStyle}
      >
        {/* Game HUD Panel - Top Center */}
        <Panel position="top-center" className="pointer-events-none">
          <div className="flex gap-4 pointer-events-auto">
            <div className="bg-gray-800 px-4 py-2 rounded shadow-lg text-white">
              Timer: 15:00
            </div>
            <div className="bg-gray-800 px-4 py-2 rounded shadow-lg text-white">
              Budget: $0 / $200
            </div>
            {isCollaborationMode && (
              <div className="bg-green-600 px-4 py-2 rounded shadow-lg text-white flex items-center gap-2">
                <Users size={16} />
                <span>Collaboration Mode</span>
              </div>
            )}
          </div>
        </Panel>

        {/* Component Drawer Panel - Left Side */}
        {!isDrawerCollapsed && (
          <Panel position="top-left" className="pointer-events-auto">
            <div className="component-drawer" style={{ width: '320px', maxHeight: '70vh' }}>
              <div className="component-drawer__header">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold text-white">Components</h2>
                  <button
                    onClick={() => setIsDrawerCollapsed(true)}
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label="Collapse drawer"
                  >
                    <Minimize2 size={16} />
                  </button>
                </div>
                <div className="component-drawer__search">
                  <Input
                    type="search"
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Search components..."
                    leftIcon={<Search size={16} />}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="component-drawer__categories">
                {componentCategories.map(category => {
                  const categoryComponents = groupedComponents[category.id] || [];
                  const isExpanded = expandedCategories.has(category.id);
                  
                  return (
                    <div key={category.id} className="component-category">
                      <button
                        className="component-category__header"
                        onClick={() => toggleCategory(category.id)}
                        aria-expanded={isExpanded}
                      >
                        <Icon name={category.icon} size="md" className="component-category__icon" />
                        <span className="component-category__title">{category.name}</span>
                        <span className="component-category__count">
                          {categoryComponents.length}
                        </span>
                        <ChevronDown 
                          className={`component-category__chevron ${isExpanded ? 'component-category--expanded' : ''}`}
                          size={16}
                        />
                      </button>
                      
                      {isExpanded && (
                        <div className="component-category__items">
                          {categoryComponents.length === 0 ? (
                            <p className="text-gray-400 text-sm p-2">
                              No components found
                            </p>
                          ) : (
                            categoryComponents.map(component => (
                              <div
                                key={component.id}
                                className="component-item"
                                draggable
                                onDragStart={(e) => {
                                  e.dataTransfer.setData('application/reactflow', JSON.stringify(component));
                                }}
                              >
                                <div className="component-item__icon">
                                  <Icon name={component.icon} size="md" />
                                </div>
                                <div className="component-item__content">
                                  <div className="component-item__name">{component.name}</div>
                                  <div className="component-item__cost">${component.cost}/mo</div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </Panel>
        )}

        {/* Collapsed Drawer Toggle */}
        {isDrawerCollapsed && (
          <Panel position="top-left" className="pointer-events-auto">
            <button
              onClick={() => setIsDrawerCollapsed(false)}
              className="bg-gray-800 p-4 rounded-lg shadow-lg text-white hover:bg-gray-700 transition-colors flex flex-col items-center justify-center min-w-[80px] min-h-[80px]"
              aria-label="Expand resources drawer"
            >
              <ChevronsRight size={20} className="mb-1" />
              <span className="text-xs font-medium">Resources</span>
            </button>
          </Panel>
        )}

        {/* Mentor Assistant Panel */}
        {selectedMentor && (
          <>
            {/* Collapsed Mentor - Bottom Left Avatar */}
            {isMentorCollapsed && (
              <Panel position="bottom-left" className="pointer-events-auto">
                <button
                  onClick={() => setIsMentorCollapsed(false)}
                  className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg hover:bg-blue-700 transition-colors border-2 border-white"
                  aria-label={`Open guidance from ${selectedMentor.name}`}
                  title={`${selectedMentor.name} - ${selectedMentor.title}`}
                >
                  {selectedMentor.name.split(' ').map(n => n[0]).join('')}
                </button>
              </Panel>
            )}

            {/* Expanded Mentor - Bottom Left Chat Window */}
            {!isMentorCollapsed && (
              <Panel position="bottom-left" className="pointer-events-auto">
                <div className="mentor-chat" style={{ 
                  width: '350px', 
                  height: '420px', 
                  backgroundColor: 'white', 
                  borderRadius: '16px', 
                  border: '1px solid var(--color-neutral-200)', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                  overflow: 'hidden'
                }}>
                  {/* Chat Header */}
                  <div className="flex items-center justify-between p-4" style={{ backgroundColor: 'var(--color-primary-500)', color: 'white' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-sm border-2 border-white/30">
                        {selectedMentor.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm">{selectedMentor.name}</h3>
                        <p className="text-white/80 text-xs flex items-center gap-1">
                          <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                          {selectedMentor.title}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsMentorCollapsed(true)}
                      className="text-white/80 hover:text-white transition-colors p-1 rounded hover:bg-white/10"
                      aria-label="Close mentor chat"
                    >
                      <Minimize2 size={16} />
                    </button>
                  </div>
                  
                  {/* Chat Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ backgroundColor: 'var(--color-neutral-50)' }}>
                    {/* Welcome Message */}
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs" style={{ backgroundColor: 'var(--color-primary-500)', flexShrink: 0 }}>
                        {selectedMentor.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex flex-col gap-1 max-w-[240px]">
                        <div className="bg-white text-gray-800 p-3 rounded-2xl rounded-tl-sm shadow-sm text-sm">
                          <p className="mb-1">👋 Hi! I'm {selectedMentor.name.split(' ')[0]}.</p>
                          <p className="text-xs text-gray-600 italic">"{selectedMentor.quote}"</p>
                        </div>
                        <span className="text-xs text-gray-400 ml-2">just now</span>
                      </div>
                    </div>

                    {/* Context Message */}
                    {selectedComponent && (
                      <div className="flex items-start gap-2">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs" style={{ backgroundColor: 'var(--color-primary-500)', flexShrink: 0 }}>
                          {selectedMentor.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex flex-col gap-1 max-w-[240px]">
                          <div className="bg-white text-gray-800 p-3 rounded-2xl rounded-tl-sm shadow-sm text-sm">
                            <p>I'll help you design <span style={{ color: 'var(--color-primary-600)' }} className="font-medium">{selectedComponent.componentType || 'system'}</span> components{isCollaborationMode ? ' in collaboration mode' : ''}.</p>
                          </div>
                          <span className="text-xs text-gray-400 ml-2">just now</span>
                        </div>
                      </div>
                    )}

                    {/* Expertise Tags */}
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs" style={{ backgroundColor: 'var(--color-primary-500)', flexShrink: 0 }}>
                        {selectedMentor.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex flex-col gap-1 max-w-[240px]">
                        <div className="bg-white text-gray-800 p-3 rounded-2xl rounded-tl-sm shadow-sm text-sm">
                          <p className="mb-2">My expertise areas:</p>
                          <div className="flex flex-wrap gap-1">
                            {selectedMentor.tags.slice(0, 3).map((tag) => (
                              <span key={tag} style={{ backgroundColor: 'var(--color-primary-100)', color: 'var(--color-primary-700)' }} className="text-xs px-2 py-1 rounded-full font-medium">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        <span className="text-xs text-gray-400 ml-2">just now</span>
                      </div>
                    </div>

                    {/* Guidance Message */}
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs" style={{ backgroundColor: 'var(--color-primary-500)', flexShrink: 0 }}>
                        {selectedMentor.name.split(' ').map(n => n[0]).join('')}
                      </div>
                                              <div className="flex flex-col gap-1 max-w-[240px]">
                          <div className="bg-white text-gray-800 p-3 rounded-2xl rounded-tl-sm shadow-sm text-sm">
                            <p>💡 <span className="font-medium">Pro tip:</span> Start with the fundamentals and build incrementally. Focus on {selectedComponent?.componentType || 'system'} scalability patterns.</p>
                          </div>
                          <span className="text-xs text-gray-400 ml-2">just now</span>
                        </div>
                    </div>
                  </div>
                  
                  {/* Chat Input (Placeholder for future) */}
                  <div className="p-4 bg-white border-t" style={{ borderColor: 'var(--color-neutral-200)' }}>
                                         <div style={{ backgroundColor: 'var(--color-neutral-100)', color: 'var(--color-neutral-500)', borderColor: 'var(--color-neutral-300)' }} className="text-sm p-3 rounded-lg text-center border-2 border-dashed">
                      💬 Interactive chat coming soon...
                    </div>
                  </div>
                </div>
              </Panel>
            )}
          </>
        )}


        
        {/* Requirements Panel - Top Right */}
        {componentRequirements.length > 0 && (
          <Panel position="top-right" className="pointer-events-auto">
            <div className="bg-white rounded-lg shadow-lg p-4 max-w-[300px]" style={{ border: '1px solid var(--color-neutral-200)' }}>
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Icon name="activity" size="md" />
                Requirements
              </h3>
              <div className="space-y-2">
                {componentRequirements.map((req: any) => (
                  <div key={req.id} className="text-sm">
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        req.priority === 'critical' ? 'bg-red-100 text-red-700' :
                        req.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                        req.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {req.priority}
                      </span>
                      <span className="text-gray-600 font-medium">
                        {req.target} {req.unit}
                      </span>
                    </div>
                    <p className="text-gray-700 mt-1">{req.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </Panel>
        )}

        {/* React Flow MiniMap */}
        <MiniMap 
          className="react-flow__minimap"
          nodeColor="#4f46e5"
          maskColor="rgba(0, 0, 0, 0.5)"
        />
        
        {/* React Flow Background */}
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={20} 
          size={1}
          className="react-flow__background"
        />
      </ReactFlow>
    </div>
  );
};
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/screens/LandingPage.tsx
```tsx
import React, { useCallback, useMemo, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../hooks/redux';
import { Button } from '../components/atoms/Button';
import { Card, CardBody } from '../components/atoms/Card';
import { ReactFlow, useNodesState, useEdgesState, Handle, Position } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Custom node components following the design system structure
const SystemNode: React.FC<{ data: any }> = ({ data }) => {
  return (
    <div className={`react-flow__node-component react-flow__node-component--${data.category}`}>
      <Handle type="target" position={Position.Top} className="react-flow__handle react-flow__handle-target" />
      <div className="react-flow__node-component__header">
        <div className="react-flow__node-component__icon">
          {data.icon}
        </div>
        <div className="react-flow__node-component__title">
          {data.label}
        </div>
      </div>
      <div className="react-flow__node-component__body">
        <div className="react-flow__node-component__metrics">
          <div className="react-flow__node-component__metric">
            <div className="react-flow__node-component__metric-label">Load</div>
            <div className="react-flow__node-component__metric-value">{data.load}%</div>
          </div>
          <div className="react-flow__node-component__metric">
            <div className="react-flow__node-component__metric-label">Status</div>
            <div className="react-flow__node-component__metric-value">{data.status}</div>
          </div>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="react-flow__handle react-flow__handle-source" />
    </div>
  );
};

// Requirements node component
const RequirementsNode: React.FC<{ data: any }> = ({ data }) => {
  return (
    <div className="react-flow__node-requirements">
      <div className="react-flow__node-requirements__header">
        <div className="react-flow__node-requirements__icon">✅</div>
        <div className="react-flow__node-requirements__title">{data.label}</div>
      </div>
      <div className="react-flow__node-requirements__body">
        {data.requirements.map((req: string, index: number) => (
          <div key={index} className="react-flow__node-requirements__item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="react-flow__node-requirements__check">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>{req}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Define nodeTypes outside component following best practices
const nodeTypes = {
  system: SystemNode,
  requirements: RequirementsNode,
};

// Initial nodes and edges for the demo - following design system categories
const initialNodes = [
  {
    id: 'cdn',
    type: 'system',
    position: { x: 100, y: 50 },
    data: {
      label: 'CDN',
      icon: '🌍',
      category: 'networking',
      load: 15,
      status: 'Healthy'
    },
  },
  {
    id: 'loadbalancer',
    type: 'system',
    position: { x: 300, y: 100 },
    data: {
      label: 'Load Balancer',
      icon: '⚖️',
      category: 'networking',
      load: 45,
      status: 'Active'
    },
  },
  {
    id: 'frontend',
    type: 'system',
    position: { x: 500, y: 50 },
    data: {
      label: 'Frontend',
      icon: '🌐',
      category: 'compute',
      load: 35,
      status: 'Healthy'
    },
  },
  {
    id: 'api',
    type: 'system',
    position: { x: 500, y: 200 },
    data: {
      label: 'API Gateway',
      icon: '🚪',
      category: 'networking',
      load: 52,
      status: 'Active'
    },
  },
  {
    id: 'backend',
    type: 'system',
    position: { x: 300, y: 300 },
    data: {
      label: 'Backend',
      icon: '⚙️',
      category: 'compute',
      load: 68,
      status: 'Active'
    },
  },
  {
    id: 'cache',
    type: 'system',
    position: { x: 700, y: 250 },
    data: {
      label: 'Cache',
      icon: '💾',
      category: 'storage',
      load: 40,
      status: 'Optimal'
    },
  },
  {
    id: 'database',
    type: 'system',
    position: { x: 500, y: 400 },
    data: {
      label: 'Database',
      icon: '🗄️',
      category: 'storage',
      load: 23,
      status: 'Optimal'
    },
  },
  {
    id: 'queue',
    type: 'system',
    position: { x: 100, y: 350 },
    data: {
      label: 'Message Queue',
      icon: '📬',
      category: 'operations',
      load: 12,
      status: 'Healthy'
    },
  },
  {
    id: 'requirements',
    type: 'requirements',
    position: { x: 900, y: 200 },
    data: {
      label: 'Requirements',
      requirements: [
        'User Authentication',
        'Image Sharing',
        'Recommendation System'
      ]
    },
  },
];

const initialEdges = [
  {
    id: 'cdn-loadbalancer',
    source: 'cdn',
    target: 'loadbalancer',
    animated: true,
    className: 'react-flow__edge--high-traffic',
  },
  {
    id: 'loadbalancer-frontend',
    source: 'loadbalancer',
    target: 'frontend',
    animated: true,
    className: 'react-flow__edge--high-traffic',
  },
  {
    id: 'loadbalancer-api',
    source: 'loadbalancer',
    target: 'api',
    animated: true,
    className: 'react-flow__edge--medium-traffic',
  },
  {
    id: 'api-backend',
    source: 'api',
    target: 'backend',
    animated: false,
    className: 'react-flow__edge--medium-traffic',
  },
  {
    id: 'api-cache',
    source: 'api',
    target: 'cache',
    animated: true,
    className: 'react-flow__edge--medium-traffic',
  },
  {
    id: 'backend-database',
    source: 'backend',
    target: 'database',
    animated: true,
    className: 'react-flow__edge--low-traffic',
  },
  {
    id: 'backend-queue',
    source: 'backend',
    target: 'queue',
    animated: false,
    className: 'react-flow__edge--low-traffic',
  },
  {
    id: 'cache-database',
    source: 'cache',
    target: 'database',
    animated: false,
    className: 'react-flow__edge--low-traffic',
  },
];

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);
  
  // Slider state
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/career');
    } else {
      navigate('/auth/signup');
    }
  };
  
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, [isDragging]);
  
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);
  
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!sliderRef.current) return;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);
  
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="landing-page__nav">
        <div className="landing-page__nav-container">
          <div className="landing-page__logo">System Design Tycoon</div>
          <div className="landing-page__nav-actions">
            {!isAuthenticated && (
              <>
                <Button
                  variant="ghost"
                  onClick={() => navigate('/auth/signin')}
                  className="landing-page__nav-button"
                >
                  Sign In
                </Button>
                <Button
                  variant="primary"
                  onClick={() => navigate('/auth/signup')}
                >
                  Sign Up
                </Button>
              </>
            )}
            {isAuthenticated && (
              <Button
                variant="secondary"
                onClick={() => navigate('/career')}
              >
                Continue Playing
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="landing-page__hero">
        <div className="landing-page__hero-container">
          <div className="landing-page__hero-content">
            <h1 className="landing-page__hero-title">
              Turn Requirements into Applications
            </h1>
            <p className="landing-page__hero-subtitle">
              Master system design through engaging visual gameplay
            </p>
            <p className="landing-page__hero-description">
              Drag the slider to see how we transform complex problems into scalable solutions
            </p>
            
            {/* Image Comparison Slider */}
            <div 
              className="landing-page__comparison-container"
              ref={sliderRef}
              onMouseDown={handleMouseDown}
              onTouchMove={handleTouchMove}
              onTouchStart={() => setIsDragging(true)}
              onTouchEnd={() => setIsDragging(false)}
            >
              {/* ProblemVille Layer */}
              <div className="landing-page__world-layer landing-page__world-layer--problem">
                <div className="landing-page__world-content">
                  <div className="landing-page__world-scene landing-page__world-scene--green">
                    <img src="/hero_hand.png" alt="Hero Hand" className="landing-page__hero-hand" />
                    <div className="landing-page__chat-bubble">
                      <div className="landing-page__chat-bubble-tail"></div>
                      <div className="landing-page__chat-bubble-content">
                        I need an app so I can share my recipes and find others I might like!!!
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* DataWorld Layer */}
              <div 
                className="landing-page__world-layer landing-page__world-layer--data"
                style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
              >
                <div className="landing-page__world-content">
                  <div className="landing-page__world-scene landing-page__world-scene--blue">
                    <div className="landing-page__react-flow-container">
                      <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        nodeTypes={nodeTypes}
                        fitView
                        fitViewOptions={{ padding: 0.1 }}
                        nodesDraggable={false}
                        nodesConnectable={false}
                        elementsSelectable={false}
                        panOnDrag={false}
                        zoomOnScroll={false}
                        zoomOnPinch={false}
                        zoomOnDoubleClick={false}
                        proOptions={{ hideAttribution: true }}
                        className="landing-page__hero-flow"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Slider Handle */}
              <div 
                className="landing-page__slider-handle"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="landing-page__slider-track" />
                <div className="landing-page__slider-button">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M8 4l-4 8 4 8M16 4l4 8-4 8" />
                  </svg>
                </div>
              </div>
              
              {/* Labels */}
              <div className="landing-page__world-labels">
                <span className="landing-page__world-label landing-page__world-label--left">ProblemVille</span>
                <span className="landing-page__world-label landing-page__world-label--right">DataWorld</span>
              </div>
            </div>
            
            <div className="landing-page__hero-actions">
              <Button
                size="large"
                onClick={handleGetStarted}
                className="landing-page__hero-cta"
              >
                Start Your Journey
              </Button>
              <p className="landing-page__hero-hint">
                Join thousands of developers mastering system design
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* System Architecture Demo Section */}
      <div className="landing-page__demo-section">
        <div className="landing-page__demo-section-container">
          <h2 className="landing-page__demo-section-title">
            See Your Architecture Come to Life
          </h2>
          <p className="landing-page__demo-section-subtitle">
            Watch how data flows through your system design in real-time
          </p>
          <div className="landing-page__demo-flow-container">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              nodeTypes={nodeTypes}
              fitView
              fitViewOptions={{ padding: 0.2 }}
              nodesDraggable={true}
              nodesConnectable={false}
              elementsSelectable={true}
              panOnDrag={true}
              zoomOnScroll={true}
              zoomOnPinch={true}
              zoomOnDoubleClick={false}
              className="landing-page__demo-flow"
            />
          </div>
        </div>
      </div>

      {/* Value Proposition Cards */}
      <div className="landing-page__features">
        <div className="landing-page__features-container">
          <h2 className="landing-page__features-title">
            Learn System Design the Fun Way
          </h2>
          <div className="landing-page__features-grid">
            {valueProps.map((prop, index) => (
              <Card
                key={index}
                interactive
                className="landing-page__feature-card"
              >
                <CardBody>
                  <div className="landing-page__feature-icon">{prop.icon}</div>
                  <h3 className="landing-page__feature-title">{prop.title}</h3>
                  <p className="landing-page__feature-description">{prop.description}</p>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Social Proof */}
      <div className="landing-page__social-proof">
        <div className="landing-page__social-proof-container">
          <div className="landing-page__stats-grid">
            <div className="landing-page__stat">
              <div className="landing-page__stat-value landing-page__stat-value--primary">10K+</div>
              <div className="landing-page__stat-label">Active Players</div>
            </div>
            <div className="landing-page__stat">
              <div className="landing-page__stat-value landing-page__stat-value--secondary">50K+</div>
              <div className="landing-page__stat-label">Systems Designed</div>
            </div>
            <div className="landing-page__stat">
              <div className="landing-page__stat-value landing-page__stat-value--premium">4.8/5</div>
              <div className="landing-page__stat-label">Player Rating</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const valueProps = [
  {
    icon: '🎮',
    title: 'Visual Learning',
    description: 'Watch data packets flow through your architecture like theme park visitors',
  },
  {
    icon: '💼',
    title: 'Real Scenarios',
    description: 'Design systems for Netflix, Uber, and other real companies',
  },
  {
    icon: '👥',
    title: 'Expert Mentors',
    description: 'Get guidance from virtual industry experts with different specializations',
  },
  {
    icon: '📈',
    title: 'Career Growth',
    description: 'Progress from consultant to industry expert through referrals',
  },
];
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/services/supabase.ts
```ts
import { createClient } from '@supabase/supabase-js';

// These values should be stored in environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/store/index.ts
```ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import gameReducer from '../features/game/gameSlice';
import userReducer from '../features/user/userSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    game: gameReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/stories/AchievementToast.stories.tsx
```tsx
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
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/stories/Badge.stories.tsx
```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '../components/atoms/Badge';

const meta: Meta<typeof Badge> = {
  title: 'Atoms/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'primary', 'success', 'warning', 'destructive', 'outline'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'default',
    children: 'Default',
  },
};

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary',
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
    children: 'Success',
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    children: 'Warning',
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Destructive',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small Badge',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large Badge',
  },
};

export const WithIcon: Story = {
  args: {
    variant: 'primary',
    icon: '🏆',
    children: 'With Icon',
  },
};
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/stories/Button.stories.tsx
```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../components/atoms/Button';

const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'outline', 'ghost', 'danger'],
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large', 'icon-only'],
    },
    disabled: {
      control: 'boolean',
    },
    loading: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline Button',
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost Button',
  },
};

export const Danger: Story = {
  args: {
    variant: 'danger',
    children: 'Danger Button',
  },
};

export const Small: Story = {
  args: {
    size: 'small',
    children: 'Small Button',
  },
};

export const Large: Story = {
  args: {
    size: 'large',
    children: 'Large Button',
  },
};

export const Loading: Story = {
  args: {
    loading: true,
    children: 'Loading Button',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled Button',
  },
};
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/stories/Card.stories.tsx
```tsx
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
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/stories/CharacterPortrait.stories.tsx
```tsx
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
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/stories/ComponentCard.stories.tsx
```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { ComponentCard } from '../components/molecules/ComponentCard';

const meta: Meta<typeof ComponentCard> = {
  title: 'Molecules/ComponentCard',
  component: ComponentCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['drawer', 'canvas'],
    },
    status: {
      control: { type: 'select' },
      options: ['healthy', 'stressed', 'overloaded', 'offline'],
    },
    isDragging: {
      control: 'boolean',
    },
    isSelected: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const sampleComponent = {
  id: 'web-server-1',
  name: 'Web Server',
  type: 'server' as const,
  category: 'compute' as const,
  cost: 150,
  capacity: 1000,
  description: 'High-performance web server for handling HTTP requests',
  icon: 'server',
};

export const DrawerVariant: Story = {
  args: {
    data: sampleComponent,
    variant: 'drawer',
    status: 'healthy',
    isDragging: false,
    isSelected: false,
    onSelect: () => {},
  },
};

export const CanvasVariant: Story = {
  args: {
    data: sampleComponent,
    variant: 'canvas',
    status: 'healthy',
    isDragging: false,
    isSelected: false,
    onSelect: () => {},
  },
};

export const Selected: Story = {
  args: {
    data: sampleComponent,
    variant: 'canvas',
    status: 'healthy',
    isDragging: false,
    isSelected: true,
    onSelect: () => {},
  },
};

export const Stressed: Story = {
  args: {
    data: sampleComponent,
    variant: 'canvas',
    status: 'stressed',
    isDragging: false,
    isSelected: false,
    onSelect: () => {},
  },
};

export const Overloaded: Story = {
  args: {
    data: sampleComponent,
    variant: 'canvas',
    status: 'overloaded',
    isDragging: false,
    isSelected: false,
    onSelect: () => {},
  },
};

export const Offline: Story = {
  args: {
    data: sampleComponent,
    variant: 'canvas',
    status: 'offline',
    isDragging: false,
    isSelected: false,
    onSelect: () => {},
  },
};

export const Locked: Story = {
  args: {
    data: {
      ...sampleComponent,
      locked: true,
      name: 'Premium Load Balancer',
      type: 'loadbalancer' as const,
      cost: 500,
    },
    variant: 'drawer',
    status: 'healthy',
    isDragging: false,
    isSelected: false,
    onSelect: () => {},
  },
};

export const Database: Story = {
  args: {
    data: {
      id: 'database-1',
      name: 'PostgreSQL Database',
      type: 'database' as const,
      category: 'storage' as const,
      cost: 200,
      capacity: 500,
      description: 'Reliable relational database for data persistence',
      icon: 'database',
    },
    variant: 'drawer',
    status: 'healthy',
    isDragging: false,
    isSelected: false,
    onSelect: () => {},
  },
};

export const Dragging: Story = {
  args: {
    data: sampleComponent,
    variant: 'drawer',
    status: 'healthy',
    isDragging: true,
    isSelected: false,
    onSelect: () => {},
  },
};
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/stories/ComponentDrawer.stories.tsx
```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { ComponentDrawer } from '../components/organisms/ComponentDrawer';
import { useState } from 'react';

const meta: Meta<typeof ComponentDrawer> = {
  title: 'Organisms/ComponentDrawer',
  component: ComponentDrawer,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const sampleCategories = [
  { id: 'compute', name: 'Compute', icon: 'server' },
  { id: 'storage', name: 'Storage', icon: 'database' },
  { id: 'networking', name: 'Networking', icon: 'network' },
  { id: 'security', name: 'Security', icon: 'shield' },
];

const sampleComponents = [
  {
    id: 'web-server',
    name: 'Web Server',
    type: 'server' as const,
    category: 'compute' as const,
    cost: 150,
    capacity: 1000,
    description: 'High-performance web server for handling HTTP requests',
    icon: 'server',
  },
  {
    id: 'load-balancer',
    name: 'Load Balancer',
    type: 'loadbalancer' as const,
    category: 'networking' as const,
    cost: 300,
    capacity: 5000,
    description: 'Distributes incoming requests across multiple servers',
    icon: 'loadbalancer',
  },
  {
    id: 'database',
    name: 'PostgreSQL Database',
    type: 'database' as const,
    category: 'storage' as const,
    cost: 200,
    capacity: 500,
    description: 'Reliable relational database for data persistence',
    icon: 'database',
  },
  {
    id: 'redis-cache',
    name: 'Redis Cache',
    type: 'cache' as const,
    category: 'storage' as const,
    cost: 100,
    capacity: 10000,
    description: 'In-memory data structure store for caching',
    icon: 'cache',
  },
  {
    id: 'api-gateway',
    name: 'API Gateway',
    type: 'api' as const,
    category: 'networking' as const,
    cost: 250,
    capacity: 2000,
    description: 'Manages API requests and provides authentication',
    icon: 'api',
  },
  {
    id: 'cdn',
    name: 'Content Delivery Network',
    type: 'cdn' as const,
    category: 'networking' as const,
    cost: 180,
    capacity: 50000,
    description: 'Global network for fast content delivery',
    icon: 'cdn',
  },
  {
    id: 'premium-server',
    name: 'Premium Server',
    type: 'server' as const,
    category: 'compute' as const,
    cost: 500,
    capacity: 5000,
    description: 'High-end server with premium features',
    icon: 'server',
    locked: true,
  },
];

// Component wrapper to handle state
const ComponentDrawerWrapper = (args: any) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <ComponentDrawer
      {...args}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
    />
  );
};

export const Default: Story = {
  render: ComponentDrawerWrapper,
  args: {
    components: sampleComponents,
    categories: sampleCategories,
    onComponentDragStart: () => {},
    onComponentDragEnd: () => {},
  },
};

export const WithSearch: Story = {
  render: (args) => {
    const [searchQuery, setSearchQuery] = useState('server');
    
    return (
      <ComponentDrawer
        {...args}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
    );
  },
  args: {
    components: sampleComponents,
    categories: sampleCategories,
    onComponentDragStart: () => {},
    onComponentDragEnd: () => {},
  },
};

export const EmptyState: Story = {
  render: ComponentDrawerWrapper,
  args: {
    components: [],
    categories: sampleCategories,
    onComponentDragStart: () => {},
    onComponentDragEnd: () => {},
  },
};

export const SingleCategory: Story = {
  render: ComponentDrawerWrapper,
  args: {
    components: sampleComponents.filter(c => c.category === 'compute'),
    categories: [{ id: 'compute', name: 'Compute', icon: 'server' }],
    onComponentDragStart: () => {},
    onComponentDragEnd: () => {},
  },
};

export const ManyComponents: Story = {
  render: ComponentDrawerWrapper,
  args: {
    components: [
      ...sampleComponents,
      ...Array.from({ length: 15 }, (_, i) => ({
        id: `component-${i}`,
        name: `Component ${i + 1}`,
        type: 'server' as const,
        category: 'compute' as const,
        cost: 100 + i * 10,
        capacity: 500 + i * 100,
        description: `Description for component ${i + 1}`,
        icon: 'server',
      })),
    ],
    categories: sampleCategories,
    onComponentDragStart: () => {},
    onComponentDragEnd: () => {},
  },
};

export const FilteredResults: Story = {
  render: (args) => {
    const [searchQuery, setSearchQuery] = useState('database');
    
    return (
      <ComponentDrawer
        {...args}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
    );
  },
  args: {
    components: sampleComponents,
    categories: sampleCategories,
    onComponentDragStart: () => {},
    onComponentDragEnd: () => {},
  },
};
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/stories/GameHUD.stories.tsx
```tsx
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
        reputation_points: 12750,
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
              reputation_points: 89500,
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
              reputation_points: 150,
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
              reputation_points: 45200,
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
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/stories/ImageComparison.stories.tsx
```tsx
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
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/stories/index.ts
```ts
// Export all story files for easier imports
export * from './Button.stories';
export * from './Badge.stories';
export * from './Card.stories';
export * from './Progress.stories';

export * from './QuestionCard.stories';
export * from './MentorCard.stories';
export * from './MetricCard.stories';
export * from './CharacterPortrait.stories';
export * from './ComponentCard.stories';
export * from './PhaseHeader.stories';
export * from './ImageComparison.stories';

export * from './AchievementToast.stories';
export * from './GameHUD.stories';
export * from './MetricsDashboard.stories';
export * from './ComponentDrawer.stories';
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/stories/MentorCard.stories.tsx
```tsx
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
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/stories/MetricCard.stories.tsx
```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { MetricCard } from '../components/molecules/MetricCard';

const meta: Meta<typeof MetricCard> = {
  title: 'Molecules/MetricCard',
  component: MetricCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    data: {
      control: 'object',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: {
      label: 'Response Time',
      value: 45.2,
      unit: 'ms',
      trend: 'stable',
      status: 'normal',
    },
    onHover: () => {},
  },
};

export const TrendingUp: Story = {
  args: {
    data: {
      label: 'Daily Active Users',
      value: 12450,
      unit: '',
      trend: 'up',
      trendValue: 12.5,
      status: 'normal',
    },
    onHover: () => {},
  },
};

export const TrendingDown: Story = {
  args: {
    data: {
      label: 'Error Rate',
      value: 2.1,
      unit: '%',
      trend: 'down',
      trendValue: -15.3,
      status: 'normal',
    },
    onHover: () => {},
  },
};

export const Warning: Story = {
  args: {
    data: {
      label: 'CPU Usage',
      value: 78.5,
      unit: '%',
      trend: 'up',
      trendValue: 8.2,
      status: 'warning',
      target: 100,
    },
    onHover: () => {},
  },
};

export const Critical: Story = {
  args: {
    data: {
      label: 'Memory Usage',
      value: 92.8,
      unit: '%',
      trend: 'up',
      trendValue: 25.1,
      status: 'critical',
      target: 100,
    },
    onHover: () => {},
  },
};

export const WithTarget: Story = {
  args: {
    data: {
      label: 'Revenue',
      value: 847500,
      unit: '$',
      trend: 'up',
      trendValue: 18.7,
      status: 'normal',
      target: 1000000,
    },
    onHover: () => {},
  },
};

export const LargeNumber: Story = {
  args: {
    data: {
      label: 'Total Requests',
      value: 2847392,
      unit: '',
      trend: 'up',
      trendValue: 5.2,
      status: 'normal',
    },
    onHover: () => {},
  },
};
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/stories/MetricsDashboard.stories.tsx
```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { MetricsDashboard } from '../components/organisms/MetricsDashboard';

const meta: Meta<typeof MetricsDashboard> = {
  title: 'Organisms/MetricsDashboard',
  component: MetricsDashboard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: { type: 'select' },
      options: ['normal', 'warning', 'critical'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const sampleMetrics = [
  {
    label: 'CPU Usage',
    value: 45,
    unit: '%',
    trend: 'stable' as const,
    max: 100,
    status: 'normal' as const,
  },
  {
    label: 'Memory Usage',
    value: 2048,
    unit: 'MB',
    trend: 'up' as const,
    trendValue: '+5%',
    max: 8192,
    status: 'normal' as const,
  },
  {
    label: 'Active Users',
    value: 1250,
    trend: 'up' as const,
    trendValue: '+12%',
    status: 'normal' as const,
  },
  {
    label: 'Response Time',
    value: 89,
    unit: 'ms',
    trend: 'down' as const,
    trendValue: '-8%',
    max: 1000,
    status: 'normal' as const,
  },
];

export const Default: Story = {
  args: {
    title: 'System Metrics',
    metrics: sampleMetrics,
    status: 'normal',
  },
};

export const Warning: Story = {
  args: {
    title: 'System Performance',
    metrics: [
      {
        label: 'CPU Usage',
        value: 78,
        unit: '%',
        trend: 'up' as const,
        trendValue: '+15%',
        max: 100,
        status: 'warning' as const,
      },
      {
        label: 'Memory Usage',
        value: 6144,
        unit: 'MB',
        trend: 'up' as const,
        trendValue: '+25%',
        max: 8192,
        status: 'warning' as const,
      },
      {
        label: 'Error Rate',
        value: 15,
        unit: '%',
        trend: 'up' as const,
        trendValue: '+300%',
        max: 20,
        status: 'warning' as const,
      },
    ],
    status: 'warning',
  },
};

export const Critical: Story = {
  args: {
    title: 'System Alert',
    metrics: [
      {
        label: 'CPU Usage',
        value: 95,
        unit: '%',
        trend: 'up' as const,
        trendValue: '+40%',
        max: 100,
        status: 'critical' as const,
      },
      {
        label: 'Memory Usage',
        value: 7936,
        unit: 'MB',
        trend: 'up' as const,
        trendValue: '+50%',
        max: 8192,
        status: 'critical' as const,
      },
      {
        label: 'Response Time',
        value: 2500,
        unit: 'ms',
        trend: 'up' as const,
        trendValue: '+400%',
        max: 3000,
        status: 'critical' as const,
      },
    ],
    status: 'critical',
  },
};

export const DatabaseMetrics: Story = {
  args: {
    title: 'Database Performance',
    metrics: [
      {
        label: 'Query Time',
        value: 25,
        unit: 'ms',
        trend: 'stable' as const,
        max: 100,
        status: 'normal' as const,
      },
      {
        label: 'Connections',
        value: 145,
        trend: 'up' as const,
        trendValue: '+8%',
        max: 500,
        status: 'normal' as const,
      },
      {
        label: 'Cache Hit Rate',
        value: 94,
        unit: '%',
        trend: 'stable' as const,
        max: 100,
        status: 'normal' as const,
      },
      {
        label: 'Storage Used',
        value: 256,
        unit: 'GB',
        trend: 'up' as const,
        trendValue: '+2%',
        max: 1000,
        status: 'normal' as const,
      },
    ],
    status: 'normal',
  },
};

export const NetworkMetrics: Story = {
  args: {
    title: 'Network Statistics',
    metrics: [
      {
        label: 'Bandwidth Usage',
        value: 125,
        unit: 'Mbps',
        trend: 'up' as const,
        trendValue: '+18%',
        max: 1000,
        status: 'normal' as const,
      },
      {
        label: 'Packet Loss',
        value: 0.2,
        unit: '%',
        trend: 'down' as const,
        trendValue: '-50%',
        max: 5,
        status: 'normal' as const,
      },
      {
        label: 'Latency',
        value: 12,
        unit: 'ms',
        trend: 'stable' as const,
        max: 100,
        status: 'normal' as const,
      },
    ],
    status: 'normal',
  },
};

export const SingleMetric: Story = {
  args: {
    title: 'API Health',
    metrics: [
      {
        label: 'Uptime',
        value: 99.95,
        unit: '%',
        trend: 'stable' as const,
        max: 100,
        status: 'normal' as const,
      },
    ],
    status: 'normal',
  },
};
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/stories/PhaseHeader.stories.tsx
```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { PhaseHeader } from '../components/molecules/PhaseHeader';
import { Button } from '../components/atoms/Button';

const meta: Meta<typeof PhaseHeader> = {
  title: 'Molecules/PhaseHeader',
  component: PhaseHeader,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'career-map', 'game-phase'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'System Design Challenge',
    subtitle: 'Design a scalable chat application',
    variant: 'default',
  },
};

export const WithSubtitle: Story = {
  args: {
    title: 'Phase 1: Requirements Analysis',
    subtitle: 'Understand the business requirements and technical constraints',
    variant: 'default',
  },
};

export const WithRightContent: Story = {
  args: {
    title: 'Architecture Design',
    subtitle: 'Create a high-level system architecture',
    variant: 'default',
    rightContent: (
      <div className="flex gap-2">
        <Button variant="outline" size="small">Save Draft</Button>
        <Button variant="primary" size="small">Continue</Button>
      </div>
    ),
  },
};

export const CareerMapVariant: Story = {
  args: {
    title: 'Career Journey',
    subtitle: 'Your path to becoming a system architect',
    variant: 'career-map',
    rightContent: (
      <div className="text-sm text-gray-600">
        Level 5 • Senior Developer
      </div>
    ),
  },
};

export const GamePhaseVariant: Story = {
  args: {
    title: 'Design Phase',
    subtitle: 'Time Remaining: 15:30',
    variant: 'game-phase',
    rightContent: (
      <div className="flex items-center gap-3">
        <div className="text-sm">
          <span className="text-gray-600">Score:</span>
          <span className="font-bold text-green-600 ml-1">850</span>
        </div>
        <Button variant="ghost" size="small">Pause</Button>
      </div>
    ),
  },
};

export const LongTitle: Story = {
  args: {
    title: 'Complex Multi-Tenant SaaS Platform Architecture with Microservices',
    subtitle: 'Design a system that handles multiple clients with isolated data and custom configurations while maintaining high availability and scalability',
    variant: 'default',
    rightContent: (
      <Button variant="primary" size="small">Get Help</Button>
    ),
  },
};

export const MinimalGamePhase: Story = {
  args: {
    title: 'Quick Challenge',
    variant: 'game-phase',
  },
};
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/stories/Progress.stories.tsx
```tsx
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
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/stories/QuestionCard.stories.tsx
```tsx
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
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/stories/README.md
```md
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
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/styles/design-system/auth-pages.css
```css
/* Authentication Layout Styles - Matching Landing Page Theme */

/* Auth Layout Base */
.auth-layout {
  min-height: 100vh;
  background: linear-gradient(135deg, 
    var(--color-neutral-900) 0%, 
    var(--color-primary-900) 50%, 
    var(--color-premium-900) 100%
  );
  position: relative;
  overflow-x: hidden;
}

/* Auth Layout Navigation */
.auth-layout__nav {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  padding: var(--space-6);
}

.auth-layout__nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.auth-layout__logo {
  font-size: var(--text-h3);
  font-weight: var(--font-bold);
  color: var(--color-white);
  text-decoration: none;
  background: none;
  border: none;
  cursor: pointer;
  transition: color var(--duration-fast) var(--ease-out);
}

.auth-layout__logo:hover {
  color: var(--color-neutral-300);
}

.auth-layout__nav-actions {
  display: flex;
  gap: var(--space-4);
}

.auth-layout__nav-button {
  color: var(--color-white) !important;
  border-color: transparent !important;
}

.auth-layout__nav-button:hover {
  color: var(--color-neutral-300) !important;
  background: rgba(255, 255, 255, 0.1) !important;
}

/* Auth Layout Container */
.auth-layout__container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-6);
  padding-top: 120px;
}

.auth-layout__content {
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
}

/* Auth Form Container */
.auth-layout__form-container {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-xl);
  overflow: hidden;
  backdrop-filter: blur(10px);
  position: relative;
  animation: fade-in-up 0.6s var(--ease-out);
}

.auth-layout__form-container::before {
  content: '';
  position: absolute;
  inset: -2px;
  background: linear-gradient(45deg, var(--color-primary-500), var(--color-premium-500));
  border-radius: var(--radius-xl);
  z-index: -1;
  opacity: 0.2;
  filter: blur(8px);
}

/* Auth Tabs */
.auth-layout__tabs {
  display: flex;
  background: rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.auth-layout__tab {
  flex: 1;
  padding: var(--space-4);
  background: none;
  border: none;
  color: var(--color-neutral-400);
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
  position: relative;
}

.auth-layout__tab:hover {
  color: var(--color-white);
  background: rgba(255, 255, 255, 0.05);
}

.auth-layout__tab--active {
  color: var(--color-white);
  background: rgba(255, 255, 255, 0.1);
}

.auth-layout__tab--active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--color-primary-500), var(--color-premium-500));
}

/* Auth Form Content */
.auth-layout__form-content {
  padding: var(--space-8);
}

/* Animation */
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Updated Auth Page Styles for Modal Context */
.auth-page {
  background: transparent;
  border-radius: 0;
  box-shadow: none;
  padding: 0;
  max-width: none;
  width: 100%;
}

/* Updated Auth Header for Dark Theme */
.auth-page__header {
  text-align: center;
  margin-bottom: var(--space-8);
}

.auth-page__title {
  font-size: var(--text-h2);
  font-weight: var(--font-bold);
  color: var(--color-white);
  margin-bottom: var(--space-2);
}

.auth-page__subtitle {
  font-size: var(--text-base);
  color: var(--color-neutral-300);
}

/* Updated OAuth Providers for Dark Theme */
.auth-page__oauth-providers {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin-bottom: var(--space-6);
}

.auth-page__oauth-button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-lg);
  background: rgba(255, 255, 255, 0.05);
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  color: var(--color-white);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
}

.auth-page__oauth-button:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

.auth-page__oauth-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.auth-page__oauth-button:disabled:hover {
  transform: none;
}

.auth-page__oauth-icon {
  font-size: var(--text-xl);
}

/* Updated Demo Button Styles */
.auth-page__demo-section {
  margin-bottom: var(--space-6);
}

.auth-page__demo-button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--color-premium-500);
  border-radius: var(--radius-lg);
  background: linear-gradient(135deg, var(--color-premium-600), var(--color-primary-600));
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  color: var(--color-white);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
}

.auth-page__demo-button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(147, 51, 234, 0.3);
}

.auth-page__demo-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.auth-page__demo-button:disabled:hover {
  transform: none;
}

/* Updated Divider for Dark Theme */
.auth-page__divider {
  position: relative;
  margin: var(--space-6) 0;
}

.auth-page__divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: rgba(255, 255, 255, 0.2);
}

.auth-page__divider-text {
  position: relative;
  display: flex;
  justify-content: center;
  background: transparent;
  padding: 0 var(--space-4);
  font-size: var(--text-small);
  color: var(--color-neutral-400);
}

/* Updated Form Styles for Dark Theme */
.auth-page__form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.auth-page__error-message {
  padding: var(--space-3);
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: var(--radius-lg);
  color: var(--color-error-300);
  font-size: var(--text-small);
}

/* Updated Form Group for Dark Theme */
.auth-page__form-group {
  display: flex;
  flex-direction: column;
}

.auth-page__form-label {
  display: block;
  font-size: var(--text-small);
  font-weight: var(--font-medium);
  color: var(--color-neutral-200);
  margin-bottom: var(--space-1);
}

.auth-page__form-input {
  width: 100%;
  padding: var(--space-3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-lg);
  font-size: var(--text-base);
  color: var(--color-white);
  background: rgba(255, 255, 255, 0.05);
  transition: all var(--duration-fast) var(--ease-out);
}

.auth-page__form-input:hover {
  border-color: rgba(255, 255, 255, 0.3);
}

.auth-page__form-input:focus {
  outline: none;
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
  background: rgba(255, 255, 255, 0.08);
}

.auth-page__form-input::placeholder {
  color: var(--color-neutral-500);
}

/* Updated Input Error State for Dark Theme */
.auth-page__form-input--error {
  border-color: var(--color-error-500);
}

.auth-page__form-input--error:focus {
  border-color: var(--color-error-500);
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2);
}

.auth-page__form-error-text {
  margin-top: var(--space-1);
  font-size: var(--text-small);
  color: var(--color-error-300);
}

/* Updated Form Actions for Dark Theme */
.auth-page__form-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: var(--space-2) 0;
}

.auth-page__checkbox-group {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.auth-page__checkbox {
  width: 16px;
  height: 16px;
  border-radius: var(--radius-sm);
  border: 1px solid rgba(255, 255, 255, 0.3);
  accent-color: var(--color-primary-500);
  cursor: pointer;
  background: rgba(255, 255, 255, 0.05);
}

.auth-page__checkbox-label {
  font-size: var(--text-small);
  color: var(--color-neutral-300);
  cursor: pointer;
}

.auth-page__link {
  font-size: var(--text-small);
  color: var(--color-primary-400);
  text-decoration: none;
  transition: color var(--duration-fast) var(--ease-out);
}

.auth-page__link:hover {
  color: var(--color-primary-300);
  text-decoration: underline;
}

/* Updated Terms Checkbox for Dark Theme */
.auth-page__terms-group {
  display: flex;
  align-items: flex-start;
  gap: var(--space-2);
  margin: var(--space-2) 0;
}

.auth-page__terms-checkbox {
  margin-top: 2px;
  flex-shrink: 0;
}

.auth-page__terms-label {
  font-size: var(--text-small);
  color: var(--color-neutral-300);
  line-height: 1.4;
}

.auth-page__terms-label a {
  color: var(--color-primary-400);
  text-decoration: none;
}

.auth-page__terms-label a:hover {
  text-decoration: underline;
}

/* Updated Submit Button for Dark Theme */
.auth-page__submit-button {
  width: 100%;
  padding: var(--space-3);
  background: linear-gradient(135deg, var(--color-primary-600), var(--color-premium-600));
  color: var(--color-white);
  border: none;
  border-radius: var(--radius-lg);
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
}

.auth-page__submit-button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.auth-page__submit-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.auth-page__submit-button:disabled:hover {
  transform: none;
  box-shadow: none;
}

/* Updated Footer for Dark Theme */
.auth-page__footer {
  text-align: center;
  margin-top: var(--space-6);
  font-size: var(--text-small);
  color: var(--color-neutral-400);
}

.auth-page__footer a {
  color: var(--color-primary-400);
  text-decoration: none;
}

.auth-page__footer a:hover {
  text-decoration: underline;
}

/* Updated Responsive Design */
@media (max-width: 479px) {
  .auth-layout__container {
    padding: var(--space-4);
    padding-top: 100px;
  }
  
  .auth-layout__form-content {
    padding: var(--space-6);
  }
  
  .auth-page__oauth-button {
    padding: var(--space-3);
    font-size: var(--text-small);
  }
  
  .auth-page__oauth-icon {
    font-size: var(--text-base);
  }
  
  .auth-page__form-actions {
    flex-direction: column;
    gap: var(--space-2);
    align-items: flex-start;
  }
}

/* Updated Accessibility */
@media (prefers-reduced-motion: reduce) {
  .auth-layout__form-container {
    animation: none;
  }
  
  .auth-page__oauth-button:hover,
  .auth-page__submit-button:hover,
  .auth-page__demo-button:hover {
    transform: none;
  }
}

/* Updated Loading State */
.auth-page__loading {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
}

.auth-page__loading::before {
  content: '';
  width: 16px;
  height: 16px;
  border: 2px solid var(--color-white);
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
} 
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/styles/design-system/career-map.css
```css
/* Career Map Screen Styles - Following Design System */

/* Career Map Container */
.career-map {
  height: 100vh;
  background: var(--color-neutral-900);
  color: var(--color-white);
  padding: var(--space-8);
  overflow: hidden;
}

/* Fullscreen modifier - removes padding and constraints */
.career-map--fullscreen {
  padding: 0;
  height: 100vh;
  background: var(--color-neutral-900);
  color: var(--color-white);
  overflow: hidden;
}

.career-map--fullscreen .career-map__container {
  max-width: none;
  margin: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.career-map--fullscreen .career-map__phaser-container {
  width: 100vw;
  height: 100vh;
  max-width: none;
  max-height: none;
  border-radius: 0;
  overflow: hidden;
  box-shadow: none;
  border: none;
}

.career-map__container {
  max-width: 1280px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* Career Map Header */
.career-map__header {
  margin-bottom: var(--space-6);
  flex-shrink: 0;
}

.career-map__title {
  font-size: var(--text-h1);
  font-weight: var(--font-bold);
  margin-bottom: var(--space-2);
  color: var(--color-white);
}

.career-map__subtitle {
  font-size: var(--text-base);
  color: var(--color-neutral-400);
  margin-bottom: 0;
}

/* Loading State */
.career-map__loading {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.career-map__spinner {
  width: 48px;
  height: 48px;
  border: 2px solid transparent;
  border-top: 2px solid var(--color-primary-500);
  border-bottom: 2px solid var(--color-primary-500);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Phaser.js Game Container */
.career-map__game-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: var(--space-6);
  min-height: 0;
}

.career-map__phaser-container {
  width: 100%;
  height: 100%;
  max-width: 1000px;
  max-height: 700px;
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-xl);
  border: 1px solid var(--color-neutral-700);
}

.career-map__phaser-container canvas {
  display: block;
  width: 100% !important;
  height: 100% !important;
}

/* Controls and Legend */
.career-map__controls {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-8);
  flex-shrink: 0;
  padding: var(--space-6);
  background: var(--color-neutral-800);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-neutral-700);
}

.career-map__controls-section {
  flex: 1;
}

.career-map__controls-title {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--color-white);
  margin-bottom: var(--space-3);
}

.career-map__controls-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.career-map__controls-item {
  display: flex;
  align-items: center;
  margin-bottom: var(--space-2);
  font-size: var(--text-sm);
  color: var(--color-neutral-300);
}

.career-map__controls-item:last-child {
  margin-bottom: 0;
}

.career-map__controls-item strong {
  color: var(--color-white);
  margin-right: var(--space-2);
}

/* Legend Icons */
.career-map__legend-icon {
  display: inline-block;
  margin-right: var(--space-2);
  font-size: var(--text-base);
  width: 20px;
  text-align: center;
}

.career-map__legend-icon--available {
  color: var(--color-primary-500);
}

.career-map__legend-icon--completed {
  color: var(--color-success-500);
}

.career-map__legend-icon--locked {
  color: var(--color-neutral-500);
}

/* Responsive Design */
@media (max-width: 768px) {
  .career-map {
    padding: var(--space-4);
  }
  
  .career-map__controls {
    grid-template-columns: 1fr;
    gap: var(--space-4);
  }
  
  .career-map__header {
    margin-bottom: var(--space-4);
  }
  
  .career-map__title {
    font-size: var(--text-h2);
  }
  
  .career-map__subtitle {
    font-size: var(--text-sm);
  }
  
  .career-map__game-container {
    margin-bottom: var(--space-4);
  }
}

@media (max-width: 480px) {
  .career-map {
    padding: var(--space-2);
  }
  
  .career-map__controls {
    padding: var(--space-4);
  }
  
  .career-map__phaser-container {
    border-radius: var(--radius-md);
  }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  .career-map__spinner {
    animation: none;
  }
}

/* Focus States */
.career-map__phaser-container:focus-within {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
}

/* Dark theme adjustments for better contrast */
.career-map__phaser-container {
  background: var(--color-neutral-950);
}

/* Ensure proper z-index for phaser game */
.career-map__phaser-container {
  position: relative;
  z-index: 1;
} 
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/styles/design-system/components.css
```css
/* System Design Tycoon - Component Styles v2.0 */

/* Base Button Styles */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  font-family: var(--font-sans);
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  line-height: var(--leading-normal);
  border-radius: var(--radius-lg);
  border: none;
  cursor: pointer;
  transition: all var(--duration-normal) var(--ease-out);
  position: relative;
  overflow: hidden;
  white-space: nowrap;
  user-select: none;
}

.btn:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Button Variants */
.btn--primary {
  background: var(--color-primary-600);
  color: white;
}

.btn--primary:hover:not(:disabled) {
  background: var(--color-primary-700);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.btn--primary:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
}

.btn--secondary {
  background: var(--color-secondary-600);
  color: white;
}

.btn--secondary:hover:not(:disabled) {
  background: var(--color-secondary-700);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
}

.btn--outline {
  background: transparent;
  border: 2px solid var(--color-primary-600);
  color: var(--color-primary-600);
}

.btn--outline:hover:not(:disabled) {
  background: var(--color-primary-50);
  border-color: var(--color-primary-700);
  color: var(--color-primary-700);
}

.btn--ghost {
  background: transparent;
  color: var(--color-neutral-700);
}

.btn--ghost:hover:not(:disabled) {
  background: var(--color-neutral-100);
  color: var(--color-neutral-900);
}

.btn--danger {
  background: var(--color-error-600);
  color: white;
}

.btn--danger:hover:not(:disabled) {
  background: var(--color-error-700);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

/* Button Sizes */
.btn--small {
  padding: var(--space-1) var(--space-3);
  font-size: var(--text-sm);
}

.btn--large {
  padding: var(--space-3) var(--space-6);
  font-size: var(--text-lg);
}

.btn--icon-only {
  padding: var(--space-2);
  aspect-ratio: 1;
}

/* Button Loading State */
.btn--loading {
  color: transparent;
}

.btn--loading::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 16px;
  height: 16px;
  margin: -8px 0 0 -8px;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

/* Card Components */
.card {
  background: var(--color-white);
  border: 1px solid var(--color-neutral-200);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  transition: all var(--duration-normal) var(--ease-out);
  overflow: hidden;
}

.card--interactive {
  cursor: pointer;
}

.card--interactive:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-xl);
  border-color: var(--color-primary-300);
}

.card--interactive:active {
  transform: translateY(0);
}

.card--selected {
  border-color: var(--color-primary-600);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
}

.card--disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.card__header {
  margin: calc(-1 * var(--space-6)) calc(-1 * var(--space-6)) var(--space-6);
  padding: var(--space-4) var(--space-6);
  border-bottom: 1px solid var(--color-neutral-200);
  font-weight: var(--font-semibold);
}

.card__body {
  margin: 0 calc(-1 * var(--space-6));
  padding: 0 var(--space-6);
}

.card__footer {
  margin: var(--space-6) calc(-1 * var(--space-6)) calc(-1 * var(--space-6));
  padding: var(--space-4) var(--space-6);
  border-top: 1px solid var(--color-neutral-200);
  background: var(--color-neutral-50);
  display: flex;
  gap: var(--space-2);
  justify-content: flex-end;
}

/* Badge Component */
.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-2);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  border-radius: var(--radius-full);
  transition: all var(--duration-fast) var(--ease-out);
}

.badge__icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Badge Variants */
.badge--default {
  background: var(--color-neutral-100);
  color: var(--color-neutral-700);
}

.badge--primary {
  background: var(--color-primary-100);
  color: var(--color-primary-700);
}

.badge--success {
  background: var(--color-secondary-100);
  color: var(--color-secondary-700);
}

.badge--warning {
  background: var(--color-warning-100);
  color: var(--color-warning-700);
}

.badge--destructive {
  background: var(--color-error-100);
  color: var(--color-error-700);
}

.badge--outline {
  background: transparent;
  border: 1px solid var(--color-neutral-300);
  color: var(--color-neutral-700);
}

/* Badge Sizes */
.badge--sm {
  padding: var(--space-1) var(--space-2);
  font-size: var(--text-xs);
}

.badge--md {
  padding: var(--space-1) var(--space-3);
  font-size: var(--text-xs);
}

.badge--lg {
  padding: var(--space-2) var(--space-4);
  font-size: var(--text-sm);
}

/* Progress Bar */
.progress {
  width: 100%;
  height: var(--space-2);
  background: var(--color-neutral-200);
  border-radius: var(--radius-full);
  overflow: hidden;
  position: relative;
}

.progress__bar {
  height: 100%;
  background: var(--color-primary-500);
  border-radius: var(--radius-full);
  transition: width var(--duration-normal) var(--ease-out);
  position: relative;
  overflow: hidden;
}

.progress__bar::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

/* Progress Variants */
.progress--primary .progress__bar {
  background: var(--color-primary-500);
}

.progress--success .progress__bar {
  background: var(--color-secondary-500);
}

.progress--warning .progress__bar {
  background: var(--color-warning-500);
}

.progress--destructive .progress__bar {
  background: var(--color-error-500);
}

/* Progress Sizes */
.progress--sm {
  height: var(--space-1);
}

.progress--md {
  height: var(--space-2);
}

.progress--lg {
  height: var(--space-3);
}

/* Metric Display */
.metric {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.metric__label {
  font-size: var(--text-xs);
  color: var(--color-neutral-500);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.metric__value {
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--color-neutral-900);
  line-height: 1;
}

.metric__unit {
  font-size: var(--text-sm);
  color: var(--color-neutral-500);
  margin-left: var(--space-1);
}

.metric__trend {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--text-sm);
}

.metric__trend--up {
  color: var(--color-secondary-600);
}

.metric__trend--down {
  color: var(--color-error-600);
}

/* Avatar Component */
.avatar {
  position: relative;
  display: inline-block;
  overflow: hidden;
  border-radius: var(--radius-full);
  background: var(--color-neutral-200);
}

.avatar__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar__status {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 25%;
  height: 25%;
  border-radius: var(--radius-full);
  border: 2px solid white;
}

.avatar__status--online {
  background: var(--color-secondary-500);
}

.avatar__status--offline {
  background: var(--color-neutral-400);
}

.avatar__status--busy {
  background: var(--color-error-500);
}

/* Avatar Sizes */
.avatar--xs {
  width: 24px;
  height: 24px;
}

.avatar--sm {
  width: 32px;
  height: 32px;
}

.avatar--md {
  width: 40px;
  height: 40px;
}

.avatar--lg {
  width: 56px;
  height: 56px;
}

.avatar--xl {
  width: 80px;
  height: 80px;
}

/* Tooltip Component */
.tooltip {
  position: relative;
  display: inline-block;
}

.tooltip__content {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(-8px);
  padding: var(--space-2) var(--space-3);
  background: var(--color-neutral-900);
  color: white;
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all var(--duration-fast) var(--ease-out);
  z-index: var(--z-tooltip);
}

.tooltip__content::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 4px solid transparent;
  border-top-color: var(--color-neutral-900);
}

.tooltip:hover .tooltip__content {
  opacity: 1;
  visibility: visible;
}

/* Spinner Component */
.spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid var(--color-neutral-200);
  border-top-color: var(--color-primary-500);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.spinner--small {
  width: 16px;
  height: 16px;
}

.spinner--large {
  width: 32px;
  height: 32px;
  border-width: 3px;
}

/* Animation Keyframes */
@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
  20%, 40%, 60%, 80% { transform: translateX(2px); }
}

/* Phase Header Component */
.phase-header {
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, var(--meeting-bg-gradient-start), var(--meeting-bg-gradient-end));
  color: var(--color-white);
  padding: var(--space-4) var(--space-8);
  border-bottom: 1px solid var(--meeting-overlay);
  box-shadow: var(--shadow-lg);
}

.phase-header__content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.phase-header__title-section {
  flex: 1;
}

.phase-header__title {
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  margin: 0;
  line-height: var(--leading-tight);
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.phase-header__subtitle {
  font-size: var(--text-base);
  font-weight: var(--font-normal);
  margin: var(--space-1) 0 0 0;
  opacity: 0.9;
  line-height: var(--leading-normal);
}

.phase-header__right-section {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

/* Phase Header Variants */
.phase-header--career-map {
  background: linear-gradient(135deg, var(--color-primary-600), var(--color-premium-700));
  padding: var(--space-8);
}

.phase-header--career-map .phase-header__title {
  font-size: var(--text-4xl);
  font-weight: var(--font-extrabold);
}

.phase-header--career-map .phase-header__subtitle {
  font-size: var(--text-lg);
  margin-top: var(--space-2);
}

.phase-header--game-phase {
  background: linear-gradient(135deg, var(--color-primary-800), var(--color-primary-900));
  padding: var(--space-6) var(--space-8);
  border-bottom: 2px solid var(--meeting-overlay);
}

.phase-header--game-phase .phase-header__title {
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
}

.phase-header--game-phase .phase-header__subtitle {
  font-size: var(--text-sm);
  opacity: 0.8;
}

/* Responsive Design */
@media (max-width: 768px) {
  .phase-header {
    padding: var(--space-4) var(--space-4);
  }
  
  .phase-header__content {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-3);
  }
  
  .phase-header__title-section {
    flex: none;
    width: 100%;
  }
  
  .phase-header__right-section {
    width: 100%;
    justify-content: flex-end;
  }
  
  .phase-header--career-map .phase-header__title {
    font-size: var(--text-3xl);
  }
  
  .phase-header--game-phase .phase-header__title {
    font-size: var(--text-lg);
  }
}

/* Utility Classes */
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.transition-colors {
  transition-property: background-color, border-color, color, fill, stroke;
  transition-timing-function: var(--ease-out);
  transition-duration: var(--duration-normal);
}

.transition-transform {
  transition-property: transform;
  transition-timing-function: var(--ease-out);
  transition-duration: var(--duration-normal);
}

.transition-all {
  transition-property: all;
  transition-timing-function: var(--ease-out);
  transition-duration: var(--duration-normal);
}

/* Template Components */

/* Menu Template */
.menu-template {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--color-neutral-900);
  color: var(--color-white);
}

.menu-template__header {
  text-align: center;
  padding: var(--space-12) var(--space-4);
}

.menu-template__title {
  font-size: var(--text-5xl);
  font-weight: var(--font-bold);
  background: linear-gradient(
    to right, 
    var(--color-primary-400), 
    var(--color-secondary-400)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: var(--leading-tight);
}

.menu-template__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-8);
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
}

.menu-template__footer {
  text-align: center;
  padding: var(--space-4);
  opacity: 0.6;
}

.menu-template__version {
  font-size: var(--text-sm);
  color: var(--color-neutral-400);
}

/* Design Phase Template */
.design-phase-template {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: var(--color-neutral-50);
}

.design-phase-template__header {
  padding: var(--space-4) var(--space-8);
  background: var(--color-white);
  border-bottom: 1px solid var(--color-neutral-200);
  box-shadow: var(--shadow-sm);
}

.design-phase-template__workspace {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.design-phase-template__sidebar {
  width: 280px;
  background: var(--color-white);
  border-right: 1px solid var(--color-neutral-200);
  overflow-y: auto;
}

.design-phase-template__canvas {
  flex: 1;
  position: relative;
  overflow: hidden;
  background: var(--design-canvas-bg);
}

.design-phase-template__metrics {
  width: 320px;
  background: var(--color-white);
  border-left: 1px solid var(--color-neutral-200);
  overflow-y: auto;
  padding: var(--space-4);
}

.design-phase-template__mentor {
  position: fixed;
  bottom: var(--space-8);
  right: var(--space-8);
  z-index: var(--z-100);
}

.design-phase-template__placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--color-neutral-500);
  font-size: var(--text-lg);
}

/* Meeting Phase Template */
.meeting-phase-template {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: linear-gradient(135deg, var(--meeting-bg-gradient-start), var(--meeting-bg-gradient-end));
}

.meeting-phase-template__header {
  padding: var(--space-4) var(--space-8);
  background: var(--meeting-overlay);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.meeting-phase-template__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-8);
  overflow-y: auto;
}

.meeting-phase-template__footer {
  padding: var(--space-4) var(--space-8);
  display: flex;
  justify-content: center;
  background: var(--meeting-overlay);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

/* Battle Template */
.battle-template {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: var(--color-neutral-900);
  color: var(--color-white);
}

.battle-template__header {
  padding: var(--space-4) var(--space-8);
  background: var(--color-neutral-800);
  border-bottom: 1px solid var(--color-neutral-700);
}

.battle-template__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-8);
  overflow-y: auto;
}

.battle-template__footer {
  padding: var(--space-4) var(--space-8);
  display: flex;
  justify-content: center;
  background: var(--color-neutral-800);
  border-top: 1px solid var(--color-neutral-700);
}

/* HUD Template */
.hud-template {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: var(--color-neutral-50);
}

.hud-template__header {
  padding: var(--space-4) var(--space-8);
  background: var(--color-white);
  border-bottom: 1px solid var(--color-neutral-200);
  box-shadow: var(--shadow-sm);
}

.hud-template__content {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.hud-template__hud {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: var(--z-50);
}

/* Map Template */
.map-template {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: var(--color-neutral-900);
}

.map-template__header {
  padding: var(--space-4) var(--space-8);
  background: var(--color-neutral-800);
  border-bottom: 1px solid var(--color-neutral-700);
}

.map-template__content {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.map-template__hud {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: var(--z-50);
}

/* Responsive Design for Templates */
@media (max-width: 768px) {
  .menu-template__title {
    font-size: var(--text-4xl);
  }
  
  .menu-template__content {
    padding: var(--space-4);
  }
  
  .design-phase-template__workspace {
    flex-direction: column;
  }
  
  .design-phase-template__sidebar {
    width: 100%;
    height: 200px;
    border-right: none;
    border-bottom: 1px solid var(--color-neutral-200);
  }
  
  .design-phase-template__metrics {
    width: 100%;
    height: 200px;
    border-left: none;
    border-top: 1px solid var(--color-neutral-200);
  }
  
  .design-phase-template__mentor {
    bottom: var(--space-4);
    right: var(--space-4);
  }
}

/* Page Components */

/* Main Menu Page */
.main-menu-page__card {
  padding: var(--space-12);
  min-width: 400px;
  background: var(--color-white);
  border: 1px solid var(--color-neutral-200);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
}

.main-menu-page__options {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.main-menu-page__button {
  width: 100%;
  justify-content: center;
  font-size: var(--text-lg);
  padding: var(--space-6);
  transition: all var(--duration-normal) var(--ease-out);
}

.main-menu-page__button:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

/* Design Page */
.design-page__canvas-placeholder {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--design-canvas-bg);
  color: var(--color-neutral-500);
  font-size: var(--text-xl);
}

/* Game Page */
.game-page__content {
  position: relative;
  height: 100%;
}

.game-page__location-info {
  position: absolute;
  bottom: var(--space-8);
  left: 50%;
  transform: translateX(-50%);
  background: var(--color-white);
  padding: var(--space-6);
  border-radius: var(--radius-xl);
  border: 1px solid var(--color-neutral-200);
  max-width: 600px;
  width: 90%;
  box-shadow: var(--shadow-xl);
}

.game-page__location-info h2 {
  font-size: var(--text-xl);
  margin-bottom: var(--space-2);
  color: var(--color-primary-600);
  font-weight: var(--font-semibold);
}

.game-page__location-info p {
  color: var(--color-neutral-600);
  line-height: var(--leading-relaxed);
}

/* Meeting Page */
.meeting-page__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: var(--space-8);
}

.meeting-page__card {
  background: var(--meeting-card-bg);
  border: 1px solid var(--meeting-card-border);
  border-radius: var(--radius-xl);
  padding: var(--space-8);
  max-width: 800px;
  width: 100%;
  box-shadow: var(--shadow-xl);
}

/* Battle Page */
.battle-page__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: var(--space-8);
}

.battle-page__arena {
  background: var(--color-neutral-800);
  border: 1px solid var(--color-neutral-700);
  border-radius: var(--radius-xl);
  padding: var(--space-8);
  max-width: 1000px;
  width: 100%;
  box-shadow: var(--shadow-xl);
}

/* ================================
   MENTOR CARD STYLES
   ================================ */

/* MentorCard */
.mentor-card {
  background: linear-gradient(135deg, var(--color-neutral-800) 0%, var(--color-neutral-900) 100%);
  border: 1px solid var(--color-neutral-700);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  cursor: pointer;
  transition: all var(--duration-normal) var(--ease-out);
  position: relative;
  overflow: hidden;
}

.mentor-card:hover {
  border-color: var(--color-primary-500);
  transform: translateY(-2px);
  box-shadow: var(--shadow-xl);
}

.mentor-card--selected {
  border-color: var(--color-primary-400);
  background: linear-gradient(135deg, var(--color-primary-900) 0%, var(--color-neutral-900) 100%);
  box-shadow: 0 0 0 2px var(--color-primary-500);
}

.mentor-card--disabled {
  opacity: 0.6;
  cursor: not-allowed;
  filter: grayscale(50%);
}

.mentor-card--disabled:hover {
  transform: none;
  box-shadow: none;
  border-color: var(--color-neutral-700);
}

.mentor-card__header {
  display: flex;
  gap: var(--space-4);
  margin-bottom: var(--space-4);
}

.mentor-card__avatar {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, var(--color-primary-600) 0%, var(--color-primary-700) 100%);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-white);
  font-weight: var(--font-bold);
  font-size: var(--text-lg);
  flex-shrink: 0;
  border: 2px solid var(--color-primary-400);
}

.mentor-card__info {
  flex: 1;
  min-width: 0;
}

.mentor-card__name {
  font-size: var(--text-lg);
  font-weight: var(--font-bold);
  color: var(--color-white);
  margin: 0 0 var(--space-1) 0;
  line-height: 1.2;
}

.mentor-card__title {
  font-size: var(--text-sm);
  color: var(--color-primary-300);
  margin: 0 0 var(--space-2) 0;
  font-weight: var(--font-medium);
}

.mentor-card__tagline {
  font-size: var(--text-xs);
  color: var(--color-neutral-400);
  font-style: italic;
  margin: 0;
}

.mentor-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
}

.mentor-card__tag {
  background: var(--color-primary-600);
  color: var(--color-white);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
}

.mentor-card__quote {
  background: var(--color-neutral-800);
  border-left: 3px solid var(--color-primary-500);
  padding: var(--space-3);
  margin-bottom: var(--space-4);
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
  color: var(--color-neutral-300);
  font-size: var(--text-sm);
  line-height: 1.4;
}

.mentor-card__specialty {
  margin-bottom: var(--space-4);
}

.mentor-card__specialty-title {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--color-white);
  margin: 0 0 var(--space-2) 0;
}

.mentor-card__domains {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-1);
}

.mentor-card__domain {
  background: var(--color-neutral-700);
  color: var(--color-neutral-200);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
  font-size: var(--text-xs);
}

.mentor-card__tools {
  margin-bottom: var(--space-3);
  font-size: var(--text-sm);
  color: var(--color-neutral-300);
}

.mentor-card__tools strong {
  color: var(--color-white);
  font-weight: var(--font-semibold);
}

.mentor-card__tools-list {
  margin-left: var(--space-2);
  color: var(--color-primary-300);
}

.mentor-card__legacy {
  font-size: var(--text-sm);
  color: var(--color-neutral-300);
  line-height: 1.4;
}

.mentor-card__legacy strong {
  color: var(--color-white);
  font-weight: var(--font-semibold);
}

.mentor-card__locked-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  color: var(--color-neutral-400);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
}

.mentor-card__lock-icon {
  width: 32px;
  height: 32px;
  color: var(--color-neutral-500);
}

/* Responsive Design for Pages */
@media (max-width: 768px) {
  .main-menu-page__card {
    min-width: 300px;
    padding: var(--space-8);
  }
  
  .game-page__location-info {
    bottom: var(--space-4);
    padding: var(--space-4);
    width: 95%;
  }
  
  .meeting-page__card,
  .battle-page__arena {
    padding: var(--space-4);
    margin: var(--space-4);
  }

  .mentor-card {
    padding: var(--space-4);
  }

  .mentor-card__header {
    flex-direction: column;
    text-align: center;
  }

  .mentor-card__avatar {
    align-self: center;
  }
}

/* ================================
   MENTOR SELECTION SCREEN STYLES
   ================================ */

.mentor-selection {
  min-height: 100vh;
  background: linear-gradient(135deg, 
    var(--color-neutral-900) 0%, 
    var(--color-neutral-800) 25%, 
    var(--color-primary-900) 75%, 
    var(--color-neutral-900) 100%);
}

.mentor-selection__header {
  text-align: center;
  margin-bottom: var(--space-8);
}

.mentor-selection__title {
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  margin-bottom: var(--space-4);
  background: linear-gradient(135deg, var(--color-primary-400) 0%, var(--color-purple-400) 100%);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}

.mentor-selection__subtitle {
  font-size: var(--text-xl);
  color: var(--color-neutral-300);
  margin-bottom: var(--space-2);
}

.mentor-selection__description {
  color: var(--color-neutral-400);
}

.mentor-selection__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: var(--space-6);
  margin-bottom: var(--space-8);
}

.mentor-selection__confirmation {
  position: fixed;
  bottom: var(--space-8);
  left: 50%;
  transform: translateX(-50%);
  background: var(--color-neutral-800);
  border: 1px solid var(--color-neutral-600);
  border-radius: var(--radius-lg);
  padding: var(--space-4) var(--space-6);
  box-shadow: var(--shadow-xl);
  z-index: 50;
}

.mentor-selection__confirmation-content {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.mentor-selection__confirmation-info {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.mentor-selection__confirmation-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-purple-500) 100%);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-white);
  font-weight: var(--font-bold);
  font-size: var(--text-sm);
}

.mentor-selection__confirmation-details h4 {
  font-weight: var(--font-semibold);
  color: var(--color-white);
  margin: 0;
}

.mentor-selection__confirmation-details p {
  font-size: var(--text-sm);
  color: var(--color-neutral-400);
  margin: 0;
}

@media (max-width: 768px) {
  .mentor-selection__grid {
    grid-template-columns: 1fr;
    gap: var(--space-4);
  }
  
  .mentor-selection__confirmation {
    bottom: var(--space-4);
    left: var(--space-4);
    right: var(--space-4);
    transform: none;
  }
  
  .mentor-selection__confirmation-content {
    flex-direction: column;
    text-align: center;
  }
}
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/styles/design-system/game-components.css
```css
/* System Design Tycoon - Game-Specific Components v2.0 */

/* Character Portrait Component */
.character-portrait {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  position: relative;
  transition: transform var(--duration-normal) var(--ease-out);
}

.character-portrait__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.character-portrait__glow {
  position: absolute;
  inset: -3px;
  background: linear-gradient(45deg, var(--color-primary-500), var(--color-premium-500));
  border-radius: 50%;
  z-index: -1;
  opacity: 0;
  transition: opacity var(--duration-normal) var(--ease-out);
}

.character-portrait--available .character-portrait__glow {
  opacity: 1;
  animation: pulse-glow 2s ease-in-out infinite;
}

.character-portrait__badge {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 28px;
  height: 28px;
  background: var(--color-secondary-500);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-xs);
  font-weight: var(--font-bold);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

@keyframes pulse-glow {
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.05); opacity: 1; }
}

/* Question Selection Card */
.question-card {
  background: var(--color-white);
  border: 2px solid var(--color-neutral-200);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  position: relative;
  cursor: pointer;
  transition: all var(--duration-normal) var(--ease-out);
}

.question-card__category-indicator {
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  border-radius: var(--radius-lg) 0 0 var(--radius-lg);
}

.question-card--product .question-card__category-indicator {
  background: var(--color-primary-500);
}

.question-card--business .question-card__category-indicator {
  background: var(--color-secondary-500);
}

.question-card--marketing .question-card__category-indicator {
  background: var(--color-warning-500);
}

.question-card--technical .question-card__category-indicator {
  background: var(--color-premium-500);
}

.question-card__impact-icons {
  position: absolute;
  top: var(--space-3);
  right: var(--space-3);
  display: flex;
  gap: var(--space-1);
}

.question-card__impact-icon {
  width: 20px;
  height: 20px;
  border-radius: var(--radius-sm);
  background: var(--color-neutral-100);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

.question-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: var(--color-primary-300);
}

.question-card--selected {
  background: var(--color-primary-50);
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

.question-card--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.question-card--disabled:hover {
  transform: none;
  box-shadow: none;
  border-color: var(--color-neutral-200);
}

/* Mentor Card Component */
.mentor-card {
  background: var(--color-white);
  border: 2px solid var(--color-neutral-200);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  position: relative;
  cursor: pointer;
  transition: all var(--duration-normal) var(--ease-out);
  overflow: hidden;
}

.mentor-card__header {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  margin-bottom: var(--space-4);
}

.mentor-card__avatar {
  width: 64px;
  height: 64px;
  border-radius: var(--radius-lg);
  object-fit: cover;
}

.mentor-card__specialization {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-top: var(--space-3);
}

.mentor-card__specialization-tag {
  padding: var(--space-1) var(--space-2);
  background: var(--color-primary-100);
  color: var(--color-primary-700);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
}

.mentor-card__advice-preview {
  margin-top: var(--space-4);
  padding: var(--space-3);
  background: var(--color-neutral-50);
  border-radius: var(--radius-md);
  font-style: italic;
  font-size: var(--text-small);
  color: var(--color-neutral-600);
}

.mentor-card--recommended {
  border-color: var(--color-secondary-400);
}

.mentor-card--recommended::before {
  content: "Recommended";
  position: absolute;
  top: var(--space-2);
  right: var(--space-2);
  padding: var(--space-1) var(--space-3);
  background: var(--color-secondary-500);
  color: white;
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-bold);
}

.mentor-card--locked {
  opacity: 0.6;
  cursor: not-allowed;
}

.mentor-card--locked::after {
  content: "";
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.mentor-card:hover:not(.mentor-card--locked) {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-color: var(--color-primary-400);
}

.mentor-card--selected {
  border-color: var(--color-primary-500);
  background: var(--color-primary-50);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
}

/* Career Map Node */
.career-node {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  position: relative;
  cursor: pointer;
  transition: all var(--duration-normal) var(--ease-out);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.career-node__icon {
  font-size: 32px;
  margin-bottom: var(--space-1);
}

.career-node__title {
  position: absolute;
  bottom: -30px;
  left: 50%;
  transform: translateX(-50%);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  white-space: nowrap;
  text-align: center;
}

.career-node--locked {
  background: var(--color-neutral-300);
  color: var(--color-neutral-500);
  cursor: not-allowed;
}

.career-node--available {
  background: linear-gradient(135deg, var(--color-primary-400), var(--color-primary-600));
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
  animation: pulse-available 2s ease-in-out infinite;
}

.career-node--completed {
  background: linear-gradient(135deg, var(--color-secondary-400), var(--color-secondary-600));
  color: white;
}

.career-node--completed .career-node__score {
  position: absolute;
  top: -8px;
  right: -8px;
  background: var(--color-warning-500);
  color: white;
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-bold);
}

@keyframes pulse-available {
  0%, 100% { transform: scale(1); box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4); }
  50% { transform: scale(1.05); box-shadow: 0 6px 20px rgba(59, 130, 246, 0.6); }
}

/* Meeting Room Dialogue Box */
.dialogue-box {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.dialogue-box__speaker {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
}

.dialogue-box__speaker-avatar {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-full);
  object-fit: cover;
}

.dialogue-box__speaker-name {
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--color-neutral-900);
}

.dialogue-box__speaker-role {
  font-size: var(--text-sm);
  color: var(--color-neutral-600);
}

.dialogue-box__text {
  font-size: var(--meeting-dialogue-text);
  color: var(--color-neutral-800);
  line-height: var(--leading-relaxed);
}

/* Requirements Tracker */
.requirements-tracker {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid var(--color-neutral-200);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  max-height: 400px;
  overflow-y: auto;
}

.requirements-tracker__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-3);
}

.requirements-tracker__title {
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--color-neutral-900);
}

.requirements-tracker__count {
  font-size: var(--text-sm);
  color: var(--color-neutral-600);
}

.requirements-tracker__item {
  display: flex;
  align-items: start;
  gap: var(--space-2);
  padding: var(--space-2) 0;
  border-bottom: 1px solid var(--color-neutral-100);
}

.requirements-tracker__item:last-child {
  border-bottom: none;
}

.requirements-tracker__item-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  margin-top: 2px;
  color: var(--color-primary-500);
}

.requirements-tracker__item-text {
  font-size: var(--text-sm);
  color: var(--color-neutral-700);
  line-height: var(--leading-normal);
}

.requirements-tracker__item--new {
  animation: slideInUp 0.3s ease-out;
  background: var(--color-primary-50);
  margin: 0 calc(var(--space-2) * -1);
  padding-left: var(--space-2);
  padding-right: var(--space-2);
  border-radius: var(--radius-md);
}

/* Timer Component */
.game-timer {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  background: var(--color-neutral-900);
  color: white;
  border-radius: var(--radius-full);
  font-size: var(--meeting-timer-text);
  font-weight: var(--font-bold);
  font-variant-numeric: tabular-nums;
}

.game-timer__icon {
  width: 24px;
  height: 24px;
  animation: pulse 2s ease-in-out infinite;
}

.game-timer--warning {
  background: var(--color-warning-600);
  animation: pulse-warning 1s ease-in-out infinite;
}

.game-timer--critical {
  background: var(--color-error-600);
  animation: shake 0.5s ease-in-out infinite;
}

@keyframes pulse-warning {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

/* Chat Notification */
.chat-notification {
  position: fixed;
  bottom: var(--space-4);
  right: var(--space-4);
  max-width: 360px;
  background: white;
  border: 1px solid var(--color-neutral-200);
  border-radius: var(--radius-xl);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  animation: slideInRight 0.3s var(--ease-bounce);
  z-index: var(--z-notification);
}

.chat-notification__header {
  padding: var(--space-3) var(--space-4);
  background: var(--color-primary-50);
  border-bottom: 1px solid var(--color-primary-100);
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.chat-notification__avatar {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-full);
}

.chat-notification__sender {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--color-neutral-900);
}

.chat-notification__body {
  padding: var(--space-4);
}

.chat-notification__message {
  font-size: var(--text-base);
  color: var(--color-neutral-700);
  line-height: var(--leading-normal);
}

.chat-notification__actions {
  padding: var(--space-3) var(--space-4);
  background: var(--color-neutral-50);
  border-top: 1px solid var(--color-neutral-100);
  display: flex;
  gap: var(--space-2);
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/styles/design-system/index.css
```css
/* System Design Tycoon - Design System v2.0 */
/* Main entry point for all design system styles */

/* Import design tokens (CSS custom properties) */
@import './tokens.css';

/* Import base component styles */
@import './components.css';

/* Import game-specific component styles */
@import './game-components.css';

/* Import React Flow component styles */
@import './react-flow-components.css';

/* Import additional UI component styles */
@import './ui-components.css';

/* Import landing page styles */
@import './landing-page.css';

/* Import authentication pages styles */
@import './auth-pages.css';

/* Import career map screen styles */
@import './career-map.css';

/* Global Reset and Base Styles */
*, *::before, *::after {
  box-sizing: border-box;
}

html {
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  margin: 0;
  padding: 0;
  font-family: var(--font-sans);
  font-size: var(--text-body);
  line-height: var(--leading-normal);
  color: var(--color-neutral-900);
  background: var(--color-neutral-50);
}

/* Typography Base */
h1, h2, h3, h4, h5, h6 {
  margin: 0;
  font-weight: var(--font-semibold);
  line-height: var(--leading-tight);
}

h1 { font-size: var(--text-h1); }
h2 { font-size: var(--text-h2); }
h3 { font-size: var(--text-h3); }
h4 { font-size: var(--text-h4); }
h5 { font-size: var(--text-h5); }
h6 { font-size: var(--text-h6); }

p {
  margin: 0;
  line-height: var(--leading-normal);
}

a {
  color: var(--color-primary-600);
  text-decoration: none;
  transition: color var(--duration-fast) var(--ease-out);
}

a:hover {
  color: var(--color-primary-700);
  text-decoration: underline;
}

/* Form Reset */
input, textarea, select, button {
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
}

button {
  cursor: pointer;
  border: none;
  background: none;
  padding: 0;
}

/* Focus Styles */
:focus-visible {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
}

/* Selection */
::selection {
  background: var(--color-primary-200);
  color: var(--color-primary-900);
}

/* Scrollbar Styling */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--color-neutral-100);
}

::-webkit-scrollbar-thumb {
  background: var(--color-neutral-400);
  border-radius: var(--radius-full);
}

::-webkit-scrollbar-thumb:hover {
  background: var(--color-neutral-500);
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Print Styles */
@media print {
  .no-print {
    display: none !important;
  }
  
  body {
    background: white;
    color: black;
  }
}

/* Responsive Typography */
@media (max-width: 768px) {
  html {
    font-size: 14px;
  }
}

/* High Contrast Mode Support */
@media (prefers-contrast: high) {
  :root {
    --color-primary-500: #0066CC;
    --color-secondary-500: #008800;
    --color-error-500: #CC0000;
    --color-warning-500: #CC6600;
  }
}

/* Dark Mode Support (Future Enhancement) */
@media (prefers-color-scheme: dark) {
  /* Dark mode tokens will be applied when implemented */
}

/* Utility Classes */
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.text-center { text-align: center; }
.text-left { text-align: left; }
.text-right { text-align: right; }

.font-normal { font-weight: var(--font-normal); }
.font-medium { font-weight: var(--font-medium); }
.font-semibold { font-weight: var(--font-semibold); }
.font-bold { font-weight: var(--font-bold); }

.uppercase { text-transform: uppercase; }
.lowercase { text-transform: lowercase; }
.capitalize { text-transform: capitalize; }

/* Spacing Utilities */
.m-0 { margin: 0; }
.p-0 { padding: 0; }

.mt-1 { margin-top: var(--space-1); }
.mt-2 { margin-top: var(--space-2); }
.mt-3 { margin-top: var(--space-3); }
.mt-4 { margin-top: var(--space-4); }

.mb-1 { margin-bottom: var(--space-1); }
.mb-2 { margin-bottom: var(--space-2); }
.mb-3 { margin-bottom: var(--space-3); }
.mb-4 { margin-bottom: var(--space-4); }

.ml-1 { margin-left: var(--space-1); }
.ml-2 { margin-left: var(--space-2); }
.ml-3 { margin-left: var(--space-3); }
.ml-4 { margin-left: var(--space-4); }

.mr-1 { margin-right: var(--space-1); }
.mr-2 { margin-right: var(--space-2); }
.mr-3 { margin-right: var(--space-3); }
.mr-4 { margin-right: var(--space-4); }

/* Display Utilities */
.block { display: block; }
.inline-block { display: inline-block; }
.inline { display: inline; }
.flex { display: flex; }
.inline-flex { display: inline-flex; }
.grid { display: grid; }
.hidden { display: none; }

/* Flexbox Utilities */
.flex-row { flex-direction: row; }
.flex-col { flex-direction: column; }
.flex-wrap { flex-wrap: wrap; }
.flex-nowrap { flex-wrap: nowrap; }
.items-start { align-items: flex-start; }
.items-center { align-items: center; }
.items-end { align-items: flex-end; }
.justify-start { justify-content: flex-start; }
.justify-center { justify-content: center; }
.justify-end { justify-content: flex-end; }
.justify-between { justify-content: space-between; }
.justify-around { justify-content: space-around; }
.flex-1 { flex: 1; }
.flex-auto { flex: auto; }
.flex-none { flex: none; }

/* Gap Utilities */
.gap-1 { gap: var(--space-1); }
.gap-2 { gap: var(--space-2); }
.gap-3 { gap: var(--space-3); }
.gap-4 { gap: var(--space-4); }

/* Border Radius Utilities */
.rounded-none { border-radius: var(--radius-none); }
.rounded-sm { border-radius: var(--radius-sm); }
.rounded { border-radius: var(--radius-md); }
.rounded-lg { border-radius: var(--radius-lg); }
.rounded-xl { border-radius: var(--radius-xl); }
.rounded-full { border-radius: var(--radius-full); }

/* Shadow Utilities */
.shadow-sm { box-shadow: var(--shadow-sm); }
.shadow { box-shadow: var(--shadow-md); }
.shadow-lg { box-shadow: var(--shadow-lg); }
.shadow-xl { box-shadow: var(--shadow-xl); }
.shadow-2xl { box-shadow: var(--shadow-2xl); }
.shadow-none { box-shadow: var(--shadow-none); }

/* Overflow Utilities */
.overflow-auto { overflow: auto; }
.overflow-hidden { overflow: hidden; }
.overflow-visible { overflow: visible; }
.overflow-scroll { overflow: scroll; }
.overflow-x-auto { overflow-x: auto; }
.overflow-y-auto { overflow-y: auto; }

/* Position Utilities */
.static { position: static; }
.fixed { position: fixed; }
.absolute { position: absolute; }
.relative { position: relative; }
.sticky { position: sticky; }

/* Z-Index Utilities */
.z-0 { z-index: var(--z-0); }
.z-10 { z-index: var(--z-10); }
.z-20 { z-index: var(--z-20); }
.z-30 { z-index: var(--z-30); }
.z-40 { z-index: var(--z-40); }
.z-50 { z-index: var(--z-50); }

/* Cursor Utilities */
.cursor-auto { cursor: auto; }
.cursor-pointer { cursor: pointer; }
.cursor-wait { cursor: wait; }
.cursor-not-allowed { cursor: not-allowed; }
.cursor-grab { cursor: grab; }
.cursor-grabbing { cursor: grabbing; }

/* User Select Utilities */
.select-none { user-select: none; }
.select-text { user-select: text; }
.select-all { user-select: all; }

/* Opacity Utilities */
.opacity-0 { opacity: 0; }
.opacity-25 { opacity: 0.25; }
.opacity-50 { opacity: 0.5; }
.opacity-75 { opacity: 0.75; }
.opacity-100 { opacity: 1; }

/* Animation Utilities */
.animate-spin { animation: spin 1s linear infinite; }
.animate-pulse { animation: pulse 2s ease-in-out infinite; }
.animate-bounce { animation: bounce 1s infinite; }
.animate-fade-in { animation: fadeIn 0.3s ease-out; }
.animate-slide-up { animation: slideInUp 0.3s ease-out; }

@keyframes bounce {
  0%, 100% {
    transform: translateY(-25%);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: translateY(0);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
}
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/styles/design-system/landing-page.css
```css
/* Landing Page Styles - Following Design System */

/* Base Landing Page Container */
.landing-page {
  min-height: 100vh;
  background: linear-gradient(135deg, 
    var(--color-neutral-900) 0%, 
    var(--color-primary-900) 50%, 
    var(--color-premium-900) 100%
  );
  position: relative;
  overflow-x: hidden;
}

/* Navigation */
.landing-page__nav {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  padding: var(--space-6);
}

.landing-page__nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.landing-page__logo {
  font-size: var(--text-h2);
  font-weight: var(--font-bold);
  color: var(--color-white);
  text-decoration: none;
}

.landing-page__nav-actions {
  display: flex;
  gap: var(--space-4);
}

.landing-page__nav-button {
  color: var(--color-white) !important;
  border-color: transparent !important;
}

.landing-page__nav-button:hover {
  color: var(--color-neutral-300) !important;
  background: rgba(255, 255, 255, 0.1) !important;
}

/* Hero Section */
.landing-page__hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-6);
  padding-top: 120px;
}

.landing-page__hero-container {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.landing-page__hero-content {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.landing-page__hero-title {
  font-size: clamp(3rem, 6vw, 5rem);
  font-weight: var(--font-bold);
  color: var(--color-white);
  margin-bottom: var(--space-6);
  line-height: 1.1;
  animation: fade-in-up 1s var(--ease-out);
}

.landing-page__hero-subtitle {
  font-size: var(--text-h3);
  color: var(--color-neutral-300);
  margin-bottom: var(--space-8);
  animation: fade-in-up 1s var(--ease-out) 0.3s both;
}

.landing-page__hero-description {
  font-size: var(--text-large);
  color: var(--color-neutral-400);
  margin-bottom: var(--space-12);
  max-width: 600px;
  line-height: 1.6;
  animation: fade-in-up 1s var(--ease-out) 0.6s both;
}

.landing-page__hero-cta {
  background: linear-gradient(135deg, var(--color-primary-600), var(--color-premium-600)) !important;
  border: none !important;
  padding: var(--space-4) var(--space-8) !important;
  font-size: var(--text-large) !important;
  font-weight: var(--font-semibold) !important;
  transition: all var(--duration-normal) var(--ease-out) !important;
  animation: fade-in-up 1s var(--ease-out) 0.9s both;
}

.landing-page__hero-cta:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

/* Hero Comparison Container */
.landing-page__comparison-container {
  position: relative;
  width: 100vw;
  margin-left: calc(50% - 50vw);
  aspect-ratio: 21/9;
  margin-top: var(--space-8);
  margin-bottom: var(--space-8);
  overflow: hidden;
  cursor: ew-resize;
  animation: fade-in-up 1s var(--ease-out) 0.6s both;
}

/* World Layers */
.landing-page__world-layer {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.landing-page__world-layer--data {
  z-index: 2;
}

.landing-page__world-content {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* World Header */
.landing-page__world-header {
  position: absolute;
  top: var(--space-8);
  left: var(--space-8);
  z-index: 10;
}

.landing-page__world-title {
  font-size: var(--text-h2);
  font-weight: var(--font-bold);
  margin-bottom: var(--space-1);
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.landing-page__world-layer--problem .landing-page__world-title {
  color: var(--color-white);
}

.landing-page__world-layer--data .landing-page__world-title {
  color: var(--color-white);
}

.landing-page__world-subtitle {
  font-size: var(--text-large);
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
}

/* World Scenes */
.landing-page__world-scene {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.landing-page__world-scene--green {
  background: linear-gradient(to bottom, #87CEEB 0%, #98D98E 60%, #228B22 100%);
}

.landing-page__world-scene--blue {
  background: linear-gradient(to bottom, #1a1a2e 0%, #0f3460 50%, #16213e 100%);
}

/* Scene Assets */
.landing-page__scene-asset {
  position: absolute;
  height: auto;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
}

/* Hero Hand Asset */
.landing-page__hero-hand {
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  width: 300px;
  height: auto;
  filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.3));
}

/* Chat Bubble */
.landing-page__chat-bubble {
  position: absolute;
  left: 50%;
  top: 25%;
  transform: translateX(-50%);
  max-width: 400px;
  animation: float 3s ease-in-out infinite;
}

.landing-page__chat-bubble-content {
  background: rgba(255, 255, 255, 0.98);
  color: var(--color-neutral-800);
  padding: var(--space-6);
  border-radius: var(--radius-xl);
  font-size: var(--text-large);
  font-weight: var(--font-medium);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  position: relative;
  text-align: center;
  line-height: 1.6;
}

.landing-page__chat-bubble-tail {
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 20px solid transparent;
  border-right: 20px solid transparent;
  border-top: 20px solid rgba(255, 255, 255, 0.98);
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
}

/* React Flow Container in Slider */
.landing-page__react-flow-container {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.landing-page__hero-flow {
  width: 100%;
  height: 100%;
  background: transparent;
}

.landing-page__hero-flow .react-flow__renderer {
  width: 100%;
  height: 100%;
}

.landing-page__hero-flow .react-flow__background {
  background: transparent;
}

.landing-page__hero-flow .react-flow__minimap,
.landing-page__hero-flow .react-flow__controls {
  display: none;
}

/* React Flow Edge Styles */
.landing-page__hero-flow .react-flow__edge-path {
  stroke: var(--color-primary-400);
  stroke-width: 2;
}

.landing-page__hero-flow .react-flow__edge--high-traffic .react-flow__edge-path {
  stroke: var(--color-primary-300);
  stroke-width: 3;
}

.landing-page__hero-flow .react-flow__edge--medium-traffic .react-flow__edge-path {
  stroke: var(--color-primary-400);
  stroke-width: 2;
}

.landing-page__hero-flow .react-flow__edge--low-traffic .react-flow__edge-path {
  stroke: var(--color-primary-500);
  stroke-width: 1.5;
  opacity: 0.7;
}

/* Animated edges */
.landing-page__hero-flow .react-flow__edge.animated .react-flow__edge-path {
  stroke-dasharray: 5;
  animation: dashdraw 0.5s linear infinite;
}

@keyframes dashdraw {
  to {
    stroke-dashoffset: -10;
  }
}

/* Requirements Node Styles */
.react-flow__node-requirements {
  background: rgba(255, 255, 255, 0.95);
  border: 2px solid var(--color-primary-400);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  min-width: 200px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.react-flow__node-requirements__header {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-3);
  padding-bottom: var(--space-3);
  border-bottom: 1px solid var(--color-neutral-200);
}

.react-flow__node-requirements__icon {
  font-size: var(--text-h4);
}

.react-flow__node-requirements__title {
  font-size: var(--text-h4);
  font-weight: var(--font-semibold);
  color: var(--color-neutral-800);
}

.react-flow__node-requirements__body {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.react-flow__node-requirements__item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--color-neutral-700);
  font-size: var(--text-base);
}

.react-flow__node-requirements__check {
  color: var(--color-secondary-500);
  flex-shrink: 0;
}

/* Slider Handle */
.landing-page__slider-handle {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 48px;
  transform: translateX(-50%);
  transition: opacity 0.2s;
  z-index: 10;
}

.landing-page__slider-track {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 4px;
  background: rgba(255, 255, 255, 0.3);
  transform: translateX(-50%);
}

.landing-page__slider-button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s;
  color: var(--color-neutral-800);
}

.landing-page__comparison-container:hover .landing-page__slider-button {
  transform: translate(-50%, -50%) scale(1.1);
}

.landing-page__comparison-container:active .landing-page__slider-button {
  transform: translate(-50%, -50%) scale(0.95);
}

/* World Labels */
.landing-page__world-labels {
  position: absolute;
  bottom: var(--space-4);
  left: var(--space-8);
  right: var(--space-8);
  display: flex;
  justify-content: space-between;
  pointer-events: none;
  z-index: 10;
}

.landing-page__world-label {
  background: rgba(0, 0, 0, 0.6);
  color: var(--color-white);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-md);
  font-size: var(--text-small);
  font-weight: var(--font-medium);
  backdrop-filter: blur(8px);
}

/* Hero Actions */
.landing-page__hero-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
  margin-top: var(--space-8);
}

.landing-page__hero-hint {
  color: var(--color-neutral-500);
  font-size: var(--text-small);
  animation: fade-in-up 1s var(--ease-out) 1.2s both;
}

/* Animations */
@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes dash {
  to {
    stroke-dashoffset: -10;
  }
}

@keyframes slide-right {
  0%, 100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(10px);
  }
}

/* Demo Section */
.landing-page__demo-section {
  background: linear-gradient(to bottom, var(--color-neutral-900), var(--color-neutral-800));
  padding: var(--space-20) var(--space-6);
  position: relative;
}

.landing-page__demo-section-container {
  max-width: 1200px;
  margin: 0 auto;
}

.landing-page__demo-section-title {
  font-size: var(--text-h2);
  font-weight: var(--font-bold);
  color: var(--color-white);
  text-align: center;
  margin-bottom: var(--space-4);
}

.landing-page__demo-section-subtitle {
  font-size: var(--text-large);
  color: var(--color-neutral-400);
  text-align: center;
  margin-bottom: var(--space-12);
}

.landing-page__demo-flow-container {
  height: 500px;
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-xl);
  overflow: hidden;
  backdrop-filter: blur(10px);
  position: relative;
}

.landing-page__demo-flow-container::before {
  content: '';
  position: absolute;
  inset: -2px;
  background: linear-gradient(45deg, var(--color-primary-500), var(--color-premium-500));
  border-radius: var(--radius-xl);
  z-index: -1;
  opacity: 0.3;
  filter: blur(10px);
}

.landing-page__demo-flow {
  width: 100%;
  height: 100%;
  background: transparent;
}

/* Features Section */
.landing-page__features {
  background: var(--color-neutral-900);
  padding: var(--space-20) var(--space-6);
}

.landing-page__features-container {
  max-width: 1200px;
  margin: 0 auto;
}

.landing-page__features-title {
  font-size: var(--text-h2);
  font-weight: var(--font-bold);
  color: var(--color-white);
  text-align: center;
  margin-bottom: var(--space-12);
}

.landing-page__features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-8);
}

.landing-page__feature-card {
  background: var(--color-neutral-800) !important;
  border: 1px solid var(--color-neutral-700) !important;
  transition: all var(--duration-normal) var(--ease-out) !important;
}

.landing-page__feature-card:hover {
  border-color: var(--color-primary-500) !important;
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.landing-page__feature-icon {
  font-size: 3rem;
  margin-bottom: var(--space-4);
  display: block;
}

.landing-page__feature-title {
  font-size: var(--text-h4);
  font-weight: var(--font-semibold);
  color: var(--color-white);
  margin-bottom: var(--space-2);
}

.landing-page__feature-description {
  color: var(--color-neutral-400);
  font-size: var(--text-base);
  line-height: 1.6;
}

/* Social Proof Section */
.landing-page__social-proof {
  background: var(--color-neutral-800);
  padding: var(--space-16) var(--space-6);
}

.landing-page__social-proof-container {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.landing-page__stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-8);
}

.landing-page__stat {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.landing-page__stat-value {
  font-size: var(--text-h1);
  font-weight: var(--font-bold);
  line-height: 1;
}

.landing-page__stat-value--primary {
  color: var(--color-primary-400);
}

.landing-page__stat-value--secondary {
  color: var(--color-secondary-400);
}

.landing-page__stat-value--premium {
  color: var(--color-premium-400);
}

.landing-page__stat-label {
  color: var(--color-neutral-400);
  font-size: var(--text-base);
  font-weight: var(--font-medium);
}

/* Animations */
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive Design */
@media (max-width: 1023px) {
  .landing-page__comparison-container {
    aspect-ratio: 16/9;
  }
  
  .landing-page__problem-bubbles {
    grid-template-columns: 1fr;
    max-width: 300px;
  }
  
  .landing-page__demo-flow-container {
    height: 400px;
  }
  
  .landing-page__hero-title {
    font-size: clamp(2.5rem, 8vw, 4rem);
  }
  
  .landing-page__features-grid {
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: var(--space-6);
  }
  
  .landing-page__stats-grid {
    gap: var(--space-6);
  }
}

@media (max-width: 767px) {
  .landing-page__hero {
    padding-top: 100px;
  }
  
  .landing-page__nav-container {
    flex-direction: column;
    gap: var(--space-4);
  }
  
  .landing-page__hero-container {
    gap: var(--space-6);
  }
  
  .landing-page__comparison-container {
    aspect-ratio: 16/10;
  }
  
  .landing-page__world-header {
    top: var(--space-4);
    left: var(--space-4);
  }
  
  .landing-page__world-title {
    font-size: var(--text-h3);
  }
  
  .landing-page__world-subtitle {
    font-size: var(--text-base);
  }
  
  .landing-page__hero-hand {
    width: 200px;
  }
  
  .landing-page__chat-bubble {
    max-width: 300px;
    top: 20%;
  }
  
  .landing-page__chat-bubble-content {
    padding: var(--space-4);
    font-size: var(--text-base);
  }
  
  .landing-page__demo-flow-container {
    height: 300px;
  }
  
  .landing-page__features-grid {
    grid-template-columns: 1fr;
  }
  
  .landing-page__stats-grid {
    grid-template-columns: 1fr;
    gap: var(--space-4);
  }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  .landing-page__hero-title,
  .landing-page__hero-subtitle,
  .landing-page__hero-description,
  .landing-page__hero-cta,
  .landing-page__hero-demo {
    animation: none;
  }
  
  .landing-page__hero-cta:hover {
    transform: none;
  }
  
  .landing-page__feature-card:hover {
    transform: none;
  }
} 
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/styles/design-system/react-flow-components.css
```css
/* System Design Tycoon - React Flow Components v2.0 */

/* Base Node Styling */
.react-flow__node-component {
  background: var(--color-white);
  border: 2px solid var(--color-neutral-200);
  border-radius: var(--radius-lg);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all var(--duration-normal) var(--ease-out);
  min-width: var(--node-standard-width);
  min-height: var(--node-standard-height);
}

.react-flow__node-component__header {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--color-neutral-100);
}

.react-flow__node-component__icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  background: var(--color-primary-100);
  color: var(--color-primary-700);
}

.react-flow__node-component__title {
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--color-neutral-900);
}

.react-flow__node-component__body {
  padding: var(--space-3) var(--space-4);
}

.react-flow__node-component__metrics {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-2);
}

.react-flow__node-component__metric {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.react-flow__node-component__metric-label {
  font-size: var(--text-xs);
  color: var(--color-neutral-500);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.react-flow__node-component__metric-value {
  font-size: var(--text-base);
  font-weight: var(--font-bold);
  color: var(--color-neutral-900);
}

/* Load-based Border Styling */
.react-flow__node-component--load-low {
  border-color: var(--load-0-25);
  border-left-width: 4px;
}

.react-flow__node-component--load-medium {
  border-color: var(--load-50-75);
  border-left-width: 4px;
}

.react-flow__node-component--load-high {
  border-color: var(--load-75-90);
  border-left-width: 4px;
  animation: pulse-warning 2s ease-in-out infinite;
}

.react-flow__node-component--load-critical {
  border-color: var(--load-95-100);
  border-left-width: 4px;
  animation: shake-error 0.5s ease-in-out infinite;
}

/* Selection State */
.react-flow__node-component.selected {
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

/* Drag State */
.react-flow__node-component.dragging {
  cursor: grabbing;
  transform: rotate(2deg);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
}

/* Component Category Variants */
.react-flow__node-component--compute .react-flow__node-component__icon {
  background: var(--color-primary-100);
  color: var(--color-primary-700);
}

.react-flow__node-component--storage .react-flow__node-component__icon {
  background: var(--color-secondary-100);
  color: var(--color-secondary-700);
}

.react-flow__node-component--networking .react-flow__node-component__icon {
  background: var(--color-info-100);
  color: var(--color-info-700);
}

.react-flow__node-component--security .react-flow__node-component__icon {
  background: var(--color-premium-100);
  color: var(--color-premium-700);
}

.react-flow__node-component--operations .react-flow__node-component__icon {
  background: var(--color-warning-100);
  color: var(--color-warning-700);
}

/* React Flow Handle Styling */
.react-flow__handle {
  width: var(--handle-size);
  height: var(--handle-size);
  background: var(--color-neutral-400);
  border: var(--handle-border-width) solid var(--color-white);
  border-radius: 50%;
  transition: all var(--duration-fast) var(--ease-out);
}

/* Handle Types */
.react-flow__handle-source {
  background: var(--color-primary-500);
}

.react-flow__handle-target {
  background: var(--color-secondary-500);
}

/* Handle States */
.react-flow__handle:hover {
  transform: scale(var(--handle-hover-scale));
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2);
}

.react-flow__handle.connecting {
  background: var(--color-warning-500);
  animation: pulse-connect 1s ease-in-out infinite;
}

.react-flow__handle.valid {
  background: var(--color-secondary-500);
  box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.3);
}

.react-flow__handle.invalid {
  background: var(--color-error-500);
  box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.3);
}

/* Multiple Handle Positioning */
.react-flow__handle--primary {
  /* Default centered position */
}

.react-flow__handle--secondary {
  top: 30%;
}

.react-flow__handle--tertiary {
  top: 70%;
}

@keyframes pulse-connect {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

/* React Flow Edge Styling */
.react-flow__edge-path {
  stroke: var(--color-primary-400);
  stroke-width: var(--edge-stroke-width-normal);
  fill: none;
  transition: stroke var(--duration-fast) var(--ease-out);
}

/* Traffic-based Edge Styling */
.react-flow__edge--low-traffic {
  stroke-width: var(--edge-stroke-width-normal);
  stroke: var(--connection-excellent);
}

.react-flow__edge--medium-traffic {
  stroke-width: var(--edge-stroke-width-heavy);
  stroke: var(--connection-good);
}

.react-flow__edge--high-traffic {
  stroke-width: var(--edge-stroke-width-critical);
  stroke: var(--connection-fair);
  stroke-dasharray: 5 5;
  animation: flow-animation 1s linear infinite;
}

.react-flow__edge--congested {
  stroke-width: var(--edge-stroke-width-critical);
  stroke: var(--connection-poor);
  animation: pulse-critical 0.5s ease-in-out infinite alternate;
}

/* Animated Flow Visualization */
.react-flow__edge--animated {
  stroke-dasharray: 5 5;
}

.react-flow__edge--animated path {
  animation: dash-flow 1s linear infinite;
}

@keyframes dash-flow {
  to {
    stroke-dashoffset: -10;
  }
}

@keyframes flow-animation {
  0% { stroke-dashoffset: 0; }
  100% { stroke-dashoffset: -20; }
}

/* Edge Labels */
.react-flow__edge-label {
  background: var(--color-white);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
  font-size: var(--text-xs);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Connection Line (Preview) */
.react-flow__connection {
  stroke: var(--design-connection-preview);
  stroke-width: 2;
  stroke-dasharray: 5 5;
  animation: dash-preview 1s linear infinite;
}

.react-flow__connection.valid {
  stroke: var(--color-secondary-400);
}

.react-flow__connection.invalid {
  stroke: var(--color-error-400);
}

@keyframes dash-preview {
  to {
    stroke-dashoffset: -10;
  }
}

/* Component Drawer */
.component-drawer {
  width: var(--canvas-sidebar-width);
  height: 100%;
  background: var(--color-neutral-50);
  border-right: 1px solid var(--color-neutral-200);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.component-drawer__header {
  padding: var(--space-4);
  background: var(--color-white);
  border-bottom: 1px solid var(--color-neutral-200);
}

.component-drawer__search {
  position: relative;
}

.component-drawer__search-input {
  width: 100%;
  padding: var(--space-2) var(--space-4) var(--space-2) var(--space-10);
  border: 1px solid var(--color-neutral-300);
  border-radius: var(--radius-full);
  font-size: var(--text-small);
  transition: all var(--duration-fast) var(--ease-out);
}

.component-drawer__search-icon {
  position: absolute;
  left: var(--space-3);
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-neutral-400);
}

.component-drawer__categories {
  flex: 1;
  overflow-y: auto;
  padding-bottom: var(--space-4);
}

/* Category Sections */
.component-category {
  border-bottom: 1px solid var(--color-neutral-200);
}

.component-category__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4);
  background: var(--color-white);
  cursor: pointer;
  transition: background var(--duration-fast) var(--ease-out);
}

.component-category__header:hover {
  background: var(--color-neutral-50);
}

.component-category__icon {
  width: 24px;
  height: 24px;
  margin-right: var(--space-3);
}

.component-category__title {
  flex: 1;
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--color-neutral-900);
}

.component-category__count {
  padding: var(--space-1) var(--space-2);
  background: var(--color-neutral-100);
  color: var(--color-neutral-600);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
}

.component-category__chevron {
  transition: transform var(--duration-fast) var(--ease-out);
}

.component-category--expanded .component-category__chevron {
  transform: rotate(180deg);
}

.component-category__items {
  padding: var(--space-2);
  display: grid;
  gap: var(--space-2);
  max-height: 0;
  overflow: hidden;
  transition: max-height var(--duration-normal) var(--ease-out);
}

.component-category--expanded .component-category__items {
  max-height: 600px;
}

/* Draggable Component Items */
.component-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  background: var(--color-white);
  border: 1px solid var(--color-neutral-200);
  border-radius: var(--radius-md);
  cursor: grab;
  transition: all var(--duration-fast) var(--ease-out);
  position: relative;
}

.component-item__icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  background: var(--color-primary-100);
  color: var(--color-primary-700);
  flex-shrink: 0;
}

.component-item__content {
  flex: 1;
  min-width: 0;
}

.component-item__name {
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  color: var(--color-neutral-900);
  margin-bottom: var(--space-1);
}

.component-item__cost {
  font-size: var(--text-xs);
  color: var(--color-neutral-600);
}

.component-item__badge {
  position: absolute;
  top: -4px;
  right: -4px;
  padding: 2px 6px;
  background: var(--color-primary-500);
  color: white;
  border-radius: var(--radius-full);
  font-size: 10px;
  font-weight: var(--font-bold);
  text-transform: uppercase;
}

.component-item:hover {
  background: var(--color-primary-50);
  border-color: var(--color-primary-300);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.component-item:active {
  cursor: grabbing;
  transform: scale(0.98);
}

.component-item--dragging {
  opacity: 0.5;
  cursor: grabbing;
}

.component-item--locked {
  opacity: 0.6;
  cursor: not-allowed;
  background: var(--color-neutral-100);
}

.component-item--locked:hover {
  transform: none;
  box-shadow: none;
  border-color: var(--color-neutral-200);
}

.component-item__lock-icon {
  position: absolute;
  right: var(--space-3);
  color: var(--color-neutral-400);
}

/* React Flow Controls */
.react-flow__controls {
  background: var(--color-white);
  border: 1px solid var(--color-neutral-200);
  border-radius: var(--radius-lg);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.react-flow__controls-button {
  width: 36px;
  height: 36px;
  background: var(--color-white);
  border: none;
  border-bottom: 1px solid var(--color-neutral-200);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--duration-fast) var(--ease-out);
}

.react-flow__controls-button:last-child {
  border-bottom: none;
}

.react-flow__controls-button:hover {
  background: var(--color-primary-50);
  color: var(--color-primary-700);
}

.react-flow__controls-button:active {
  transform: scale(0.95);
}

.react-flow__controls-button svg {
  width: 18px;
  height: 18px;
}

/* React Flow Background */
.react-flow__background {
  background-color: var(--design-canvas-bg);
}

.react-flow__background pattern .react-flow__background-path {
  stroke: var(--design-grid-line);
  stroke-width: 0.5;
}

/* Dots Pattern */
.react-flow__background-pattern--dots circle {
  fill: var(--design-grid-dot);
}

/* Lines Pattern */
.react-flow__background-pattern--lines path {
  stroke: var(--design-grid-line);
}

/* Cross Pattern */
.react-flow__background-pattern--cross path {
  stroke: var(--design-grid-line);
  stroke-width: 0.3;
}

/* MiniMap Customization */
.react-flow__minimap {
  background: var(--color-neutral-100);
  border: 1px solid var(--color-neutral-300);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.react-flow__minimap-mask {
  fill: var(--color-neutral-200);
  opacity: 0.3;
}

.react-flow__minimap-node {
  fill: var(--color-primary-400);
  stroke: var(--color-primary-600);
  stroke-width: 1;
}

.react-flow__minimap-node--compute {
  fill: var(--color-primary-400);
}

.react-flow__minimap-node--storage {
  fill: var(--color-secondary-400);
}

.react-flow__minimap-node--networking {
  fill: var(--color-info-400);
}

.react-flow__minimap-node--security {
  fill: var(--color-premium-400);
}

.react-flow__minimap-node--operations {
  fill: var(--color-warning-400);
}

/* Data Packet Animation */
.data-packet {
  position: absolute;
  width: 12px;
  height: 12px;
  background: var(--sim-packet-color);
  border-radius: 50%;
  box-shadow: 0 0 8px var(--sim-packet-glow);
  pointer-events: none;
  z-index: 5;
}

.data-packet--http {
  background: var(--color-primary-500);
  box-shadow: 0 0 8px rgba(59, 130, 246, 0.6);
}

.data-packet--database {
  background: var(--color-secondary-500);
  box-shadow: 0 0 8px rgba(34, 197, 94, 0.6);
}

.data-packet--cache {
  background: var(--color-warning-500);
  box-shadow: 0 0 8px rgba(249, 115, 22, 0.6);
}

.data-packet--error {
  background: var(--color-error-500);
  box-shadow: 0 0 8px rgba(239, 68, 68, 0.6);
  animation: pulse-error 0.3s ease-in-out infinite;
}

@keyframes pulse-error {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

/* Packet Trail Effect */
.data-packet::before {
  content: '';
  position: absolute;
  inset: -2px;
  background: inherit;
  border-radius: 50%;
  opacity: 0.3;
  animation: packet-trail 0.5s ease-out;
}

@keyframes packet-trail {
  0% { transform: scale(1); opacity: 0.5; }
  100% { transform: scale(2); opacity: 0; }
}
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/styles/design-system/tokens.css
```css
/* System Design Tycoon - Design Tokens v2.0 */
/* Auto-generated from design-system.md */

:root {
  /* Core Color Palette */
  --color-primary-50: #EFF6FF;
  --color-primary-100: #DBEAFE;
  --color-primary-200: #BFDBFE;
  --color-primary-300: #93C5FD;
  --color-primary-400: #60A5FA;
  --color-primary-500: #3B82F6;
  --color-primary-600: #2563EB;
  --color-primary-700: #1D4ED8;
  --color-primary-800: #1E40AF;
  --color-primary-900: #1E3A8A;

  --color-secondary-50: #F0FDF4;
  --color-secondary-100: #DCFCE7;
  --color-secondary-200: #BBF7D0;
  --color-secondary-300: #86EFAC;
  --color-secondary-400: #4ADE80;
  --color-secondary-500: #22C55E;
  --color-secondary-600: #16A34A;
  --color-secondary-700: #15803D;
  --color-secondary-800: #166534;
  --color-secondary-900: #14532D;

  --color-neutral-50: #F9FAFB;
  --color-neutral-100: #F3F4F6;
  --color-neutral-200: #E5E7EB;
  --color-neutral-300: #D1D5DB;
  --color-neutral-400: #9CA3AF;
  --color-neutral-500: #6B7280;
  --color-neutral-600: #4B5563;
  --color-neutral-700: #374151;
  --color-neutral-800: #1F2937;
  --color-neutral-900: #111827;

  /* Semantic Colors */
  --color-error-50: #FEF2F2;
  --color-error-100: #FEE2E2;
  --color-error-200: #FECACA;
  --color-error-300: #FCA5A5;
  --color-error-400: #F87171;
  --color-error-500: #EF4444;
  --color-error-600: #DC2626;
  --color-error-700: #B91C1C;
  --color-error-800: #991B1B;
  --color-error-900: #7F1D1D;

  --color-warning-50: #FFFBEB;
  --color-warning-100: #FEF3C7;
  --color-warning-200: #FDE68A;
  --color-warning-300: #FCD34D;
  --color-warning-400: #FBBF24;
  --color-warning-500: #F59E0B;
  --color-warning-600: #D97706;
  --color-warning-700: #B45309;
  --color-warning-800: #92400E;
  --color-warning-900: #78350F;

  --color-success-50: #F0FDF4;
  --color-success-100: #DCFCE7;
  --color-success-200: #BBF7D0;
  --color-success-300: #86EFAC;
  --color-success-400: #4ADE80;
  --color-success-500: #22C55E;
  --color-success-600: #16A34A;
  --color-success-700: #15803D;
  --color-success-800: #166534;
  --color-success-900: #14532D;

  --color-info-50: #F0F9FF;
  --color-info-100: #E0F2FE;
  --color-info-200: #BAE6FD;
  --color-info-300: #7DD3FC;
  --color-info-400: #38BDF8;
  --color-info-500: #0EA5E9;
  --color-info-600: #0284C7;
  --color-info-700: #0369A1;
  --color-info-800: #075985;
  --color-info-900: #0C4A6E;

  --color-premium-50: #FAF5FF;
  --color-premium-100: #F3E8FF;
  --color-premium-200: #E9D5FF;
  --color-premium-300: #D8B4FE;
  --color-premium-400: #C084FC;
  --color-premium-500: #A855F7;
  --color-premium-600: #9333EA;
  --color-premium-700: #7C3AED;
  --color-premium-800: #6B21A8;
  --color-premium-900: #581C87;

  --color-white: #FFFFFF;
  --color-black: #000000;

  /* Game Phase Color Schemes */
  --meeting-bg-gradient-start: #667EEA;
  --meeting-bg-gradient-end: #764BA2;
  --meeting-overlay: rgba(255, 255, 255, 0.1);
  --meeting-card-bg: rgba(255, 255, 255, 0.95);
  --meeting-card-border: rgba(255, 255, 255, 0.3);

  --design-canvas-bg: #F8FAFC;
  --design-grid-line: #E5E7EB;
  --design-grid-dot: #D1D5DB;
  --design-selection-stroke: #3B82F6;
  --design-connection-preview: rgba(59, 130, 246, 0.5);

  --sim-packet-color: #10B981;
  --sim-packet-glow: rgba(16, 185, 129, 0.6);
  --sim-flow-normal: #3B82F6;
  --sim-flow-congested: #F59E0B;
  --sim-flow-failing: #EF4444;

  --review-success-bg: #F0FDF4;
  --review-warning-bg: #FEF3C7;
  --review-failure-bg: #FEF2F2;
  --review-metric-positive: #10B981;
  --review-metric-negative: #EF4444;

  /* Load-based Color Progression */
  --load-0-25: #10B981;
  --load-25-50: #34D399;
  --load-50-75: #FCD34D;
  --load-75-90: #F59E0B;
  --load-90-95: #F97316;
  --load-95-100: #EF4444;
  --load-overload: #B91C1C;

  /* Connection Quality Colors */
  --connection-excellent: #10B981;
  --connection-good: #3B82F6;
  --connection-fair: #FCD34D;
  --connection-poor: #F59E0B;
  --connection-critical: #EF4444;
  --connection-broken: #6B7280;

  /* Typography Scale */
  --font-sans: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'Fira Code', 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Mono', monospace;

  --font-thin: 100;
  --font-extralight: 200;
  --font-light: 300;
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
  --font-extrabold: 800;
  --font-black: 900;

  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-large: 1.1875rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 1.875rem;
  --text-4xl: 2.25rem;
  --text-5xl: 3rem;
  --text-6xl: 3.75rem;

  --text-h1: var(--text-4xl);
  --text-h2: var(--text-3xl);
  --text-h3: var(--text-2xl);
  --text-h4: var(--text-xl);
  --text-h5: var(--text-lg);
  --text-h6: var(--text-base);
  --text-body: var(--text-base);
  --text-small: var(--text-sm);
  --text-caption: var(--text-xs);

  --leading-none: 1;
  --leading-tight: 1.25;
  --leading-snug: 1.375;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
  --leading-loose: 2;

  /* Context-Specific Typography */
  --meeting-dialogue-text: 1.125rem/1.75rem;
  --meeting-speaker-name: 0.875rem/1.25rem;
  --meeting-question-text: 1rem/1.5rem;
  --meeting-timer-text: 1.5rem/1.75rem;

  --canvas-component-label: 0.875rem/1.25rem;
  --canvas-metric-value: 1.25rem/1.5rem;
  --canvas-metric-unit: 0.75rem/1rem;
  --canvas-cost-display: 1rem/1.25rem;

  --achievement-title: 1.25rem/1.5rem;
  --achievement-description: 0.875rem/1.25rem;
  --achievement-progress: 0.75rem/1rem;

  /* Spacing Scale */
  --space-0: 0;
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-7: 1.75rem;
  --space-8: 2rem;
  --space-9: 2.25rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
  --space-14: 3.5rem;
  --space-16: 4rem;
  --space-20: 5rem;
  --space-24: 6rem;
  --space-28: 7rem;
  --space-32: 8rem;
  --space-36: 9rem;
  --space-40: 10rem;
  --space-44: 11rem;
  --space-48: 12rem;
  --space-52: 13rem;
  --space-56: 14rem;
  --space-60: 15rem;
  --space-64: 16rem;
  --space-72: 18rem;
  --space-80: 20rem;
  --space-96: 24rem;

  /* Border Radius */
  --radius-none: 0;
  --radius-sm: 0.125rem;
  --radius-md: 0.25rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  --radius-2xl: 1rem;
  --radius-3xl: 1.5rem;
  --radius-full: 9999px;

  /* Box Shadow */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  --shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  --shadow-inner: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
  --shadow-none: 0 0 #0000;

  /* Animation Timing */
  --duration-instant: 0ms;
  --duration-fast: 150ms;
  --duration-normal: 300ms;
  --duration-slow: 500ms;
  --duration-slower: 700ms;
  --duration-slowest: 1000ms;

  /* Easing Functions */
  --ease-linear: linear;
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);

  /* Layout Constants */
  --sidebar-width: 280px;
  --header-height: 64px;
  --footer-height: 80px;
  --modal-max-width: 640px;
  --canvas-sidebar-width: 320px;
  --canvas-requirements-width: 300px;

  /* React Flow Canvas Specifications */
  --canvas-min-width: 800px;
  --canvas-min-height: 600px;
  --canvas-max-zoom: 2;
  --canvas-min-zoom: 0.25;
  --canvas-zoom-step: 0.1;

  --node-standard-width: 180px;
  --node-standard-height: 80px;
  --node-expanded-width: 240px;
  --node-expanded-height: 120px;
  --node-compact-width: 140px;
  --node-compact-height: 60px;

  --handle-size: 12px;
  --handle-border-width: 2px;
  --handle-hover-scale: 1.2;
  --handle-active-scale: 0.9;

  --edge-stroke-width-normal: 2px;
  --edge-stroke-width-heavy: 4px;
  --edge-stroke-width-critical: 6px;
  --edge-arrow-size: 20px;

  /* Z-Index Scale */
  --z-below: -1;
  --z-0: 0;
  --z-10: 10;
  --z-20: 20;
  --z-30: 30;
  --z-40: 40;
  --z-50: 50;
  --z-60: 60;
  --z-70: 70;
  --z-80: 80;
  --z-90: 90;
  --z-100: 100;
  --z-above: 999;
  --z-modal: 1000;
  --z-popover: 1100;
  --z-tooltip: 1200;
  --z-notification: 1300;
  --z-max: 9999;
}

/* Dark mode tokens (for future enhancement) */
[data-theme="dark"] {
  --color-neutral-50: #0F172A;
  --color-neutral-100: #1E293B;
  --color-neutral-200: #334155;
  --color-neutral-300: #475569;
  --color-neutral-400: #64748B;
  --color-neutral-500: #94A3B8;
  --color-neutral-600: #CBD5E1;
  --color-neutral-700: #E2E8F0;
  --color-neutral-800: #F1F5F9;
  --color-neutral-900: #F8FAFC;
  --color-white: #0F172A;
  
  --component-healthy: #10B981;
  --component-stressed: #F59E0B;
  --component-overloaded: #EF4444;
  
  --design-canvas-bg: #0F172A;
  --design-grid-line: #1E293B;
  --design-grid-dot: #334155;
}
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/styles/design-system/ui-components.css
```css
/* System Design Tycoon - UI Components v2.0 */

/* Real-time Metrics Dashboard */
.metrics-dashboard {
  position: fixed;
  top: var(--space-4);
  right: var(--space-4);
  width: 320px;
  background: var(--color-white);
  border: 1px solid var(--color-neutral-200);
  border-radius: var(--radius-xl);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  z-index: 10;
}

.metrics-dashboard__header {
  padding: var(--space-4);
  background: var(--color-neutral-50);
  border-bottom: 1px solid var(--color-neutral-200);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.metrics-dashboard__title {
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--color-neutral-900);
}

.metrics-dashboard__status {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.metrics-dashboard__status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-secondary-500);
  animation: pulse-status 2s ease-in-out infinite;
}

.metrics-dashboard__status-indicator--warning {
  background: var(--color-warning-500);
}

.metrics-dashboard__status-indicator--critical {
  background: var(--color-error-500);
  animation: pulse-critical 0.5s ease-in-out infinite alternate;
}

@keyframes pulse-status {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Metric Cards */
.metric-card {
  padding: var(--space-4);
  border-bottom: 1px solid var(--color-neutral-100);
  transition: background var(--duration-fast) var(--ease-out);
}

.metric-card:hover {
  background: var(--color-neutral-50);
}

.metric-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-2);
}

.metric-card__label {
  font-size: var(--text-small);
  color: var(--color-neutral-600);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.metric-card__trend {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--text-xs);
}

.metric-card__trend--up {
  color: var(--color-secondary-600);
}

.metric-card__trend--down {
  color: var(--color-error-600);
}

.metric-card__value {
  font-size: var(--text-h3);
  font-weight: var(--font-bold);
  color: var(--color-neutral-900);
  margin-bottom: var(--space-1);
}

.metric-card__unit {
  font-size: var(--text-small);
  color: var(--color-neutral-500);
  margin-left: var(--space-1);
}

.metric-card__progress {
  height: 4px;
  background: var(--color-neutral-100);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.metric-card__progress-bar {
  height: 100%;
  background: var(--color-primary-500);
  border-radius: var(--radius-full);
  transition: width var(--duration-normal) var(--ease-out);
}

.metric-card__progress-bar--warning {
  background: var(--color-warning-500);
}

.metric-card__progress-bar--critical {
  background: var(--color-error-500);
}

/* Achievement Toast */
.achievement-toast {
  position: fixed;
  bottom: var(--space-4);
  right: var(--space-4);
  min-width: 320px;
  background: var(--color-white);
  border: 1px solid var(--color-neutral-200);
  border-radius: var(--radius-xl);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  animation: slide-in-right 0.3s var(--ease-bounce);
  z-index: 100;
}

@keyframes slide-in-right {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.achievement-toast__border {
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(to bottom, var(--color-premium-500), var(--color-primary-500));
}

.achievement-toast__content {
  padding: var(--space-4);
  display: flex;
  gap: var(--space-4);
}

.achievement-toast__icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-lg);
  background: linear-gradient(135deg, var(--color-premium-100), var(--color-primary-100));
  color: var(--color-premium-700);
  flex-shrink: 0;
}

.achievement-toast__text {
  flex: 1;
}

.achievement-toast__title {
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--color-neutral-900);
  margin-bottom: var(--space-1);
}

.achievement-toast__description {
  font-size: var(--text-small);
  color: var(--color-neutral-600);
}

.achievement-toast__close {
  position: absolute;
  top: var(--space-2);
  right: var(--space-2);
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  background: transparent;
  color: var(--color-neutral-400);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
}

.achievement-toast__close:hover {
  background: var(--color-neutral-100);
  color: var(--color-neutral-600);
}

/* Progress Notification */
.progress-notification {
  position: fixed;
  top: var(--space-4);
  left: 50%;
  transform: translateX(-50%);
  padding: var(--space-3) var(--space-6);
  background: var(--color-neutral-900);
  color: white;
  border-radius: var(--radius-full);
  font-size: var(--text-small);
  font-weight: var(--font-medium);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  animation: fade-in-down 0.3s var(--ease-out);
  z-index: 90;
}

@keyframes fade-in-down {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

.progress-notification__icon {
  display: inline-block;
  margin-right: var(--space-2);
  animation: spin 1s linear infinite;
}

.progress-notification--success {
  background: var(--color-secondary-600);
}

.progress-notification--error {
  background: var(--color-error-600);
}

/* Modal System */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fade-in var(--duration-normal) var(--ease-out);
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal {
  background: var(--color-white);
  border-radius: var(--radius-xl);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  max-width: 90vw;
  max-height: 90vh;
  overflow: hidden;
  animation: scale-in var(--duration-normal) var(--ease-bounce);
}

@keyframes scale-in {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.modal--small { width: 400px; }
.modal--medium { width: 600px; }
.modal--large { width: 800px; }
.modal--full { width: 90vw; height: 90vh; }

.modal__header {
  padding: var(--space-6);
  border-bottom: 1px solid var(--color-neutral-200);
}

.modal__title {
  font-size: var(--text-h2);
  font-weight: var(--font-semibold);
  color: var(--color-neutral-900);
  margin: 0;
}

.modal__content {
  padding: var(--space-6);
  overflow-y: auto;
  max-height: calc(90vh - 160px);
}

.modal__footer {
  padding: var(--space-4) var(--space-6);
  border-top: 1px solid var(--color-neutral-200);
  display: flex;
  gap: var(--space-3);
  justify-content: flex-end;
}

/* Level Complete Modal */
.level-complete-modal {
  text-align: center;
}

.level-complete-modal__trophy {
  width: 120px;
  height: 120px;
  margin: 0 auto var(--space-6);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-premium-400), var(--color-primary-400));
  color: white;
  font-size: 48px;
  animation: trophy-bounce 0.6s var(--ease-bounce);
}

@keyframes trophy-bounce {
  0% { transform: scale(0); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.level-complete-modal__stars {
  display: flex;
  gap: var(--space-2);
  justify-content: center;
  margin-bottom: var(--space-4);
}

.level-complete-modal__star {
  width: 48px;
  height: 48px;
  color: var(--color-neutral-300);
  transition: all var(--duration-normal) var(--ease-out);
}

.level-complete-modal__star--earned {
  color: var(--color-warning-500);
  animation: star-pop 0.4s var(--ease-bounce);
}

@keyframes star-pop {
  0% { transform: scale(0) rotate(0deg); }
  50% { transform: scale(1.2) rotate(180deg); }
  100% { transform: scale(1) rotate(360deg); }
}

.level-complete-modal__metrics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-4);
  margin: var(--space-6) 0;
}

.level-complete-modal__metric {
  padding: var(--space-4);
  background: var(--color-neutral-50);
  border-radius: var(--radius-lg);
}

.level-complete-modal__metric-value {
  font-size: var(--text-h3);
  font-weight: var(--font-bold);
  color: var(--color-neutral-900);
  margin-bottom: var(--space-1);
}

.level-complete-modal__metric-label {
  font-size: var(--text-small);
  color: var(--color-neutral-600);
}

/* Loading States */
.skeleton {
  animation: skeleton-loading 1.5s ease-in-out infinite;
  background: linear-gradient(
    90deg,
    var(--color-neutral-200) 25%,
    var(--color-neutral-100) 50%,
    var(--color-neutral-200) 75%
  );
  background-size: 200% 100%;
}

@keyframes skeleton-loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.skeleton-text {
  height: var(--text-base);
  border-radius: var(--radius-sm);
  margin-bottom: var(--space-2);
}

.skeleton-text--short {
  width: 40%;
}

.skeleton-text--medium {
  width: 70%;
}

.skeleton-text--long {
  width: 90%;
}

.skeleton-component-card {
  width: var(--node-standard-width);
  height: var(--node-standard-height);
  border-radius: var(--radius-lg);
}

.skeleton-metric-card {
  height: 80px;
  border-radius: var(--radius-lg);
  margin-bottom: var(--space-3);
}

/* Loading Indicators */
.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--color-neutral-200);
  border-top-color: var(--color-primary-500);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.loading-spinner--small {
  width: 20px;
  height: 20px;
  border-width: 2px;
}

.loading-spinner--large {
  width: 60px;
  height: 60px;
  border-width: 4px;
}

.loading-dots {
  display: flex;
  gap: var(--space-1);
}

.loading-dots__dot {
  width: 8px;
  height: 8px;
  background: var(--color-primary-500);
  border-radius: 50%;
  animation: dot-pulse 1.4s ease-in-out infinite;
}

.loading-dots__dot:nth-child(1) { animation-delay: -0.32s; }
.loading-dots__dot:nth-child(2) { animation-delay: -0.16s; }
.loading-dots__dot:nth-child(3) { animation-delay: 0; }

@keyframes dot-pulse {
  0%, 80%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Error States */
.error-state {
  text-align: center;
  padding: var(--space-12) var(--space-6);
}

.error-state__icon {
  width: 80px;
  height: 80px;
  margin: 0 auto var(--space-6);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--color-error-100);
  color: var(--color-error-600);
}

.error-state__title {
  font-size: var(--text-h3);
  font-weight: var(--font-semibold);
  color: var(--color-neutral-900);
  margin-bottom: var(--space-2);
}

.error-state__description {
  font-size: var(--text-base);
  color: var(--color-neutral-600);
  margin-bottom: var(--space-6);
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

.error-state__actions {
  display: flex;
  gap: var(--space-3);
  justify-content: center;
}

/* Empty States */
.empty-state {
  text-align: center;
  padding: var(--space-12) var(--space-6);
}

.empty-state__illustration {
  width: 200px;
  height: 200px;
  margin: 0 auto var(--space-6);
  opacity: 0.8;
}

.empty-state__title {
  font-size: var(--text-h3);
  font-weight: var(--font-semibold);
  color: var(--color-neutral-900);
  margin-bottom: var(--space-2);
}

.empty-state__description {
  font-size: var(--text-base);
  color: var(--color-neutral-600);
  margin-bottom: var(--space-6);
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

.empty-state__action {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
}

/* Multiplayer Components */
.challenge-leaderboard {
  position: fixed;
  left: var(--space-4);
  top: 50%;
  transform: translateY(-50%);
  width: 280px;
  background: var(--color-white);
  border: 1px solid var(--color-neutral-200);
  border-radius: var(--radius-xl);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  z-index: 10;
}

.challenge-leaderboard__header {
  padding: var(--space-4);
  background: linear-gradient(135deg, var(--color-primary-600), var(--color-primary-700));
  color: white;
}

.challenge-leaderboard__title {
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  margin-bottom: var(--space-1);
}

.challenge-leaderboard__timer {
  font-size: var(--text-h3);
  font-weight: var(--font-bold);
  font-variant-numeric: tabular-nums;
}

.challenge-leaderboard__players {
  padding: var(--space-2);
  max-height: 400px;
  overflow-y: auto;
}

.challenge-player {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  border-radius: var(--radius-md);
  transition: background var(--duration-fast) var(--ease-out);
}

.challenge-player:hover {
  background: var(--color-neutral-50);
}

.challenge-player__rank {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  background: var(--color-neutral-100);
  font-size: var(--text-xs);
  font-weight: var(--font-bold);
}

.challenge-player__rank--1 {
  background: linear-gradient(135deg, #FFD700, #FFA500);
  color: white;
}

.challenge-player__rank--2 {
  background: linear-gradient(135deg, #C0C0C0, #808080);
  color: white;
}

.challenge-player__rank--3 {
  background: linear-gradient(135deg, #CD7F32, #8B4513);
  color: white;
}

.challenge-player__info {
  flex: 1;
}

.challenge-player__name {
  font-size: var(--text-small);
  font-weight: var(--font-medium);
  color: var(--color-neutral-900);
}

.challenge-player__progress {
  margin-top: var(--space-1);
  height: 4px;
  background: var(--color-neutral-100);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.challenge-player__progress-bar {
  height: 100%;
  background: var(--color-primary-500);
  border-radius: var(--radius-full);
  transition: width var(--duration-normal) var(--ease-out);
}

.challenge-player__score {
  font-size: var(--text-base);
  font-weight: var(--font-bold);
  color: var(--color-neutral-900);
}

.challenge-player--current {
  background: var(--color-primary-50);
  border: 1px solid var(--color-primary-300);
}
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/types/index.ts
```ts
// User and Authentication Types
export interface User {
  id: string;
  email: string;
  username: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Profile {
  id: string;
  username: string;
  display_name?: string;
  avatar_url?: string;
  current_level: number;
  reputation_points: number;
  career_title: string;
  preferred_mentor_id?: string;
  created_at: string;
  updated_at: string;
}

export interface UserStats {
  userId: string;
  totalProjectsCompleted: number;
  totalComponentsUsed: number;
  averageScore: number;
  bestScore: number;
  totalTimePlayed: number;
  favoriteComponentId?: string;
  lastPlayedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Scenario Types
export interface Scenario {
  id: string;
  level: number;
  title: string;
  clientName: string;
  description: string;
  budgetLimit: number;
  timeLimitSeconds: number;
  baseRequirements: Requirement[];
  availableQuestions: QuestionSet;
  availableComponents: string[];
  availableMentors: string[];
  successCriteria: SuccessCriteria;
  createdAt: string;
}

export interface Requirement {
  id: string;
  type: 'functional' | 'performance' | 'constraint';
  description: string;
  metric?: string;
  value?: number;
}

export interface QuestionSet {
  [character: string]: Question[];
}

export interface Question {
  id: string;
  text: string;
  impact: {
    requirements?: Requirement[];
    budget?: number;
    timeline?: number;
  };
}

export interface SuccessCriteria {
  minScore: number;
  maxResponseTime?: number;
  minUptime?: number;
  maxErrorRate?: number;
}

// Component Types
export interface Component {
  id: string;
  name: string;
  category: ComponentCategory;
  cost: number;
  capacity: number;
  description: string;
  iconUrl?: string;
  minLevel: number;
  connections: string[];
  properties: ComponentProperties;
  createdAt: string;
}

export type ComponentCategory = 
  | 'frontend' 
  | 'backend' 
  | 'storage' 
  | 'networking' 
  | 'security' 
  | 'operations';

export interface ComponentProperties {
  throughput?: number;
  latency?: number;
  storage?: number;
  bandwidth?: number;
  [key: string]: any;
}

export interface ComponentMastery {
  userId: string;
  componentId: string;
  masteryLevel: MasteryLevel;
  timesUsed: number;
  successfulUses: number;
  lastUsedAt: string;
  unlockedAt: string;
}

export type MasteryLevel = 'novice' | 'bronze' | 'silver' | 'gold';

// Progress Types
export interface ScenarioProgress {
  id: string;
  userId: string;
  scenarioId: string;
  status: ProgressStatus;
  bestScore?: number;
  attempts: number;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type ProgressStatus = 'locked' | 'available' | 'completed';

export interface ScenarioAttempt {
  id: string;
  userId: string;
  scenarioId: string;
  architectureSnapshot: ArchitectureSnapshot;
  questionsAsked: string[];
  mentorSelected?: string;
  componentsUsed: string[];
  totalCost: number;
  performanceMetrics: PerformanceMetrics;
  finalScore: number;
  requirementsMet: boolean[];
  completedAt: string;
  createdAt: string;
}

export interface ArchitectureSnapshot {
  nodes: ArchitectureNode[];
  edges: ArchitectureEdge[];
}

export interface ArchitectureNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: {
    componentId: string;
    label: string;
    [key: string]: any;
  };
}

export interface ArchitectureEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
  animated?: boolean;
  data?: any;
}

export interface PerformanceMetrics {
  responseTime: number;
  throughput: number;
  errorRate: number;
  uptime: number;
  capacityUtilization: number;
}

// Game State Types
export interface GameState {
  currentScreen: GameScreen;
  currentScenario?: Scenario;
  meetingPhase?: MeetingPhaseState;
  designPhase?: DesignPhaseState;
  simulationPhase?: SimulationPhaseState;
  selectedMentor?: Mentor;
}

export type GameScreen = 
  | 'landing'
  | 'auth'
  | 'career-map'
  | 'meeting'
  | 'mentor-selection'
  | 'design'
  | 'simulation'
  | 'results';

export interface MeetingPhaseState {
  questionsRemaining: number;
  questionsAsked: string[];
  currentRequirements: Requirement[];
  budget: number;
  timeline: number;
}

export interface DesignPhaseState {
  timeRemaining: number;
  currentCost: number;
  architecture: ArchitectureSnapshot;
  requirementsMet: boolean[];
}

export interface SimulationPhaseState {
  isRunning: boolean;
  currentPhase: SimulationPhase;
  metrics: PerformanceMetrics;
  componentStates: { [id: string]: ComponentState };
}

export type SimulationPhase = 
  | 'normal' 
  | 'peak' 
  | 'viral' 
  | 'recovery';

export type ComponentState = 
  | 'idle' 
  | 'active' 
  | 'stressed' 
  | 'overloaded' 
  | 'failed';

// Mentor Types
export interface Mentor {
  id: string;
  name: string;
  title: string;
  specialization: string;
  guidanceStyle: string;
  bestForLevels: number[];
  signatureAdvice: string;
  avatarUrl?: string;
  unlockLevel: number;
}

// Achievement Types
export interface Achievement {
  id: string;
  name: string;
  description: string;
  iconUrl?: string;
  category: AchievementCategory;
  criteria: AchievementCriteria;
  rewardType?: RewardType;
  rewardValue?: any;
  createdAt: string;
}

export type AchievementCategory = 
  | 'performance' 
  | 'efficiency' 
  | 'learning' 
  | 'milestone' 
  | 'special';

export interface AchievementCriteria {
  type: string;
  value: number;
  comparison: 'gte' | 'lte' | 'eq';
}

export type RewardType = 
  | 'reputation' 
  | 'component' 
  | 'mentor' 
  | 'cosmetic';

export interface UserAchievement {
  userId: string;
  achievementId: string;
  unlockedAt: string;
  progress?: number;
}

export interface ComponentRequirement {
  id: string;
  type: 'performance' | 'scalability' | 'security' | 'cost' | 'reliability';
  description: string;
  target: number;
  unit: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
}

export interface InitialNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: {
    label: string;
    componentType: string;
    cost: number;
    capacity: number;
    description: string;
    category: string;
  };
  style?: Record<string, any>;
}

export interface CollaborationSettings {
  maxPlayers: number;
  allowedRoles: ('architect' | 'engineer' | 'reviewer')[];
  consensusRequired: boolean;
  timeLimit?: number;
  allowRealTimeEditing: boolean;
}

export interface ComponentSelection {
  componentType: string;
  mode: 'mentor' | 'collaboration';
  scenarioId: string;
  requirements: ComponentRequirement[];
  initialNodes: InitialNode[];
  collaborationSettings?: CollaborationSettings;
  selectedAt: number;
}
```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/App.tsx
```tsx
import { RouterProvider } from 'react-router-dom';
import { router } from './router';

function App() {
  return <RouterProvider router={router} />;
}

export default App

```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/index.css
```css
/* Import Design System */
@import './styles/design-system/index.css';

/* Tailwind CSS - Used alongside design system for utility classes */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Override Tailwind's base styles with design system tokens */
@layer base {
  :root {
    font-family: var(--font-sans);
    line-height: var(--leading-normal);
    font-weight: var(--font-normal);
    
    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    margin: 0;
    background: var(--color-neutral-50);
    color: var(--color-neutral-900);
  }
}

```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/main.tsx
```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)

```

File: /Users/hutch/Documents/projects/gauntlet/p5/system-tycoon/src/vite-env.d.ts
```ts
/// <reference types="vite/client" />

```
</file_contents>
