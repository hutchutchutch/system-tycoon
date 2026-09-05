import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Modal } from '../../atoms/Modal';
import { Icon } from '../../atoms/Icon';
import type { NewsHero } from '../../../types/news.types';
import { saveEmail } from '../../../services/emailService';
import { startMissionFromContactEmail } from '../../../services/missionService';
import styles from './EmailComposer.module.css';

export interface EmailComposerProps {
  isOpen: boolean;
  onClose: () => void;
  hero: NewsHero;
  missionId?: string;
  stageId?: string;
  theme?: 'light' | 'dark';
  articleId?: string; // Add articleId to know which news article this is for
  onSend?: (emailData: {
    to: string;
    subject: string;
    body: string;
    hero: NewsHero;
  }) => void;
}

export const EmailComposer: React.FC<EmailComposerProps> = ({
  isOpen,
  onClose,
  hero,
  missionId,
  theme = 'light',
  articleId,
  onSend
}) => {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  // Generate recipient email
  const recipientEmail = `${hero.name.toLowerCase().replace(/\s+/g, '.')}@${hero.organization.toLowerCase().replace(/\s+/g, '')}.org`;

  // Simple message template
  const getSimpleMessage = useCallback(() => {
    return `Hey ${hero.name}! I love what you're doing! Do you need any help with your software stack?`;
  }, [hero.name]);

  // Typing animation effect
  const typeMessage = useCallback(async () => {
    const message = getSimpleMessage();
    setIsTyping(true);
    setBody('');
    
    for (let i = 0; i <= message.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 50));
      setBody(message.slice(0, i));
    }
    
    setIsTyping(false);
  }, [getSimpleMessage]);

  // Auto-generate email when modal opens
  useEffect(() => {
    if (isOpen) {
      setSubject('Do you need any help??');
      typeMessage();
    } else {
      // Reset state when modal closes
      setSubject('');
      setBody('');
      setIsTyping(false);
      setIsSaving(false);
      setIsSending(false);
    }
  }, [isOpen, hero.headline, typeMessage, articleId]);

  const handleSend = useCallback(async () => {
    if (!subject.trim() || !body.trim() || isTyping) return;

    setIsSending(true);
    setSendError(null);
    
    try {
      const result = missionId && articleId
        ? await startMissionFromContactEmail({
            newsArticleId: articleId,
            missionId,
            contactEmailData: {
              to: recipientEmail,
              subject: subject.trim(),
              body: body.trim(),
              hero,
            },
          })
        : await saveEmail({
            to: recipientEmail,
            subject: subject.trim(),
            body: body.trim(),
            status: 'sent',
            hero,
          });

      if (result.success) {
        if (missionId && articleId && 'missionStarted' in result && !result.missionStarted) {
          setSendError('This mission has already been started. Open your inbox to continue.');
          return;
        }

        // Call onSend callback if provided
        onSend?.({
          to: recipientEmail,
          subject: subject.trim(),
          body: body.trim(),
          hero
        });
        
        // Trigger email notification in GameHUD
        if (window.triggerEmailNotification) {
          window.triggerEmailNotification();
        }
        
        onClose();
      } else {
        console.error('Failed to send email:', result.error);
        setSendError(result.error || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      setSendError(error instanceof Error ? error.message : 'Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  }, [subject, body, hero, recipientEmail, onSend, onClose, isTyping, missionId, articleId]);

  const handleSaveToDrafts = useCallback(async () => {
    if (!subject.trim() && !body.trim()) {
      onClose();
      return;
    }

    setIsSaving(true);

    try {
      const result = await saveEmail({
        to: recipientEmail,
        subject: subject.trim() || 'Draft',
        body: body.trim(),
        status: 'draft',
        hero,
      });

      if (result.success) {
        // Note: Keep article status as "pending" since user has engaged but hasn't sent
        // The article was already marked as "pending" when the composer opened
        onClose();
      } else {
        console.error('Failed to save draft:', result.error);
        // For now, still close the modal
        onClose();
      }
    } catch (error) {
      console.error('Error saving draft:', error);
      onClose();
    } finally {
      setIsSaving(false);
    }
  }, [subject, body, hero, recipientEmail, onClose]);

  const handleClose = useCallback(() => {
    // If there's content, save as draft, otherwise just close
    if (subject.trim() || body.trim()) {
      handleSaveToDrafts();
    } else {
      onClose();
    }
  }, [subject, body, handleSaveToDrafts, onClose]);

  return (
    <div data-theme={theme}>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        size="medium"
        className={styles.emailComposer}
        showCloseButton={false}
      >
        <div className={styles.header}>
          <h2 className={styles.title}>New Message</h2>
          <button
            onClick={handleClose}
            className={styles.closeButton}
            aria-label="Close email composer"
            disabled={isSaving}
          >
            {isSaving ? (
              <div className={styles.spinner} />
            ) : (
              <Icon name="x" size="sm" />
            )}
          </button>
        </div>

        <div className={styles.emailForm}>
          <div className={styles.emailHeader}>
            <div className={styles.headerField}>
              <span className={styles.headerLabel}>To:</span>
              <span className={styles.headerValue}>{hero.name}</span>
            </div>
            <div className={styles.headerField}>
              <span className={styles.headerLabel}>Subject:</span>
              <span className={styles.headerValue}>{subject}</span>
            </div>
          </div>

          <div className={styles.messageField}>
            <textarea
              ref={bodyRef}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your message here..."
              className={styles.bodyInput}
              rows={10}
              disabled={isTyping}
            />
            
            {isTyping && (
              <div className={styles.typingIndicator}>
                <span className={styles.typingDots}>
                  <span></span>
                  <span></span>
                  <span></span>
                </span>
                <span>Typing message...</span>
              </div>
            )}
          </div>
        </div>

        {sendError && (
          <div
            role="alert"
            style={{
              margin: '8px 24px 0',
              padding: '10px 12px',
              borderRadius: '8px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#fca5a5',
              fontSize: '13px',
            }}
          >
            {sendError}
          </div>
        )}

        <div className={styles.footer}>
          <button
            onClick={handleSend}
            disabled={!subject.trim() || !body.trim() || isTyping || isSending}
            style={{
              position: 'relative',
              padding: '16px 32px',
              background: (!subject.trim() || !body.trim() || isTyping || isSending) 
                ? 'var(--color-surface-tertiary)' 
                : 'linear-gradient(to right, #3B82F6, #A855F7)',
              color: (!subject.trim() || !body.trim() || isTyping || isSending) 
                ? 'var(--color-text-tertiary)' 
                : 'white',
              fontWeight: '600',
              fontSize: '1.125rem',
              borderRadius: '9999px',
              border: 'none',
              cursor: (!subject.trim() || !body.trim() || isTyping || isSending) ? 'not-allowed' : 'pointer',
              boxShadow: (!subject.trim() || !body.trim() || isTyping || isSending) 
                ? 'none' 
                : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
              transition: 'all 0.3s',
              overflow: 'hidden',
              width: '100%',
              opacity: (!subject.trim() || !body.trim() || isTyping || isSending) ? 0.6 : 1
            }}
            onMouseOver={(e) => {
              if (!(!subject.trim() || !body.trim() || isTyping || isSending)) {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
              }
            }}
            onMouseOut={(e) => {
              if (!(!subject.trim() || !body.trim() || isTyping || isSending)) {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
              }
            }}
          >
            <span style={{ position: 'relative', zIndex: 10 }}>
              {isSending ? (
                <>
                  <div className={styles.spinner} />
                  Sending...
                </>
              ) : (
                'Send'
              )}
            </span>
          </button>
        </div>
      </Modal>
    </div>
  );
};
