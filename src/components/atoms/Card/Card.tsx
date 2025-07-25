import React from 'react';
import { clsx } from 'clsx';
import styles from './Card.module.css';

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
    styles.card,
    {
      [styles['card--interactive']]: interactive,
      [styles['card--selected']]: selected,
      [styles['card--disabled']]: disabled,
    },
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
    <div className={clsx(styles.card__header, className)} {...props}>
      {children}
    </div>
  );
};

export interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardBody: React.FC<CardBodyProps> = ({ className, children, ...props }) => {
  return (
    <div className={clsx(styles.card__body, className)} {...props}>
      {children}
    </div>
  );
};

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardFooter: React.FC<CardFooterProps> = ({ className, children, ...props }) => {
  return (
    <div className={clsx(styles.card__footer, className)} {...props}>
      {children}
    </div>
  );
};