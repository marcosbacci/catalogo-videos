<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class VideoResource extends JsonResource
{
    public function toArray($request)
    {
        return parent::toArray($request) + [
            'categories' => CategoryResource::collection($this->categories),
            'genres' => GenreResource::collection($this->genres),
            'thumb_file_url' => $this->thumb_file_url,
            'banner_file_url' => $this->banner_file_url,
            'trailer_file_url' => $this->trailer_file_url,
            'video_file_url' => $this->video_file_url
        ];
    }
}