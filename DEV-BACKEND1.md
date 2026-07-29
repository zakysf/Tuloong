# 🧑‍💻 Dev Backend 1 — User, Auth, Admin
## Tuloong Backend | Laravel + Supabase PostgreSQL

> **Baca ini sebelum mulai coding.** File ini adalah panduan lengkap domain kamu. Semua prompt yang ada di sini bisa langsung di-paste ke AI untuk vibe coding.

---

## Stack yang kamu pakai
- **Laravel** (PHP) — REST API
- **Supabase PostgreSQL** — database (koneksi via `pgsql`)
- **Laravel Sanctum** — autentikasi token
- **Cloudinary** — upload foto KTP dan foto profil

---

## File yang menjadi tanggung jawab kamu
> ⚠️ Jangan sentuh file di luar list ini kecuali `routes/api.php`

```
app/Http/Controllers/Auth/AuthController.php
app/Http/Controllers/Admin/MitraVerificationController.php
app/Http/Controllers/Admin/UserManagementController.php
app/Http/Controllers/Admin/TransactionMonitorController.php
app/Http/Controllers/Admin/ReportAdminController.php
app/Http/Controllers/Admin/SettingController.php
app/Http/Controllers/Shared/ProfileController.php
app/Http/Requests/Auth/RegisterPelangganRequest.php
app/Http/Requests/Auth/RegisterMitraRequest.php
app/Models/User.php
app/Models/MitraProfile.php
app/Models/PelangganProfile.php
app/Models/RejectionReason.php
app/Models/Setting.php
app/Services/CloudinaryService.php
app/Observers/MitraProfileObserver.php
database/seeders/AdminSeeder.php
database/seeders/SettingSeeder.php
```

---

## Struktur database yang kamu kelola

### Tabel `users`
```
id, nama, email (unique), password, role (pelanggan|mitra|admin),
nomor_telepon, foto_profil, status (aktif|nonaktif),
created_at, updated_at
```

### Tabel `mitra_profiles`
```
id, user_id (FK), nomor_ktp, foto_ktp, deskripsi_keahlian,
nama_bank, nomor_rekening, nama_pemilik_rekening,
provinsi, kabupaten, kecamatan,
verification_status (pending|aktif|ditolak|pending_update),
badge (baru|terpercaya|profesional),
total_job_selesai, rating_rata,
created_at, updated_at
```

### Tabel `pelanggan_profiles`
```
id, user_id (FK), provinsi, kabupaten, kecamatan,
created_at, updated_at
```

### Tabel `rejection_reasons`
```
id, user_id (FK), reason, created_at
```

### Tabel `settings`
```
id, key (unique), value, updated_at
```

---

## Endpoint yang kamu buat

### Auth (Public)
```
POST /api/register     → AuthController@register
POST /api/login        → AuthController@login
POST /api/logout       → AuthController@logout
GET  /api/me           → AuthController@me
```

### Profile (Authenticated)
```
GET    /api/profile                  → ProfileController@show
PATCH  /api/profile                  → ProfileController@update
POST   /api/profile/request-update   → ProfileController@requestUpdate
```

### Admin (role: admin)
```
GET   /api/admin/mitra               → MitraVerificationController@index
PATCH /api/admin/mitra/{id}/verify   → MitraVerificationController@verify
GET   /api/admin/transactions        → TransactionMonitorController@index
GET   /api/admin/reports             → ReportAdminController@index
PATCH /api/admin/reports/{id}        → ReportAdminController@update
PATCH /api/admin/users/{id}/deactivate   → UserManagementController@deactivate
PATCH /api/admin/users/{id}/reactivate   → UserManagementController@reactivate
GET   /api/admin/settings            → SettingController@index
PATCH /api/admin/settings            → SettingController@update
```

---

## Urutan pengerjaan

### Hari 1 — Setup & Models
- [ ] Buat Model `User` dengan relasi ke `MitraProfile` dan `PelangganProfile`
- [ ] Buat Model `MitraProfile` dengan relasi ke `User`
- [ ] Buat Model `PelangganProfile` dengan relasi ke `User`
- [ ] Buat Model `RejectionReason` dan `Setting`
- [ ] Test koneksi database: `php artisan tinker` → `DB::connection()->getPdo()`

### Hari 2 — Register & Login
- [ ] Buat `RegisterPelangganRequest` (validasi semua field pelanggan)
- [ ] Buat `RegisterMitraRequest` (validasi semua field mitra termasuk foto KTP)
- [ ] Buat `CloudinaryService` untuk upload file
- [ ] Buat `AuthController` method `register`, `login`, `logout`, `me`
- [ ] Test di Postman: register pelanggan, register mitra, login, logout

### Hari 3 — Profile
- [ ] Buat `ProfileController` method `show` dan `update`
- [ ] Buat method `requestUpdate` untuk pengajuan perubahan data sensitif mitra
  - Ubah `verification_status` → `pending_update`
  - Simpan data baru yang diajukan (belum langsung diupdate)
- [ ] Test di Postman: lihat profil, edit profil

### Hari 4 — Admin: Verifikasi Mitra
- [ ] Buat `MitraVerificationController`
  - `index`: list mitra dengan filter `?status=pending` atau `?status=pending_update`
  - `verify`: approve (aktif) atau tolak (ditolak + simpan alasan ke `rejection_reasons`)
- [ ] Buat `MitraProfileObserver` yang dipanggil saat `verification_status` berubah
- [ ] Test di Postman: list mitra pending, approve, tolak dengan alasan

### Hari 5 — Admin: User & Settings
- [ ] Buat `UserManagementController` method `deactivate` dan `reactivate`
  - Update kolom `status` di tabel `users`
- [ ] Buat `SettingController` method `index` dan `update`
  - `index`: return semua settings sebagai key-value
  - `update`: update satu atau beberapa setting sekaligus
- [ ] Test di Postman: nonaktifkan akun, aktifkan kembali, ubah setting

### Hari 6 — Admin: Monitor Transaksi & Laporan
- [ ] Buat `TransactionMonitorController@index`
  - Hanya READ — tampilkan semua transaksi dengan relasi pelanggan, mitra, post
  - Support filter `?status=` dan `?tanggal_dari=&tanggal_sampai=`
- [ ] Buat `ReportAdminController`
  - `index`: list semua laporan dengan filter `?status=pending`
  - `update`: ubah status laporan → `ditindaklanjuti`
- [ ] Test semua endpoint Admin di Postman

### Hari 7 — Dokumentasi & Finalisasi
- [ ] Pastikan semua endpoint return format JSON yang konsisten
- [ ] Dokumentasikan semua endpoint ke Postman Collection bersama
- [ ] Koordinasi dengan Dev Backend 2 untuk pastikan relasi model tidak konflik

---

## Format response JSON yang harus konsisten

Semua endpoint wajib return format ini:

```json
// Sukses
{
    "success": true,
    "message": "Berhasil login",
    "data": { ... }
}

// Error validasi
{
    "success": false,
    "message": "Validasi gagal",
    "errors": {
        "email": ["Email sudah digunakan"]
    }
}

// Error umum
{
    "success": false,
    "message": "Akun tidak ditemukan"
}
```

---

## Prompt AI siap pakai

Gunakan prompt ini langsung ke AI. Semakin sedikit kamu ubah, semakin akurat hasilnya.

---

### Prompt 1 — Setup Model User
```
Saya membuat Laravel REST API untuk platform jasa suruh bernama Tuloong.
Database: Supabase PostgreSQL (DB_CONNECTION=pgsql).
Auth: Laravel Sanctum.

Buatkan Model User.php dengan:
- Tabel: users
- Fillable: nama, email, password, role, nomor_telepon, foto_profil, status
- Hidden: password
- Cast: password → hashed
- Role enum: pelanggan, mitra, admin
- Status enum: aktif, nonaktif
- HasMany: tokens (Sanctum)
- HasOne: mitraProfile() → MitraProfile model, FK user_id
- HasOne: pelangganProfile() → PelangganProfile model, FK user_id
- Use HasApiTokens, Notifiable
```

---

### Prompt 2 — Register Mitra dengan Cloudinary
```
Saya membuat Laravel REST API. Buatkan:

1. RegisterMitraRequest dengan validasi:
   - nama: required, string, max 255
   - email: required, email, unique:users
   - password: required, min 8, confirmed
   - nomor_telepon: required, string
   - nomor_ktp: required, string, size 16
   - foto_ktp: required, file, mimes jpg/jpeg/png, max 2048KB
   - deskripsi_keahlian: required, string
   - nama_bank: required, string
   - nomor_rekening: required, string
   - nama_pemilik_rekening: required, string
   - provinsi, kabupaten, kecamatan: required, string
   - Semua pesan error dalam Bahasa Indonesia

2. CloudinaryService dengan method upload(file, folder):
   - Upload file ke Cloudinary
   - Return URL string
   - Gunakan cloudinary/cloudinary_php package

3. AuthController method register() untuk mitra:
   - Validasi via RegisterMitraRequest
   - Upload foto_ktp via CloudinaryService ke folder 'tuloong/ktp'
   - Simpan ke tabel users (role: mitra, status: aktif)
   - Simpan ke tabel mitra_profiles (verification_status: pending)
   - Semua dalam DB::transaction
   - Return JSON: { success: true, message: '...', data: { user, token } }
```

---

### Prompt 3 — Login & Sanctum Token
```
Saya membuat Laravel REST API dengan Sanctum.
Buatkan AuthController method login():
- Validasi: email (required, email), password (required)
- Cek credentials dengan Auth::attempt()
- Jika gagal: return 401 dengan pesan 'Email atau password salah'
- Jika berhasil: hapus token lama, buat token baru via createToken('auth_token')
- Return JSON:
  {
    success: true,
    message: 'Berhasil login',
    data: {
      user: { id, nama, email, role, status, foto_profil },
      token: plainTextToken
    }
  }
- Jika role mitra, sertakan juga verification_status dari mitra_profiles
```

---

### Prompt 4 — Verifikasi Mitra (Admin)
```
Saya membuat Laravel REST API. Buatkan MitraVerificationController dengan:

1. method index():
   - Hanya bisa diakses role admin (sudah ada middleware)
   - GET /api/admin/mitra?status=pending
   - Ambil semua user role mitra beserta mitra_profiles
   - Filter berdasarkan query param status (pending/aktif/ditolak/pending_update)
   - Return list dengan field: id, nama, email, nomor_telepon, mitra_profiles.*

2. method verify():
   - PATCH /api/admin/mitra/{id}/verify
   - Body: { status: 'aktif'|'ditolak', reason?: string }
   - Jika status = 'aktif': update verification_status di mitra_profiles → aktif
   - Jika status = 'ditolak': 
     update verification_status → ditolak
     simpan reason ke tabel rejection_reasons (user_id, reason)
   - Semua dalam DB::transaction
   - Return JSON success
```

---

### Prompt 5 — Middleware EnsureRole
```
Saya membuat Laravel REST API dengan Sanctum.
Buatkan Middleware EnsureRole yang:
- Menerima parameter role: 'pelanggan', 'mitra', atau 'admin'
- Cek kolom role di tabel users dari user yang sedang login
- Jika role tidak sesuai: return 403 JSON { success: false, message: 'Akses ditolak' }
- Jika sesuai: lanjutkan request
- Cara pakai di routes: middleware('role:admin'), middleware('role:mitra')

Buatkan juga Middleware EnsureMitraActive yang:
- Cek verification_status di mitra_profiles milik user yang login
- Jika bukan 'aktif': return 403 JSON { success: false, message: 'Akun mitra belum aktif atau sedang dalam proses verifikasi' }
- Jika aktif: lanjutkan request
```

---

### Prompt 6 — Settings Controller
```
Saya membuat Laravel REST API.
Buatkan SettingController dengan:

1. method index():
   - GET /api/admin/settings
   - Ambil semua data dari tabel settings
   - Return sebagai object key-value:
     { "qris_url": "...", "app_name": "Tuloong", ... }

2. method update():
   - PATCH /api/admin/settings
   - Body: object key-value yang mau diupdate
     contoh: { "qris_url": "https://new-url.com" }
   - Loop setiap key, update value di tabel settings where key = ?
   - Jika key tidak ada: skip (jangan error)
   - Return JSON success dengan data settings terbaru
```

---

## Checklist sebelum handoff ke Dev Frontend

- [ ] Semua endpoint bisa dipanggil via Postman tanpa error
- [ ] Register pelanggan → akun langsung aktif
- [ ] Register mitra → status `pending`, tidak bisa klaim job
- [ ] Login → return token Sanctum
- [ ] Admin bisa approve mitra → status berubah `aktif`
- [ ] Admin bisa tolak mitra → alasan tersimpan di `rejection_reasons`
- [ ] Admin bisa nonaktifkan dan reaktifkan akun
- [ ] Semua endpoint terproteksi role yang benar
- [ ] Format response JSON konsisten di semua endpoint
- [ ] Semua endpoint terdokumentasi di Postman Collection bersama