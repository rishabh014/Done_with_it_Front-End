import React, { FC, ReactNode } from "react";
import {
  View,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
} from "react-native";

interface Props {
  children: ReactNode; // Define children prop type
  style?: object; // Optional style prop
}

const CustomKeyAvoidingView: FC<Props> = ({ children, style }) => {
  return (
    <KeyboardAvoidingView
      style={[styles.container, style]} // Combine default styles with any additional styles passed as props
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <SafeAreaView style={styles.innerContainer}>{children}</SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
  },
});

export default CustomKeyAvoidingView;
