<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class RegisterPelangganRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nama'          => 'required|string|max:255',
            'email'         => 'required|email|unique:users,email',
            'password'      => 'required|string|min:8|confirmed',
            'nomor_telepon' => 'required|string|max:20',
            'provinsi'      => 'required|string|max:100',
            'kabupaten'     => 'required|string|max:100',
            'kecamatan'     => 'required|string|max:100',
        ];
    }

    public function messages(): array
    {
        return [
            'nama.required'          => 'Nama wajib diisi',
            'nama.max'               => 'Nama maksimal 255 karakter',
            'email.required'         => 'Email wajib diisi',
            'email.email'            => 'Format email tidak valid',
            'email.unique'           => 'Email sudah digunakan',
            'password.required'      => 'Password wajib diisi',
            'password.min'           => 'Password minimal 8 karakter',
            'password.confirmed'     => 'Konfirmasi password tidak cocok',
            'nomor_telepon.required' => 'Nomor telepon wajib diisi',
            'provinsi.required'      => 'Provinsi wajib diisi',
            'kabupaten.required'     => 'Kabupaten wajib diisi',
            'kecamatan.required'     => 'Kecamatan wajib diisi',
        ];
    }

    /**
     * Override failed validation untuk return format JSON konsisten.
     */
    protected function failedValidation(Validator $validator): void
    {
        throw new HttpResponseException(response()->json([
            'success' => false,
            'message' => 'Validasi gagal',
            'errors'  => $validator->errors(),
        ], 422));
    }
}
