import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, RootState } from '../app/store';



export const userSlice = createSlice({
  name: 'user',
  initialState:{
      user:{uid:"",photo:"",displayName:""}
  },
  reducers: {
    login: (state,action) => {
     state.user = action.payload;
     
    },
    logout: (state) => {
   state.user = {uid:"",photo:"",displayName:""}
    
    },
   
  },
});

export const { login, logout } = userSlice.actions;


export const selectCount = (state: RootState) => state.user.user;

export default userSlice.reducer;
