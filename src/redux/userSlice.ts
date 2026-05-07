import { createSlice } from '@reduxjs/toolkit';
import type { User } from 'types/user';

const initState: User = {
  auth: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState: initState,
  reducers: {
    login(state) {
      state.auth = true;
    },
    logout(state) {
      state.auth = false;
    },
  },
});

export const { login, logout } = userSlice.actions; // генераторы действий

export default userSlice.reducer;
