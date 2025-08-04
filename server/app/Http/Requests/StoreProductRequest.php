<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array {
        return [
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'total_quantity' => 'required|integer|min:0',
            'cost' => 'required|numeric|min:0',
            'brand' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => ['nullable', 'regex:/^data:image\/(jpg|jpeg|png|gif);base64,/']
        ];
    }
}
