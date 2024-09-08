import {
  StyleSheet,
  Text,
  Modal,
  View,
  ScrollView,
  Pressable,
} from "react-native";
import colors from "../utils/colors";

interface Props<T> {
  visible: boolean;
  onRequestClose(state: boolean): void;
  options: T[];
  renderItem(item: T): JSX.Element;
  onPress?(item: T): void;
}
const OptionModal = <T extends unknown>({
  visible,
  onRequestClose,
  options,
  renderItem,
  onPress,
}: Props<T>) => {
  const handleClose = () => {
    onRequestClose(!visible);
  };

  return (
    <Modal transparent visible={visible} onRequestClose={handleClose}>
      <Pressable onPress={handleClose} style={styles.container}>
        <View style={styles.innerContainer}>
          <ScrollView>
            {options.map((item, index) => {
              return (
                <Pressable
                  key={index}
                  onPress={() => {
                    onPress!(item), handleClose();
                  }}
                >
                  {renderItem(item)}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  innerContainer: {
    backgroundColor: colors.deActive,
    padding: 10,
    borderRadius: 7,
    maxHeight: 200,
    width: "100%",
  },
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    backgroundColor: colors.backDrop,
  },
});

export default OptionModal;
