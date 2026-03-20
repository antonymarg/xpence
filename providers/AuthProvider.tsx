import * as userApi from "@/api/users.api";
import { supabase } from "@/lib/supabase";
import { Profile } from "@/types/users.types";
import { Href, useRouter } from "expo-router";
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
    userApi
      .getCurrentStatus()
      .then((res) => {
        if (!res.success) throw res.error;
        return res.data;
      })
      .then((claims) => {
        setClaims(claims);
        if (!claims?.sub) {
          setProfile(null);
          return null;
        }
        return userApi.getUserProfile(claims.sub);
      })
      .then((res) => {
        if (res && !res.success) throw res.error;
        if (res?.success) setProfile(res.data);
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
