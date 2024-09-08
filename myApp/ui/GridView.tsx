import React, { FC } from "react";
import { StyleSheet, View } from "react-native";
import colors from "../utils/colors";

interface Props<T> {
  data: T[];
  colum?: number;
  renderItem(item: T): JSX.Element;
}

const GridView = <T extends unknown>({
  data,
  colum = 2,
  renderItem,
}: Props<T>) => {
  return (
    <View style={styles.container}>
      {data.map((item, index) => {
        return (
          <View style={{ width: `${100 / colum}%` }} key={index}>
            {renderItem(item)}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    flexWrap: "wrap",
  },
});

export default GridView;
