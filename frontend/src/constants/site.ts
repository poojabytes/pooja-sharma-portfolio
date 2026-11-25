export const SITE = {
  name: "Pooja Sharma",
  headline: "Full Stack Developer",
  title: "Pooja Sharma | Developer Portfolio",
} as const;

/** Public-facing professional title (consistent sitewide). */
export function publicRole(_designation?: string | null): string {
  return SITE.headline;
}