import Text from "@/components/Text";
import { theme } from "@/constants/theme";
import { CategoryType } from "@/types/categories.types";
import React from "react";
import { StyleSheet, View } from "react-native";

interface InsightsViewProps {
    categoryType: CategoryType | "all";
}

function InsightsView({ categoryType }: InsightsViewProps) {
    return (
        <View style={styles.pageContainer}>
            <Text size="lg" weight="bold">
                Categories ranking
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    pageContainer: {
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingTop: theme.spacing.md,
        gap: theme.spacing.md,
    }
})


export default InsightsView;