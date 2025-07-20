import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Modal } from '../../atoms/Modal';
import { Button } from '../../atoms/Button';
import { Input } from '../../atoms/Input';
import { Icon } from '../../atoms/Icon';
import type { NewsHero } from '../../../types/news.types';
import { saveEmail } from '../../../services/emailService';
import { startMissionFromContactEmail } from '../../../services/missionService';
import type { RootState } from '../../../store';
import { supabase } from '../../../services/supabase';
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
  stageId,
  theme = 'light',
  articleId,
  onSend
}) => {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [missionStartResult, setMissionStartResult] = useState<any>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  // Get current user from Redux store
  const currentUser = useSelector((state: RootState) => state.auth.user);

  // Generate recipient email
  const recipientEmail = `${hero.name.toLowerCase().replace(/\s+/g, '.')}@${hero.organization.toLowerCase().replace(/\s+/g, '')}.org`;

  // Simple message template
  const getSimpleMessage = useCallback(() => {
    return `Hey ${hero.name}! I love what you're doing! Do you need any help with your software stack?`;
  }, [hero.name]);

  // Update news article accepted status
  const updateNewsArticleAcceptedStatus = async (articleId: string, status: 'no' | 'pending' | 'yes') => {
    try {
      const { error } = await supabase
        .from('news_articles')
        .update({ accepted: status })
        .eq('id', articleId);

      if (error) {
        console.error('Error updating news article accepted status:', error);
      }
    } catch (error) {
      console.error('Error in updateNewsArticleAcceptedStatus:', error);
    }
  };

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
      // Mark article as "pending" when Contact is clicked to open composer
      if (articleId) {
        updateNewsArticleAcceptedStatus(articleId, 'pending');
      }
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
    if (!subject.trim() || !body.trim() || isTyping || !currentUser) return;

    setIsSending(true);
    
    try {
      // Save to database as sent
      const result = await saveEmail({
        to: recipientEmail,
        subject: subject.trim(),
        body: body.trim(),
        status: 'sent',
        hero,
        missionId,
        stageId
      });

      if (result.success) {
        // Mark article as "yes" since email was successfully sent
        if (articleId) {
          await updateNewsArticleAcceptedStatus(articleId, 'yes');
        }

        // Start mission if we have all required data
        if (missionId && articleId) {
          try {
            const missionResult = await startMissionFromContactEmail({
              userId: currentUser.id,
              newsArticleId: articleId,
              missionId: missionId,
              contactEmailData: {
                to: recipientEmail,
                subject: subject.trim(),
                body: body.trim(),
                hero
              }
            });

            setMissionStartResult(missionResult);
            
            if (missionResult.success && missionResult.missionStarted) {
              console.log('Mission started successfully! First stage emails delivered:', missionResult.firstStageEmails);
            }
          } catch (missionError) {
            console.error('Error starting mission:', missionError);
            // Don't prevent email success flow from completing
          }
        }

        // Call onSend callback if provided
        onSend?.({
          to: recipientEmail,
          subject: subject.trim(),
          body: body.trim(),
          hero
        });
        
        // Trigger email notification in GameHUD
        if ((window as any).triggerEmailNotification) {
          (window as any).triggerEmailNotification();
        }
        
        onClose();
      } else {
        console.error('Failed to send email:', result.error);
        // Could show error message here
      }
    } catch (error) {
      console.error('Error sending email:', error);
    } finally {
      setIsSending(false);
    }
  }, [subject, body, hero, recipientEmail, onSend, onClose, isTyping, currentUser, missionId, articleId]);

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
        missionId,
        stageId
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