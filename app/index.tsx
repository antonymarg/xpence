import Loading from "@/components/Loading";
import { useAuth } from "@/providers/AuthProvider";
import { Redirect } from "expo-router";
import React from "react";

export default function RootIndex() {
  const { isLoading, isAuthenticated } = useAuth();

  console.log("RootIndex: isLoading", isLoading, "isAuthenticated", isAuthenticated);
  if (isLoading) {
    return (<Loading />);
  }

  if (isAuthenticated) {
    return <Redirect href="/(app)/home" />;
  }

  return <Redirect href="/(auth)/login" />;
}

