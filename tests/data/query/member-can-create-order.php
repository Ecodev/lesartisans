<?php

declare(strict_types=1);

use Application\DBAL\Types\OrderTypeType;

return [
    [
        'query' => 'mutation ($input: [OrderLineInput!]!) {
            createOrder(input: $input) {
                balanceCHF
                balanceEUR
                orderLines {
                    quantity
                    type
                    balanceCHF
                    balanceEUR
                }
            }
        }',
        'variables' => [
            'input' => [
                [
                    'product' => 3000,
                    'quantity' => 250,
                    'isCHF' => true,
                    'type' => OrderTypeType::DIGITAL,

                ],
                [
                    'product' => 3001,
                    'quantity' => 1,
                    'isCHF' => true,
                    'type' => OrderTypeType::PAPER,

                ],
            ],
        ],
    ],
    [
        'data' => [
            'createOrder' => [
                'balanceCHF' => '2510.00',
                'balanceEUR' => '0.00',
                'orderLines' => [
                    [
                        'quantity' => '250',
                        'type' => OrderTypeType::DIGITAL,
                        'balanceCHF' => '2500.00',
                        'balanceEUR' => '0.00',
                    ],
                    [
                        'quantity' => '1',
                        'type' => OrderTypeType::PAPER,
                        'balanceCHF' => '10.00',
                        'balanceEUR' => '0.00',
                    ],
                ],
            ],
        ],

    ],
];
