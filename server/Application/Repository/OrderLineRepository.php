<?php

declare(strict_types=1);

namespace Application\Repository;

use Application\Model\Order;
use Application\Model\Product;
use Application\Model\User;
use Doctrine\ORM\Query\Expr\Join;
use Doctrine\ORM\QueryBuilder;

class OrderLineRepository extends AbstractRepository implements LimitedAccessSubQueryInterface
{
    /**
     * Returns pure SQL to get ID of all objects that are accessible to given user.
     *
     * @param null|User $user
     *
     * @return string
     */
    public function getAccessibleSubQuery(?User $user): string
    {
        if (!$user) {
            return '-1';
        }

        if (in_array($user->getRole(), [User::ROLE_FACILITATOR, User::ROLE_ADMINISTRATOR], true)) {
            return $this->getAllIdsQuery();
        }

        return $this->getAllIdsForOwnerQuery($user);
    }

    public function createPurchaseQueryBuilder(array $filters, array $sortings): QueryBuilder
    {
        $qbProduct = _types()->createFilteredQueryBuilder(Product::class, $filters, []);

        $qb = $this->createQueryBuilder('orderLine')
            ->addSelect('product')
            ->innerJoin('orderLine.order', 'o', Join::WITH, 'o.status = :status AND o.owner = :user')
            ->innerJoin('orderLine.product', 'product', Join::WITH, 'product.isActive = TRUE')
            ->andWhere('orderLine.product IN (' . $qbProduct->getDQL() . ')')
            ->setParameter('status', Order::STATUS_VALIDATED)
            ->setParameter('user', User::getCurrent());

        // Apply sort on products
        foreach ($sortings as $sorting) {
            $qb->addOrderBy('product.' . $sorting['field'], $sorting['order']);
        }

        return $qb;
    }
}
