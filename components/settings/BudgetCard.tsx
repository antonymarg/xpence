import { updateUserBudget } from "@/api/users.api";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Text from "@/components/Text";
import { theme } from "@/constants/theme";
import useProfile from "@/hooks/useProfile";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import Toast from "react-native-toast-message";
import UpdateBudgetModal from "./UpdateBudgetModal";

interface BudgetCardProps {
  budget: number;
}

function BudgetCard({ budget }: BudgetCardProps) {
  const [showModal, setShowModal] = useState(false);
  const { invalidateProfile } = useProfile();

  const onBudgetUpdate = async (newBudget: number) => {
    const { success } = await updateUserBudget(newBudget);
    if (success) {
      Toast.show({
        type: "success",
        text1: "Budget updated successfully",
        visibilityTime: 5000,
        autoHide: true,
      });
      await invalidateProfile();
      setShowModal(false);
    }
  };
  return (
    <>
      <Card>
        <Text heading size="sm" weight="bold" color="textSecondaryDark">
          Monthly budget
        </Text>
        <View style={styles.budgetText}>
          <Text size="title" weight="bold">
            €{(budget / 100).toFixed(2)}
          </Text>
          <Button
            onPress={() => setShowModal(true)}
            background="gradient"
            style={styles.updateButton}
          >
            <Text weight="bold" color="white">
              Update
            </Text>
          </Button>
        </View>
      </Card>
      <UpdateBudgetModal
        key={budget}
        isVisible={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={onBudgetUpdate}
        initialBudget={budget}
      />
    </>
  );
}

const styles = StyleSheet.create({
  budgetText: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.sm,
  },
  updateButton: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },
});

export default BudgetCard;
