import React, { FC } from "react";
import { StyleSheet, Text, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "../ui/navigation.types";
import Home from "../views/Home";
import Chats from "../views/Chats";
import ProductList from "../views/ProductList";
import ChatWindow from "../views/ChatWindow";
import SingleProduct from "../views/SingleProduct";

const Stack = createNativeStackNavigator<RootStackParamList>();
interface Props {}

const AppNavigator: FC<Props> = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Chats" component={Chats} />
      <Stack.Screen name="ProductList" component={ProductList} />
      <Stack.Screen name="SingleProduct" component={SingleProduct} />
      <Stack.Screen name="ChatWindow" component={ChatWindow} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default AppNavigator;
