import { updateUserBudget } from "@/api/users.api";
import Button from "@/components/Button";
import ErrorScreen from "@/components/ErrorScreen";
import Loading from "@/components/Loading";
import SettingsHeader from "@/components/settings/SettingsHeader";
import Text from "@/components/Text";
import TextInput from "@/components/TextInput";
import { theme } from "@/constants/theme";
import useProfile from "@/hooks/useProfile";
import { useNavigation } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import Toast from "react-native-toast-message";

function ChangeBudget() {
    const { t } = useTranslation();
    const {
        data: profile,
        isLoading: isProfileLoading,
        isSuccess: isProfileSuccess,
        invalidateProfile
    } = useProfile();
    const navigator = useNavigation()
    const [budget, setBudget] = useState<number>(profile?.budget ?? 0 / 100);
    if (isProfileLoading) return <Loading />
    if (!isProfileSuccess || !profile) return <ErrorScreen onRefresh={invalidateProfile} />

    const onBudgetUpdate = async () => {
        const { success } = await updateUserBudget(budget);
        if (success) {
            Toast.show({
                type: "success",
                text1: t("settings.budgetUpdated"),
                visibilityTime: 5000,
                autoHide: true,
            });
            await invalidateProfile();
            navigator.goBack()
        }
    };
    return <View style={styles.container}>
        <SettingsHeader label={t("settings.changeBudgetTitle")} href="/(app)/settings" />
        <TextInput
            label={t("settings.newBudget")}
            onChangeText={(value) => setBudget(Number(value) * 100)}
            value={(budget / 100).toString()}
        />
        <Button onPress={onBudgetUpdate} block background="gradient">
            <Text weight="bold" color="white">
                {t("settings.updateBudget")}
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

export default ChangeBudget