/**
 * profile.service.ts
 *
 * Service layer untuk fitur Profil (BE1).
 *
 * Endpoints:
 *   GET   /api/profile                 — lihat profil user yang login
 *   PATCH /api/profile                 — update profil
 *   POST  /api/profile/request-update  — mitra: ajukan perubahan data sensitif
 */

import api from "@/lib/axios";
import type { User } from "@/types/auth";
import type { BEResponse } from "@/types/post";

export interface UpdateProfilePayload {
  nama?: string;
  nomor_telepon?: string;
  foto_profil?: File | string;
  // Mitra
  deskripsi_keahlian?: string;
  provinsi?: string;
  kabupaten?: string;
  kecamatan?: string;
}

export interface RequestUpdatePayload {
  nomor_ktp?: string;
  foto_ktp?: File;
  nama_bank?: string;
  nomor_rekening?: string;
  nama_pemilik_rekening?: string;
}

// ─── Get Profile ──────────────────────────────────────────────────────────────

export async function getProfile(): Promise<User> {
  const { data } = await api.get<BEResponse<User>>("/api/profile");
  return data.data;
}

export async function getPublicMitraProfile(id: number): Promise<User> {
  const { data } = await api.get<BEResponse<User>>(`/api/mitra/${id}/profile`);
  return data.data;
}

// ─── Update Profile ───────────────────────────────────────────────────────────

export async function updateProfile(
  payload: UpdateProfilePayload
): Promise<User> {
  // Jika ada file (foto_profil), gunakan FormData
  if (payload.foto_profil instanceof File) {
    const formData = new FormData();
    formData.append("_method", "PATCH"); // Workaround Laravel untuk multipart PATCH
    
    (Object.keys(payload) as Array<keyof UpdateProfilePayload>).forEach(
      (key) => {
        const value = payload[key];
        if (value !== undefined && value !== null) {
          formData.append(key, value as string | Blob);
        }
      }
    );
    // Gunakan api.post karena PHP tidak membaca form-data pada request PATCH/PUT murni
    const { data } = await api.post<BEResponse<User>>("/api/profile", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data.data;
  }

  const { data } = await api.patch<BEResponse<User>>("/api/profile", payload);
  return data.data;
}

// ─── Request Update (Mitra sensitive data) ───────────────────────────────────

export async function requestProfileUpdate(
  payload: RequestUpdatePayload
): Promise<void> {
  const formData = new FormData();
  (Object.keys(payload) as Array<keyof RequestUpdatePayload>).forEach(
    (key) => {
      const value = payload[key];
      if (value !== undefined && value !== null) {
        formData.append(key, value as string | Blob);
      }
    }
  );
  await api.post("/api/profile/request-update", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

// ─── Mitra Revisions ─────────────────────────────────────────────────────────

export interface RejectionReasonResponse {
  id: number;
  user_id: number;
  reason: string;
  created_at: string;
}

export async function getRejectionReason(): Promise<RejectionReasonResponse | null> {
  try {
    const { data } = await api.get<{ data: RejectionReasonResponse }>("/api/mitra/rejection");
    return data.data;
  } catch (error) {
    return null;
  }
}

export interface ReviseMitraProfilePayload {
  nomor_ktp?: string;
  deskripsi_keahlian?: string;
  foto_ktp?: File;
}

export async function reviseMitraProfile(
  payload: ReviseMitraProfilePayload
): Promise<User> {
  const formData = new FormData();
  (Object.keys(payload) as Array<keyof ReviseMitraProfilePayload>).forEach(
    (key) => {
      const value = payload[key];
      if (value !== undefined && value !== null) {
        formData.append(key, value as string | Blob);
      }
    }
  );
  
  const { data } = await api.post<BEResponse<User>>("/api/mitra/revise", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data;
}
