import Loading from "@/components/Loading";
import { resolveAuthRoute, type AppRoute } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { Redirect } from "expo-router";
import React, { useEffect, useState } from "react";

export default function RootIndex() {
    const [route, setRoute] = useState<AppRoute | null>(null);

    useEffect(() => {
        const resolveRoute = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();

            setRoute(await resolveAuthRoute(session));
        };

        void resolveRoute();
    }, []);

    if (!route) {
        return <Loading />;
    }

    return <Redirect href={route} />;
}
