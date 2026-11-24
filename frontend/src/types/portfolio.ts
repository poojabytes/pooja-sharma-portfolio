export type Profile = {
  id: number;
  name: string;
  designation: string | null;
  biography: string | null;
  email: string | null;
  location: string | null;
  profile_image_url: string | null;
};

export type SocialLink = {
  id: number;
  platform: string;
  label: string;
  url: string;
  display_order: number;
};

export type Skill = {
  id: number;
  name: string;
  category: string;
  display_order: number;
};

export type ProjectImage = {
  id: number;
  image_url: string;
  image_type: string;
  display_order: number;
};

export type Project = {
  id: number;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  technologies: string | null;
  github_url: string | null;
  live_url: string | null;
  is_featured: boolean;
  display_order: number;
  images: ProjectImage[];
};

export type Experience = {
  id: number;
  company: string;
  designation: string;
  employment_type: string | null;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
  responsibilities: string | null;
  technologies: string | null;
  display_order: number;
};

export type Education = {
  id: number;
  institution: string;
  degree: string;
  field_of_study: string | null;
  start_year: number | null;
  end_year: number | null;
  description: string | null;
  display_order: number;
};

export type Certificate = {
  id: number;
  title: string;
  issuer: string | null;
  issue_date: string | null;
  image_url: string | null;
  pdf_url: string | null;
  display_order: number;
};

export type Resume = {
  id: number;
  file_url: string;
  file_name: string;
  updated_at: string;
};