<?php return array (
  'beyondcode/laravel-dump-server' => 
  array (
    'providers' => 
    array (
      0 => 'BeyondCode\\DumpServer\\DumpServerServiceProvider',
    ),
  ),
  'bschmitt/laravel-amqp' => 
  array (
    'providers' => 
    array (
      0 => 'Bschmitt\\Amqp\\AmqpServiceProvider',
    ),
    'aliases' => 
    array (
      'Amqp' => 'Bschmitt\\Amqp\\Facades\\Amqp',
    ),
  ),
  'facade/ignition' => 
  array (
    'providers' => 
    array (
      0 => 'Facade\\Ignition\\IgnitionServiceProvider',
    ),
    'aliases' => 
    array (
      'Flare' => 'Facade\\Ignition\\Facades\\Flare',
    ),
  ),
  'fideloper/proxy' => 
  array (
    'providers' => 
    array (
      0 => 'Fideloper\\Proxy\\TrustedProxyServiceProvider',
    ),
  ),
  'fruitcake/laravel-cors' => 
  array (
    'providers' => 
    array (
      0 => 'Fruitcake\\Cors\\CorsServiceProvider',
    ),
  ),
  'laravel/dusk' => 
  array (
    'providers' => 
    array (
      0 => 'Laravel\\Dusk\\DuskServiceProvider',
    ),
  ),
  'laravel/tinker' => 
  array (
    'providers' => 
    array (
      0 => 'Laravel\\Tinker\\TinkerServiceProvider',
    ),
  ),
  'laravel/ui' => 
  array (
    'providers' => 
    array (
      0 => 'Laravel\\Ui\\UiServiceProvider',
    ),
  ),
  'nesbot/carbon' => 
  array (
    'providers' => 
    array (
      0 => 'Carbon\\Laravel\\ServiceProvider',
    ),
  ),
  'nunomaduro/collision' => 
  array (
    'providers' => 
    array (
      0 => 'NunoMaduro\\Collision\\Adapters\\Laravel\\CollisionServiceProvider',
    ),
  ),
  'superbalist/laravel-google-cloud-storage' => 
  array (
    'providers' => 
    array (
      0 => 'Superbalist\\LaravelGoogleCloudStorage\\GoogleCloudStorageServiceProvider',
    ),
  ),
  'tucker-eric/eloquentfilter' => 
  array (
    'providers' => 
    array (
      0 => 'EloquentFilter\\ServiceProvider',
    ),
  ),
  'tymon/jwt-auth' => 
  array (
    'aliases' => 
    array (
      'JWTAuth' => 'Tymon\\JWTAuth\\Facades\\JWTAuth',
      'JWTFactory' => 'Tymon\\JWTAuth\\Facades\\JWTFactory',
    ),
    'providers' => 
    array (
      0 => 'Tymon\\JWTAuth\\Providers\\LaravelServiceProvider',
    ),
  ),
  'vizir/laravel-keycloak-web-guard' => 
  array (
    'providers' => 
    array (
      0 => 'Vizir\\KeycloakWebGuard\\KeycloakWebGuardServiceProvider',
    ),
    'aliases' => 
    array (
      'KeycloakWeb' => 'Vizir\\KeycloakWebGuard\\Facades\\KeycloakWeb',
    ),
  ),
);