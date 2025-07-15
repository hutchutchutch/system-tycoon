import React from 'react';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange'> {
  type?: 'text' | 'email' | 'password' | 'search' | 'number' | 'tel' | 'url';
  value: string;
  onChange: (value: string) => void;
  size?: 'small' | 'medium' | 'large';
  error?: boolean;
  errorMessage?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}