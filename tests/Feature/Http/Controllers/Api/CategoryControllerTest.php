<?php

namespace Tests\Feature\Http\Controllers\Api;

use App\Models\Category;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;
use Tests\Traits\TestValidations;
use Tests\Traits\TestSaves;

class CategoryControllerTest extends TestCase
{
    use DatabaseMigrations, TestValidations, TestSaves;

    protected function setUp(): void
    {
        parent::setUp();
        $this->category = factory(Category::class)->create();
    }

    public function testIndex()
    {
        $response = $this->get(route('categories.index'));
        $response
            ->assertStatus(200)
            ->assertJson([$this->category->toArray()]);
    }

    public function testShow()
    {
        $response = $this->get(route('categories.show', ['category' => $this->category->id]));
        $response
            ->assertStatus(200)
            ->assertJson($this->category->toArray());
    }

    public function testInvalidationData()
    {
        $data = ['name' => ''];
        $this->assertInvalidationInStoreAction($data, 'validation.required');
        $this->assertInvalidationInUpdateAction($data, 'validation.required');

        $data = ['name' => str_repeat('a', 256)];
        $this->assertInvalidationInStoreAction($data, 'validation.max.string', ['max' => 255]);
        $this->assertInvalidationInUpdateAction($data, 'validation.max.string', ['max' => 255]);

        $data = ['is_active' => 'a'];
        $this->assertInvalidationInStoreAction($data, 'validation.boolean');
        $this->assertInvalidationInUpdateAction($data, 'validation.boolean');
    }

    public function testStore()
    {
        $data = [
            'name' => 'teste'
        ];
        $response = $this->assertStore($data, $data + ['description' => null, 'is_active' => true, 'deleted_at' => null]);
        $response->assertJsonStructure([
            'created_at', 'updated_at'
        ]);

        $data = [
            'name' => 'teste',
            'description' => 'description',
            'is_active' => false
        ];
        $this->assertStore($data, $data + ['description' => 'description', 'is_active' => false]);
    }

    public function testUpdate()
    {
        $this->category = factory(Category::class)->create([
            'is_active' => false,
            'description' => 'description'
        ]);
        $data = [
            'name' => 'test',
            'is_active' => true,
            'description' => 'test'
        ];
        $response = $this->assertUpdate($data, $data + ['deleted_at' => null]);
        $response->assertJsonStructure([
            'created_at', 'updated_at'
        ]);

        $data['description'] = '';
        $this->assertUpdate($data, array_merge($data, ['description' => null]));

        $data['description'] = 'test';
        $this->assertUpdate($data, array_merge($data, ['description' => 'test']));

        $data['description'] = null;
        $this->assertUpdate($data, array_merge($data, ['description' => null]));
    }

    public function testDelete()
    {
        $response = $this->json('DELETE', route('categories.destroy', ['category' => $this->category->id]));
        $response->assertStatus(204);
        $this->assertNull(Category::find($this->category->id));
        $this->assertNotNull(Category::withTrashed()->find($this->category->id));
    }

    protected function routeStore()
    {
        return route('categories.store');
    }

    protected function routeUpdate()
    {
        return route('categories.update', ['category' => $this->category->id]);
    }

    protected function model()
    {
        return Category::class;
    }
}