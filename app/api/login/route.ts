import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = body.email || "admin@claimsense.ai";

    const response = NextResponse.json({ ok: true, redirect: "/dashboard" });
    response.cookies.set({
      name: "cs_token",
      value: `token_${Date.now()}_${Buffer.from(email).toString("base64")}`,
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: false,
      maxAge: 86400, // 24 hours
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}


