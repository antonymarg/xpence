import { currencies } from '@/constants/currency';
import { locales } from '@/constants/locale';
type Currency = keyof typeof currencies
type Locale = typeof locales[number]["code"]

type Profile = {
  userId: string;
  displayName: string;
  budget: number;
  currency: Currency
  locale: Locale
};

export { Currency, Locale, Profile };

