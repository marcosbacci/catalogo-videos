<?php

namespace App\Models;

use App\ModelFilters\CastMemberFilter;
use EloquentFilter\Filterable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Models\CastMember
 *
 * @property string $id
 * @property string $name
 * @property int $type
 * @property \Illuminate\Support\Carbon|null $deleted_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|CastMember filter($input = [], $filter = null)
 * @method static \Illuminate\Database\Eloquent\Builder|CastMember newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|CastMember newQuery()
 * @method static \Illuminate\Database\Query\Builder|CastMember onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|CastMember paginateFilter($perPage = null, $columns = [], $pageName = 'page', $page = null)
 * @method static \Illuminate\Database\Eloquent\Builder|CastMember query()
 * @method static \Illuminate\Database\Eloquent\Builder|CastMember simplePaginateFilter($perPage = null, $columns = [], $pageName = 'page', $page = null)
 * @method static \Illuminate\Database\Eloquent\Builder|CastMember whereBeginsWith($column, $value, $boolean = 'and')
 * @method static \Illuminate\Database\Eloquent\Builder|CastMember whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CastMember whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CastMember whereEndsWith($column, $value, $boolean = 'and')
 * @method static \Illuminate\Database\Eloquent\Builder|CastMember whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CastMember whereLike($column, $value, $boolean = 'and')
 * @method static \Illuminate\Database\Eloquent\Builder|CastMember whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CastMember whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CastMember whereUpdatedAt($value)
 * @method static \Illuminate\Database\Query\Builder|CastMember withTrashed()
 * @method static \Illuminate\Database\Query\Builder|CastMember withoutTrashed()
 * @mixin \Eloquent
 */
class CastMember extends Model
{
    use SoftDeletes, Traits\Uuid, Filterable;

    const TYPE_DIRECTOR = 1;
    const TYPE_ACTOR = 2;

    public static $types = [
        CastMember::TYPE_DIRECTOR,
        CastMember::TYPE_ACTOR
    ];

    protected $fillable = ['name', 'type'];
    protected $dates = ['deleted_at'];
    public $incrementing = false;
    protected $keyType = 'string';
    protected $casts = ['name' => 'string', 'type' => 'integer'];

    public function modelFilter()
    {
        return $this->provideFilter(CastMemberFilter::class);
    }
}
