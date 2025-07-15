import React from 'react';
import { clsx } from 'clsx';
import { Badge } from '../ui/Badge';

export interface Mentor {
  id: string;
  name: string;
  title: string;
  avatar: string;
  specializations: string[];
  advicePreview: string;
  levelRange: string;
  isRecommended?: boolean;
  isLocked?: boolean;
}

export interface MentorCardProps {
  mentor: Mentor;
  selected?: boolean;
  onSelect?: (mentor: Mentor) => void;
}

export const MentorCard: React.FC<MentorCardProps> = ({
  mentor,
  selected = false,
  onSelect,
}) => {
  const handleClick = () => {
    if (!mentor.isLocked && onSelect) {
      onSelect(mentor);
    }
  };

  const classes = clsx(
    'mentor-card',
    mentor.isRecommended && 'mentor-card--recommended',
    mentor.isLocked && 'mentor-card--locked',
    selected && 'mentor-card--selected'
  );

  return (
    <div className={classes} onClick={handleClick}>
      <div className="mentor-card__header">
        <img
          src={mentor.avatar}
          alt={mentor.name}
          className="mentor-card__avatar"
        />
        <div>
          <h3 className="text-lg font-semibold">{mentor.name}</h3>
          <p className="text-sm text-gray-600">{mentor.title}</p>
          <p className="text-xs text-gray-500 mt-1">Best for: {mentor.levelRange}</p>
        </div>
      </div>

      <div className="mentor-card__specialization">
        {mentor.specializations.map((spec) => (
          <span key={spec} className="mentor-card__specialization-tag">
            {spec}
          </span>
        ))}
      </div>

      <div className="mentor-card__advice-preview">
        "{mentor.advicePreview}"
      </div>

      {mentor.isLocked && (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </div>
  );
};