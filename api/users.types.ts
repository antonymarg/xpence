import { Database } from "@/lib/database.types";

type Profile = {
  userId: string;
  displayName: string;
};

type Category = Omit<
  Database["public"]["Tables"]["categories"]["Row"],
  "is_default"
>;

export { Category, Profile };
