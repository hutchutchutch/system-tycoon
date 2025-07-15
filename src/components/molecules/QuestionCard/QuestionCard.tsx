import React from 'react';
import { clsx } from 'clsx';

export interface Question {
  id: string;
  text: string;
  category: 'product' | 'business' | 'marketing' | 'technical';
  impact: {
    requirements?: number;
    budget?: number;
    timeline?: number;
  };
}

export interface QuestionCardProps {
  question: Question;
  selected?: boolean;
  disabled?: boolean;
  onSelect?: (question: Question) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  selected = false,
  disabled = false,
  onSelect,
}) => {
  const handleClick = () => {
    if (!disabled && onSelect) {
      onSelect(question);
    }
  };

  const classes = clsx(
    'question-card',
    `question-card--${question.category}`,
    selected && 'question-card--selected',
    disabled && 'question-card--disabled'
  );

  const impactIcons = [];
  if (question.impact.requirements) {
    impactIcons.push(
      <div key="req" className="question-card__impact-icon" title="Adds requirements">
        📋
      </div>
    );
  }
  if (question.impact.budget) {
    impactIcons.push(
      <div key="budget" className="question-card__impact-icon" title="Affects budget">
        💰
      </div>
    );
  }
  if (question.impact.timeline) {
    impactIcons.push(
      <div key="time" className="question-card__impact-icon" title="Affects timeline">
        ⏱️
      </div>
    );
  }

  return (
    <div className={classes} onClick={handleClick}>
      <div className="question-card__category-indicator" />
      
      {impactIcons.length > 0 && (
        <div className="question-card__impact-icons">
          {impactIcons}
        </div>
      )}

      <p className="text-base">{question.text}</p>
    </div>
  );
};