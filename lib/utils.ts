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
  const normalised = value.trim().replace(",", ".");
  if (!/^(?:\d+(?:\.\d*)?|\.\d+)$/.test(normalised)) return null;

  const amount = Number(normalised);
  return Number.isFinite(amount) && amount >= minimum ? amount : null;
};

const toMinorUnits = (value: string): number => {
  const amount = parseAmountInput(value, 0);
  if (amount === null) throw new Error(`Invalid amount: ${value}`);
  return Math.round(amount * 100);
};

const fromMinorUnits = (amount: number): string => String(amount / 100);

const toLocalDateString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const fromLocalDateString = (date: string): Date => {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const capitaliseFirst = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)
export {
  capitaliseFirst,
  formatPrice,
  fromLocalDateString,
  fromMinorUnits,
  parseAmountInput,
  toError,
  toLocalDateString,
  toMinorUnits,
  unwrap
};

