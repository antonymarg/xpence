import { theme } from "@/constants/theme";
import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

function Loading() {
    return (
        <View style={[styles.pageContainer, styles.alignCenterContainer]}>
            <ActivityIndicator size="large" />
        </View>
    );

}
const styles = StyleSheet.create({
    pageContainer: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    alignCenterContainer: {
        flex: 1,
        alignContent: "center",
        justifyContent: "center",
    }
})

export default Loading;