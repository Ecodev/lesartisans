<?php

declare(strict_types=1);

/**
 * Default configuration that can be overridden by a local.php, but it at least ensure
 * that required keys exist with "safe" values.
 */
return [
    'hostname' => 'lesartisansdelatransition.lan',
    'fromEmail' => 'noreply@lesartisansdelatransition.lan',
    'emailOverride' => null,
    'smtp' => null,
    'phpPath' => '/usr/bin/php',
    'doorsApi' => [
        'endpoint' => 'http://localhost:8888',
        'token' => 'my-token-value',
    ],
    'templates' => [
        'paths' => [
            'app' => ['server/templates/app'],
            'error' => ['server/templates/error'],
            'layout' => ['server/templates/layout'],
        ],
    ],
    'banking' => [
        'bankAccount' => '',
        'postAccount' => '',
        'paymentTo' => '',
        'paymentFor' => '',
    ],
];
