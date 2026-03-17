import * as userApi from "@/api/users.api";
import { Profile } from "@/api/users.types";
import { supabase } from "@/lib/supabase";
import { useRouter, type Href } from "expo-router";
import React, { createContext, useContext, useEffect, useState } from "react";

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
  const [claims, setClaims] = useState<Record<string, unknown> | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!claims;

  useEffect(() => {
    const initAuth = async () => {
      const res = await userApi.getCurrentStatus();
      if (!res.success) {
        console.error("Error fetching current status:", res.error);
        setIsLoading(false);
        return;
      }
      setClaims(res.data);
      setIsLoading(false);
    };
    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(">>> AUTH STATE CHANGE", event, session);
      let redirectRoute: Href = "/(app)/home";
      if (event === "INITIAL_SESSION") {
        redirectRoute = session?.user?.id ? "/(app)/home" : "/(auth)/login";
      } else if (event === "SIGNED_IN") {
        redirectRoute = "/(app)/home";
      } else if (event === "SIGNED_OUT") {
        redirectRoute = "/(auth)/login";
      }
      router.replace(redirectRoute);
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await userApi.getUserProfile(claims?.sub as string);
      if (!res.success) {
        console.error("Error fetching user profile:", res.error);
        setIsLoading(false);
        return;
      }
      setProfile(res.data);
      setIsLoading(false);
    };
    fetchProfile();
  }, [claims]);

  const value: AuthContextType = {
    profile,
    isAuthenticated,
    isLoading,
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
