import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Email, EmailStatus, EmailCategory } from '../../types/email.types';

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

const initialState: EmailState = {
  emails: {},
  emailsByCategory: {
    inbox: [],
    sent: [],
    drafts: [],
    archive: [],
    urgent: [],
  },
  unreadCount: 0,
  
  selectedEmailId: null,
  activeCategory: 'inbox',
  searchQuery: '',
  
  missionEmailProgress: {},
  availableEmails: [],
  
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

// Async thunk for loading initial emails
export const loadUserEmails = createAsyncThunk(
  'email/loadUserEmails',
  async (playerId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/emails/user/${playerId}`);
      
      if (!response.ok) {
        throw new Error('Failed to load emails');
      }
      
      return await response.json();
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
      // Load User Emails
      .addCase(loadUserEmails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadUserEmails.fulfilled, (state, action) => {
        state.isLoading = false;
        
        const { emails, missionProgress, availableEmails } = action.payload;
        
        // Normalize emails
        emails.forEach((email: Email) => {
          state.emails[email.id] = email;
          if (!state.emailsByCategory[email.category].includes(email.id)) {
            state.emailsByCategory[email.category].push(email.id);
          }
        });
        
        // Update mission progress
        state.missionEmailProgress = missionProgress || {};
        state.availableEmails = availableEmails || [];
        
        // Calculate unread count
        state.unreadCount = emails.filter((email: Email) => email.status === 'unread').length;
      })
      .addCase(loadUserEmails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Check for New Emails
      .addCase(checkForNewEmails.pending, (state) => {
        state.error = null;
      })
      .addCase(checkForNewEmails.fulfilled, (state, action) => {
        const { newEmails, updatedProgress } = action.payload;
        
        // Add new emails
        newEmails?.forEach((email: Email) => {
          if (!state.emails[email.id]) {
            state.emails[email.id] = email;
            state.emailsByCategory[email.category].push(email.id);
            
            if (email.status === 'unread') {
              state.unreadCount++;
            }
            
            // Show notification for the most recent email
            if (!state.newEmailNotification) {
              state.newEmailNotification = email;
            }
          }
        });
        
        // Update mission progress
        if (updatedProgress) {
          Object.assign(state.missionEmailProgress, updatedProgress);
        }
      })
      .addCase(checkForNewEmails.rejected, (state, action) => {
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
} = emailSlice.actions;

export default emailSlice.reducer;

// Selectors
export const selectEmails = (state: { email: EmailState }) => state.email.emails;
export const selectEmailsByCategory = (category: EmailCategory) => (state: { email: EmailState }) =>
  state.email.emailsByCategory[category].map(id => state.email.emails[id]).filter(Boolean);
export const selectAvailableEmails = (state: { email: EmailState }) =>
  state.email.availableEmails.map(id => state.email.emails[id]).filter(Boolean);
export const selectUnreadCount = (state: { email: EmailState }) => state.email.unreadCount;
export const selectSelectedEmail = (state: { email: EmailState }) =>
  state.email.selectedEmailId ? state.email.emails[state.email.selectedEmailId] : null;
export const selectMissionProgress = (missionId: string) => (state: { email: EmailState }) =>
  state.email.missionEmailProgress[missionId];
export const selectNewEmailNotification = (state: { email: EmailState }) => state.email.newEmailNotification; 