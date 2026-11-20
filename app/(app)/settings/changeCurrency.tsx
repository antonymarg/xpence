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
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import { Currency } from '@/types/users.types';
import { useNavigation } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

function ChangeCurrency() {
    const { t } = useTranslation();
    const {
        data: profile,
        isLoading: isProfileLoading,
        isSuccess: isProfileSuccess,
        invalidateProfile
    } = useProfile();
    const navigator = useNavigation()

    const [currency, setCurrency] = useState<Currency | null>(profile?.currency ?? null)

    if (isProfileLoading) return <Loading />
    if (!isProfileSuccess || !profile) return <ErrorScreen onRefresh={invalidateProfile} />

    const selectedCurrency = currency ?? profile.currency;

    const onCurrencyUpdate = async () => {
        const { success } = await userApi.updateUserCurrency(selectedCurrency);
        if (success) {
            showSuccessToast(t("settings.currencyUpdated"));
            await invalidateProfile();
            navigator.goBack()
        } else {
            showErrorToast(t("common.actionFailed"));
        }
    };
    return <View style={styles.container}>
        <SettingsHeader label={t("settings.changeCurrency")} href="/(app)/settings" />
        <Dropdown<Currency>
            value={selectedCurrency}
            onValueChange={setCurrency}
            options={Object.entries(currencies).map(([code, symbol]) => ({ label: `${code} (${symbol})`, value: code as Currency }))}
        />
        <Button onPress={onCurrencyUpdate} block background="gradient">
            <Text weight="bold" color="white">
                {t("settings.updateCurrency")}
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
});

export default ChangeCurrency