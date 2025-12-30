// /utils/fixImageUrl.js
// Robust fixer for malformed / duplicated Supabase URLs.
// Always returns an absolute canonical public URL for your project,
// or "" if it cannot extract a valid path.

const PROJECT_DOMAIN = "https://igahymbyfdfahtglpvcg.supabase.co";
const PUBLIC_PREFIX = "/storage/v1/object/public/";
const BUCKET_PREFIX = "portfolio-images/";

export const fixImageUrl = (rawUrl) => {
  if (!rawUrl || typeof rawUrl !== "string") return "";

  // If already contains canonical prefix, normalize to use our project domain and strip duplicates.
  const publicIdx = rawUrl.lastIndexOf(PUBLIC_PREFIX);
  if (publicIdx !== -1) {
    // path after /storage/v1/object/public/
    const path = rawUrl.slice(publicIdx + PUBLIC_PREFIX.length);
    // ensure the path starts with bucket name (portfolio-images/...)
    const pi = path.indexOf(BUCKET_PREFIX) !== -1 ? path : path.replace(/^\/+/, "");
    return `${PROJECT_DOMAIN}${PUBLIC_PREFIX}${pi}`;
  }

  // If not containing PUBLIC_PREFIX, try to extract the last occurrence of the bucket path
  const lastBucketIdx = rawUrl.lastIndexOf(BUCKET_PREFIX);
  if (lastBucketIdx === -1) {
    // cannot repair
    return "";
  }

  const path = rawUrl.slice(lastBucketIdx); // e.g. portfolio-images/landPortfolio/land/123.jpg
  return `${PROJECT_DOMAIN}${PUBLIC_PREFIX}${path}`;
};
