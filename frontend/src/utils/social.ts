import { Github, Globe, Linkedin, Mail, Twitter, type LucideIcon } from "lucide-react";
import type { SocialLink } from "@/types/portfolio";

export function socialIcon(platform: string): LucideIcon {
  const p = platform.toLowerCase();
  if (p.includes("github")) return Github;
  if (p.includes("linkedin")) return Linkedin;
  if (p.includes("mail")) return Mail;
  if (p.includes("twitter") || p === "x") return Twitter;
  return Globe;
}

export function sortedSocials(links: SocialLink[]): SocialLink[] {
  return [...links].sort((a, b) => a.display_order - b.display_order);
}

/** Email is shown via profile mailto / contact CTA — skip duplicate icon rows. */
export function isEmailSocial(platform: string, url?: string): boolean {
  const p = platform.toLowerCase();
  const u = (url ?? "").toLowerCase();
  return p.includes("mail") || p.includes("email") || u.startsWith("mailto:");
}

export function iconSocialLinks(links: SocialLink[]): SocialLink[] {
  return sortedSocials(links).filter((l) => !isEmailSocial(l.platform, l.url));
}