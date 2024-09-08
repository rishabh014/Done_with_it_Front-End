import React, { FC } from "react";
import { StyleSheet, Text, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignIn from "../views/SignIn";
import SignUp from "../views/SignUp";
import ForgetPassword from "../views/ForgetPassword";
import { RootStackParamList } from "../ui/navigation.types";

const Stack = createNativeStackNavigator<RootStackParamList>();
interface Props {}

const AuthNavigator: FC<Props> = () => {
  return (
    <Stack.Navigator
      initialRouteName="SignIn"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default AuthNavigator;
