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
  isAdmin: boolean;           // ← lo recuperamos
  isSuperuser: boolean;       // ← y éste también
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; message?: string }>;
  register: (
    email: string,
    password: string,
    name: string
  ) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const session = useSession();
  const rawUser = useUser();
  const supabase = useSupabaseClient();
  const router = useRouter();

  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 1️⃣ Traer perfil desde la tabla "users" cada vez que rawUser cambie
  useEffect(() => {
    if (!rawUser) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    const loadProfile = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("users")
          .select("name, role, is_superuser")
          .eq("id", rawUser.id)
          .maybeSingle();

        if (error) {
          console.error("Error al leer perfil:", error);
          setUser(null);
        } else if (data) {
          setUser({
            id: rawUser.id,
            email: rawUser.email || "",
            name: data.name,
            role: data.role as "admin" | "user",
            isSuperuser: data.is_superuser,
          });
        } else {
          // si no hay fila en la tabla, lo inicializamos con lo mínimo
          setUser({
            id: rawUser.id,
            email: rawUser.email || "",
            name: rawUser.user_metadata.name || "",
            role: "user",
            isSuperuser: false,
          });
        }
      } catch (err) {
        console.error("Excepción al cargar perfil:", err);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [rawUser, supabase]);

  // 2️⃣ Métodos de login / register / logout
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setIsLoading(false);
    if (error) return { success: false, message: error.message };
    router.refresh();
    return { success: true };
  };

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);

    // crear auth
    const { data: signUpData, error: signUpError } =
      await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });
    if (signUpError) {
      setIsLoading(false);
      return { success: false, message: signUpError.message };
    }

    // crear fila en tabla users
    if (signUpData.user) {
      const { error: dbError } = await supabase.from("users").insert({
        id: signUpData.user.id,
        email,
        name,
        role: "user",
        is_superuser: false,
      });
      if (dbError) {
        setIsLoading(false);
        return { success: false, message: dbError.message };
      }
    }

    setIsLoading(false);
    router.refresh();
    return { success: true };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  // 3️⃣ Valores derivados
  const isAuthenticated = !!session && !!user;
  const isAdmin = user?.role === "admin";
  const isSuperuser = user?.isSuperuser ?? false;

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        isAdmin,
        isSuperuser,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
