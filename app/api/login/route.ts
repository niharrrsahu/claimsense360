import { NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/config";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const loginRes = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: body.email,
        password: body.password,
      }),
    });

    const loginData = await loginRes.json();
    if (!loginRes.ok) {
      return NextResponse.json(
        { error: loginData.detail || "Invalid email or password" },
        { status: loginRes.status }
      );
    }

    const response = NextResponse.json({ ok: true, redirect: "/dashboard" });
    response.cookies.set({
      name: "cs_token",
      value: loginData.access_token,
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



