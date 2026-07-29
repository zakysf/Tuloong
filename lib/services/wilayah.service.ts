/**
 * wilayah.service.ts
 *
 * Mengambil data Provinsi, Kabupaten/Kota, dan Kecamatan secara dinamis
 * menggunakan API Publik Emsifa (https://github.com/emsifa/api-wilayah-indonesia)
 */

const BASE_URL = "https://www.emsifa.com/api-wilayah-indonesia/api";

export interface WilayahOption {
  id: string;
  name: string;
}

export async function getProvinces(): Promise<WilayahOption[]> {
  try {
    const res = await fetch(`${BASE_URL}/provinces.json`);
    if (!res.ok) throw new Error("Gagal mengambil provinsi");
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getRegencies(provinceId: string): Promise<WilayahOption[]> {
  try {
    const res = await fetch(`${BASE_URL}/regencies/${provinceId}.json`);
    if (!res.ok) throw new Error("Gagal mengambil kabupaten");
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getDistricts(regencyId: string): Promise<WilayahOption[]> {
  try {
    const res = await fetch(`${BASE_URL}/districts/${regencyId}.json`);
    if (!res.ok) throw new Error("Gagal mengambil kecamatan");
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}
