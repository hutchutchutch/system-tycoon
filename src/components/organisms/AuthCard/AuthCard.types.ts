import React from 'react';

export interface AuthCardProps {
  title?: string;
  logoSrc?: string;
  email: string;
  password: string;
  error?: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: () => void;
  onGoogleSignIn?: () => void;
  submitLabel?: string;
  className?: string;
} 