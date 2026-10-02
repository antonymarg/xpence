import * as userApi from "@/api/users.api";
import { supabase } from "@/lib/supabase";
import { unwrap } from "@/lib/utils";
import { Profile } from "@/types/users.types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Href, useRouter } from "expo-router";
import React, { createContext, useContext, useEffect } from "react";

export type AuthContextType = {
  profile: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
};

const defaultValues: AuthContextType = {
  profile: null,
  isAuthenticated: false,
  isLoading: false,
};

export const AuthContext = createContext<AuthContextType>(defaultValues);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: () => unwrap(userApi.getUserProfile()),
    enabled: !!supabase.auth.getSession(),
  });

  const isAuthenticated = !!profile;

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event) => {
      console.log(`>>> AUTH STATE CHANGE: ${new Date().toISOString()}`, event);
      let redirectRoute: Href | null = null;
      if (event === "SIGNED_IN") {
        await queryClient.invalidateQueries({ queryKey: ["profile"] });
        redirectRoute = "/(app)/home";
      } else if (event === "SIGNED_OUT") {
        redirectRoute = "/(auth)/login";
      }
      if (redirectRoute) router.replace(redirectRoute);
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const value: AuthContextType = {
    profile: profile ?? null,
    isAuthenticated,
    isLoading: profileLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
