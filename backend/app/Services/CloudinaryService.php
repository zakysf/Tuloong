<?php

namespace App\Services;

use Cloudinary\Cloudinary;

class CloudinaryService
{
    /**
     * Upload file ke Cloudinary.
     */
    public function upload($file, string $folder = 'tuloong'): string
    {
        $cloudinary = new Cloudinary(config('filesystems.disks.cloudinary.url'));
        $result = $cloudinary->uploadApi()->upload($file->getRealPath(), [
            'folder' => $folder,
        ]);

        return $result['secure_url'];
    }

    /**
     * Hapus file dari Cloudinary berdasarkan public ID.
     */
    public function delete(string $publicId): void
    {
        $cloudinary = new Cloudinary(config('filesystems.disks.cloudinary.url'));
        $cloudinary->uploadApi()->destroy($publicId);
    }
}
