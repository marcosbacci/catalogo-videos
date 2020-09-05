<?php

use Illuminate\Database\Seeder;

class CastMembersSeeder extends Seeder
{
    public function run()
    {
        factory(\App\Models\CastMembersSeeder::class, 100)->create();
    }
}
