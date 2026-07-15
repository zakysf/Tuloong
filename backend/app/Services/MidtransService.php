<?php

namespace App\Services;

use App\Models\Transaction;
use Midtrans\Config;
use Midtrans\Snap;

class MidtransService
{
    public function __construct()
    {
        Config::$serverKey    = config('midtrans.server_key');
        Config::$isProduction = config('midtrans.is_production', false);
        Config::$isSanitized  = true;
        Config::$is3ds        = true;
    }

    /**
     * Buat Snap token untuk pembayaran.
     *
     * @param  Transaction  $transaction  Instance transaksi dengan relasi pelanggan & post
     * @return string  Snap token
     */
    public function createSnapToken(Transaction $transaction): string
    {
        $transaction->load(['pelanggan', 'post']);

        $pelanggan = $transaction->pelanggan;
        $orderId   = 'TULOONG-' . $transaction->id . '-' . time();

        $params = [
            'transaction_details' => [
                'order_id'    => $orderId,
                'gross_amount' => $transaction->amount,
            ],
            'customer_details' => [
                'first_name' => $pelanggan->nama,
                'email'      => $pelanggan->email,
                'phone'      => $pelanggan->nomor_telepon ?? '',
            ],
            'item_details' => [
                [
                    'id'       => 'POST-' . $transaction->post_id,
                    'price'    => $transaction->amount,
                    'quantity' => 1,
                    'name'     => $transaction->post->judul ?? 'Jasa Tuloong',
                ],
            ],
        ];

        // Simpan order_id ke database sebelum panggil Midtrans
        $transaction->update(['midtrans_order_id' => $orderId]);

        return Snap::getSnapToken($params);
    }
}
