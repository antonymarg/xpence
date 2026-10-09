import { Result } from "@/types/api.types";

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

const formatPrice = (price: number) => {
  return `${(price / 100).toFixed(2)} €`
}

const capitaliseFirst = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)
export { capitaliseFirst, formatPrice, toError, unwrap };

