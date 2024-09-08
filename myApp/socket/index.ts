import client, { baseURL } from "../api/client";
import { io } from "socket.io-client";
import { Profile, updateAuthState } from "../store/auth";
import { Dispatch, UnknownAction } from "@reduxjs/toolkit";
import asyncStorage, { Keys } from "../utils/asyncStorage";
import { runAxiosAsync } from "../api/runAxiosAsync";
import { updateConversation } from "../store/conversation";

const socket = io(baseURL, { path: "/socket-message", autoConnect: false });

// Define the expected response structure
interface TokenResponse {
  token: {
    access: string;
    refresh: string;
  };
}

type MessageProfile = {
  id: string;
  name: string;
  avatar?: string;
};

type NewMessageResponse = {
  message: {
    id: string;
    time: string;
    text: string;
    user: MessageProfile;
  };
  from: string;
  conversationId: string;
};

export const handleSocketConnection = (
  profile: Profile,
  dispatch: Dispatch<UnknownAction>
) => {
  socket.auth = { token: profile?.accessToken };
  socket.connect();

  socket.on("chat:message", (data: NewMessageResponse) => {
    const { conversationId, from, message } = data;
    //this will update on going conversation or messages in between two users
    dispatch(
      updateConversation({
        conversationId,
        chat: message,
        peerProfile: from,
      })
    );
  });

  socket.on("connect_error", async (error) => {
    if (error.message === "jwt expired") {
      const refreshToken = await asyncStorage.get(Keys.REFRESH_TOKEN);
      const res = await runAxiosAsync<TokenResponse>(
        client.post(`${baseURL}/auth/refresh-token`, { refreshToken })
      );
      if (res) {
        await asyncStorage.save(Keys.AUTH_TOKEN, res.token.access);
        await asyncStorage.save(Keys.REFRESH_TOKEN, res.token.refresh);

        dispatch(
          updateAuthState({
            profile: { ...profile, accessToken: res.token.access },
            pending: false,
          })
        );
        socket.auth = { token: res.token.access };
        socket.connect();
      }
    }
  });
};

export default socket;
