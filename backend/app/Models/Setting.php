<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $table = 'settings';

    /**
     * Tabel settings tidak memiliki created_at.
     */
    const CREATED_AT = null;

    protected $fillable = [
        'key',
        'value',
    ];

    /**
     * Ambil value setting berdasarkan key.
     */
    public static function getValue(string $key, string $default = ''): string
    {
        $setting = static::where('key', $key)->first();

        return $setting ? $setting->value : $default;
    }

    /**
     * Set value setting berdasarkan key.
     */
    public static function setValue(string $key, string $value): void
    {
        static::updateOrCreate(
            ['key' => $key],
            ['value' => $value]
        );
    }
}
