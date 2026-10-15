import * as userApi from '@/api/users.api';
import Button from "@/components/Button";
import Dropdown from '@/components/Dropdown';
import ErrorScreen from "@/components/ErrorScreen";
import Loading from "@/components/Loading";
import SettingsHeader from "@/components/settings/SettingsHeader";
import Text from "@/components/Text";
import { currencies } from '@/constants/currency';
import { theme } from "@/constants/theme";
import useProfile from "@/hooks/useProfile";
import { useNavigation } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import Toast from "react-native-toast-message";

function ChangeCurrency() {
    const {
        data: profile,
        isLoading: isProfileLoading,
        isSuccess: isProfileSuccess,
        invalidateProfile
    } = useProfile();
    const navigator = useNavigation()

    const [currency, setCurrency] = useState(profile?.currency || 'EUR')

    if (isProfileLoading) return <Loading />
    if (!isProfileSuccess || !profile) return <ErrorScreen onRefresh={invalidateProfile} />

    const onCurrencyUpdate = async () => {
        const { success } = await userApi.updateUserCurrency(currency);
        if (success) {
            Toast.show({
                type: "success",
                text1: "Currency updated successfully",
                visibilityTime: 5000,
                autoHide: true,
            });
            await invalidateProfile();
            navigator.goBack()
        }
    };
    return <View style={styles.container}>
        <SettingsHeader label='Change currency' href="/(app)/settings" />
        <Dropdown
            value={currency}
            onValueChange={setCurrency}
            items={Object.entries(currencies).map((cur) => ({ label: `${cur[0]} (${cur[1]})`, value: cur[0] }))}
        />
        <Button onPress={onCurrencyUpdate} block background="gradient">
            <Text weight="bold" color="white">
                Update Currency
            </Text>
        </Button>
    </View>
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.background,
        gap: theme.spacing.md,
        flex: 1,
    },
    budgetText: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: theme.spacing.sm,
    },
    updateButton: {
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.lg,
    },
});

export default ChangeCurrency