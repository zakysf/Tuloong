<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Str;
use App\Models\User;

class PasswordResetController extends Controller
{
    /**
     * Kirim link reset password ke email.
     */
    public function sendResetLinkEmail(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $status = Password::broker()->sendResetLink(
            $request->only('email')
        );

        return $status === Password::RESET_LINK_SENT
                    ? response()->json(['success' => true, 'message' => 'Link reset password telah dikirim ke email Anda.'])
                    : response()->json(['success' => false, 'message' => 'Email tidak ditemukan.'], 400);
    }

    /**
     * Reset password menggunakan token dari email.
     */
    public function reset(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:8|confirmed',
        ]);

        $user = User::where('email', $request->email)->first();
        if ($user && Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Kata sandi baru tidak boleh sama dengan kata sandi lama.',
                'errors' => [
                    'password' => ['Kata sandi baru tidak boleh sama dengan kata sandi lama.']
                ]
            ], 422);
        }

        $status = Password::broker()->reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill([
                    'password' => Hash::make($password)
                ])->setRememberToken(Str::random(60));

                $user->save();

                event(new PasswordReset($user));
            }
        );

        return $status === Password::PASSWORD_RESET
                    ? response()->json(['success' => true, 'message' => 'Password berhasil direset. Silakan login.'])
                    : response()->json(['success' => false, 'message' => 'Token reset tidak valid atau sudah kadaluarsa.'], 400);
    }
}
