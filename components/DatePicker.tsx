import { theme } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Pressable from "./Pressable";

interface DatePickerProps {
  value: Date;
  onChange: (date: Date) => void;
}
const formatDateForWeb = (date: Date) => {
  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);

  return `${year}-${month}-${day}`;
};

function DatePicker(props: DatePickerProps) {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    props.onChange(date);
    hideDatePicker();
  };

  if (Platform.OS === "web") {
    return (
      <input
        type="date"
        value={formatDateForWeb(props.value)}
        onChange={(e) => {
          props.onChange(new Date(e.target.value));
        }}
      />
    );
  }

  return (
    <View>
      <Pressable onPress={showDatePicker}>
        <View style={styles.container}>
          <Ionicons name="calendar" size={24} color={theme.colors.textLight} />
          <Text style={styles.text}>{props.value.toDateString()}</Text>
        </View>
      </Pressable>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        date={props.value}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#EEEEEE",
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  text: {
    color: theme.colors.textLight,
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold,
  },
});

export default DatePicker;
