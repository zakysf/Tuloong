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

---

## 📌 Apa yang Harus Dikerjakan Selanjutnya (Next Steps)?

Untuk rekan tim yang akan melanjutkan pengerjaan proyek ini, berikut adalah prioritas yang perlu difokuskan:

> [!IMPORTANT]
> **1. Validasi Ukuran File Upload (Cloudinary)**
> Walaupun fitur unggah foto sudah berjalan lancar, saat ini belum ada batasan ukuran file. Pastikan untuk menambahkan validasi di Laravel (contoh: `mimes:jpeg,png,jpg|max:2048`) di `ClaimController` agar server/Cloudinary tidak dipenuhi oleh file gambar raksasa.

> [!TIP]
> **2. Testing Webhook/Callback Midtrans**
> Kita perlu melakukan uji coba penuh (*End-to-End*) untuk alur pembayaran Midtrans. Pastikan rute Callback/Webhook dari Midtrans bisa ditangkap dengan benar oleh Laravel untuk mengubah status transaksi dari "Belum Bayar" menjadi "Lunas".

> [!NOTE]
> **3. Testing Fitur Real-time WebSocket (Reverb)**
> Aplikasi ini dikonfigurasi menggunakan Laravel Reverb. Pastikan *server* Reverb berjalan stabil dan pesan/notifikasi bisa ditransmisikan ke frontend Next.js tanpa ada kendala port/koneksi.

> [!WARNING]
> **4. Persiapan Variabel Lingkungan (Environment) Production**
> Saat nanti *deploy* ke *server production* (seperti Vercel & VPS), pastikan seluruh konfigurasi `.env` (terutama `CLOUDINARY_URL` dan Kunci Midtrans) dimasukkan ke dalam pengaturan variabel *environment* server tujuan.