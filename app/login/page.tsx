// app/login/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button }               from "@/components/ui/button";
import { Input }                from "@/components/ui/input";
import { Label }                from "@/components/ui/label";
import { Card, CardContent }    from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
 Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
 } from "@/components/ui/tabs";
import {
  AlertCircle,
  Clock,
  CheckCircle,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail]     = useState("");
  const [password, setPass]   = useState("");
  const [name, setName]       = useState("");
  const [error, setError]     = useState("");
  const [success, setSucc]    = useState("");
  const [cooldown, setCd]     = useState(0);
  const [tab, setTab]         = useState<"login" | "register">("login");
  const [busyLogin, setBL]    = useState(false);
  const [busyReg, setBR]      = useState(false);

  const searchParams = useSearchParams();
  const { login, register } = useAuth();

  /* mensajes via query string */
  useEffect(() => {
    const del = searchParams.get("accountDeleted") === "true";
    const reg = searchParams.get("registered")     === "true";
    if (del) setSucc("Tu cuenta ha sido eliminada correctamente.");
    if (reg) setSucc("Te has registrado correctamente. Ahora puedes iniciar sesión.");
  }, [searchParams]);

  /* cooldown visual */
  useEffect(() => {
    if (cooldown === 0) return;
    const t = setInterval(() => setCd((s) => (s <= 1 ? 0 : s - 1)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  /* util */
  const extractWait = (msg: string) => {
    const m =
      msg.match(/after\s+(\d+)\s+seconds/i) ||
      msg.match(/despu[eé]s\s+de\s+(\d+)\s+segundos?/i);
    return m?.[1] ? Number(m[1]) : 30;
  };

  /* handlers */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBL(true);
    const { success, message } = await login(email, password);
    if (!success) setError(message || "Credenciales incorrectas.");
    setBL(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSucc("");

    if (cooldown > 0) {
      setError(`Por favor, espera ${cooldown} s antes de intentarlo nuevamente.`);
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setBR(true);
    const { success, message } = await register(email, password, name);
    if (!success) {
      const wait = extractWait(message || "");
      setCd(wait);
      setError(message || "No se pudo registrar.");
    }
    setBR(false);
  };

  /* UI */
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-16 pb-12 px-4">
      <div className="max-w-md w-full space-y-8">

        {/* logo y título */}
        <div className="text-center">
          <Image
            src="/images/cema-logo.png"
            alt="CEMA"
            width={200}
            height={80}
            className="mx-auto"
          />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Bienvenido</h2>
          <p className="mt-2 text-sm text-gray-600">Accede a tu cuenta para utilizar el cotizador</p>
        </div>

        {success && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
            <TabsTrigger value="register">Registrarse</TabsTrigger>
          </TabsList>

          {/* login */}
          <TabsContent value="login">
            <Card>
              <CardContent className="pt-6">
                {error && tab === "login" && (
                  <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Correo electrónico</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Contraseña</Label>
                    <Input id="password" type="password" value={password} onChange={(e) => setPass(e.target.value)} required />
                  </div>
                  <Button type="submit" className="w-full" disabled={busyLogin}>
                    {busyLogin ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Iniciando…</> : "Iniciar sesión"}
                  </Button>
                  <div className="mt-4 text-center">
                    <Link href="/recuperar-password" className="text-sm text-blue-600 hover:text-blue-800">
                      ¿Olvidaste tu contraseña?
                    </Link>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* register */}
          <TabsContent value="register">
            <Card>
              <CardContent className="pt-6">
                {error && tab === "register" && (
                  <Alert className={`mb-6 ${cooldown > 0 ? "bg-yellow-50 border-yellow-200" : "bg-red-50 border-red-200"}`}>
                    {cooldown > 0 ? <Clock className="h-4 w-4 text-yellow-600" /> : <AlertCircle className="h-4 w-4 text-red-600" />}
                    <AlertDescription className={`${cooldown > 0 ? "text-yellow-800" : "text-red-800"}`}>{error}</AlertDescription>
                  </Alert>
                )}
                <form onSubmit={handleRegister} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Correo electrónico</Label>
                    <Input id="register-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Contraseña</Label>
                    <Input id="register-password" type="password" value={password} onChange={(e) => setPass(e.target.value)} required minLength={6} />
                  </div>
                  <Button type="submit" className="w-full" disabled={busyReg || cooldown > 0}>
                    {busyReg ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Registrando…</>
                    ) : cooldown > 0 ? (
                      `Espera ${cooldown}s`
                    ) : (
                      "Registrarse"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
