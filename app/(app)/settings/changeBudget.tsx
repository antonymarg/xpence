import Button from "@/components/Button";
import ErrorScreen from "@/components/ErrorScreen";
import Loading from "@/components/Loading";
import SettingsHeader from "@/components/settings/SettingsHeader";
import Text from "@/components/Text";
import TextInput from "@/components/TextInput";
import { currencies } from "@/constants/currency";
import { theme } from "@/constants/theme";
import useProfile from "@/hooks/useProfile";
import { useUpdateBudget } from "@/hooks/useProfileMutations";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import { fromMinorUnits, parseAmountInput, toMinorUnits } from "@/lib/utils";
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
    const { mutate: updateBudget, isPending: isSaving } = useUpdateBudget();

    if (isProfileLoading) return <Loading />
    if (!isProfileSuccess || !profile) return <ErrorScreen onRefresh={invalidateProfile} />

    const onBudgetUpdate = () => {
        const value = budgetDraft ?? fromMinorUnits(profile.budget);
        if (parseAmountInput(value) === null) {
            setHasBudgetError(true);
            return;
        }

        if (isSaving) return;
        updateBudget(toMinorUnits(value), {
            onSuccess: () => {
                showSuccessToast(t("settings.budgetUpdated"));
                navigator.goBack();
            },
            onError: () => showErrorToast(t("common.actionFailed")),
        });
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
            value={budgetDraft ?? fromMinorUnits(profile.budget)}
            prefix={currencies[profile.currency]}
            error={hasBudgetError ? t("validation.validAmount") : undefined}
        />
        <Button onPress={onBudgetUpdate} block background="gradient" loading={isSaving}>
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