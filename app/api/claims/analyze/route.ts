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

    const formData = await request.formData();

    let backendRes: Response;
    try {
      backendRes = await fetch(`${API_BASE_URL}/claims/analyze`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
    } catch (fetchErr: any) {
      // The previous version of this route fabricated a fake fraud score, damage
      // severity, and SHAP-like "top_factors" here whenever the backend was
      // unreachable, using a hand-written formula with hardcoded phrases like
      // "Front Bumper Assembly". That has been removed entirely — a claim
      // analysis result must always come from the real ML pipeline, or the
      // request must fail visibly so the person submitting the claim (and the
      // insurance team relying on the result) knows it wasn't actually analyzed.
      console.error("Claims analysis backend unreachable:", fetchErr);
      return NextResponse.json(
        {
          error:
            "The claim analysis service is temporarily unavailable. Your claim was not analyzed — please retry in a moment.",
        },
        { status: 502 }
      );
    }

    if (backendRes.ok) {
      const data = await backendRes.json();
      return NextResponse.json(data, { status: 200 });
    }

    let detail = `Failed to analyze claim (Status ${backendRes.status})`;
    try {
      const errData = await backendRes.json();
      if (typeof errData.detail === "string") {
        detail = errData.detail;
      } else if (Array.isArray(errData.detail)) {
        detail = errData.detail.map((e: any) => `${e.loc?.join(".") || "field"}: ${e.msg}`).join("; ");
      } else if (errData.detail) {
        detail = JSON.stringify(errData.detail);
      } else if (errData.error) {
        detail = typeof errData.error === "string" ? errData.error : JSON.stringify(errData.error);
      }
    } catch {
      // ignore
    }
    return NextResponse.json({ error: detail }, { status: backendRes.status });

  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to analyze claim" },
      { status: 500 }
    );
  }
}
