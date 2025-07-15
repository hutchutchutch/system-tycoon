# System Tycoon - Tech Consultant Simulator Design System

## 1. Introduction
This document provides comprehensive documentation for all components in System Tycoon - Tech Consultant Simulator, organized according to the Atomic Design methodology. The simulator creates a realistic browser-based experience where players navigate the journey from financial desperation to successful tech consulting through authentic digital tools.

### Design Principles
- **Realism**: Components mimic real browser interfaces and professional software tools
- **Emotional Journey**: UI reflects the transition from desperation to success through visual states
- **Professional Authenticity**: Interface matches actual business and engineering software
- **Composability**: Components combine to create complex browser-based workflows
- **Accessibility**: All components meet WCAG 2.1 AA standards for professional software
- **Performance**: Optimized for 60fps animations in browser simulations

## 2. Component Architecture

### File Structure
```
src/
├── components/
│   ├── atoms/
│   │   ├── Button/
│   │   ├── BrowserTab/
│   │   ├── EmailStatus/
│   │   ├── NotificationDot/
│   │   ├── Icon/
│   │   ├── Badge/
│   │   └── Input/
│   ├── molecules/
│   │   ├── EmailCard/
│   │   ├── ContactAvatar/
│   │   ├── ClientCard/
│   │   ├── BrowserHeader/
│   │   ├── CallParticipant/
│   │   ├── FinancialMetricCard/
│   │   └── BrowserAddressBar/
│   ├── organisms/
│   │   ├── EmailClient/
│   │   ├── VideoCallWindow/
│   │   ├── BrowserWindow/
│   │   ├── ClientDashboard/
│   │   ├── SystemDesignToolbox/
│   │   └── FinancialStatusWidget/
│   ├── templates/
│   │   ├── EmailInterfaceTemplate/
│   │   ├── CallInterfaceTemplate/
│   │   ├── DashboardTemplate/
│   │   └── SystemDesignTemplate/
│   └── pages/
│       ├── ConsultantSimulatorPage/
│       ├── DashboardPage/
│       ├── EmailPage/
│       └── CallPage/
```

### State Management Hierarchy
```typescript
// State flows from Pages → Templates → Organisms → Molecules → Atoms
// Atoms: Stateless (props only)
// Molecules: Minimal local state (UI state only)  
// Organisms: Complex local state + context consumption
// Templates: Browser interface orchestration
// Pages: Business logic + data fetching + financial state
```

## 3. Atoms

### 3.1 BrowserTab
**Purpose:** Realistic browser tab interface for application navigation.

```typescript
// BrowserTab.types.ts
export interface BrowserTabProps {
  title: string;
  url: string;
  active: boolean;
  favicon?: string;
  loading?: boolean;
  hasNotification?: boolean;
  onClose?: () => void;
  onClick?: () => void;
  className?: string;
}

// BrowserTab.tsx
import React from 'react';
import { clsx } from 'clsx';
import { X, Globe } from 'lucide-react';
import { NotificationDot } from '../NotificationDot';
import { BrowserTabProps } from './BrowserTab.types';

export const BrowserTab: React.FC<BrowserTabProps> = ({
  title,
  url,
  active,
  favicon,
  loading = false,
  hasNotification = false,
  onClose,
  onClick,
  className,
}) => {
  return (
    <div
      className={clsx(
        'browser-tab',
        {
          'browser-tab--active': active,
          'browser-tab--loading': loading,
        },
        className
      )}
      onClick={onClick}
      role="tab"
      aria-selected={active}
      tabIndex={active ? 0 : -1}
    >
      <div className="browser-tab__content">
        <div className="browser-tab__icon">
          {favicon ? (
            <img src={favicon} alt="" className="browser-tab__favicon" />
          ) : (
            <Globe size={12} />
          )}
          {loading && <div className="browser-tab__spinner" />}
        </div>
        
        <span className="browser-tab__title" title={title}>
          {title}
        </span>
        
        {hasNotification && (
          <NotificationDot variant="system" size="sm" />
        )}
      </div>
      
      {onClose && (
        <button
          className="browser-tab__close"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          aria-label={`Close ${title} tab`}
        >
          <X size={12} />
        </button>
      )}
    </div>
  );
};
```

**State Management:** Stateless - tab state managed by parent BrowserWindow.

### 3.2 EmailStatus
**Purpose:** Visual indicators for email read/unread states and priority levels.

```typescript
// EmailStatus.types.ts
export interface EmailStatusProps {
  status: 'read' | 'unread' | 'replied' | 'forwarded' | 'urgent';
  size?: 'sm' | 'md';
  showIcon?: boolean;
  className?: string;
}

// EmailStatus.tsx
import React from 'react';
import { clsx } from 'clsx';
import { Mail, MailOpen, Reply, Forward, AlertTriangle } from 'lucide-react';
import { EmailStatusProps } from './EmailStatus.types';

const statusIcons = {
  read: MailOpen,
  unread: Mail,
  replied: Reply,
  forwarded: Forward,
  urgent: AlertTriangle,
};

export const EmailStatus: React.FC<EmailStatusProps> = ({
  status,
  size = 'md',
  showIcon = true,
  className,
}) => {
  const IconComponent = statusIcons[status];
  
  return (
    <div
      className={clsx(
        'email-status',
        `email-status--${status}`,
        `email-status--${size}`,
        className
      )}
    >
      {showIcon && (
        <IconComponent 
          className="email-status__icon"
          size={size === 'sm' ? 12 : 16}
          aria-label={`Email ${status}`}
        />
      )}
      <span className="email-status__dot" aria-hidden="true" />
    </div>
  );
};
```

**State Management:** Stateless - status determined by email data.

### 3.3 NotificationDot
**Purpose:** System notifications for emails, calls, and financial alerts.

```typescript
// NotificationDot.types.ts
export interface NotificationDotProps {
  count?: number;
  variant: 'email' | 'call' | 'financial' | 'system';
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
  className?: string;
}

// NotificationDot.tsx
import React from 'react';
import { clsx } from 'clsx';
import { NotificationDotProps } from './NotificationDot.types';

export const NotificationDot: React.FC<NotificationDotProps> = ({
  count,
  variant,
  size = 'md',
  pulse = false,
  className,
}) => {
  const showCount = count && count > 0;
  const displayCount = count && count > 99 ? '99+' : count?.toString();
  
  return (
    <div
      className={clsx(
        'notification-dot',
        `notification-dot--${variant}`,
        `notification-dot--${size}`,
        {
          'notification-dot--pulse': pulse,
          'notification-dot--with-count': showCount,
        },
        className
      )}
      role="status"
      aria-label={showCount ? `${count} notifications` : 'Notification'}
    >
      {showCount && (
        <span className="notification-dot__count" aria-hidden="true">
          {displayCount}
        </span>
      )}
    </div>
  );
};
```

**State Management:** Stateless - count and state from notification context.

## 4. Molecules

### 4.1 EmailCard
**Purpose:** Individual email items in inbox with realistic email client styling.

```typescript
// EmailCard.types.ts
export interface EmailData {
  id: string;
  from: {
    name: string;
    email: string;
    avatar?: string;
  };
  subject: string;
  preview: string;
  timestamp: Date;
  status: 'read' | 'unread' | 'replied' | 'forwarded';
  priority: 'high' | 'normal' | 'low';
  hasAttachment?: boolean;
  labels?: string[];
}

export interface EmailCardProps {
  email: EmailData;
  selected?: boolean;
  compact?: boolean;
  onClick?: () => void;
  onToggleSelect?: () => void;
  className?: string;
}

// EmailCard.tsx
import React, { useCallback } from 'react';
import { clsx } from 'clsx';
import { formatDistanceToNow } from 'date-fns';
import { Paperclip } from 'lucide-react';
import { ContactAvatar } from '../ContactAvatar';
import { EmailStatus } from '../../atoms/EmailStatus';
import { Badge } from '../../atoms/Badge';
import { EmailCardProps } from './EmailCard.types';

export const EmailCard: React.FC<EmailCardProps> = ({
  email,
  selected = false,
  compact = false,
  onClick,
  onToggleSelect,
  className,
}) => {
  const handleClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget || !e.target.closest('.email-card__checkbox')) {
      onClick?.();
    }
  }, [onClick]);

  const handleCheckboxChange = useCallback((e: React.ChangeEvent) => {
    e.stopPropagation();
    onToggleSelect?.();
  }, [onToggleSelect]);

  return (
    <div
      className={clsx(
        'email-card',
        {
          'email-card--selected': selected,
          'email-card--unread': email.status === 'unread',
          'email-card--compact': compact,
          'email-card--high-priority': email.priority === 'high',
        },
        className
      )}
      onClick={handleClick}
      role="button"
      tabIndex={0}
    >
      <div className="email-card__checkbox">
        <input
          type="checkbox"
          checked={selected}
          onChange={handleCheckboxChange}
          aria-label={`Select email from ${email.from.name}`}
        />
      </div>

      <EmailStatus status={email.status} size="sm" />

      <ContactAvatar
        contact={email.from}
        size="sm"
        className="email-card__avatar"
      />

      <div className="email-card__content">
        <div className="email-card__header">
          <span className="email-card__sender">
            {email.from.name}
          </span>
          <span className="email-card__timestamp">
            {formatDistanceToNow(email.timestamp, { addSuffix: true })}
          </span>
        </div>

        <div className="email-card__subject">
          {email.subject}
          {email.hasAttachment && (
            <Paperclip size={12} className="email-card__attachment-icon" />
          )}
        </div>

        {!compact && (
          <div className="email-card__preview">
            {email.preview}
          </div>
        )}

        {email.labels && email.labels.length > 0 && (
          <div className="email-card__labels">
            {email.labels.map(label => (
              <Badge key={label} variant="secondary" size="sm">
                {label}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
```

**State Management:**
- Selection state managed by parent
- Local click handling for UX

### 4.2 FinancialMetricCard
**Purpose:** Display financial metrics with emotional context for desperation-to-success arc.

```typescript
// FinancialMetricCard.types.ts
export interface FinancialMetric {
  label: 'Bank Balance' | 'Monthly Revenue' | 'Expenses' | 'Profit' | 'Cash Flow';
  value: number;
  currency: string;
  trend?: 'up' | 'down' | 'stable';
  trendPercent?: number;
  projectedValue?: number;
  status: 'critical' | 'warning' | 'healthy' | 'excellent';
}

export interface FinancialMetricCardProps {
  metric: FinancialMetric;
  showProjection?: boolean;
  onHover?: (metric: FinancialMetric) => void;
  className?: string;
}

// FinancialMetricCard.tsx
import React, { useState } from 'react';
import { clsx } from 'clsx';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';
import { FinancialMetricCardProps } from './FinancialMetricCard.types';

export const FinancialMetricCard: React.FC<FinancialMetricCardProps> = ({
  metric,
  showProjection = false,
  onHover,
  className,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const formatCurrency = (value: number) => {
    const abs = Math.abs(value);
    const sign = value < 0 ? '-' : '';
    return `${sign}${metric.currency}${abs.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const getStatusIcon = () => {
    switch (metric.status) {
      case 'critical':
        return <AlertTriangle className="financial-metric__status-icon--critical" />;
      case 'warning':
        return <AlertTriangle className="financial-metric__status-icon--warning" />;
      case 'excellent':
        return <CheckCircle className="financial-metric__status-icon--excellent" />;
      default:
        return null;
    }
  };

  const getTrendIcon = () => {
    if (!metric.trend) return null;
    return metric.trend === 'up' ? <TrendingUp /> : <TrendingDown />;
  };

  return (
    <div
      className={clsx(
        'financial-metric-card',
        `financial-metric-card--${metric.status}`,
        className
      )}
      onMouseEnter={() => {
        setIsHovered(true);
        onHover?.(metric);
      }}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="financial-metric-card__header">
        <span className="financial-metric-card__label">{metric.label}</span>
        {getStatusIcon()}
      </div>

      <div className="financial-metric-card__value">
        <span className={clsx(
          'financial-metric-card__amount',
          {
            'financial-metric-card__amount--negative': metric.value < 0,
            'financial-metric-card__amount--positive': metric.value > 0,
          }
        )}>
          {formatCurrency(metric.value)}
        </span>

        {metric.trend && metric.trendPercent && (
          <div className={clsx(
            'financial-metric-card__trend',
            `financial-metric-card__trend--${metric.trend}`
          )}>
            {getTrendIcon()}
            <span>{Math.abs(metric.trendPercent)}%</span>
          </div>
        )}
      </div>

      {showProjection && metric.projectedValue && isHovered && (
        <div className="financial-metric-card__projection">
          <span className="financial-metric-card__projection-label">
            Projected:
          </span>
          <span className="financial-metric-card__projection-value">
            {formatCurrency(metric.projectedValue)}
          </span>
        </div>
      )}
    </div>
  );
};
```

**State Management:**
- Local hover state for projections
- Financial data from parent context

### 4.3 CallParticipant
**Purpose:** Video call participant representation for client meetings.

```typescript
// CallParticipant.types.ts
export interface CallParticipantData {
  id: string;
  name: string;
  title?: string;
  avatar: string;
  isMuted: boolean;
  isVideoOn: boolean;
  isCurrentUser?: boolean;
  connectionQuality: 'excellent' | 'good' | 'poor';
  isSpeaking?: boolean;
}

export interface CallParticipantProps {
  participant: CallParticipantData;
  size: 'sm' | 'md' | 'lg';
  showControls?: boolean;
  onToggleMute?: () => void;
  onToggleVideo?: () => void;
  className?: string;
}

// CallParticipant.tsx
import React from 'react';
import { clsx } from 'clsx';
import { Mic, MicOff, Video, VideoOff, Wifi } from 'lucide-react';
import { CallParticipantProps } from './CallParticipant.types';

export const CallParticipant: React.FC<CallParticipantProps> = ({
  participant,
  size,
  showControls = false,
  onToggleMute,
  onToggleVideo,
  className,
}) => {
  const getConnectionIcon = () => {
    const iconProps = {
      size: size === 'sm' ? 12 : 16,
      className: `call-participant__connection--${participant.connectionQuality}`,
    };
    return <Wifi {...iconProps} />;
  };

  return (
    <div
      className={clsx(
        'call-participant',
        `call-participant--${size}`,
        {
          'call-participant--current-user': participant.isCurrentUser,
          'call-participant--speaking': participant.isSpeaking,
          'call-participant--video-off': !participant.isVideoOn,
        },
        className
      )}
    >
      <div className="call-participant__video">
        {participant.isVideoOn ? (
          <div className="call-participant__video-feed">
            {/* Video feed would go here */}
            <div className="call-participant__video-placeholder" />
          </div>
        ) : (
          <div className="call-participant__avatar">
            <img src={participant.avatar} alt={participant.name} />
          </div>
        )}

        <div className="call-participant__overlay">
          <div className="call-participant__status">
            {!participant.isMuted ? (
              <Mic className="call-participant__mic--on" size={16} />
            ) : (
              <MicOff className="call-participant__mic--off" size={16} />
            )}
            {getConnectionIcon()}
          </div>

          <div className="call-participant__info">
            <span className="call-participant__name">{participant.name}</span>
            {participant.title && (
              <span className="call-participant__title">{participant.title}</span>
            )}
          </div>
        </div>
      </div>

      {showControls && participant.isCurrentUser && (
        <div className="call-participant__controls">
          <button
            onClick={onToggleMute}
            className={clsx(
              'call-participant__control',
              { 'call-participant__control--active': !participant.isMuted }
            )}
            aria-label={participant.isMuted ? 'Unmute' : 'Mute'}
          >
            {participant.isMuted ? <MicOff size={16} /> : <Mic size={16} />}
          </button>
          
          <button
            onClick={onToggleVideo}
            className={clsx(
              'call-participant__control',
              { 'call-participant__control--active': participant.isVideoOn }
            )}
            aria-label={participant.isVideoOn ? 'Turn off video' : 'Turn on video'}
          >
            {participant.isVideoOn ? <Video size={16} /> : <VideoOff size={16} />}
          </button>
        </div>
      )}
    </div>
  );
};
```

**State Management:**
- Participant state managed by call context
- Local control interactions

## 5. Organisms

### 5.1 EmailClient
**Purpose:** Complete email interface mimicking professional email clients.

```typescript
// EmailClient.types.ts
export interface EmailFolder {
  id: string;
  name: string;
  count: number;
  icon: string;
}

export interface EmailClientProps {
  emails: EmailData[];
  folders: EmailFolder[];
  selectedEmails: string[];
  selectedFolder: string;
  searchQuery: string;
  onEmailSelect: (emailId: string) => void;
  onEmailToggleSelect: (emailId: string) => void;
  onFolderSelect: (folderId: string) => void;
  onSearchChange: (query: string) => void;
  onEmailCompose: () => void;
  onEmailReply: (emailId: string) => void;
  className?: string;
}

// EmailClient.tsx
import React, { useMemo, useState } from 'react';
import { clsx } from 'clsx';
import { Search, Plus, Archive, Trash, Reply } from 'lucide-react';
import { Button } from '../../atoms/Button';
import { Input } from '../../atoms/Input';
import { EmailCard } from '../../molecules/EmailCard';
import { EmailClientProps } from './EmailClient.types';

export const EmailClient: React.FC<EmailClientProps> = ({
  emails,
  folders,
  selectedEmails,
  selectedFolder,
  searchQuery,
  onEmailSelect,
  onEmailToggleSelect,
  onFolderSelect,
  onSearchChange,
  onEmailCompose,
  onEmailReply,
  className,
}) => {
  const [viewMode, setViewMode] = useState<'comfortable' | 'compact'>('comfortable');

  // Filter emails based on folder and search
  const filteredEmails = useMemo(() => {
    let filtered = emails;

    // Filter by folder (simplified - in real app would have proper folder logic)
    if (selectedFolder !== 'inbox') {
      // Apply folder filtering logic
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(email =>
        email.from.name.toLowerCase().includes(query) ||
        email.subject.toLowerCase().includes(query) ||
        email.preview.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [emails, selectedFolder, searchQuery]);

  return (
    <div className={clsx('email-client', className)}>
      <div className="email-client__sidebar">
        <div className="email-client__compose">
          <Button
            variant="primary"
            fullWidth
            leftIcon={<Plus size={16} />}
            onClick={onEmailCompose}
          >
            Compose
          </Button>
        </div>

        <nav className="email-client__folders">
          {folders.map(folder => (
            <button
              key={folder.id}
              className={clsx(
                'email-client__folder',
                { 'email-client__folder--active': selectedFolder === folder.id }
              )}
              onClick={() => onFolderSelect(folder.id)}
            >
              <Icon name={folder.icon} size="sm" />
              <span className="email-client__folder-name">{folder.name}</span>
              {folder.count > 0 && (
                <span className="email-client__folder-count">{folder.count}</span>
              )}
            </button>
          ))}
        </nav>
      </div>

      <div className="email-client__main">
        <div className="email-client__toolbar">
          <div className="email-client__search">
            <Input
              type="search"
              value={searchQuery}
              onChange={onSearchChange}
              placeholder="Search emails..."
              leftIcon={<Search size={16} />}
            />
          </div>

          <div className="email-client__actions">
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<Archive size={16} />}
              disabled={selectedEmails.length === 0}
            >
              Archive
            </Button>
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<Trash size={16} />}
              disabled={selectedEmails.length === 0}
            >
              Delete
            </Button>
          </div>

          <div className="email-client__view-controls">
            <button
              className={clsx('email-client__view-toggle', {
                'email-client__view-toggle--active': viewMode === 'comfortable'
              })}
              onClick={() => setViewMode('comfortable')}
            >
              Comfortable
            </button>
            <button
              className={clsx('email-client__view-toggle', {
                'email-client__view-toggle--active': viewMode === 'compact'
              })}
              onClick={() => setViewMode('compact')}
            >
              Compact
            </button>
          </div>
        </div>

        <div className="email-client__list">
          {filteredEmails.length === 0 ? (
            <div className="email-client__empty">
              <p>No emails found</p>
            </div>
          ) : (
            filteredEmails.map(email => (
              <EmailCard
                key={email.id}
                email={email}
                selected={selectedEmails.includes(email.id)}
                compact={viewMode === 'compact'}
                onClick={() => onEmailSelect(email.id)}
                onToggleSelect={() => onEmailToggleSelect(email.id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};
```

**State Management:**
- Email data from parent
- Local view mode state
- Search and selection state lifted to parent

### 5.2 BrowserWindow
**Purpose:** Main browser chrome containing all application interfaces.

```typescript
// BrowserWindow.types.ts
export interface BrowserWindowProps {
  activeTab: string;
  tabs: Array<{
    id: string;
    title: string;
    url: string;
    component: React.ComponentType;
    hasNotification?: boolean;
  }>;
  onTabChange: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
  onNewTab?: () => void;
  className?: string;
  children?: React.ReactNode;
}

// BrowserWindow.tsx
import React, { useMemo } from 'react';
import { clsx } from 'clsx';
import { Plus, ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import { BrowserTab } from '../../atoms/BrowserTab';
import { Button } from '../../atoms/Button';
import { BrowserAddressBar } from '../../molecules/BrowserAddressBar';
import { BrowserWindowProps } from './BrowserWindow.types';

export const BrowserWindow: React.FC<BrowserWindowProps> = ({
  activeTab,
  tabs,
  onTabChange,
  onTabClose,
  onNewTab,
  className,
  children,
}) => {
  const activeTabData = useMemo(() => 
    tabs.find(tab => tab.id === activeTab),
    [tabs, activeTab]
  );

  const ActiveComponent = activeTabData?.component;

  return (
    <div className={clsx('browser-window', className)}>
      <div className="browser-window__chrome">
        <div className="browser-window__tab-bar">
          <div className="browser-window__tabs">
            {tabs.map(tab => (
              <BrowserTab
                key={tab.id}
                title={tab.title}
                url={tab.url}
                active={tab.id === activeTab}
                hasNotification={tab.hasNotification}
                onClick={() => onTabChange(tab.id)}
                onClose={tabs.length > 1 ? () => onTabClose(tab.id) : undefined}
              />
            ))}
            
            {onNewTab && (
              <button
                className="browser-window__new-tab"
                onClick={onNewTab}
                aria-label="New tab"
              >
                <Plus size={14} />
              </button>
            )}
          </div>
        </div>

        <div className="browser-window__controls">
          <div className="browser-window__navigation">
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<ArrowLeft size={16} />}
              disabled
              aria-label="Go back"
            />
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<ArrowRight size={16} />}
              disabled
              aria-label="Go forward"
            />
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<RotateCcw size={16} />}
              aria-label="Refresh"
            />
          </div>

          {activeTabData && (
            <BrowserAddressBar
              url={activeTabData.url}
              isSecure={activeTabData.url.startsWith('https://')}
            />
          )}
        </div>
      </div>

      <div className="browser-window__content">
        {ActiveComponent ? <ActiveComponent /> : children}
      </div>
    </div>
  );
};
```

**State Management:**
- Tab state managed by parent
- Renders active component dynamically

## 6. Updated State Management for Browser Context

### 6.1 Global State Structure
```typescript
interface ConsultantSimulatorState {
  // Browser simulation
  browser: {
    activeTab: 'email' | 'call' | 'design' | 'dashboard';
    tabs: BrowserTab[];
    notifications: Notification[];
    history: string[];
  };
  
  // Consultant business
  consultant: {
    profile: {
      name: string;
      email: string;
      phone: string;
      skills: Skill[];
      certifications: Certification[];
      portfolio: Project[];
    };
    reputation: {
      score: number;
      reviews: Review[];
      referrals: number;
    };
    availability: {
      hoursPerWeek: number;
      hourlyRate: number;
      nextAvailable: Date;
    };
  };
  
  // Financial tracking (desperation to success)
  finances: {
    bankBalance: number;
    monthlyRevenue: number;
    monthlyExpenses: number;
    outstandingInvoices: Invoice[];
    upcomingBills: Bill[];
    creditScore: number;
    emergencyFund: number;
    growthMetrics: {
      revenueGrowth: number;
      clientRetention: number;
      profitMargin: number;
    };
  };
  
  // Client relationships
  clients: {
    active: Client[];
    prospects: Client[];
    pastClients: Client[];
    referralSources: ReferralSource[];
  };
  
  // Email system
  email: {
    inbox: Email[];
    sent: Email[];
    drafts: Email[];
    folders: EmailFolder[];
    selectedEmails: string[];
    searchQuery: string;
  };
  
  // Call/meeting system
  calls: {
    activeCall: Call | null;
    scheduledCalls: Call[];
    callHistory: Call[];
    participants: CallParticipant[];
  };
  
  // System design projects
  projects: {
    active: SystemDesignProject[];
    templates: ComponentTemplate[];
    tools: DesignTool[];
  };
}
```

### 6.2 Emotional State Tracking
```typescript
interface EmotionalState {
  currentMood: 'desperate' | 'hopeful' | 'confident' | 'successful';
  stressLevel: number; // 0-100
  motivationLevel: number; // 0-100
  burnoutRisk: number; // 0-100
  
  // Visual feedback
  interfaceTheme: 'desperate' | 'neutral' | 'optimistic' | 'successful';
  notifications: {
    financialAlerts: boolean;
    motivationalMessages: boolean;
    celebrationMode: boolean;
  };
}
```

This updated design system transforms the game-focused components into realistic browser-based professional tools while maintaining the atomic design principles and emotional journey from financial desperation to business success.