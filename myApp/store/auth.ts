import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProfilerOnRenderCallback } from "react";
import { RootState } from ".";

export type Profile = {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  verified: boolean;
  accessToken: string;
};
interface AuthState {
  profile: null | Profile;
  pending: boolean;
}

const initialState: AuthState = {
  pending: false,
  profile: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateAuthState(authState, { payload }: PayloadAction<AuthState>) {
      authState.pending = payload.pending;
      authState.profile = payload.profile;
    },
  },
});

export const { updateAuthState } = authSlice.actions;
export const getAuthState = createSelector(
  (state: RootState) => {
    return state;
  },
  (state) => {
    return state.auth;
  }
);
export default authSlice.reducer;
