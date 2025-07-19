import React, { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BrowserWindow } from '../../components/organisms/BrowserWindow';
import { ProductTour } from '../../components/organisms/ProductTour';
import { EmailClientWrapper } from './EmailClientWrapper';
import { SystemDesignCanvasWrapper } from './SystemDesignCanvasWrapper';
import { ProfileWrapper } from './ProfileWrapper';
import { HelpWrapper } from './HelpWrapper';
import { NewsWrapper } from './NewsWrapper';
import { HomeWrapper } from './HomeWrapper';
import { TodaysNewsWrapper } from './TodaysNewsWrapper';
import { MissionInitializer } from '../../components/mission/MissionInitializer';
import { MentorChat } from '../../components/molecules/MentorChat';
import styles from './InitialExperience.module.css';

const InitialExperienceContent: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<string>('todays-news');
  const [tabs, setTabs] = useState<any[]>([{
    id: 'todays-news',
    title: "Today's News",
    url: 'https://news.local/today',
    component: TodaysNewsWrapper,
    closable: false, // Initial news tab cannot be closed
  }]);
  const [missionComplete, setMissionComplete] = useState(false);
  const [emailNotificationShown, setEmailNotificationShown] = useState(false);
  const [showProductTour, setShowProductTour] = useState(false);
  const [bookmarks, setBookmarks] = useState<any[]>([
    // Email button removed from bookmarks - now only in address bar
  ]);

  // Check for crisis parameter and automatically open system design canvas
  useEffect(() => {
    const isCrisis = searchParams.get('crisis') === 'true';
    if (isCrisis) {
      // Automatically open the system design canvas for crisis mode
      const crisisTab = {
        id: 'system-design',
        title: 'System Builder - Emergency: Health Crisis',
        url: 'https://systembuilder.tech/emergency/healthcrisis',
        component: SystemDesignCanvasWrapper,
        closable: true,
      };
      
      setTabs(prev => [...prev, crisisTab]);
      setActiveTab('system-design');
    }
  }, [searchParams]);

  // Start product tour after page loads
  useEffect(() => {
    // Check if user has seen the tour before (localStorage check)
    const hasSeenTour = localStorage.getItem('systemTycoon_hasSeenProductTour');
    
    if (!hasSeenTour) {
      // Start tour after a brief delay to ensure components are rendered
      const timer = setTimeout(() => {
        setShowProductTour(true);
      }, 2000); // 2 seconds delay
      
      return () => clearTimeout(timer);
    }
  }, []);

  // Add keyboard shortcut to manually trigger tour (for testing)
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Trigger tour with Ctrl+Shift+T (or Cmd+Shift+T on Mac)
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'T') {
        event.preventDefault();
        setShowProductTour(true);
        console.log('Product tour manually triggered via keyboard shortcut');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Generic function to open a new tab
  const openNewTab = useCallback((tabConfig: any) => {
    // Check if tab already exists
    const existingTab = tabs.find(tab => tab.id === tabConfig.id);
    if (existingTab) {
      // If tab exists, just switch to it
      setActiveTab(tabConfig.id);
    } else {
      // Create new tab
      setTabs(prev => [...prev, tabConfig]);
      setActiveTab(tabConfig.id);
    }
  }, [tabs]);

  const handleEmailClick = useCallback(() => {
    console.log('Email button clicked!');

    openNewTab({
      id: 'email',
      title: 'ProMail - Inbox',
      url: 'https://promail.com/inbox',
      component: EmailClientWrapper,
      closable: true,
    });
  }, [openNewTab]);

  const handleProfileIconClick = useCallback(() => {
    console.log('Profile clicked!');
    openNewTab({
      id: 'profile',
      title: 'User Profile',
      url: 'https://profile.localhost/dashboard',
      component: ProfileWrapper,
      closable: true,
    });
  }, [openNewTab]);

  const handleHelpIconClick = useCallback(() => {
    console.log('Help clicked!');
    openNewTab({
      id: 'help',
      title: 'Help Center',
      url: 'https://help.localhost/docs',
      component: HelpWrapper,
      closable: true,
    });
  }, [openNewTab]);

  const handleNewsIconClick = useCallback(() => {
    console.log('News clicked!');
    openNewTab({
      id: 'news',
      title: 'Tech News',
      url: 'https://news.localhost/latest',
      component: NewsWrapper,
      closable: true,
    });
  }, [openNewTab]);

  // Using handleEmailClick for both address bar and home page email icon

  const handleOpenSystemDesignTab = useCallback((emailId?: string) => {
    const newTab = {
      id: `system-design-${emailId || 'default'}`,
      title: emailId ? 'System Builder - Mission Stage' : 'System Builder - Emergency: Health Crisis',
      url: 'https://systembuilder.tech/emergency/healthcrisis',
      component: (props: any) => <SystemDesignCanvasWrapper {...props} emailId={emailId} />,
      closable: true,
    };
    
    setTabs(prev => [...prev, newTab]);
    setActiveTab(`system-design-${emailId || 'default'}`);
  }, []);

  const handleMissionComplete = useCallback(() => {
    setMissionComplete(true);
    // In a full implementation, this would:
    // 1. Show a success notification
    // 2. Update the email with a thank you from Alex
    // 3. Transition to the next mission or career map
    // For now, we'll just mark it complete
    console.log('Mission completed! Alex\'s system is now stable.');
  }, []);

  const handleTourComplete = useCallback(() => {
    setShowProductTour(false);
    // Mark that user has seen the tour
    localStorage.setItem('systemTycoon_hasSeenProductTour', 'true');
    console.log('Product tour completed!');
  }, []);

  const handleTabChange = useCallback((tabId: string) => {
    setActiveTab(tabId);
  }, []);

  const handleTabClose = useCallback((tabId: string) => {
    const tabToClose = tabs.find(tab => tab.id === tabId);
    
    // Prevent closing the news tab
    if (!tabToClose?.closable) {
      return;
    }

    setTabs(prev => prev.filter(tab => tab.id !== tabId));
    
    // If we're closing the active tab, switch to news tab
    if (activeTab === tabId) {
      setActiveTab('todays-news');
    }
  }, [activeTab, tabs]);

  // Add onNewTab handler to allow adding new tabs from browser controls
  const handleNewTab = useCallback(() => {
    setActiveTab('todays-news');
  }, []);

  return (
    <div className={`${styles.initialExperience} ${styles['initialExperience--browser']}`}>
      <BrowserWindow
        activeTab={activeTab}
        tabs={tabs.map(tab => ({
          ...tab,
          // Pass click handlers to the HomeWrapper (if it becomes active)
          onProfileClick: tab.id === 'home' ? handleProfileIconClick : undefined,
          onHelpClick: tab.id === 'home' ? handleHelpIconClick : undefined,
          onNewsClick: tab.id === 'home' ? handleNewsIconClick : undefined,
          onEmailClick: tab.id === 'home' ? handleEmailClick : undefined,
          // Pass handlers for system design and mission completion
          onOpenSystemDesign: tab.id === 'email' ? handleOpenSystemDesignTab : undefined,
          onMissionComplete: tab.id === 'system-design' ? handleMissionComplete : undefined,
        }))}
        bookmarks={bookmarks}
        onTabChange={handleTabChange}
        onTabClose={handleTabClose}
        onNewTab={handleNewTab}
        onEmailClick={handleEmailClick}
      />
      
      {/* Product Tour */}
      <ProductTour
        isActive={showProductTour}
        onComplete={handleTourComplete}
      />
      
      {/* Mentor Chat - Always visible in bottom left */}
      <MentorChat
        missionStageId="initial-experience"
        missionTitle="Getting Started"
        problemDescription="Learn how to use the system and complete your first mission"
      />
    </div>
  );
};

export const InitialExperience: React.FC = () => {
  return (
    <MissionInitializer>
      <InitialExperienceContent />
    </MissionInitializer>
  );
};