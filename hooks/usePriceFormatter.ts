import { locales } from "@/constants/locale";
import useProfile from "@/hooks/useProfile";
import { formatPrice } from "@/lib/utils";
import { useTranslation } from "react-i18next";

function usePriceFormatter() {
    const { data: profile } = useProfile();
    const { i18n } = useTranslation();
    const language = i18n.resolvedLanguage || i18n.language;
    const locale =
        locales.find((item) => item.code.toLowerCase() === language.toLowerCase())
            ?.languageTag ?? language;

    return (amountInPence: number) =>
        formatPrice(amountInPence, profile?.currency ?? "EUR", locale);
}

export default usePriceFormatter;