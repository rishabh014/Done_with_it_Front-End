import React, { FC } from "react";
import { StyleSheet, View, Text, TextInput, Pressable } from "react-native";
import colors from "../utils/colors";
import AntDesign from "@expo/vector-icons/AntDesign";

interface Props {
  asButton?: boolean;
  onPress?(): void;
  onChange?(text: string): void;
  value?: string;
}

const SearchBar: FC<Props> = ({ asButton, onPress, onChange, value }) => {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <AntDesign name="search1" size={24} color="black" />
      {asButton ? (
        <View style={styles.textInput}>
          <Text style={styles.fakePlaceHolder}>Search here...</Text>
        </View>
      ) : (
        <TextInput
          placeholder="Search here..."
          style={[styles.textInput, styles.textInputFont]}
          autoFocus
          onChangeText={onChange}
          value={value}
          // onSubmitEditing={() => {
          //   console.log("submitted");
          // }}
        />
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 5,
    borderColor: colors.primary,
    padding: 10,
  },
  textInput: { paddingLeft: 10, flex: 1 },
  textInputFont: { color: colors.primary, fontSize: 18 },
  fakePlaceHolder: {
    color: colors.primary,
    fontSize: 18,
    opacity: 0.5,
    fontWeight: "200",
  },
});

export default SearchBar;
