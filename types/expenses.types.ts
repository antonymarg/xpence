import { Database } from "@/types/database.types";
import { CategoryType } from "./categories.types";

type DBExpense = Database["public"]["Tables"]["expenses"]["Row"];
type Expense = {
  id: string;
  categoryId: string;
  date: Date;
  description: string;
  amount: number;
};

type ExpensesSummary = Record<CategoryType, number>;

type MonthlyInsights = {
  expenses: Array<{
    amount: number
    category: string
    categoryType: CategoryType
  }>
  expenseSummary: ExpensesSummary
}

export type { DBExpense, Expense, ExpensesSummary, MonthlyInsights };
