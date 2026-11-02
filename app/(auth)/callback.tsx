import Loading from "@/components/Loading";
import { resolveAuthRoute } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect } from "react";

export default function AuthCallback() {
    const { code } = useLocalSearchParams<{ code?: string }>();
    const router = useRouter();

    useEffect(() => {
        const completeSignup = async () => {
            if (!code) {
                router.replace("/(auth)/(tabs)/login");
                return;
            }

            const { data, error } = await supabase.auth.exchangeCodeForSession(code);
            if (error || !data.session) {
                router.replace("/(auth)/(tabs)/login");
                return;
            }

            router.replace(await resolveAuthRoute(data.session));
        };

        void completeSignup();
    }, [code, router]);

    return <Loading />;
}