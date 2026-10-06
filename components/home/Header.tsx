import Text from "@/components/Text";
import { theme } from "@/constants/theme";
import { Profile } from "@/types/users.types";
import React from "react";
import { Image, StyleSheet, View } from "react-native";

interface HeaderProps {
  profile: Profile;
}

function Header({ profile }: HeaderProps) {
  return (
    <View style={styles.container}>
      <Image style={styles.avatar} source={{ uri: "https://i.pinimg.com/474x/55/01/40/550140140f6c9efa2cce59e986bc67c5.jpg" }} />
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
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    alignItems: "center",
  },
  avatar: {
    width: 36,
    height: 36,
    borderWidth: 2,
    borderColor: theme.colors.primaryOrange,
    borderRadius: 18,
  },
});

export default Header;
