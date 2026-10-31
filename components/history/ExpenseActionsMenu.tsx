import { theme } from "@/constants/theme";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Modal as RNModal,
    Pressable as RNPressable,
    StyleSheet,
    useWindowDimensions,
    View,
} from "react-native";
import Icon from "../Icon";
import Pressable from "../Pressable";
import Text from "../Text";

const MENU_WIDTH = 176;
const MENU_HEIGHT = 104;
const SCREEN_MARGIN = theme.spacing.sm;

interface ExpenseActionsMenuProps {
    onEdit: () => void;
    onDelete: () => void;
}

function ExpenseActionsMenu({ onEdit, onDelete }: ExpenseActionsMenuProps) {
    const { t } = useTranslation();
    const { width: windowWidth, height: windowHeight } = useWindowDimensions();
    const triggerRef = useRef<View>(null);
    const [menuAnchor, setMenuAnchor] = useState<{
        x: number;
        y: number;
        width: number;
        height: number;
    } | null>(null);

    const openMenu = () => {
        triggerRef.current?.measureInWindow((x, y, width, height) => {
            setMenuAnchor({ x, y, width, height });
        });
    };

    const closeMenu = () => setMenuAnchor(null);
    const handleEdit = () => {
        closeMenu();
        requestAnimationFrame(onEdit);
    };
    const handleDelete = () => {
        closeMenu();
        requestAnimationFrame(onDelete);
    };

    const menuLeft = menuAnchor
        ? Math.max(
            SCREEN_MARGIN,
            Math.min(
                menuAnchor.x + menuAnchor.width - MENU_WIDTH,
                windowWidth - MENU_WIDTH - SCREEN_MARGIN,
            ),
        )
        : 0;
    const menuBelowTop = menuAnchor
        ? menuAnchor.y + menuAnchor.height + theme.spacing.xs
        : 0;
    const menuTop = menuAnchor
        ? menuBelowTop + MENU_HEIGHT <= windowHeight - SCREEN_MARGIN
            ? menuBelowTop
            : Math.max(
                SCREEN_MARGIN,
                menuAnchor.y - MENU_HEIGHT - theme.spacing.xs,
            )
        : 0;

    return (
        <>
            <View ref={triggerRef} collapsable={false}>
                <Pressable
                    onPress={openMenu}
                    accessibilityRole="button"
                    accessibilityLabel={t("history.toggleActions")}
                    accessibilityState={{ expanded: menuAnchor !== null }}
                    hitSlop={8}
                >
                    <Icon color={theme.colors.gray} name="ellipsis-vertical" />
                </Pressable>
            </View>
            <RNModal
                transparent
                visible={menuAnchor !== null}
                animationType="fade"
                statusBarTranslucent
                onRequestClose={closeMenu}
            >
                <View style={styles.menuOverlay}>
                    <RNPressable
                        style={StyleSheet.absoluteFill}
                        onPress={closeMenu}
                        accessibilityRole="button"
                        accessibilityLabel={t("common.close")}
                    />
                    {menuAnchor && (
                        <View
                            style={[styles.menu, { left: menuLeft, top: menuTop }]}
                            accessibilityRole="menu"
                        >
                            <Pressable
                                style={styles.menuItem}
                                onPress={handleEdit}
                                accessibilityRole="menuitem"
                            >
                                <Icon name="pencil" size={18} color={theme.colors.textLight} />
                                <Text>{t("common.edit")}</Text>
                            </Pressable>
                            <View style={styles.menuDivider} />
                            <Pressable
                                style={styles.menuItem}
                                onPress={handleDelete}
                                accessibilityRole="menuitem"
                            >
                                <Icon name="trash" size={18} color={theme.colors.error} />
                                <Text style={styles.deleteLabel}>{t("common.delete")}</Text>
                            </Pressable>
                        </View>
                    )}
                </View>
            </RNModal>
        </>
    );
}

const styles = StyleSheet.create({
    menuOverlay: {
        flex: 1,
    },
    menu: {
        position: "absolute",
        width: MENU_WIDTH,
        paddingVertical: theme.spacing.xs,
        backgroundColor: theme.colors.card,
        borderRadius: theme.borderRadius.md,
        ...theme.shadows.whisper,
        elevation: 8,
    },
    menuItem: {
        minHeight: 44,
        flexDirection: "row",
        alignItems: "center",
        gap: theme.spacing.md,
        paddingHorizontal: theme.spacing.md,
    },
    menuDivider: {
        height: StyleSheet.hairlineWidth,
        marginHorizontal: theme.spacing.md,
        backgroundColor: theme.colors.divider,
    },
    deleteLabel: {
        color: theme.colors.error,
    },
});

export default ExpenseActionsMenu;