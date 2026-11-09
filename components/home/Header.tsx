import Text from "@/components/Text";
import { theme } from "@/constants/theme";
import { Profile } from "@/types/users.types";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import Logo from "../Logo";

interface HeaderProps {
  profile: Profile;
}

function Header({ profile }: HeaderProps) {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <Logo variant='short' height={50} width={50} />
      <View style={styles.welcomeContainer}>
        <Text size="xs" heading textAlign="right">
          {t("home.welcomeBack")}
        </Text>
        <Text weight="bold" textAlign="right" style={styles.greetingText}>
          {t("home.greeting", { name: profile.displayName })}
        </Text>
      </View>
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: theme.spacing.md,
    alignItems: "center",
    justifyContent: 'space-between'
  },
  welcomeContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    flexShrink: 1,
  },
  greetingText: {
    flexShrink: 1,
  },
});

export default Header;
