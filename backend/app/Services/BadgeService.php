<?php

namespace App\Services;

use App\Models\MitraProfile;
use App\Models\Review;

class BadgeService
{
    /**
     * Evaluasi dan update badge mitra berdasarkan total job selesai & rating.
     *
     * Badge logic:
     * - profesional: total_job_selesai >= 30 && rating_rata >= 4.5
     * - terpercaya:  total_job_selesai >= 10 && rating_rata >= 4.0
     * - baru:        selainnya
     *
     * @param  int  $mitraId  User ID mitra
     * @return string  Badge yang ditetapkan
     */
    public function evaluate(int $mitraId): string
    {
        $profile = MitraProfile::where('user_id', $mitraId)->firstOrFail();

        $totalJob  = $profile->total_job_selesai;
        $ratingRata = (float) $profile->rating_rata;

        if ($totalJob >= 30 && $ratingRata >= 4.5) {
            $badge = 'profesional';
        } elseif ($totalJob >= 10 && $ratingRata >= 4.0) {
            $badge = 'terpercaya';
        } else {
            $badge = 'baru';
        }

        $profile->update(['badge' => $badge]);

        return $badge;
    }

    /**
     * Recalculate rating_rata mitra dari semua review yang ada,
     * lalu evaluasi badge-nya.
     *
     * @param  int  $mitraId  User ID mitra
     * @return string  Badge yang ditetapkan
     */
    public function recalculateAndEvaluate(int $mitraId): string
    {
        // Hitung rata-rata rating dari semua review mitra ini
        $avgRating = Review::where('mitra_id', $mitraId)->avg('rating') ?? 0;

        $profile = MitraProfile::where('user_id', $mitraId)->firstOrFail();
        $profile->update(['rating_rata' => round($avgRating, 2)]);

        return $this->evaluate($mitraId);
    }
}
