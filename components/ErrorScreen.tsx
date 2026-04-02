import { theme } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";
import Button from "./Button";
import Text from "./Text";
interface ErrorScreenProps {
  onRefresh: () => void;
}

function ErrorScreen({ onRefresh }: ErrorScreenProps) {
  return (
    <View style={styles.container}>
      <Ionicons name="thunderstorm" size={82} color={theme.colors.primaryRed} />
      <Text weight="bold">Oh no! Something went wrong.</Text>
      <Button onPress={onRefresh} background="primaryRed">
        <Text weight="bold" color="white">
          Please, try again
        </Text>
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: theme.spacing.lg,
  },
});

export default ErrorScreen;
