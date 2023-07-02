import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './store';

type InitialState = {
  user: User | null;
};

const initialState: InitialState = {
  user: null,
};

export const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logIn: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    logOut: (state) => {
      state.user = null;
    },
  },
});

export const { logIn, logOut } = slice.actions;

export const selectUser = (state: RootState) => state.user.user;

export default slice.reducer;
