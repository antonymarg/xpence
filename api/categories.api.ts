import { supabase } from "@/lib/supabase";
import { toError } from "@/lib/utils";
import { Result } from "@/types/api.types";
import { Category } from "@/types/categories.types";
import { getUserId } from "./users.api";

async function getUserCategories(): Result<Category[]> {
  try {
    const userId = await getUserId();
    const { data, error } = await supabase
      .from("user_to_category")
      .select("is_active, categories (id, name, type)")
      .eq("is_active", true)
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
      .update({ is_active: false })
      .eq("category_id", categoryId)
      .eq("user_id", userId);
    if (error) throw error;
    return { success: true, data: null };
  } catch (error) {
    return { success: false, error: toError(error) };
  }
}

export { addUserCategory, deleteUserCategory, getUserCategories };
