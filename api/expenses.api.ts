import { supabase } from "@/lib/supabase";
import { toError } from "@/lib/utils";
import { Result } from "@/types/api.types";
import { Expense, ExpensesSummary } from "@/types/expenses.types";
import { getUserId } from "./users.api";

async function addExpense(expense: Expense): Result<Expense> {
  try {
    const userId = await getUserId();
    const { data, error } = await supabase
      .from("expenses")
      .insert({
        user_id: userId,
        category_id: expense.categoryId,
        amount: expense.amount * 100,
        date: expense.date.toISOString(),
        description: expense.description,
      })
      .select()
      .single();
    if (error) throw error;
    return {
      success: true,
      data: {
        categoryId: data.category_id,
        amount: data.amount,
        date: new Date(data.date),
        description: data.description,
      },
    };
  } catch (err) {
    return { success: false, error: toError(err) };
  }
}

async function getSummaryOfExpenses(): Result<ExpensesSummary> {
  try {
    const userId = await getUserId();
    const { data, error } = await supabase
      .from("expenses")
      .select("amount, categories (type)")
      .eq("user_id", userId);
    if (error) throw error;
    const summary = data.reduce(
      (acc, cur) => {
        switch (cur.categories.type) {
          case "needs":
            acc.needs += cur.amount;
            break;
          case "wants":
            acc.wants += cur.amount;
            break;
          case "savings":
            acc.savings += cur.amount;
            break;
        }
        return acc;
      },
      {
        needs: 0,
        wants: 0,
        savings: 0,
      },
    );
    return { success: true, data: summary };
  } catch (err) {
    console.log(err);
    return { success: false, error: toError(err) };
  }
}

export { addExpense, getSummaryOfExpenses };
