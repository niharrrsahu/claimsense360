import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { API_BASE_URL } from "@/lib/config";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const question = (body?.question || "").trim();

    if (!question) {
      return NextResponse.json({ answer: "Please enter a question or query." }, { status: 400 });
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("cs_token")?.value;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    let backendRes: Response | null = null;
    try {
      backendRes = await fetch(`${API_BASE_URL}/copilot/ask`, {
        method: "POST",
        headers,
        body: JSON.stringify({ question }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
    } catch (fetchErr) {
      clearTimeout(timeoutId);
      console.error("Backend copilot fetch error:", fetchErr);
    }

    if (backendRes && backendRes.ok) {
      const data = await backendRes.json();
      return NextResponse.json(data, { status: 200 });
    }

    // Fallback if backend service is unreachable
    return NextResponse.json(
      {
        answer: `👋 **ClaimSense 360 AI Copilot**\n\nUnable to reach backend AI service (${API_BASE_URL}). Please verify your backend server status or environment configuration.`,
        followUpActions: [
          { label: "🚨 Show High-Risk Claims", prompt: "Show me all high-risk fraud claims summary" },
          { label: "📊 Overall Portfolio Stats", prompt: "Explain total portfolio statistics and average claim amount" }
        ],
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        answer: "👋 **ClaimSense 360 AI Copilot**\n\nAn unexpected error occurred while processing your request.",
        followUpActions: [],
      },
      { status: 200 }
    );
  }
}
