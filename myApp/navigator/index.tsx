import React, { FC, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "../ui/navigation.types";
import AuthNavigator from "./AuthNavigator";
import { useDispatch } from "react-redux";
import { Profile, updateAuthState } from "../store/auth";

import { runAxiosAsync } from "../api/runAxiosAsync";

import LoadingSpinner from "../ui/loadingSpinner";
import useAuth from "../hooks/useAuth";
import TabNavigator from "./tabNavigator";
import useClient from "../hooks/useClient";
import asyncStorage, { Keys } from "../utils/asyncStorage";

const Stack = createNativeStackNavigator<RootStackParamList>();

interface Props {}

export type ProfileRes = {
  profile: {
    id: string;
    name: string;
    email: string;
    verified: boolean;
    avatar?: string;
  };
};

const Navigator: FC<Props> = () => {
  const dispatch = useDispatch();

  // const loggedIn = authState.profile ? true : false;
  const { loggedIn, authState } = useAuth();
  const { authClient } = useClient();

  const fetchAuthState = async () => {
    // return asyncStorage.clear();
    const token = await asyncStorage.get(Keys.AUTH_TOKEN);
    if (token) {
      dispatch(updateAuthState({ pending: true, profile: null }));
      const res = await runAxiosAsync<ProfileRes>(
        authClient.get("/auth/profile", {
          headers: {
            Authorization: "Bearer " + token,
          },
        })
      );
      if (res) {
        dispatch(
          updateAuthState({
            pending: false,
            profile: { ...res.profile, accessToken: token },
          })
        );
      } else {
        dispatch(updateAuthState({ pending: false, profile: null }));
      }
    }
  };
  useEffect(() => {
    fetchAuthState();
  }, []);
  console.log(authState);

  return (
    <NavigationContainer>
      <LoadingSpinner visible={authState.pending} />
      {!loggedIn ? <AuthNavigator /> : <TabNavigator />}
      {/* <ForgetPassword /> */}
    </NavigationContainer>
  );
};

export default Navigator;
