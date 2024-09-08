import React, { FC, useState } from "react";
import { StyleSheet, Text, Platform, Pressable } from "react-native";
import colors from "../utils/colors";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { formatDate } from "../utils/Date";

interface Props {
  title: string;
  value: Date;
  onChange(value: Date): void;
}

const isIOS = Platform.OS === "ios";

const DatePicker: FC<Props> = ({ title, value, onChange }) => {
  const [showPicker, setShowPicker] = useState(false);

  const visible = isIOS ? true : showPicker;

  const handleOnPress = () => {
    console.log("handleOnPress called");
    setShowPicker(true);
  };

  const handleChange = (_: DateTimePickerEvent, selectedDate?: Date) => {
    if (selectedDate) {
      console.log("Date selected:", selectedDate);
      onChange(selectedDate);
    }
    if (!isIOS) {
      setShowPicker(false);
    }
  };

  return (
    <Pressable onPress={handleOnPress} style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>
        {formatDate(value.toISOString(), "dd LLL yyyy")}
      </Text>
      {visible && (
        <DateTimePicker
          testID="dateTimePicker"
          value={value}
          onChange={handleChange}
          mode="date"
          display={isIOS ? "inline" : "default"}
        />
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    width: "97%",
    marginBottom: 15,
    padding: isIOS ? 0 : 8,
    borderWidth: isIOS ? 0 : 1,
    borderColor: colors.deActive,
    borderRadius: 5,
  },
  title: {
    color: colors.primary,
    flex: 1,
  },
  value: {
    color: colors.primary,
    flex: 1,
    textAlign: "left",
  },
});

export default DatePicker;
