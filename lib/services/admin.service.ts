/**
 * admin.service.ts
 *
 * Service layer untuk fitur Admin (BE1 & BE2).
 *
 * Endpoints:
 *   GET   /api/admin/mitra                     — daftar mitra
 *   PATCH /api/admin/mitra/{id}/verify         — approve/tolak mitra
 *   GET   /api/admin/transactions              — monitoring transaksi
 *   GET   /api/admin/reports                   — kelola laporan
 *   PATCH /api/admin/reports/{id}              — tindaklanjuti laporan
 *   PATCH /api/admin/users/{id}/deactivate     — nonaktifkan akun
 *   PATCH /api/admin/users/{id}/reactivate     — reaktifkan akun
 *   GET   /api/admin/settings                  — lihat pengaturan
 *   PATCH /api/admin/settings                  — ubah pengaturan
 */

import api from "@/lib/axios";
import type {
  AdminMitra,
  AdminMitraFilters,
  AdminReport,
  AdminReportFilters,
  AdminTransaction,
  AdminTransactionFilters,
  PlatformSettings,
  VerifyMitraPayload,
} from "@/types/admin";
import type { BEListResponse, BEResponse } from "@/types/post";

// ─── Verifikasi Mitra ─────────────────────────────────────────────────────────

export async function getAdminMitra(
  filters?: AdminMitraFilters
): Promise<AdminMitra[]> {
  const params = new URLSearchParams();
  if (filters?.status) params.set("status", filters.status);

  const { data } = await api.get<BEListResponse<AdminMitra>>("/api/admin/mitra", {
    params,
  });
  return data.data;
}

export async function verifyMitra(
  id: number,
  payload: VerifyMitraPayload
): Promise<void> {
  await api.patch(`/api/admin/mitra/${id}/verify`, payload);
}

// ─── Monitoring Transaksi ─────────────────────────────────────────────────────

export async function getAdminTransactions(
  filters?: AdminTransactionFilters
): Promise<AdminTransaction[]> {
  const params = new URLSearchParams();
  if (filters?.status) params.set("status", filters.status);
  if (filters?.tanggal_dari) params.set("tanggal_dari", filters.tanggal_dari);
  if (filters?.tanggal_sampai) params.set("tanggal_sampai", filters.tanggal_sampai);

  const { data } = await api.get<BEListResponse<AdminTransaction>>(
    "/api/admin/transactions",
    { params }
  );
  return data.data;
}

// ─── Kelola Laporan ───────────────────────────────────────────────────────────

export async function getAdminReports(
  filters?: AdminReportFilters
): Promise<AdminReport[]> {
  const params = new URLSearchParams();
  if (filters?.status) params.set("status", filters.status);

  const { data } = await api.get<BEListResponse<AdminReport>>(
    "/api/admin/reports",
    { params }
  );
  return data.data;
}

export async function tindaklanjutiReport(id: number): Promise<void> {
  await api.patch(`/api/admin/reports/${id}`, { status: "ditindaklanjuti" });
}

// ─── Manajemen Akun (User) ────────────────────────────────────────────────────

export async function deactivateUser(id: number): Promise<void> {
  await api.patch(`/api/admin/users/${id}/deactivate`);
}

export async function reactivateUser(id: number): Promise<void> {
  await api.patch(`/api/admin/users/${id}/reactivate`);
}

// ─── Pengaturan Platform ──────────────────────────────────────────────────────

export async function getSettings(): Promise<PlatformSettings> {
  const { data } = await api.get<BEResponse<PlatformSettings>>("/api/admin/settings");
  return data.data;
}

export async function updateSettings(
  payload: PlatformSettings
): Promise<PlatformSettings> {
  const { data } = await api.patch<BEResponse<PlatformSettings>>(
    "/api/admin/settings",
    payload
  );
  return data.data;
}
