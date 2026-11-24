const apiBase = (import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000").replace(
  /\/$/,
  "",
);

/** Resolve API-hosted media paths (e.g. local /media uploads) for the browser. */
export function mediaUrl(url: string | null | undefined): string | undefined {
  if (!url) return undefined;
  if (/^https?:\/\//i.test(url)) return url;
  return `${apiBase}${url.startsWith("/") ? url : `/${url}`}`;
}
