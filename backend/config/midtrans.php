<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Midtrans Configuration
    |--------------------------------------------------------------------------
    |
    | Konfigurasi untuk integrasi Midtrans payment gateway.
    | Gunakan Sandbox untuk development/testing.
    |
    */

    'server_key'    => env('MIDTRANS_SERVER_KEY', ''),
    'client_key'    => env('MIDTRANS_CLIENT_KEY', ''),
    'is_production' => env('MIDTRANS_IS_PRODUCTION', false),
    'is_sanitized'  => true,
    'is_3ds'        => true,
];
