import { theme } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, StyleSheet, View } from "react-native";
import DateTimePicker, { type DateType, useDefaultStyles } from "react-native-ui-datepicker";
import Button from "./Button";
import Modal from "./Modal";
import Pressable from "./Pressable";
import Text from "./Text";

interface DatePickerProps {
  value: Date;
  onChange: (date: Date) => void;
}

const toDate = (value: DateType): Date | undefined => {
  let date: Date | undefined;
  if (value instanceof Date) {
    date = value;
  } else if (typeof value === "string" || typeof value === "number") {
    date = new Date(value);
  } else {
    date = value?.toDate();
  }

  return date && !Number.isNaN(date.getTime()) ? date : undefined;
};

const formatDateForWeb = (date: Date) => {
  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);

  return `${year}-${month}-${day}`;
};

function DatePicker(props: DatePickerProps) {
  const { t, i18n } = useTranslation();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const selectedDate = toDate(props.value) ?? new Date();
  const [draftDate, setDraftDate] = useState<Date | undefined>(selectedDate);
  const calendarStyles = useDefaultStyles("light");
  const locale = i18n.language.toLowerCase().startsWith("el") ? "el" : "en";
  const formattedDate = new Intl.DateTimeFormat(
    i18n.resolvedLanguage || i18n.language,
    { dateStyle: "medium" },
  ).format(selectedDate);

  if (Platform.OS === "web") {
    return (
      <input
        type="date"
        value={formatDateForWeb(selectedDate)}
        onChange={(e) => {
          props.onChange(new Date(e.target.value));
        }}
      />
    );
  }

  return (
    <>
      <Pressable
        accessibilityRole="button"
        onPress={() => {
          setDraftDate(selectedDate);
          setDatePickerVisibility(true);
        }}
        style={styles.container}
      >
        <Ionicons name="calendar" size={24} color={theme.colors.textLight} />
        <Text weight="bold">{formattedDate}</Text>
      </Pressable>
      {isDatePickerVisible && (
        <Modal onClose={() => setDatePickerVisibility(false)}>
          <View style={styles.pickerContainer}>
            <Text size="xl" weight="bold">{t("common.date")}</Text>
            <DateTimePicker
              mode="single"
              locale={locale}
              date={draftDate}
              styles={calendarStyles}
              onChange={({ date }) => setDraftDate(toDate(date))}
            />
            <View style={styles.buttonsContainer}>
              <Button onPress={() => setDatePickerVisibility(false)}>
                <Text weight="bold">{t("common.cancel")}</Text>
              </Button>
              <Button
                background="primaryOrange"
                disabled={!draftDate}
                onPress={() => {
                  if (draftDate) props.onChange(draftDate);
                  setDatePickerVisibility(false);
                }}
              >
                <Text weight="bold" color="white">{t("common.confirm")}</Text>
              </Button>
            </View>
          </View>
        </Modal>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.gray,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
  },
  pickerContainer: {
    gap: theme.spacing.md,
  },
  buttonsContainer: {
    flexDirection: "row",
    marginLeft: "auto",
  },
});

export default DatePicker;
