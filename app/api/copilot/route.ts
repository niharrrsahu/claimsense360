import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { API_BASE_URL } from "@/lib/config";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("cs_token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    let backendRes: Response;
    try {
      backendRes = await fetch(`${API_BASE_URL}/copilot/ask`, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });
    } catch (fetchErr: any) {
      // Real error, not a fabricated "processed successfully" message. The Copilot
      // did nothing here — the UI should say so, not pretend otherwise.
      console.error("Copilot backend unreachable:", fetchErr);
      return NextResponse.json(
        { error: "AI Copilot is temporarily unavailable. Please try again shortly." },
        { status: 502 }
      );
    }

    if (backendRes.ok) {
      const data = await backendRes.json();
      return NextResponse.json(data, { status: 200 });
    }

    let detail = "Copilot request failed";
    try {
      const errData = await backendRes.json();
      detail = errData.detail || detail;
    } catch {
      // ignore
    }
    return NextResponse.json({ error: detail }, { status: backendRes.status });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Copilot request failed" },
      { status: 500 }
    );
  }
}
