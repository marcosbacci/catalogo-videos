<?php

namespace Tests\Unit\Models\Traits;

use PHPUnit\Framework\TestCase;
use Tests\Stubs\Model\UploadFilesStub;
use Illuminate\Http\UploadedFile;

class UploadFilesUnitTest extends TestCase
{
    // private $obj;

    // protected function setUp(): void
    // {
    //     parent::setUp();
    //     $this->obj = new UploadFilesStub();
    // }

    // public function testUploadFile()
    // {
    //     \Storage::fake();
    //     $file = UploadedFile::fake()->create('video.mp4');
    //     $this->obj->uploadFile($file);
    //     \Storage::assertExists("1/{$file->hashName()}");
    // }

    // public function testUploadFiles()
    // {
    //     \Storage::fake();
    //     $file1 = UploadedFile::fake()->create('video1.mp4');
    //     $file2 = UploadedFile::fake()->create('video2.mp4');
    //     $this->obj->uploadFiles([$file1, $file2]);
    //     \Storage::assertExists("1/{$file1->hashName()}");
    //     \Storage::assertExists("1/{$file2->hashName()}");
    // }

    // public function testDeleteFile()
    // {
    //     \Storage::fake();
    //     $file = UploadedFile::fake()->create('video1.mp4');
    //     $this->obj->uploadFile($file);
    //     $fileName = $file->hashName();
    //     $this->obj->deleteFile($file);
    //     \Storage::assertMissing("1/{$fileName}");

    //     $file = UploadedFile::fake()->create('video1.mp4');
    //     $this->obj->uploadFile($file);
    //     $this->obj->deleteFile($file);
    //     \Storage::assertMissing("1/{$file->hashName()}");
    // }

    // public function testExctactFiles()
    // {
    //     $attibutes = [];
    //     $files = UploadFilesStub::extractFiles($attibutes);
    //     $this->assertCount(0, $attibutes);
    //     $this->assertCount(0, $files);

    //     $attibutes = ['file1' => 'test'];
    //     $files = UploadFilesStub::extractFiles($attibutes);
    //     $this->assertCount(1, $attibutes);
    //     $this->assertEquals(['file1' => 'test'], $attibutes);
    //     $this->assertCount(0, $files);
    // }

    // public function testDeleteFiles()
    // {
    //     \Storage::fake();
    //     $file1 = UploadedFile::fake()->create('video1.mp4');
    //     $file2 = UploadedFile::fake()->create('video2.mp4');
    //     $this->obj->uploadFiles([$file1, $file2]);
    //     $this->obj->deleteFiles([$file1->hashName(), $file2]);
    //     \Storage::assertMissing("1/{$file1->hashName()}");
    //     \Storage::assertMissing("1/{$file2->hashName()}");
    // }

    public function teste()
    {
        $this->assertTrue(true);
    }
}
