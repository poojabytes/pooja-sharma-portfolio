import type { LucideIcon } from "lucide-react";
import {
  Award,
  Briefcase,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Link2,
  Mail,
  Settings,
  User,
  Wrench,
  FolderKanban,
} from "lucide-react";

export type AdminNavItem = {
  to: string;
  label: string;
  icon: LucideIcon;
};

export const ADMIN_NAV: AdminNavItem[] = [
  { to: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/admin/dashboard/profile", label: "Profile", icon: User },
  { to: "/admin/dashboard/social-links", label: "Social Links", icon: Link2 },
  { to: "/admin/dashboard/resume", label: "Resume", icon: FileText },
  { to: "/admin/dashboard/skills", label: "Skills", icon: Wrench },
  { to: "/admin/dashboard/projects", label: "Projects", icon: FolderKanban },
  { to: "/admin/dashboard/experience", label: "Experience", icon: Briefcase },
  { to: "/admin/dashboard/education", label: "Education", icon: GraduationCap },
  { to: "/admin/dashboard/certificates", label: "Certificates", icon: Award },
  { to: "/admin/dashboard/messages", label: "Contact Messages", icon: Mail },
  { to: "/admin/dashboard/settings", label: "Settings", icon: Settings },
];

export const SKILL_CATEGORIES = [
  "Programming Languages",
  "Backend Development",
  "Frontend Development",
  "Databases",
  "Cloud & DevOps",
  "Developer Tools",
] as const;