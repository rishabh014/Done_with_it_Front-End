import AsyncStorage from "@react-native-async-storage/async-storage";
import client from "../api/client";
import { runAxiosAsync } from "../api/runAxiosAsync";
import { useDispatch, useSelector } from "react-redux";
import { getAuthState, updateAuthState } from "../store/auth";
import { showMessage } from "react-native-flash-message";
import asyncStorage, { Keys } from "../utils/asyncStorage";
import useClient from "./useClient";

export interface SignInRes {
  profile: {
    id: string;
    email: string;
    name: string;
    verified: boolean;
    avatar?: string;
  };
  token: {
    refresh: string;
    access: string;
  };
}

type UserInfo = {
  email: string;
  password: string;
};

const useAuth = () => {
  const { authClient } = useClient();
  const dispatch = useDispatch();
  const authState = useSelector(getAuthState);

  const signIn = async (userinfo: UserInfo) => {
    dispatch(updateAuthState({ profile: null, pending: true }));

    try {
      const res = await runAxiosAsync<SignInRes>(
        client.post("/auth/sign-in", userinfo)
      );

      // Log the response for debugging purposes
      console.log("Sign-in response:", res);

      if (
        res &&
        res.token &&
        res.token.access &&
        res.token.refresh &&
        res.profile
      ) {
        //STORE THE TOKENS
        await asyncStorage.save(Keys.AUTH_TOKEN, res.token.access);
        await asyncStorage.save(Keys.REFRESH_TOKEN, res.token.refresh);
        // await AsyncStorage.setItem("access token", res.token.access);
        // await AsyncStorage.setItem("refresh token", res.token.refresh);
        dispatch(
          updateAuthState({
            profile: { ...res.profile, accessToken: res.token.access },
            pending: false,
          })
        );
      } else {
        console.error("Token data is missing or invalid");
        showMessage({
          message: "Token data is missing or invalid",
          type: "danger",
        });
        dispatch(updateAuthState({ profile: null, pending: false }));
      }
    } catch (error) {
      console.error("Sign-in error:", error);
      showMessage({ message: "Sign-in failed", type: "danger" });
      dispatch(updateAuthState({ profile: null, pending: false }));
    }
  };

  const signOut = async () => {
    const token = await asyncStorage.get(Keys.REFRESH_TOKEN);
    if (token) {
      dispatch(updateAuthState({ profile: authState.profile, pending: true }));
      const res = await runAxiosAsync(
        authClient.post("/auth/sign-out", { refreshToken: token })
      );
      await asyncStorage.remove(Keys.REFRESH_TOKEN);
      await asyncStorage.remove(Keys.AUTH_TOKEN);
      dispatch(updateAuthState({ profile: null, pending: false }));
    }
  };

  const loggedIn = authState.profile !== null;

  return { signIn, authState, loggedIn, signOut };
};

export default useAuth;
