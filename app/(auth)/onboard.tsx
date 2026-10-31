import * as userApi from "@/api/users.api";
import Button from "@/components/Button";
import Dropdown from "@/components/Dropdown";
import Text from "@/components/Text";
import TextInput from "@/components/TextInput";
import { currencies } from "@/constants/currency";
import { theme } from "@/constants/theme";
import { Currency } from "@/types/users.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    View
} from "react-native";
import Toast from "react-native-toast-message";
import z from "zod";

export default function Onboard() {
    const { t } = useTranslation();
    const router = useRouter();

    const schema = z
        .object({
            name: z.string().min(3, t("validation.nameMinLength", { count: 3 })),
            budget: z.coerce.number({ error: t("validation.validBudget") }).min(0, t("validation.validBudget")),
            currency: z.enum(Object.keys(currencies) as [Currency, ...Currency[]], { error: t("validation.validCurrency") })
        })

    const [loading, setLoading] = React.useState(false);

    const onOnboardPress = async (data: z.infer<typeof schema>) => {
        setLoading(true);
        try {
            const { success } = await userApi.createUserProfile({
                locale: 'EN',
                displayName: data.name,
                budget: data.budget * 100,
                currency: data.currency
            })
            if (!success) throw new Error()
            router.replace('/(app)/home')
        } catch {
            Toast.show({
                type: "error",
                text1: t("auth.unexpectedError"),
                visibilityTime: 5000,
                autoHide: true,
            });
        } finally {
            setLoading(false);
        }
    }

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            name: "",
            currency: 'EUR',
            budget: "1000",
        }
    });

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView
                style={styles.inputContainer}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <Text size='xxl' weight="bold">{t("auth.welcomeTitle")}</Text>
                <Controller
                    control={control}
                    name="name"
                    render={({ field }) => (
                        <TextInput
                            placeholder={t("auth.namePlaceholder")}
                            label={t("auth.nameLabel")}
                            value={field.value}
                            onChangeText={field.onChange}
                            onBlur={field.onBlur}
                            error={errors?.name?.message}
                            editable={!loading}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="budget"
                    render={({ field }) => (
                        <TextInput
                            placeholder="0"
                            label={t("auth.monthlyGoal")}
                            inputMode="numeric"
                            value={field.value?.toString()}
                            onChangeText={field.onChange}
                            onBlur={field.onBlur}
                            error={errors?.budget?.message}
                            editable={!loading}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="currency"
                    render={({ field }) => (
                        <Dropdown<Currency>
                            value={field.value}
                            onValueChange={field.onChange}
                            options={Object.entries(currencies).map(([code, symbol]) => ({ label: `${code} (${symbol})`, value: code as Currency }))}
                        />
                    )}
                />
                <Button
                    disabled={loading}
                    onPress={handleSubmit(onOnboardPress)}
                    background="gradient"
                    block
                    style={styles.button}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text weight="bold" size='xl' color="white">
                            {t("auth.letsgo")}
                        </Text>
                    )}
                </Button>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: "100%",
        flex: 1,
        paddingTop: theme.spacing.lg,
        backgroundColor: theme.colors.background
    },
    inputContainer: {
        gap: theme.spacing.lg,
    },
    button: {
        borderColor: theme.colors.divider,
        borderWidth: 1,
    },
});
