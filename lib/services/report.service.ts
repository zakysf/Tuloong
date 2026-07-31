/**
 * report.service.ts
 *
 * Service layer untuk fitur Laporan (BE2).
 *
 * Endpoints:
 *   POST /api/reports  — buat laporan (pelanggan/mitra yang terlibat dalam claim)
 */

import api from "@/lib/axios";
import type { BEResponse, CreateReportPayload, Report } from "@/types/post";

// ─── Create Report ────────────────────────────────────────────────────────────

export async function createReport(
  payload: CreateReportPayload
): Promise<Report> {
  const { data } = await api.post<BEResponse<Report>>("/api/reports", payload);
  return data.data;
}
