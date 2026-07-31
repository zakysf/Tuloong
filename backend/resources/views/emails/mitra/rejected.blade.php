<x-mail::message>
# Halo {{ $userName }},

Terima kasih atas minat Anda untuk bergabung menjadi Mitra Tuloong. 

Sayangnya, pendaftaran Anda belum dapat kami setujui karena alasan berikut:

**{{ $reason }}**

Silakan masuk kembali ke akun Anda untuk memperbarui data pendaftaran Anda.

<x-mail::button :url="config('app.frontend_url') . '/login'">
Perbaiki Pendaftaran
</x-mail::button>

Terima kasih,<br>
{{ config('app.name') }}
</x-mail::message>
