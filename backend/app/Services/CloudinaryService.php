<?php

namespace App\Services;

use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;

class CloudinaryService
{
    /**
     * Upload file ke Cloudinary.
     *
     * @param  \Illuminate\Http\UploadedFile  $file
     * @param  string  $folder  Folder di Cloudinary (misal: 'tuloong/ktp')
     * @return string  URL file yang diupload
     */
    public function upload($file, string $folder = 'tuloong'): string
    {
        $result = Cloudinary::upload($file->getRealPath(), [
            'folder' => $folder,
        ]);

        return $result->getSecurePath();
    }

    /**
     * Hapus file dari Cloudinary berdasarkan public ID.
     *
     * @param  string  $publicId
     * @return void
     */
    public function delete(string $publicId): void
    {
        Cloudinary::destroy($publicId);
    }
}
