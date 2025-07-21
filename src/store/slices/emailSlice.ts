import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Email, EmailStatus, EmailCategory } from '../../types/email.types';
import { fetchEmails, fetchEmailsByCategory, type EmailData } from '../../services/emailService';

interface EmailState {
  // Email Data
  emails: Record<string, Email>; // Normalized by email ID
  emailsByCategory: Record<EmailCategory, string[]>; // Email IDs grouped by category
  unreadCount: number;
  
  // Current State
  selectedEmailId: string | null;
  activeCategory: EmailCategory;
  searchQuery: string;
  
  // Mission Email Progression
  missionEmailProgress: Record<string, MissionEmailProgress>; // Keyed by mission ID
  availableEmails: string[]; // Email IDs that can be shown to user
  
  // Mission Stage Data (from emails)
  missionStageData: Record<string, MissionStageData>; // Keyed by email ID
  
  // UI State
  isLoading: boolean;
  error: string | null;
  newEmailNotification: Email | null;
  
  // Filters
  filters: {
    showRead: boolean;
    showUnread: boolean;
    priority: 'all' | 'urgent' | 'normal';
  };
}

interface MissionEmailProgress {
  missionId: string;
  currentStage: number;
  maxStageCompleted: number;
  deliveredEmails: string[]; // Email IDs already delivered
  nextEligibleEmail: string | null; // Next email that can be unlocked
}

interface MissionStageData {
  missionId: string;
  stageId: string;
  stageNumber: number;
  stageTitle: string;
  problemDescription: string;
  systemRequirements: any[];
}

const initialState: EmailState = {
  emails: {},
  emailsByCategory: {
    inbox: [],
    sent: [],
    drafts: [],
    archive: [],
    urgent: [],
    primary: [],
    projects: [],
    news: [],
    promotions: [],
  },
  unreadCount: 0,
  
  selectedEmailId: null,
  activeCategory: 'inbox',
  searchQuery: '',
  
  missionEmailProgress: {},
  availableEmails: [],
  
  missionStageData: {},
  
  isLoading: false,
  error: null,
  newEmailNotification: null,
  
  filters: {
    showRead: true,
    showUnread: true,
    priority: 'all',
  },
};

// Async thunk for checking and delivering new emails after stage completion
export const checkForNewEmails = createAsyncThunk(
  'email/checkForNewEmails',
  async (params: { playerId: string; missionId: string; completedStage: number }, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/emails/check-progression', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      
      if (!response.ok) {
        throw new Error('Failed to check for new emails');
      }
      
      return await response.json();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

// Updated async thunk for loading emails filtered by current mission stage
export const loadUserEmails = createAsyncThunk(
  'email/loadUserEmails',
  async (_, { rejectWithValue }) => {
    try {
      // Use the updated emailService that filters by current mission stage
      const emails = await fetchEmails();
      
      // Convert EmailData to Email format for Redux state
      const convertedEmails: Email[] = emails.map((emailData: EmailData): Email => ({
        id: emailData.id,
        missionId: undefined, // Will be populated from database if available
        stageId: undefined, // Will be populated from database if available
        sender: {
          id: emailData.sender_email,
          name: emailData.sender_name,
          email: emailData.sender_email,
          avatar: emailData.sender_avatar,
        },
        subject: emailData.subject,
        preview: emailData.preview,
        body: emailData.content,
        category: emailData.category,
        status: emailData.status === 'draft' || emailData.status === 'sent' ? 
                emailData.status as EmailStatus : 
                emailData.status as EmailStatus,
        priority: emailData.priority as 'low' | 'normal' | 'high' | 'urgent',
        sentAt: emailData.timestamp,
        readAt: emailData.status === 'read' ? emailData.timestamp : undefined,
        isAccessible: true, // These emails are already filtered to be accessible
        triggerType: 'stage_complete',
        hasAttachments: emailData.has_attachments,
        attachments: emailData.has_attachments ? [] : undefined,
        isImportant: emailData.priority === 'high' || emailData.priority === 'urgent',
        isUrgent: emailData.priority === 'urgent',
        canReply: true,
        canForward: true,
        requiresAction: false,
      }));
      
      return convertedEmails;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

// New async thunk for loading emails by category (still filtered by stage)
export const loadEmailsByCategory = createAsyncThunk(
  'email/loadEmailsByCategory',
  async (category: EmailCategory, { rejectWithValue }) => {
    try {
      const emails = await fetchEmailsByCategory(category);
      
      // Convert EmailData to Email format for Redux state
      const convertedEmails: Email[] = emails.map((emailData: EmailData): Email => ({
        id: emailData.id,
        missionId: undefined,
        stageId: undefined,
        sender: {
          id: emailData.sender_email,
          name: emailData.sender_name,
          email: emailData.sender_email,
          avatar: emailData.sender_avatar,
        },
        subject: emailData.subject,
        preview: emailData.preview,
        body: emailData.content,
        category: emailData.category,
        status: emailData.status === 'draft' || emailData.status === 'sent' ? 
                emailData.status as EmailStatus : 
                emailData.status as EmailStatus,
        priority: emailData.priority as 'low' | 'normal' | 'high' | 'urgent',
        sentAt: emailData.timestamp,
        readAt: emailData.status === 'read' ? emailData.timestamp : undefined,
        isAccessible: true,
        triggerType: 'stage_complete',
        hasAttachments: emailData.has_attachments,
        attachments: emailData.has_attachments ? [] : undefined,
        isImportant: emailData.priority === 'high' || emailData.priority === 'urgent',
        isUrgent: emailData.priority === 'urgent',
        canReply: true,
        canForward: true,
        requiresAction: false,
      }));
      
      return { category, emails: convertedEmails };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

// NOTE: sendCollaborationInvitation has been moved to collaborationSlice.ts
// This removes the duplicate function that was causing conflicts
        invitation,
        invitedUser
      };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

const emailSlice = createSlice({
  name: 'email',
  initialState,
  reducers: {
    // Email Management
    addEmail: (state, action: PayloadAction<Email>) => {
      const email = action.payload;
      state.emails[email.id] = email;
      
      // Add to appropriate category
      if (!state.emailsByCategory[email.category].includes(email.id)) {
        state.emailsByCategory[email.category].push(email.id);
      }
      
      // Update unread count
      if (email.status === 'unread') {
        state.unreadCount++;
      }
      
      // Add to available emails if accessible
      if (email.isAccessible && !state.availableEmails.includes(email.id)) {
        state.availableEmails.push(email.id);
      }
    },
    
    updateEmail: (state, action: PayloadAction<{ id: string; updates: Partial<Email> }>) => {
      const { id, updates } = action.payload;
      const email = state.emails[id];
      
      if (email) {
        // Track read status change for unread count
        const wasUnread = email.status === 'unread';
        const nowRead = updates.status === 'read';
        
        state.emails[id] = { ...email, ...updates };
        
        if (wasUnread && nowRead) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      }
    },
    
    markEmailAsRead: (state, action: PayloadAction<string>) => {
      const emailId = action.payload;
      const email = state.emails[emailId];
      
      if (email && email.status === 'unread') {
        state.emails[emailId].status = 'read';
        state.emails[emailId].readAt = new Date().toISOString();
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    
    // Mission Email Progression
    updateMissionProgress: (state, action: PayloadAction<{
      missionId: string;
      completedStage: number;
      newAvailableEmails: string[];
    }>) => {
      const { missionId, completedStage, newAvailableEmails } = action.payload;
      
      // Update mission progress
      if (!state.missionEmailProgress[missionId]) {
        state.missionEmailProgress[missionId] = {
          missionId,
          currentStage: 0,
          maxStageCompleted: 0,
          deliveredEmails: [],
          nextEligibleEmail: null,
        };
      }
      
      const progress = state.missionEmailProgress[missionId];
      progress.maxStageCompleted = Math.max(progress.maxStageCompleted, completedStage);
      progress.currentStage = completedStage;
      
      // Add newly available emails
      newAvailableEmails.forEach(emailId => {
        if (!state.availableEmails.includes(emailId)) {
          state.availableEmails.push(emailId);
        }
        
        if (!progress.deliveredEmails.includes(emailId)) {
          progress.deliveredEmails.push(emailId);
        }
        
        // Mark email as accessible
        if (state.emails[emailId]) {
          state.emails[emailId].isAccessible = true;
        }
      });
    },
    
    // Mission Stage Data from Email
    setMissionStageData: (state, action: PayloadAction<{
      emailId: string;
      stageData: MissionStageData;
    }>) => {
      const { emailId, stageData } = action.payload;
      state.missionStageData[emailId] = stageData;
    },
    
    // UI State Management
    selectEmail: (state, action: PayloadAction<string | null>) => {
      state.selectedEmailId = action.payload;
    },
    
    setActiveCategory: (state, action: PayloadAction<EmailCategory>) => {
      state.activeCategory = action.payload;
      state.selectedEmailId = null; // Clear selection when changing categories
    },
    
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    
    updateFilters: (state, action: PayloadAction<Partial<typeof initialState.filters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    
    // Notifications
    showNewEmailNotification: (state, action: PayloadAction<Email>) => {
      state.newEmailNotification = action.payload;
    },
    
    clearEmailNotification: (state) => {
      state.newEmailNotification = null;
    },
    
    // Bulk Operations
    markAllAsRead: (state, action: PayloadAction<EmailCategory>) => {
      const category = action.payload;
      const emailIds = state.emailsByCategory[category];
      
      emailIds.forEach(emailId => {
        const email = state.emails[emailId];
        if (email && email.status === 'unread') {
          state.emails[emailId].status = 'read';
          state.emails[emailId].readAt = new Date().toISOString();
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      });
    },
    
    // Archive/Delete
    archiveEmail: (state, action: PayloadAction<string>) => {
      const emailId = action.payload;
      const email = state.emails[emailId];
      
      if (email) {
        // Remove from current category
        state.emailsByCategory[email.category] = state.emailsByCategory[email.category]
          .filter(id => id !== emailId);
        
        // Add to archive
        email.category = 'archive';
        state.emailsByCategory.archive.push(emailId);
      }
    },
    
    deleteEmail: (state, action: PayloadAction<string>) => {
      const emailId = action.payload;
      const email = state.emails[emailId];
      
      if (email) {
        // Remove from category
        state.emailsByCategory[email.category] = state.emailsByCategory[email.category]
          .filter(id => id !== emailId);
        
        // Update unread count if needed
        if (email.status === 'unread') {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
        
        // Remove from emails
        delete state.emails[emailId];
        
        // Remove from available emails
        state.availableEmails = state.availableEmails.filter(id => id !== emailId);
        
        // Clear selection if this email was selected
        if (state.selectedEmailId === emailId) {
          state.selectedEmailId = null;
        }
      }
    },
    
    // Error Handling
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    
    clearError: (state) => {
      state.error = null;
    },
  },
  
  extraReducers: (builder) => {
    builder
      // Load user emails
      .addCase(loadUserEmails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadUserEmails.fulfilled, (state, action) => {
        state.isLoading = false;
        
        const emails = action.payload;
        
        // Clear existing emails for fresh load
        state.emails = {};
        state.emailsByCategory = {
          inbox: [],
          sent: [],
          drafts: [],
          archive: [],
          urgent: [],
          primary: [],
          projects: [],
          news: [],
          promotions: [],
        };
        
        // Normalize emails
        emails.forEach((email: Email) => {
          state.emails[email.id] = email;
          if (!state.emailsByCategory[email.category].includes(email.id)) {
            state.emailsByCategory[email.category].push(email.id);
          }
          
          // Mark as available since these are already filtered for current stage
          if (!state.availableEmails.includes(email.id)) {
            state.availableEmails.push(email.id);
          }
        });
        
        // Calculate unread count
        state.unreadCount = emails.filter(email => email.status === 'unread').length;
      })
      .addCase(loadUserEmails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
    
    // Load emails by category
    builder
      .addCase(loadEmailsByCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadEmailsByCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        
        const { category, emails } = action.payload;
        
        // Clear existing emails for this category
        state.emailsByCategory[category] = [];
        
        // Add new emails
        emails.forEach((email: Email) => {
          state.emails[email.id] = email;
          if (!state.emailsByCategory[email.category].includes(email.id)) {
            state.emailsByCategory[email.category].push(email.id);
          }
          
          // Mark as available since these are already filtered for current stage
          if (!state.availableEmails.includes(email.id)) {
            state.availableEmails.push(email.id);
          }
        });
        
        // Recalculate unread count
        const allEmails = Object.values(state.emails);
        state.unreadCount = allEmails.filter(email => email.status === 'unread').length;
      })
      .addCase(loadEmailsByCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
    
    // Send collaboration invitation
    builder
      .addCase(sendCollaborationInvitation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendCollaborationInvitation.fulfilled, (state) => {
        state.isLoading = false;
        // The email will be delivered to the invited user
        // We could add a sent email to the current user's sent folder if needed
      })
      .addCase(sendCollaborationInvitation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  addEmail,
  updateEmail,
  markEmailAsRead,
  updateMissionProgress,
  selectEmail,
  setActiveCategory,
  setSearchQuery,
  updateFilters,
  showNewEmailNotification,
  clearEmailNotification,
  markAllAsRead,
  archiveEmail,
  deleteEmail,
  setError,
  clearError,
  setMissionStageData,
} = emailSlice.actions;

export default emailSlice.reducer;

// Selectors
export const selectEmails = (state: { email: EmailState }) => state.email.emails;
export const selectEmailsByCategory = (category: EmailCategory) => (state: { email: EmailState }) =>
  state.email.emailsByCategory[category].map(id => state.email.emails[id]).filter(Boolean);
export const selectAvailableEmails = (state: { email: EmailState }) =>
  state.email.availableEmails.map(id => state.email.emails[id]).filter(Boolean);
export const selectUnreadCount = (state: { email: EmailState }) => state.email.unreadCount;
export const selectSelectedEmail = (state: { email: EmailState }) => {
  const selectedId = state.email.selectedEmailId;
  return selectedId ? state.email.emails[selectedId] : null;
};
export const selectMissionProgress = (missionId: string) => (state: { email: EmailState }) =>
  state.email.missionEmailProgress[missionId];

export const selectMissionStageFromEmail = (emailId: string) => (state: { email: EmailState }) =>
  state.email.missionStageData[emailId];

export const selectNewEmailNotification = (state: { email: EmailState }) => state.email.newEmailNotification; 