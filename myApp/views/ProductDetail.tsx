import React, { FC, useState } from "react";
import { View, StyleSheet, Text, ScrollView } from "react-native";
// import { Product } from "./SingleProduct";
import { formatDate } from "../utils/Date";
import AvatarView from "../ui/AvatarView";
import colors from "../utils/colors";
import { formatPrice } from "../utils/helper";
import ImageSlider from "../Components/ImageSlider";
import { Product } from "../store/listings";

interface Props {
  product: Product;
}

const ProductDetail: FC<Props> = ({ product }) => {
  console.log(product.thumbnail);
  return (
    <ScrollView style={styles.container}>
      <ImageSlider images={product.image} />

      <Text style={styles.category}>{product.category}</Text>

      <Text style={styles.price}>{formatPrice(product.price)}</Text>

      <Text style={styles.date}>
        Purchased on: {formatDate(product.date, "dd LLL yyyy")}
      </Text>

      <Text style={styles.name}>{product.name}</Text>

      <Text style={styles.description}>{product.description}</Text>

      <View style={styles.profileContainer}>
        <AvatarView uri={product.seller.avatar} size={60} />
        <Text style={styles.profileName}>{product.seller.name}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 15, flex: 1 },
  category: { marginTop: 15, color: colors.primary, fontWeight: "700" },
  price: {
    marginTop: 5,
    color: colors.active,
    fontWeight: "700",
    fontSize: 20,
  },
  date: {
    marginTop: 5,
    color: colors.active,
    fontWeight: "700",
  },
  name: {
    marginTop: 15,
    color: colors.primary,
    letterSpacing: 1,
    fontWeight: "700",
    fontSize: 20,
  },
  description: {
    marginTop: 15,
    color: colors.primary,
    letterSpacing: 0.5,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  profileName: {
    paddingLeft: 15,
    color: colors.primary,
    letterSpacing: 0.5,
    fontWeight: "600",
    fontSize: 20,
  },
});

export default ProductDetail;
