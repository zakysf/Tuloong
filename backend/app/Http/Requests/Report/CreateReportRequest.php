<?php

namespace App\Http\Requests\Report;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class CreateReportRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'claim_id' => 'required|integer|exists:claims,id',
            'alasan'   => 'required|in:tidak_responsif,deskripsi_tidak_sesuai,perilaku_tidak_pantas,lainnya',
            'detail'   => 'nullable|string|max:500',
        ];
    }

    public function messages(): array
    {
        return [
            'claim_id.required' => 'ID claim wajib diisi',
            'claim_id.exists'   => 'Claim tidak ditemukan',
            'alasan.required'   => 'Alasan laporan wajib diisi',
            'alasan.in'         => 'Alasan tidak valid. Pilihan: tidak_responsif, deskripsi_tidak_sesuai, perilaku_tidak_pantas, lainnya',
            'detail.max'        => 'Detail laporan maksimal 500 karakter',
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
