import { configureStore, combineReducers } from '@reduxjs/toolkit';

// Import existing slices from features directory (following feature-based organization)
import authReducer from '../features/auth/authSlice';
import missionReducer from '../features/mission/missionSlice';
import designReducer from '../features/design/designSlice';

// Import store-based slices (cross-cutting concerns)
import emailReducer from './slices/emailSlice';
import mentorReducer from './slices/mentorSlice';

// Root reducer following Redux best practices
const rootReducer = combineReducers({
  // Feature-based state (domain-specific)
  auth: authReducer,
  mission: missionReducer,
  design: designReducer, // One graph editor; useMissionCanvas owns durable saves.

  // Cross-cutting concerns (shared across features)
  email: emailReducer,
  mentor: mentorReducer,

});

// Configure store with all middleware
export const store = configureStore({
  // Better Auth's HTTP-only cookie and the Worker database are the durable
  // sources of truth. Redux holds only session-scoped UI state.
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          // Ignore React Flow non-serializable data
          'design/setDraggedComponent',
          // Ignore mentor chat real-time data
          'mentor/addMessage',
        ],
        ignoredPaths: [
          'design.draggedComponent',
          'mentor.messages.*.timestamp', // Date objects in messages
        ],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production' && {
    name: 'System Design Tycoon',
    trace: true,
    traceLimit: 25,
  },
});

// Type definitions following Redux Toolkit patterns
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Re-export for consistency
export default store;
