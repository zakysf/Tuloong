// ─── Admin Types ──────────────────────────────────────────────────────────────

import type { MitraVerificationStatus, User } from "./auth";
import type { Post, Report, ReportStatus, Transaction, TransactionStatus } from "./post";

// ─── Mitra Verification ───────────────────────────────────────────────────────

export interface AdminMitra {
  id: number;
  nama: string;
  email: string;
  nomor_telepon: string;
  foto_profil: string | null;
  mitra_profile: {
    id: number;
    nomor_ktp: string;
    foto_ktp: string;
    deskripsi_keahlian: string;
    nama_bank: string;
    nomor_rekening: string;
    nama_pemilik_rekening: string;
    provinsi: string;
    kabupaten: string;
    kecamatan: string;
    verification_status: MitraVerificationStatus;
    badge: string;
    total_job_selesai: number;
    rating_rata: number | null;
    created_at: string;
  };
}

export interface VerifyMitraPayload {
  status: "aktif" | "ditolak";
  reason?: string;
}

// ─── Admin Filters ────────────────────────────────────────────────────────────

export interface AdminMitraFilters {
  status?: MitraVerificationStatus;
}

export interface AdminTransactionFilters {
  status?: TransactionStatus;
  tanggal_dari?: string;
  tanggal_sampai?: string;
}

export interface AdminReportFilters {
  status?: ReportStatus;
}

// ─── Admin Transaction (with relations) ───────────────────────────────────────

export interface AdminTransaction extends Transaction {
  pelanggan?: { id: number; nama: string; email: string };
  mitra?: { id: number; nama: string; email: string };
  post?: Post;
}

// ─── Admin Report (with relations) ────────────────────────────────────────────

export interface AdminReport extends Report {
  reporter?: { id: number; nama: string; role: string };
  reported?: { id: number; nama: string; role: string };
}

// ─── Settings ─────────────────────────────────────────────────────────────────

export type PlatformSettings = Record<string, string>;
