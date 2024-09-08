import React, { FC, useEffect, useState } from "react";
import { StyleSheet, View, Text, FlatList } from "react-native";
import colors from "../utils/colors";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../ui/navigation.types";
import useClient from "../hooks/useClient";
import { runAxiosAsync } from "../api/runAxiosAsync";
import { LatestProduct } from "../Components/LatestProductList";
import ProductGridView from "../Components/ProductGridView";
import AppHeader from "../Components/AppHeader";
import BackButton from "../ui/BackButton";
import EmptyView from "../ui/EmptyView";
import ProductCard from "../ui/ProductCard";

type Props = NativeStackScreenProps<RootStackParamList, "ProductList">;
const colum = 3;
const ProductList: FC<Props> = ({ route, navigation }) => {
  const { authClient } = useClient();
  const [products, setProducts] = useState<LatestProduct[]>([]);
  const { category } = route.params;

  // const fetchProducts = async (category: string) => {
  //   const res = await runAxiosAsync<{ products: LatestProduct }>(
  //     authClient.get("/by-category/" + category)
  //   );
  //   if (res) {
  //     setProducts(res.products);
  //   }
  // };

  // useEffect(() => {
  //   fetchProducts(category);
  // }, [category]);

  const idOdd = products.length % colum !== 0;

  const fetchProducts = async (category: string) => {
    // console.log("Fetching products for category:", category);
    const res = await runAxiosAsync<{ products: LatestProduct[] }>(
      authClient.get(`/product/by-category/${category}`)
    );
    // console.log("API Response:", res);
    if (res && res.products) {
      setProducts(res.products);
    } else {
      console.warn("No products found or response is invalid");
    }
  };

  useEffect(() => {
    console.log("Category:", category);
    fetchProducts(category);
  }, [category]);

  if (!products.length)
    return (
      <View style={styles.container}>
        <AppHeader
          backButton={<BackButton />}
          center={<Text style={styles.title}>{category}</Text>}
        />
        <EmptyView title="There is no product in this category!!" />
      </View>
    );
  return (
    <>
      <View style={styles.container}>
        <AppHeader
          backButton={<BackButton />}
          center={<Text style={styles.title}>{category}</Text>}
        />
        {/* <Text style={styles.title}>{category}</Text> */}
        <FlatList
          data={products}
          numColumns={colum}
          renderItem={({ item, index }) => (
            <View
              style={{
                flex: idOdd && index === products.length - 1 ? 1 / colum : 1,
              }}
            >
              <ProductCard
                product={item}
                onPress={({ id }) =>
                  navigation.navigate("SingleProduct", { id })
                }
              />
            </View>
          )}
        />
        <ProductGridView data={products} onPress={() => {}} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  title: {
    fontWeight: "600",
    fontSize: 18,
    color: colors.primary,
    paddingBottom: 5,
  },
});

export default ProductList;
