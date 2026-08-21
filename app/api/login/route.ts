import { NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/config";

export async function POST(request: Request) {
  try {
    const body = await request.json();

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
      // Backend unreachable (down, cold-starting, network error). This must be a
      // real error to the client, never a silent fake "success" login.
      console.error("Backend auth service unreachable:", fetchErr);
      return NextResponse.json(
        { error: "Authentication service is temporarily unavailable. Please try again in a moment." },
        { status: 502 }
      );
    }

    if (!loginRes.ok) {
      let detail = "Invalid email or password";
      try {
        const errData = await loginRes.json();
        detail = errData.detail || detail;
      } catch {
        // ignore parse errors, use default detail
      }
      return NextResponse.json({ error: detail }, { status: loginRes.status });
    }

    const loginData = await loginRes.json();
    const response = NextResponse.json({ ok: true, redirect: "/dashboard" });
    response.cookies.set({
      name: "cs_token",
      value: loginData.access_token,
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
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
