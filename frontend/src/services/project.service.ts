import { apiV1 } from "./api";

export async function fetchProjects() {
  const { data } = await apiV1.get("/projects");
  return data;
}

export async function fetchProject(id: string) {
  const { data } = await apiV1.get(`/projects/${id}`);
  return data;
}