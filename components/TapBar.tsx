import { theme } from "@/constants/theme";
import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useSegments } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import Pressable from "./Pressable";

type TabType = "home" | "insights" | "addRecord" | "achievements";

const getIconColor = (activeTab: TabType, page: TabType) =>
  activeTab === page ? theme.colors.primaryRed : theme.colors.icons;

function TapBar() {
  const router = useRouter();
  const segments = useSegments();
  const activeTab = segments[1] as TabType;

  const handlePress = (page: TabType) => {
    router.push(`/(app)/${page}`);
  };

  const logout = () => {
    supabase.auth.signOut();
    router.replace("/(auth)/login");
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={() => handlePress("home")}>
        <Ionicons
          name="home"
          color={getIconColor(activeTab, "home")}
          style={styles.icons}
          size={24}
        />
      </Pressable>
      <Pressable onPress={() => handlePress("insights")}>
        <Ionicons
          name="pie-chart"
          color={getIconColor(activeTab, "insights")}
          style={styles.icons}
          size={24}
        />
      </Pressable>
      <View style={styles.addRecordContainer}>
        <Pressable onPress={() => handlePress("addRecord")}>
          <LinearGradient
            colors={[theme.colors.primaryRed, theme.colors.primaryOrange]}
            style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              alignItems: "center",
              justifyContent: "center",
            }}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Ionicons name="add" size={36} color="rgba(255,255,255,0.95)" />
          </LinearGradient>
        </Pressable>
      </View>
      <Pressable onPress={() => handlePress("achievements")}>
        <Ionicons
          name="medal"
          color={getIconColor(activeTab, "achievements")}
          style={styles.icons}
          size={24}
        />
      </Pressable>
      <Pressable onPress={logout}>
        <Ionicons
          name="options"
          color={theme.colors.icons}
          size={24}
          style={styles.icons}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.card,
    width: "100%",
    paddingBottom: theme.spacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  icons: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
  },
  addRecordContainer: {
    paddingHorizontal: theme.spacing.sm,
    marginTop: -1 * theme.spacing.md,
  },
});

export default TapBar;
