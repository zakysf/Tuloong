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
  status: ClaimStatus,
  fotoBukti?: File
): Promise<Claim> {
  if (fotoBukti) {
    const formData = new FormData();
    formData.append("status", status);
    formData.append("foto_bukti", fotoBukti);
    formData.append("_method", "PATCH");

    const { data } = await api.post<BEResponse<Claim>>(
      `/api/claims/${claimId}/status`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return data.data;
  } else {
    const { data } = await api.patch<BEResponse<Claim>>(
      `/api/claims/${claimId}/status`,
      { status }
    );
    return data.data;
  }
}

// ─── My Jobs (Mitra) ─────────────────────────────────────────────────────────

export async function getMyJobs(): Promise<Claim[]> {
  const { data } = await api.get<any>("/api/mitra/jobs");
  // Laravel paginator wraps array in data.data
  return Array.isArray(data.data) ? data.data : (data.data.data ?? []);
}
