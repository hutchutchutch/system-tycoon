import React, { useState, useCallback } from 'react';
import { BrowserWindow } from '../../components/organisms/BrowserWindow';
import { EmailClientWrapper } from './EmailClientWrapper';
import { SystemDesignCanvasWrapper } from './SystemDesignCanvasWrapper';
import { ProfileWrapper } from './ProfileWrapper';
import { HelpWrapper } from './HelpWrapper';
import { NewsWrapper } from './NewsWrapper';
import { HomeWrapper } from './HomeWrapper';
import { MissionInitializer } from '../../components/mission/MissionInitializer';
import styles from './InitialExperience.module.css';

const InitialExperienceContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [tabs, setTabs] = useState<any[]>([{
    id: 'home',
    title: 'Home',
    url: 'https://localhost:5179',
    component: HomeWrapper,
    closable: false, // Home tab cannot be closed
  }]);
  const [missionComplete, setMissionComplete] = useState(false);

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

  const handleEmailIconClick = useCallback(() => {
    console.log('Email clicked!');
    openNewTab({
      id: 'email',
      title: 'ProMail - Inbox',
      url: 'https://promail.com/inbox',
      component: EmailClientWrapper,
      closable: true,
    });
  }, [openNewTab]);

  const handleOpenSystemDesignTab = useCallback(() => {
    const newTab = {
      id: 'system-design',
      title: 'System Builder - Emergency: Alex\'s Site',
      url: 'https://systembuilder.tech/emergency/alexsite',
      component: SystemDesignCanvasWrapper,
      closable: true,
    };
    
    setTabs(prev => [...prev, newTab]);
    setActiveTab('system-design');
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

  const handleTabChange = useCallback((tabId: string) => {
    setActiveTab(tabId);
  }, []);

  const handleTabClose = useCallback((tabId: string) => {
    const tabToClose = tabs.find(tab => tab.id === tabId);
    
    // Prevent closing the home tab
    if (!tabToClose?.closable) {
      return;
    }

    setTabs(prev => prev.filter(tab => tab.id !== tabId));
    
    // If we're closing the active tab, switch to home tab
    if (activeTab === tabId) {
      setActiveTab('home');
    }
  }, [activeTab, tabs]);

  // Add onNewTab handler to allow adding new tabs from browser controls
  const handleNewTab = useCallback(() => {
    setActiveTab('home');
  }, []);

  return (
    <div className={`${styles.initialExperience} ${styles['initialExperience--browser']}`}>
      <BrowserWindow
        activeTab={activeTab}
        tabs={tabs.map(tab => ({
          ...tab,
          // Pass click handlers to the HomeWrapper
          onProfileClick: tab.id === 'home' ? handleProfileIconClick : undefined,
          onHelpClick: tab.id === 'home' ? handleHelpIconClick : undefined,
          onNewsClick: tab.id === 'home' ? handleNewsIconClick : undefined,
          onEmailClick: tab.id === 'home' ? handleEmailIconClick : undefined,
          // Pass handlers for system design and mission completion
          onOpenSystemDesign: tab.id === 'email' ? handleOpenSystemDesignTab : undefined,
          onMissionComplete: tab.id === 'system-design' ? handleMissionComplete : undefined,
        }))}
        onTabChange={handleTabChange}
        onTabClose={handleTabClose}
        onNewTab={handleNewTab}
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