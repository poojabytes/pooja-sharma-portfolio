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

export type ProfileUpdate = Partial<
  Pick<
    Profile,
    "name" | "designation" | "biography" | "email" | "location"
  >
>;

export type ContactMessage = {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

export type WebsiteSetting = {
  key: string;
  value: string;
};

export type Overview = {
  profile_configured: boolean;
  name: string;
};

export async function adminGetOverview() {
  const { data } = await apiV1.get<Overview>("/admin/overview");
  return data;
}

export async function adminGetProfile() {
  const { data } = await apiV1.get<Profile>("/admin/profile");
  return data;
}

export async function adminUpdateProfile(payload: ProfileUpdate) {
  const { data } = await apiV1.put<Profile>("/admin/profile", payload);
  return data;
}

export async function adminUploadProfilePhoto(file: File) {
  const form = new FormData();
  form.append("file", file);
  const { data } = await apiV1.post<Profile>("/admin/profile/photo", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function adminListSocialLinks() {
  const { data } = await apiV1.get<SocialLink[]>("/social-links");
  return data;
}

export async function adminCreateSocialLink(payload: Omit<SocialLink, "id">) {
  const { data } = await apiV1.post<SocialLink>("/admin/social-links", payload);
  return data;
}

export async function adminUpdateSocialLink(
  id: number,
  payload: Omit<SocialLink, "id">,
) {
  const { data } = await apiV1.put<SocialLink>(`/admin/social-links/${id}`, payload);
  return data;
}

export async function adminDeleteSocialLink(id: number) {
  await apiV1.delete(`/admin/social-links/${id}`);
}

export async function adminListSkills() {
  const { data } = await apiV1.get<Skill[]>("/skills");
  return data;
}

export async function adminCreateSkill(payload: Omit<Skill, "id">) {
  const { data } = await apiV1.post<Skill>("/admin/skills", payload);
  return data;
}

export async function adminUpdateSkill(id: number, payload: Omit<Skill, "id">) {
  const { data } = await apiV1.put<Skill>(`/admin/skills/${id}`, payload);
  return data;
}

export async function adminDeleteSkill(id: number) {
  await apiV1.delete(`/admin/skills/${id}`);
}

export async function adminListProjects() {
  const { data } = await apiV1.get<Project[]>("/projects");
  return data;
}

export type ProjectCreatePayload = {
  title: string;
  description?: string | null;
  technologies?: string | null;
  github_url?: string | null;
  live_url?: string | null;
  is_featured?: boolean;
  display_order?: number;
  thumbnail_url?: string | null;
};

export async function adminCreateProject(payload: ProjectCreatePayload) {
  const { data } = await apiV1.post<Project>("/admin/projects", payload);
  return data;
}

export async function adminUpdateProject(id: number, payload: ProjectCreatePayload) {
  const { data } = await apiV1.put<Project>(`/admin/projects/${id}`, payload);
  return data;
}

export async function adminDeleteProject(id: number) {
  await apiV1.delete(`/admin/projects/${id}`);
}

export async function adminUploadProjectThumbnail(id: number, file: File) {
  const form = new FormData();
  form.append("file", file);
  const { data } = await apiV1.post<Project>(`/admin/projects/${id}/thumbnail`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function adminListExperience() {
  const { data } = await apiV1.get<Experience[]>("/experience");
  return data;
}

export async function adminCreateExperience(payload: Omit<Experience, "id">) {
  const { data } = await apiV1.post<Experience>("/admin/experience", payload);
  return data;
}

export async function adminUpdateExperience(
  id: number,
  payload: Omit<Experience, "id">,
) {
  const { data } = await apiV1.put<Experience>(`/admin/experience/${id}`, payload);
  return data;
}

export async function adminDeleteExperience(id: number) {
  await apiV1.delete(`/admin/experience/${id}`);
}

export async function adminListEducation() {
  const { data } = await apiV1.get<Education[]>("/education");
  return data;
}

export async function adminCreateEducation(payload: Omit<Education, "id">) {
  const { data } = await apiV1.post<Education>("/admin/education", payload);
  return data;
}

export async function adminUpdateEducation(
  id: number,
  payload: Omit<Education, "id">,
) {
  const { data } = await apiV1.put<Education>(`/admin/education/${id}`, payload);
  return data;
}

export async function adminDeleteEducation(id: number) {
  await apiV1.delete(`/admin/education/${id}`);
}

export type CertificateInput = {
  title: string;
  issuer?: string | null;
  issue_date?: string | null;
  image_url?: string | null;
  pdf_url?: string | null;
  display_order: number;
};

export async function adminListCertificates() {
  const { data } = await apiV1.get<Certificate[]>("/certificates");
  return data;
}

export async function adminCreateCertificate(payload: CertificateInput) {
  const { data } = await apiV1.post<Certificate>("/admin/certificates", payload);
  return data;
}

export async function adminUpdateCertificate(id: number, payload: CertificateInput) {
  const { data } = await apiV1.put<Certificate>(`/admin/certificates/${id}`, payload);
  return data;
}

export async function adminDeleteCertificate(id: number) {
  await apiV1.delete(`/admin/certificates/${id}`);
}

export async function adminUploadCertificateImage(id: number, file: File) {
  const form = new FormData();
  form.append("file", file);
  const { data } = await apiV1.post<Certificate>(
    `/admin/certificates/${id}/image`,
    form,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return data;
}

export async function adminUploadCertificatePdf(id: number, file: File) {
  const form = new FormData();
  form.append("file", file);
  const { data } = await apiV1.post<Certificate>(
    `/admin/certificates/${id}/pdf`,
    form,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return data;
}

export async function adminGetResume() {
  try {
    const { data } = await apiV1.get<Resume>("/resume");
    return data;
  } catch {
    return null;
  }
}

export async function adminUploadResume(file: File) {
  const form = new FormData();
  form.append("file", file);
  const { data } = await apiV1.post<Resume>("/admin/resume", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function adminDeleteResume() {
  await apiV1.delete("/admin/resume");
}

export async function adminListMessages() {
  const { data } = await apiV1.get<ContactMessage[]>("/admin/contact-messages");
  return data;
}

export async function adminMarkMessageRead(id: number) {
  const { data } = await apiV1.patch<ContactMessage>(
    `/admin/contact-messages/${id}/read`,
  );
  return data;
}

export async function adminDeleteMessage(id: number) {
  await apiV1.delete(`/admin/contact-messages/${id}`);
}

export async function adminListSettings() {
  const { data } = await apiV1.get<WebsiteSetting[]>("/admin/settings");
  return data;
}

export async function adminUpsertSetting(key: string, value: string) {
  const { data } = await apiV1.put<WebsiteSetting>("/admin/settings", { key, value });
  return data;
}