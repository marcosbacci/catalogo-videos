<?php

namespace Tests\Feature\Http\Controllers\Api;

use App\Models\Genre;
use App\Models\Category;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;

class GenreControllerTest extends TestCase
{
    use DatabaseMigrations;

    public function testIndex()
    {
        $genre = factory(Genre::class)->create();
        $response = $this->get(route('genres.index'));

        $response
            ->assertStatus(200)
            ->assertJson([$genre->toArray()]);
    }

    public function testShow()
    {
        $genre = factory(Genre::class)->create();
        $response = $this->get(route('genres.show', ['genre' => $genre->id]));

        $response
            ->assertStatus(200)
            ->assertJson($genre->toArray());
    }

    public function testInvalidationData()
    {
        $category = factory(Category::class)->create();
        $response = $this->json('POST', route('genres.store', []));

        $response
            ->assertStatus(422)
            ->assertJsonValidationErrors(['name'])
            ->assertJsonValidationErrors(['categories_id'])
            ->assertJsonMissingValidationErrors(['is_active'])
            ->assertJsonFragment([
                \Lang::get('validation.required', ['attribute' => 'name'])                
            ])
            ->assertJsonFragment([
                \Lang::get('validation.required', ['attribute' => 'categories id'])
            ]);


        $response = $this->json('POST', route('genres.store', [
            'name' => str_repeat('a', 256),
            'is_active' => 'a',
            'categories_id' => $category->id
        ]));

        $response
            ->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'is_active'])
            ->assertJsonFragment([
                \Lang::get('validation.max.string', ['attribute' => 'name', 'max' => 255])
            ])
            ->assertJsonFragment([
                \Lang::get('validation.boolean', ['attribute' => 'is active'])
            ]);


        $genre = factory(Genre::class)->create();
        $response = $this->json('PUT', route('genres.update', ['genre' => $genre->id], []));

        $response
            ->assertStatus(422)
            ->assertJsonValidationErrors(['name'])
            ->assertJsonValidationErrors(['categories_id'])
            ->assertJsonMissingValidationErrors(['is_active'])
            ->assertJsonFragment([
                \Lang::get('validation.required', ['attribute' => 'name'])
            ])
            ->assertJsonFragment([
                \Lang::get('validation.required', ['attribute' => 'categories id'])
            ]);


        $response = $this->json('PUT', route('genres.update', ['genre' => $genre->id]), [
            'name' => str_repeat('a', 256),
            'is_active' => 'a',
            'categories_id' => $category->id
        ]);

        $response
            ->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'is_active'])
            ->assertJsonFragment([
                \Lang::get('validation.max.string', ['attribute' => 'name', 'max' => 255])
            ])
            ->assertJsonFragment([
                \Lang::get('validation.boolean', ['attribute' => 'is active'])
            ]);
    }

    public function testStore()
    {
        $category = factory(Category::class)->create();
        $response = $this->json('POST', route('genres.store'),[
            'name' => 'teste',
            'categories_id' => [$category->id]
        ]);

        $id = $response->json('id');
        $genre = Genre::find($id);

        $response
            ->assertStatus(201)
            ->assertJson($genre->toArray());

        $this->assertTrue($response->json('is_active'));

        $response = $this->json('POST', route('genres.store'), [
            'name' => 'teste',
            'is_active' => false,
            'categories_id' => [$category->id]
        ]);

        $response
            ->assertStatus(201)
            ->assertJsonFragment([
                'is_active' => false
            ]);
    }

    public function testUpdate()
    {
        $category = factory(Category::class)->create();
        $genre = factory(Genre::class)->create([
            'is_active' => false
        ]);
        $response = $this->json('PUT', route('genres.update', ['genre' => $genre->id]),[
            'name' => 'teste',
            'is_active' => true,
            'categories_id' => [$category->id]
        ]);

        $id = $response->json('id');
        $genre = Genre::find($id);

        $response
            ->assertStatus(200)
            ->assertJson($genre->toArray())
            ->assertJsonFragment([
                'is_active' => true
            ]);
    }

    public function testDelete()
    {
        $genre = factory(Genre::class)->create();
        $response = $this->json('DELETE', route('genres.destroy', ['genre' => $genre->id]));

        $response->assertStatus(204);
        
        $genre->refresh();
        $this->assertNotNull($genre->deleted_at);
    }
}