1. Introduction
This document provides comprehensive documentation for all components in System Design Tycoon, organized according to the Atomic Design methodology. Each component is documented with its purpose, props interface, state management approach, and usage examples.
Design Principles

Composability: Components should be easily combined to create complex UIs
Reusability: Atoms and molecules should work across different contexts
Predictability: State flows should be clear and unidirectional
Accessibility: All components must meet WCAG 2.1 AA standards
Performance: Components should be optimized for 60fps animations


2. Component Architecture
File Structure
src/
├── components/
│   ├── atoms/
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.styles.ts
│   │   │   ├── Button.test.tsx
│   │   │   ├── Button.stories.tsx
│   │   │   └── index.ts
│   │   ├── Icon/
│   │   ├── Badge/
│   │   └── ...
│   ├── molecules/
│   │   ├── ComponentCard/
│   │   ├── MetricCard/
│   │   └── ...
│   ├── organisms/
│   │   ├── ComponentDrawer/
│   │   ├── MeetingRoom/
│   │   └── ...
│   ├── templates/
│   │   ├── MeetingPhaseTemplate/
│   │   ├── DesignPhaseTemplate/
│   │   └── ...
│   └── pages/
│       ├── MeetingPage/
│       ├── DesignPage/
│       └── ...
State Management Hierarchy
typescript// State flows from Pages → Templates → Organisms → Molecules → Atoms
// Atoms: Stateless (props only)
// Molecules: Minimal local state (UI state only)
// Organisms: Complex local state + context consumption
// Templates: Global state orchestration
// Pages: Route-level state + data fetching

3. Atoms
3.1 Button
Purpose: Primary interactive element for user actions throughout the game.
Component Definition:
typescript// Button.types.ts
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  'aria-label'?: string;
  'data-testid'?: string;
}

// Button.tsx
import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';
import { ButtonProps } from './Button.types';
import styles from './Button.module.css';

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  children,
  onClick,
  type = 'button',
  className,
  'aria-label': ariaLabel,
  'data-testid': dataTestId,
}, ref) => {
  const isDisabled = disabled || loading;

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={clsx(
        styles.button,
        styles[variant],
        styles[size],
        {
          [styles.fullWidth]: fullWidth,
          [styles.loading]: loading,
        },
        className
      )}
      aria-label={ariaLabel}
      aria-busy={loading}
      data-testid={dataTestId}
    >
      {loading && (
        <Loader2 className={styles.loadingIcon} aria-hidden="true" />
      )}
      {!loading && leftIcon && (
        <span className={styles.leftIcon} aria-hidden="true">
          {leftIcon}
        </span>
      )}
      <span className={styles.content}>{children}</span>
      {!loading && rightIcon && (
        <span className={styles.rightIcon} aria-hidden="true">
          {rightIcon}
        </span>
      )}
    </button>
  );
});

Button.displayName = 'Button';
State Management: Stateless - all behavior controlled via props.
Usage Example:
tsx// Primary action button
<Button 
  variant="primary" 
  onClick={handleStartDesign}
  leftIcon={<PlayIcon />}
>
  Start Design
</Button>

// Loading state
<Button 
  variant="primary" 
  loading 
  disabled
>
  Saving...
</Button>

// Danger action
<Button 
  variant="danger" 
  onClick={handleDelete}
  aria-label="Delete component"
>
  Delete
</Button>
3.2 Icon
Purpose: Consistent icon system using Lucide React with custom game-specific icons.
Component Definition:
typescript// Icon.types.ts
export interface IconProps {
  name: IconName;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  className?: string;
  'aria-label'?: string;
}

export type IconName = 
  | 'server' 
  | 'database' 
  | 'globe' 
  | 'shield' 
  | 'activity'
  | LucideIconName;

// Icon.tsx
import React from 'react';
import * as LucideIcons from 'lucide-react';
import { IconProps } from './Icon.types';
import { customIcons } from './customIcons';
import styles from './Icon.module.css';

const iconSizes = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
};

export const Icon: React.FC<IconProps> = ({
  name,
  size = 'md',
  color = 'currentColor',
  className,
  'aria-label': ariaLabel,
}) => {
  const IconComponent = customIcons[name] || LucideIcons[name];
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return (
    <IconComponent
      size={iconSizes[size]}
      color={color}
      className={clsx(styles.icon, styles[size], className)}
      aria-label={ariaLabel}
      aria-hidden={!ariaLabel}
    />
  );
};
State Management: Stateless - pure presentation component.
3.3 Badge
Purpose: Display status indicators, counts, and labels throughout the UI.
Component Definition:
typescript// Badge.types.ts
export interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'premium';
  size?: 'sm' | 'md';
  dot?: boolean;
  children: React.ReactNode;
  className?: string;
}

// Badge.tsx
import React from 'react';
import { clsx } from 'clsx';
import { BadgeProps } from './Badge.types';
import styles from './Badge.module.css';

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'md',
  dot = false,
  children,
  className,
}) => {
  return (
    <span
      className={clsx(
        styles.badge,
        styles[variant],
        styles[size],
        {
          [styles.dot]: dot,
        },
        className
      )}
    >
      {dot && <span className={styles.dotIndicator} aria-hidden="true" />}
      {children}
    </span>
  );
};
State Management: Stateless - display only.
3.4 Handle (React Flow)
Purpose: Connection points for React Flow nodes.
Component Definition:
typescript// Handle.types.ts
import { Position, HandleType } from '@xyflow/react';

export interface HandleProps {
  type: HandleType;
  position: Position;
  id?: string;
  isConnectable?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onConnect?: (connection: Connection) => void;
  isValidConnection?: (connection: Connection) => boolean;
}

// Handle.tsx
import React from 'react';
import { Handle as ReactFlowHandle } from '@xyflow/react';
import { clsx } from 'clsx';
import { HandleProps } from './Handle.types';
import styles from './Handle.module.css';

export const Handle: React.FC<HandleProps> = ({
  type,
  position,
  id,
  isConnectable = true,
  className,
  style,
  onConnect,
  isValidConnection,
}) => {
  return (
    <ReactFlowHandle
      type={type}
      position={position}
      id={id}
      isConnectable={isConnectable}
      className={clsx(
        styles.handle,
        styles[type],
        className
      )}
      style={style}
      onConnect={onConnect}
      isValidConnection={isValidConnection}
    />
  );
};
State Management: Managed by React Flow internally.
3.5 Input
Purpose: Text input for forms and search functionality.
Component Definition:
typescript// Input.types.ts
export interface InputProps {
  type?: 'text' | 'email' | 'password' | 'search' | 'number';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  errorMessage?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
  'aria-label'?: string;
  'data-testid'?: string;
}

// Input.tsx
import React, { useCallback } from 'react';
import { clsx } from 'clsx';
import { InputProps } from './Input.types';
import styles from './Input.module.css';

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
  className,
  'aria-label': ariaLabel,
  'data-testid': dataTestId,
}) => {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  }, [onChange]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.inputContainer}>
        {leftIcon && (
          <span className={styles.leftIcon} aria-hidden="true">
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
            styles.input,
            {
              [styles.error]: error,
              [styles.hasLeftIcon]: leftIcon,
              [styles.hasRightIcon]: rightIcon,
            },
            className
          )}
          aria-label={ariaLabel}
          aria-invalid={error}
          aria-describedby={errorMessage ? `${dataTestId}-error` : undefined}
          data-testid={dataTestId}
        />
        {rightIcon && (
          <span className={styles.rightIcon} aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </div>
      {errorMessage && (
        <span 
          id={`${dataTestId}-error`}
          className={styles.errorMessage}
          role="alert"
        >
          {errorMessage}
        </span>
      )}
    </div>
  );
};
State Management: Controlled component - parent manages state.

4. Molecules
4.1 ComponentCard
Purpose: Displays system architecture components in drawer and on canvas.
Component Definition:
typescript// ComponentCard.types.ts
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

// ComponentCard.tsx
import React, { useState, useCallback } from 'react';
import { clsx } from 'clsx';
import { useDraggable } from '@dnd-kit/core';
import { Icon } from '../../atoms/Icon';
import { Badge } from '../../atoms/Badge';
import { ComponentCardProps } from './ComponentCard.types';
import styles from './ComponentCard.module.css';

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
        styles.card,
        styles[variant],
        styles[status],
        {
          [styles.dragging]: isDragging,
          [styles.selected]: isSelected,
          [styles.locked]: data.locked,
          [styles.hovered]: isHovered,
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
      <div className={styles.header}>
        <Icon 
          name={data.icon || 'server'} 
          size="md" 
          className={styles.icon}
        />
        <h3 className={styles.name}>{data.name}</h3>
        {data.locked && (
          <Icon 
            name="lock" 
            size="sm" 
            className={styles.lockIcon}
            aria-label="Component locked"
          />
        )}
      </div>
      
      {variant === 'canvas' && (
        <div className={styles.metrics}>
          <div className={styles.metric}>
            <span className={styles.metricLabel}>Load</span>
            <span className={styles.metricValue}>
              {Math.round((data.capacity / 100) * 75)}%
            </span>
          </div>
          <div className={styles.metric}>
            <span className={styles.metricLabel}>Cost</span>
            <span className={styles.metricValue}>${data.cost}/mo</span>
          </div>
        </div>
      )}
      
      {variant === 'drawer' && (
        <div className={styles.footer}>
          <span className={styles.cost}>${data.cost}/mo</span>
          <Badge variant="info" size="sm">
            {data.capacity} req/s
          </Badge>
        </div>
      )}
    </div>
  );
};
State Management:

Local state for hover effects
Dragging state managed by DnD Kit
Selection state passed from parent

4.2 MetricCard
Purpose: Display real-time performance metrics with trends.
Component Definition:
typescript// MetricCard.types.ts
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

// MetricCard.tsx
import React, { useState, useEffect, useRef } from 'react';
import { clsx } from 'clsx';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { MetricCardProps } from './MetricCard.types';
import styles from './MetricCard.module.css';

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
        return <TrendingUp size={16} />;
      case 'down':
        return <TrendingDown size={16} />;
      default:
        return <Minus size={16} />;
    }
  };

  const progressPercentage = data.target 
    ? Math.min((data.value / data.target) * 100, 100)
    : 0;

  return (
    <div
      className={clsx(
        styles.card,
        styles[data.status || 'normal'],
        {
          [styles.animating]: isAnimating,
        },
        className
      )}
      onMouseEnter={() => onHover?.(data)}
    >
      <div className={styles.header}>
        <span className={styles.label}>{data.label}</span>
        {data.trend && (
          <div className={clsx(styles.trend, styles[data.trend])}>
            {getTrendIcon()}
            {data.trendValue && (
              <span className={styles.trendValue}>
                {data.trendValue > 0 ? '+' : ''}{data.trendValue}%
              </span>
            )}
          </div>
        )}
      </div>
      
      <div className={styles.value}>
        <span className={styles.number}>
          {displayValue.toFixed(1)}
        </span>
        <span className={styles.unit}>{data.unit}</span>
      </div>
      
      {data.target && (
        <div className={styles.progress}>
          <div 
            className={styles.progressBar}
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
State Management:

Local state for value animations
Ref for tracking previous values

4.3 QuestionCard
Purpose: Interactive cards for meeting phase question selection.
Component Definition:
typescript// QuestionCard.types.ts
export interface Question {
  id: string;
  text: string;
  speaker: TeamMember;
  category: 'product' | 'business' | 'marketing' | 'technical';
  impact: RequirementImpact[];
}

export interface QuestionCardProps {
  question: Question;
  isSelected: boolean;
  isDisabled: boolean;
  onSelect: (questionId: string) => void;
  className?: string;
}

// QuestionCard.tsx
import React, { useState, useCallback } from 'react';
import { clsx } from 'clsx';
import { Icon } from '../../atoms/Icon';
import { Badge } from '../../atoms/Badge';
import { QuestionCardProps } from './QuestionCard.types';
import styles from './QuestionCard.module.css';

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
      technical: 'premium',
    };
    return colors[question.category] || 'default';
  };

  return (
    <div
      className={clsx(
        styles.card,
        styles[question.category],
        {
          [styles.selected]: isSelected,
          [styles.disabled]: isDisabled,
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
      <div className={styles.categoryIndicator} />
      
      <div className={styles.content}>
        <p className={styles.text}>{question.text}</p>
        <div className={styles.speaker}>
          <Icon name="user" size="xs" />
          <span>{question.speaker.name}</span>
        </div>
      </div>

      <div className={styles.impactIcons}>
        {question.impact.map((impact) => (
          <div 
            key={impact.type}
            className={styles.impactIcon}
            title={impact.description}
          >
            <Icon name={impact.icon} size="xs" />
          </div>
        ))}
      </div>

      {showImpactPreview && !isDisabled && (
        <div className={styles.impactPreview}>
          <h4>This question will:</h4>
          <ul>
            {question.impact.map((impact) => (
              <li key={impact.type}>{impact.description}</li>
            ))}
          </ul>
        </div>
      )}

      {isSelected && (
        <div className={styles.selectedBadge}>
          <Icon name="check" size="sm" />
        </div>
      )}
    </div>
  );
};
State Management:

Local state for impact preview
Selection state managed by parent


5. Organisms
5.1 ComponentDrawer
Purpose: Categorized panel for dragging components onto the design canvas.
Component Definition:
typescript// ComponentDrawer.types.ts
export interface ComponentDrawerProps {
  components: ComponentData[];
  categories: ComponentCategory[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onComponentDragStart: (component: ComponentData) => void;
  onComponentDragEnd: () => void;
  className?: string;
}

// ComponentDrawer.tsx
import React, { useState, useCallback, useMemo } from 'react';
import { clsx } from 'clsx';
import { Search, ChevronDown } from 'lucide-react';
import { Input } from '../../atoms/Input';
import { ComponentCard } from '../../molecules/ComponentCard';
import { ComponentDrawerProps } from './ComponentDrawer.types';
import styles from './ComponentDrawer.module.css';

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
    <div className={clsx(styles.drawer, className)}>
      <div className={styles.header}>
        <h2 className={styles.title}>Components</h2>
        <Input
          type="search"
          value={searchQuery}
          onChange={onSearchChange}
          placeholder="Search components..."
          leftIcon={<Search size={16} />}
          className={styles.searchInput}
          aria-label="Search components"
        />
      </div>

      <div className={styles.categories}>
        {categories.map(category => {
          const categoryComponents = groupedComponents[category.id] || [];
          const isExpanded = expandedCategories.has(category.id);
          
          return (
            <div key={category.id} className={styles.category}>
              <button
                className={styles.categoryHeader}
                onClick={() => toggleCategory(category.id)}
                aria-expanded={isExpanded}
                aria-controls={`category-${category.id}`}
              >
                <Icon name={category.icon} size="md" />
                <span className={styles.categoryTitle}>{category.name}</span>
                <span className={styles.categoryCount}>
                  {categoryComponents.length}
                </span>
                <ChevronDown 
                  className={clsx(styles.chevron, {
                    [styles.expanded]: isExpanded,
                  })}
                  size={16}
                />
              </button>
              
              {isExpanded && (
                <div 
                  id={`category-${category.id}`}
                  className={styles.categoryItems}
                >
                  {categoryComponents.length === 0 ? (
                    <p className={styles.emptyMessage}>
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
State Management:

Local state for category expansion
Search state lifted to parent for persistence
Drag state handled by DnD context

5.2 MeetingRoom
Purpose: Interactive interface for requirements gathering phase.
Component Definition:
typescript// MeetingRoom.types.ts
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

// MeetingRoom.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { clsx } from 'clsx';
import { Button } from '../../atoms/Button';
import { Badge } from '../../atoms/Badge';
import { CharacterPortrait } from '../../molecules/CharacterPortrait';
import { QuestionCard } from '../../molecules/QuestionCard';
import { DialogueBox } from '../../molecules/DialogueBox';
import { MeetingRoomProps } from './MeetingRoom.types';
import styles from './MeetingRoom.module.css';

export const MeetingRoom: React.FC<MeetingRoomProps> = ({
  teamMembers,
  availableQuestions,
  selectedQuestions,
  maxQuestions,
  dialogueHistory,
  onQuestionSelect,
  onProceedToDesign,
  className,
}) => {
  // Local state for active speaker and UI
  const [activeSpeaker, setActiveSpeaker] = useState<string | null>(null);
  const [showQuestions, setShowQuestions] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Filter questions by active speaker
  const speakerQuestions = useMemo(() => {
    if (!activeSpeaker) return [];
    return availableQuestions.filter(q => q.speaker.id === activeSpeaker);
  }, [availableQuestions, activeSpeaker]);

  // Calculate questions remaining
  const questionsRemaining = maxQuestions - selectedQuestions.length;
  const canAskMore = questionsRemaining > 0;

  const handleSpeakerClick = useCallback((speakerId: string) => {
    if (!canAskMore) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveSpeaker(speakerId);
      setShowQuestions(true);
      setIsTransitioning(false);
    }, 200);
  }, [canAskMore]);

  const handleQuestionSelect = useCallback((questionId: string) => {
    onQuestionSelect(questionId);
    setShowQuestions(false);
    setActiveSpeaker(null);
  }, [onQuestionSelect]);

  const handleProceed = useCallback(() => {
    if (selectedQuestions.length === 0) {
      // Show confirmation dialog
      const confirmed = window.confirm(
        'Are you sure you want to proceed without asking any questions?'
      );
      if (!confirmed) return;
    }
    onProceedToDesign();
  }, [selectedQuestions.length, onProceedToDesign]);

  // Auto-scroll dialogue to bottom
  useEffect(() => {
    const dialogueElement = document.getElementById('dialogue-history');
    if (dialogueElement) {
      dialogueElement.scrollTop = dialogueElement.scrollHeight;
    }
  }, [dialogueHistory]);

  return (
    <div className={clsx(styles.room, className)}>
      <div className={styles.mainArea}>
        <div className={styles.teamMembers}>
          {teamMembers.map(member => {
            const memberQuestions = availableQuestions.filter(
              q => q.speaker.id === member.id && !selectedQuestions.includes(q.id)
            );
            const hasQuestions = memberQuestions.length > 0;

            return (
              <div
                key={member.id}
                className={clsx(styles.memberSlot, {
                  [styles.active]: activeSpeaker === member.id,
                  [styles.available]: hasQuestions && canAskMore,
                })}
              >
                <CharacterPortrait
                  character={member}
                  isAvailable={hasQuestions && canAskMore}
                  isActive={activeSpeaker === member.id}
                  questionCount={memberQuestions.length}
                  onClick={() => handleSpeakerClick(member.id)}
                />
                <div className={styles.memberInfo}>
                  <h3 className={styles.memberName}>{member.name}</h3>
                  <p className={styles.memberRole}>{member.role}</p>
                </div>
              </div>
            );
          })}
        </div>

        {showQuestions && !isTransitioning && (
          <div className={styles.questionsOverlay}>
            <div className={styles.questionsPanel}>
              <h3 className={styles.questionsTitle}>
                Ask {teamMembers.find(m => m.id === activeSpeaker)?.name}
              </h3>
              <div className={styles.questionsList}>
                {speakerQuestions.map(question => (
                  <QuestionCard
                    key={question.id}
                    question={question}
                    isSelected={selectedQuestions.includes(question.id)}
                    isDisabled={!canAskMore}
                    onSelect={handleQuestionSelect}
                  />
                ))}
              </div>
              <Button
                variant="ghost"
                onClick={() => setShowQuestions(false)}
                className={styles.closeButton}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className={styles.sidebar}>
        <div className={styles.dialogueSection}>
          <div className={styles.dialogueHeader}>
            <h3>Meeting Discussion</h3>
            <Badge variant={canAskMore ? 'info' : 'warning'}>
              {questionsRemaining}/{maxQuestions} questions left
            </Badge>
          </div>
          <DialogueBox
            id="dialogue-history"
            entries={dialogueHistory}
            className={styles.dialogue}
          />
        </div>

        <div className={styles.actions}>
          <Button
            variant="primary"
            size="lg"
            onClick={handleProceed}
            fullWidth
            rightIcon={<Icon name="arrow-right" />}
          >
            Proceed to Mentor Selection
          </Button>
        </div>
      </div>
    </div>
  );
};
State Management:

Local state for UI interactions (active speaker, question panel)
Question selection state lifted to parent
Dialogue history managed by parent

5.3 DesignCanvas (React Flow)
Purpose: Main design workspace using React Flow for system architecture.
Component Definition:
typescript// DesignCanvas.types.ts
import { Node, Edge, Connection } from '@xyflow/react';

export interface DesignCanvasProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  onNodeSelect: (nodeId: string) => void;
  onNodeDelete: (nodeId: string) => void;
  selectedNodeId: string | null;
  isSimulating: boolean;
  className?: string;
}

// DesignCanvas.tsx
import React, { useCallback, useMemo } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  NodeTypes,
  EdgeTypes,
  useReactFlow,
  Panel,
} from '@xyflow/react';
import { clsx } from 'clsx';
import { SystemNode } from './nodes/SystemNode';
import { AnimatedEdge } from './edges/AnimatedEdge';
import { RequirementsPanel } from '../../molecules/RequirementsPanel';
import { DesignCanvasProps } from './DesignCanvas.types';
import styles from './DesignCanvas.module.css';

// Define custom node types
const nodeTypes: NodeTypes = {
  system: SystemNode,
};

// Define custom edge types
const edgeTypes: EdgeTypes = {
  animated: AnimatedEdge,
};

export const DesignCanvas: React.FC<DesignCanvasProps> = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeSelect,
  onNodeDelete,
  selectedNodeId,
  isSimulating,
  className,
}) => {
  const { fitView, zoomIn, zoomOut } = useReactFlow();

  // Connection validation
  const isValidConnection = useCallback((connection: Connection) => {
    // Prevent self-connections
    if (connection.source === connection.target) return false;
    
    // Check if connection already exists
    const exists = edges.some(edge => 
      (edge.source === connection.source && edge.target === connection.target) ||
      (edge.source === connection.target && edge.target === connection.source)
    );
    
    return !exists;
  }, [edges]);

  // Handle node click
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    onNodeSelect(node.id);
  }, [onNodeSelect]);

  // Handle delete key
  const onKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Delete' && selectedNodeId) {
      onNodeDelete(selectedNodeId);
    }
  }, [selectedNodeId, onNodeDelete]);

  // Node color function for minimap
  const nodeColor = useCallback((node: Node) => {
    const categoryColors = {
      compute: '#3B82F6',
      storage: '#10B981',
      networking: '#06B6D4',
      security: '#A855F7',
      operations: '#F59E0B',
    };
    return categoryColors[node.data.category] || '#6B7280';
  }, []);

  return (
    <div className={clsx(styles.canvas, className)}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        isValidConnection={isValidConnection}
        fitView
        fitViewOptions={{
          padding: 0.2,
          includeHiddenNodes: false,
        }}
        proOptions={{ hideAttribution: true }}
        className={clsx({
          [styles.simulating]: isSimulating,
        })}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={16}
          size={1}
          color="#E5E7EB"
        />
        
        <MiniMap
          nodeColor={nodeColor}
          className={styles.minimap}
          zoomable
          pannable
        />
        
        <Controls
          className={styles.controls}
          showZoom
          showFitView
          showInteractive
        />

        <Panel position="top-left" className={styles.panel}>
          <RequirementsPanel />
        </Panel>

        <Panel position="bottom-center" className={styles.toolbar}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => fitView({ duration: 800 })}
            leftIcon={<Icon name="maximize" />}
          >
            Fit View
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => zoomIn({ duration: 200 })}
            leftIcon={<Icon name="zoom-in" />}
          >
            Zoom In
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => zoomOut({ duration: 200 })}
            leftIcon={<Icon name="zoom-out" />}
          >
            Zoom Out
          </Button>
        </Panel>
      </ReactFlow>
    </div>
  );
};
State Management:

Node/Edge state managed by parent via React Flow handlers
Selection state controlled by parent
Local React Flow instance for viewport control


6. Templates
6.1 MeetingPhaseTemplate
Purpose: Layout template for the requirements gathering phase.
Component Definition:
typescript// MeetingPhaseTemplate.types.ts
export interface MeetingPhaseTemplateProps {
  meetingData: MeetingData;
  onQuestionSelect: (questionId: string) => void;
  onProceedToMentorSelection: () => void;
}

// MeetingPhaseTemplate.tsx
import React from 'react';
import { MeetingRoom } from '../../organisms/MeetingRoom';
import { Timer } from '../../molecules/Timer';
import { PhaseHeader } from '../../molecules/PhaseHeader';
import { MeetingPhaseTemplateProps } from './MeetingPhaseTemplate.types';
import styles from './MeetingPhaseTemplate.module.css';

export const MeetingPhaseTemplate: React.FC<MeetingPhaseTemplateProps> = ({
  meetingData,
  onQuestionSelect,
  onProceedToMentorSelection,
}) => {
  return (
    <div className={styles.template}>
      <PhaseHeader
        title="Requirements Gathering"
        subtitle={`Level ${meetingData.level}: ${meetingData.scenario.title}`}
        rightContent={
          <Timer
            duration={meetingData.timeLimit}
            onExpire={onProceedToMentorSelection}
            warningThreshold={60}
          />
        }
      />
      
      <main className={styles.content}>
        <MeetingRoom
          teamMembers={meetingData.teamMembers}
          availableQuestions={meetingData.questions}
          selectedQuestions={meetingData.selectedQuestions}
          maxQuestions={meetingData.maxQuestions}
          dialogueHistory={meetingData.dialogueHistory}
          onQuestionSelect={onQuestionSelect}
          onProceedToDesign={onProceedToMentorSelection}
        />
      </main>
    </div>
  );
};
State Management:

Pure presentational template
All state passed via props from page component

6.2 DesignPhaseTemplate
Purpose: Layout template for the system design phase.
Component Definition:
typescript// DesignPhaseTemplate.types.ts
export interface DesignPhaseTemplateProps {
  designData: DesignData;
  onNodeAdd: (component: ComponentData, position: XYPosition) => void;
  onNodeUpdate: (nodeId: string, data: any) => void;
  onNodeDelete: (nodeId: string) => void;
  onEdgeAdd: (connection: Connection) => void;
  onEdgeDelete: (edgeId: string) => void;
  onSimulationStart: () => void;
}

// DesignPhaseTemplate.tsx
import React, { useState } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { DndContext } from '@dnd-kit/core';
import { ComponentDrawer } from '../../organisms/ComponentDrawer';
import { DesignCanvas } from '../../organisms/DesignCanvas';
import { MetricsDashboard } from '../../organisms/MetricsDashboard';
import { MentorAssistant } from '../../organisms/MentorAssistant';
import { PhaseHeader } from '../../molecules/PhaseHeader';
import { DesignPhaseTemplateProps } from './DesignPhaseTemplate.types';
import styles from './DesignPhaseTemplate.module.css';

export const DesignPhaseTemplate: React.FC<DesignPhaseTemplateProps> = ({
  designData,
  onNodeAdd,
  onNodeUpdate,
  onNodeDelete,
  onEdgeAdd,
  onEdgeDelete,
  onSimulationStart,
}) => {
  // Local state for drawer search
  const [searchQuery, setSearchQuery] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && over.id === 'design-canvas') {
      const component = active.data.current as ComponentData;
      const position = {
        x: event.delta.x,
        y: event.delta.y,
      };
      onNodeAdd(component, position);
    }
    
    setIsDragging(false);
  };

  return (
    <DndContext
      onDragStart={() => setIsDragging(true)}
      onDragEnd={handleDragEnd}
    >
      <ReactFlowProvider>
        <div className={styles.template}>
          <PhaseHeader
            title="System Design"
            subtitle={designData.requirements.title}
            rightContent={
              <div className={styles.headerActions}>
                <Timer
                  duration={designData.timeLimit}
                  onExpire={onSimulationStart}
                  warningThreshold={120}
                />
                <Button
                  variant="primary"
                  onClick={onSimulationStart}
                  disabled={!designData.isValid}
                >
                  Start Simulation
                </Button>
              </div>
            }
          />
          
          <div className={styles.workspace}>
            <ComponentDrawer
              components={designData.availableComponents}
              categories={designData.componentCategories}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              className={styles.drawer}
            />
            
            <DesignCanvas
              nodes={designData.nodes}
              edges={designData.edges}
              onNodesChange={designData.onNodesChange}
              onEdgesChange={designData.onEdgesChange}
              onConnect={onEdgeAdd}
              onNodeSelect={designData.onNodeSelect}
              onNodeDelete={onNodeDelete}
              selectedNodeId={designData.selectedNodeId}
              isSimulating={false}
              className={styles.canvas}
            />
            
            <MetricsDashboard
              metrics={designData.currentMetrics}
              requirements={designData.requirements}
              budget={designData.budget}
              className={styles.metrics}
            />
          </div>
          
          {designData.selectedMentor && (
            <MentorAssistant
              mentor={designData.selectedMentor}
              currentDesign={designData.nodes}
              requirements={designData.requirements}
              className={styles.mentor}
            />
          )}
        </div>
      </ReactFlowProvider>
    </DndContext>
  );
};
State Management:

Local state for UI (search, drag state)
Design state managed by parent page
React Flow state managed by provider


7. Pages
7.1 GamePage
Purpose: Root page component managing game flow and global state.
Component Definition:
typescript// GamePage.types.ts
export interface GamePageProps {
  levelId: string;
  userId: string;
}

// GamePage.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MeetingPhaseTemplate } from '../../templates/MeetingPhaseTemplate';
import { MentorSelectionTemplate } from '../../templates/MentorSelectionTemplate';
import { DesignPhaseTemplate } from '../../templates/DesignPhaseTemplate';
import { SimulationPhaseTemplate } from '../../templates/SimulationPhaseTemplate';
import { ReviewPhaseTemplate } from '../../templates/ReviewPhaseTemplate';
import { useGameState } from '../../../hooks/useGameState';
import { useWebSocket } from '../../../hooks/useWebSocket';
import { GamePageProps } from './GamePage.types';
import styles from './GamePage.module.css';

type GamePhase = 'meeting' | 'mentor-selection' | 'design' | 'simulation' | 'review';

export const GamePage: React.FC<GamePageProps> = ({
  levelId,
  userId,
}) => {
  const navigate = useNavigate();
  
  // Global game state
  const {
    levelData,
    meetingState,
    designState,
    simulationState,
    updateMeetingState,
    updateDesignState,
    updateSimulationState,
    saveProgress,
  } = useGameState(levelId, userId);
  
  // Phase management
  const [currentPhase, setCurrentPhase] = useState<GamePhase>('meeting');
  const [phaseTransition, setPhaseTransition] = useState(false);
  
  // WebSocket for multiplayer (if applicable)
  const { sendMessage, subscribe } = useWebSocket();

  // Phase transition handler
  const transitionToPhase = useCallback((nextPhase: GamePhase) => {
    setPhaseTransition(true);
    
    // Save progress before transitioning
    saveProgress();
    
    setTimeout(() => {
      setCurrentPhase(nextPhase);
      setPhaseTransition(false);
    }, 500);
  }, [saveProgress]);

  // Meeting phase handlers
  const handleQuestionSelect = useCallback((questionId: string) => {
    const question = meetingState.availableQuestions.find(q => q.id === questionId);
    if (!question) return;
    
    updateMeetingState({
      selectedQuestions: [...meetingState.selectedQuestions, questionId],
      dialogueHistory: [
        ...meetingState.dialogueHistory,
        {
          speaker: 'player',
          text: question.text,
          timestamp: Date.now(),
        },
        {
          speaker: question.speaker.id,
          text: question.response,
          timestamp: Date.now() + 100,
        },
      ],
    });
    
    // Apply question impacts to requirements
    question.impact.forEach(impact => {
      // Apply requirement modifications
    });
  }, [meetingState, updateMeetingState]);

  // Mentor selection handler
  const handleMentorSelect = useCallback((mentorId: string) => {
    updateDesignState({
      selectedMentor: mentorId,
    });
    transitionToPhase('design');
  }, [updateDesignState, transitionToPhase]);

  // Design phase handlers
  const handleNodeAdd = useCallback((component: ComponentData, position: XYPosition) => {
    const newNode: Node = {
      id: `node-${Date.now()}`,
      type: 'system',
      position,
      data: {
        ...component,
        status: 'healthy',
        currentLoad: 0,
      },
    };
    
    updateDesignState({
      nodes: [...designState.nodes, newNode],
    });
  }, [designState.nodes, updateDesignState]);

  // Simulation complete handler
  const handleSimulationComplete = useCallback((results: SimulationResults) => {
    updateSimulationState({
      results,
      score: calculateScore(results),
    });
    transitionToPhase('review');
  }, [updateSimulationState, transitionToPhase]);

  // Auto-save progress
  useEffect(() => {
    const saveInterval = setInterval(() => {
      saveProgress();
    }, 30000); // Save every 30 seconds
    
    return () => clearInterval(saveInterval);
  }, [saveProgress]);

  // Render current phase
  const renderPhase = () => {
    switch (currentPhase) {
      case 'meeting':
        return (
          <MeetingPhaseTemplate
            meetingData={meetingState}
            onQuestionSelect={handleQuestionSelect}
            onProceedToMentorSelection={() => transitionToPhase('mentor-selection')}
          />
        );
        
      case 'mentor-selection':
        return (
          <MentorSelectionTemplate
            availableMentors={levelData.mentors}
            requirements={meetingState.finalRequirements}
            onMentorSelect={handleMentorSelect}
            onSkip={() => transitionToPhase('design')}
          />
        );
        
      case 'design':
        return (
          <DesignPhaseTemplate
            designData={designState}
            onNodeAdd={handleNodeAdd}
            onNodeUpdate={handleNodeUpdate}
            onNodeDelete={handleNodeDelete}
            onEdgeAdd={handleEdgeAdd}
            onEdgeDelete={handleEdgeDelete}
            onSimulationStart={() => transitionToPhase('simulation')}
          />
        );
        
      case 'simulation':
        return (
          <SimulationPhaseTemplate
            nodes={designState.nodes}
            edges={designState.edges}
            requirements={meetingState.finalRequirements}
            trafficPattern={levelData.trafficPattern}
            onComplete={handleSimulationComplete}
          />
        );
        
      case 'review':
        return (
          <ReviewPhaseTemplate
            results={simulationState.results}
            score={simulationState.score}
            requirements={meetingState.finalRequirements}
            mentorFeedback={generateMentorFeedback()}
            onRetry={() => transitionToPhase('design')}
            onNextLevel={() => navigate(`/level/${getNextLevelId()}`)}
            onMainMenu={() => navigate('/')}
          />
        );
        
      default:
        return null;
    }
  };

  return (
    <div className={styles.gamePage}>
      {phaseTransition && (
        <div className={styles.transitionOverlay}>
          <div className={styles.transitionContent}>
            <Loader size="lg" />
            <p>Loading next phase...</p>
          </div>
        </div>
      )}
      
      {renderPhase()}
    </div>
  );
};
State Management:

Central state hub for entire game session
Manages phase transitions
Coordinates between all templates
Handles persistence and multiplayer sync


8. State Management Patterns
8.1 State Hierarchy
typescript// Global State Structure
interface GameState {
  // User & Session
  user: UserState;
  session: SessionState;
  
  // Game Progress
  level: LevelState;
  meeting: MeetingState;
  design: DesignState;
  simulation: SimulationState;
  review: ReviewState;
  
  // UI State
  ui: UIState;
}

// State Flow Diagram
┌─────────────┐
│   GamePage  │ ← Global State Provider
└──────┬──────┘
       │
       ├── MeetingPhaseTemplate
       │   └── MeetingRoom (consumes meeting state)
       │       ├── CharacterPortrait (local hover state)
       │       └── QuestionCard (local preview state)
       │
       ├── DesignPhaseTemplate
       │   └── DesignCanvas (consumes design state)
       │       ├── SystemNode (local drag state)
       │       └── AnimatedEdge (animation state)
       │
       └── SimulationPhaseTemplate
           └── SimulationCanvas (consumes simulation state)
               ├── DataPacket (position state)
               └── MetricsChart (data buffer state)
8.2 State Management Rules
typescript// 1. Atoms: Always stateless
const Button: React.FC<ButtonProps> = (props) => {
  // ❌ Never manage state in atoms
  // const [clicked, setClicked] = useState(false);
  
  // ✅ All behavior via props
  return <button onClick={props.onClick}>{props.children}</button>;
};

// 2. Molecules: UI state only
const ComponentCard: React.FC<ComponentCardProps> = (props) => {
  // ✅ Local UI state is OK
  const [isHovered, setIsHovered] = useState(false);
  
  // ❌ Never manage business logic state
  // const [componentData, setComponentData] = useState();
  
  return <div onMouseEnter={() => setIsHovered(true)}>...</div>;
};

// 3. Organisms: Complex local state + context
const DesignCanvas: React.FC<DesignCanvasProps> = (props) => {
  // ✅ Complex UI state
  const [viewport, setViewport] = useState({ x: 0, y: 0, zoom: 1 });
  
  // ✅ Consume shared state via context
  const { theme } = useTheme();
  
  // ✅ Local state that doesn't need to persist
  const [isDragging, setIsDragging] = useState(false);
  
  return <ReactFlow>...</ReactFlow>;
};

// 4. Templates: State orchestration only
const DesignPhaseTemplate: React.FC<TemplateProps> = (props) => {
  // ✅ Compose organisms and pass state
  // ❌ Never fetch data or manage business logic
  
  return (
    <div>
      <ComponentDrawer {...props.drawerProps} />
      <DesignCanvas {...props.canvasProps} />
    </div>
  );
};

// 5. Pages: Global state and data fetching
const GamePage: React.FC<PageProps> = () => {
  // ✅ Global state management
  const [gameState, dispatch] = useReducer(gameReducer, initialState);
  
  // ✅ Data fetching
  useEffect(() => {
    fetchLevelData(levelId).then(data => {
      dispatch({ type: 'LEVEL_LOADED', payload: data });
    });
  }, [levelId]);
  
  // ✅ State distribution to templates
  return <MeetingPhaseTemplate {...deriveTemplateProps(gameState)} />;
};
8.3 Custom Hooks for State Logic
typescript// useMeetingPhase.ts
export const useMeetingPhase = (levelId: string) => {
  const [state, setState] = useState<MeetingState>(initialMeetingState);
  
  const selectQuestion = useCallback((questionId: string) => {
    setState(prev => ({
      ...prev,
      selectedQuestions: [...prev.selectedQuestions, questionId],
    }));
  }, []);
  
  const applyQuestionImpacts = useCallback((impacts: Impact[]) => {
    setState(prev => {
      const newRequirements = { ...prev.requirements };
      impacts.forEach(impact => {
        // Apply impact logic
      });
      return { ...prev, requirements: newRequirements };
    });
  }, []);
  
  return {
    state,
    actions: {
      selectQuestion,
      applyQuestionImpacts,
    },
  };
};

// useDesignCanvas.ts
export const useDesignCanvas = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  
  const addNode = useCallback((component: ComponentData, position: XYPosition) => {
    const newNode = createNodeFromComponent(component, position);
    setNodes(nodes => [...nodes, newNode]);
  }, [setNodes]);
  
  const updateNodeData = useCallback((nodeId: string, data: Partial<NodeData>) => {
    setNodes(nodes => nodes.map(node => 
      node.id === nodeId 
        ? { ...node, data: { ...node.data, ...data } }
        : node
    ));
  }, [setNodes]);
  
  return {
    nodes,
    edges,
    handlers: {
      onNodesChange,
      onEdgesChange,
      addNode,
      updateNodeData,
    },
  };
};

9. Component Documentation Standards
9.1 Documentation Template
typescript/**
 * ComponentName
 * 
 * Purpose: Brief description of what this component does
 * 
 * State Management:
 * - Local State: What local state this component manages
 * - Props State: What state is passed via props
 * - Context: What context this component consumes
 * 
 * @example
 * ```tsx
 * <ComponentName
 *   prop1="value"
 *   prop2={handler}
 * />
 * ```
 */
9.2 Storybook Documentation
typescript// Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button,
  parameters: {
    docs: {
      description: {
        component: 'Primary interactive element for user actions.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'danger', 'ghost'],
      description: 'Visual style variant',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Button size',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: 'Click me',
  },
};

export const Loading: Story = {
  args: {
    children: 'Saving...',
    loading: true,
  },
};

export const WithIcon: Story = {
  args: {
    children: 'Start Design',
    leftIcon: <PlayIcon />,
  },
};
9.3 Testing Standards
typescript// Button.test.tsx
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
  
  it('shows loading spinner when loading', () => {
    render(<Button loading>Loading...</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
  });
});

This Atomic Design Component Library provides a comprehensive foundation for building System Design Tycoon with clear separation of concerns, predictable state management, and maximum reusability.