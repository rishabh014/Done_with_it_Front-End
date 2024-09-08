import React, { FC } from "react";
import { StyleSheet, Pressable } from "react-native";
import colors from "../utils/colors";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  onPress?(): void;
  visible?: boolean;
}

const OptionButton: FC<Props> = ({ onPress, visible }) => {
  if (!visible) return null;
  return (
    <Pressable onPress={onPress}>
      <Ionicons
        name="ellipsis-vertical-sharp"
        color={colors.primary}
        size={20}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default OptionButton;
