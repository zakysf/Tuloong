/**
 * post.service.ts
 *
 * Service layer untuk fitur Post (BE2).
 *
 * Endpoints:
 *   GET    /api/posts                 — daftar postingan open (publik)
 *   GET    /api/posts/{id}            — detail postingan
 *   POST   /api/posts                 — buat postingan baru (pelanggan)
 *   PATCH  /api/posts/{id}            — edit postingan (pelanggan, owner, status open)
 *   DELETE /api/posts/{id}            — hapus postingan (pelanggan, owner, status open)
 *   GET    /api/pelanggan/posts       — postingan milik pelanggan yang login
 */

import api from "@/lib/axios";
import type {
  BEListResponse,
  BEResponse,
  CreatePostPayload,
  Post,
  PostFilters,
} from "@/types/post";
import axios, { AxiosError } from "axios";

// ─── Get Posts (Publik) ───────────────────────────────────────────────────────

export async function getPosts(filters?: PostFilters): Promise<Post[]> {
  const params = new URLSearchParams();
  if (filters?.search) params.set("search", filters.search);
  if (filters?.kabupaten) params.set("kabupaten", filters.kabupaten);
  if (filters?.urgensi) params.set("urgensi", filters.urgensi);

  const { data } = await api.get<any>("/api/posts", { params });
  // Laravel paginator wraps array in data.data
  return Array.isArray(data.data) ? data.data : (data.data.data ?? []);
}

// ─── Get Post Detail ──────────────────────────────────────────────────────────

export async function getPost(id: number): Promise<Post> {
  const { data } = await api.get<BEResponse<Post>>(`/api/posts/${id}`);
  return data.data;
}

// ─── Create Post ──────────────────────────────────────────────────────────────

export async function createPost(payload: CreatePostPayload): Promise<Post> {
  const { data } = await api.post<BEResponse<Post>>("/api/posts", payload);
  return data.data;
}

// ─── Update Post ──────────────────────────────────────────────────────────────

export async function updatePost(
  id: number,
  payload: Partial<CreatePostPayload>
): Promise<Post> {
  const { data } = await api.patch<BEResponse<Post>>(`/api/posts/${id}`, payload);
  return data.data;
}

// ─── Delete Post ──────────────────────────────────────────────────────────────

export async function deletePost(id: number): Promise<void> {
  await api.delete(`/api/posts/${id}`);
}

// ─── My Posts (Pelanggan) ─────────────────────────────────────────────────────

export async function getMyPosts(): Promise<Post[]> {
  const { data } = await api.get<any>("/api/pelanggan/posts");
  // Laravel paginator wraps array in data.data
  return Array.isArray(data.data) ? data.data : (data.data.data ?? []);
}

// ─── Error Helper ─────────────────────────────────────────────────────────────

export function parsePostError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message: string }>;
    return axiosError.response?.data?.message ?? "Terjadi kesalahan. Coba lagi.";
  }
  return "Terjadi kesalahan jaringan.";
}
