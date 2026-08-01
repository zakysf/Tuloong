import axios from "axios";

const TOKEN_KEY = "tuloong_token";

// ── Token helpers ─────────────────────────────────────────────────────────────

export function saveToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

export function getToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
}

export function clearToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
  }
}

// ── Axios instance ────────────────────────────────────────────────────────────

const api = axios.create({
  baseURL: "", // Requests go to Next.js dev server, which proxies /api/* to Laravel via rewrites in next.config.ts
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ── Request interceptor: attach Bearer token ──────────────────────────────────

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// ── Response interceptor: normalise errors ────────────────────────────────────

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Coba ulang 1x jika dapat 401 (mitigasi bug PHP built-in server di Windows yang drop header saat concurrent)
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      const token = getToken();
      if (token) {
        originalRequest.headers["Authorization"] = `Bearer ${token}`;
      }
      try {
        // Tunggu 500ms sebelum retry agar PHP built-in server punya waktu luang
        await new Promise(resolve => setTimeout(resolve, 500));
        return await axios(originalRequest); // gunakan axios murni agar tidak loop interceptor
      } catch (retryError: any) {
        if (retryError.response?.status === 401) {
          clearToken();
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
        }
        return Promise.reject(retryError);
      }
    } else if (error.response?.status === 401) {
      // Jika retry gagal atau sudah retry, baru logout
      clearToken();
      if (typeof window !== "undefined") {
        alert("Sesi Anda telah berakhir atau tidak valid. Silakan login kembali.");
        window.location.href = "/login";
      }
    } else if (error.response?.status === 403) {
      // Token swapped or role mismatched - force sync by going home
      if (typeof window !== "undefined") {
        alert("Anda tidak memiliki akses ke halaman ini. Kembali ke beranda.");
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
