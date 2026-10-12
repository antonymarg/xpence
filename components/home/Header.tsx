import Text from "@/components/Text";
import { theme } from "@/constants/theme";
import { Profile } from "@/types/users.types";
import React from "react";
import { StyleSheet, View } from "react-native";
import Logo from "../Logo";

interface HeaderProps {
  profile: Profile;
}

function Header({ profile }: HeaderProps) {
  return (
    <View style={styles.container}>
      <Logo variant='short' height={50} width={50} />
      <View style={styles.welcomeContainer}>
        <Text size="xs" heading>
          Welcome back
        </Text>
        <Text weight="bold">Hey, {profile.displayName}</Text>
      </View>
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    alignItems: "center",
    justifyContent: 'space-between'
  },
  welcomeContainer: {
    flexDirection: 'column',
  },
  avatar: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderColor: theme.colors.primaryOrange,
    borderRadius: 25,
  },
});

export default Header;
