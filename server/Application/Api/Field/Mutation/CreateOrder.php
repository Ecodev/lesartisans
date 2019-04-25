<?php

declare(strict_types=1);

namespace Application\Api\Field\Mutation;

use Application\Api\Field\FieldInterface;
use Application\Model\Order;
use Application\Model\User;
use Application\Service\Invoicer;
use GraphQL\Type\Definition\Type;
use Zend\Expressive\Session\SessionInterface;

abstract class CreateOrder implements FieldInterface
{
    public static function build(): array
    {
        return [
            'name' => 'createOrder',
            'type' => _types()->getOutput(Order::class),
            'description' => 'Make an order to the shop.',
            'args' => [
                'input' => Type::nonNull(Type::listOf(Type::nonNull(_types()->get('OrderLineInput')))),
            ],
            'resolve' => function ($root, array $args, SessionInterface $session): ?Order {
                global $container;

                /** @var Invoicer $invoicer */
                $invoicer = $container->get(Invoicer::class);
                $order = $invoicer->createOrder(User::getCurrent(), $args['input']);

                _em()->flush();

                return $order;
            },
        ];
    }
}
