# PRD — Tuloong
## Platform Jasa Suruh | Version 4.0 Final

---

## 1. Overview

Tuloong adalah platform web jasa suruh yang menghubungkan pelanggan dengan mitra/pekerja informal terverifikasi. Model platform bersifat **reverse marketplace** — pelanggan memposting kebutuhan, mitra yang aktif mencari dan mengklaim pekerjaan.

Platform ini **sepenuhnya gratis tanpa komisi**. Pendapatan bersifat sukarela melalui fitur donasi. Fokus utama adalah pemberdayaan pekerja lokal Indonesia.

**Tagline:** *"Butuh Bantuan? Tuloongin aja."*

---

## 2. Aktor

| Aktor | Deskripsi |
|---|---|
| **Pelanggan** | Membuat postingan kebutuhan, membayar mitra, memberi ulasan |
| **Mitra** | Mencari dan mengklaim job, mengerjakan, update status |
| **Admin** | Verifikasi mitra, monitoring transaksi, kelola laporan & setting |

---

## 3. Tech Stack

| Layer | Teknologi |
|---|---|
| Frontend | Next.js (App Router), Tailwind CSS, shadcn/ui |
| Backend | Laravel (PHP), Laravel Sanctum |
| Database | Supabase PostgreSQL |
| Real-time | Laravel Reverb + Laravel Echo |
| Payment | Midtrans Sandbox (Snap) |
| File Storage | Cloudinary |
| Hosting | Vercel (frontend), Railway (backend) |

> ⚠️ Database menggunakan **PostgreSQL** (bukan MySQL). Set `DB_CONNECTION=pgsql` di Laravel.

---

## 4. Autentikasi

- Login menggunakan **email + password** untuk semua role
- Token: **Laravel Sanctum** (disimpan di localStorage frontend)
- Nomor telepon dikumpulkan saat register untuk keperluan kontak di fitur chat

### Alur Register

**Pelanggan:** isi form → akun langsung aktif

**Mitra:** isi form → status `pending` → admin verifikasi → status `aktif` → bisa klaim job

**Admin:** tidak bisa register via halaman publik, di-seed langsung via `AdminSeeder`

---

## 5. Alur Utama Sistem

```
[1] Pelanggan buat post
    (judul, deskripsi, lokasi, estimasi waktu, budget, urgensi)
            ↓
[2] Mitra lihat & filter postingan
    (by lokasi, urgensi, kata kunci)
            ↓
[3] Mitra klaim job
    → posts.status = in_progress
            ↓
[4] Pelanggan bayar 100% via Midtrans Snap Sandbox
    → transactions.status = paid
            ↓
[5] Mitra set: Dalam Perjalanan (on_the_way)
            ↓
[6] Mitra set: Sedang Dikerjakan (working)
            ↓
[7] Mitra set: Selesai (done_by_mitra)
    → transactions.status = completed
    → posts.status = done
    → mitra_profiles.total_job_selesai + 1
    → evaluasi badge mitra
            ↓
[8] Pelanggan beri Rating & Ulasan (opsional)
    → update mitra_profiles.rating_rata
    → evaluasi badge mitra
            ↓
[9] Prompt Donasi muncul (opsional, redirect ke QRIS)
```

> **Catatan:** Hanya mitra yang bisa update status pengerjaan. Pelanggan tidak input status apapun.

> **Catatan:** Transfer ke rekening mitra dalam implementasi ini dicatat otomatis sebagai `completed` di sistem. Disbursement production akan menggunakan Midtrans Iris.

---

## 6. Fitur per Aktor

### 6.1 Pelanggan

| Fitur | Deskripsi |
|---|---|
| Register & Login | Email + password, lokasi (provinsi/kabupaten/kecamatan) |
| Buat Postingan | Judul, deskripsi, lokasi, estimasi waktu, budget, urgensi |
| Lihat Postingan Saya | List semua post milik sendiri beserta status |
| Bayar Job | Via Midtrans Snap Sandbox setelah mitra klaim |
| Pantau Status | Lihat status pengerjaan yang diupdate mitra |
| Chat | Real-time dengan mitra yang mengklaim jobnya |
| Beri Rating & Ulasan | Setelah transaksi completed, sekali per transaksi |
| Riwayat Transaksi | List semua transaksi dan statusnya |
| Edit Profil | Bebas edit semua data kapan saja |
| Lapor Mitra | Via menu ⋮ saat job sedang berlangsung |
| Donasi | Opsional setelah submit ulasan, redirect ke QRIS |

### 6.2 Mitra

| Fitur | Deskripsi |
|---|---|
| Register | Email + password + identitas KTP + info rekening bank |
| Login | Setelah admin verifikasi akun |
| Cari & Filter Job | By lokasi, urgensi, kata kunci |
| Klaim Job | Satu postingan hanya bisa diklaim satu mitra |
| Update Status | on_the_way → working → done_by_mitra (berurutan) |
| Chat | Real-time dengan pelanggan |
| Riwayat Transaksi | List semua transaksi dan statusnya |
| Profil Publik | Dilihat pelanggan: keahlian, badge, rating, ulasan |
| Edit Profil | Data non-sensitif bebas edit, data sensitif butuh approval admin |
| Badge | Otomatis: Mitra Baru → Terpercaya → Profesional |
| Lapor Pelanggan | Via menu ⋮ saat job sedang berlangsung |

### 6.3 Admin

| Fitur | Deskripsi |
|---|---|
| Verifikasi Mitra | Approve/tolak pendaftaran mitra baru atau perubahan data sensitif |
| Monitoring Transaksi | Lihat semua transaksi dengan filter status dan tanggal |
| Kelola Laporan | Lihat dan tindaklanjuti laporan dari pelanggan/mitra |
| Nonaktifkan Akun | Nonaktifkan/reaktifkan akun pelanggan atau mitra |
| Pengaturan Platform | Ubah QRIS URL donasi dan konfigurasi lain |

---

## 7. Aturan Edit Profil Mitra

### Data bebas diedit sendiri (tanpa approval)
- Email
- Password
- Nomor telepon
- Foto profil

### Data yang butuh approval admin
- Nama lengkap
- Nomor KTP
- Foto KTP
- Deskripsi keahlian
- Nama bank, nomor rekening, nama pemilik rekening

> Saat mitra ajukan perubahan data sensitif, `verification_status` berubah ke `pending_update` dan mitra **tidak bisa klaim job baru** sampai admin approve. Job yang sedang berjalan tidak terganggu.

---

## 8. Badge Mitra

Badge dihitung **otomatis oleh backend** setiap kali ada job selesai atau review baru. Tidak ada input manual admin.

| Badge | Syarat | Warna |
|---|---|---|
| Mitra Baru | Default saat pertama aktif | Abu-abu |
| Terpercaya | ≥ 10 job selesai + rating rata-rata ≥ 4.0 | Biru |
| Profesional | ≥ 30 job selesai + rating rata-rata ≥ 4.5 | Emas |

---

## 9. Urgensi Postingan

| Level | Badge | Warna |
|---|---|---|
| Biasa | Default | Abu-abu |
| Penting | ⚡ Penting | Kuning |
| Mendesak | 🔴 Mendesak | Merah |

Postingan bisa difilter mitra berdasarkan urgensi. Di list postingan, urutan default: mendesak → penting → biasa, lalu by `created_at` terbaru.

---

## 10. Fitur Donasi

- Sepenuhnya opsional, tidak diproses dalam sistem
- **Titik 1:** Section di landing page dengan tombol "Dukung Tuloong"
- **Titik 2:** Modal prompt setelah pelanggan submit rating & ulasan
- Kedua tombol redirect ke URL QRIS/rekening perusahaan
- URL QRIS disimpan di tabel `settings` dengan key `qris_url`

---

## 11. Fitur Laporan (Report)

- Mitra bisa lapor pelanggan, pelanggan bisa lapor mitra
- Hanya bisa dilakukan saat status claim: `on_the_way`, `working`, atau `done_by_mitra`
- Tombol ada di menu ⋮ halaman detail job/postingan aktif
- Pilihan alasan: Tidak Responsif / Deskripsi Tidak Sesuai / Perilaku Tidak Pantas / Lainnya
- Detail tambahan: opsional (textarea)
- Laporan masuk ke dashboard admin dengan status `pending`

---

## 12. Struktur Database

### `users`
```
id                  BIGSERIAL PRIMARY KEY
nama                VARCHAR(255) NOT NULL
email               VARCHAR(255) NOT NULL UNIQUE
password            VARCHAR(255) NOT NULL
role                VARCHAR(20) CHECK (IN 'pelanggan','mitra','admin')
nomor_telepon       VARCHAR(20) NOT NULL
foto_profil         TEXT
status              VARCHAR(20) DEFAULT 'aktif' CHECK (IN 'aktif','nonaktif')
created_at          TIMESTAMP
updated_at          TIMESTAMP
```

### `mitra_profiles`
```
id                      BIGSERIAL PRIMARY KEY
user_id                 BIGINT UNIQUE FK → users.id
nomor_ktp               VARCHAR(20) NOT NULL
foto_ktp                TEXT NOT NULL
deskripsi_keahlian      TEXT NOT NULL
nama_bank               VARCHAR(100) NOT NULL
nomor_rekening          VARCHAR(50) NOT NULL
nama_pemilik_rekening   VARCHAR(255) NOT NULL
provinsi                VARCHAR(100) NOT NULL
kabupaten               VARCHAR(100) NOT NULL
kecamatan               VARCHAR(100) NOT NULL
verification_status     VARCHAR(20) DEFAULT 'pending'
                        CHECK (IN 'pending','aktif','ditolak','pending_update')
badge                   VARCHAR(20) DEFAULT 'baru'
                        CHECK (IN 'baru','terpercaya','profesional')
total_job_selesai       INTEGER DEFAULT 0
rating_rata             DECIMAL(3,2) DEFAULT 0.00
created_at              TIMESTAMP
updated_at              TIMESTAMP
```

### `pelanggan_profiles`
```
id              BIGSERIAL PRIMARY KEY
user_id         BIGINT UNIQUE FK → users.id
provinsi        VARCHAR(100) NOT NULL
kabupaten       VARCHAR(100) NOT NULL
kecamatan       VARCHAR(100) NOT NULL
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

### `posts`
```
id              BIGSERIAL PRIMARY KEY
user_id         BIGINT FK → users.id
judul           VARCHAR(255) NOT NULL
deskripsi       TEXT NOT NULL
provinsi        VARCHAR(100) NOT NULL
kabupaten       VARCHAR(100) NOT NULL
kecamatan       VARCHAR(100) NOT NULL
estimasi_waktu  VARCHAR(100) NOT NULL
budget          INTEGER NOT NULL
urgensi         VARCHAR(20) DEFAULT 'biasa' CHECK (IN 'biasa','penting','mendesak')
status          VARCHAR(20) DEFAULT 'open' CHECK (IN 'open','in_progress','done','cancelled')
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

### `claims`
```
id          BIGSERIAL PRIMARY KEY
post_id     BIGINT UNIQUE FK → posts.id
mitra_id    BIGINT FK → users.id
status      VARCHAR(20) DEFAULT 'claimed'
            CHECK (IN 'claimed','on_the_way','working','done_by_mitra')
claimed_at  TIMESTAMP
updated_at  TIMESTAMP
```

### `transactions`
```
id                  BIGSERIAL PRIMARY KEY
post_id             BIGINT UNIQUE FK → posts.id
claim_id            BIGINT UNIQUE FK → claims.id
pelanggan_id        BIGINT FK → users.id
mitra_id            BIGINT FK → users.id
amount              INTEGER NOT NULL
status              VARCHAR(20) DEFAULT 'pending'
                    CHECK (IN 'pending','paid','completed')
midtrans_order_id   VARCHAR(255) UNIQUE
created_at          TIMESTAMP
updated_at          TIMESTAMP
```

### `messages`
```
id          BIGSERIAL PRIMARY KEY
claim_id    BIGINT FK → claims.id
sender_id   BIGINT FK → users.id
body        TEXT NOT NULL
created_at  TIMESTAMP
```

### `reviews`
```
id              BIGSERIAL PRIMARY KEY
transaction_id  BIGINT UNIQUE FK → transactions.id
pelanggan_id    BIGINT FK → users.id
mitra_id        BIGINT FK → users.id
rating          SMALLINT CHECK (1-5)
review          TEXT
created_at      TIMESTAMP
```

### `reports`
```
id              BIGSERIAL PRIMARY KEY
reporter_id     BIGINT FK → users.id
reported_id     BIGINT FK → users.id
claim_id        BIGINT FK → claims.id
alasan          VARCHAR(50)
                CHECK (IN 'tidak_responsif','deskripsi_tidak_sesuai',
                          'perilaku_tidak_pantas','lainnya')
detail          TEXT
status          VARCHAR(20) DEFAULT 'pending'
                CHECK (IN 'pending','ditindaklanjuti')
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

### `rejection_reasons`
```
id          BIGSERIAL PRIMARY KEY
user_id     BIGINT FK → users.id
reason      TEXT NOT NULL
created_at  TIMESTAMP
```

### `settings`
```
id          BIGSERIAL PRIMARY KEY
key         VARCHAR(100) UNIQUE NOT NULL
value       TEXT NOT NULL
updated_at  TIMESTAMP
```

---

## 13. API Endpoints

### Public (tanpa auth)
```
POST /api/register
POST /api/login
POST /api/webhook/midtrans
GET  /api/posts                        → list postingan open
GET  /api/posts/{id}                   → detail postingan
GET  /api/mitra/{id}/profile           → profil publik mitra
GET  /api/mitra/{id}/reviews           → ulasan mitra
```

### Authenticated (semua role)
```
POST  /api/logout
GET   /api/me
GET   /api/profile
PATCH /api/profile
POST  /api/profile/request-update      → ajukan perubahan data sensitif mitra
GET   /api/claims/{id}/messages
POST  /api/claims/{id}/messages
POST  /api/reports
```

### Pelanggan only
```
POST   /api/posts
PATCH  /api/posts/{id}
DELETE /api/posts/{id}
GET    /api/pelanggan/posts
GET    /api/pelanggan/transactions
POST   /api/transactions
POST   /api/transactions/{id}/review
```

### Mitra only (+ harus aktif)
```
POST  /api/posts/{id}/claim
PATCH /api/claims/{id}/status
GET   /api/mitra/jobs
GET   /api/mitra/transactions
```

### Admin only
```
GET   /api/admin/mitra
PATCH /api/admin/mitra/{id}/verify
GET   /api/admin/transactions
GET   /api/admin/reports
PATCH /api/admin/reports/{id}
PATCH /api/admin/users/{id}/deactivate
PATCH /api/admin/users/{id}/reactivate
GET   /api/admin/settings
PATCH /api/admin/settings
```

---

## 14. Format Response JSON

Semua endpoint wajib return format konsisten:

```json
// Sukses
{
    "success": true,
    "message": "Deskripsi singkat",
    "data": {}
}

// Error validasi (422)
{
    "success": false,
    "message": "Validasi gagal",
    "errors": {
        "field": ["Pesan error dalam Bahasa Indonesia"]
    }
}

// Error bisnis / auth (400, 401, 403, 404)
{
    "success": false,
    "message": "Pesan error yang jelas"
}
```

---

## 15. Struktur Repository

```
tuloong/
├── frontend/                          → Next.js App
│   ├── app/
│   │   ├── (public)/                  → Landing, Login, Register
│   │   ├── (auth)/                    → Verify pending
│   │   ├── pelanggan/                 → Dashboard, Posts, Transactions, Profile
│   │   ├── mitra/                     → Dashboard, Jobs, My-Jobs, Transactions, Profile
│   │   ├── admin/                     → Dashboard, Mitra, Transactions, Reports, Settings
│   │   └── chat/[claimId]/
│   ├── components/
│   │   ├── ui/                        → shadcn/ui
│   │   ├── auth/
│   │   ├── posts/
│   │   ├── mitra/
│   │   ├── chat/
│   │   ├── shared/
│   │   └── admin/
│   ├── lib/
│   │   ├── api.ts                     → Axios instance
│   │   ├── auth.ts                    → Token helpers
│   │   └── echo.ts                    → Laravel Echo setup
│   ├── hooks/
│   └── middleware.ts                  → Route protection by role
│
├── backend/                           → Laravel API
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   │   ├── Auth/
│   │   │   │   ├── Admin/
│   │   │   │   ├── Pelanggan/
│   │   │   │   ├── Mitra/
│   │   │   │   ├── Shared/
│   │   │   │   └── WebhookController.php
│   │   │   ├── Middleware/
│   │   │   │   ├── EnsureRole.php
│   │   │   │   └── EnsureMitraActive.php
│   │   │   └── Requests/
│   │   ├── Models/
│   │   ├── Events/
│   │   ├── Listeners/
│   │   ├── Observers/
│   │   └── Services/
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   └── routes/
│       ├── api.php
│       └── channels.php
│
├── .gitignore
└── README.md
```

---

## 16. Environment Variables

### Backend `.env`
```env
APP_NAME=Tuloong
APP_URL=https://tuloong-backend.railway.app

DB_CONNECTION=pgsql
DB_HOST=db.xxxx.supabase.co
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres
DB_PASSWORD=your-password

BROADCAST_DRIVER=reverb
REVERB_APP_ID=
REVERB_APP_KEY=
REVERB_APP_SECRET=

MIDTRANS_SERVER_KEY=
MIDTRANS_CLIENT_KEY=
MIDTRANS_IS_PRODUCTION=false

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### Frontend `.env.local`
```env
NEXT_PUBLIC_API_URL=https://tuloong-backend.railway.app/api
NEXT_PUBLIC_REVERB_APP_KEY=
NEXT_PUBLIC_REVERB_HOST=tuloong-backend.railway.app
NEXT_PUBLIC_REVERB_PORT=8080
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=
```

---

## 17. Mockup Screens (28 Screen)

| No | Screen | Aktor |
|---|---|---|
| 1 | Landing page + section donasi | Public |
| 2 | Pilih role register | Public |
| 3 | Register Pelanggan | Public |
| 4 | Register Mitra | Public |
| 5 | Login | Public |
| 6 | Tunggu verifikasi admin | Mitra baru |
| 7 | Dashboard Pelanggan | Pelanggan |
| 8 | Form buat postingan + pilih urgensi | Pelanggan |
| 9 | Daftar postingan saya | Pelanggan |
| 10 | Detail postingan + status pengerjaan | Pelanggan |
| 11 | Halaman pembayaran (Midtrans Snap) | Pelanggan |
| 12 | Form rating & ulasan | Pelanggan |
| 13 | Modal prompt donasi | Pelanggan |
| 14 | Profil Pelanggan (edit) | Pelanggan |
| 15 | Dashboard Mitra | Mitra |
| 16 | Cari job (filter urgensi, lokasi, search) | Mitra |
| 17 | Detail postingan + tombol klaim | Mitra |
| 18 | Job aktif + update status | Mitra |
| 19 | Riwayat transaksi Mitra | Mitra |
| 20 | Profil Mitra (edit data non-sensitif) | Mitra |
| 21 | Profil Mitra (tampilan publik + badge + ulasan) | Pelanggan |
| 22 | Chat real-time | Mitra & Pelanggan |
| 23 | Riwayat transaksi Pelanggan | Pelanggan |
| 24 | Modal report | Mitra & Pelanggan |
| 25 | Dashboard Admin | Admin |
| 26 | Verifikasi mitra + detail KTP | Admin |
| 27 | Monitoring transaksi | Admin |
| 28 | Daftar laporan | Admin |
| 29 | Pengaturan platform (QRIS URL, dll) | Admin |

---

## 18. Pembagian Tim Backend

### Dev Backend 1 — Domain: User, Auth, Admin
Controllers: `Auth/`, `Admin/`, `Shared/ProfileController`
Models: `User`, `MitraProfile`, `PelangganProfile`, `RejectionReason`, `Setting`
Services: `CloudinaryService`

### Dev Backend 2 — Domain: Post, Claim, Transaksi, Chat, Review, Report
Controllers: `Pelanggan/PostController`, `Pelanggan/TransactionController`, `Mitra/JobController`, `Mitra/ClaimController`, `Shared/ChatController`, `Shared/ReviewController`, `Shared/ReportController`, `WebhookController`
Models: `Post`, `Claim`, `Transaction`, `Message`, `Review`, `Report`
Services: `MidtransService`, `BadgeService`

> File bersama yang boleh diedit keduanya: `routes/api.php` — edit di branch masing-masing, merge bergantian.