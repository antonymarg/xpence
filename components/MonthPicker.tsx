import { theme } from "@/constants/theme";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import Button from "./Button";
import Icon from "./Icon";
import Modal from './Modal';
import Pressable from "./Pressable";
import Text from "./Text";


const MONTHS = [
    'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
    'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
];

interface MonthPickerProps {
    initialValue: Date;
    updateValue: (date: Date) => void;
    onClose: () => void;
}

function CustomMonthPicker({ initialValue, updateValue, onClose }: MonthPickerProps) {
    const [selectedMonth, setSelectedMonth] = useState(initialValue.getMonth())
    const [selectedYear, setSelectedYear] = useState(initialValue.getFullYear())

    const onConfirm = () => {
        updateValue(new Date(selectedYear, selectedMonth, 1))
    }

    return <Modal onClose={onClose}>
        <View style={styles.pickerContainer}>
            <View style={styles.yearPicker}>
                <Pressable onPress={() => setSelectedYear(selectedYear - 1)}>
                    <Icon name='chevron-back' />
                </Pressable>
                <Text>{selectedYear}</Text>
                <Pressable onPress={() => setSelectedYear(selectedYear + 1)}>
                    <Icon name='chevron-forward' />
                </Pressable>
            </View>
            <View style={styles.monthPicker}>
                {MONTHS.map((val, i) => (
                    <Pressable key={val} onPress={() => setSelectedMonth(i)} style={[styles.button, selectedMonth === i && styles.selectedButton]}>
                        <Text weight="bold">{val}</Text>
                    </Pressable>
                ))}
            </View>
            <View style={styles.buttonsContainer}>
                <Button onPress={onClose}>
                    <Text weight="bold">Cancel</Text>
                </Button>
                <Button background='primaryOrange' onPress={onConfirm}>
                    <Text weight="bold" color="white">Confirm</Text>
                </Button>
            </View>
        </View>
    </Modal>
}


const styles = StyleSheet.create({
    pickerContainer: {
        gap: theme.spacing.md
    },
    yearPicker: {
        flexDirection: 'row',
        gap: theme.spacing.md,
        alignSelf: 'center'
    },
    monthPicker: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        rowGap: theme.spacing.sm,
        justifyContent: 'space-between'
    },
    buttonsContainer: {
        flexDirection: 'row',
        marginLeft: 'auto'
    },
    button: {
        margin: theme.spacing.md,
        borderBottomColor: theme.colors.card,
        borderBottomWidth: 4
    },
    selectedButton: {
        borderBottomColor: theme.colors.primaryOrange,
        borderBottomWidth: 4
    }
});


export default CustomMonthPicker;