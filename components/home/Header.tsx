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
        <Text size="xs" heading>
          {t("home.welcomeBack")}
        </Text>
        <Text weight="bold">{t("home.greeting", { name: profile.displayName })}</Text>
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
    alignItems: 'flex-end'
  },
});

export default Header;
