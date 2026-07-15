<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        api: __DIR__.'/../routes/api.php',
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        channels: __DIR__.'/../routes/channels.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias([
            'role' => \App\Http\Middleware\EnsureRole::class,
            'mitra.active' => \App\Http\Middleware\EnsureMitraActive::class,
        ]);

        $middleware->statefulApi();
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // Format JSON response untuk ModelNotFoundException (404)
        $exceptions->renderable(function (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Data tidak ditemukan',
            ], 404);
        });

        // Format JSON response untuk AuthenticationException (401)
        $exceptions->renderable(function (\Illuminate\Auth\AuthenticationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated. Silakan login terlebih dahulu.',
            ], 401);
        });

        // Format JSON response untuk ValidationException (422)
        $exceptions->renderable(function (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors'  => $e->errors(),
            ], 422);
        });
    })->create();
