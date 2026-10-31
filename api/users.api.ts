import { supabase } from "@/lib/supabase";
import { toError } from "@/lib/utils";
import { Result } from "@/types/api.types";
import { Currency, Locale, Profile } from "@/types/users.types";

async function getUserId(): Promise<string> {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    await supabase.auth.signOut();
  }
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
      currency: data.currency,
      locale: data.locale
    };
    return { success: true, data: profile };
  } catch (err) {
    return { success: false, error: toError(err) };
  }
}

async function createUserProfile(profile: Omit<Profile, 'userId'>) {
  try {
    const userId = await getUserId();
    const { data, error } = await supabase
      .from("user_profiles")
      .insert({
        user_id: userId,
        display_name: profile.displayName,
        budget: profile.budget,
        currency: profile.currency
      })
    if (error) throw error
    return { success: true, data }
  } catch (err) {
    return { success: false, error: toError(err) };
  }
}

async function updateUserBudget(budget: number) {
  try {
    const userId = await getUserId();
    const { error } = await supabase
      .from("user_profiles")
      .update({ budget })
      .eq("user_id", userId);
    if (error) throw error;
    return { success: true, data: null };
  } catch (err) {
    return { success: false, error: toError(err) };
  }
}

async function updateUserCurrency(currency: Currency) {
  try {
    const userId = await getUserId();
    const { error } = await supabase
      .from("user_profiles")
      .update({ currency })
      .eq("user_id", userId);
    if (error) throw error;
    return { success: true, data: null };
  } catch (err) {
    return { success: false, error: toError(err) };
  }
}

async function updateUserLocale(locale: Locale) {
  try {
    const userId = await getUserId();
    const { error } = await supabase
      .from("user_profiles")
      .update({ locale })
      .eq("user_id", userId);
    if (error) throw error;
    return { success: true, data: null };
  } catch (err) {
    return { success: false, error: toError(err) };
  }
}

export { createUserProfile, getUserId, getUserProfile, updateUserBudget, updateUserCurrency, updateUserLocale };

