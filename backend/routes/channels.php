<?php

use App\Models\Claim;
use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Channel authorization untuk Laravel Reverb.
| Private channel chat.{claimId} hanya bisa diakses oleh:
| - Mitra pemilik claim
| - Pelanggan pemilik post dalam claim
|
*/

Broadcast::channel('chat.{claimId}', function ($user, int $claimId) {
    $claim = Claim::with('post')->find($claimId);

    if (!$claim) {
        return false;
    }

    $isMitraPemilik     = $user->role === 'mitra' && $claim->mitra_id === $user->id;
    $isPelangganPemilik = $user->role === 'pelanggan' && $claim->post->user_id === $user->id;

    return $isMitraPemilik || $isPelangganPemilik;
});
