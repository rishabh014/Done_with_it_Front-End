import React, { FC } from "react";
import { StyleSheet, View, Text, FlatList, Pressable } from "react-native";
import colors from "../utils/colors";
import categories from "../SVG/categories";

interface Props {
  onPress(category: string): void;
}

const List_Item_Size = 80;

const CategoryList: FC<Props> = ({ onPress }) => {
  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={categories}
        renderItem={({ item }) => {
          return (
            <Pressable
              onPress={() => onPress(item.name)}
              style={styles.listItem}
            >
              <View style={styles.iconContainer}>{item.icon}</View>
              <Text numberOfLines={2} style={styles.categoryName}>
                {item.name}
              </Text>
            </Pressable>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginVertical: 20 },
  listItem: { width: List_Item_Size, marginRight: 20 },
  iconContainer: {
    height: List_Item_Size,
    width: List_Item_Size,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 7,
    borderColor: colors.primary,
  },
  categoryName: {
    fontSize: 12,
    textAlign: "center",
    paddingTop: 2,
    color: colors.primary,
  },
});

export default CategoryList;
