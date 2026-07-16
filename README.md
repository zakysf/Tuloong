# Tuloong (Frontend & Backend Integrated)

Project monorepo yang berisi aplikasi Frontend (Next.js) di root folder dan Backend (Laravel) di dalam folder `backend/`.

## Struktur Direktori
- `/` - Frontend (Next.js)
- `/backend/` - Backend (Laravel)

---

## Memulai Pengembangan

### 1. Menjalankan Backend (Laravel)
Masuk ke folder `backend`, pasang dependensi, jalankan migrasi database, dan jalankan server lokal:
```bash
cd backend
composer install
php artisan key:generate
php artisan migrate --seed
php artisan serve
```
*Backend akan berjalan secara default pada http://localhost:8000.*

### 2. Menjalankan Frontend (Next.js)
Buka terminal baru di root folder, pasang dependensi, dan jalankan dev server Next.js:
```bash
npm install
npm run dev
```
*Frontend akan berjalan pada http://localhost:3000.*

---

## Integrasi API
Aplikasi frontend menggunakan Axios untuk komunikasi dengan API backend. Konfigurasi endpoint dapat disesuaikan pada [axios.ts](file:///d:/Justin/LOMBA/BERAKSI UPNVYK/tuloong/lib/axios.ts) yang secara default mengarah ke `http://localhost:8000` jika tidak ada env `NEXT_PUBLIC_API_URL`.
