import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import gameReducer from '../features/game/gameSlice';
import userReducer from '../features/user/userSlice';
import missionReducer from '../features/mission/missionSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    game: gameReducer,
    user: userReducer,
    mission: missionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;