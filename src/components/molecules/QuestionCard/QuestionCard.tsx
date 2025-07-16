import React, { useState, useCallback } from 'react';
import { clsx } from 'clsx';
import { Icon } from '../../atoms/Icon';
import { Badge } from '../../atoms/Badge';
import type { QuestionCardProps } from './index';
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
      technical: 'info',
    };
    return colors[question.category] || 'default';
  };

  return (
    <div
      className={clsx(
        styles.card,
        styles[`card--${question.category}`],
        {
          [styles['card--selected']]: isSelected,
          [styles['card--disabled']]: isDisabled,
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
            <Icon name={impact.icon as any} size="xs" />
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