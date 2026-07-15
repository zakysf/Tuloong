<?php

namespace App\Http\Requests\Post;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class CreatePostRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'judul'          => 'required|string|max:255',
            'deskripsi'      => 'required|string',
            'provinsi'       => 'required|string|max:100',
            'kabupaten'      => 'required|string|max:100',
            'kecamatan'      => 'required|string|max:100',
            'estimasi_waktu' => 'nullable|string|max:100',
            'budget'         => 'required|integer|min:1000',
            'urgensi'        => 'required|in:biasa,penting,mendesak',
        ];
    }

    public function messages(): array
    {
        return [
            'judul.required'          => 'Judul postingan wajib diisi',
            'judul.max'               => 'Judul maksimal 255 karakter',
            'deskripsi.required'      => 'Deskripsi pekerjaan wajib diisi',
            'provinsi.required'       => 'Provinsi wajib diisi',
            'kabupaten.required'      => 'Kabupaten wajib diisi',
            'kecamatan.required'      => 'Kecamatan wajib diisi',
            'budget.required'         => 'Budget wajib diisi',
            'budget.integer'          => 'Budget harus berupa angka',
            'budget.min'              => 'Budget minimal Rp 1.000',
            'urgensi.required'        => 'Tingkat urgensi wajib diisi',
            'urgensi.in'              => 'Urgensi harus salah satu dari: biasa, penting, mendesak',
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
