import React, { FC } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "../ui/navigation.types";
import AntDesign from "@expo/vector-icons/AntDesign";
import colors from "../utils/colors";

const Stack = createNativeStackNavigator<RootStackParamList>();
interface Props {
  onPress?: () => void;
  title: string;
}

const OptionSelector: FC<Props> = ({ onPress, title }) => {
  return (
    <Pressable style={styles.categorySelector} onPress={onPress}>
      <Text style={styles.categoryTitle}>{title}</Text>
      <AntDesign name="caretdown" color={colors.primary} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {},
  categorySelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
    padding: 8,
    borderWidth: 1,
    borderColor: colors.deActive,
    borderRadius: 5,
    width: "97%",
  },
  categoryTitle: { color: colors.primary },
});

export default OptionSelector;
