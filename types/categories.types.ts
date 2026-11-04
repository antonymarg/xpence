import { Database } from "./database.types";

type Category = Omit<Omit<Omit<
	Database["public"]["Tables"]["categories"]["Row"],
	"is_default">, "user_id">, "is_active">

type CategoryType = Category["type"];

export type { Category, CategoryType };
