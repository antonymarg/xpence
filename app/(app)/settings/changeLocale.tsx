import Button from "@/components/Button";
import Dropdown from '@/components/Dropdown';
import ErrorScreen from "@/components/ErrorScreen";
import Loading from "@/components/Loading";
import SettingsHeader from "@/components/settings/SettingsHeader";
import Text from "@/components/Text";
import { locales } from '@/constants/locale';
import { theme } from "@/constants/theme";
import useProfile from "@/hooks/useProfile";
import { useUpdateLocale } from "@/hooks/useProfileMutations";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import { setAppLanguage } from '@/lib/i18n';
import { Locale } from '@/types/users.types';
import { useNavigation } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from "react-native";

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
    const { mutate: updateLocale, isPending: isSaving } = useUpdateLocale();

    if (isProfileLoading) return <Loading />
    if (!isProfileSuccess || !profile) return <ErrorScreen onRefresh={invalidateProfile} />

    const selectedLocale = locale ?? profile.locale;

    const onLocaleUpdate = () => {
        if (isSaving) return;
        updateLocale(selectedLocale, {
            onSuccess: async () => {
                await setAppLanguage(selectedLocale);
                const languageTag = locales.find(({ code }) => code === selectedLocale)!.languageTag;
                navigator.goBack();
                showSuccessToast(t('update_locale_success', { lng: languageTag }));
            },
            onError: () => showErrorToast(t("common.actionFailed")),
        });
    };
    return <View style={styles.container}>
        <SettingsHeader label={t('change_locale')} href="/(app)/settings" />
        <Dropdown
            value={selectedLocale}
            onValueChange={setLocale}
            options={locales.map(({ code, labelKey }) => ({ label: t(labelKey), value: code }))}
        />
        <Button onPress={onLocaleUpdate} block background="gradient" loading={isSaving}>
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
});

export default ChangeLocale