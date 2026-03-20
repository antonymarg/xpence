import { supabase } from "@/lib/supabase";
import { toError } from "@/lib/utils";
import { Result } from "@/types/api.types";
import { Expense } from "@/types/expenses.types";
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

async function getSumOfExpenses(): Result<number> {
  try {
    const userId = await getUserId();
    const { data, error } = await supabase
      .from("expenses")
      .select("amount")
      .eq("user_id", userId);
    if (error) throw error;
    const sum = data.reduce((acc, cur) => acc + cur.amount, 0) ?? 0;
    return { success: true, data: sum };
  } catch (err) {
    return { success: false, error: toError(err) };
  }
}

export { addExpense, getSumOfExpenses };
