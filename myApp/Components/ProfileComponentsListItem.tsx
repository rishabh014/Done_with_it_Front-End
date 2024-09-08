import React, { FC, useState } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  Text,
  StyleProp,
  ViewStyle,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import colors from "../utils/colors";
interface Props {
  antIconName: string;
  title: string;
  onPress?(): void;
  style?: StyleProp<ViewStyle>;
  active?: boolean;
}

const ProfileComponentsListItem: FC<Props> = ({
  antIconName,
  title,
  onPress,
  style,
  active,
}) => {
  return (
    <Pressable onPress={onPress} style={[styles.container, style]}>
      <View style={styles.btnContainer}>
        <AntDesign
          name={antIconName as any}
          size={24}
          color={active ? colors.active : colors.primary}
        />
        <Text
          style={[
            styles.title,
            { color: active ? colors.active : colors.primary },
          ]}
        >
          {title}
        </Text>
      </View>
      {active ? <View style={styles.indicator} /> : null}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  btnContainer: { flexDirection: "row", alignItems: "center" },
  title: { fontSize: 20, paddingLeft: 10 },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.active,
  },
});

export default ProfileComponentsListItem;
