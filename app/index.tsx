import Loading from "@/components/Loading";
import useProfile from "@/hooks/useProfile";
import { Redirect } from "expo-router";
import React from "react";

export default function RootIndex() {
  const { data: profile, isLoading: isProfileLoading } = useProfile();

  if (isProfileLoading) {
    return (<Loading />);
  }

  if (profile) {
    return <Redirect href="/(app)/home" />;
  }

  return <Redirect href="/(auth)/login" />;
}

