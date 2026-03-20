import { Database } from "@/database.types";

type DBExpense = Database["public"]["Tables"]["expenses"]["Row"];
type Expense = {
  categoryId: string;
  date: Date;
  description: string;
  amount: number;
};
export type { DBExpense, Expense };
