import { supabase } from "@/lib/supabase";
import { toError } from "@/lib/utils";
import { Result } from "@/types/api.types";
import { CategoryType } from "@/types/categories.types";
import { Database } from "@/types/database.types";
import { Expense, ExpensesSummary, MonthlyInsights } from "@/types/expenses.types";
import { getUserId } from "./users.api";

export const EXPENSE_PAGE_SIZE = 20;

export type ExpenseCursor = {
  date: Date;
  id: string;
};

type GetExpensesParam = {
  categoryId?: string | null;
  categoryType?: CategoryType;
  fromDate?: Date;
  toDate?: Date;
  after?: ExpenseCursor | null;
};

type GetInsightsParams = {
  fromDate: Date;
  toDate: Date;
  categoryType?: CategoryType
}

const toLocalISOString = (date: Date) => {
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - (offset * 60 * 1000));
  return localDate.toISOString().split('T')[0]
};

async function addExpense(expense: Omit<Expense, "id">): Result<Expense> {
  try {
    const userId = await getUserId();
    const { data, error } = await supabase
      .from("expenses")
      .insert({
        user_id: userId,
        category_id: expense.categoryId,
        amount: expense.amount,
        date: expense.date.toISOString(),
        description: expense.description,
      })
      .select()
      .single();
    if (error) throw error;
    return {
      success: true,
      data: {
        id: data.id,
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
    const { data, error } = await supabase
      .rpc('get_current_month_expenses_by_type')
    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    return { success: false, error: toError(err) };
  }
}

async function getMonthlyInsights(params: GetInsightsParams): Result<MonthlyInsights> {
  try {
    const requestParams: Database['public']['Functions']['get_monthly_insights']['Args'] = {
      p_from_date: toLocalISOString(params.fromDate),
      p_to_date: toLocalISOString(params.toDate),
      p_category_type: params.categoryType
    }
    const { data, error } = await supabase.rpc('get_monthly_insights', requestParams)
    if (error) throw error;
    return { success: true, data: data as MonthlyInsights };
  } catch (err) {
    return { success: false, error: toError(err) };
  }
}

async function getExpenses(params: GetExpensesParam): Result<Expense[]> {
  try {
    const userId = await getUserId();
    let query = supabase
      .from("expenses")
      .select("id, amount, date, description, categories!inner (id, type)")
      .eq("user_id", userId)
      .order("date", { ascending: false })
      .order("id", { ascending: false });
    if (params.categoryType && !params.categoryId)
      query = query.eq("categories.type", params.categoryType);
    if (params.categoryId) query = query.eq("categories.id", params.categoryId);
    if (params.fromDate)
      query = query.gte("date", params.fromDate.toISOString());
    if (params.toDate) query = query.lte("date", params.toDate.toISOString());
    if (params.after) {
      const cursorDate = params.after.date.toISOString();
      query = query.or(
        `date.lt.${cursorDate},and(date.eq.${cursorDate},id.lt.${params.after.id})`,
      );
    }
    query = query.limit(EXPENSE_PAGE_SIZE);
    const { data, error } = await query;
    if (error) throw error;
    return {
      success: true,
      data: data.map((item) => ({
        id: item.id,
        amount: item.amount,
        date: new Date(item.date),
        description: item.description,
        categoryId: item.categories.id,
      })),
    };
  } catch (err) {
    return { success: false, error: toError(err) };
  }
}

async function updateExpense(expense: Expense): Result<Expense> {
  try {
    const userId = await getUserId();
    const { data, error } = await supabase
      .from("expenses")
      .update({
        category_id: expense.categoryId,
        amount: expense.amount,
        date: expense.date.toISOString(),
        description: expense.description,
      })
      .eq("id", expense.id)
      .eq("user_id", userId)
      .select()
      .single();
    if (error) throw error;
    return {
      success: true,
      data: {
        id: data.id,
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

async function deleteExpense(expenseId: string): Result<null> {
  try {
    const userId = await getUserId();
    const { error } = await supabase
      .from("expenses")
      .delete()
      .eq("id", expenseId)
      .eq("user_id", userId);
    if (error) throw error;
    return { success: true, data: null };
  } catch (err) {
    return { success: false, error: toError(err) };
  }
}

export {
  addExpense,
  deleteExpense,
  getExpenses, getMonthlyInsights, getSummaryOfExpenses,
  updateExpense,
  type GetInsightsParams
};

