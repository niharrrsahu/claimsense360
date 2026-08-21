export const globalSubmittedClaims: any[] = [];

export function registerSubmittedClaim(claim: any) {
  if (!claim || !claim.id) return;
  const existingIdx = globalSubmittedClaims.findIndex((c) => c.id === claim.id);
  if (existingIdx >= 0) {
    globalSubmittedClaims[existingIdx] = claim;
  } else {
    globalSubmittedClaims.unshift(claim);
  }
}
