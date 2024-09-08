import React, { FC } from "react";
import { TouchableOpacity, StyleSheet, Text, Pressable } from "react-native";
import colors from "../utils/colors";

interface Props {
  title: string;
  active?: boolean;
  onPress?(): void;
}

const AppButton: FC<Props> = ({ title, active = true, onPress }) => {
  return (
    <Pressable
      onPress={active ? onPress : null}
      style={[styles.button, active ? styles.btnActive : styles.btnDeActive]}
      // activeOpacity={0.7} // Adjust the opacity of the button when pressed
    >
      <Text style={styles.title}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: { padding: 10, borderRadius: 5, alignItems: "center" },
  btnActive: { backgroundColor: colors.primary },
  btnDeActive: { backgroundColor: colors.deActive },
  title: { color: colors.white, fontWeight: "700", letterSpacing: 1 },
});

export default AppButton;
