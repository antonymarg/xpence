type ResultSuccess<T> = { success: true; data: T };
type ResultError = { success: false; error: Error };

export type Result<T> = Promise<ResultSuccess<T> | ResultError>;

export type ApiFunction<T> = (...args: any[]) => Promise<Result<T>>;
