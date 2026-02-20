import { NextResponse } from "next/server";
import { getServerAuthContext } from "@/platform/auth/server";

export async function GET() {
  const auth = await getServerAuthContext();

  if (!auth.isAuthenticated) {
    return NextResponse.json(
      { session: null },
      { headers: { "Cache-Control": "no-store" } },
    );
  }

  return NextResponse.json(
    {
      session: {
        role: auth.role,
        userId: auth.userId,
      },
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
