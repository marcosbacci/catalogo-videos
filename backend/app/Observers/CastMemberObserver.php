<?php

namespace App\Observers;

use App\Models\CastMember;
use Bschmitt\Amqp\Message;

class CastMemberObserver
{
    /**
     * Handle the CastMember "created" event.
     *
     * @param  App\Models\CastMember  $CastMember
     * @return void
     */
    public function created(CastMember $castMember)
    {
        $message = new Message($castMember->toJson());
        \Amqp::publish('model.castMember.created', $message);
    }

    /**
     * Handle the castMember "updated" event.
     *
     * @param  App\Models\CastMember  $castMember
     * @return void
     */
    public function updated(CastMember $castMember)
    {
        $message = new Message($castMember->toJson());
        \Amqp::publish('model.castMember.updated', $message);
    }

    /**
     * Handle the castMember "deleted" event.
     *
     * @param  App\Models\CastMember  $castMember
     * @return void
     */
    public function deleted(CastMember $castMember)
    {
        $message = new Message(json_encode(['id' => $castMember->id]));
        \Amqp::publish('model.castMember.deleted', $message);
    }

    /**
     * Handle the castMember "restored" event.
     *
     * @param  App\Models\CastMember  $castMember
     * @return void
     */
    public function restored(CastMember $castMember)
    {
        //
    }

    /**
     * Handle the castMember "force deleted" event.
     *
     * @param  App\Models\CastMember  $castMember
     * @return void
     */
    public function forceDeleted(CastMember $castMember)
    {
        //
    }
}
