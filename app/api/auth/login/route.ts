import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  checkCredentials,
  createToken,
  ADMIN_USER,
  SESSION_COOKIE,
  SESSION_MAX_AGE,
} from "@/lib/auth";

export async function POST(req: Request) {
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
