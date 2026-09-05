import { api } from './cloudflareApi';
import type { EmailCategory } from '../types/email.types';

export interface EmailData {
  id: string;
  sender_name: string;
  sender_email: string;
  sender_avatar?: string;
  subject: string;
  preview: string;
  content: string;
  timestamp: string;
  status: 'unread' | 'read' | 'draft' | 'sent';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  has_attachments: boolean;
  tags: string[];
  category: EmailCategory;
  mission_id?: string;
  stage_id?: string;
  trigger_type?: string;
}

export async function saveEmail(emailData: {
  to: string;
  subject: string;
  body: string;
  status: 'draft' | 'sent';
  hero?: unknown;
}): Promise<{ success: boolean; emailId?: string; error?: string }> {
  try {
    const result = await api.post<{ id: string }>('/emails', {
      to: emailData.to,
      subject: emailData.subject,
      body: emailData.body,
      status: emailData.status,
    });
    return { success: true, emailId: result.id };
  } catch (error) {
    console.error('Error saving email:', error);
    return { success: false, error: 'Failed to save email' };
  }
}

export async function markEmailAsRead(emailId: string): Promise<boolean> {
  try {
    await api.patch('/emails/' + emailId + '/read');
    return true;
  } catch (error) {
    console.error('Error marking email as read:', error);
    return false;
  }
}

export async function fetchEmails(): Promise<EmailData[]> {
  return (await api.get<EmailData[]>('/emails')) ?? [];
}

export async function fetchEmailsByCategory(category: EmailCategory): Promise<EmailData[]> {
  return (await fetchEmails()).filter((email) => email.category === category);
}

export async function getUnreadEmailCount(): Promise<number> {
  try {
    return (await fetchEmails()).filter(
      (email) => email.status === 'unread' && email.category !== 'sent' && email.category !== 'drafts',
    ).length;
  } catch (error) {
    console.error('Error loading unread email count:', error);
    return 0;
  }
}
