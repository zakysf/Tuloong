<?php

namespace App\Http\Controllers\Shared;

use App\Events\MessageSent;
use App\Http\Controllers\Controller;
use App\Models\Claim;
use App\Models\Message;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    /**
     * GET /api/claims/{id}/messages — ambil semua pesan dalam claim.
     * Hanya pelanggan pemilik post atau mitra pemilik claim yang bisa akses.
     */
    public function index(Request $request, int $id): JsonResponse
    {
        $user  = $request->user();
        $claim = Claim::with('post')->findOrFail($id);

        // Validasi akses: harus pelanggan pemilik post atau mitra pemilik claim
        $this->authorizeClaimAccess($user, $claim);

        $messages = Message::where('claim_id', $id)
            ->with('sender:id,nama,role,foto_profil')
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Pesan berhasil diambil',
            'data'    => $messages,
        ]);
    }

    /**
     * POST /api/claims/{id}/messages — kirim pesan baru.
     */
    public function store(Request $request, int $id): JsonResponse
    {
        $user  = $request->user();
        $claim = Claim::with('post')->findOrFail($id);

        // Validasi akses
        $this->authorizeClaimAccess($user, $claim);

        $request->validate([
            'body' => 'required|string|max:1000',
        ]);

        $message = Message::create([
            'claim_id'  => $claim->id,
            'sender_id' => $user->id,
            'body'      => $request->body,
            'created_at' => now(),
        ]);

        $message->load('sender:id,nama,role,foto_profil');

        // Broadcast event ke channel real-time
        broadcast(new MessageSent($message))->toOthers();

        return response()->json([
            'success' => true,
            'message' => 'Pesan berhasil dikirim',
            'data'    => $message,
        ], 201);
    }

    /**
     * Validasi akses ke claim: hanya pelanggan pemilik post atau mitra pemilik claim.
     */
    private function authorizeClaimAccess($user, Claim $claim): void
    {
        $isPelangganPemilik = $user->role === 'pelanggan' && $claim->post->user_id === $user->id;
        $isMitraPemilik     = $user->role === 'mitra' && $claim->mitra_id === $user->id;

        if (!$isPelangganPemilik && !$isMitraPemilik) {
            abort(403, 'Anda tidak memiliki akses ke percakapan ini');
        }
    }
}
