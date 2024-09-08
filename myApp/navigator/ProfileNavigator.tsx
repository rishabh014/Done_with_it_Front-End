import React, { FC } from "react";
import { StyleSheet, Text, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "../ui/navigation.types";
import Profile from "../views/Profile";
import Chats from "../views/Chats";
import Listings from "../views/Listings";
import SingleProduct from "../views/SingleProduct";
import ChatWindow from "../views/ChatWindow";
import EditProduct from "../views/EditProduct";

const Stack = createNativeStackNavigator<RootStackParamList>();
interface Props {}

const AppNavigator: FC<Props> = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Chats" component={Chats} />
      <Stack.Screen name="Listings" component={Listings} />
      <Stack.Screen name="SingleProduct" component={SingleProduct} />
      <Stack.Screen name="ChatWindow" component={ChatWindow} />
      <Stack.Screen name="EditProduct" component={EditProduct} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default AppNavigator;
