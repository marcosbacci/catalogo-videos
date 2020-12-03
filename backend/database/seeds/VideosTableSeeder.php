<?php

use App\Models\CastMember;
use App\Models\Genre;
use App\Models\Video;
use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\UploadedFile;

class VideosTableSeeder extends Seeder
{
    private $allGenres;
    private $allCastMembers;
    private $relations = [
        'genres_id' => [],
        'categories_id' => [],
        'cast_members_id' => []
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
        $this->allCastMembers = CastMember::all();
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
        Model::unguard();

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

    public function fetchRelations()
    {
        $subGenres = $this->allGenres->random(5)->load('categories');
        $categoriesId = [];
        foreach ($subGenres as $genre) {
            array_push($categoriesId, ...$genre->categories->pluck('id')->toArray());
        }
        $categoriesId = array_unique($categoriesId);
        $genresId = $subGenres->pluck('id')->toArray();
        $this->relations['categories_id'] = $categoriesId;
        $this->relations['genres_id'] = $genresId;
        $this->relations['cast_members_id'] = $this->allCastMembers->random(3)->pluck('id')->toArray();
    }

    public function getImageFile()
    {
        return new UploadedFile(
            storage_path('faker/thumbs/avatar.png'),
            'avatar.png'
        );
    }

    public function getVideoFile()
    {
        return new UploadedFile(
            storage_path('faker/videos/video.mp4'),
            'video.mp4'
        );
    }
}
