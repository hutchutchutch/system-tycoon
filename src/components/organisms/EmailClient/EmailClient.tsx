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

          <div className={styles.actions}>
            <Button
              variant="ghost"
              size="small"
              icon={<Archive size={16} />}
              disabled={selectedEmails.length === 0}
            >
              Archive
            </Button>
            <Button
              variant="ghost"
              size="small"
              icon={<Trash size={16} />}
              disabled={selectedEmails.length === 0}
            >
              Delete
            </Button>
          </div>

          <div className={styles.viewControls}>
            <button
              className={clsx(styles.viewToggle, {
                [styles['viewToggle--active']]: viewMode === 'comfortable'
              })}
              onClick={() => setViewMode('comfortable')}
            >
              Comfortable
            </button>
            <button
              className={clsx(styles.viewToggle, {
                [styles['viewToggle--active']]: viewMode === 'compact'
              })}
              onClick={() => setViewMode('compact')}
            >
              Compact
            </button>
          </div>
        </div>

        <div className={styles.list}>
          {filteredEmails.length === 0 ? (
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