import { theme } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useSegments } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import Button from "./Button";

type TabType = "home" | "insights" | "addRecord" | "history" | "settings";

const getIconColor = (activeTab: TabType, page: TabType) =>
  activeTab === page ? theme.colors.primaryRed : theme.colors.icons;

function TabBar() {
  const router = useRouter();
  const segments = useSegments();
  const activeTab = segments[1] as TabType;

  const navigateTo = (page: TabType) => {
    router.push(`/(app)/${page}`);
  };

  return (
    <View style={styles.container}>
      <Button size='sm' onPress={() => navigateTo("home")}>
        <Ionicons
          name="home"
          color={getIconColor(activeTab, "home")}
          style={styles.icons}
          size={24}
        />
      </Button>
      <Button size='sm' onPress={() => navigateTo("history")} background="transparent">
        <Ionicons
          name="list"
          color={getIconColor(activeTab, "history")}
          style={styles.icons}
          size={24}
        />
      </Button>
      <Button
        size='sm'
        onPress={() => navigateTo("addRecord")}
        background="gradient"
        style={styles.addRecordButton}
      >
        <Ionicons name="add" size={32} color="rgba(255,255,255,0.95)" />
      </Button>
      <Button size='sm' onPress={() => navigateTo("insights")} background="transparent">
        <Ionicons
          name="pie-chart"
          color={getIconColor(activeTab, "insights")}
          style={styles.icons}
          size={24}
        />
      </Button >
      <Button size="sm" onPress={() => navigateTo("settings")} background="transparent">
        <Ionicons
          name="settings"
          color={getIconColor(activeTab, "settings")}
          size={24}
          style={styles.icons}
        />
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.card,
    width: "100%",
    paddingBottom: theme.spacing.sm,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  icons: {
    paddingVertical: theme.spacing.sm,
  },
  addRecordButton: {
    width: 40,
    height: 40,
    padding: 0
  },
});

export default TabBar;
