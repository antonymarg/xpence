import * as userApi from "@/api/users.api";
import { supabase } from "@/lib/supabase";
import { unwrap } from "@/lib/utils";
import { Category, Profile } from "@/types/users.types";
import { useQuery } from "@tanstack/react-query";
import { Href, useRouter } from "expo-router";
import React, { createContext, useContext, useEffect } from "react";

export type AuthContextType = {
  profile: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  userCategories: Category[];
};

const defaultValues: AuthContextType = {
  profile: null,
  isAuthenticated: false,
  isLoading: false,
  userCategories: [],
};

export const AuthContext = createContext<AuthContextType>(defaultValues);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: () => unwrap(userApi.getUserProfile()),
  });
  const { data: userCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => unwrap(userApi.getUserCategories()),
  });

  const isAuthenticated = !!profile;

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      console.log(`>>> AUTH STATE CHANGE: ${new Date().toISOString()}`, event);
      let redirectRoute: Href | null = null;
      if (event === "SIGNED_IN") {
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
    userCategories: userCategories ?? [],
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
