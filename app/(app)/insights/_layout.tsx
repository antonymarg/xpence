import Card from "@/components/Card";
import Icon from "@/components/Icon";
import MonthPicker from "@/components/MonthPicker";
import Pressable from "@/components/Pressable";
import TopBarNavigation from "@/components/TabBarNavigation";
import Text from "@/components/Text";
import { theme } from "@/constants/theme";
import { InsightsProvider, useInsightsContext } from "@/context/InsightContext";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

const TABS = [
    { name: 'index', titleKey: 'insights.overall' },
    { name: 'needs', titleKey: 'insights.needs' },
    { name: 'wants', titleKey: 'insights.wants' },
    { name: 'savings', titleKey: 'insights.savings' },
];

const InsightsRoot = () => {
    return (
        <InsightsProvider>
            <InsightsLayout />
        </InsightsProvider>
    );
};

const InsightsLayout = () => {
    const { t, i18n } = useTranslation()
    const [showPicker, setShowPicker] = useState(false);
    const { month, setMonth } = useInsightsContext()
    const updateMonth = (date: Date) => {
        setMonth(date)
        setShowPicker(false)
    }
    const monthLabel = new Intl.DateTimeFormat(
        i18n.resolvedLanguage || i18n.language,
        { month: 'long' },
    ).format(month)

    return <>
        <View style={styles.pageContainer}>
            <View>
                <Text size="title" weight="bold">
                    {t('insights.title')}
                </Text>
                <Text size="lg">{t('insights.subtitle')}</Text>
            </View>
            <Card padding="sm" style={{ alignItems: 'center', width: '50%', alignSelf: 'center' }}>
                <Pressable onPress={() => setShowPicker(true)} style={{ flexDirection: 'row' }}>
                    <Text size='lg' weight="bold">
                        {monthLabel} {month.getFullYear()}
                    </Text>
                    <Icon color={theme.colors.textDark} name="chevron-down-outline" />
                </Pressable>
            </Card>
            {showPicker && <MonthPicker
                onClose={() => setShowPicker(false)}
                initialValue={month}
                updateValue={updateMonth}
            />}
        </View>
        <TopBarNavigation
            screenOptions={{
                lazy: true,
                tabBarScrollEnabled: true,
                tabBarActiveTintColor: theme.colors.textLight,
                tabBarInactiveTintColor: theme.colors.textLight,
                tabBarItemStyle: {
                    width: 'auto',
                    paddingHorizontal: 16,
                },
                tabBarStyle: {
                    borderBottomWidth: 0,
                    elevation: 0,
                    shadowOpacity: 0,
                    backgroundColor: theme.colors.background
                },
                tabBarIndicatorStyle: {
                    backgroundColor: theme.colors.primaryOrange,
                    height: 4,
                },
                tabBarLabelStyle: {
                    fontFamily: theme.typography.fontFamily.medium,
                    fontWeight: theme.typography.weights.bold,
                    fontSize: theme.typography.sizes.lg
                }
            }}
        >
            {TABS.map(({ name, titleKey }) => (
                <TopBarNavigation.Screen key={name} name={name} options={{ title: t(titleKey) }} />
            ))}
        </TopBarNavigation>
    </>
}

const styles = StyleSheet.create({
    pageContainer: {
        backgroundColor: theme.colors.background,
        padding: theme.spacing.md,
        gap: theme.spacing.md
    }
})

export default InsightsRoot;