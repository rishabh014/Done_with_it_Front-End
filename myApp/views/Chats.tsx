import React, { FC, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Platform,
  StatusBar,
} from "react-native";
import AppHeader from "../Components/AppHeader";
import BackButton from "../ui/BackButton";

// Define props interface
interface Props {}

// Functional component with TypeScript
const Chats: FC<Props> = () => {
  return (
    <View style={styles.container}>
      <AppHeader
        backButton={<BackButton />}
        center={<Text>Chats</Text>}
        right={<View />} // Assuming no right component, you can pass an empty View
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default Chats;
