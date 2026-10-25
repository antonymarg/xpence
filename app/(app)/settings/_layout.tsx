import Text from "@/components/Text";
import { theme } from "@/constants/theme";
import { Stack } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

function SettingsPageLayout() {
    const { t } = useTranslation();
    return (
        <View style={styles.pageContainer}>
            <View>
                <Text size="title" weight="bold">
                    {t("settings.title")}
                </Text>
                <Text size="lg">{t("settings.subtitle")}</Text>
            </View>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name='index' />
                <Stack.Screen name='changeBudget' />
                <Stack.Screen name='manageCategories' />
                <Stack.Screen name='changeCurrency' />
                <Stack.Screen name='changeLocale' />
            </Stack>

        </View>
    );
}

const styles = StyleSheet.create({
    pageContainer: {
        flex: 1,
        backgroundColor: theme.colors.background,
        padding: theme.spacing.md,
        gap: theme.spacing.md,
    },
});

export default SettingsPageLayout;
