import React, { FC, useState } from "react";
import { StyleSheet, TextInput, TextInputProps } from "react-native";
import colors from "../utils/colors";

interface Props extends TextInputProps {}

const FormInput: FC<Props> = ({ style, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <TextInput
      style={[
        styles.input,
        style,
        isFocused ? styles.borderActive : styles.borderDeActive, // Place focus styles last
      ]}
      placeholderTextColor={colors.primary}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    width: 319,
    padding: 8,
    borderRadius: 5,
    marginBottom: 15,
  },
  borderDeActive: { borderWidth: 1, borderColor: colors.deActive },
  borderActive: { borderWidth: 1, borderColor: colors.primary },
});

export default FormInput;
