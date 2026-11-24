import { apiV1 } from "./api";

export type ContactPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export async function submitContact(payload: ContactPayload) {
  const { data } = await apiV1.post<{ message: string }>("/contact", payload);
  return data;
}