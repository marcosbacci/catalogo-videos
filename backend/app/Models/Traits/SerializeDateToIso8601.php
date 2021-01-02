<?php

namespace App\Models\Traits;

trait SerializeDateToIso8601
{
    protected function serializeDate(\DateTimeInterface $data) {
        return $data->format(\DateTime::ISO8601);
    }
}
