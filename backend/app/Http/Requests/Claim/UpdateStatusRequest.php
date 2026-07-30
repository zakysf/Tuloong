<?php

namespace App\Http\Requests\Claim;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class UpdateStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => 'required|in:on_the_way,working,done_by_mitra',
            'foto_bukti' => 'required_if:status,done_by_mitra|image|mimes:jpeg,png,jpg|max:2048',
        ];
    }

    public function messages(): array
    {
        return [
            'status.required' => 'Status wajib diisi',
            'status.in'       => 'Status tidak valid. Pilihan: on_the_way, working, done_by_mitra',
            'foto_bukti.required_if' => 'Foto bukti wajib diunggah ketika status diselesaikan.',
            'foto_bukti.image'       => 'File foto bukti harus berupa gambar.',
            'foto_bukti.mimes'       => 'Format foto bukti harus jpeg, png, atau jpg.',
            'foto_bukti.max'         => 'Ukuran foto bukti tidak boleh lebih dari 2MB.',
        ];
    }

    protected function failedValidation(Validator $validator): void
    {
        throw new HttpResponseException(response()->json([
            'success' => false,
            'message' => 'Validasi gagal',
            'errors'  => $validator->errors(),
        ], 422));
    }
}
