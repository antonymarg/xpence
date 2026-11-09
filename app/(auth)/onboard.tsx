import * as userApi from "@/api/users.api";
import Button from "@/components/Button";
import Dropdown from "@/components/Dropdown";
import Loading from "@/components/Loading";
import Logo from "@/components/Logo";
import Text from "@/components/Text";
import TextInput from "@/components/TextInput";
import { currencies } from "@/constants/currency";
import { locales } from "@/constants/locale";
import { theme } from "@/constants/theme";
import { setAppLanguage } from "@/lib/i18n";
import { parseAmountInput } from "@/lib/utils";
import { Currency, Locale } from "@/types/users.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import i18n from "i18next";
import React from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import z from "zod";

export default function Onboard() {
    const { t } = useTranslation();
    const router = useRouter();

    const schema = z
        .object({
            name: z.string().min(3, t("validation.nameMinLength", { count: 3 })),
            budget: z.string().refine(
                (value) => parseAmountInput(value, 0) !== null,
                t("validation.validBudget")
            ),
            currency: z.enum(Object.keys(currencies) as [Currency, ...Currency[]], { error: t("validation.validCurrency") }),
            locale: z.enum(locales.map(({ code }) => code) as [Locale, ...Locale[]]),
        })

    const [loading, setLoading] = React.useState(false);

    const onOnboardPress = async (data: z.infer<typeof schema>) => {
        setLoading(true);
        try {
            const { success } = await userApi.createUserProfile({
                locale: data.locale,
                displayName: data.name,
                budget: Math.round(Number(data.budget) * 100),
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
            currency: 'EUR' as Currency,
            budget: "1000",
            locale: locales.find(({ languageTag }) => languageTag === i18n.resolvedLanguage)?.code ?? "EN",
        }
    });
    const selectedCurrency = useWatch({ control, name: "currency" });

    return (
        <SafeAreaView style={styles.pageContainer}>
            <Logo variant="long" height='10%' />
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
                                inputMode="decimal"
                                value={field.value}
                                onChangeText={field.onChange}
                                onBlur={field.onBlur}
                                error={errors?.budget?.message}
                                editable={!loading}
                                prefix={currencies[selectedCurrency]}
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
                    <Controller
                        control={control}
                        name="locale"
                        render={({ field }) => (
                            <Dropdown<Locale>
                                heading={t("settings.changeLanguage")}
                                value={field.value}
                                onValueChange={(locale) => {
                                    field.onChange(locale);
                                    void setAppLanguage(locale);
                                }}
                                options={locales.map(({ code, labelKey }) => ({ label: t(labelKey), value: code }))}
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
                            <Loading />
                        ) : (
                            <Text weight="bold" size='xl' color="white">
                                {t("auth.letsgo")}
                            </Text>
                        )}
                    </Button>
                </KeyboardAvoidingView>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        height: "100%",
        flex: 1,
        paddingTop: theme.spacing.lg,
    },
    inputContainer: {
        gap: theme.spacing.lg,
    },
    button: {
        borderColor: theme.colors.divider,
        borderWidth: 1,
    },
    pageContainer: {
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.xxl,
    }
});
