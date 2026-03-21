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

export { toError, unwrap };
