import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import gameReducer from '../features/game/gameSlice';
import userReducer from '../features/user/userSlice';
import missionReducer from '../features/mission/missionSlice';
import designReducer from '../features/design/designSlice';
import emailReducer from './slices/emailSlice';
import canvasReducer from './slices/canvasSlice';
import { emailApi } from './api/emailApi';
import { canvasApi } from './api/canvasApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    game: gameReducer,
    user: userReducer,
    mission: missionReducer,
    design: designReducer,
    email: emailReducer,
    canvas: canvasReducer,
    [emailApi.reducerPath]: emailApi.reducer,
    [canvasApi.reducerPath]: canvasApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    })
    .concat(emailApi.middleware)
    .concat(canvasApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;