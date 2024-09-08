import React, { FC, useState } from "react";
import { View, StyleSheet, Pressable, Image } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import colors from "../utils/colors";

interface Props {
  uri?: string;
  size?: number;
  onPress?: () => void;
}

const AvatarView: FC<Props> = ({ size = 50, uri, onPress }) => {
  const iconContainerSize = size * 0.7;
  const iconSize = size * 0.8;
  return (
    <Pressable
      onPress={onPress}
      style={[
        { width: size, height: size, borderRadius: size / 2 },
        styles.container,
        !uri && styles.profileIcon,
      ]}
    >
      {uri ? (
        <Image source={{ uri }} style={styles.flex1} />
      ) : (
        <View
          style={[
            {
              width: iconContainerSize,
              height: iconContainerSize,
              borderRadius: iconContainerSize / 2,
            },
            styles.iconContainer,
          ]}
        >
          <FontAwesome name="user" size={iconSize} color={colors.white} />
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: { overflow: "hidden" },
  flex1: { flex: 1 },
  profileIcon: {
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
});

export default AvatarView;
