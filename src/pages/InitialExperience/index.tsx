import React, { useState, useCallback } from 'react';
import { Mail, User, HelpCircle, Newspaper, ArrowLeft, ArrowRight, RotateCcw, X } from 'lucide-react';
import { BrowserWindow } from '../../components/organisms/BrowserWindow';
import { EmailClientWrapper } from './EmailClientWrapper';
import { SystemDesignCanvasWrapper } from './SystemDesignCanvasWrapper';
import { MissionInitializer } from '../../components/mission/MissionInitializer';
import styles from './InitialExperience.module.css';

const InitialExperienceContent: React.FC = () => {
  const [showBrowser, setShowBrowser] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('');
  const [tabs, setTabs] = useState<any[]>([]);
  const [missionComplete, setMissionComplete] = useState(false);

  const handleEmailIconClick = useCallback(() => {
    console.log('Email clicked! showBrowser changing from', showBrowser, 'to true');
    setShowBrowser(true);
    setActiveTab('email');
    setTabs([{
      id: 'email',
      title: 'ProMail - Inbox',
      url: 'https://promail.com/inbox',
      component: EmailClientWrapper,
    }]);
  }, [showBrowser]);

  const handleProfileIconClick = useCallback(() => {
    console.log('Profile clicked!');
    // TODO: Implement profile functionality
  }, []);

  const handleHelpIconClick = useCallback(() => {
    console.log('Help clicked!');
    // TODO: Implement help functionality
  }, []);

  const handleNewsIconClick = useCallback(() => {
    console.log('News clicked!');
    // TODO: Implement news functionality
  }, []);

  const handleOpenSystemDesignTab = useCallback(() => {
    const newTab = {
      id: 'system-design',
      title: 'System Builder - Emergency: Alex\'s Site',
      url: 'https://systembuilder.tech/emergency/alexsite',
      component: SystemDesignCanvasWrapper,
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
    setTabs(prev => prev.filter(tab => tab.id !== tabId));
    if (activeTab === tabId) {
      const remainingTabs = tabs.filter(tab => tab.id !== tabId);
      if (remainingTabs.length > 0) {
        setActiveTab(remainingTabs[0].id);
      } else {
        setShowBrowser(false);
        setActiveTab('');
      }
    }
  }, [activeTab, tabs]);

  if (!showBrowser) {
    return (
      <div className={`${styles.initialExperience} ${styles['initialExperience--blank']}`}>
        <div className={styles.blankBrowser}>
          <div className={styles.browserChrome}>
            <div className={styles.tabBar}>
              <div className={`${styles.tab} ${styles['tab--active']}`}>
                <span>New Tab</span>
              </div>
              <div className={styles.windowControls}>
                <button className={styles['windowControl--close']} aria-label="Close" />
                <button className={styles['windowControl--minimize']} aria-label="Minimize" />
                <button className={styles['windowControl--maximize']} aria-label="Maximize" />
              </div>
            </div>
            
            <div className={styles.addressBar}>
              <div className={styles.navButtons}>
                <button className={styles.navButton} disabled aria-label="Go back">
                  <ArrowLeft size={16} />
                </button>
                <button className={styles.navButton} disabled aria-label="Go forward">
                  <ArrowRight size={16} />
                </button>
                <button className={styles.navButton} aria-label="Refresh">
                  <RotateCcw size={16} />
                </button>
              </div>
              <input 
                type="text" 
                className={styles.addressBarInput}
                value="" 
                placeholder="Search or enter address" 
                readOnly 
              />
            </div>
          </div>
          
          <div className={styles.content}>
            <div className={styles.iconGrid}>
              <button 
                className={styles.appIcon}
                onClick={handleProfileIconClick}
                aria-label="Open profile"
              >
                <div className={styles.iconWrapper}>
                  <User size={24} />
                </div>
                <span className={styles.iconLabel}>Profile</span>
              </button>
              
              <button 
                className={styles.appIcon}
                onClick={handleHelpIconClick}
                aria-label="Open help"
              >
                <div className={styles.iconWrapper}>
                  <HelpCircle size={24} />
                </div>
                <span className={styles.iconLabel}>Help</span>
              </button>
              
              <button 
                className={styles.appIcon}
                onClick={handleNewsIconClick}
                aria-label="Open news"
              >
                <div className={styles.iconWrapper}>
                  <Newspaper size={24} />
                </div>
                <span className={styles.iconLabel}>News</span>
              </button>
              
              <button 
                className={`${styles.appIcon} ${styles['appIcon--primary']}`}
                onClick={handleEmailIconClick}
                aria-label="Open email"
              >
                <div className={styles.iconWrapper}>
                  <Mail size={24} />
                </div>
                <span className={styles.iconLabel}>Email</span>
                <div className={styles.notificationDot} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.initialExperience} ${styles['initialExperience--browser']}`}>
      <BrowserWindow
        activeTab={activeTab}
        tabs={tabs.map(tab => ({
          ...tab,
          onOpenSystemDesign: tab.id === 'email' ? handleOpenSystemDesignTab : undefined,
          onMissionComplete: tab.id === 'system-design' ? handleMissionComplete : undefined,
        }))}
        onTabChange={handleTabChange}
        onTabClose={handleTabClose}
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