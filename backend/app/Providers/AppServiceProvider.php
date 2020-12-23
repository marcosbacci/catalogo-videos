<?php

namespace App\Providers;

use App\Models\CastMember;
use App\Models\Genre;
use App\Models\Category;
use App\Observers\CategoryObserver;
use App\Observers\CastMemberObserver;
use App\Observers\GenreObserver;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        if ($this->app->isLocal()) {
			$this->app->register(\Barryvdh\LaravelIdeHelper\IdeHelperServiceProvider::class);
		}
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        \View::addExtension('html', 'blade');
        Category::observe(CategoryObserver::class);
        CastMember::observe(CastMemberObserver::class);
        Genre::observe(GenreObserver::class);
    }
}
