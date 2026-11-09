import Button from "@/components/Button";
import Icon from "@/components/Icon";
import Modal from "@/components/Modal";
import Pressable from "@/components/Pressable";
import Text from "@/components/Text";
import { theme } from "@/constants/theme";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import DateTimePicker, { type DateType, useDefaultStyles } from "react-native-ui-datepicker";

interface PeriodPickerProps {
    startDate?: Date;
    endDate?: Date;
    onChange: (startDate?: Date, endDate?: Date) => void;
}

const toDate = (value: DateType): Date | undefined => {
    if (value instanceof Date) return value;
    if (typeof value === "string" || typeof value === "number") {
        const date = new Date(value);
        return Number.isNaN(date.getTime()) ? undefined : date;
    }
    return value?.toDate();
};

const startOfDay = (date: Date) => {
    const value = new Date(date);
    value.setHours(0, 0, 0, 0);
    return value;
};

const endOfDay = (date: Date) => {
    const value = new Date(date);
    value.setHours(23, 59, 59, 999);
    return value;
};

function PeriodPicker({ startDate, endDate, onChange }: PeriodPickerProps) {
    const { t, i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [draftStartDate, setDraftStartDate] = useState<Date | undefined>(startDate);
    const [draftEndDate, setDraftEndDate] = useState<Date | undefined>(endDate);
    const calendarStyles = useDefaultStyles("light");
    const locale = i18n.language.toLowerCase().startsWith("el") ? "el" : "en";
    const dateFormatter = new Intl.DateTimeFormat(i18n.resolvedLanguage || i18n.language, {
        dateStyle: "short",
    });

    const open = () => {
        setDraftStartDate(startDate);
        setDraftEndDate(endDate);
        setIsOpen(true);
    };

    const applyRange = () => {
        if (!draftStartDate || !draftEndDate) return;
        onChange(startOfDay(draftStartDate), endOfDay(draftEndDate));
        setIsOpen(false);
    };

    const clearRange = () => {
        onChange(undefined, undefined);
        setIsOpen(false);
    };

    const periodLabel = startDate && endDate
        ? `${dateFormatter.format(startDate)} - ${dateFormatter.format(endDate)}`
        : t("history.allDates");

    return (
        <>
            <Pressable
                accessibilityRole="button"
                onPress={open}
                style={styles.trigger}
            >
                <Icon name="calendar" color={theme.colors.textLight} size={20} />
                <Text numberOfLines={1} size="md" weight="medium" style={styles.rangeLabel}>
                    {periodLabel}
                </Text>
                <Icon name="chevron-down-outline" color={theme.colors.textLight} size={18} />
            </Pressable>
            {isOpen && (
                <Modal onClose={() => setIsOpen(false)}>
                    <View style={styles.pickerContainer}>
                        <Text size="xl" weight="bold">{t("history.selectPeriod")}</Text>
                        <DateTimePicker
                            mode="range"
                            locale={locale}
                            startDate={draftStartDate}
                            endDate={draftEndDate}
                            allowRangeReset
                            styles={calendarStyles}
                            onChange={({ startDate: nextStartDate, endDate: nextEndDate }) => {
                                setDraftStartDate(toDate(nextStartDate));
                                setDraftEndDate(toDate(nextEndDate));
                            }}
                        />
                        <Pressable
                            disabled={!startDate && !endDate}
                            onPress={clearRange}
                            style={styles.clearButton}
                        >
                            <Text weight="bold" color="textLight">{t("history.clearPeriod")}</Text>
                        </Pressable>
                        <View style={styles.actions}>
                            <Button onPress={() => setIsOpen(false)}>
                                <Text weight="bold">{t("common.cancel")}</Text>
                            </Button>
                            <Button
                                background="primaryOrange"
                                disabled={!draftStartDate || !draftEndDate}
                                onPress={applyRange}
                            >
                                <Text color="white" weight="bold">{t("common.confirm")}</Text>
                            </Button>
                        </View>
                    </View>
                </Modal>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    trigger: {
        minHeight: 56,
        flexDirection: "row",
        alignItems: "center",
        gap: theme.spacing.sm,
        paddingHorizontal: theme.spacing.sm,
        backgroundColor: theme.colors.card,
        borderColor: theme.colors.divider,
        borderWidth: 1,
        borderRadius: theme.borderRadius.md,
    },
    rangeLabel: {
        flex: 1,
        flexShrink: 1,
    },
    pickerContainer: {
        gap: theme.spacing.md,
    },
    clearButton: {
        alignSelf: "flex-start",
        paddingVertical: theme.spacing.xs,
        paddingHorizontal: theme.spacing.sm,
    },
    actions: {
        flexDirection: "row",
        marginLeft: "auto",
    },
});

export default PeriodPicker;