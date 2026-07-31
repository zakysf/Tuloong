/**
 * review.service.ts
 *
 * Service layer untuk fitur Review (BE2).
 *
 * Endpoints:
 *   GET  /api/mitra/{id}/reviews         — ulasan mitra (publik)
 *   POST /api/transactions/{id}/review   — buat ulasan (pelanggan, transaksi completed)
 */

import api from "@/lib/axios";
import type {
  BEListResponse,
  BEResponse,
  CreateReviewPayload,
  Review,
} from "@/types/post";

// ─── Get Mitra Reviews (Publik) ───────────────────────────────────────────────

export async function getMitraReviews(mitraId: number): Promise<Review[]> {
  const { data } = await api.get<BEListResponse<Review>>(
    `/api/mitra/${mitraId}/reviews`
  );
  return data.data;
}

// ─── Create Review ────────────────────────────────────────────────────────────

export async function createReview(
  transactionId: number,
  payload: CreateReviewPayload
): Promise<Review> {
  const { data } = await api.post<BEResponse<Review>>(
    `/api/transactions/${transactionId}/review`,
    payload
  );
  return data.data;
}
