import { supabase } from "@/lib/supabase";
import { Expense } from "@/types/expenses.types";

async function addExpense(expense: Expense, userId: string) {
  supabase
    .from("expenses")
    .insert({
      user_id: userId,
      category_id: expense.categoryId,
      amount: expense.amount,
      date: expense.date.toISOString(),
      description: expense.description,
    })
    .select()
    .then((res) => console.log(res));
}

async function getSumOfExpenses(userId: string) {
  const { data, error } = await supabase
    .from("expenses")
    .select("amount")
    .eq("user_id", userId);
  if (error) throw error;
  return data?.reduce((acc, cur) => acc + cur.amount, 0) ?? 0;
}

export { addExpense, getSumOfExpenses };
