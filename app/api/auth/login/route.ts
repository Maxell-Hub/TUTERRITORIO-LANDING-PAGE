import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  checkCredentials,
  createToken,
  ADMIN_USER,
  SESSION_COOKIE,
  SESSION_MAX_AGE,
} from "@/lib/auth";
import { rateLimit, clientIp } from "@/lib/rateLimit";

export async function POST(req: Request) {
  // Anti fuerza bruta: máx. 8 intentos por IP cada 10 minutos.
  if (!rateLimit(`login:${clientIp(req)}`, 8, 10 * 60_000)) {
    return NextResponse.json(
      { error: "Demasiados intentos. Espera unos minutos e inténtalo de nuevo." },
      { status: 429 }
    );
  }

  let user = "";
  let pass = "";
  try {
    const body = await req.json();
    user = body?.user ?? "";
    pass = body?.pass ?? "";
  } catch {
    return NextResponse.json({ error: "Solicitud inválida" }, { status: 400 });
  }

  if (!checkCredentials(user, pass)) {
    return NextResponse.json(
      { error: "Usuario o contraseña incorrectos" },
      { status: 401 }
    );
  }

  const store = await cookies();
  store.set(SESSION_COOKIE, createToken(ADMIN_USER), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  return NextResponse.json({ ok: true, user: ADMIN_USER });
}
