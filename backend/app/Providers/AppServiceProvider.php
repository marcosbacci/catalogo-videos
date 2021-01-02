<?php

namespace App\Providers;

use App\Models\CastMember;
use App\Models\Genre;
use App\Models\Category;
// use App\Observers\CategoryObserver;
// use App\Observers\CastMemberObserver;
// use App\Observers\GenreObserver;
use App\Observers\SyncModelObserver;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register()
    {
        if ($this->app->isLocal()) {
			$this->app->register(\Barryvdh\LaravelIdeHelper\IdeHelperServiceProvider::class);
		}
    }

    public function boot()
    {
        \View::addExtension('html', 'blade');
        Category::observe(SyncModelObserver::class);
        CastMember::observe(SyncModelObserver::class);
        Genre::observe(SyncModelObserver::class);
    }
}
