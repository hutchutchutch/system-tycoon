import React from 'react';
import { clsx } from 'clsx';

export interface Mentor {
  id: string;
  name: string;
  title: string;
  tags: string[];
  tagline: string;
  quote: string;
  signature: {
    legacy: string;
    knownFor: string;
  };
  personality: {
    style: string;
    traits: string;
  };
  specialty: {
    tools: string[];
    domains: string[];
  };
  lore: string;
  created_at?: string;
  updated_at?: string;
}

export interface MentorCardProps {
  mentor: Mentor;
  selected?: boolean;
  onSelect?: (mentor: Mentor) => void;
  disabled?: boolean;
}

export const MentorCard: React.FC<MentorCardProps> = ({
  mentor,
  selected = false,
  onSelect,
  disabled = false,
}) => {
  const handleClick = () => {
    if (!disabled && onSelect) {
      onSelect(mentor);
    }
  };

  const classes = clsx(
    'mentor-card',
    selected && 'mentor-card--selected',
    disabled && 'mentor-card--disabled'
  );

  return (
    <div className={classes} onClick={handleClick}>
      <div className="mentor-card__header">
        <div className="mentor-card__avatar">
          <span className="text-2xl font-bold">
            {mentor.name.split(' ').map(n => n[0]).join('')}
          </span>
        </div>
        <div className="mentor-card__info">
          <h3 className="mentor-card__name">{mentor.name}</h3>
          <p className="mentor-card__title">{mentor.title}</p>
          <p className="mentor-card__tagline">{mentor.tagline}</p>
        </div>
      </div>

      <div className="mentor-card__tags">
        {mentor.tags.map((tag) => (
          <span key={tag} className="mentor-card__tag">
            {tag}
          </span>
        ))}
      </div>

      <div className="mentor-card__quote">
        <em>"{mentor.quote}"</em>
      </div>

      <div className="mentor-card__specialty">
        <h4 className="mentor-card__specialty-title">Specializes in:</h4>
        <div className="mentor-card__domains">
          {mentor.specialty.domains.slice(0, 3).map((domain) => (
            <span key={domain} className="mentor-card__domain">
              {domain}
            </span>
          ))}
        </div>
      </div>

      <div className="mentor-card__tools">
        <strong>Key Tools:</strong>
        <span className="mentor-card__tools-list">
          {mentor.specialty.tools.slice(0, 4).join(', ')}
        </span>
      </div>

      <div className="mentor-card__legacy">
        <strong>Known for:</strong> {mentor.signature.knownFor}
      </div>

      {disabled && (
        <div className="mentor-card__locked-overlay">
          <svg className="mentor-card__lock-icon" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          <span>Unlock at higher level</span>
        </div>
      )}
    </div>
  );
};