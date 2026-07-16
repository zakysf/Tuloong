/**
 * auth.service.ts
 *
 * Service layer for authentication. All functions call real API endpoints.
 * During development (USE_MOCK=true), mock responses are returned instead.
 *
 * Endpoints:
 *   POST /api/register  — register pelanggan & mitra
 *   POST /api/login     — login with phone + password
 *   POST /api/logout    — invalidate session
 *   GET  /api/me        — get current authenticated user
 */

import api from "@/lib/axios";
import type {
  AuthResponse,
  LoginPayload,
  RegisterMitraPayload,
  RegisterPelangganPayload,
  User,
} from "@/types/auth";
import axios, { AxiosError } from "axios";

// ── Toggle mock mode (flip to false when backend is ready) ───────────────────
const USE_MOCK = true;

// ─── Mock Data ───────────────────────────────────────────────────────────────

const MOCK_PELANGGAN: User = {
  id: 1,
  name: "Budi Santoso",
  email: "budi@gmail.com",
  phone: "081234567890",
  role: "pelanggan",
  province: "DI Yogyakarta",
  city: "Sleman",
  district: "Depok",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const MOCK_MITRA: User = {
  id: 2,
  name: "Sari Wulandari",
  email: "sari@gmail.com",
  phone: "085678901234",
  role: "mitra",
  mitra_status: "pending",
  nik: "3404012505980001",
  skills_description: "Bisa bersih-bersih rumah, antar-jemput anak, belanja kebutuhan harian.",
  province: "DI Yogyakarta",
  city: "Bantul",
  district: "Sewon",
  bank_name: "BCA",
  bank_account_number: "1234567890",
  bank_account_name: "Sari Wulandari",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const MOCK_ADMIN: User = {
  id: 3,
  name: "Admin Tuloong",
  email: "admin@tuloong.id",
  phone: "081100000000",
  role: "admin",
  province: "-",
  city: "-",
  district: "-",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// ─── CSRF Handshake (Sanctum) ─────────────────────────────────────────────────

async function getCsrfCookie(): Promise<void> {
  if (USE_MOCK) return;
  await api.get("/sanctum/csrf-cookie");
}

// ─── Register Pelanggan ───────────────────────────────────────────────────────

export async function registerPelanggan(
  payload: RegisterPelangganPayload
): Promise<AuthResponse> {
  if (USE_MOCK) {
    await delay(1200);
    return {
      message: "Akun berhasil dibuat. Selamat datang di Tuloong!",
      user: { ...MOCK_PELANGGAN, name: payload.name, email: payload.email, phone: payload.phone },
    };
  }

  await getCsrfCookie();
  const { data } = await api.post<AuthResponse>("/api/register", {
    ...payload,
    role: "pelanggan",
  });
  return data;
}

// ─── Register Mitra ───────────────────────────────────────────────────────────

export async function registerMitra(
  payload: RegisterMitraPayload
): Promise<AuthResponse> {
  if (USE_MOCK) {
    await delay(1500);
    return {
      message: "Pendaftaran mitra berhasil. Akun sedang menunggu verifikasi admin.",
      user: {
        ...MOCK_MITRA,
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        mitra_status: "pending",
      },
    };
  }

  await getCsrfCookie();

  // Mitra uses multipart/form-data for KTP photo upload
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value as string | Blob);
    }
  });
  formData.append("role", "mitra");

  const { data } = await api.post<AuthResponse>("/api/register", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

// ─── Login ────────────────────────────────────────────────────────────────────

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  if (USE_MOCK) {
    await delay(1000);
    // Simulate role detection by phone prefix
    let user = MOCK_PELANGGAN;
    if (payload.phone.startsWith("0856")) user = MOCK_MITRA;
    if (payload.phone.startsWith("0811")) user = MOCK_ADMIN;
    return { message: "Login berhasil.", user };
  }

  await getCsrfCookie();
  const { data } = await api.post<AuthResponse>("/api/login", payload);
  return data;
}

// ─── Logout ───────────────────────────────────────────────────────────────────

export async function logout(): Promise<void> {
  if (USE_MOCK) {
    await delay(500);
    return;
  }
  await api.post("/api/logout");
}

// ─── Get Current User ─────────────────────────────────────────────────────────

export async function getMe(): Promise<User> {
  if (USE_MOCK) {
    await delay(600);
    return MOCK_PELANGGAN;
  }
  const { data } = await api.get<User>("/api/me");
  return data;
}

// ─── Error Helper ─────────────────────────────────────────────────────────────

export function parseApiError(error: unknown): {
  message: string;
  fieldErrors: Record<string, string>;
} {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{
      message: string;
      errors?: Record<string, string[]>;
    }>;
    const message =
      axiosError.response?.data?.message ?? "Terjadi kesalahan. Coba lagi.";
    const fieldErrors: Record<string, string> = {};
    const rawErrors = axiosError.response?.data?.errors ?? {};
    Object.entries(rawErrors).forEach(([field, msgs]) => {
      fieldErrors[field] = msgs[0] ?? "";
    });
    return { message, fieldErrors };
  }
  return { message: "Terjadi kesalahan jaringan.", fieldErrors: {} };
}
