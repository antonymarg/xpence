import TopBarNavigation from "@/components/TabBarNavigation";
import Text from "@/components/Text";
import { theme } from "@/constants/theme";
import React from "react";
import { StyleSheet, View } from "react-native";

const InsightsLayout = () => {
    return <View style={styles.pageContainer}>
        <View>
            <Text size="title" weight="bold">
                Insights
            </Text>
            <Text size="lg">Analyse your spending</Text>
        </View>
        <TopBarNavigation
            screenOptions={{
                tabBarScrollEnabled: true,
                tabBarActiveTintColor: theme.colors.textLight,
                tabBarInactiveTintColor: theme.colors.textLight,
                tabBarItemStyle: {
                    width: 'auto', // Lets each tab take its natural width
                    paddingHorizontal: 16,
                },
                tabBarStyle: {
                    borderBottomWidth: 0,
                    elevation: 0,         // Removes Android shadow
                    shadowOpacity: 0,     // Removes iOS shadow
                    backgroundColor: theme.colors.background
                },
                tabBarIndicatorStyle: {
                    backgroundColor: theme.colors.primaryOrange,
                    height: 4
                },
                tabBarLabelStyle: {
                    fontFamily: theme.typography.fontFamily.medium,
                    fontWeight: theme.typography.weights.bold,
                    fontSize: theme.typography.sizes.lg,
                    textTransform: 'none',
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
    </View >
}

const styles = StyleSheet.create({
    pageContainer: {
        flex: 1,
        backgroundColor: theme.colors.background,
        padding: theme.spacing.md,
        gap: theme.spacing.sm
    }
})

export default InsightsLayout;