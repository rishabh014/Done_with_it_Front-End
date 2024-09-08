import { baseURL } from "../api/client";
import axios from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import useAuth from "./useAuth";
import asyncStorage, { Keys } from "../utils/asyncStorage";
import { runAxiosAsync } from "../api/runAxiosAsync";
import { useDispatch, useSelector } from "react-redux";
import { getAuthState, updateAuthState } from "../store/auth";

const authClient = axios.create({ baseURL });

type Response = {
  token: { refresh: string; access: string };
  profile: {
    id: string;
    name: string;
    email: string;
    verified: boolean;
    avatar?: string;
  };
};

const useClient = () => {
  // const { authState } = useAuth();
  const authState = useSelector(getAuthState);
  const dispatch = useDispatch();
  const token = authState.profile?.accessToken;

  authClient.interceptors.request.use(
    (config) => {
      if (token && !config.headers.Authorization) {
        config.headers.Authorization = "Bearer " + token;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const refreshAuthLogic = async (failedRequest: any) => {
    try {
      console.log("Attempting to refresh token...");
      const refreshToken = await asyncStorage.get(Keys.REFRESH_TOKEN);
      console.log("Refresh token retrieved:", refreshToken);

      if (!refreshToken) {
        console.error("No refresh token available");
        return Promise.reject("No refresh token available");
      }

      const options = {
        method: "POST",
        data: { refreshToken },
        url: `${baseURL}/auth/refresh-token`,
      };

      const res = await runAxiosAsync<Response>(axios(options));
      console.log("Refresh token response:", res);

      if (res && res.token) {
        console.log("Token refreshed successfully");
        failedRequest.response.config.headers.Authorization =
          "Bearer " + res.token.access;

        //to handle signOut if token is expired
        if (failedRequest.response.config.url === "/auth/sign-out") {
          failedRequest.response.config.data = {
            refreshToken: res.token.refresh,
          };
        }

        await asyncStorage.save(Keys.AUTH_TOKEN, res.token.access);
        await asyncStorage.save(Keys.REFRESH_TOKEN, res.token.refresh);

        dispatch(
          updateAuthState({
            profile: { ...res.profile!, accessToken: res.token.access },
            pending: false,
          })
        );

        return Promise.resolve();
      } else {
        console.error("Failed to refresh token");
        return Promise.reject("Failed to refresh token");
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
      return Promise.reject(error);
    }
  };

  createAuthRefreshInterceptor(authClient, refreshAuthLogic);

  return { authClient };
};

export default useClient;
