import React, { useState } from "react";
import Button from "../Button";
import Modal from "../Modal";
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
    <Modal visible={Boolean(isVisible)} onClose={onClose}>
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
    </Modal>
  );
}

export default UpdateBudgetModal;
