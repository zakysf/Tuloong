// ─── BE2 Types — Post, Claim, Transaction, Message, Review, Report ───────────

// ─── Post ─────────────────────────────────────────────────────────────────────

export type PostUrgensi = "biasa" | "penting" | "mendesak";
export type PostStatus = "open" | "in_progress" | "done" | "cancelled";

export interface Post {
  id: number;
  user_id: number;
  judul: string;
  deskripsi: string;
  provinsi: string;
  kabupaten: string;
  kecamatan: string;
  estimasi_waktu: string;
  budget: number;
  urgensi: PostUrgensi;
  status: PostStatus;
  created_at: string;
  updated_at: string;
  // Relasi (opsional)
  user?: { id: number; nama: string; kecamatan: string; foto_profil?: string | null };
  claim?: Claim;
  transaction?: Transaction;
  review?: Review;
}

export interface CreatePostPayload {
  judul: string;
  deskripsi: string;
  provinsi: string;
  kabupaten: string;
  kecamatan: string;
  estimasi_waktu: string;
  budget: number;
  urgensi: PostUrgensi;
}

export interface PostFilters {
  search?: string;
  kabupaten?: string;
  urgensi?: PostUrgensi;
}

// ─── Claim ────────────────────────────────────────────────────────────────────

export type ClaimStatus = "claimed" | "on_the_way" | "working" | "done_by_mitra";

export interface Claim {
  id: number;
  post_id: number;
  mitra_id: number;
  status: ClaimStatus;
  claimed_at: string;
  updated_at: string;
  // Relasi (opsional)
  post?: Post;
  mitra?: { id: number; nama: string; foto_profil: string | null };
  transaction?: Transaction;
}

// ─── Transaction ──────────────────────────────────────────────────────────────

export type TransactionStatus = "pending" | "paid" | "completed";

export interface Transaction {
  id: number;
  post_id: number;
  claim_id: number;
  pelanggan_id: number;
  mitra_id: number;
  amount: number;
  status: TransactionStatus;
  midtrans_order_id: string | null;
  created_at: string;
  updated_at: string;
  // Relasi (opsional)
  post?: Post;
  claim?: Claim;
}

export interface CreateTransactionPayload {
  claim_id: number;
}

export interface TransactionSnapResponse {
  snap_token: string;
  transaction_id: number;
}

// ─── Message (Chat) ───────────────────────────────────────────────────────────

export interface Message {
  id: number;
  claim_id: number;
  sender_id: number;
  body: string;
  created_at: string;
  // Relasi
  sender?: { id: number; nama: string; role: string };
}

// ─── Review ───────────────────────────────────────────────────────────────────

export interface Review {
  id: number;
  transaction_id: number;
  pelanggan_id: number;
  mitra_id: number;
  rating: number;
  review: string | null;
  created_at: string;
  // Relasi (opsional)
  pelanggan?: { id: number; nama: string };
}

export interface CreateReviewPayload {
  rating: number;
  review?: string;
}

// ─── Report ───────────────────────────────────────────────────────────────────

export type ReportAlasan =
  | "tidak_responsif"
  | "deskripsi_tidak_sesuai"
  | "perilaku_tidak_pantas"
  | "lainnya";

export type ReportStatus = "pending" | "ditindaklanjuti";

export interface Report {
  id: number;
  reporter_id: number;
  reported_id: number;
  claim_id: number;
  alasan: ReportAlasan;
  detail: string | null;
  status: ReportStatus;
  created_at: string;
  updated_at: string;
}

export interface CreateReportPayload {
  claim_id: number;
  alasan: ReportAlasan;
  detail?: string;
}

// ─── Generic BE Response Wrapper ─────────────────────────────────────────────

export interface BEResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface BEListResponse<T> {
  success: boolean;
  message: string;
  data: T[];
}
