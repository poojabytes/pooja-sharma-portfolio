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