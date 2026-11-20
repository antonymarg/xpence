import { updateUserBudget } from "@/api/users.api";
import Button from "@/components/Button";
import ErrorScreen from "@/components/ErrorScreen";
import Loading from "@/components/Loading";
import SettingsHeader from "@/components/settings/SettingsHeader";
import Text from "@/components/Text";
import TextInput from "@/components/TextInput";
import { currencies } from "@/constants/currency";
import { theme } from "@/constants/theme";
import useProfile from "@/hooks/useProfile";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import { parseAmountInput } from "@/lib/utils";
import { useNavigation } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

function ChangeBudget() {
    const { t } = useTranslation();
    const {
        data: profile,
        isLoading: isProfileLoading,
        isSuccess: isProfileSuccess,
        invalidateProfile
    } = useProfile();
    const navigator = useNavigation()
    const [budgetDraft, setBudgetDraft] = useState<string | null>(null);
    const [hasBudgetError, setHasBudgetError] = useState(false);

    if (isProfileLoading) return <Loading />
    if (!isProfileSuccess || !profile) return <ErrorScreen onRefresh={invalidateProfile} />

    const onBudgetUpdate = async () => {
        const amount = parseAmountInput(budgetDraft ?? String(profile.budget / 100));
        if (amount === null) {
            setHasBudgetError(true);
            return;
        }

        const { success } = await updateUserBudget(Math.round(amount * 100));
        if (success) {
            showSuccessToast(t("settings.budgetUpdated"));
            await invalidateProfile();
            navigator.goBack()
        } else {
            showErrorToast(t("common.actionFailed"));
        }
    };
    return <View style={styles.container}>
        <SettingsHeader label={t("settings.changeBudgetTitle")} href="/(app)/settings" />
        <TextInput
            label={t("settings.newBudget")}
            onChangeText={(value) => {
                setBudgetDraft(value);
                setHasBudgetError(false);
            }}
            inputMode="decimal"
            value={budgetDraft ?? String(profile.budget / 100)}
            prefix={currencies[profile.currency]}
            error={hasBudgetError ? t("validation.validAmount") : undefined}
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
});

export default ChangeBudget