import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '../Input';
import styles from './EmailSearchBar.module.css';

interface EmailSearchBarProps {
  value: string;
  onChange: (query: string) => void;
  placeholder?: string;
}

export const EmailSearchBar: React.FC<EmailSearchBarProps> = ({
  value,
  onChange,
  placeholder = "Search emails..."
}) => {
  return (
    <div className={styles.searchBar}>
      <Input
        type="search"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        leftIcon={<Search size={16} />}
      />
    </div>
  );
}; 