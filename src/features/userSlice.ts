import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, RootState } from "../app/store";

interface USER {
  displayName: string,
  photoURL: string
}

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: { uid: "", photoURL: "", displayName: "" },
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = { uid: "", photoURL: "", displayName: "" };
    },
    updateUserProfile: (state, action) => {
      state.user.displayName = action.payload.displayName;
      state.user.photoURL = action.payload.photoURL;
    },
  },
});

export const { login, logout, updateUserProfile } = userSlice.actions;

export const selectCount = (state: RootState) => state.user.user;

export default userSlice.reducer;
