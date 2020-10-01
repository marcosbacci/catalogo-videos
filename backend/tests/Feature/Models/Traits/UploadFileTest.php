<?php

namespace Tests\Feature\Models\Traits;

use Illuminate\Http\UploadedFile;
use Tests\Stubs\Model\UploadFilesStub;
use Tests\TestCase;
use Tests\Traits\TestProd;
use Tests\Traits\TestStorage;

class UploadFileTest extends TestCase
{
    use TestStorage, TestProd;
    private $obj;

    protected function setUp(): void
    {
        parent::setUp();
        $this->obj = new UploadFilesStub();
    }

    public function testMakeOldFielsOnSaving()
    {
        UploadFilesStub::dropTable();
        UploadFilesStub::makeTable();

        $this->obj->fill([
            'name' => 'test',
            'file1' => 'teste1.mp4',
            'file2' => 'teste2.mp4'
        ]);
        $this->obj->save();

        $this->assertCount(0, $this->obj->oldFiles);
    }

    public function testUploadFile()
    {
        \Storage::fake();
        $file = UploadedFile::fake()->create('video.mp4');
        $this->obj->uploadFile($file);
        \Storage::assertExists("1/{$file->hashName()}");

    }
}
