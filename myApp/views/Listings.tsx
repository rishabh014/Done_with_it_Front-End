import React, { FC, useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import AppHeader from "../Components/AppHeader";
import BackButton from "../ui/BackButton";
import useClient from "../hooks/useClient";
import { runAxiosAsync } from "../api/runAxiosAsync";
import ProductImage from "../ui/ProductImage";
// import { Product } from "./SingleProduct";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../ui/navigation.types";
import { getListings, Product, updateListings } from "../store/listings";
import { useDispatch, useSelector } from "react-redux";

interface Props {}

// type Product = {
//   id: string;
//   name: string;
//   thumbnail?: string;
//   category: string;
//   price: number;
//   date: Date;
//   image?: string[];
//   description: string;
//   seller: {
//     id: string;
//     name: string;
//     avatar?: string;
//   };
// };

type ListingResponse = {
  products: Product[];
};

// Functional component with TypeScript
const Listings: FC<Props> = () => {
  // const [listings, setListings] = useState<Product[]>([]);
  const [fetching, setFetching] = useState(false);
  const { authClient } = useClient();
  const { navigate } = useNavigation<NavigationProp<RootStackParamList>>();
  const dispatch = useDispatch();
  const listings = useSelector(getListings);

  const fetchListings = async () => {
    setFetching(true);
    const res = await runAxiosAsync<ListingResponse>(
      authClient.get("/product/listings")
    );
    setFetching(false);
    if (res) {
      dispatch(updateListings(res.products));
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  return (
    <>
      <AppHeader
        backButton={<BackButton />}
        center={<Text>Listings</Text>}
        right={<View />} // Assuming no right component, you can pass an empty View
      />
      <View style={styles.container}>
        <FlatList
          refreshing={fetching}
          onRefresh={fetchListings}
          data={listings}
          contentContainerStyle={styles.flatList}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return (
              <Pressable
                style={styles.listItem}
                onPress={() => navigate("SingleProduct", { product: item })}
              >
                <ProductImage uri={item.thumbnail} />
                <Text style={styles.productName} numberOfLines={2}>
                  {item.name}
                </Text>
              </Pressable>
            );
          }}
        />
      </View>
    </>
  );
};

// Basic styling
const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  listItem: { paddingBottom: 15 },
  productName: {
    fontSize: 20,
    fontWeight: "500",
    letterSpacing: 1,
    paddingTop: 10,
  },
  flatList: { paddingBottom: 20 },
});

export default Listings;
