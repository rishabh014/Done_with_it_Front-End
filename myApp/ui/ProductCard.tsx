import React, { FC } from "react";
import { StyleSheet, View, Text, Pressable, Image } from "react-native";
import colors from "../utils/colors";
import { formatPrice } from "../utils/helper";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { LatestProduct } from "../Components/LatestProductList";

interface Props {
  product: LatestProduct;
  onPress(item: LatestProduct): void;
}
const colum = 2;
const ProductCard: FC<Props> = ({ product, onPress }) => {
  return (
    <Pressable style={styles.productContainer} onPress={() => onPress(product)}>
      {product.thumbnail ? (
        <Image
          source={{ uri: product.thumbnail }}
          style={styles.thumbnail}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.thumbnail, styles.noImageView]}>
          <MaterialIcons name="hide-image" size={35} color="black" />
        </View>
      )}
      <Text style={styles.price}>{formatPrice(product.price)}</Text>
      <Text style={styles.name}>{product.name}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  productContainer: { padding: 7 },
  thumbnail: {
    height: 120, // Fixed height for both images and "no image" views
    width: "100%",
    borderRadius: 5,
  },
  price: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.active,
    paddingTop: 5,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary,
  },
  noImageView: {
    backgroundColor: colors.deActive,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ProductCard;
