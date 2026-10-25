import * as userApi from '@/api/users.api';
import Button from "@/components/Button";
import Dropdown from '@/components/Dropdown';
import ErrorScreen from "@/components/ErrorScreen";
import Loading from "@/components/Loading";
import SettingsHeader from "@/components/settings/SettingsHeader";
import Text from "@/components/Text";
import { locales } from '@/constants/locale';
import { theme } from "@/constants/theme";
import useProfile from "@/hooks/useProfile";
import { setAppLanguage } from '@/lib/i18n';
import { Locale } from '@/types/users.types';
import { useNavigation } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from "react-native";
import Toast from "react-native-toast-message";

function ChangeLocale() {
    const {
        data: profile,
        isLoading: isProfileLoading,
        isSuccess: isProfileSuccess,
        invalidateProfile
    } = useProfile();
    const navigator = useNavigation()
    const { t } = useTranslation()

    const [locale, setLocale] = useState<Locale | null>(null)

    if (isProfileLoading) return <Loading />
    if (!isProfileSuccess || !profile) return <ErrorScreen onRefresh={invalidateProfile} />

    const selectedLocale = locale ?? profile.locale;

    const onLocaleUpdate = async () => {
        const { success } = await userApi.updateUserLocale(selectedLocale);
        if (!success) return;

        await setAppLanguage(selectedLocale);
        const languageTag = locales.find(({ code }) => code === selectedLocale)!.languageTag;
        await invalidateProfile();
        navigator.goBack();
        Toast.show({
            type: "success",
            text1: t('update_locale_success', { lng: languageTag }),
            visibilityTime: 5000,
            autoHide: true,
        });
    };
    return <View style={styles.container}>
        <SettingsHeader label={t('change_locale')} href="/(app)/settings" />
        <Dropdown
            value={selectedLocale}
            onValueChange={setLocale}
            options={locales.map(({ code, labelKey }) => ({ label: t(labelKey), value: code }))}
        />
        <Button onPress={onLocaleUpdate} block background="gradient">
            <Text weight="bold" color="white">
                {t('update_language')}
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

export default ChangeLocale