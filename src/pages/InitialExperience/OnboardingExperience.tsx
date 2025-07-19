import React, { useState, useCallback } from 'react';
import { OnboardingFlow } from '../../components/templates/OnboardingFlow';
import { BrowserWindow } from '../../components/organisms/BrowserWindow';
import { EmailComposer } from '../../components/organisms/EmailComposer';
import { Toast } from '../../components/atoms/Toast';
import type { Mentor } from '../../types/mentor.types';
import type { NewsHero } from '../../types/news.types';
import styles from './InitialExperience.module.css';

interface NewsWrapperProps {
  mentor: Mentor | null;
  onEmailSent: (emailData: {
    to: string;
    subject: string;
    body: string;
    hero: NewsHero;
  }) => void;
}

const NewsWrapper: React.FC<NewsWrapperProps> = ({ mentor, onEmailSent }) => {
  const [selectedHero, setSelectedHero] = useState<NewsHero | null>(null);
  
  const handleContactHero = useCallback((hero: NewsHero) => {
    console.log('Contact hero:', hero);
    setSelectedHero(hero);
  }, []);

  const handleCloseEmailComposer = useCallback(() => {
    setSelectedHero(null);
  }, []);

  const handleEmailSend = useCallback((emailData: {
    to: string;
    subject: string;
    body: string;
    hero: NewsHero;
  }) => {
    onEmailSent(emailData);
    setSelectedHero(null);
  }, [onEmailSent]);

  return (
    <div className={styles.newsWrapper}>
      {/* TODO: Implement hero contact feature - replaced with placeholder */}
      <div 
        style={{
          padding: 'var(--space-8)',
          textAlign: 'center',
          background: 'var(--color-surface-secondary)',
          borderRadius: 'var(--radius-lg)',
          margin: 'var(--space-4)',
          border: '1px solid var(--color-border-primary)'
        }}
      >
        <h3 
          style={{
            color: 'var(--color-text-primary)',
            fontSize: 'var(--text-xl)',
            fontWeight: 'var(--font-weight-semibold)',
            marginBottom: 'var(--space-2)'
          }}
        >
          Hero Contact Feature
        </h3>
        <p 
          style={{
            color: 'var(--color-text-tertiary)',
            fontSize: 'var(--text-base)',
            margin: 0
          }}
        >
          This feature for contacting news heroes will be implemented in a future update.
        </p>
      </div>
      
      {selectedHero && (
        <EmailComposer
          isOpen={!!selectedHero}
          onClose={handleCloseEmailComposer}
          hero={selectedHero}
          onSend={handleEmailSend}
        />
      )}
    </div>
  );
};

export const OnboardingExperience: React.FC = () => {
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [emailToast, setEmailToast] = useState<{
    message: string;
    variant: 'success' | 'info' | 'warning' | 'error';
  } | null>(null);

  const handleMentorComplete = useCallback((mentor: Mentor) => {
    console.log('Mentor selected:', mentor);
    setSelectedMentor(mentor);
  }, []);

  const handleEmailSent = useCallback((emailData: {
    to: string;
    subject: string;
    body: string;
    hero: NewsHero;
  }) => {
    console.log('Email sent:', emailData);
    
    // Show success toast
    setEmailToast({
      message: `Email sent to ${emailData.hero.name}! They should receive your message shortly.`,
      variant: 'success'
    });
    
    // Auto-hide toast after 5 seconds
    setTimeout(() => {
      setEmailToast(null);
    }, 5000);
  }, []);

  const NewsWrapperComponent = useCallback(() => (
    <NewsWrapper mentor={selectedMentor} onEmailSent={handleEmailSent} />
  ), [selectedMentor, handleEmailSent]);

  const [tabs] = useState([{
    id: 'todays-news',
    title: "Today's News",
    url: 'https://news.local/today',
    component: NewsWrapperComponent,
    closable: false,
  }]);

  return (
    <OnboardingFlow onComplete={handleMentorComplete}>
      <div className={`${styles.initialExperience} ${styles['initialExperience--browser']}`}>
        <BrowserWindow
          activeTab="todays-news"
          tabs={tabs}
        />
        
        {emailToast && (
          <Toast
            message={emailToast.message}
            variant={emailToast.variant}
            position="top-right"
            duration={5000}
            onClose={() => setEmailToast(null)}
          />
        )}
      </div>
    </OnboardingFlow>
  );
};