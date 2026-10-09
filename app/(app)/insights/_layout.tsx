import Card from "@/components/Card";
import Icon from "@/components/Icon";
import MonthPicker from "@/components/MonthPicker";
import Pressable from "@/components/Pressable";
import TopBarNavigation from "@/components/TabBarNavigation";
import Text from "@/components/Text";
import { theme } from "@/constants/theme";
import { useGlobalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
]

const covertParamToDate = (dateStr?: string) => {
    if (!dateStr) return new Date();
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? new Date() : date;
};

const InsightsLayout = () => {
    const [showPicker, setShowPicker] = useState(false);

    const router = useRouter()
    const { date } = useGlobalSearchParams<{ date: string }>()
    const selectedMonth = covertParamToDate(date)

    const updateMonth = (date: Date) => {
        console.log(date)
        router.setParams({ date: date.toISOString() })
        setShowPicker(false)
    }

    return <>
        <View style={styles.pageContainer}>
            <View>
                <Text size="title" weight="bold">
                    Monthly insights
                </Text>
                <Text size="lg">Analyse your spending</Text>
            </View>
            <Card padding="sm" style={{ alignItems: 'center', width: '50%', alignSelf: 'center' }}>
                <Pressable onPress={() => setShowPicker(true)} style={{ flexDirection: 'row' }}>
                    <Text size='lg' weight="bold">
                        {MONTHS[selectedMonth.getMonth()]} {selectedMonth.getFullYear()}
                    </Text>
                    <Icon color={theme.colors.textDark} name="chevron-down-outline" />
                </Pressable>
            </Card>
            {showPicker && <MonthPicker
                onClose={() => setShowPicker(false)}
                initialValue={selectedMonth}
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
            <TopBarNavigation.Screen
                name="index"
                options={{ title: 'Overall' }}
            />
            <TopBarNavigation.Screen
                name="needs"
                options={{ title: 'Needs' }}
            />
            <TopBarNavigation.Screen
                name="wants"
                options={{ title: 'Wants' }}
            />
            <TopBarNavigation.Screen
                name="savings"
                options={{ title: 'Savings' }}
            />
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

export default InsightsLayout;