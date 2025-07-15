import React, { useState, useCallback } from 'react';
import { clsx } from 'clsx';
import { Icon } from '../../atoms/Icon';
import { Badge } from '../../atoms/Badge';
import { QuestionCardProps } from './QuestionCard.types';

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
        'question-card',
        `question-card--${question.category}`,
        {
          'question-card--selected': isSelected,
          'question-card--disabled': isDisabled,
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
      <div className="question-card__category-indicator" />
      
      <div className="question-card__content">
        <p className="question-card__text">{question.text}</p>
        <div className="question-card__speaker">
          <Icon name="user" size="xs" />
          <span>{question.speaker.name}</span>
        </div>
      </div>

      <div className="question-card__impact-icons">
        {question.impact.map((impact) => (
          <div 
            key={impact.type}
            className="question-card__impact-icon"
            title={impact.description}
          >
            <Icon name={impact.icon as any} size="xs" />
          </div>
        ))}
      </div>

      {showImpactPreview && !isDisabled && (
        <div className="question-card__impact-preview">
          <h4>This question will:</h4>
          <ul>
            {question.impact.map((impact) => (
              <li key={impact.type}>{impact.description}</li>
            ))}
          </ul>
        </div>
      )}

      {isSelected && (
        <div className="question-card__selected-badge">
          <Icon name="check" size="sm" />
        </div>
      )}
    </div>
  );
};