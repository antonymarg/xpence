import Text from "@/components/Text";
import { theme } from "@/constants/theme";
import {
    areRemindersSupported,
    getRemindersEnabled,
    setRemindersEnabled,
} from "@/lib/notifications";
import { showErrorToast } from "@/lib/toast";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Linking, StyleSheet, Switch, View } from "react-native";

function ReminderToggle() {
    const { t } = useTranslation();
    const [enabled, setEnabled] = useState<boolean | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        let cancelled = false;
        getRemindersEnabled()
            .then((value) => { if (!cancelled) setEnabled(value); })
            .catch(() => { if (!cancelled) setEnabled(false); });
        return () => { cancelled = true; };
    }, []);

    if (!areRemindersSupported) return null;

    const onToggle = async (value: boolean) => {
        setIsUpdating(true);
        setEnabled(value);
        try {
            const result = await setRemindersEnabled(value);
            setEnabled(result);
            if (value && !result) {
                showErrorToast(t("settings.notificationsDenied"));
                void Linking.openSettings();
            }
        } catch {
            setEnabled(!value);
            showErrorToast(t("common.actionFailed"));
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text>{t("settings.dailyReminder")}</Text>
            <Switch
                value={enabled ?? false}
                disabled={enabled === null || isUpdating}
                onValueChange={(value) => void onToggle(value)}
                trackColor={{ false: theme.colors.divider, true: theme.colors.primaryOrange }}
                thumbColor={theme.colors.card}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
});

export default ReminderToggle;
