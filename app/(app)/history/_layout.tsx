import TopBarNavigation from "@/components/TabBarNavigation";
import Text from "@/components/Text";
import { theme } from "@/constants/theme";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

const TABS = [
    { name: "index", titleKey: "insights.overall" },
    { name: "needs", titleKey: "insights.needs" },
    { name: "wants", titleKey: "insights.wants" },
    { name: "savings", titleKey: "insights.savings" },
];

function HistoryLayout() {
    const { t } = useTranslation();

    return (
        <>
            <View style={styles.pageContainer}>
                <View>
                    <Text size="title" weight="bold">
                        {t("history.title")}
                    </Text>
                    <Text size="lg">{t("history.subtitle")}</Text>
                </View>
            </View>
            <TopBarNavigation
                screenOptions={{
                    lazy: true,
                    tabBarScrollEnabled: true,
                    tabBarActiveTintColor: theme.colors.textLight,
                    tabBarInactiveTintColor: theme.colors.textLight,
                    tabBarItemStyle: {
                        width: "auto",
                        paddingHorizontal: 16,
                    },
                    tabBarStyle: {
                        borderBottomWidth: 0,
                        elevation: 0,
                        shadowOpacity: 0,
                        backgroundColor: theme.colors.background,
                    },
                    tabBarIndicatorStyle: {
                        backgroundColor: theme.colors.primaryOrange,
                        height: 4,
                    },
                    tabBarLabelStyle: {
                        fontFamily: theme.typography.fontFamily.medium,
                        fontWeight: theme.typography.weights.bold,
                        fontSize: theme.typography.sizes.lg,
                    },
                }}
            >
                {TABS.map(({ name, titleKey }) => (
                    <TopBarNavigation.Screen
                        key={name}
                        name={name}
                        options={{ title: t(titleKey) }}
                    />
                ))}
            </TopBarNavigation>
        </>
    );
}

const styles = StyleSheet.create({
    pageContainer: {
        backgroundColor: theme.colors.background,
        padding: theme.spacing.md,
        gap: theme.spacing.md,
    },
});

export default HistoryLayout;