<?php

namespace Tests\Unit\Models;

use App\Models\Category;
use App\Models\Traits\Uuid;
use EloquentFilter\Filterable;
use PHPUnit\Framework\TestCase;
use Illuminate\Database\Eloquent\SoftDeletes;

class CategoryTest extends TestCase
{
    private $category;

    protected function setUp(): void
    {
        parent::setUp();
        $this->category = new Category();
    }

    protected function tearDown(): void
    {
        parent::tearDown();
    }

    public function testIfUseTraits()
    {
        $traits = [SoftDeletes::class, Uuid::class, Filterable::class];
        $categoryTraits = array_keys(class_uses(Category::class));
        $this->assertEquals($traits, $categoryTraits);
    }

    public function testFillableAttribute()
    {
        $fillable = ['name', 'description', 'is_active'];
        $this->assertEquals($fillable, $this->category->getFillable());
    }

    // public function testCats()
    // {
    //     $category = new Category();
    //     $cats = ['id', 'string'];
    //     $this->assertEquals($cats, $category->getCasts());
    // }

    public function testDatesAttribute()
    {
        $dates = ['deleted_at', 'created_at', 'updated_at'];
        $categoryDates = $this->category->getDates();
        foreach($dates as $date) {
            $this->assertContains($date, $categoryDates);
        }
        $this->assertCount(count($dates), $categoryDates);
    }

    public function testIncrementingAttribute()
    {
        $this->assertFalse($this->category->getIncrementing());
    }
}
