import React from 'react';
import { useAppSelector } from '../../../hooks/redux';
import styles from './MenuTemplate.module.css';

interface MenuTemplateProps {
  children?: React.ReactNode;
  title?: string;
}

/**
 * MenuTemplate - Template for menu screens (main menu, settings, etc.)
 * 
 * Redux State Management:
 * - ui.menuState: Current menu navigation state
 * - game.saveSlots: Available save game slots
 * - settings: User preferences and game settings
 * - auth.user: Current user authentication state
 */
export const MenuTemplate: React.FC<MenuTemplateProps> = ({ 
  children,
  title = 'System Tycoon' 
}) => {
  // Redux state selectors
  const menuState = useAppSelector((state) => state.ui.menuState);
  const user = useAppSelector((state) => state.auth.user);
  const settings = useAppSelector((state) => state.settings);

  return (
    <div className={styles.menuTemplate}>
      <header className={styles.menuHeader}>
        <h1 className={styles.title}>{title}</h1>
      </header>
      <main className={styles.menuContent}>
        {children}
      </main>
      <footer className={styles.menuFooter}>
        <p className={styles.version}>v1.0.0</p>
      </footer>
    </div>
  );
};

export default MenuTemplate;