import React, { useMemo, useState } from 'react';
import { clsx } from 'clsx';
import { Search, Plus, Archive, Trash } from 'lucide-react';
import { Button } from '../../atoms/Button';
import { Input } from '../../atoms/Input';
import { Icon } from '../../atoms/Icon';
import { EmailCard } from '../../molecules/EmailCard';
import styles from './EmailClient.module.css';
import type { EmailClientProps } from './EmailClient.types';

export const EmailClient: React.FC<EmailClientProps> = ({
  emails,
  folders,
  selectedEmails,
  selectedFolder,
  searchQuery,
  onEmailSelect,
  onEmailToggleSelect,
  onFolderSelect,
  onSearchChange,
  onEmailCompose,
  onEmailReply,
  className,
  showEmailDetail = false,
  selectedEmailDetail,
  onBackToList,
  onOpenSystemDesign,
  tabs = [],
  selectedTab = 'primary',
  onTabSelect,
}) => {
  const [viewMode, setViewMode] = useState<'comfortable' | 'compact'>('comfortable');

  // Filter emails based on folder and search
  const filteredEmails = useMemo(() => {
    let filtered = emails;

    // Filter by folder (simplified - in real app would have proper folder logic)
    if (selectedFolder !== 'inbox') {
      // Apply folder filtering logic
      // For now, just return all emails for any folder
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(email =>
        email.sender.name.toLowerCase().includes(query) ||
        email.subject.toLowerCase().includes(query) ||
        email.preview.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [emails, selectedFolder, searchQuery]);

  return (
    <div className={clsx(styles.emailClient, className)}>
      <div className={styles.sidebar}>
        <div className={styles.compose}>
          <Button
            variant="primary"
            fullWidth
            icon={<Plus size={16} />}
            onClick={onEmailCompose}
          >
            Compose
          </Button>
        </div>

        <nav className={styles.folders}>
          {folders.map(folder => (
            <button
              key={folder.id}
              className={clsx(
                styles.folder,
                { [styles['folder--active']]: selectedFolder === folder.id }
              )}
              onClick={() => onFolderSelect(folder.id)}
            >
              <Icon name={folder.icon as any} size="sm" />
              <span className={styles.folderName}>{folder.name}</span>
              {folder.count > 0 && (
                <span className={styles.folderCount}>{folder.count}</span>
              )}
            </button>
          ))}
        </nav>
      </div>

      <div className={styles.main}>
        <div className={styles.toolbar}>
          <div className={styles.search}>
            <Input
              type="search"
              value={searchQuery}
              onChange={onSearchChange}
              placeholder="Search emails..."
              leftIcon={<Search size={16} />}
            />
          </div>

          {tabs.length > 0 && (
            <div className={styles.tabs}>
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  className={clsx(styles.tab, {
                    [styles['tab--active']]: selectedTab === tab.id
                  })}
                  onClick={() => onTabSelect?.(tab.id)}
                >
                  {tab.name}
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className={styles.tabCount}>{tab.count}</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className={styles.list}>
          {showEmailDetail && selectedEmailDetail ? (
            <div className={styles.emailDetail}>
              <div className={styles.emailDetailHeader}>
                <button 
                  className={styles.emailDetailBack}
                  onClick={onBackToList}
                >
                  ← Back to Inbox
                </button>
                <h2 className={styles.emailDetailSubject}>{selectedEmailDetail.subject}</h2>
              </div>
              
              <div className={styles.emailDetailMeta}>
                <strong>From:</strong> {selectedEmailDetail.sender.name} &lt;{selectedEmailDetail.sender.email}&gt;<br />
                <strong>To:</strong> Me<br />
                <strong>Date:</strong> {selectedEmailDetail.timestamp.toLocaleString()}
              </div>
              
              <div className={styles.emailDetailContent}>
                {selectedEmailDetail.content ? (
                  selectedEmailDetail.id === 'crisis-1' ? (
                    // Special handling for crisis email to include the system design link
                    <div>
                      {selectedEmailDetail.content.split('\n').map((paragraph, index) => {
                        if (paragraph.includes('systembuilder.tech/emergency/alexsite')) {
                          return (
                            <p key={index}>
                              I found this tool: <a 
                                href="#" 
                                onClick={(e) => {
                                  e.preventDefault();
                                  onOpenSystemDesign?.();
                                }}
                                className={styles.emailLink}
                              >systembuilder.tech/emergency/alexsite</a>
                            </p>
                          );
                        }
                        return paragraph.trim() ? <p key={index}>{paragraph}</p> : <br key={index} />;
                      })}
                    </div>
                  ) : (
                    // Regular content rendering for other emails
                    <div>
                      {selectedEmailDetail.content.split('\n').map((paragraph, index) => 
                        paragraph.trim() ? <p key={index}>{paragraph}</p> : <br key={index} />
                      )}
                    </div>
                  )
                ) : (
                  <p>{selectedEmailDetail.preview}</p>
                )}
              </div>
            </div>
          ) : filteredEmails.length === 0 ? (
            <div className={styles.empty}>
              <p>No emails found</p>
            </div>
          ) : (
            filteredEmails.map(email => (
              <EmailCard
                key={email.id}
                email={email}
                selected={selectedEmails.includes(email.id)}
                compact={viewMode === 'compact'}
                onClick={() => onEmailSelect(email.id)}
                onStatusChange={(emailId, status) => onEmailToggleSelect(emailId)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}; 