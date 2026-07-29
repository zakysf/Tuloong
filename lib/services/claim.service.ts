/**
 * claim.service.ts
 *
 * Service layer untuk fitur Claim (BE2).
 *
 * Endpoints:
 *   POST  /api/posts/{id}/claim        — klaim job (mitra aktif)
 *   PATCH /api/claims/{id}/status      — update status klaim (mitra pemilik)
 *   GET   /api/mitra/jobs              — daftar job mitra yang login
 */

import api from "@/lib/axios";
import type { BEListResponse, BEResponse, Claim, ClaimStatus } from "@/types/post";

// ─── Claim Job ────────────────────────────────────────────────────────────────

export async function claimJob(
  postId: number
): Promise<{ claim: Claim; post: { id: number; status: string } }> {
  const { data } = await api.post<
    BEResponse<{ claim: Claim; post: { id: number; status: string } }>
  >(`/api/posts/${postId}/claim`);
  return data.data;
}

// ─── Update Claim Status ──────────────────────────────────────────────────────

export async function updateClaimStatus(
  claimId: number,
  status: ClaimStatus
): Promise<Claim> {
  const { data } = await api.patch<BEResponse<Claim>>(
    `/api/claims/${claimId}/status`,
    { status }
  );
  return data.data;
}

// ─── My Jobs (Mitra) ─────────────────────────────────────────────────────────

export async function getMyJobs(): Promise<Claim[]> {
  const { data } = await api.get<BEListResponse<Claim>>("/api/mitra/jobs");
  return data.data;
}
