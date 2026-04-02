import React, { useState } from "react";
import { Modal, StyleSheet, View } from "react-native";
import Button from "../Button";
import Text from "../Text";
import TextInput from "../TextInput";

interface UpdateBudgetModalProps {
  isVisible: boolean;
  initialBudget: number;
  onClose: () => void;
  onConfirm: (budget: number) => void;
}

function UpdateBudgetModal({
  isVisible,
  onClose,
  initialBudget,
  onConfirm,
}: UpdateBudgetModalProps) {
  const [budget, setBudget] = useState<number>(initialBudget);

  const onUpdateClick = () => {
    onConfirm(budget);
  };

  return (
    <Modal visible={Boolean(isVisible)} animationType="fade" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text size="xl" weight="bold" textAlign="center">
            Update budget
          </Text>
          <Text size="sm" weight="bold" heading>
            New budget
          </Text>
          <TextInput
            onChangeText={(value) => setBudget(Number(value))}
            value={budget.toString()}
          />
          <Button onPress={onUpdateClick} block background="gradient">
            <Text weight="bold" color="white">
              Update Budget
            </Text>
          </Button>
          <Button onPress={onClose} block background="icons">
            <Text weight="bold">Close</Text>
          </Button>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    width: "80%",
    padding: 20,
    borderRadius: 10,
    gap: 12,
  },
});

export default UpdateBudgetModal;
