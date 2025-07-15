import React, { useMemo, useState } from 'react';
import { clsx } from 'clsx';
import { Search, Plus, Archive, Trash } from 'lucide-react';
import { Button } from '../../atoms/Button';
import { Input } from '../../atoms/Input';
import { Icon } from '../../atoms/Icon';
import { EmailCard } from '../../molecules/EmailCard';
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
    <div className={clsx('email-client', className)}>
      <div className="email-client__sidebar">
        <div className="email-client__compose">
          <Button
            variant="primary"
            fullWidth
            icon={<Plus size={16} />}
            onClick={onEmailCompose}
          >
            Compose
          </Button>
        </div>

        <nav className="email-client__folders">
          {folders.map(folder => (
            <button
              key={folder.id}
              className={clsx(
                'email-client__folder',
                { 'email-client__folder--active': selectedFolder === folder.id }
              )}
              onClick={() => onFolderSelect(folder.id)}
            >
                             <Icon name="users" size="sm" />
              <span className="email-client__folder-name">{folder.name}</span>
              {folder.count > 0 && (
                <span className="email-client__folder-count">{folder.count}</span>
              )}
            </button>
          ))}
        </nav>
      </div>

      <div className="email-client__main">
        <div className="email-client__toolbar">
          <div className="email-client__search">
            <Input
              type="search"
              value={searchQuery}
              onChange={onSearchChange}
              placeholder="Search emails..."
              leftIcon={<Search size={16} />}
            />
          </div>

          <div className="email-client__actions">
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

          <div className="email-client__view-controls">
            <button
              className={clsx('email-client__view-toggle', {
                'email-client__view-toggle--active': viewMode === 'comfortable'
              })}
              onClick={() => setViewMode('comfortable')}
            >
              Comfortable
            </button>
            <button
              className={clsx('email-client__view-toggle', {
                'email-client__view-toggle--active': viewMode === 'compact'
              })}
              onClick={() => setViewMode('compact')}
            >
              Compact
            </button>
          </div>
        </div>

        <div className="email-client__list">
          {filteredEmails.length === 0 ? (
            <div className="email-client__empty">
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