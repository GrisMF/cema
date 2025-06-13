// app/api/auth/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/lib/supabase/database.types";

export async function POST(req: Request) {
  const { event, session } = await req.json();
  const supabase = createRouteHandlerClient<Database>({ cookies });

  if (!session || event === "SIGNED_OUT") {
    /* El cliente avisa que cerró sesión → limpiamos cookies */
    await supabase.auth.signOut({ scope: "global" });
  } else {
    /* Evento SIGNED_IN / TOKEN_REFRESHED / USER_UPDATED → guardamos */
    await supabase.auth.setSession(session);
  }

  return NextResponse.json({ success: true, handled: event });
}
