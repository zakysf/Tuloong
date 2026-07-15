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
        ];
    }

    public function messages(): array
    {
        return [
            'status.required' => 'Status wajib diisi',
            'status.in'       => 'Status tidak valid. Pilihan: on_the_way, working, done_by_mitra',
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
