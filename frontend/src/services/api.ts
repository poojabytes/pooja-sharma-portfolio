import axios from "axios";
import { getApiErrorMessage } from "@/utils/apiError";

const baseURL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

function attachClient(client: ReturnType<typeof axios.create>) {
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      const message = getApiErrorMessage(error, "Request failed");
      const enriched = new Error(message) as Error & { status?: number };
      enriched.status = error?.response?.status;
      if (enriched.status === 401 && typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("portfolio:admin-unauthorized"));
      }
      return Promise.reject(enriched);
    },
  );
}

export const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const apiV1 = axios.create({
  baseURL: `${baseURL.replace(/\/$/, "")}/api/v1`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

attachClient(api);
attachClient(apiV1);