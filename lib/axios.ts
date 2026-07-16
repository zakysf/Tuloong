import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000",
  withCredentials: true, // Required for Laravel Sanctum cookie-based auth
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ── Request interceptor: attach XSRF token if present ────────────────────────
api.interceptors.request.use((config) => {
  // Laravel Sanctum CSRF: first call /sanctum/csrf-cookie, then XSRF-TOKEN
  // cookie is automatically sent via withCredentials. Nothing extra needed here.
  return config;
});

// ── Response interceptor: normalise errors ───────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired / unauthenticated — redirect to login (client-side)
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
