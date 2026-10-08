import Text from "@/components/Text";
import { theme } from "@/constants/theme";
import { Profile } from "@/types/users.types";
import React from "react";
import { Image, StyleSheet, View } from "react-native";
import Logo from '../../assets/logo/xpence-icon.svg';

interface HeaderProps {
  profile: Profile;
}

function Header({ profile }: HeaderProps) {
  return (
    <View style={styles.container}>
      <Logo height={50} width={50} />
      <View style={styles.welcomeContainer}>
        <View>
          <Text size="xs" heading>
            Welcome back
          </Text>
          <Text weight="bold">Hey, {profile.displayName}</Text>
        </View>
        <Image style={styles.avatar} source={{ uri: "https://i.pinimg.com/474x/55/01/40/550140140f6c9efa2cce59e986bc67c5.jpg" }} />
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
    flexDirection: 'row',
    gap: theme.spacing.md,
    alignItems: 'center'
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
