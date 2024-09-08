import { useNavigation } from "@react-navigation/native";
import React, { FC } from "react";
import { StyleSheet, Pressable, View } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import colors from "../utils/colors";

// Define props interface
interface Props {
  onPress?: () => void;
  indicate?: boolean;
}

// Functional component with TypeScript
const ChatNotification: FC<Props> = ({ onPress, indicate }) => {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <MaterialCommunityIcons
        name="message"
        size={24}
        color={indicate ? colors.active : colors.primary}
      />
      {indicate && <View style={styles.indicator}></View>}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: "flex-end",
    paddingHorizontal: 15,
    position: "relative",
  },
  indicator: {
    width: 15,
    height: 15,
    borderRadius: 8,
    backgroundColor: colors.active,
    position: "absolute",
    top: 0,
    right: 10,
    borderWidth: 2,
    borderColor: colors.white,
  },
});

export default ChatNotification;
