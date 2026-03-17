import { supabase } from "@/lib/supabase";
import { JwtPayload } from "@supabase/supabase-js";
import { Result } from "./api.types";
import { Category, Profile } from "./users.types";

const toError = (err: unknown): Error => {
  if (err instanceof Error) {
    return err;
  }
  return new Error(String(err));
};

async function getCurrentStatus(): Result<JwtPayload | null> {
  try {
    const { data, error } = await supabase.auth.getClaims();
    if (error) throw error;
    return { success: true, data: data?.claims ?? null };
  } catch (err) {
    return { success: false, error: toError(err) };
  }
}

async function getUserProfile(userId: string): Result<Profile | null> {
  if (!userId)
    return {
      success: false,
      error: new Error("User ID is required to fetch profile"),
    };

  try {
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
    };
    return { success: true, data: profile };
  } catch (err) {
    return { success: false, error: toError(err) };
  }
}

async function getUserCategories(userId: string): Result<Category[]> {
  if (!userId)
    return {
      success: false,
      error: new Error("User ID is required to fetch categories"),
    };
  try {
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

export { getCurrentStatus, getUserCategories, getUserProfile };
