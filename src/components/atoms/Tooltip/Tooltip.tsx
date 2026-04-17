import React from 'react';
import { clsx } from 'clsx';
import styles from './Tooltip.module.css';

export interface TooltipProps {
  /** Text shown in the tooltip bubble */
  content: string;
  /** The element the tooltip is anchored to */
  children: React.ReactNode;
  /** Which side the tooltip appears on */
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

/**
 * Tooltip - CSS-only tooltip atom.
 *
 * Wraps its children and shows a positioned tooltip on hover
 * with a fade-in animation and directional arrow.
 * No JS positioning library required.
 */
export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  className,
}) => {
  return (
    <span className={clsx(styles.wrapper, className)}>
      {children}
      <span className={clsx(styles.tooltip, styles[position])} role="tooltip">
        {content}
      </span>
    </span>
  );
};
