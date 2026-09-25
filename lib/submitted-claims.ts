export const globalSubmittedClaims: any[] = [];

export function registerSubmittedClaim(claim: any) {
  if (!claim) return;
  const id = claim.id || claim.claim_id;
  if (!id) return;
  const normalized = { ...claim, id };
  const existingIdx = globalSubmittedClaims.findIndex((c) => c.id === id);
  if (existingIdx >= 0) {
    globalSubmittedClaims[existingIdx] = normalized;
  } else {
    globalSubmittedClaims.unshift(normalized);
  }
}

