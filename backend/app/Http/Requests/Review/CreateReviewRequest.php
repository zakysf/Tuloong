<?php

namespace App\Http\Requests\Review;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class CreateReviewRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'rating' => 'required|integer|min:1|max:5',
            'review' => 'nullable|string|max:500',
        ];
    }

    public function messages(): array
    {
        return [
            'rating.required' => 'Rating wajib diisi',
            'rating.integer'  => 'Rating harus berupa angka',
            'rating.min'      => 'Rating minimal 1',
            'rating.max'      => 'Rating maksimal 5',
            'review.max'      => 'Ulasan maksimal 500 karakter',
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
