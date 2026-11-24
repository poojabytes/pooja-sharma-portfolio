import { apiV1 } from "./api";

export async function loginAdmin(email: string, password: string) {
  const { data } = await apiV1.post("/admin/login", { email, password });
  return data;
}

export async function logoutAdmin() {
  const { data } = await apiV1.post("/admin/logout");
  return data;
}

export async function getCurrentAdmin() {
  const { data } = await apiV1.get("/admin/me");
  return data;
}