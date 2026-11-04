import { DEFAULT_CATEGORIES } from "@/constants/defaultCategories";
import { locales } from "@/constants/locale";
import { getUserId } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { toError } from "@/lib/utils";
import { Result } from "@/types/api.types";
import { Category } from "@/types/categories.types";
import { Locale } from "@/types/users.types";
import i18next from "i18next";

async function createDefaultCategoriesForUser(userId: string, locale: Locale): Result<null> {
  try {
    const languageTag = locales.find(({ code }) => code === locale)?.languageTag;
    if (!languageTag) throw new Error(`Unsupported locale: ${locale}`);

    const categoryRows = (Object.keys(DEFAULT_CATEGORIES) as (keyof typeof DEFAULT_CATEGORIES)[])
      .flatMap((type) => DEFAULT_CATEGORIES[type].map((key) => ({
        name: i18next.t(`categories.defaultNames.${key}`, { lng: languageTag }),
        type,
        user_id: userId,
        is_active: true,
      })));
    const { error } = await supabase
      .from("categories")
      .insert(categoryRows);
    if (error) throw error;

    return { success: true, data: null };
  } catch (error) {
    return { success: false, error: toError(error) };
  }
}

async function getUserCategories(activeOnly = false): Result<Category[]> {
  try {
    const userId = await getUserId();
    let query = supabase
      .from("categories")
      .select("id, name, is_active, type")
      .eq("user_id", userId)
    if (activeOnly) query.eq("is_active", true);
    query.order("name", { ascending: true });
    const { data, error } = await query
    if (error) throw error;
    return { success: true, data: data ?? [] };
  } catch (err) {
    return { success: false, error: toError(err) };
  }
}

async function addUserCategory({ name, type }: Omit<Omit<Category, "id">, "is_active">) {
  try {
    const userId = await getUserId();
    const { data: newCategory, error: createCatError } = await supabase
      .from("categories")
      .insert({
        name: name,
        type: type,
        user_id: userId,
        is_active: true
      })
      .select()
      .single();
    if (createCatError) throw createCatError;
    return { success: true, data: newCategory };
  } catch (err) {
    return { success: false, error: toError(err) };
  }
}

async function deleteUserCategory(categoryId: string): Result<null> {
  try {
    const { error } = await supabase
      .from("categories")
      .update({ is_active: false })
      .eq("id", categoryId)
    if (error) throw error;
    return { success: true, data: null };
  } catch (error) {
    return { success: false, error: toError(error) };
  }
}

async function renameUserCategory(categoryId: string, name: string): Result<null> {
  try {
    const { data, error } = await supabase
      .from("categories")
      .update({ name })
      .eq("id", categoryId)
      .select("id")
      .maybeSingle();
    if (error) throw error;
    if (!data) throw new Error("Category cannot be renamed");
    return { success: true, data: null };
  } catch (error) {
    return { success: false, error: toError(error) };
  }
}

export { addUserCategory, createDefaultCategoriesForUser, deleteUserCategory, getUserCategories, renameUserCategory };
