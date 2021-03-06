import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import userReducer from '../features/userSlice';
import taskReducer from '../features/taskSlice'

export const store = configureStore({
  reducer: {
    // ここのuserとstate.user.user;の真ん中userは一致する必要がある
    user: userReducer,
    task:taskReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
