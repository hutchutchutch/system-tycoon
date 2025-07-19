import React from 'react';
import { Modal } from '../../atoms/Modal/Modal';
import { Badge } from '../../atoms/Badge/Badge';
import { X, Info } from 'lucide-react';
import styles from './ComponentDetailModal.module.css';

export interface ComponentDetail {
  id: string;
  name: string;
  category: string;
  icon_name?: string;
  short_description?: string;
  detailed_description?: string;
  compatible_with?: string[];
}

interface ComponentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  component: ComponentDetail | null;
  availableComponents?: ComponentDetail[]; // For resolving compatible component names
}

export const ComponentDetailModal: React.FC<ComponentDetailModalProps> = ({
  isOpen,
  onClose,
  component,
  availableComponents = []
}) => {
  if (!component) return null;

  // Helper to get component name by ID for compatible_with display
  const getComponentName = (componentId: string): string => {
    const foundComponent = availableComponents.find(c => c.id === componentId);
    return foundComponent?.name || componentId;
  };

  const formatCategory = (category: string): string => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="medium">
      <div className={styles.header}>
        <div className={styles.titleContainer}>
          <Info className={styles.headerIcon} size={24} />
          <h2 className={styles.title}>{component.name}</h2>
        </div>
        <button 
          onClick={onClose}
          className={styles.closeButton}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Category</h3>
          <Badge variant="outline" className={styles.categoryBadge}>
            {formatCategory(component.category)}
          </Badge>
        </div>

        {component.short_description && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Overview</h3>
            <p className={styles.description}>{component.short_description}</p>
          </div>
        )}

        {component.detailed_description && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Detailed Description</h3>
            <p className={styles.description}>{component.detailed_description}</p>
          </div>
        )}

        {component.compatible_with && component.compatible_with.length > 0 && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Compatible With</h3>
            <div className={styles.compatibilityTags}>
              {component.compatible_with.map((compatibleId) => (
                <Badge 
                  key={compatibleId} 
                  variant="secondary"
                  className={styles.compatibilityTag}
                >
                  {getComponentName(compatibleId)}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}; 