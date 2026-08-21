// In production this MUST be set to your real backend URL (e.g. your Railway
// deployment) via the NEXT_PUBLIC_API_URL environment variable in Vercel's project
// settings. The localhost fallback below is only correct for local development —
// if it's ever hit in production it means the env var wasn't set, and every
// backend call will silently fail (which is why removing the fake-fallback
// behavior elsewhere in this app matters: failures now surface as real errors
// instead of being masked).
if (process.env.NODE_ENV === "production" && !process.env.NEXT_PUBLIC_API_URL) {
  console.error(
    "NEXT_PUBLIC_API_URL is not set in production. Set it in Vercel project settings to your real backend URL."
  );
}

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.API_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://claimsense360-production.up.railway.app"
    : "http://localhost:8000");

