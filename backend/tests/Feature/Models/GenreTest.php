<?php

namespace Tests\Feature\Models;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use App\Models\Genre;
use Tests\TestCase;

class GenreTest extends TestCase
{
    use DatabaseMigrations;

    public function testList()
    {
        factory(Genre::class, 1)->create();
        $genres = Genre::all();
        $this->assertCount(1, $genres);

        $GenreKeys = array_keys($genres->first()->getAttributes());
        $this->assertEqualsCanonicalizing([
            'id', 'name', 'is_active', 'created_at', 'updated_at', 'deleted_at'
        ], $GenreKeys);
    }

    public function testCreate()
    {
        $Genre = Genre::create([
            'name' => 'Ação'
        ]);
        $Genre->refresh();

        $this->assertEquals('Ação', $Genre->name);
        $this->assertNull($Genre->description);
        $this->assertTrue((bool)$Genre->is_active);
        $this->assertTrue(\Ramsey\Uuid\Uuid::isValid($Genre->id));
    }

    public function testUpdate()
    {
        $Genre = factory(Genre::class)->create([
            'is_active' => false
        ])->first();

        $data = [
            'name' => 'test_name_updated',
            'is_active' => true
        ];
        $Genre->update($data);

        foreach($data as $key => $value) {
            $this->assertEquals($value, $Genre->{$key});
        }
    }

    public function testDelete()
    {
        $Genre = factory(Genre::class)->create()->first();

        $Genre->delete();
        $this->assertNotNull($Genre->deleted_at);
    }
}
