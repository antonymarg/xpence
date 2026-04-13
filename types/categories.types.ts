import { Database } from "./database.types";

type Category = Omit<
  Database["public"]["Tables"]["categories"]["Row"],
  "is_default"
>;

type CategoryType = Category["type"];

export type { Category, CategoryType };
