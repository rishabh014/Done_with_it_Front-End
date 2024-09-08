import React, { FC } from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  ViewStyle,
} from "react-native";
import colors from "../utils/colors";

interface Props {
  images: string[];
  onPress?(item: string): void;
  onLongPress?(item: string): void;
  style?: StyleProp<ViewStyle>;
}

const HorizontalImageList: FC<Props> = ({
  images,
  onLongPress,
  onPress,
  style,
}) => {
  return (
    <FlatList
      data={images}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => {
        return (
          <Pressable
            onPress={() => onPress && onPress(item)}
            onLongPress={() => onLongPress && onLongPress(item)}
            style={styles.listItem}
          >
            <Image source={{ uri: item }} style={styles.image} />
          </Pressable>
        );
      }}
      contentContainerStyle={style}
      horizontal
      showsHorizontalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  listItem: {
    width: 70,
    height: 70,
    borderRadius: 7,
    marginLeft: 5,
    overflow: "hidden",
  },
  image: { flex: 1 },
});

export default HorizontalImageList;
