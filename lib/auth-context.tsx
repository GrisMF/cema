// lib/auth-context.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  useSession,
  useUser,
  useSupabaseClient,
} from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";

/* ───────── tipos ───────── */
interface AppUser {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user";
  isSuperuser: boolean;
}
interface AuthContextType {
  user: AppUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSuperuser: boolean;
  login(email: string, pass: string): Promise<{ success: boolean; message?: string }>;
  register(email: string, pass: string, name: string): Promise<{ success: boolean; message?: string }>;
  logout(): Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* ───────── helper que escribe cookie y espera ───────── */
async function syncCookie(event: "SIGNED_IN" | "SIGNED_OUT", session: any) {
  await fetch("/api/auth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify({ event, session }),
  });
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const supabase = useSupabaseClient();
  const session  = useSession();
  const rawUser  = useUser();
  const router   = useRouter();

  const [user, setUser]         = useState<AppUser | null>(null);
  const [isLoading, setLoading] = useState(true);

  /* ───────── lee perfil cuando haya rawUser ───────── */
  useEffect(() => {
    if (!rawUser) { setUser(null); setLoading(false); return; }
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from("users")
        .select("name, role, is_superuser")
        .eq("id", rawUser.id)
        .maybeSingle();

      setUser({
        id: rawUser.id,
        email: rawUser.email ?? "",
        name: data?.name ?? (rawUser.user_metadata as any)?.name ?? "",
        role: (data?.role as "admin" | "user") ?? "user",
        isSuperuser: data?.is_superuser ?? false,
      });
      setLoading(false);
    })();
  }, [rawUser, supabase]);

  /* ───────── LOGIN ───────── */
  const login: AuthContextType["login"] = async (email, pass) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) { setLoading(false); return { success: false, message: error.message }; }

    /* ✨ 1. Escribe cookie y espera */
    await syncCookie("SIGNED_IN", data.session);

    /* 2. Navega */
    await router.replace("/cotizador");
    setLoading(false);
    return { success: true };
  };

  /* ───────── REGISTER ───────── */
  const register: AuthContextType["register"] = async (email, pass, name) => {
    setLoading(true);
    const { data: signUp, error } = await supabase.auth.signUp({
      email, password: pass, options: { data: { name } },
    });
    if (error) { setLoading(false); return { success: false, message: error.message }; }

    if (signUp.user) {
      await supabase.from("users").insert({
        id: signUp.user.id, email, name, role: "user", is_superuser: false,
      });
    }
    await syncCookie("SIGNED_IN", signUp.session);
    await router.replace("/cotizador");
    setLoading(false);
    return { success: true };
  };

  /* ───────── LOGOUT ───────── */
  const logout = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut({ scope: "global" });
    if (error) console.error(error);

    await syncCookie("SIGNED_OUT", null);
    await router.replace("/");
    setLoading(false);
  };

  /* ───────── flags ───────── */
  const isAuthenticated = !!session && !!user;
  const isAdmin     = user?.role === "admin";
  const isSuperuser = user?.isSuperuser ?? false;

  return (
    <AuthContext.Provider value={{
      user, isLoading, isAuthenticated, isAdmin, isSuperuser,
      login, register, logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
