export async function analyzeClaim(claimData: any, imageFile?: File | null) {
  const formData = new FormData();
  formData.append("claim", JSON.stringify(claimData));
  if (imageFile) {
    formData.append("image", imageFile);
  }

  const res = await fetch("/api/claims/analyze", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || data.detail || "Analysis failed");
  }
  return data;
}

export async function askCopilot(question: string, claimId?: number | null) {
  const res = await fetch("/api/copilot", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, claim_id: claimId }),
  });

  const data = await res.json();
  if (!res.ok) {
    const errorMsg = data.detail || data.error || "Copilot query failed";
    throw new Error(errorMsg);
  }
  return data;
}
