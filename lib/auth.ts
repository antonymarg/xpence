import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";

export type AppRoute = "/(auth)/(tabs)/login" | "/(auth)/onboard" | "/(app)/home";

export async function getUserId(): Promise<string> {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
        await supabase.auth.signOut();
    }
    if (!data.session) throw new Error("No session found");
    return data.session.user.id;
}

export async function resolveAuthRoute(session: Session | null): Promise<AppRoute> {
    if (!session) {
        return "/(auth)/(tabs)/login";
    }

    const { data: profileData, error } = await supabase
        .from("user_profiles")
        .select("user_id")
        .eq("user_id", session.user.id)
        .maybeSingle();

    if (error) {
        return "/(auth)/(tabs)/login";
    }

    return profileData ? "/(app)/home" : "/(auth)/onboard";
}
