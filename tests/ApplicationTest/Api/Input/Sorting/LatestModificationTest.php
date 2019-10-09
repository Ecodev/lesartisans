<?php

declare(strict_types=1);

namespace ApplicationTest\Api\Input\Sorting;

use Application\Model\Order;
use Application\Model\User;

class LatestModificationTest extends AbstractSorting
{
    public function tearDown(): void
    {
        User::setCurrent(null);
    }

    public function testSorting(): void
    {
        /** @var User $user */
        $user = _em()->getRepository(User::class)->getOneByLogin('member');
        User::setCurrent($user);

        $result = $this->getSortedQueryResult(Order::class, 'latestModification');
        self::assertSame([
            16000,
        ], $result);
    }
}
