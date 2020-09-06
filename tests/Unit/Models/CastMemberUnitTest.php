<?php

namespace Tests\Unit\Models;

use App\Models\CastMember;
use App\Models\Traits\Uuid;
use PHPUnit\Framework\TestCase;
use Illuminate\Database\Eloquent\SoftDeletes;

class CastMemberUnitTest extends TestCase
{
    private $castMember;

    protected function setUp(): void
    {
        parent::setUp();
        $this->castMember = new CastMember();
    }

    protected function tearDown(): void
    {
        parent::tearDown();
    }

    public function testIfUseTraits()
    {
        $traits = [SoftDeletes::class, Uuid::class];
        $castMemberTraits = array_keys(class_uses(CastMember::class));
        $this->assertEquals($traits, $castMemberTraits);
    }

    public function testFillableAttribute()
    {
        $fillable = ['name', 'type'];
        $this->assertEquals($fillable, $this->castMember->getFillable());
    }

    public function testDatesAttribute()
    {
        $dates = ['deleted_at', 'created_at', 'updated_at'];
        $castMemberDates = $this->castMember->getDates();
        foreach($dates as $date) {
            $this->assertContains($date, $castMemberDates);
        }
        $this->assertCount(count($dates), $castMemberDates);
    }

    public function testIncrementingAttribute()
    {
        $this->assertFalse($this->castMember->getIncrementing());
    }
}