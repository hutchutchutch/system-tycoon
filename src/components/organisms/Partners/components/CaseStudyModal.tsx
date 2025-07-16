import React from 'react';
import { clsx } from 'clsx';
import { Card } from '../../../atoms/Card';
import { Button } from '../../../atoms/Button';
import { X } from 'lucide-react';
import styles from './CaseStudyModal.module.css';

interface CaseStudyModalProps {
  partner: {
    id: string;
    name: string;
    logo: string;
  };
  onClose: () => void;
}

export const CaseStudyModal: React.FC<CaseStudyModalProps> = ({ partner, onClose }) => {
  const caseStudies: Record<string, { title: string; impact: string; story: string }> = {
    redcross: {
      title: "Emergency Response System",
      impact: "50,000 people rescued faster",
      story: "During flooding in Bangladesh, our developers built a real-time coordination system that helped Red Cross teams locate and rescue stranded families 73% faster."
    },
    unicef: {
      title: "Education Tracking Platform",
      impact: "2.3 million children back in school",
      story: "UNICEF needed a way to track displaced children and match them with nearby schools. Our community built a system that reunited children with education."
    }
  };

  const study = caseStudies[partner.id] || caseStudies.redcross;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <Card className={styles.modalCard}>
          <button
            onClick={onClose}
            className={styles.closeButton}
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
          
          <div className={styles.header}>
            <div className={styles.partnerLogo}>{partner.logo}</div>
            <h3 className={styles.partnerName}>{partner.name}</h3>
          </div>
          
          <div className={styles.content}>
            <h4 className={styles.caseTitle}>{study.title}</h4>
            <p className={styles.impact}>{study.impact}</p>
            <p className={styles.story}>{study.story}</p>
          </div>
          
          <div className={styles.footer}>
            <Button variant="primary" onClick={onClose}>
              Close
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};