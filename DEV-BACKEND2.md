# 🧑‍💻 Dev Backend 2 — Post, Claim, Transaksi, Chat, Review, Report
## Tuloong Backend | Laravel + Supabase PostgreSQL

> **Baca ini sebelum mulai coding.** File ini adalah panduan lengkap domain kamu. Semua prompt yang ada di sini bisa langsung di-paste ke AI untuk vibe coding.

---

## Stack yang kamu pakai
- **Laravel** (PHP) — REST API
- **Supabase PostgreSQL** — database (koneksi via `pgsql`)
- **Laravel Sanctum** — autentikasi token
- **Midtrans Sandbox** — payment gateway (Snap)
- **Laravel Reverb** — WebSocket untuk chat real-time
- **Laravel Echo** — client WebSocket di frontend (kamu hanya setup sisi backend)

---

## File yang menjadi tanggung jawab kamu
> ⚠️ Jangan sentuh file di luar list ini kecuali `routes/api.php`

```
app/Http/Controllers/Pelanggan/PostController.php
app/Http/Controllers/Pelanggan/TransactionController.php
app/Http/Controllers/Mitra/JobController.php
app/Http/Controllers/Mitra/ClaimController.php
app/Http/Controllers/Shared/ChatController.php
app/Http/Controllers/Shared/ReviewController.php
app/Http/Controllers/Shared/ReportController.php
app/Http/Controllers/WebhookController.php
app/Http/Requests/Post/CreatePostRequest.php
app/Http/Requests/Claim/UpdateStatusRequest.php
app/Http/Requests/Transaction/InitiateTransactionRequest.php
app/Http/Requests/Review/CreateReviewRequest.php
app/Http/Requests/Report/CreateReportRequest.php
app/Models/Post.php
app/Models/Claim.php
app/Models/Transaction.php
app/Models/Message.php
app/Models/Review.php
app/Models/Report.php
app/Services/MidtransService.php
app/Services/BadgeService.php
app/Events/MessageSent.php
app/Listeners/BroadcastMessage.php
routes/channels.php
```

---

## Struktur database yang kamu kelola

### Tabel `posts`
```
id, user_id (FK → users), judul, deskripsi, provinsi, kabupaten, kecamatan,
estimasi_waktu, budget (integer Rupiah),
urgensi (biasa|penting|mendesak),
status (open|in_progress|done|cancelled),
created_at, updated_at
```

### Tabel `claims`
```
id, post_id (FK, unique), mitra_id (FK → users),
status (claimed|on_the_way|working|done_by_mitra),
claimed_at, updated_at
```

### Tabel `transactions`
```
id, post_id (FK, unique), claim_id (FK, unique),
pelanggan_id (FK → users), mitra_id (FK → users),
amount (integer), status (pending|paid|completed),
midtrans_order_id (unique, nullable),
created_at, updated_at
```

### Tabel `messages`
```
id, claim_id (FK → claims), sender_id (FK → users),
body (text), created_at
```

### Tabel `reviews`
```
id, transaction_id (FK, unique), pelanggan_id (FK), mitra_id (FK),
rating (1-5), review (text, nullable), created_at
```

### Tabel `reports`
```
id, reporter_id (FK), reported_id (FK), claim_id (FK),
alasan (tidak_responsif|deskripsi_tidak_sesuai|perilaku_tidak_pantas|lainnya),
detail (text, nullable),
status (pending|ditindaklanjuti),
created_at, updated_at
```

---

## Endpoint yang kamu buat

### Pelanggan (role: pelanggan)
```
POST   /api/posts                      → PostController@store
GET    /api/posts                      → PostController@index (publik, hanya open)
GET    /api/posts/{id}                 → PostController@show
GET    /api/pelanggan/posts            → PostController@myPosts
PATCH  /api/posts/{id}                 → PostController@update
DELETE /api/posts/{id}                 → PostController@destroy
GET    /api/pelanggan/transactions     → TransactionController@index
POST   /api/transactions               → TransactionController@store
```

### Mitra (role: mitra + mitra.active)
```
GET  /api/posts                        → JobController@index (sama endpoint, beda controller logic)
GET  /api/posts/{id}                   → JobController@show
POST /api/posts/{id}/claim             → ClaimController@store
PATCH /api/claims/{id}/status          → ClaimController@updateStatus
GET  /api/mitra/jobs                   → ClaimController@myJobs
GET  /api/mitra/transactions           → TransactionController@mitraIndex
```

### Shared (Mitra & Pelanggan)
```
GET  /api/claims/{id}/messages         → ChatController@index
POST /api/claims/{id}/messages         → ChatController@store
GET  /api/mitra/{id}/profile           → (Dev Backend 1 yang buat)
GET  /api/mitra/{id}/reviews           → ReviewController@index
POST /api/transactions/{id}/review     → ReviewController@store
POST /api/reports                      → ReportController@store
```

### Webhook (Public, tanpa Sanctum)
```
POST /api/webhook/midtrans             → WebhookController@handle
```

---

## Alur bisnis yang harus kamu pahami

```
[1] Pelanggan POST /api/posts → buat postingan (status: open)
        ↓
[2] Mitra GET /api/posts → lihat daftar postingan open
        ↓
[3] Mitra POST /api/posts/{id}/claim
    → buat record claims (status: claimed)
    → update posts.status → in_progress
        ↓
[4] Pelanggan POST /api/transactions
    → buat transaksi (status: pending)
    → panggil Midtrans Snap → return snap_token ke frontend
        ↓
[5] Midtrans POST /api/webhook/midtrans
    → validasi signature
    → update transactions.status → paid
        ↓
[6] Mitra PATCH /api/claims/{id}/status
    → on_the_way (hanya jika transaksi = paid)
    → working
    → done_by_mitra
      → update transactions.status → completed
      → update posts.status → done
      → increment mitra_profiles.total_job_selesai
      → panggil BadgeService::evaluate()
        ↓
[7] Pelanggan POST /api/transactions/{id}/review
    → simpan review
    → update mitra_profiles.rating_rata
    → panggil BadgeService::evaluate()
```

---

## Urutan pengerjaan

### Hari 1 — Setup Models
- [ ] Buat Model `Post` dengan relasi ke `User`, `Claim`
- [ ] Buat Model `Claim` dengan relasi ke `Post`, `User` (mitra), `Transaction`
- [ ] Buat Model `Transaction` dengan relasi ke `Post`, `Claim`, `User`
- [ ] Buat Model `Message` dengan relasi ke `Claim`, `User`
- [ ] Buat Model `Review` dengan relasi ke `Transaction`, `User`
- [ ] Buat Model `Report` dengan relasi ke `Claim`, `User`

### Hari 2 — Post & Job
- [ ] Buat `CreatePostRequest` (validasi semua field postingan)
- [ ] Buat `PostController` — CRUD untuk pelanggan, list publik dengan filter
- [ ] Buat `JobController` — list dan detail postingan untuk mitra
- [ ] Test di Postman: buat postingan, lihat daftar, filter urgensi, edit, hapus

### Hari 3 — Claim & Status
- [ ] Buat `ClaimController` method `store` (klaim job)
  - Validasi: mitra aktif, post masih open, belum ada claim di post ini
  - Buat record claim + update post → in_progress dalam DB::transaction
- [ ] Buat `UpdateStatusRequest` (validasi enum status)
- [ ] Buat `ClaimController` method `updateStatus`
  - Validasi urutan status (tidak bisa loncat)
  - Validasi transaksi harus `paid` sebelum bisa update status apapun
  - Jika `done_by_mitra`: trigger completion flow dalam DB::transaction
- [ ] Buat `ClaimController` method `myJobs` (list job mitra)
- [ ] Test di Postman: klaim job, update status step by step

### Hari 4 — Transaksi & Midtrans
- [ ] Buat `MidtransService` — generate Snap token
- [ ] Buat `TransactionController` method `store` — inisiasi pembayaran
- [ ] Buat `WebhookController` method `handle`
  - Validasi signature Midtrans
  - Update status transaksi berdasarkan `transaction_status` dari payload
- [ ] Buat `TransactionController` method `index` dan `mitraIndex`
- [ ] Test di Postman dengan Midtrans Sandbox

### Hari 5 — Badge Service
- [ ] Buat `BadgeService` method `evaluate($mitraId)`
  - Ambil `total_job_selesai` dan `rating_rata` dari `mitra_profiles`
  - Evaluasi badge sesuai threshold
  - Update kolom `badge` di `mitra_profiles`
- [ ] Pastikan `BadgeService` dipanggil di dua tempat:
  - Saat `done_by_mitra` di `ClaimController`
  - Saat review baru di `ReviewController`

### Hari 6 — Chat, Review, Report
- [ ] Setup Laravel Reverb di `config/broadcasting.php`
- [ ] Buat `MessageSent` event
- [ ] Buat `BroadcastMessage` listener
- [ ] Konfigurasi `routes/channels.php` untuk private channel `chat.{claimId}`
- [ ] Buat `ChatController` method `index` dan `store`
- [ ] Buat `CreateReviewRequest` dan `ReviewController`
  - Validasi: transaksi harus `completed`, belum pernah direview
  - Setelah simpan: update `rating_rata` di `mitra_profiles`, panggil BadgeService
- [ ] Buat `CreateReportRequest` dan `ReportController`
  - Validasi: claim harus aktif (bukan done/cancelled), reporter adalah pihak yang terlibat
- [ ] Test semua endpoint di Postman

### Hari 7 — Dokumentasi & Finalisasi
- [ ] Pastikan semua endpoint return format JSON konsisten
- [ ] Dokumentasikan semua endpoint ke Postman Collection bersama
- [ ] Koordinasi dengan Dev Backend 1 untuk pastikan relasi model tidak konflik

---

## Format response JSON yang harus konsisten

```json
// Sukses
{
    "success": true,
    "message": "Job berhasil diklaim",
    "data": { ... }
}

// Error validasi
{
    "success": false,
    "message": "Validasi gagal",
    "errors": {
        "urgensi": ["Urgensi tidak valid"]
    }
}

// Error bisnis
{
    "success": false,
    "message": "Postingan ini sudah diklaim oleh mitra lain"
}
```

---

## Prompt AI siap pakai

---

### Prompt 1 — Model Post
```
Saya membuat Laravel REST API untuk platform jasa suruh bernama Tuloong.
Database: Supabase PostgreSQL (DB_CONNECTION=pgsql).

Buatkan Model Post.php dengan:
- Tabel: posts
- Fillable: user_id, judul, deskripsi, provinsi, kabupaten, kecamatan,
  estimasi_waktu, budget, urgensi, status
- Cast: budget → integer
- Urgensi enum: biasa, penting, mendesak
- Status enum: open, in_progress, done, cancelled
- Default status: open
- BelongsTo: user() → User model
- HasOne: claim() → Claim model
- HasOne: transaction() → Transaction model

Scope query:
- scopeOpen($query): where status = 'open'
- scopeFilter($query, $filters): filter by search (judul/deskripsi ILIKE),
  kabupaten, dan urgensi jika ada di $filters
```

---

### Prompt 2 — PostController (Pelanggan)
```
Saya membuat Laravel REST API. Buatkan PostController untuk pelanggan dengan:

method index():
- GET /api/posts
- Publik, tidak perlu auth
- Hanya tampilkan post dengan status 'open'
- Support query params: search (cari di judul dan deskripsi), kabupaten, urgensi
- Return list post dengan relasi user (nama, kecamatan)
- Order by: urgensi (mendesak dulu, lalu penting, lalu biasa), lalu created_at desc

method store():
- POST /api/posts
- Hanya pelanggan
- Validasi via CreatePostRequest
- Simpan dengan user_id dari user yang login
- Return JSON success dengan data post baru

method myPosts():
- GET /api/pelanggan/posts
- Hanya pelanggan
- Return semua post milik pelanggan yang login
- Sertakan relasi claim (status) dan transaction (status)
- Order by created_at desc

method update():
- PATCH /api/posts/{id}
- Hanya pelanggan pemilik post
- Hanya bisa edit jika status masih 'open'
- Jika status bukan open: return 422 dengan pesan yang jelas

method destroy():
- DELETE /api/posts/{id}
- Hanya pelanggan pemilik post
- Hanya bisa hapus jika status masih 'open'
```

---

### Prompt 3 — Klaim Job
```
Saya membuat Laravel REST API untuk platform jasa suruh.
Buatkan ClaimController method store() untuk endpoint POST /api/posts/{id}/claim:

Validasi yang harus dilakukan (return error 422 jika gagal):
1. User yang login harus role mitra dan verification_status = 'aktif'
2. Post yang dituju harus ada dan statusnya 'open'
3. Post belum memiliki claim (cek tabel claims)

Jika semua validasi lolos, dalam satu DB::transaction:
1. Buat record baru di tabel claims:
   - post_id: dari URL
   - mitra_id: dari user yang login
   - status: 'claimed'
   - claimed_at: now()
2. Update posts.status → 'in_progress'

Return JSON:
{
  success: true,
  message: 'Job berhasil diklaim',
  data: { claim: {...}, post: {...} }
}

Gunakan DB::transaction dan handle exception jika gagal.
```

---

### Prompt 4 — Update Status Claim
```
Saya membuat Laravel REST API untuk platform jasa suruh.
Buatkan ClaimController method updateStatus() untuk PATCH /api/claims/{id}/status:

Body request: { status: 'on_the_way'|'working'|'done_by_mitra' }

Validasi:
1. User yang login harus mitra pemilik claim ini
2. Transaksi terkait (via claim.transaction) harus berstatus 'paid'
3. Transisi status harus berurutan:
   - claimed → on_the_way ✓
   - on_the_way → working ✓
   - working → done_by_mitra ✓
   - Selain itu → error 422 'Perubahan status tidak valid'

Jika status = 'done_by_mitra', dalam satu DB::transaction:
1. Update claims.status → 'done_by_mitra'
2. Update transactions.status → 'completed'
3. Update posts.status → 'done'
4. Increment mitra_profiles.total_job_selesai + 1 (where user_id = mitra_id)
5. Panggil BadgeService::evaluate($mitraId)

Return JSON success.
```

---

### Prompt 5 — Midtrans & Webhook
```
Saya membuat Laravel REST API. Integrasi Midtrans Sandbox.
Package: midtrans/midtrans-php

Buatkan:

1. MidtransService dengan method createSnapToken($transaction):
   - Set Midtrans::$serverKey dari config/env
   - Set Midtrans::$isProduction = false (Sandbox)
   - Buat params:
     transaction_details: { order_id: "TULOONG-{id}-{timestamp}", gross_amount: amount }
     customer_details: { first_name, email, phone dari pelanggan }
   - Return snap token string

2. TransactionController method store():
   - POST /api/transactions
   - Hanya pelanggan
   - Validasi: claim terkait harus ada dan milik pelanggan ini
   - Buat record transaction (status: pending, amount dari post.budget)
   - Panggil MidtransService::createSnapToken()
   - Update midtrans_order_id di transaction
   - Return JSON: { success: true, data: { snap_token, transaction_id } }

3. WebhookController method handle():
   - POST /api/webhook/midtrans (tanpa middleware Sanctum)
   - Validasi signature: 
     hash = SHA512(order_id + status_code + gross_amount + server_key)
     harus sama dengan signature_key dari payload
   - Jika transaction_status = 'settlement' atau 'capture':
     update transactions.status → 'paid'
   - Jika transaction_status = 'expire' atau 'cancel':
     update transactions.status → 'pending' (biarkan bisa bayar ulang)
   - Return HTTP 200
```

---

### Prompt 6 — Chat Real-time dengan Reverb
```
Saya membuat Laravel REST API dengan Laravel Reverb untuk WebSocket.
Buatkan sistem chat real-time:

1. Event MessageSent:
   - Implements ShouldBroadcast
   - Constructor: terima $message (Model Message dengan relasi sender)
   - broadcastOn(): return new PrivateChannel("chat.{$this->message->claim_id}")
   - broadcastWith(): return array message (id, claim_id, sender_id, body, created_at, sender.nama)
   - broadcastAs(): return 'message.sent'

2. ChatController:
   method index():
   - GET /api/claims/{id}/messages
   - Validasi: user yang login harus pelanggan atau mitra dalam claim ini
   - Return semua pesan dengan relasi sender (id, nama, role)
   - Order by created_at asc

   method store():
   - POST /api/claims/{id}/messages
   - Validasi: user yang login harus pelanggan atau mitra dalam claim ini
   - Simpan pesan baru
   - Broadcast event MessageSent
   - Return JSON dengan data pesan baru

3. routes/channels.php:
   - Private channel 'chat.{claimId}'
   - Validasi: user harus mitra pemilik claim ATAU pelanggan pemilik post dalam claim
   - Return false jika tidak ada akses
```

---

### Prompt 7 — Review & Badge
```
Saya membuat Laravel REST API untuk platform jasa suruh.

Buatkan:

1. BadgeService method evaluate($mitraId):
   - Ambil mitra_profiles where user_id = $mitraId
   - Logic badge:
     if total_job_selesai >= 30 && rating_rata >= 4.5 → badge = 'profesional'
     elseif total_job_selesai >= 10 && rating_rata >= 4.0 → badge = 'terpercaya'
     else → badge = 'baru'
   - Update kolom badge di mitra_profiles
   - Return badge string

2. ReviewController method store():
   - POST /api/transactions/{id}/review
   - Hanya pelanggan
   - Validasi:
     - Transaksi harus ada dan milik pelanggan yang login
     - Status transaksi harus 'completed'
     - Belum ada review untuk transaksi ini (cek tabel reviews)
   - Validasi field: rating (integer, 1-5), review (string, nullable, max 500)
   - Simpan review ke tabel reviews
   - Update mitra_profiles.rating_rata:
     rating_rata = AVG(rating) from reviews where mitra_id = ?
   - Panggil BadgeService::evaluate($mitraId)
   - Return JSON success dengan data review

3. ReviewController method index():
   - GET /api/mitra/{id}/reviews
   - Public, tidak perlu auth
   - Return semua review mitra tersebut
   - Sertakan nama pelanggan, rating, review, created_at
   - Order by created_at desc
```

---

### Prompt 8 — Report
```
Saya membuat Laravel REST API.
Buatkan ReportController method store() untuk POST /api/reports:

Validasi field:
- claim_id: required, exists di tabel claims
- alasan: required, in: tidak_responsif, deskripsi_tidak_sesuai, perilaku_tidak_pantas, lainnya
- detail: nullable, string, max 500

Validasi bisnis:
1. User yang login harus terlibat dalam claim (sebagai mitra atau pelanggan)
2. Status claim harus aktif: on_the_way, working, atau done_by_mitra
   Jika claim sudah done/cancelled: return 422 'Tidak dapat melapor pada transaksi yang sudah selesai'
3. reported_id:
   - Jika yang melapor adalah mitra: reported = pelanggan pemilik post
   - Jika yang melapor adalah pelanggan: reported = mitra pemilik claim

Simpan report dengan:
- reporter_id: user yang login
- reported_id: hasil logika di atas
- claim_id, alasan, detail dari request
- status: 'pending'

Return JSON success.
```

---

## Checklist sebelum handoff ke Dev Frontend

- [ ] Buat postingan baru → muncul di list publik
- [ ] Filter postingan by urgensi dan kabupaten → hasilnya sesuai
- [ ] Mitra klaim job → status post berubah in_progress
- [ ] Mitra tidak bisa klaim post yang sudah diklaim
- [ ] Pelanggan bayar → Midtrans Snap token berhasil dibuat
- [ ] Webhook Midtrans → status transaksi berubah paid
- [ ] Mitra tidak bisa update status sebelum transaksi paid
- [ ] Update status berurutan → tidak bisa loncat
- [ ] Mitra set done_by_mitra → transaksi completed, post done, job_selesai+1
- [ ] Badge terupdate otomatis setelah job selesai
- [ ] Chat bisa terkirim dan muncul real-time di channel yang benar
- [ ] Review hanya bisa setelah transaksi completed
- [ ] Rating rata-rata mitra terupdate setelah review baru
- [ ] Badge terupdate setelah review baru
- [ ] Report hanya bisa saat claim aktif
- [ ] Semua endpoint terproteksi role yang benar
- [ ] Format response JSON konsisten di semua endpoint
- [ ] Semua endpoint terdokumentasi di Postman Collection bersama