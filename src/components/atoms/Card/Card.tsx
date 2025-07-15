import React from 'react';
import { clsx } from 'clsx';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
  selected?: boolean;
  disabled?: boolean;
}

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