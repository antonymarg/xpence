import * as userApi from "@/api/users.api";
import { supabase } from "@/lib/supabase";
import { Category, Profile } from "@/types/users.types";
import { Href, useRouter } from "expo-router";
import React, { createContext, useContext, useEffect, useState } from "react";

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
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userCategories, setUserCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!profile;

  useEffect(() => {
    userApi
      .getUserProfile()
      .then((res) => {
        if (!res.success) throw res.error;
        if (res.success) setProfile(res.data);
      })
      .catch((error) => {
        console.error("Auth init error:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
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

  useEffect(() => {
    if (!profile) return;
    userApi.getUserCategories().then((res) => {
      if (!res.success) return;
      return setUserCategories(res.data);
    });
  }, [profile]);

  const value: AuthContextType = {
    profile,
    isAuthenticated,
    isLoading,
    userCategories,
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
