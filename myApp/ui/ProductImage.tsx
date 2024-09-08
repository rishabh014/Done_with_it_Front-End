import React, { FC } from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";

interface AppHeaderProps {
  uri: string;
}

const { width } = Dimensions.get("screen");
const imageWidth = width - 15;
const aspect = 16 / 9;

const ProductImage: FC<AppHeaderProps> = ({ uri }) => {
  return (
    <Image
      source={{ uri }}
      style={styles.image}
      resizeMethod="resize"
      resizeMode="cover"
    />
  );
};

const styles = StyleSheet.create({
  image: { width: imageWidth, height: imageWidth / aspect, borderRadius: 7 },
});

export default ProductImage;
