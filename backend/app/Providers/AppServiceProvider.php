<?php

namespace App\Providers;

// use App\Observers\CategoryObserver;
// use App\Observers\CastMemberObserver;
// use App\Observers\GenreObserver;
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
    }
}
