import Logo from "@/components/Logo";
import TopBarNavigation from "@/components/TabBarNavigation";
import { theme } from "@/constants/theme";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AuthTabsLayout() {
    const { t } = useTranslation();

    return (
        <SafeAreaView style={styles.pageContainer}>
            <Logo variant="long" height='10%' style={styles.logo} />
            <View style={styles.tabContainer}>
                <TopBarNavigation
                    screenOptions={{
                        tabBarActiveTintColor: theme.colors.textLight,
                        tabBarInactiveTintColor: theme.colors.textLight,
                        tabBarItemStyle: {
                            flex: 1,
                            paddingHorizontal: 32,
                        },
                        tabBarStyle: {
                            borderBottomWidth: 0,
                            elevation: 0,
                            shadowOpacity: 0,
                            backgroundColor: theme.colors.background,
                        },
                        tabBarIndicatorStyle: {
                            backgroundColor: theme.colors.primaryRed,
                            height: 4,
                        },
                        tabBarLabelStyle: {
                            fontFamily: theme.typography.fontFamily.heavy,
                            fontWeight: theme.typography.weights.heavy,
                            fontSize: theme.typography.sizes.xxl,
                            textTransform: 'none',
                        },
                    }}
                >
                    <TopBarNavigation.Screen
                        name="login"
                        options={{ title: t('auth.loginTab') }}
                    />
                    <TopBarNavigation.Screen
                        name="signup"
                        options={{ title: t('auth.signupTab') }}
                    />
                </TopBarNavigation>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    pageContainer: {
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.xxl,
    },
    tabContainer: {
        flex: 3,
        flexDirection: "row",
        gap: theme.spacing.md,
    },
    logo: {
        padding: theme.spacing.md,
    },
});
