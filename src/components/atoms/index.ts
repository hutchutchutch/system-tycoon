// Atoms - Stateless building blocks

// Base UI components (keep existing)
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

export { Avatar } from './Avatar';
export type { AvatarProps } from './Avatar';

export { Logo } from './Logo';
export type { LogoProps } from './Logo';

// New browser-focused atoms
export { BrowserTab } from './BrowserTab';
export type { BrowserTabProps } from './BrowserTab';

export { EmailStatus } from './EmailStatus';
export type { EmailStatusProps, EmailStatusType } from './EmailStatus';

export { NotificationDot } from './NotificationDot';
export type { NotificationDotProps, NotificationVariant } from './NotificationDot';

export { EmailSearchBar } from './EmailSearchBar';

// Modal and notification components
export { Modal } from './Modal';
export type { ModalProps } from './Modal';

export { Toast } from './Toast';
export type { ToastProps } from './Toast';

// Field components
export { Label, FormDescription, FieldError, FieldGroup } from './Field';
export type { LabelProps, FormDescriptionProps, FieldErrorProps, FieldGroupProps } from './Field';

// Tag components
export { TagGroup, TagList, Tag } from './TagGroup';
export type { TagGroupProps, TagListProps, TagProps } from './TagGroup';

// React Flow handles (for system design) (TODO: Implement)
// export { Handle } from './Handle';
// export type { HandleProps } from './Handle';