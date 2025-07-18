import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Modal } from '../../atoms/Modal';
import { Button } from '../../atoms/Button';
import { Input } from '../../atoms/Input';
import { Icon } from '../../atoms/Icon';
import type { NewsHero } from '../../../types/news.types';
import { saveEmail } from '../../../services/emailService';
import styles from './EmailComposer.module.css';

export interface EmailComposerProps {
  isOpen: boolean;
  onClose: () => void;
  hero: NewsHero;
  missionId?: string;
  stageId?: string;
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
  onSend
}) => {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSending, setIsSending] = useState(false);
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
  }, [isOpen, hero.headline, typeMessage]);

  const handleSend = useCallback(async () => {
    if (!subject.trim() || !body.trim() || isTyping) return;

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
        // Call onSend callback if provided
        onSend?.({
          to: recipientEmail,
          subject: subject.trim(),
          body: body.trim(),
          hero
        });
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
  }, [subject, body, hero, recipientEmail, onSend, onClose, isTyping]);

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
    <div data-theme="light">
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        size="large"
        className={styles.emailComposer}
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
          <Button
            variant="primary"
            onClick={handleSend}
            disabled={!subject.trim() || !body.trim() || isTyping || isSending}
            className={styles.sendButton}
          >
            {isSending ? (
              <>
                <div className={styles.spinner} />
                Submitting...
              </>
            ) : (
              'Submit'
            )}
          </Button>
        </div>
      </Modal>
    </div>
  );
};