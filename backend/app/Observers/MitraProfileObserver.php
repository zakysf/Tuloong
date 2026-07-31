<?php

namespace App\Observers;

use App\Models\MitraProfile;

class MitraProfileObserver
{
    /**
     * Handle event saat MitraProfile di-update.
     * Evaluasi badge saat verification_status berubah ke aktif.
     */
    public function updated(MitraProfile $mitraProfile): void
    {
        // Jika verification_status berubah ke aktif dan badge masih baru
        if ($mitraProfile->wasChanged('verification_status') && $mitraProfile->verification_status === 'aktif') {
            // Evaluasi badge (baru → terpercaya → profesional)
            $mitraProfile->evaluateBadge();
        }

        // Jika total_job_selesai atau rating_rata berubah, evaluasi badge
        if ($mitraProfile->wasChanged('total_job_selesai') || $mitraProfile->wasChanged('rating_rata')) {
            $mitraProfile->evaluateBadge();
        }
    }
}
