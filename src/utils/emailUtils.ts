/**
 * Email-specific utility functions extracted from EmailCard.
 * Pure business logic with no React dependencies.
 */

import type { EmailStatusType } from '../components/atoms/EmailStatus';
import type { EmailPriority } from '../types/email.types';

/**
 * Maps an Email model status string to the EmailStatusType used by the
 * EmailStatus atom component.
 */
export const mapEmailStatus = (status: string): EmailStatusType => {
  switch (status) {
    case 'unread':
      return 'unread';
    case 'read':
      return 'read';
    case 'archived':
      return 'draft'; // Map archived to draft for display purposes
    case 'deleted':
      return 'draft'; // Map deleted to draft for display purposes
    default:
      return 'read';
  }
};

/**
 * Truncates text to a maximum length, appending an ellipsis if truncated.
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Returns the icon name and severity for a given email priority.
 * Returns `null` for normal priority (no icon needed).
 */
export const getPriorityIconInfo = (
  priority: EmailPriority
): { iconName: string; severity: 'high' | 'low' } | null => {
  switch (priority) {
    case 'high':
    case 'urgent':
      return { iconName: 'alert-circle', severity: 'high' };
    case 'low':
      return { iconName: 'chevron-down', severity: 'low' };
    default:
      return null;
  }
};

/**
 * Determines the mission tag label for a mission-related email.
 * Returns `null` if the email is not a mission email.
 */
export const getMissionTagText = (
  missionId: string | undefined,
  triggerType: string | undefined,
  stageNumber: number | undefined
): string | null => {
  if (!missionId) return null;

  if (triggerType === 'mission_start') {
    return 'MISSION START';
  } else if (triggerType === 'stage_complete' && stageNumber) {
    return `STAGE ${stageNumber}`;
  } else if (triggerType === 'performance_based') {
    return 'MISSION CRITICAL';
  } else {
    return 'MISSION';
  }
};
