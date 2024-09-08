import React, { FC } from "react";
import { View, StyleSheet, SafeAreaView, Image, Text } from "react-native";
import colors from "../utils/colors";

interface Props {}

const heading = "Online Marketplace for Used Goods";
const subHeading =
  "Buy or sell used goods with trust. Chat directly with sellers, ensuring a seamless, authentic experience.";

const WelcomeHeader: FC<Props> = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/hero.png")}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.heading}>{heading}</Text>
      <Text style={styles.subHeading}>{subHeading}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    flex: 1, // Ensure this component stretches to fill the space
  },
  image: {
    width: 270,
    height: 270,
    marginBottom: 10,
  },
  heading: {
    fontWeight: "600",
    fontSize: 24,
    textAlign: "center",
    marginBottom: 10,
    color: colors.primary,
  },
  subHeading: {
    fontSize: 12,
    textAlign: "center",
    color: colors.primary,
    lineHeight: 14,
  },
});

export default WelcomeHeader;
