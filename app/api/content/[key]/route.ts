import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { readContent, writeContent, KEY_RE } from "@/lib/store";
import { defaultFor } from "@/lib/content";
import { verifyToken, SESSION_COOKIE } from "@/lib/auth";

type Ctx = { params: Promise<{ key: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  const { key } = await params;
  if (!KEY_RE.test(key)) {
    return NextResponse.json({ error: "Clave inválida" }, { status: 400 });
  }
  const data = await readContent(key, defaultFor(key));
  return NextResponse.json(data);
}

export async function PUT(req: Request, { params }: Ctx) {
  const { key } = await params;
  if (!KEY_RE.test(key)) {
    return NextResponse.json({ error: "Clave inválida" }, { status: 400 });
  }

  const store = await cookies();
  const session = verifyToken(store.get(SESSION_COOKIE)?.value);
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  await writeContent(key, body);
  return NextResponse.json({ ok: true });
}
