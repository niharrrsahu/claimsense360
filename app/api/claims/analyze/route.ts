import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { API_BASE_URL } from "@/lib/config";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("cs_token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Not authenticated. Please log in first." },
        { status: 401 }
      );
    }

    const formData = await request.formData();

    let backendRes: Response | null = null;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s for ML pipeline + CV

    try {
      backendRes = await fetch(`${API_BASE_URL}/claims/analyze`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
    } catch (fetchErr: any) {
      clearTimeout(timeoutId);
      console.error("Backend analysis request failed or timed out:", fetchErr);
      return NextResponse.json(
        { error: "Claim analysis service is currently unreachable. Please check backend connectivity and retry." },
        { status: 503 }
      );
    }

    if (backendRes && backendRes.ok) {
      const data = await backendRes.json();

      // Combine input data and analysis result into complete claim record for 100% session persistence
      let fullClaimRecord: any = { ...data };
      try {
        const claimStr = formData.get("claim") as string;
        if (claimStr) {
          const parsedInput = JSON.parse(claimStr);
          fullClaimRecord = {
            id: data.claim_id,
            claim_id: data.claim_id,
            ...parsedInput,
            ...data,
            damage_severity: data.damage?.damage_severity || parsedInput.incident_severity,
            damage_score: data.damage?.damage_score ?? 50.0,
            image_data: data.image_data || data.image_path || null,
            image_path: data.image_path || null,
            created_at: new Date().toISOString(),
          };
        }
      } catch {}

      try {
        const { registerSubmittedClaim } = await import("@/lib/submitted-claims");
        registerSubmittedClaim(fullClaimRecord);
      } catch {}

      const response = NextResponse.json(data, { status: 200 });
      if (data.claim_id) {
        response.cookies.set(`cs_claim_${data.claim_id}`, JSON.stringify(fullClaimRecord), {
          path: "/",
          maxAge: 86400,
          sameSite: "lax",
        });
      }
      return response;
    }


    let detail = "Failed to analyze claim. Backend returned an error.";
    let status = 502;
    if (backendRes) {
      status = backendRes.status;
      try {
        const errData = await backendRes.json();
        detail = errData.detail || detail;
      } catch {
        // ignore
      }
    }

    return NextResponse.json({ error: detail }, { status });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to analyze claim" },
      { status: 500 }
    );
  }
}
