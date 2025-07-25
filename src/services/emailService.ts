import { supabase } from './supabase';
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
  // Mission-related fields
  mission_id?: string;
  stage_id?: string;
  trigger_type?: string;
}

// Save email as draft or sent
export async function saveEmail(emailData: {
  to: string;
  subject: string;
  body: string;
  status: 'draft' | 'sent';
  hero?: any;
  missionId?: string;
  stageId?: string;
}): Promise<{ success: boolean; emailId?: string; error?: string }> {
  try {
    // Get current user from Supabase auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('User not authenticated:', authError);
      return { success: false, error: 'User not authenticated' };
    }

    // Generate preview from body (first 100 characters)
    const preview = emailData.body.substring(0, 100) + (emailData.body.length > 100 ? '...' : '');
    
    // Extract sender info from current user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('username, display_name')
      .eq('id', user.id)
      .single();
    
    if (profileError) {
      console.error('Error fetching user profile:', profileError);
      return { success: false, error: 'Could not fetch user profile' };
    }
    
    const senderName = profile?.display_name || profile?.username || 'Player';
    const senderEmail = user.email || 'player@systemtycoon.com';
    
    const emailRecord = {
      sender_name: senderName,
      sender_email: senderEmail,
      sender_avatar: null,
      recipient_email: emailData.to,
      recipient_name: emailData.hero?.name || null,
      subject: emailData.subject,
      preview,
      body: emailData.body,
      content: emailData.body,
      timestamp: new Date().toISOString(),
      status: emailData.status,
      priority: 'normal' as const,
      has_attachments: false,
      tags: ['user-composed'],
      category: emailData.status === 'sent' ? 'sent' as const : 'drafts' as const,
      mission_id: emailData.missionId,
      stage_id: emailData.stageId,
      trigger_type: null, // User emails don't have automatic triggers
      character_id: null, // User emails aren't from characters
    };

    const { data, error } = await supabase
      .from('mission_emails')
      .insert([emailRecord])
      .select()
      .single();

    if (error) {
      console.error('Error saving email:', error);
      return { success: false, error: error.message };
    }

    // If email was sent, deliver it to user's inbox
    if (emailData.status === 'sent') {
      const { error: deliveryError } = await supabase.rpc('deliver_user_sent_email', {
        p_user_id: user.id,
        p_mission_email_id: data.id
      });

      if (deliveryError) {
        console.error('Error delivering email to inbox:', deliveryError);
        // Don't fail the whole operation, email was saved successfully
      }
    }

    return { success: true, emailId: data.id };
  } catch (error) {
    console.error('Error in saveEmail:', error);
    return { success: false, error: 'Failed to save email' };
  }
}

// New function to trigger mission email delivery
export async function deliverMissionEmails(missionId: string, stageId: string): Promise<{ success: boolean; emailsDelivered?: number; error?: string }> {
  try {
    // Get current user from Supabase auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('User not authenticated:', authError);
      return { success: false, error: 'User not authenticated' };
    }

    console.log('Calling deliver_mission_emails RPC with:', {
      p_user_id: user.id,
      p_mission_id: missionId,
      p_stage_id: stageId
    });

    const { data: emailsDelivered, error } = await supabase.rpc('deliver_mission_emails', {
      p_user_id: user.id,
      p_mission_id: missionId,
      p_stage_id: stageId
    });

    if (error) {
      console.error('Error delivering mission emails:', error);
      return { success: false, error: error.message };
    }

    console.log('Mission emails delivered successfully:', emailsDelivered);
    return { success: true, emailsDelivered };
  } catch (error) {
    console.error('Error in deliverMissionEmails:', error);
    return { success: false, error: 'Failed to deliver mission emails' };
  }
}

// New function to mark email as read
export async function markEmailAsRead(emailId: string): Promise<boolean> {
  try {
    // Get current user from Supabase auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('User not authenticated:', authError);
      return false;
    }

    const { error } = await supabase.rpc('mark_email_as_read', {
      p_user_id: user.id,
      p_mission_email_id: emailId
    });

    if (error) {
      console.error('Error marking email as read:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in markEmailAsRead:', error);
    return false;
  }
}

// Update existing draft
export async function updateDraft(emailId: string, updates: {
  subject?: string;
  body?: string;
}): Promise<boolean> {
  try {
    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    if (updates.subject) {
      updateData.subject = updates.subject;
    }

    if (updates.body) {
      updateData.body = updates.body;
      updateData.preview = updates.body.substring(0, 100) + (updates.body.length > 100 ? '...' : '');
    }

    const { error } = await supabase
      .from('mission_emails')
      .update(updateData)
      .eq('id', emailId)
      .eq('status', 'draft'); // Only update if it's still a draft

    if (error) {
      console.error('Error updating draft:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in updateDraft:', error);
    return false;
  }
}

// Convert draft to sent
export async function sendDraft(emailId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('mission_emails')
      .update({ 
        status: 'sent',
        category: 'sent',
        updated_at: new Date().toISOString()
      })
      .eq('id', emailId)
      .eq('status', 'draft');

    if (error) {
      console.error('Error sending draft:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in sendDraft:', error);
    return false;
  }
}

// Convert database row to EmailData
function convertToEmailData(row: any): EmailData {
  return {
    id: row.id,
    sender_name: row.sender_name,
    sender_email: row.sender_email,
    sender_avatar: row.sender_avatar,
    subject: row.subject,
    preview: row.preview,
    content: row.content,
    timestamp: row.timestamp,
    status: row.status,
    priority: row.priority,
    has_attachments: row.has_attachments,
    tags: row.tags || [],
    category: row.category,
  };
}

// Fetch emails for user's current mission stage from the database
export async function fetchEmails(): Promise<EmailData[]> {
  try {
    // Get current user from Supabase auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('User not authenticated:', authError);
      return getFallbackEmails();
    }

    // Call the database function to get emails for current stage
    const { data, error } = await supabase.rpc('get_emails_for_current_stage', {
      p_user_id: user.id
    });

    if (error) {
      console.error('Error fetching emails for current stage:', error);
      return getFallbackEmails();
    }

    return data ? data.map((row: any) => ({
      id: row.id,
      sender_name: row.character_name || row.sender_name || 'Unknown Sender',
      sender_email: row.character_email || row.sender_email || 'unknown@example.com',
      sender_avatar: row.character_avatar_url || row.sender_avatar,
      subject: row.subject,
      preview: row.preview,
      content: row.body || row.content || '',
      timestamp: row.email_timestamp || row.created_at,
      status: row.status,
      priority: row.priority,
      has_attachments: row.has_attachments,
      tags: row.tags || [],
      category: row.category,
      // Include mission-related fields
      mission_id: row.mission_id,
      stage_id: row.stage_id,
      trigger_type: row.trigger_type,
    })) : getFallbackEmails();
  } catch (error) {
    console.error('Error in fetchEmails:', error);
    return getFallbackEmails();
  }
}

// Fetch emails by category (also filtered by current stage)
export async function fetchEmailsByCategory(category: EmailCategory): Promise<EmailData[]> {
  try {
    // Get current user from Supabase auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('User not authenticated:', authError);
      return getFallbackEmails().filter((email: EmailData) => email.category === category);
    }

    // Call the database function to get emails for current stage, then filter by category
    const { data, error } = await supabase.rpc('get_emails_for_current_stage', {
      p_user_id: user.id
    });

    if (error) {
      console.error('Error fetching emails by category for current stage:', error);
      return getFallbackEmails().filter((email: EmailData) => email.category === category);
    }

    // Filter by category on the client side
    const allEmails = data ? data.map((row: any) => ({
      id: row.id,
      sender_name: row.character_name || row.sender_name || 'Unknown Sender',
      sender_email: row.character_email || row.sender_email || 'unknown@example.com',
      sender_avatar: row.character_avatar_url || row.sender_avatar,
      subject: row.subject,
      preview: row.preview,
      content: row.body || row.content || '',
      timestamp: row.email_timestamp || row.created_at,
      status: row.status,
      priority: row.priority,
      has_attachments: row.has_attachments,
      tags: row.tags || [],
      category: row.category,
      // Include mission-related fields
      mission_id: row.mission_id,
      stage_id: row.stage_id,
      trigger_type: row.trigger_type,
    })) : [];

    return allEmails.filter((email: EmailData) => email.category === category);
  } catch (error) {
    console.error('Error in fetchEmailsByCategory:', error);
    return getFallbackEmails().filter((email: EmailData) => email.category === category);
  }
}

// Update email status (read/unread)
export async function updateEmailStatus(emailId: string, status: 'read' | 'unread'): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('mission_emails')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', emailId);

    if (error) {
      console.error('Error updating email status:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in updateEmailStatus:', error);
    return false;
  }
}

// Get unread email count
export async function getUnreadEmailCount(): Promise<number> {
  try {
    // Get current user from Supabase auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('User not authenticated:', authError);
      // Fallback to counting from hardcoded emails
      return getFallbackEmails().filter(email => 
        email.status === 'unread' && 
        email.category !== 'sent' && 
        email.category !== 'drafts'
      ).length;
    }

    // Call the database function to get emails for current stage, then count unread
    const { data, error } = await supabase.rpc('get_emails_for_current_stage', {
      p_user_id: user.id
    });

    if (error) {
      console.error('Error getting emails for current stage:', error);
      // Fallback to counting from hardcoded emails
      return getFallbackEmails().filter(email => 
        email.status === 'unread' && 
        email.category !== 'sent' && 
        email.category !== 'drafts'
      ).length;
    }

    // Count unread emails from the current stage
    const unreadCount = data ? data.filter((row: any) => 
      row.status === 'unread' && 
      row.category !== 'sent' && 
      row.category !== 'drafts'
    ).length : 0;

    return unreadCount;
  } catch (error) {
    console.error('Error in getUnreadEmailCount:', error);
    // Fallback to counting from hardcoded emails
    return getFallbackEmails().filter(email => 
      email.status === 'unread' && 
      email.category !== 'sent' && 
      email.category !== 'drafts'
    ).length;
  }
}

// Fallback data for when database is unavailable
function getFallbackEmails(): EmailData[] {
  return [
    {
      id: '1',
      sender_name: 'Dr. Sarah Chen',
      sender_email: 'sarah.chen@regionalhealthsystem.org',
      sender_avatar: 'https://i.pravatar.cc/40?img=1',
      subject: 'URGENT: System Overload - Immediate Action Required',
      preview: 'Our patient monitoring system is experiencing critical failures during peak hours. We need your expertise to design a scalable solution immediately.',
      content: `Dear System Designer,

We're facing a critical situation at Regional Health System. Our current patient monitoring infrastructure is failing under increasing load, and we're seeing dangerous delays in critical alerts.

**Current Crisis:**
- Patient monitoring alerts delayed by 15-30 seconds
- System crashes during shift changes (peak load times)
- 300% increase in patient volume over past 6 months
- Current system maxes out at 500 concurrent connections

**Immediate Requirements:**
- Handle 2000+ concurrent patient monitoring connections
- Sub-second alert delivery for critical events
- 99.9% uptime requirement
- Real-time data processing for vital signs
- HIPAA compliance mandatory

**Budget:** $50,000/month operational budget
**Timeline:** Solution needed within 48 hours

This is a matter of patient safety. People's lives depend on getting this right.

Best regards,
Dr. Sarah Chen
CTO, Regional Health System`,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      status: 'unread',
      priority: 'urgent',
      has_attachments: true,
      tags: ['crisis', 'healthcare', 'system-design'],
      category: 'primary',
    },
    {
      id: '2',
      sender_name: 'Mom',
      sender_email: 'mom@family.com',
      sender_avatar: 'https://i.pravatar.cc/40?img=2',
      subject: "Don't forget dinner this Sunday!",
      preview: "Hi honey! Just reminding you about family dinner this Sunday at 6 PM. Your dad is making his famous lasagna!",
      content: `Hi sweetie!

Just a quick reminder about family dinner this Sunday at 6 PM. Your dad has been talking about making his famous lasagna all week, and I think he's more excited than anyone else!

Aunt Martha will be joining us too, and she's been asking about your new job. She's so proud of you working on all those important computer systems.

Let me know if you need me to pick up anything from the store. Also, bring your appetite - you know how your dad cooks!

Love you lots,
Mom

P.S. - Don't work too hard on those computer things! Remember to take breaks! 💕`,
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      status: 'read',
      priority: 'normal',
      has_attachments: false,
      tags: ['family', 'personal'],
      category: 'primary',
    },
    {
      id: '3',
      sender_name: 'Mike Johnson',
      sender_email: 'mike.j@techstartup.io',
      sender_avatar: 'https://i.pravatar.cc/40?img=3',
      subject: 'E-commerce Platform Architecture Review',
      preview: "Following up on our discussion about the new e-commerce platform. We've prepared some initial requirements and would love your input.",
      content: `Hi there!

Hope you're doing well! Following up on our coffee chat last week about potentially working together on our new e-commerce platform.

**Project Overview:**
TechStartup is building a modern e-commerce platform to compete with the big players. We're expecting rapid growth and need an architecture that can scale.

**Key Requirements:**
- Handle 10,000+ concurrent users during flash sales
- Global CDN for product images and static content
- Real-time inventory management
- Multiple payment gateway integrations
- Mobile-first responsive design

**Current Status:**
We've got a small team of 5 developers and a budget of $30,000 for the initial infrastructure setup. Monthly operational budget is around $8,000.

**Timeline:**
- Architecture design: 2 weeks
- Development start: 1 month
- MVP launch: 3 months

Would you be interested in consulting on this project? We're looking for someone with your expertise to help design a solid foundation.

Let me know your thoughts and availability!

Best,
Mike Johnson
Lead Developer, TechStartup`,
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      status: 'unread',
      priority: 'normal',
      has_attachments: false,
      tags: ['project', 'e-commerce', 'consultation'],
      category: 'projects',
    },
    {
      id: '4',
      sender_name: 'TechCrunch',
      sender_email: 'noreply@techcrunch.com',
      sender_avatar: 'https://i.pravatar.cc/40?img=4',
      subject: 'AWS Announces New Serverless Database Service',
      preview: 'Amazon Web Services unveiled a new serverless database offering that promises to revolutionize how developers handle data persistence.',
      content: `AWS Announces Aurora Serverless v3 with Enhanced Auto-Scaling

Amazon Web Services today announced the general availability of Aurora Serverless v3, featuring improved auto-scaling capabilities and better cost optimization for variable workloads.

**Key Features:**
- Instant scaling from 0.5 to 128 ACUs
- Sub-second scaling response times
- 90% cost reduction for intermittent workloads
- Full MySQL and PostgreSQL compatibility

**Industry Impact:**
This release positions AWS to compete more directly with newer players in the serverless database space. Early beta users report significant cost savings and improved performance for applications with unpredictable traffic patterns.

**Pricing:**
Aurora Serverless v3 charges only for compute capacity used, with storage billed separately. Pricing starts at $0.12 per ACU-hour.

The service is now available in US-East-1, US-West-2, and EU-West-1, with additional regions planned for Q2.

Read the full technical specifications and migration guide on the AWS documentation portal.`,
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      status: 'unread',
      priority: 'normal',
      has_attachments: false,
      tags: ['aws', 'serverless', 'database'],
      category: 'news',
    },
    {
      id: '5',
      sender_name: 'Udemy Business',
      sender_email: 'learn@udemy.com',
      sender_avatar: 'https://i.pravatar.cc/40?img=5',
      subject: '🚀 Level Up Your Cloud Skills - 40% Off AWS Courses',
      preview: 'Master AWS architecture with our comprehensive course collection. Limited time offer: 40% off all cloud computing courses.',
      content: `🎯 Ready to Become an AWS Solutions Architect?

Transform your career with our comprehensive AWS training program! 

**What You'll Learn:**
✅ AWS Core Services (EC2, S3, RDS, Lambda)
✅ High Availability & Fault Tolerance Design
✅ Security Best Practices & IAM
✅ Cost Optimization Strategies
✅ Real-world Case Studies

**Course Highlights:**
- 35+ hours of video content
- Hands-on labs and projects
- Practice exams for AWS certification
- Lifetime access to course materials
- 30-day money-back guarantee

**Limited Time Offer: 40% OFF**
Use code: CLOUDPRO40
Valid until: This Sunday, 11:59 PM

🏆 **Student Success Stories:**
"This course helped me land a $120k AWS Solutions Architect role!" - Jennifer M.
"Best investment I made for my career" - David K.

**Bonus:** Enroll now and get free access to our AWS Certification Bootcamp (valued at $199)

[Start Learning Today] [View Full Curriculum]

Not interested? [Unsubscribe] | [Update Preferences]

Happy learning!
The Udemy Business Team`,
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      status: 'unread',
      priority: 'normal',
      has_attachments: false,
      tags: ['education', 'aws', 'promotion'],
      category: 'promotions',
    },
  ];
} 