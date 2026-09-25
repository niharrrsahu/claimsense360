import { API_BASE_URL } from "./config";

/**
 * Resolves a full, safe URL for claim images, supporting:
 * - base64 Data URIs (data:image/...)
 * - absolute URLs (http:// or https://)
 * - relative backend upload paths (/uploads/...)
 */
export function resolveClaimImageUrl(
  imagePath?: string | null,
  imageData?: string | null
): string | null {
  if (imageData && imageData.startsWith("data:")) {
    return imageData;
  }
  const target = imagePath || imageData;
  if (!target) return null;

  if (target.startsWith("http://") || target.startsWith("https://") || target.startsWith("data:")) {
    return target;
  }

  // Ensure leading slash
  const path = target.startsWith("/") ? target : `/${target}`;

  // If in browser or running against API, return API_BASE_URL + path or path
  if (typeof window !== "undefined") {
    // In browser, /uploads will be proxied via next.config rewrites or direct API_BASE_URL
    return path;
  }

  return `${API_BASE_URL}${path}`;
}
