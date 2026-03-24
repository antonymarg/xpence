import { theme } from "@/constants/theme";
import { Profile } from "@/types/users.types";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface HeaderProps {
  profile: Profile;
}

function Header({ profile }: HeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.avatar} />
      <View>
        <Text style={styles.welcomeText}>Welcome back</Text>
        <Text style={styles.nameText}>Hey, {profile.displayName}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    alignItems: "center",
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: theme.colors.primaryRedBg,
  },
  welcomeText: {
    letterSpacing: 1.2,
    textTransform: "uppercase",
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.textLight,
  },
  nameText: {
    fontWeight: theme.typography.weights.bold,
    fontSize: theme.typography.sizes.md,
  },
});

export default Header;
