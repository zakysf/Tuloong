<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;

class WebhookController extends Controller
{
    /**
     * POST /api/webhook/midtrans — handle notifikasi pembayaran dari Midtrans.
     * Endpoint ini tanpa middleware Sanctum (harus publik).
     */
    public function handle(Request $request): Response
    {
        $payload = $request->all();

        // Log payload untuk debugging
        Log::info('Midtrans webhook received', $payload);

        // Validasi signature Midtrans
        $serverKey        = config('midtrans.server_key');
        $orderId          = $payload['order_id'] ?? '';
        $statusCode       = $payload['status_code'] ?? '';
        $grossAmount      = $payload['gross_amount'] ?? '';
        $signatureKey     = $payload['signature_key'] ?? '';

        $expectedSignature = hash('sha512', $orderId . $statusCode . $grossAmount . $serverKey);

        if ($signatureKey !== $expectedSignature) {
            Log::warning('Midtrans webhook invalid signature', [
                'order_id' => $orderId,
            ]);
            return response('Invalid signature', 403);
        }

        $transactionStatus = $payload['transaction_status'] ?? '';

        // Cari transaksi berdasarkan midtrans_order_id
        $transaction = Transaction::where('midtrans_order_id', $orderId)->first();

        if (!$transaction) {
            Log::warning('Midtrans webhook: transaksi tidak ditemukan', ['order_id' => $orderId]);
            return response('Transaction not found', 404);
        }

        // Update status transaksi berdasarkan status Midtrans
        if (in_array($transactionStatus, ['settlement', 'capture'])) {
            $transaction->update(['status' => 'paid']);
            
            // Otomatis ubah status post dan claim agar mitra bisa mulai bekerja
            if ($transaction->post) {
                $transaction->post->update(['status' => 'in_progress']);
            }
            if ($transaction->claim) {
                $transaction->claim->update(['status' => 'on_the_way']);
            }

            Log::info('Transaksi berhasil dibayar', ['order_id' => $orderId]);
        } elseif (in_array($transactionStatus, ['expire', 'cancel', 'deny'])) {
            // Status dikembalikan ke pending agar pelanggan bisa coba bayar ulang
            $transaction->update(['status' => 'pending']);
            Log::info('Transaksi dibatalkan/expired, dikembalikan ke pending', ['order_id' => $orderId]);
        }

        return response('OK', 200);
    }
}
