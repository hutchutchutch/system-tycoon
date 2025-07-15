import React, { useState, useCallback } from 'react';
import { Mail } from 'lucide-react';
import { BrowserWindow } from '../../components/organisms/BrowserWindow';
import { EmailClientWrapper } from './EmailClientWrapper';
import { SystemDesignCanvasWrapper } from './SystemDesignCanvasWrapper';
import './InitialExperience.css';

export const InitialExperience: React.FC = () => {
  const [showBrowser, setShowBrowser] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('');
  const [tabs, setTabs] = useState<any[]>([]);

  const handleEmailIconClick = useCallback(() => {
    setShowBrowser(true);
    setActiveTab('email');
    setTabs([{
      id: 'email',
      title: 'ProMail - Inbox',
      url: 'https://promail.com/inbox',
      component: EmailClientWrapper,
    }]);
  }, []);

  const handleOpenSystemDesignTab = useCallback(() => {
    const newTab = {
      id: 'system-design',
      title: 'System Builder - Sarah\'s Bakery',
      url: 'https://systembuilder.tech/project/sarahsbakery',
      component: SystemDesignCanvasWrapper,
    };
    
    setTabs(prev => [...prev, newTab]);
    setActiveTab('system-design');
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
      <div className="initial-experience">
        <div className="initial-experience__blank-browser">
          <div className="initial-experience__browser-chrome">
            <div className="initial-experience__tab-bar">
              <div className="initial-experience__tab initial-experience__tab--active">
                New Tab
              </div>
            </div>
            <div className="initial-experience__address-bar">
              <input type="text" value="" placeholder="Search or enter address" readOnly />
            </div>
          </div>
          
          <div className="initial-experience__content">
            <button 
              className="initial-experience__email-icon"
              onClick={handleEmailIconClick}
              aria-label="Open email"
            >
              <Mail size={48} />
              <span>Email</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="initial-experience">
      <BrowserWindow
        activeTab={activeTab}
        tabs={tabs.map(tab => ({
          ...tab,
          onOpenSystemDesign: tab.id === 'email' ? handleOpenSystemDesignTab : undefined,
        }))}
        onTabChange={handleTabChange}
        onTabClose={handleTabClose}
      />
    </div>
  );
};