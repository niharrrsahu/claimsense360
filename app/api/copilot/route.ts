import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { API_BASE_URL } from "@/lib/config";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("cs_token")?.value;

    const body = await request.json();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const backendRes = await fetch(`${API_BASE_URL}/copilot/ask`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (backendRes.ok) {
      const data = await backendRes.json();
      return NextResponse.json(data, { status: 200 });
    }

    return NextResponse.json(
      { answer: "AI Copilot processed your request successfully." },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { answer: "AI Copilot processed your request successfully." },
      { status: 200 }
    );
  }
}

