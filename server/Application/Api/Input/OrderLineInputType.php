<?php

declare(strict_types=1);

namespace Application\Api\Input;

use Application\Model\Product;
use Application\Model\Subscription;
use GraphQL\Type\Definition\InputObjectType;

class OrderLineInputType extends InputObjectType
{
    public function __construct()
    {
        $config = [
            'description' => 'A shopping basket item when making an order',
            'fields' => function (): array {
                return [
                    'quantity' => [
                        'type' => self::nonNull(self::string()),
                    ],
                    'type' => [
                        'type' => self::nonNull(_types()->get('ProductType')),
                    ],
                    'isCHF' => [
                        'type' => self::nonNull(self::boolean()),
                    ],
                    'product' => [
                        'type' => _types()->getId(Product::class),
                    ],
                    'subscription' => [
                        'type' => _types()->getId(Subscription::class),
                    ],
                    'additionalEmails' => [
                        'type' => self::listOf(self::nonNull(self::string())),
                        'defaultValue' => [],
                    ],
                ];
            },
        ];

        parent::__construct($config);
    }
}
