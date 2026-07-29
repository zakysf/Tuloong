/**
 * transaction.service.ts
 *
 * Service layer untuk fitur Transaksi (BE2).
 *
 * Endpoints:
 *   POST /api/transactions              — inisiasi pembayaran (pelanggan)
 *   GET  /api/pelanggan/transactions    — riwayat transaksi pelanggan
 *   GET  /api/mitra/transactions        — riwayat transaksi mitra
 */

import api from "@/lib/axios";
import type {
  BEListResponse,
  BEResponse,
  Transaction,
  TransactionSnapResponse,
} from "@/types/post";

// ─── Create Transaction (Midtrans Snap) ──────────────────────────────────────

export async function createTransaction(
  claimId: number
): Promise<TransactionSnapResponse> {
  const { data } = await api.post<BEResponse<TransactionSnapResponse>>(
    "/api/transactions",
    { claim_id: claimId }
  );
  return data.data;
}

// ─── Get Pelanggan Transactions ───────────────────────────────────────────────

export async function getMyTransactions(): Promise<Transaction[]> {
  const { data } = await api.get<BEListResponse<Transaction>>(
    "/api/pelanggan/transactions"
  );
  return data.data;
}

// ─── Get Mitra Transactions ───────────────────────────────────────────────────

export async function getMitraTransactions(): Promise<Transaction[]> {
  const { data } = await api.get<BEListResponse<Transaction>>(
    "/api/mitra/transactions"
  );
  return data.data;
}
