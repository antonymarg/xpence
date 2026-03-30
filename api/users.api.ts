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

export { getUserCategories, getUserId, getUserProfile };
