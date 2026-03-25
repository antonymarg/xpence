import Text from "@/components/Text";
import { theme } from "@/constants/theme";
import { Profile } from "@/types/users.types";
import React from "react";
import { StyleSheet, View } from "react-native";

interface HeaderProps {
  profile: Profile;
}

function Header({ profile }: HeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.avatar} />
      <View>
        <Text size="xs" heading>
          Welcome back
        </Text>
        <Text weight="bold">Hey, {profile.displayName}</Text>
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
});

export default Header;
