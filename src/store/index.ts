import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Import existing slices from features directory (following feature-based organization)
import authReducer from '../features/auth/authSlice';
import gameReducer from '../features/game/gameSlice';
import userReducer from '../features/user/userSlice';
import missionReducer from '../features/mission/missionSlice';
import designReducer from '../features/design/designSlice';

// Import store-based slices (cross-cutting concerns)
import emailReducer from './slices/emailSlice';
import canvasReducer from './slices/canvasSlice';
import mentorReducer from './slices/mentorSlice';

// Import RTK Query APIs
import { emailApi } from './api/emailApi';
import { canvasApi } from './api/canvasApi';
import { mentorApi } from './api/mentorApi';

// Persist configuration following Redux patterns
const persistConfig = {
  key: 'system-design-tycoon',
  version: 1,
  storage,
  whitelist: ['auth', 'user'], // Only persist user data and auth
  blacklist: [
    'game', 
    'mission', 
    'design', 
    'email', 
    'canvas', 
    'mentor', // Don't persist real-time chat state
    'emailApi', 
    'canvasApi',
    'mentorApi'
  ],
};

// Root reducer following Redux best practices
const rootReducer = combineReducers({
  // Feature-based state (domain-specific)
  auth: authReducer,
  game: gameReducer,
  user: userReducer,
  mission: missionReducer,
  design: designReducer,
  
  // Cross-cutting concerns (shared across features)
  email: emailReducer,
  canvas: canvasReducer,
  mentor: mentorReducer,
  
  // RTK Query APIs for server state
  [emailApi.reducerPath]: emailApi.reducer,
  [canvasApi.reducerPath]: canvasApi.reducer,
  [mentorApi.reducerPath]: mentorApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store with all middleware
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
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
    })
    .concat(emailApi.middleware)
    .concat(canvasApi.middleware)
    .concat(mentorApi.middleware), // Add mentor API middleware
  devTools: process.env.NODE_ENV !== 'production' && {
    name: 'System Design Tycoon',
    trace: true,
    traceLimit: 25,
    // Action sanitizers for better debugging
    actionSanitizer: (action: any) => {
      // Sanitize large payloads
      if (action.type === 'mentor/setMessages' && action.payload?.messages?.length > 10) {
        return {
          ...action,
          payload: {
            ...action.payload,
            messages: `<<${action.payload.messages.length} MESSAGES>>`,
          },
        };
      }
      return action;
    },
  },
});

export const persistor = persistStore(store);

// Setup RTK Query listeners for caching and refetching
setupListeners(store.dispatch);

// Type definitions following Redux Toolkit patterns
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Re-export for consistency
export default store;