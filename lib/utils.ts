import { Result } from "@/types/api.types";
import { Currency } from "@/types/users.types";

const toError = (err: unknown): Error => {
  if (err instanceof Error) {
    return err;
  }
  return new Error(String(err));
};

const unwrap = async <T>(promise: Result<T>): Promise<T> => {
  const result = await promise;
  if (!result.success) throw result.error;
  return result.data;
};

const formatPrice = (price: number, currency: Currency = "EUR", locale = "en-GB") => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(price / 100);
}

const parseAmountInput = (value: string, minimum = 0.01): number | null => {
  const trimmed = value.trim();
  if (!/^(?:\d+(?:\.\d*)?|\.\d+)$/.test(trimmed)) return null;

  const amount = Number(trimmed);
  return Number.isFinite(amount) && amount >= minimum ? amount : null;
};

const capitaliseFirst = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)
export { capitaliseFirst, formatPrice, parseAmountInput, toError, unwrap };

