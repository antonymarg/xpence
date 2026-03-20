import { Database } from "@/types/database.types";

type Profile = {
  userId: string;
  displayName: string;
  budget: number;
};

type Category = Omit<
  Database["public"]["Tables"]["categories"]["Row"],
  "is_default"
>;

type CategoryType = Category["type"];

export { Category, CategoryType, Profile };
