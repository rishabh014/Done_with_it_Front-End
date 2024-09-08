import { FC } from "react";
import { StyleSheet, Text, View } from "react-native";
import colors from "../utils/colors";

interface Props {
  icon: JSX.Element;
  name: string;
}
const CategoryOption: FC<Props> = ({ icon, name }) => {
  return (
    <View style={styles.container}>
      <View style={styles.icon}>{icon}</View>
      <Text style={styles.category}>{name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  icon: { transform: [{ scale: 0.4 }] },
  container: { flexDirection: "row", alignItems: "center" },
  category: {
    color: colors.primary,
    paddingVertical: 10,
  },
});

export default CategoryOption;
