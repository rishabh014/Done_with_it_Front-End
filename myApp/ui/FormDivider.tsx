import React, { FC } from "react";
import { ColorValue, DimensionValue, StyleSheet, View } from "react-native";
import colors from "../utils/colors";

interface Props {
  width?: DimensionValue;
  height?: DimensionValue;
  backgroundColor?: ColorValue;
}

const FormDivider: FC<Props> = ({
  width = "50%", // Default width for better visibility
  height = 2,
  backgroundColor = colors.deActive,
}) => {
  return (
    <View style={[styles.container, { width, height, backgroundColor }]} />
  );
};

const styles = StyleSheet.create({
  container: { alignSelf: "center", marginVertical: 15 },
});

export default FormDivider;
