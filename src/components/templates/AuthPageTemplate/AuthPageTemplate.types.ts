import React from 'react';

export interface AuthPageTemplateProps {
  title?: string;
  logoSrc?: string;
  email: string;
  password: string;
  error?: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: () => void;
  onGoogleSignIn?: () => void;
  onSignUpClick?: () => void;
  submitLabel?: string;
  showPromoBanner?: boolean;
  userAvatars?: Array<{
    src: string;
    alt: string;
    name?: string;
  }>;
  className?: string;
} 