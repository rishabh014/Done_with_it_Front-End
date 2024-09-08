import React, { FC, useEffect, useState } from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import colors from "../utils/colors";
import ChatNotification from "../ui/ChatNotification";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../ui/navigation.types";
import SearchBar from "../Components/SearchBar";
import CategoryList from "../Components/CategoryList";
import LatestProductList, {
  LatestProduct,
} from "../Components/LatestProductList";
import useClient from "../hooks/useClient";
import { runAxiosAsync } from "../api/runAxiosAsync";
import SearchModal from "../Components/SearchModal";
import socket, { handleSocketConnection } from "../socket";
import useAuth from "../hooks/useAuth";
import { useDispatch } from "react-redux";

interface Props {}

const Home: FC<Props> = () => {
  const [products, setProducts] = useState<LatestProduct[]>([]);
  const { navigate } = useNavigation<NavigationProp<RootStackParamList>>();
  const { authClient } = useClient();
  const [showSearchModal, setShowSearchModal] = useState(false);
  const { authState } = useAuth();
  const dispatch = useDispatch();
  const fetchLatestProduct = async () => {
    const res = await runAxiosAsync<{ products: LatestProduct[] }>(
      authClient.get("/product/latest")
    );
    if (res?.products) {
      setProducts(res.products);
    }
  };

  useEffect(() => {
    fetchLatestProduct();
  }, []);

  useEffect(() => {
    if (authState.profile) handleSocketConnection(authState.profile, dispatch);
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <>
      <ChatNotification onPress={() => navigate("Chats")} />
      <ScrollView style={styles.container}>
        <SearchBar
          asButton
          onPress={() => {
            setShowSearchModal(true);
          }}
        />
        <CategoryList
          onPress={(category) => navigate("ProductList", { category })}
        />
        <LatestProductList
          data={products}
          onPress={({ id }) => {
            navigate("SingleProduct", { id });
          }}
        />
      </ScrollView>
      <SearchModal visible={showSearchModal} onClose={setShowSearchModal} />
    </>
  );
};

const styles = StyleSheet.create({
  container: { padding: 15, flex: 1 },
});

export default Home;
