import { Database } from "@/types/database.types";
import { CategoryType } from "./users.types";

type DBExpense = Database["public"]["Tables"]["expenses"]["Row"];
type Expense = {
  categoryId: string;
  date: Date;
  description: string;
  amount: number;
};

type ExpensesSummary = Record<CategoryType, number>;

export type { DBExpense, Expense, ExpensesSummary };
