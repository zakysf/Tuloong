// ─── Auth Payload Types ─────────────────────────────────────────────────────
// Fields menggunakan nama BE (Indonesia) agar langsung dikirim ke API

export interface RegisterPelangganPayload {
  nama: string;
  email: string;
  nomor_telepon: string;
  password: string;
  password_confirmation: string;
  provinsi: string;
  kabupaten: string;
  kecamatan: string;
  role: "pelanggan";
}

export interface RegisterMitraPayload {
  nama: string;
  email: string;
  nomor_telepon: string;
  password: string;
  password_confirmation: string;
  nomor_ktp: string;
  foto_ktp: File;
  deskripsi_keahlian: string;
  provinsi: string;
  kabupaten: string;
  kecamatan: string;
  nama_bank: string;
  nomor_rekening: string;
  nama_pemilik_rekening: string;
  role: "mitra";
}

export interface LoginPayload {
  email: string;
  password: string;
}

// ─── Response Types ──────────────────────────────────────────────────────────

export type UserRole = "pelanggan" | "mitra" | "admin";

export type MitraVerificationStatus = "pending" | "aktif" | "ditolak" | "pending_update";

export type MitraBadge = "baru" | "terpercaya" | "profesional";

export type UserStatus = "aktif" | "nonaktif";

// ─── User dari response BE ────────────────────────────────────────────────────
// Field naming mengikuti BE (Laravel — Bahasa Indonesia)

export interface MitraProfile {
  verification_status: MitraVerificationStatus;
  badge: MitraBadge;
  deskripsi_keahlian: string;
  provinsi: string;
  kabupaten: string;
  kecamatan: string;
  total_job_selesai: number;
  rating_rata: number | null;
}

export interface PelangganProfile {
  provinsi: string;
  kabupaten: string;
  kecamatan: string;
}

export interface User {
  id: number;
  nama: string;
  email: string;
  role: UserRole;
  nomor_telepon: string;
  foto_profil: string | null;
  status: UserStatus;
  created_at: string;
  // Relasi (opsional, hanya ada jika di-load)
  mitra_profile?: MitraProfile;
  pelanggan_profile?: PelangganProfile;
}

// ─── BE API Response Wrapper ─────────────────────────────────────────────────
// Semua response BE punya format: { success, message, data }

export interface BEAuthData {
  user: User;
  token: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: BEAuthData;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}
