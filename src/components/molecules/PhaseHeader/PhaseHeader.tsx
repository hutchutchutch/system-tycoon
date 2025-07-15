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