import React, { FC, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  Text,
  Alert,
  ScrollView,
} from "react-native";
import { NativeStackScreenProps } from "react-native-screens/lib/typescript/native-stack/types";
import { RootStackParamList } from "../ui/navigation.types";
import AppHeader from "../Components/AppHeader";
import BackButton from "../ui/BackButton";
import ProductDetail from "./ProductDetail";
import useAuth from "../hooks/useAuth";
import OptionButton from "../ui/OptionButton";
import OptionModal from "../Components/OptionModal";
import { Feather, AntDesign } from "@expo/vector-icons";
import colors from "../utils/colors";
import useClient from "../hooks/useClient";
import { runAxiosAsync } from "../api/runAxiosAsync";
import { showMessage } from "react-native-flash-message";
import LoadingSpinner from "../ui/loadingSpinner";
import { useDispatch } from "react-redux";
import { deleteItem, Product } from "../store/listings";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import ChatIcons from "../Components/ChatIcons";

type Props = NativeStackScreenProps<RootStackParamList, "SingleProduct">;

const SingleProduct: FC<Props> = ({ route }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [busy, setBusy] = useState(false);
  const { product, id } = route.params;
  const { authClient } = useClient();
  const { authState } = useAuth();
  const [fetchingChatId, setFetchingChatId] = useState(false);
  const [productInfo, setProductInfo] = useState<Product>();
  const dispatch = useDispatch();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const isAdmin = authState.profile?.id === productInfo?.seller.id;
  console.log("Is Admin:", isAdmin);

  const confirmDelete = async () => {
    const id = product?.id;
    if (!id) return;
    setBusy(true);
    const res = await runAxiosAsync<{ message: string }>(
      authClient.delete("/product/" + id)
    );
    setBusy(false);
    if (res?.message) {
      dispatch(deleteItem(id));
      showMessage({ message: res.message, type: "success" });
      navigation.navigate("Listings");
    }
  };

  const onDeletePress = () => {
    Alert.alert(
      "Are you sure?",
      "This action will remove this product permanently",
      [
        { text: "Delete", style: "destructive", onPress: confirmDelete },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  const menuOptions = [
    {
      name: "Edit",
      icon: <Feather name="edit" size={20} color={colors.primary} />,
      onPress: () => {
        setShowMenu(false);
        // Navigate to edit screen
        navigation.navigate("EditProduct", { product: product! });
      },
    },
    {
      name: "Delete",
      icon: <Feather name="trash-2" size={20} color={colors.primary} />,
      onPress: () => {
        setShowMenu(false);
        onDeletePress();
      },
    },
  ];

  const fetchProductInfo = async (id: string) => {
    const res = await runAxiosAsync<{ product: Product }>(
      authClient.get("/product/details/" + id)
    );
    if (res) {
      setProductInfo(res.product);
    }
  };

  // const onChatBtnPress = async () => {
  //   if (!productInfo) return;
  //   const res = await runAxiosAsync<{ conversationId: string }>(
  //     authClient.get("/conversation/with/" + productInfo.seller.id)
  //   );
  //   if (res) {
  //     navigation.navigate("ChatWindow", {
  //       conversationId: res.conversationId,
  //       peerProfile: productInfo.seller,
  //     });
  //   }
  // };

  const onChatBtnPress = async () => {
    if (!productInfo) return;
    setFetchingChatId(true);
    try {
      console.log(
        "Fetching conversation ID with seller:",
        productInfo.seller.id
      );

      const res = await runAxiosAsync<{ conversationId: string }>(
        authClient.get("/conversation/with/" + productInfo.seller.id)
      );
      setFetchingChatId(false);
      console.log("API response:", res);

      if (res?.conversationId) {
        console.log(
          "Navigating to ChatWindow with:",
          res.conversationId,
          productInfo.seller
        );
        navigation.navigate("ChatWindow", {
          conversationId: res.conversationId,
          peerProfile: productInfo.seller,
        });
      } else {
        showMessage({
          message: "Failed to start chat. Please try again.",
          type: "danger",
        });
      }
    } catch (error) {
      console.error("Error fetching conversation ID:", error);
      showMessage({
        message: "An error occurred. Please try again.",
        type: "danger",
      });
    }
  };

  useEffect(() => {
    if (id) fetchProductInfo(id);

    if (product) setProductInfo(product);
  }, [product, id]);

  return (
    <>
      <AppHeader
        backButton={<BackButton />}
        center={<View />}
        right={
          <OptionButton visible={isAdmin} onPress={() => setShowMenu(true)} />
        }
      />
      <View style={styles.container}>
        {productInfo ? <ProductDetail product={productInfo} /> : <></>}
        {!isAdmin && (
          <ChatIcons onPress={onChatBtnPress} busy={fetchingChatId} />
        )}
        {/* <Pressable style={styles.messageBtn} onPress={onChatBtnPress}>
          <AntDesign name="message1" size={20} color={colors.white} />
        </Pressable> */}
      </View>
      <OptionModal
        options={menuOptions}
        renderItem={({ icon, name, onPress }) => (
          <Pressable style={styles.optionItem} onPress={onPress}>
            {icon}
            <Text style={styles.optionTitle}>{name}</Text>
          </Pressable>
        )}
        visible={showMenu}
        onRequestClose={() => setShowMenu(false)}
      />

      <LoadingSpinner visible={busy} />
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  optionTitle: {
    paddingLeft: 5,
    color: colors.primary,
  },
  messageBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.active,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 20,
    right: 20,
  },
});

export default SingleProduct;
