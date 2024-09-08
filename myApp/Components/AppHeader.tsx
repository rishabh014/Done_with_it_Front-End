import { useNavigation } from "@react-navigation/native";
import React, { FC } from "react";
import { StyleSheet, Pressable, View } from "react-native";

// Define props interface
interface Props {
  backButton: JSX.Element;
  center?: JSX.Element;
  right?: JSX.Element;
}

// Functional component with TypeScript
const AppHeader: FC<Props> = ({ backButton, center, right }) => {
  const { goBack, canGoBack } = useNavigation();

  return (
    <View style={styles.container}>
      {canGoBack() && (
        <Pressable onPress={goBack} style={styles.backButtonContainer}>
          {backButton}
        </Pressable>
      )}
      <View style={styles.centerContainer}>{center}</View>
      <View style={styles.rightContainer}>{right}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    height: 50,
  },
  backButtonContainer: {
    flex: 1,
  },
  centerContainer: {
    flex: 2,
    alignItems: "center",
  },
  rightContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
});

export default AppHeader;
