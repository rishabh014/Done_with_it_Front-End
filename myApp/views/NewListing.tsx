import React, { FC, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Platform,
  StatusBar,
  Pressable,
  FlatList,
  Image,
} from "react-native";
import FormInput from "../ui/FormInput";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import colors from "../utils/colors";
import DatePicker from "../ui/DatePicker";
import OptionModal from "../Components/OptionModal";
import categories from "../SVG/categories";
import CategoryOption from "../ui/CategoryOptions";
import AntDesign from "@expo/vector-icons/AntDesign";
import AppButton from "../ui/AppButton";
import CustomKeyAvoidingView from "../ui/CustomKeyAvoidingView";
import * as ImagePicker from "expo-image-picker";
import { showMessage } from "react-native-flash-message";
import HorizontalImageList from "../Components/HorizontalImageList";
import { newProductSchema, yupValidate } from "../utils/validator";
import mime from "mime";
import useClient from "../hooks/useClient";
import { runAxiosAsync } from "../api/runAxiosAsync";
import LoadingSpinner from "../ui/loadingSpinner";
import OptionSelector from "./OptionSelector";
import { selectImages } from "../utils/helper";
import CategoryOptions from "../Components/CategoryOptions";

interface Props {}

const defaultInfo = {
  name: "",
  description: "",
  category: "",
  price: "",
  purchasingDate: new Date(),
};

const imageOptions = [{ value: "Remove Image", id: "remove" }];

const Listing: FC<Props> = () => {
  const [productInfo, setProductInfo] = useState({ ...defaultInfo });
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showImageOptions, setShowImageOptions] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const { authClient } = useClient();
  const [busy, setBusy] = useState(false);
  const handleDateChange = (newDate: Date) => {
    console.log("Updating date to:", newDate);
    setSelectedDate(newDate);
  };

  const { category, name, price, description, purchasingDate } = productInfo;

  const handleChange = (field: keyof typeof defaultInfo) => (value: string) => {
    setProductInfo({ ...productInfo, [field]: value });
  };

  const handleSubmit = async () => {
    const { error } = await yupValidate(newProductSchema, productInfo);
    if (error) return showMessage({ message: error, type: "danger" });
    setBusy(true);
    //submit this form
    const formData = new FormData();

    type productInfoKeys = keyof typeof productInfo;

    for (let key in productInfo) {
      const value = productInfo[key as productInfoKeys];
      if (value instanceof Date) {
        formData.append(key, value.toISOString());
      } else {
        formData.append(key, value);
      }
    }

    //appending images
    const newImages = images.map((img, index) => ({
      name: "image_" + index,
      type: mime.getType(img),
      uri: img,
    }));

    for (let img of newImages) {
      formData.append("images", img as any);
    }

    const res = await runAxiosAsync(
      authClient.post("/product/list", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    );

    setBusy(false);

    console.log(res);
    if (res) {
      showMessage({ message: "Product added successfully", type: "success" });
      setProductInfo({ ...defaultInfo });
      setImages([]);
    }
  };

  const handleOnImageSelection = async () => {
    const newImages = await selectImages();
    setImages([...images, ...newImages]);
    try {
      const { assets } = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: false,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.3,
        allowsMultipleSelection: true,
      });

      if (!assets) return;

      const imageUris = assets.map(({ uri }) => uri);
      // setImages((prevImages) => [...prevImages, ...imageUris]);
    } catch (error) {
      showMessage({ message: (error as any).message, type: "danger" });
    }
  };

  return (
    <CustomKeyAvoidingView>
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Pressable
            onPress={handleOnImageSelection}
            style={styles.fileSelector}
          >
            <View style={styles.iconContainer}>
              <FontAwesome5 name="images" size={24} color="black" />
            </View>
            <Text style={styles.btnTitle}>Add images</Text>
          </Pressable>

          <HorizontalImageList
            images={images}
            onLongPress={(img) => {
              setSelectedImage(img);
              setShowImageOptions(true);
            }}
          />
          {/* <FlatList
            data={images}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => {
              return (
                <Image style={styles.selectedImage} source={{ uri: item }} />
              );
            }}
            // keyExtractor={(item) => item}
            horizontal
            showsHorizontalScrollIndicator={false}
          /> */}
        </View>

        <FormInput
          value={name}
          placeholder="Product Name"
          onChangeText={handleChange("name")}
        />
        <FormInput
          value={price}
          placeholder="Price"
          onChangeText={handleChange("price")}
          keyboardType="numeric"
        />
        <DatePicker
          title="Purchasing date: "
          value={purchasingDate}
          onChange={(purchasingDate) =>
            setProductInfo({ ...productInfo, purchasingDate })
          }
        />

        <CategoryOptions
          onSelect={handleChange("category")}
          title={category || "Category"}
        />

        {/* <OptionSelector
          title={category || "Category"}
          onPress={() => setShowCategoryModal(true)}
        /> */}

        <FormInput
          value={description}
          placeholder="Description"
          onChangeText={handleChange("description")}
          multiline
          numberOfLines={4}
        />

        <AppButton title={"List Product"} onPress={handleSubmit} />

        {/* //Image Options */}
        <OptionModal
          visible={showImageOptions}
          onRequestClose={() => setShowImageOptions(false)}
          options={imageOptions}
          renderItem={(item) => {
            return <Text style={styles.imageOptions}>{item.value}</Text>;
          }}
          onPress={(option) => {
            if (option.id === "remove") {
              const newImages = images.filter((img) => img !== selectedImage);
              setImages([...newImages]);
            }
          }}
        />
        {/* Category modal */}
        {/* <OptionModal
          visible={showCategoryModal}
          onRequestClose={() => setShowCategoryModal(false)}
          options={categories}
          renderItem={(item) => {
            return <CategoryOption {...item} />;
          }}
          onPress={(item) => {
            setProductInfo({ ...productInfo, category: item.name });
            setShowCategoryModal(false);
          }}
        /> */}
      </View>
      <LoadingSpinner visible={busy} />
    </CustomKeyAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    padding: 15,
    flex: 1,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 7,
    height: 70,
    width: 70,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 7,
  },
  btnTitle: { color: colors.primary, marginBottom: 15 },
  fileSelector: {
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
  },
  category: { color: colors.primary, paddingVertical: 10 },
  categorySelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
    padding: 8,
    borderWidth: 1,
    borderColor: colors.deActive,
    borderRadius: 5,
    width: "97%",
  },
  categoryTitle: { color: colors.primary },
  selectedImage: {
    width: 70,
    height: 70,
    borderRadius: 7,
    marginLeft: 5,
  },
  imageContainer: { flexDirection: "row" },
  imageOptions: {
    fontWeight: "600",
    fontSize: 18,
    color: colors.primary,
    padding: 10,
  },
});

export default Listing;
