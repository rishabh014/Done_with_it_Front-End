import { useNavigation } from "@react-navigation/native";
import React, { FC, useEffect } from "react";
import { StyleSheet, Pressable, View, Text } from "react-native";
import AppHeader from "../Components/AppHeader";
import BackButton from "../ui/BackButton";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../ui/navigation.types";
import AvatarView from "../ui/AvatarView";
import PeerProfile from "../ui/PeerProfile";
import { GiftedChat, IMessage } from "react-native-gifted-chat";
import useAuth from "../hooks/useAuth";
import EmptyChatContainer from "../ui/EmptyChatContainer";
import socket from "../socket";
import { useDispatch, useSelector } from "react-redux";
import {
  Conversation,
  selectConversationById,
  updateConversation,
} from "../store/conversation";
import { runAxiosAsync } from "../api/runAxiosAsync";
import useClient from "../hooks/useClient";

// Define props interface
type Props = NativeStackScreenProps<RootStackParamList, "ChatWindow">;

type OutGoingMessage = {
  message: {
    id: string;
    time: string;
    text: string;
    user: {
      id: string;
      name: string;
      avatar?: string;
    };
    to: string;
    conversationId: string;
  };
};

const getTime = (value: IMessage["createdAt"]) => {
  if (value instanceof Date) return value.toISOString();
  return new Date(value).toISOString();
};

const formatConversationToIMessage = (value?: Conversation): IMessage[] => {
  const formattedValues = value?.chats.map((chat) => {
    return {
      _id: chat.id,
      text: chat.text,
      createdAt: new Date(chat.time),
      user: {
        _id: chat.user.id,
        name: chat.user.name,
        avatar: chat.user.avatar,
      },
    };
  });
  const messages = formattedValues || [];
  return messages.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

// Functional component with TypeScript
const ChatWindow: FC<Props> = ({ route }) => {
  const { conversationId, peerProfile } = route.params;
  const { authState } = useAuth();
  const chats = useSelector(selectConversationById(conversationId));
  const dispatch = useDispatch();
  const { authClient } = useClient();

  const handleOnMessageSend = (messages: IMessage[]) => {
    if (!profile) return;
    const currentMessage = messages[messages.length - 1];

    const fetchOldChats = async () => {
      await runAxiosAsync(authClient("/conversation/chats/" + conversationId));
    };

    useEffect(() => {
      fetchOldChats();
    }, []);

    const newMessage: OutGoingMessage = {
      message: {
        id: currentMessage._id.toString(),
        text: currentMessage.text,
        time: getTime(currentMessage.createdAt),
        user: { id: profile.id, name: profile.name, avatar: profile.avatar },
      },
      conversationId,
      to: peerProfile.id,
    };
    //this will update store and UI as well
    dispatch(
      updateConversation({
        conversationId,
        chat: newMessage.message,
        peerProfile,
      })
    );

    //sending message to api
    socket.emit("chat:new", newMessage);
  };

  const profile = authState.profile;
  if (!profile) return null;
  return (
    <View style={styles.container}>
      <AppHeader
        backButton={<BackButton />}
        center={
          <PeerProfile name={peerProfile.name} avatar={peerProfile.avatar} />
        }
      />
      <GiftedChat
        messages={formatConversationToIMessage(chats)}
        user={{ _id: profile.id, name: profile.name, avatar: profile.avatar }}
        onSend={handleOnMessageSend}
        renderChatEmpty={() => <EmptyChatContainer />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
});

export default ChatWindow;
