// ─── Auth Payload Types ─────────────────────────────────────────────────────

export interface RegisterPelangganPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
  province: string;
  city: string;
  district: string;
}

export interface RegisterMitraPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
  nik: string;
  ktp_photo: File;
  skills_description: string;
  province: string;
  city: string;
  district: string;
  bank_name: string;
  bank_account_number: string;
  bank_account_name: string;
}

export interface LoginPayload {
  phone: string;
  password: string;
}

// ─── Response Types ──────────────────────────────────────────────────────────

export type UserRole = "pelanggan" | "mitra" | "admin";

export type MitraStatus = "pending" | "active" | "rejected";

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  province: string;
  city: string;
  district: string;
  avatar_url?: string;
  // Mitra-specific
  mitra_status?: MitraStatus;
  nik?: string;
  ktp_photo_url?: string;
  skills_description?: string;
  bank_name?: string;
  bank_account_number?: string;
  bank_account_name?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token?: string; // Only on login; for Sanctum cookie-based, may be omitted
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}
