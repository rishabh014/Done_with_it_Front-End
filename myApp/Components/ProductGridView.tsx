import React, { FC } from "react";
import { LatestProduct } from "./LatestProductList";
import GridView from "../ui/GridView";
import ProductCard from "../ui/ProductCard";

interface Props {
  data: LatestProduct[];
  onPress(item: LatestProduct): void;
}
const colum = 2;
const ProductGridView: FC<Props> = ({ data, onPress }) => {
  return (
    <GridView
      data={data}
      colum={colum}
      renderItem={(item) => <ProductCard product={item} onPress={onPress} />}
    />
  );
};

export default ProductGridView;
