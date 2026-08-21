import { NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/config";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    let regRes: Response;
    try {
      regRes = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: body.full_name,
          email: body.email,
          password: body.password,
        }),
      });
    } catch (fetchErr: any) {
      console.error("Backend signup service unreachable:", fetchErr);
      return NextResponse.json(
        { error: "Signup service is temporarily unavailable. Please try again in a moment." },
        { status: 502 }
      );
    }

    if (!regRes.ok) {
      let detail = "Signup failed";
      try {
        const errData = await regRes.json();
        detail = errData.detail || detail;
      } catch {
        // ignore
      }
      return NextResponse.json({ error: detail }, { status: regRes.status });
    }

    let loginRes: Response;
    try {
      loginRes = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: body.email,
          password: body.password,
        }),
      });
    } catch (fetchErr: any) {
      console.error("Backend auth service unreachable right after signup:", fetchErr);
      return NextResponse.json(
        { error: "Account created, but login is temporarily unavailable. Please try logging in shortly." },
        { status: 502 }
      );
    }

    if (!loginRes.ok) {
      return NextResponse.json(
        { error: "Account created, but automatic login failed. Please log in manually." },
        { status: loginRes.status }
      );
    }

    const loginData = await loginRes.json();
    const response = NextResponse.json({ ok: true });
    response.cookies.set({
      name: "cs_token",
      value: loginData.access_token,
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 86400,
    });
    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
