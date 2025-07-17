import React from 'react';
import { clsx } from 'clsx';
import { Icon } from '../../atoms/Icon';
import type { BentoGridProps, BentoCardProps } from './BentoGrid.types';
import styles from './BentoGrid.module.css';

export const BentoGrid: React.FC<BentoGridProps> = ({ children, className }) => {
  return (
    <div className={clsx(styles['bento-grid'], className)}>
      {children}
    </div>
  );
};

export const BentoCard: React.FC<BentoCardProps> = ({
  name,
  className,
  background,
  icon,
  description,
  href,
  cta = "Learn more",
  onClick,
  priority = 'normal',
  category,
  time,
  size = 'md'
}) => {
  const cardClasses = clsx(
    styles['bento-card'],
    styles[`bento-card--${size}`],
    priority && styles[`bento-card--${priority}`],
    className
  );

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (href) {
      window.open(href, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className={cardClasses} onClick={handleClick}>
      {background && (
        <div className={styles['bento-card__background']}>
          {background}
        </div>
      )}
      
      <div className={styles['bento-card__content']}>
        <div className={styles['bento-card__header']}>
          {category && (
            <div className={styles['bento-card__category']}>
              {category}
            </div>
          )}
          
          <div className={styles['bento-card__meta']}>
            {time && (
              <div className={styles['bento-card__time']}>
                <Icon name="clock" size="xs" />
                {time}
              </div>
            )}
          </div>
        </div>

        <div className={styles['bento-card__body']}>
          <Icon name={icon} className={styles['bento-card__icon']} />
          <h3 className={styles['bento-card__title']}>{name}</h3>
          <p className={styles['bento-card__description']}>{description}</p>
        </div>

        <div className={styles['bento-card__footer']}>
          <div className={styles['bento-card__cta']}>
            {cta}
            <Icon name="external-link" size="xs" />
          </div>
        </div>
      </div>
    </div>
  );
}; 