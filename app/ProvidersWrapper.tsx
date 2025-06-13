// app/ProvidersWrapper.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { AuthProvider } from "@/lib/auth-context";
import { ThemeProvider } from "next-themes";
import { Header } from "@/components/header";
import { Toaster } from "@/components/ui/toaster";

export default function ProvidersWrapper({ children }: { children: React.ReactNode }) {
  const supabase = createPagesBrowserClient();
  const router   = useRouter();

  /* 🔑 Sincroniza cookie ↔️ servidor */
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ event: _event, session }),
      });
      router.refresh();           // ← fuerza revalidación de layouts server
    });
    return () => subscription.unsubscribe();
  }, [supabase, router]);

  return (
    <SessionContextProvider supabaseClient={supabase}>
      <AuthProvider>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <Header />
          <main className="pt-10">{children}</main>
          <Toaster />
        </ThemeProvider>
      </AuthProvider>
    </SessionContextProvider>
  );
}
