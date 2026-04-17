import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
} from '../../ui/dialog';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cn } from '../../../lib/utils';
import styles from './Modal.module.css';

export interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
  className?: string;
}

const sizeClasses: Record<string, string> = {
  small: styles['modal--small'],
  medium: styles['modal--medium'],
  large: styles['modal--large'],
  fullscreen: styles['modal--fullscreen'],
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  size = 'medium',
  closeOnOverlayClick = true,
  showCloseButton = true,
  className = '',
}) => {
  const handleOpenChange = (open: boolean) => {
    if (!open && onClose) {
      onClose();
    }
  };

  const handlePointerDownOutside = (e: Event) => {
    if (!closeOnOverlayClick) {
      e.preventDefault();
    }
  };

  const handleEscapeKeyDown = (e: Event) => {
    if (!onClose) {
      e.preventDefault();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
          className={cn(
            'fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%] shadow-lg duration-200',
            'border rounded-lg',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            'data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]',
            'data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]',
            sizeClasses[size],
            className,
          )}
          style={{
            backgroundColor: 'var(--color-surface-primary, #1a1a1a)',
            borderColor: 'var(--color-border-subtle, #333)',
            color: 'var(--color-text-primary)',
            maxHeight: size === 'fullscreen' ? '100vh' : '90vh',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
          }}
          onPointerDownOutside={handlePointerDownOutside}
          onEscapeKeyDown={handleEscapeKeyDown}
        >
          {showCloseButton && onClose && (
            <DialogPrimitive.Close
              className={styles.closeButton}
              aria-label="Close modal"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M15 5L5 15M5 5L15 15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </DialogPrimitive.Close>
          )}
          {/* Hidden title for accessibility when no visible title is provided */}
          <DialogPrimitive.Title className="sr-only">
            Dialog
          </DialogPrimitive.Title>
          {children}
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
};
