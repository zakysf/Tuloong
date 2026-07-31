<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    /**
     * Seed settings default.
     */
    public function run(): void
    {
        $settings = [
            ['key' => 'qris_url', 'value' => 'https://your-qris-url-here.com'],
            ['key' => 'app_name', 'value' => 'Tuloong'],
            ['key' => 'app_tagline', 'value' => 'Butuh bantuan? Minta Tuloong aja'],
        ];

        foreach ($settings as $setting) {
            Setting::updateOrCreate(
                ['key' => $setting['key']],
                ['value' => $setting['value']]
            );
        }
    }
}
