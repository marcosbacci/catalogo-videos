<?php

use App\Models\Genre;
use App\Models\Video;
use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\UploadedFile;

class VideosTableSeeder extends Seeder
{
    private $allGenres;
    private $relations = [
        'genres_id' => [],
        'categories_id' => []
    ];

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $dir = \Storage::getDriver()->getAdapter()->getPathPrefix();
        \File::deleteDirectory($dir, true);

        $self = $this;
        $this->allGenres = Genre::all();
        Model::reguard();
        factory(\App\Models\Video::class, 100)
            ->make()
            ->each(function (Video $video) use ($self){
                $self->fetchRelations();
                Video::create(
                    array_merge(
                        $video->toArray(),
                        [
                            'thumb_file' => $self->getImageFile(),
                            'banner_file' => $self->getImageFile(),
                            'trailer_file' => $self->getVideoFile(),
                            'video_file' => $self->getVideoFile()
                        ],
                        $this->relations
                    )
                );
            });

        // $genres = Genre::all();
        // factory(\App\Models\Video::class, 100)
        //     ->create()
        //     ->each(function (Video $video) use ($genres){
        //         $subGenres = $genres->random(5)->load('categories');
        //         $categoriesId = [];
        //         foreach ($subGenres as $genre) {
        //             array_push($categoriesId, ...$genre->categories->pluck('id')->toArray());
        //         }
        //         $categoriesId = array_unique($categoriesId);
        //         $video->categories()->attach($categoriesId);
        //         $video->genres()->attach($subGenres->pluck('id')->toArray());
        //     });
    }
}
