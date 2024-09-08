import React, { FC, useState } from "react";
import { StyleSheet, View } from "react-native";
import OptionSelector from "../views/OptionSelector";
import OptionModal from "./OptionModal";
import categories from "../SVG/categories";
import CategoryOption from "../ui/CategoryOptions";

interface Props {
  title: string;
  onSelect(category: string): void;
}

const CategoryOptions: FC<Props> = ({ title, onSelect }) => {
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  return (
    <View style={styles.container}>
      <OptionSelector
        title={title}
        onPress={() => setShowCategoryModal(true)}
      />

      <OptionModal
        visible={showCategoryModal}
        onRequestClose={() => setShowCategoryModal(false)}
        options={categories}
        renderItem={(item) => {
          return <CategoryOption icon={item.icon} name={item.name} />;
        }}
        onPress={(item) => {
          onSelect(item.name);
          setShowCategoryModal(false);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default CategoryOptions;
