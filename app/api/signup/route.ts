import { NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/config";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { full_name, email, password } = body;

    if (!email || !password || password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long." },
        { status: 400 }
      );
    }

    let regRes: Response | null = null;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      regRes = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: full_name || "Claims Adjuster",
          email,
          password,
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
    } catch (fetchErr: any) {
      clearTimeout(timeoutId);
      console.error("Backend signup unreachable or timed out:", fetchErr);
      return NextResponse.json(
        { error: "Authentication server is currently unreachable. Please ensure the backend is running and try again." },
        { status: 503 }
      );
    }

    if (regRes && regRes.ok) {
      // Try backend auto-login
      try {
        const loginRes = await fetch(`${API_BASE_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (loginRes.ok) {
          const loginData = await loginRes.json();
          const response = NextResponse.json({ ok: true, redirect: "/dashboard" });
          response.cookies.set({
            name: "cs_token",
            value: loginData.access_token,
            httpOnly: true,
            path: "/",
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            maxAge: 86400,
          });

          response.cookies.set({
            name: "cs_user_info",
            value: JSON.stringify({
              full_name: full_name || "Claims Adjuster",
              email: email,
              role: "User",
            }),
            httpOnly: false,
            path: "/",
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            maxAge: 86400,
          });
          return response;
        }
      } catch (loginErr) {
        console.error("Auto-login after registration failed:", loginErr);
      }

      // Registration succeeded, redirect user to login
      return NextResponse.json({ ok: true, redirect: "/login", message: "Account created successfully. Please log in." });
    }

    let detail = "Registration failed. An account with this email may already exist.";
    let status = 400;
    if (regRes) {
      status = regRes.status;
      try {
        const errData = await regRes.json();
        detail = errData.detail || detail;
      } catch {
        // ignore
      }
    }

    return NextResponse.json({ error: detail }, { status });

  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

