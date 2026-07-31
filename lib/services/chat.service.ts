/**
 * chat.service.ts
 *
 * Service layer untuk fitur Chat real-time (BE2 + Laravel Reverb).
 *
 * REST Endpoints:
 *   GET  /api/claims/{id}/messages  — riwayat pesan (pelanggan/mitra dalam claim)
 *   POST /api/claims/{id}/messages  — kirim pesan baru (auto-broadcast via Reverb)
 *
 * WebSocket:
 *   Channel: private-chat.{claimId}
 *   Event:   message.sent
 *   Setup Laravel Echo di komponen yang membutuhkan real-time.
 */

import api from "@/lib/axios";
import type { BEListResponse, BEResponse, Message } from "@/types/post";

// ─── Get Messages ─────────────────────────────────────────────────────────────

export async function getMessages(claimId: number): Promise<Message[]> {
  const { data } = await api.get<BEListResponse<Message>>(
    `/api/claims/${claimId}/messages`
  );
  return data.data;
}

// ─── Send Message ─────────────────────────────────────────────────────────────

export async function sendMessage(
  claimId: number,
  body: string
): Promise<Message> {
  const { data } = await api.post<BEResponse<Message>>(
    `/api/claims/${claimId}/messages`,
    { body }
  );
  return data.data;
}
