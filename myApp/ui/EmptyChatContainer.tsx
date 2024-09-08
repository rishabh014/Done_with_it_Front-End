import React, { FC } from "react";
import { StyleSheet, Pressable, View, Text } from "react-native";
import colors from "../utils/colors";

// Define props interface
interface Props {}

// Functional component with TypeScript
const EmptyChatContainer: FC<Props> = () => {
  return (
    <View style={styles.container}>
      <View style={styles.messageContainer}>
        <Text style={styles.message}>
          Don’t wait for the perfect moment—seize it now! Start a chat, share a
          thought, or ask a question. You never know what wonderful outcomes
          might come from just reaching out. 💬✨
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    transform: [{ rotate: "180deg" }],
  },
  messageContainer: {
    backgroundColor: colors.deActive,
    padding: 15,
    borderRadius: 5,
  },
  message: { color: colors.active, fontSize: 12, textAlign: "center" },
});

export default EmptyChatContainer;
