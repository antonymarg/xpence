import Button from "@/components/Button";
import ErrorScreen from "@/components/ErrorScreen";
import Icon from "@/components/Icon";
import Loading from "@/components/Loading";
import SettingsOption from "@/components/settings/SettingsOption";
import Text from "@/components/Text";
import { theme } from "@/constants/theme";
import useProfile from "@/hooks/useProfile";
import { supabase } from "@/lib/supabase";
import { Redirect, useRouter } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

function SettingsPage() {
    const { t } = useTranslation();
    const router = useRouter();
    const {
        data: profile,
        isLoading: isProfileLoading,
        isSuccess: isProfileSuccess,
        invalidateProfile
    } = useProfile();

    const signOut = async () => {
        await supabase.auth.signOut();
        router.replace("/(auth)/(tabs)/login");
    };

    if (isProfileLoading) return <Loading />

    if (!isProfileSuccess) {
        return (
            <ErrorScreen onRefresh={invalidateProfile} />
        );
    }

    if (!profile) return <Redirect href="/(auth)/(tabs)/login" />

    return (
        <View style={styles.pageContainer}>
            <View style={styles.settingsGroup}>
                <Text size="xl" weight="bold">
                    {t("settings.financialPlan")}
                </Text>
                <SettingsOption label={t("settings.changeMonthlyBudget")} href="/(app)/settings/changeBudget" />
                <SettingsOption label={t("settings.manageCategories")} href="/(app)/settings/manageCategories" />
            </View>
            <View style={styles.settingsGroup}>
                <Text size="xl" weight="bold">
                    {t("settings.accountSettings")}
                </Text>
                <SettingsOption label={t("settings.changeCurrency")} href="/(app)/settings/changeCurrency" />
                <SettingsOption label={t("settings.changeLanguage")} href="/(app)/settings/changeLocale" />
            </View>
            <View style={styles.settingsGroup}>
                <Button onPress={signOut} background="transparent" style={styles.footer}>
                    <Text size='lg' color="error" weight="bold">
                        {t("settings.signOut")}
                    </Text>
                    <Icon color={theme.colors.error} name="exit" />
                </Button>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    pageContainer: {
        flexGrow: 1,
        backgroundColor: theme.colors.background,
        gap: theme.spacing.md,
    },
    settingsGroup: {
        gap: theme.spacing.sm
    },
    footer: {
        padding: 0,
        flexDirection: "row",
        justifyContent: "space-between",
    },
});

export default SettingsPage;
