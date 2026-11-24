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

export async function ownerGetOverview() {
  const { data } = await apiV1.get<Overview>("/admin/overview");
  return data;
}

export async function ownerGetProfile() {
  const { data } = await apiV1.get<Profile>("/admin/profile");
  return data;
}

export async function ownerUpdateProfile(payload: ProfileUpdate) {
  const { data } = await apiV1.put<Profile>("/admin/profile", payload);
  return data;
}

export async function ownerUploadProfilePhoto(file: File) {
  const form = new FormData();
  form.append("file", file);
  const { data } = await apiV1.post<Profile>("/admin/profile/photo", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function ownerListSocialLinks() {
  const { data } = await apiV1.get<SocialLink[]>("/social-links");
  return data;
}

export async function ownerCreateSocialLink(payload: Omit<SocialLink, "id">) {
  const { data } = await apiV1.post<SocialLink>("/admin/social-links", payload);
  return data;
}

export async function ownerUpdateSocialLink(
  id: number,
  payload: Omit<SocialLink, "id">,
) {
  const { data } = await apiV1.put<SocialLink>(`/admin/social-links/${id}`, payload);
  return data;
}

export async function ownerDeleteSocialLink(id: number) {
  await apiV1.delete(`/admin/social-links/${id}`);
}

export async function ownerListSkills() {
  const { data } = await apiV1.get<Skill[]>("/skills");
  return data;
}

export async function ownerCreateSkill(payload: Omit<Skill, "id">) {
  const { data } = await apiV1.post<Skill>("/admin/skills", payload);
  return data;
}

export async function ownerUpdateSkill(id: number, payload: Omit<Skill, "id">) {
  const { data } = await apiV1.put<Skill>(`/admin/skills/${id}`, payload);
  return data;
}

export async function ownerDeleteSkill(id: number) {
  await apiV1.delete(`/admin/skills/${id}`);
}

export async function ownerListProjects() {
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

export async function ownerCreateProject(payload: ProjectCreatePayload) {
  const { data } = await apiV1.post<Project>("/admin/projects", payload);
  return data;
}

export async function ownerUpdateProject(id: number, payload: ProjectCreatePayload) {
  const { data } = await apiV1.put<Project>(`/admin/projects/${id}`, payload);
  return data;
}

export async function ownerDeleteProject(id: number) {
  await apiV1.delete(`/admin/projects/${id}`);
}

export async function ownerUploadProjectThumbnail(id: number, file: File) {
  const form = new FormData();
  form.append("file", file);
  const { data } = await apiV1.post<Project>(`/admin/projects/${id}/thumbnail`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function ownerListExperience() {
  const { data } = await apiV1.get<Experience[]>("/experience");
  return data;
}

export async function ownerCreateExperience(payload: Omit<Experience, "id">) {
  const { data } = await apiV1.post<Experience>("/admin/experience", payload);
  return data;
}

export async function ownerUpdateExperience(
  id: number,
  payload: Omit<Experience, "id">,
) {
  const { data } = await apiV1.put<Experience>(`/admin/experience/${id}`, payload);
  return data;
}

export async function ownerDeleteExperience(id: number) {
  await apiV1.delete(`/admin/experience/${id}`);
}

export async function ownerListEducation() {
  const { data } = await apiV1.get<Education[]>("/education");
  return data;
}

export async function ownerCreateEducation(payload: Omit<Education, "id">) {
  const { data } = await apiV1.post<Education>("/admin/education", payload);
  return data;
}

export async function ownerUpdateEducation(
  id: number,
  payload: Omit<Education, "id">,
) {
  const { data } = await apiV1.put<Education>(`/admin/education/${id}`, payload);
  return data;
}

export async function ownerDeleteEducation(id: number) {
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

export async function ownerListCertificates() {
  const { data } = await apiV1.get<Certificate[]>("/certificates");
  return data;
}

export async function ownerCreateCertificate(payload: CertificateInput) {
  const { data } = await apiV1.post<Certificate>("/admin/certificates", payload);
  return data;
}

export async function ownerUpdateCertificate(id: number, payload: CertificateInput) {
  const { data } = await apiV1.put<Certificate>(`/admin/certificates/${id}`, payload);
  return data;
}

export async function ownerDeleteCertificate(id: number) {
  await apiV1.delete(`/admin/certificates/${id}`);
}

export async function ownerUploadCertificateImage(id: number, file: File) {
  const form = new FormData();
  form.append("file", file);
  const { data } = await apiV1.post<Certificate>(
    `/admin/certificates/${id}/image`,
    form,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return data;
}

export async function ownerUploadCertificatePdf(id: number, file: File) {
  const form = new FormData();
  form.append("file", file);
  const { data } = await apiV1.post<Certificate>(
    `/admin/certificates/${id}/pdf`,
    form,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return data;
}

export async function ownerGetResume() {
  try {
    const { data } = await apiV1.get<Resume>("/resume");
    return data;
  } catch {
    return null;
  }
}

export async function ownerUploadResume(file: File) {
  const form = new FormData();
  form.append("file", file);
  const { data } = await apiV1.post<Resume>("/admin/resume", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function ownerDeleteResume() {
  await apiV1.delete("/admin/resume");
}

export async function ownerListMessages() {
  const { data } = await apiV1.get<ContactMessage[]>("/admin/contact-messages");
  return data;
}

export async function ownerMarkMessageRead(id: number) {
  const { data } = await apiV1.patch<ContactMessage>(
    `/admin/contact-messages/${id}/read`,
  );
  return data;
}

export async function ownerDeleteMessage(id: number) {
  await apiV1.delete(`/admin/contact-messages/${id}`);
}

export async function ownerListSettings() {
  const { data } = await apiV1.get<WebsiteSetting[]>("/admin/settings");
  return data;
}

export async function ownerUpsertSetting(key: string, value: string) {
  const { data } = await apiV1.put<WebsiteSetting>("/admin/settings", { key, value });
  return data;
}