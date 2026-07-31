# 🚀 Handover Pekerjaan Tuloong
**Tanggal:** 30 Juli 2026
**Status:** Perubahan sudah di-push ke branch `development`.

Berikut adalah ringkasan dari semua *bug* dan perbaikan yang telah kita selesaikan hari ini, beserta daftar hal-hal yang perlu dilanjutkan oleh rekan tim (Next Steps).

---

## ✅ Apa Saja yang Sudah Dikerjakan & Diselesaikan?

### 1. Perbaikan *Error 403 Forbidden* saat Token Kedaluwarsa
- **Masalah:** Sebelumnya jika *session* atau *token* kedaluwarsa, API melempar pesan *403 Forbidden* yang menyebabkan aplikasi *crash* dengan pesan layar merah (Axios Error).
- **Solusi:** Menambahkan penanganan (interceptor) secara global di `lib/axios.ts`. Jika terdeteksi *error 403*, aplikasi akan otomatis membersihkan sisa *token* di _local storage_ dan mengalihkan pengguna kembali ke halaman login (`/auth/login`) secara mulus.

### 2. Migrasi ke Toast Notification Modern (UI/UX)
- **Masalah:** Aplikasi masih menggunakan `alert()` bawaan browser yang terkesan kaku dan mengganggu pengalaman pengguna (*user experience*).
- **Solusi:** Meng-install library `sonner` dan menerapkannya secara global di `app/layout.tsx`. Semua notifikasi sukses dan error (seperti saat mitra klaim pekerjaan atau pelanggan membuat postingan) sekarang menggunakan *toast* cantik yang muncul tanpa mengganggu interaksi (*overlay*).

### 3. Perbaikan Fatal Error Cloudinary (Unggah Foto Bukti)
- **Masalah:** Saat Mitra mencoba mengunggah foto bukti pekerjaannya, *backend* mengalami *error* `500 Server Error` (*Call to undefined method Cloudinary\Cloudinary::upload*).
- **Penyebab:** *Package* `cloudinary-laravel` yang digunakan adalah versi 3 (versi terbaru), di mana banyak *method* lama sudah dihapus/tidak didukung lagi. Selain itu, konfigurasi _disk_ Cloudinary belum terdaftar.
- **Solusi:** 
  1. Mendaftarkan *disk* Cloudinary ke dalam file `backend/config/filesystems.php`.
  2. Menulis ulang secara penuh `App\Services\CloudinaryService` di backend. Sekarang, layanan ini langsung menggunakan **Cloudinary PHP SDK asli** agar kebal terhadap perubahan/bug dari *wrapper* Laravel. Unggah foto bukti sekarang berfungsi 100%.

### 4. Perbaikan *Bug* Paginasi pada Dashboard Admin
- **Masalah:** Terjadi *error* `trans.filter is not a function` dan `reports.map is not a function` ketika masuk sebagai Admin.
- **Penyebab:** API Laravel (menggunakan `->paginate()`) mengembalikan data array yang dibungkus dalam properti `.data`. Frontend salah menangkap objek paginasi tersebut sebagai array.
- **Solusi:** Memodifikasi `lib/services/admin.service.ts` agar frontend secara pintar mendeteksi dan mengekstrak array asli (contoh: `data.data.data ?? []`), sehingga halaman Admin kembali normal.

### 5. Validasi Upload File dan Foto Profil (Cloudinary & Axios Bug)
- **Masalah:** Saat mengunggah foto profil, sistem tidak merespons perubahan (tidak gagal tapi foto tidak terganti), atau sering mendapat respons `422 Unprocessable Entity` (Validasi Gagal) meski gambar berukuran kecil.
- **Penyebab Utama:** 
  1. *Frontend* memaksa pengaturan header `Content-Type: multipart/form-data` secara manual di Axios, sehingga *boundary string* yang krusial hilang dan menyebabkan payload ditolak/tidak terbaca oleh PHP.
  2. Aturan validasi *backend* Laravel terlalu kaku (menolak nilai kosong/null pada atribut yang bersifat opsional) serta membatasi ukuran gambar yang terlalu kecil (2MB).
- **Solusi:** 
  1. Menghapus pengaturan manual `Content-Type` dari `profile.service.ts` agar Axios menggunakan *boundary* dinamis otomatis. (Juga menerapkan *method spoofing* `_method="PATCH"`).
  2. Melonggarkan validasi di `ProfileController.php` dengan menambahkan parameter `nullable` pada atribut opsional, menambahkan dukungan format `.webp`, dan menambah batas ukuran gambar menjadi **5MB**.

### 6. Perbaikan Pembaruan Profil (Nama) dan Masalah Chat
- **Solusi:** Memperbarui fungsi `update()` di `ProfileController` agar pengguna (Pelanggan) dapat benar-benar mengganti namanya. Di sisi *frontend*, sistem *optimistic update* pada chat telah dihilangkan dan diganti dengan pemanggilan ulang secara instan untuk mencegah *race-condition* dengan *polling* yang membuat chat terkesan hilang-timbul.

---

## 📌 Apa yang Harus Dikerjakan Selanjutnya oleh Dev Lain?

Tim *developer* yang melanjutkan proyek ini hanya tinggal melakukan beberapa pengujian dan konfigurasi manual yang tidak bisa diautomasikan:

> [!IMPORTANT]
> **1. Uji Coba Webhook / Callback Midtrans**
> *Source code* untuk webhook sudah siap. Anda harus mengekspos *port* lokal (8000) agar bisa diakses internet oleh Midtrans. Cara termudah tanpa meng-install apapun (karena sudah ada NodeJS) adalah menjalankan:
> `npx localtunnel --port 8000`
> Setelah muncul URL publiknya (misal: `https://abcd.loca.lt`), masukkan URL tersebut ditambah `/api/webhook/midtrans` ke menu **Payment Notification URL** di *Dashboard Midtrans Sandbox*. Lakukan pembayaran fiktif dan pastikan status di DB berubah menjadi `paid`.

> [!TIP]
> **2. Testing Fitur Real-time WebSocket (Reverb)**
> Aplikasi ini sudah menggunakan Laravel Reverb untuk notifikasi/chat secara *real-time*. Jalankan perintah `php artisan reverb:start`. Buka dua tab *browser* (login sebagai Pelanggan dan Mitra) lalu pastikan *chat* masuk secara instan tanpa perlu memuat ulang (*refresh*) halaman.

> [!NOTE]
> **3. Konfigurasi SMTP (Pengiriman Email)**
> File `.env.example` sudah disesuaikan strukturnya, tapi pengiriman email konfirmasi (saat registrasi) saat ini masih menggunakan `MAIL_MAILER=log` jika tidak diatur. Jika Anda butuh email sungguhan saat *testing*, pastikan Anda mengubah `.env` lokal Anda dan memasukkan kredensial SMTP seperti **Mailtrap** atau **Google App Password**.

> [!WARNING]
> **4. Persiapan Deployment ke Production (Vercel / VPS)**
> Saat men-*deploy* ke VPS atau Vercel nanti, baca file `.env.example`. Masukkan semua kunci rahasia (*secret keys*) dari Cloudinary, Midtrans, dan Reverb ke dalam pengaturan *environment* variabel di panel *hosting* Anda. 
> 
> **Catatan Penting untuk Lomba:** Jika aplikasi ini di-*deploy* murni untuk **keperluan lomba/demonstrasi**, Anda **SANGAT BISA dan DISARANKAN** untuk tetap menggunakan Midtrans versi *Sandbox*. Caranya:
> - Tetap biarkan `MIDTRANS_IS_PRODUCTION=false` di *environment* variabel *server*.
> - Tetap gunakan *Server Key* dan *Client Key* versi *Sandbox* (yang berawalan `SB-Mid-...`).
> - Di Vercel (Next.js), pastikan `NEXT_PUBLIC_MIDTRANS_SNAP_URL` tetap mengarah ke `https://app.sandbox.midtrans.com/snap/snap.js`.
> - Jangan lupa ubah URL *Webhook* di Dashboard Midtrans dari alamat `localtunnel` menjadi URL *backend* asli Anda yang sudah *live* (misal: `https://api.domainanda.com/api/webhook/midtrans`).