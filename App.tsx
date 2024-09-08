import "react-native-reanimated";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "./myApp/ui/navigation.types"; // Adjust the import path as necessary
import Navigator from "./myApp/navigator/index";
import FlashMessage from "react-native-flash-message";
import { Platform, SafeAreaView, StatusBar, StyleSheet } from "react-native";
import store from "./myApp/store";
import { Provider } from "react-redux";

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <Provider store={store}>
      <SafeAreaView style={styles.container}>
        <Navigator />
        <FlashMessage position="top" />
      </SafeAreaView>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});

export default App;
