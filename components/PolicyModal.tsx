import { theme } from "@/constants/theme";
import React from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";
import Button from "./Button";
import Modal from "./Modal";
import Text from "./Text";

export const POLICY_VERSION = "2026-11-20";

interface PolicySection {
    title: string;
    body: string;
}

interface PolicyModalProps {
    visible: boolean;
    onClose: () => void;
    onAccept: () => void;
}

function PolicyModal({ visible, onClose, onAccept }: PolicyModalProps) {
    const { t } = useTranslation();
    const sections = t("policy.sections", { returnObjects: true }) as PolicySection[];

    return (
        <Modal visible={visible} onClose={onClose}>
            <View>
                <Text size="xl" weight="bold">
                    {t("policy.title")}
                </Text>
                <Text size="sm" color="textSecondaryDark">
                    {t("policy.lastUpdated", { date: POLICY_VERSION })}
                </Text>
            </View>
            <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
                <Text>{t("policy.intro")}</Text>
                {Array.isArray(sections) &&
                    sections.map((section) => (
                        <View key={section.title} style={styles.section}>
                            <Text weight="bold">{section.title}</Text>
                            <Text>{section.body}</Text>
                        </View>
                    ))}
            </ScrollView>
            <Button onPress={onAccept} block background="gradient">
                <Text weight="bold" color="white">
                    {t("policy.accept")}
                </Text>
            </Button>
            <Button onPress={onClose} block background="icons">
                <Text weight="bold">{t("common.close")}</Text>
            </Button>
        </Modal>
    );
}

const styles = StyleSheet.create({
    scroll: {
        flexShrink: 1,
    },
    content: {
        gap: theme.spacing.md,
    },
    section: {
        gap: theme.spacing.xs,
    },
});

export default PolicyModal;
