import { supabase } from "@/lib/supabase";
import { toError } from "@/lib/utils";
import { Result } from "@/types/api.types";
import { Category, Profile } from "@/types/users.types";

async function getUserId(): Promise<string> {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  if (!data.session) throw new Error("No session found");
  return data.session.user.id;
}

async function getUserProfile(): Result<Profile | null> {
  try {
    const userId = await getUserId();
    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("user_id", userId)
      .single();
    if (error) throw error;
    if (!data) {
      return { success: true, data: null };
    }
    const profile: Profile = {
      userId: data.user_id,
      displayName: data.display_name,
      budget: data.budget,
    };
    return { success: true, data: profile };
  } catch (err) {
    return { success: false, error: toError(err) };
  }
}

async function updateUserBudget(budget: number) {
  try {
    const userId = await getUserId();
    const { error } = await supabase
      .from("user_profiles")
      .update({ budget: budget })
      .eq("user_id", userId);
    if (error) throw error;
    return { success: true, data: null };
  } catch (err) {
    return { success: false, error: toError(err) };
  }
}

async function getUserCategories(): Result<Category[]> {
  try {
    const userId = await getUserId();
    const { data, error } = await supabase
      .from("user_to_category")
      .select("categories (id, name, type)")
      .eq("user_id", userId);
    if (error) throw error;
    return { success: true, data: data?.map((item) => item.categories) ?? [] };
  } catch (err) {
    return { success: false, error: toError(err) };
  }
}

async function addUserCategory({ name, type }: Omit<Category, "id">) {
  try {
    const userId = await getUserId();
    const { data: newCategory, error: createCatError } = await supabase
      .from("categories")
      .insert({
        name: name,
        type: type,
      })
      .select()
      .single();
    if (createCatError) throw createCatError;
    const { data: updatedRecord, error: updateError } = await supabase
      .from("user_to_category")
      .insert({
        user_id: userId,
        category_id: newCategory.id,
      })
      .select();
    if (updateError) throw updateError;
    return { success: true, data: updatedRecord };
  } catch (err) {
    return { success: false, error: toError(err) };
  }
}

async function deleteUserCategory(categoryId: string): Result<null> {
  try {
    const userId = await getUserId();
    const { error } = await supabase
      .from("user_to_category")
      .delete()
      .eq("category_id", categoryId)
      .eq("user_id", userId);
    if (error) throw error;
    return { success: true, data: null };
  } catch (error) {
    return { success: false, error: toError(error) };
  }
}

export {
  addUserCategory,
  deleteUserCategory,
  getUserCategories,
  getUserId,
  getUserProfile,
  updateUserBudget,
};
