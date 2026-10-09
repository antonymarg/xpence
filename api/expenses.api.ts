import { supabase } from "@/lib/supabase";
import { toError } from "@/lib/utils";
import { Result } from "@/types/api.types";
import { CategoryType } from "@/types/categories.types";
import { Database } from "@/types/database.types";
import { Expense, ExpensesSummary, MonthlyInsights } from "@/types/expenses.types";
import { getUserId } from "./users.api";

const OFFSET_GAP = 20;

type GetExpensesParam = {
  categoryId?: string | null;
  categoryType?: CategoryType;
  fromDate?: Date;
  toDate?: Date;
  offSet?: number;
};

type GetInsightsParams = {
  fromDate: Date;
  toDate: Date;
  categoryType?: CategoryType
}

async function addExpense(expense: Omit<Expense, "id">): Result<Expense> {
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
      p_from_date: params.fromDate.toISOString(),
      p_to_date: params.toDate.toISOString(),
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
    const offset = params.offSet ?? 0;
    let query = supabase
      .from("expenses")
      .select("id, amount, date, description, categories!inner (id, type)")
      .eq("user_id", userId)
      .order("date", { ascending: false });
    if (params.categoryType && !params.categoryId)
      query = query.eq("categories.type", params.categoryType);
    if (params.categoryId) query = query.eq("categories.id", params.categoryId);
    if (params.fromDate)
      query = query.gte("date", params.fromDate.toISOString());
    if (params.toDate) query = query.lte("date", params.toDate.toISOString());
    query = query.range(offset, offset + OFFSET_GAP - 1);
    const { data, error } = await query;
    if (error) throw error;
    return {
      success: true,
      data: data.map((item) => ({
        id: item.id,
        amount: item.amount / 100,
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
        amount: expense.amount * 100,
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

