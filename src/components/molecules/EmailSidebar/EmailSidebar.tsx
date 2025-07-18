import React from 'react';
import clsx from 'clsx';
import { Icon } from '../../atoms/Icon';
import { Button } from '../../atoms/Button';
import styles from './EmailSidebar.module.css';

export interface EmailFolder {
  id: string;
  name: string;
  count: number;
  icon: string;
}

interface EmailSidebarProps {
  folders: EmailFolder[];
  selectedFolder: string;
  onFolderSelect: (folderId: string) => void;
  onEmailCompose: () => void;
}

export const EmailSidebar: React.FC<EmailSidebarProps> = ({
  folders,
  selectedFolder,
  onFolderSelect,
  onEmailCompose
}) => {
  return (
    <div className={styles.sidebar}>
      <div className={styles.compose}>
        <Button 
          variant="primary" 
          onClick={onEmailCompose}
        >
          Compose
        </Button>
      </div>

      <nav className={styles.folders}>
        {folders.map(folder => (
          <button
            key={folder.id}
            className={clsx(styles.folder, {
              [styles['folder--active']]: selectedFolder === folder.id
            })}
            data-folder-id={folder.id}
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
  );
}; 