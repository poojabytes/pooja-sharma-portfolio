import { apiV1 } from "./api";

export async function fetchProfile() {
  const { data } = await apiV1.get("/profile");
  return data;
}