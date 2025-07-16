import React from 'react';
import { clsx } from 'clsx';
import styles from './MentorCard.module.css';

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

  return (
    <div 
      className={clsx(
        styles.card,
        selected && styles['card--selected'],
        disabled && styles['card--disabled']
      )} 
      onClick={handleClick}
    >
      <div className={styles.header}>
        <div className={styles.avatar}>
          <span className={styles.avatarText}>
            {mentor.name.split(' ').map(n => n[0]).join('')}
          </span>
        </div>
        <div className={styles.info}>
          <h3 className={styles.name}>{mentor.name}</h3>
          <p className={styles.title}>{mentor.title}</p>
          <p className={styles.tagline}>{mentor.tagline}</p>
        </div>
      </div>

      <div className={styles.tags}>
        {mentor.tags.map((tag) => (
          <span key={tag} className={styles.tag}>
            {tag}
          </span>
        ))}
      </div>

      <div className={styles.quote}>
        <em>"{mentor.quote}"</em>
      </div>

      <div className={styles.specialty}>
        <h4 className={styles.specialtyTitle}>Specializes in:</h4>
        <div className={styles.domains}>
          {mentor.specialty.domains.slice(0, 3).map((domain) => (
            <span key={domain} className={styles.domain}>
              {domain}
            </span>
          ))}
        </div>
      </div>

      <div className={styles.tools}>
        <strong className={styles.toolsLabel}>Key Tools:</strong>
        <span className={styles.toolsList}>
          {mentor.specialty.tools.slice(0, 4).join(', ')}
        </span>
      </div>

      <div className={styles.legacy}>
        <strong className={styles.legacyLabel}>Known for:</strong> {mentor.signature.knownFor}
      </div>

      {disabled && (
        <div className={styles.lockedOverlay}>
          <svg className={styles.lockIcon} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          <span>Unlock at higher level</span>
        </div>
      )}
    </div>
  );
};