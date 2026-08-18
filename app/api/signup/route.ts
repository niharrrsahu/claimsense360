import { NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/config";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Register user
    const regRes = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        full_name: body.full_name,
        email: body.email,
        password: body.password,
      }),
    });

    const regData = await regRes.json();
    if (!regRes.ok) {
      return NextResponse.json(
        { error: regData.detail || "Registration failed" },
        { status: regRes.status }
      );
    }

    // 2. Auto-login after registration
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
        { error: loginData.detail || "Auto-login failed" },
        { status: loginRes.status }
      );
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set({
      name: "cs_token",
      value: loginData.access_token,
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 1800,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
