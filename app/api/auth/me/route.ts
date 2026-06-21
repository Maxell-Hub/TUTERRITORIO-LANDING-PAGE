import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken, SESSION_COOKIE } from "@/lib/auth";

export async function GET() {
  const store = await cookies();
  const session = verifyToken(store.get(SESSION_COOKIE)?.value);
  return NextResponse.json({ user: session?.user ?? null });
}
