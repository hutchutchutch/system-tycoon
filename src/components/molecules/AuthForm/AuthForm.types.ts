import React from 'react';

export interface AuthFormProps {
  email: string;
  password: string;
  error?: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: () => void;
  onGoogleSignIn?: () => void;
  submitLabel?: string;
  showSocialAuth?: boolean;
  className?: string;
} 