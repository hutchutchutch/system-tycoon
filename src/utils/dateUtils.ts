/**
 * Date formatting utilities for the application.
 */

/**
 * Formats a date as a relative time string (e.g., "2m ago", "3h ago", "Yesterday").
 * Falls back to "Just now" for invalid inputs.
 */
export const formatRelativeTime = (dateInput: string | Date): string => {
  let date: Date;

  if (dateInput instanceof Date) {
    date = dateInput;
  } else if (typeof dateInput === 'string') {
    date = new Date(dateInput);
  } else {
    return 'Just now';
  }

  if (isNaN(date.getTime())) {
    return 'Just now';
  }

  const now = new Date();
  const diffTime = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffTime / (1000 * 60));
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) {
    return 'Just now';
  } else if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays}d ago`;
  } else {
    return formatShortDate(date);
  }
};

/**
 * Formats a date as a short date string (e.g., "Apr 17").
 */
export const formatShortDate = (dateInput: string | Date): string => {
  let date: Date;

  if (dateInput instanceof Date) {
    date = dateInput;
  } else if (typeof dateInput === 'string') {
    date = new Date(dateInput);
  } else {
    return '';
  }

  if (isNaN(date.getTime())) {
    return '';
  }

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};
