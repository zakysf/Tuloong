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
    
    // Coba ulang sampai 3x jika dapat 401 (mitigasi bug PHP built-in server di Windows yang drop header saat concurrent)
    if (error.response?.status === 401 && originalRequest) {
      originalRequest._retryCount = originalRequest._retryCount || 0;
      
      if (originalRequest._retryCount < 3) {
        originalRequest._retryCount += 1;
        const token = getToken();
        if (token) {
          originalRequest.headers["Authorization"] = `Bearer ${token}`;
        }
        try {
          // Tunggu sebentar dengan backoff (500ms, 1000ms, 1500ms) agar PHP server punya ruang bernapas
          await new Promise(resolve => setTimeout(resolve, 500 * originalRequest._retryCount));
          return await api(originalRequest); // gunakan api agar bisa kena interceptor lagi jika masih 401
        } catch (retryError: any) {
          return Promise.reject(retryError); // Biarkan interceptor ini yang menangani retry berikutnya
        }
      } else {
        // Jika sudah coba 3x tetap 401, baru beneran logout
        clearToken();
        if (typeof window !== "undefined") {
          // Jangan alert setiap kali polling gagal untuk kenyamanan, cukup redirect
          window.location.href = "/login?session_expired=1";
        }
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
