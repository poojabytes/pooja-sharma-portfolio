import { apiV1 } from "./api";
import type {
  Certificate,
  Education,
  Experience,
  Profile,
  Project,
  Resume,
  Skill,
  SocialLink,
} from "@/types/portfolio";

export async function fetchSocialLinks(): Promise<SocialLink[]> {
  const { data } = await apiV1.get<SocialLink[]>("/social-links");
  return data;
}

export async function fetchSkills(): Promise<Skill[]> {
  const { data } = await apiV1.get<Skill[]>("/skills");
  return data;
}

export async function fetchProjects(featured?: boolean): Promise<Project[]> {
  const { data } = await apiV1.get<Project[]>("/projects", {
    params: featured !== undefined ? { featured } : undefined,
  });
  return data;
}

export async function fetchExperience(): Promise<Experience[]> {
  const { data } = await apiV1.get<Experience[]>("/experience");
  return data;
}

export async function fetchEducation(): Promise<Education[]> {
  const { data } = await apiV1.get<Education[]>("/education");
  return data;
}

export async function fetchCertificates(): Promise<Certificate[]> {
  const { data } = await apiV1.get<Certificate[]>("/certificates");
  return data;
}

export async function fetchResume(): Promise<Resume | null> {
  try {
    const { data } = await apiV1.get<Resume>("/resume");
    return data;
  } catch {
    return null;
  }
}

export async function fetchProfileOrNull(): Promise<Profile | null> {
  try {
    const { data } = await apiV1.get<Profile>("/profile");
    return data;
  } catch {
    return null;
  }
}

export type PublicSettings = Record<string, string>;

export async function fetchPublicSettings(): Promise<PublicSettings> {
  try {
    const { data } = await apiV1.get<{ key: string; value: string }[]>("/settings/public");
    return Object.fromEntries(data.map((row) => [row.key, row.value]));
  } catch {
    return {};
  }
}

export type PortfolioSnapshot = {
  profile: Profile | null;
  publicSettings: PublicSettings;
  socialLinks: SocialLink[];
  skills: Skill[];
  projects: Project[];
  featuredProjects: Project[];
  experience: Experience[];
  education: Education[];
  certificates: Certificate[];
  resume: Resume | null;
};

export async function fetchPortfolioSnapshot(): Promise<PortfolioSnapshot> {
  const [
    profile,
    publicSettings,
    socialLinks,
    skills,
    projects,
    featuredProjects,
    experience,
    education,
    certificates,
    resume,
  ] = await Promise.all([
    fetchProfileOrNull(),
    fetchPublicSettings(),
    fetchSocialLinks().catch(() => [] as SocialLink[]),
    fetchSkills().catch(() => [] as Skill[]),
    fetchProjects().catch(() => [] as Project[]),
    fetchProjects(true).catch(() => [] as Project[]),
    fetchExperience().catch(() => [] as Experience[]),
    fetchEducation().catch(() => [] as Education[]),
    fetchCertificates().catch(() => [] as Certificate[]),
    fetchResume(),
  ]);

  return {
    profile,
    publicSettings,
    socialLinks,
    skills,
    projects,
    featuredProjects,
    experience,
    education,
    certificates,
    resume,
  };
}