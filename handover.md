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

### 5. Validasi Upload File dan Foto Profil (Cloudinary)
- **Solusi:** Menambahkan validasi gambar (`mimes:jpeg,png,jpg|max:2048`) untuk foto bukti di `UpdateStatusRequest.php`. Selain itu, kami juga memperbaiki *bug* unggah foto profil (PATCH) di *frontend* dengan trik *method spoofing* `_method="PATCH"` pada `profile.service.ts` agar terbaca oleh *backend* Laravel.

### 6. Perbaikan Pembaruan Profil (Nama) dan Masalah Chat
- **Solusi:** Memperbarui fungsi `update()` di `ProfileController` agar pengguna (Pelanggan) dapat benar-benar mengganti namanya. Di sisi *frontend*, sistem *optimistic update* pada chat telah dihilangkan dan diganti dengan pemanggilan ulang secara instan untuk mencegah *race-condition* dengan *polling* yang membuat chat terkesan hilang-timbul.

---

## 📌 Apa yang Harus Dikerjakan Selanjutnya oleh Dev Lain?

Tim *developer* yang melanjutkan proyek ini hanya tinggal melakukan beberapa pengujian dan konfigurasi manual yang tidak bisa diautomasikan:

> [!IMPORTANT]
> **1. Uji Coba Webhook / Callback Midtrans**
> *Source code* untuk webhook sudah siap. Anda harus mengekspos *port* lokal Anda menggunakan layanan seperti **Ngrok** (misal: `ngrok http 8000`), lalu memasukkan URL Ngrok tersebut ke menu **Payment Notification URL** di *Dashboard Midtrans Sandbox* Anda. Lakukan pembayaran fiktif di aplikasi dan pastikan status transaksi berubah dari `pending` menjadi `paid`.

> [!TIP]
> **2. Testing Fitur Real-time WebSocket (Reverb)**
> Aplikasi ini sudah menggunakan Laravel Reverb untuk notifikasi/chat secara *real-time*. Jalankan perintah `php artisan reverb:start`. Buka dua tab *browser* (login sebagai Pelanggan dan Mitra) lalu pastikan *chat* masuk secara instan tanpa perlu memuat ulang (*refresh*) halaman.

> [!NOTE]
> **3. Konfigurasi SMTP (Pengiriman Email)**
> File `.env.example` sudah disesuaikan strukturnya, tapi pengiriman email konfirmasi (saat registrasi) saat ini masih menggunakan `MAIL_MAILER=log` jika tidak diatur. Jika Anda butuh email sungguhan saat *testing*, pastikan Anda mengubah `.env` lokal Anda dan memasukkan kredensial SMTP seperti **Mailtrap** atau **Google App Password**.

> [!WARNING]
> **4. Persiapan Deployment ke Production**
> Saat men-*deploy* ke VPS atau Vercel nanti, baca file `.env.example`. Masukkan semua kunci rahasia (*secret keys*) dari Cloudinary, Midtrans (ubah `MIDTRANS_IS_PRODUCTION=true`), dan Reverb ke dalam pengaturan *environment* variabel di panel *hosting* Anda.