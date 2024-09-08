import React, { FC, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import AppHeader from "../Components/AppHeader";
import BackButton from "../ui/BackButton";
import colors from "../utils/colors";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../ui/navigation.types";
import HorizontalImageList from "../Components/HorizontalImageList";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5"; // Ensure correct import
import FormInput from "../ui/FormInput";
import DatePicker from "../ui/DatePicker";
import OptionModal from "../Components/OptionModal";
import useClient from "../hooks/useClient";
import { runAxiosAsync } from "../api/runAxiosAsync";
import { selectImages } from "../utils/helper";
import CategoryOptions from "../Components/CategoryOptions";
import AppButton from "../ui/AppButton";
import { newProductSchema, yupValidate } from "../utils/validator";
import { showMessage } from "react-native-flash-message";
import mime from "mime";
import LoadingSpinner from "../ui/loadingSpinner";
import _ from "lodash";
type Props = NativeStackScreenProps<RootStackParamList, "EditProduct">;

type ProductInfo = {
  name: string;
  description: string;
  category: string;
  price: string;
  purchasingDate: Date;
};

const imageOptions = [
  { value: "Use as thumbnail", id: "thumb" },
  { value: "Remove Image", id: "remove" },
];

const EditProduct: FC<Props> = ({ route }) => {
  const productInfoToUpdate = {
    ...route.params.product,
    price: route.params.product.price.toString(),
    date: new Date(route.params.product.date),
  };
  const [product, setProduct] = useState({ ...productInfoToUpdate });
  const [selectedImage, setSelectedImage] = useState("");
  const [showImageOptions, setShowImageOptions] = useState(false);
  const { authClient } = useClient();
  const [busy, setBusy] = useState(false);

  const isFormChanged = _.isEqual(productInfoToUpdate, product);

  const onLongPress = (image: string) => {
    setSelectedImage(image);
    setShowImageOptions(true);
  };

  const removeSelectedImage = async () => {
    // console.log(selectedImage);
    const notLocalImage = selectedImage.startsWith(
      "https://res.cloudinary.com"
    );

    const images = product.image;
    const newImages = images?.filter((img) => img !== selectedImage);
    setProduct({ ...product, image: newImages });
    if (notLocalImage) {
      const splittedItems = selectedImage.split("/");
      const imageId = splittedItems[splittedItems.length - 1].split(".")[0];
      await runAxiosAsync(
        authClient.delete(`/product/image/${product.id}/${imageId}`)
      );
    }
  };

  const handleOnImageSelect = async () => {
    const newImages = await selectImages();
    const oldImages = product.image || [];
    const images = oldImages.concat(newImages);

    setProduct({
      ...product,
      image: [...images],
    });
  };

  const makeSelectedImageAsThumbnail = () => {
    if (selectedImage.startsWith("https://res.cloudinary.com")) {
      setProduct({ ...product, thumbnail: selectedImage });
    }
  };

  const handleOnSubmit = async () => {
    // Prepare the data to be updated
    const dataToUpdate: ProductInfo = {
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price,
      purchasingDate: product.date,
    };

    // Validate the data using Yup schema
    const { error } = await yupValidate(newProductSchema, dataToUpdate);
    if (error) return showMessage({ message: error, type: "danger" });

    // Create a new FormData object to append the data
    const formData = new FormData();

    if (product.thumbnail) {
      formData.append("thumbnail", product.thumbnail);
    }

    type productInfoKeys = keyof typeof dataToUpdate;

    for (let key in dataToUpdate) {
      const value = dataToUpdate[key as productInfoKeys];
      if (value instanceof Date) {
        formData.append(key, value.toISOString());
      } else {
        formData.append(key, value);
      }
    }

    // Append images to the form data
    product.image?.forEach((img, index) => {
      if (!img.startsWith("https://res.cloudinary.com")) {
        const imageObj = {
          uri: img,
          name: `image_${index}`,
          type: mime.getType(img) || "image/jpeg", // Default to image/jpeg if type is not detected
        };
        formData.append("images", imageObj as any);
      }
    });

    // Send the data to the API
    setBusy(true);
    try {
      const res = await runAxiosAsync<{ message: string }>(
        authClient.patch(`/product/${product.id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
      );

      if (res) {
        showMessage({ message: res.message, type: "success" });
      }
    } catch (error) {
      console.error("Failed to update product:", error);
      showMessage({ message: "Failed to update product", type: "danger" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <AppHeader backButton={<BackButton />} />
      <View style={styles.container}>
        <ScrollView>
          <Text style={styles.title}>Images</Text>
          <HorizontalImageList
            images={product.image || []}
            onLongPress={onLongPress}
          />
          <Pressable style={styles.imageSelector} onPress={handleOnImageSelect}>
            <FontAwesome5 name="images" size={30} color={colors.primary} />
          </Pressable>
          <FormInput
            placeholder="Product Name"
            value={product.name}
            onChangeText={(name) => setProduct({ ...product, name })}
          />
          <FormInput
            placeholder="Price"
            keyboardType="numeric"
            value={product.price.toString()}
            onChangeText={(price) => setProduct({ ...product, price })}
          />
          <DatePicker
            title="Purchasing Date: "
            value={product.date}
            onChange={(date) => setProduct({ ...product, date })}
          />

          <CategoryOptions
            onSelect={(category) => setProduct({ ...product, category })}
            title={product.category || "Category"}
          />

          <FormInput
            placeholder="Description"
            value={product.description}
            onChangeText={(description) =>
              setProduct({ ...product, description })
            }
          />
          {!isFormChanged && (
            <AppButton title="Update Product" onPress={handleOnSubmit} />
          )}
        </ScrollView>
      </View>
      <OptionModal
        options={imageOptions}
        visible={showImageOptions}
        onRequestClose={setShowImageOptions}
        renderItem={(option) => {
          return <Text style={styles.option}>{option.value}</Text>;
        }}
        onPress={({ id }) => {
          if (id === "thumb") makeSelectedImageAsThumbnail();

          if (id === "remove") removeSelectedImage();
        }}
      />
      <LoadingSpinner visible={busy} />
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  title: { fontWeight: "600", fontSize: 16, color: colors.primary },
  imageSelector: {
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 7,
    borderColor: colors.primary,
    marginVertical: 10,
  },
  option: { paddingVertical: 10, color: colors.primary },
});

export default EditProduct;
