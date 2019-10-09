<?php

declare(strict_types=1);

namespace Application\Api;

use Doctrine\ORM\EntityManager;
use GraphQL\Doctrine\Types;
use Interop\Container\ContainerInterface;
use Zend\ServiceManager\ServiceManager;

class TypesFactory
{
    public function __invoke(ContainerInterface $container): Types
    {
        $entityManager = $container->get(EntityManager::class);

        $invokables = [
            \Application\Api\Enum\UserRoleType::class,
            \Application\Api\Enum\MessageTypeType::class,
            \Application\Api\Enum\SubscriptionTypeType::class,
            \Application\Api\Enum\OrderTypeType::class,
            \Application\Api\Input\ConfirmRegistrationInputType::class,
            \Application\Api\Input\PaginationInputType::class,
            \Application\Api\Input\OrderLineInputType::class,
            \Application\Api\MutationType::class,
            \Application\Api\Output\AllPermissionsType::class,
            \Application\Api\Output\BankingInfosType::class,
            \Application\Api\Output\CrudPermissionsListType::class,
            \Application\Api\Output\CrudPermissionsType::class,
            \Application\Api\Output\PermissionsType::class,
            \Application\Api\QueryType::class,
            \Application\Api\Scalar\ColorType::class,
            \Application\Api\Scalar\ChronosType::class,
            \Application\Api\Scalar\DateType::class,
            \Application\Api\Scalar\CHFType::class,
            \Application\Api\Scalar\EURType::class,
            \Application\Api\Scalar\EmailType::class,
            \Application\Api\Scalar\LoginType::class,
            \Application\Api\Scalar\PasswordType::class,
            \Application\Api\Scalar\TokenType::class,
            \GraphQL\Upload\UploadType::class,
        ];

        $aliases = [
            'datetime' => \Application\Api\Scalar\ChronosType::class,
            'date' => \Application\Api\Scalar\DateType::class,
            'UploadedFileInterface' => \GraphQL\Upload\UploadType::class,
            'CHF' => \Application\Api\Scalar\CHFType::class,
            'EUR' => \Application\Api\Scalar\EURType::class,
        ];

        // Automatically add aliases for GraphQL type name from the invokable types
        foreach ($invokables as $type) {
            $parts = explode('\\', $type);
            $alias = preg_replace('~Type$~', '', end($parts));
            $aliases[$alias] = $type;
        }

        $customTypes = new ServiceManager([
            'invokables' => $invokables,
            'aliases' => $aliases,
            'services' => [
//                // This is not quite right because it allow to compare a string with a json array.
//                // TODO: either hide the json_array filter or find a cleaner solution
//                'json_array' => GraphQL\Type\Definition\Type::string(),
            ],
            'abstract_factories' => [
                \Application\Api\Output\PaginationTypeFactory::class,
            ],
        ]);

        $types = new Types($entityManager, $customTypes);

        return $types;
    }
}
