import React, { FC, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Modal,
  Pressable,
  SafeAreaView,
  Platform,
  StatusBar,
  FlatListComponent,
  FlatList,
  Keyboard,
  Image,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import SearchBar from "./SearchBar";
import colors from "../utils/colors";
import EmptyView from "../ui/EmptyView";
import LottieView from "lottie-react-native";
import { runAxiosAsync } from "../api/runAxiosAsync";
import useClient from "../hooks/useClient";
import { debounce } from "lodash";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../ui/navigation.types";

interface Props {
  visible: boolean;
  onClose(visible: boolean): void;
}

const searchResults = [
  { id: 1, name: "iPhone 13 Pro Max" },
  { id: 2, name: "Samsung Galaxy S21 Ultra" },
  { id: 3, name: "Google Pixel 6 Pro" },
  { id: 4, name: "OnePlus 9 Pro" },
  { id: 5, name: "Sony Xperia 1 III" },
  { id: 6, name: "Canon EOS R5" },
  { id: 7, name: "Nikon Z7 II" },
  { id: 8, name: "Sony Alpha 1" },
  { id: 9, name: "MacBook Pro 16-inch" },
  { id: 10, name: "Dell XPS 13" },
  { id: 11, name: "HP Spectre x360" },
  { id: 12, name: "Microsoft Surface Laptop 4" },
  { id: 13, name: "Asus ROG Zephyrus G14" },
  { id: 14, name: "Google Pixel 5a" },
  { id: 15, name: "Sony A7 III" },
  { id: 16, name: "Canon EOS 90D" },
  { id: 17, name: "Samsung Galaxy Note 20 Ultra" },
  { id: 18, name: "Nikon D850" },
  { id: 19, name: "Asus ZenBook 14" },
  { id: 20, name: "Huawei MateBook X Pro" },
];

type SearchResult = {
  id: string;
  name: string;
  thumbnail?: string;
};

const SearchModal: FC<Props> = ({ visible, onClose }) => {
  const [keyBoardHeight, setKeyBoardHeight] = useState(0);
  const handleClose = () => {
    onClose(!visible);
  };
  const [busy, setBusy] = useState(false);
  const [query, setQuery] = useState("");
  const { authClient } = useClient();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [notFound, setNotFound] = useState(false);
  const { navigate } = useNavigation<NavigationProp<RootStackParamList>>();

  const searchProduct = async (query: string) => {
    if (query.trim().length >= 3) {
      return await runAxiosAsync<{ results: SearchResult[] }>(
        authClient.get("/product/search?name=" + query)
      );
    }
  };

  const searchDebounce = debounce(searchProduct, 300);
  searchDebounce(query);

  const handleChange = async (value: string) => {
    setNotFound(false);
    setQuery(value);
    setBusy(true);
    const res = await searchDebounce(value);
    setBusy(false);
    if (res) {
      if (res.results.length) setResults(res.results);
      else setNotFound(true);
    }
  };

  const handleOnResultPress = (result: SearchResult) => {
    navigate("SingleProduct", { id: result.id });
    handleClose();
  };

  useEffect(() => {
    const keyShowEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const keyHideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidShow";

    const keyShowListener = Keyboard.addListener(keyShowEvent, (evt) => {
      setKeyBoardHeight(evt.endCoordinates.height + 50);
    });

    const keyHideListener = Keyboard.addListener(keyHideEvent, (evt) => {
      setKeyBoardHeight(0);
    });

    return () => {
      keyShowListener.remove();
      keyHideListener.remove();
    };
  }, []);

  return (
    <Modal animationType="fade" onRequestClose={handleClose} visible={visible}>
      <SafeAreaView style={styles.container}>
        <View style={styles.innerContainer}>
          <View style={styles.header}>
            <Pressable onPress={handleClose}>
              <AntDesign name="arrowleft" size={24} color={colors.primary} />
            </Pressable>
            <View style={styles.bar}>
              <SearchBar onChange={handleChange} value={query} />
            </View>
          </View>
          {/* Busy Indicator */}
          {busy ? (
            <View style={styles.busyIconContainer}>
              <View style={styles.busyAnimationSize}>
                <LottieView
                  style={styles.flex1}
                  autoPlay
                  loop
                  source={require("../../assets/Animation - 1722574520484.json")}
                />
              </View>
            </View>
          ) : null}
          {/* Suggestions */}
          <View style={{ paddingBottom: keyBoardHeight }}>
            <FlatList
              data={!busy ? results : []}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.searchResultItem}
                  onPress={() => handleOnResultPress(item)}
                >
                  <Image
                    source={{ uri: item.thumbnail || undefined }}
                    style={styles.thumbnail}
                  />
                  <Text style={styles.suggestionListItem}>{item.name}</Text>
                </Pressable>
              )}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.suggestionList}
              ListEmptyComponent={
                notFound ? <EmptyView title="No results found...❌" /> : null
              }
            />
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: { flexDirection: "row", alignItems: "center" },
  bar: { flex: 1, marginLeft: 15 },
  innerContainer: { padding: 15, flex: 1 },
  suggestionList: { padding: 15 },
  suggestionListItem: {
    color: colors.primary,
    fontWeight: "600",
    paddingVertical: 7,
    fontSize: 18,
    marginLeft: 20,
  },
  busyIconContainer: {
    flex: 0.3,
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.5,
  },
  flex1: { flex: 1 },
  busyAnimationSize: { height: 100, width: 100 },
  thumbnail: { width: 60, height: 40 },
  searchResultItem: { flexDirection: "row", marginBottom: 7 },
});

export default SearchModal;
