import { theme } from "@/constants/theme";
import React from "react";
import { ActivityIndicator } from "react-native";

function Loading() {
    return (
        <ActivityIndicator color={theme.colors.primaryOrange} size="large" />
    );

}

export default Loading;