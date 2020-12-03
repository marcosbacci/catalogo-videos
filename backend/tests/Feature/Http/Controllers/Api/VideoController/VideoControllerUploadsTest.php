<?php

namespace Tests\Feature\Http\Controllers\Api\VideoController;

use Illuminate\Http\UploadedFile;
use Tests\Traits\TestUploads;
use App\Models\Video;

class VideoControllerUploadsTest extends BasicVideoControllerTestCase
{
    use TestUploads;

    public function testInvalidationThumbField()
    {
        $this->assertInvalidationFile(
            'thumb_file',
            'jpg',
            Video::THUMB_FILE_MAX_SIZE,
            'validation.image');
    }

    public function testInvalidationBannerField()
    {
        $this->assertInvalidationFile(
            'banner_file',
            'jpg',
            Video::BANNER_FILE_MAX_SIZE,
            'validation.image');
    }

    public function testInvalidationTrailerField()
    {
        $this->assertInvalidationFile(
            'trailer_file',
            'mp4',
            Video::TRAILER_FILE_MAX_SIZE,
            'validation.mimetypes', ['values' => 'video/mp4']);
    }

    public function testInvalidationVideoField()
    {
        $this->assertInvalidationFile(
            'video_file',
            'mp4',
            Video::VIDEO_FILE_MAX_SIZE,
            'validation.mimetypes', ['values' => 'video/mp4']);
    }

    // public function testStoreWithFiles()
    // {
    //     \Storage::fake();
    //     $files = $this->getFiles();

    //     $response = $this->json(
    //         'POST',
    //         $this->routeStore(),
    //         $this->sendData +
    //         $files
    //     );

    //     $response->assertStatus(201);
    //     $id = $response->json('data.id');
    //     foreach ($files as $file) {
    //         \Storage::assertExists("$id/{$file->hashName()}");
    //     }
    // }

    // public function testUpdateWithFiles()
    // {
    //     \Storage::fake();
    //     $files = $this->getFiles();

    //     $response = $this->json(
    //         'PUT',
    //         $this->routeUpdate(),
    //         $this->sendData +
    //         $files
    //     );

    //     $response->assertStatus(200);
    //     $id = $response->json('data.id');
    //     foreach ($files as $file) {
    //         \Storage::assertExists("$id/{$file->hashName()}");
    //     }
    // }

    protected function getFiles()
    {
        return [
            // 'thumb_file' => UploadedFile::fake()->create("thumb_file.jpeg"),
            // 'banner_file' => UploadedFile::fake()->create("banner_file.jpeg"),
            // 'trailer_file' => UploadedFile::fake()->create("trailer_file.mp4"),
            'video_file' => UploadedFile::fake()->create("video_file.mp4")
        ];
    }

    protected function routeStore()
    {
        return route('videos.store');
    }

    protected function routeUpdate()
    {
        return route('videos.update', ['video' => $this->video->id]);
    }

    protected function model()
    {
        return Video::class;
    }
}
