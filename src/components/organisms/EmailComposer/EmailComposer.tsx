import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Modal } from '../../atoms/Modal';
import { Button } from '../../atoms/Button';
import { Input } from '../../atoms/Input';
import type { NewsHero } from '../../../types/news.types';
import type { Mentor } from '../../../types/mentor.types';
import styles from './EmailComposer.module.css';

export interface EmailComposerProps {
  isOpen: boolean;
  onClose: () => void;
  hero: NewsHero;
  mentor: Mentor;
  onSend: (emailData: {
    to: string;
    subject: string;
    body: string;
    hero: NewsHero;
  }) => void;
}

interface EmailTemplate {
  subject: string;
  body: string;
}

export const EmailComposer: React.FC<EmailComposerProps> = ({
  isOpen,
  onClose,
  hero,
  mentor,
  onSend
}) => {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<EmailTemplate | null>(null);
  const [showRecommendations, setShowRecommendations] = useState(true);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  // Generate contextual email templates based on hero and mentor
  const generateEmailTemplate = useCallback((): EmailTemplate => {
    const urgencyMap = {
      low: 'Potential Solution',
      medium: 'Technical Assistance Available',
      high: 'Urgent Technical Support',
      critical: 'Emergency Technical Response'
    };

    const subjectPrefix = urgencyMap[hero.urgency];
    const subject = `${subjectPrefix}: ${hero.headline}`;

    const body = `Dear ${hero.name},

I hope this message finds you well. I'm reaching out after learning about the technical challenges you're facing with ${hero.technicalProblem}.

As someone working in the technology sector, I believe I might be able to help bridge the gap between the technical solutions that exist and the specific needs of ${hero.organization}. My mentor, ${mentor.name}, has guided me to understand that ${mentor.contribution.toLowerCase()}.

I understand that you're working with constraints around ${hero.businessConstraints.budget} budget and ${hero.businessConstraints.timeline} timeline. I'd be happy to explore how we might work together to find a solution that fits within these parameters.

The impact you're having on ${hero.impact.people.toLocaleString()} ${hero.impact.metric} is truly meaningful, and I'd love to contribute to that mission in whatever way I can.

Would you be open to a brief conversation about how we might collaborate? I'm happy to work within your schedule and preferred communication method.

Best regards,
[Your Name]

P.S. I noticed you need expertise in ${hero.skillsNeeded.slice(0, 2).join(' and ')} - these are areas where I have relevant experience.`;

    return { subject, body };
  }, [hero, mentor]);

  // Auto-generate email when modal opens
  useEffect(() => {
    if (isOpen && !currentTemplate) {
      const template = generateEmailTemplate();
      setCurrentTemplate(template);
      setSubject(template.subject);
      setBody(template.body);
    }
  }, [isOpen, currentTemplate, generateEmailTemplate]);

  // Typing animation effect
  const typeText = useCallback(async (text: string, targetSetter: (value: string) => void) => {
    setIsTyping(true);
    targetSetter('');
    
    for (let i = 0; i <= text.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 30));
      targetSetter(text.slice(0, i));
    }
    
    setIsTyping(false);
  }, []);

  const handleUseTemplate = useCallback(() => {
    if (currentTemplate) {
      setShowRecommendations(false);
      typeText(currentTemplate.body, setBody);
    }
  }, [currentTemplate, typeText]);

  const handleCustomize = useCallback(() => {
    setShowRecommendations(false);
    if (bodyRef.current) {
      bodyRef.current.focus();
    }
  }, []);

  const handleSend = useCallback(() => {
    if (subject.trim() && body.trim()) {
      onSend({
        to: `${hero.name} <${hero.name.toLowerCase().replace(/\s+/g, '.')}@${hero.organization.toLowerCase().replace(/\s+/g, '')}.org>`,
        subject: subject.trim(),
        body: body.trim(),
        hero
      });
      onClose();
    }
  }, [subject, body, hero, onSend, onClose]);

  const handleClose = useCallback(() => {
    setSubject('');
    setBody('');
    setCurrentTemplate(null);
    setShowRecommendations(true);
    setIsTyping(false);
    onClose();
  }, [onClose]);

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'var(--color-danger)';
      case 'high': return 'var(--color-warning)';
      case 'medium': return 'var(--color-primary)';
      default: return 'var(--color-success)';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="large"
      className={styles.emailComposer}
    >
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h2 className={styles.title}>Compose Email</h2>
          <div className={styles.recipient}>
            <span className={styles.recipientLabel}>To:</span>
            <div className={styles.recipientInfo}>
              <img 
                src={hero.avatar} 
                alt={hero.name}
                className={styles.recipientAvatar}
              />
              <div className={styles.recipientDetails}>
                <span className={styles.recipientName}>{hero.name}</span>
                <span className={styles.recipientTitle}>{hero.title} at {hero.organization}</span>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.headerRight}>
          <div 
            className={styles.urgencyBadge}
            style={{ backgroundColor: getUrgencyColor(hero.urgency) }}
          >
            {hero.urgency.toUpperCase()} PRIORITY
          </div>
        </div>
      </div>

      {showRecommendations && (
        <div className={styles.recommendations}>
          <div className={styles.recommendationHeader}>
            <h3>📧 Email Recommendations</h3>
            <p>Based on your mentor's guidance and this hero's situation:</p>
          </div>
          
          <div className={styles.recommendationContent}>
            <div className={styles.mentorInsight}>
              <img src={mentor.avatar} alt={mentor.name} className={styles.mentorAvatar} />
              <div className={styles.mentorQuote}>
                <p>"{mentor.message}"</p>
                <cite>— {mentor.name}</cite>
              </div>
            </div>
            
            <div className={styles.templatePreview}>
              <h4>Suggested Approach:</h4>
              <ul className={styles.recommendations}>
                <li>Acknowledge their specific technical challenge</li>
                <li>Reference your mentor's wisdom about bridging gaps</li>
                <li>Respect their business constraints (budget: {hero.businessConstraints.budget})</li>
                <li>Emphasize the meaningful impact on {hero.impact.people.toLocaleString()} {hero.impact.metric}</li>
                <li>Offer collaborative approach rather than selling</li>
              </ul>
            </div>
          </div>
          
          <div className={styles.templateActions}>
            <Button
              variant="primary"
              onClick={handleUseTemplate}
              disabled={isTyping}
            >
              Use Recommended Template
            </Button>
            <Button
              variant="secondary"
              onClick={handleCustomize}
            >
              Write Custom Email
            </Button>
          </div>
        </div>
      )}

      <div className={styles.emailForm}>
        <div className={styles.field}>
          <label className={styles.label}>Subject</label>
          <Input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter email subject..."
            className={styles.subjectInput}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Message</label>
          <textarea
            ref={bodyRef}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write your message here..."
            className={styles.bodyInput}
            rows={12}
            disabled={isTyping}
          />
          
          {isTyping && (
            <div className={styles.typingIndicator}>
              <span className={styles.typingDots}>
                <span></span>
                <span></span>
                <span></span>
              </span>
              <span>Composing thoughtful message...</span>
            </div>
          )}
        </div>

        <div className={styles.contextInfo}>
          <div className={styles.contextSection}>
            <h4>Hero's Technical Challenge:</h4>
            <p>{hero.technicalProblem}</p>
          </div>
          
          <div className={styles.contextSection}>
            <h4>Skills Needed:</h4>
            <div className={styles.skillsList}>
              {hero.skillsNeeded.map((skill, index) => (
                <span key={index} className={styles.skillTag}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.footerLeft}>
          <span className={styles.impactReminder}>
            💡 This could help {hero.impact.people.toLocaleString()} {hero.impact.metric}
          </span>
        </div>
        <div className={styles.footerRight}>
          <Button
            variant="secondary"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSend}
            disabled={!subject.trim() || !body.trim() || isTyping}
          >
            Send Email
          </Button>
        </div>
      </div>
    </Modal>
  );
};