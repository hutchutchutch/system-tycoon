import React from 'react';

export interface AuthPromoBannerProps {
  message?: string;
  highlightText?: string;
  linkText?: string;
  linkHref?: string;
  onLinkClick?: () => void;
  userAvatars?: Array<{
    src: string;
    alt: string;
    name?: string;
  }>;
  className?: string;
} 