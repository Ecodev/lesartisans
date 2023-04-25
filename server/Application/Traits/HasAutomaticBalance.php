<?php

declare(strict_types=1);

namespace Application\Traits;

use Application\Utility;
use Doctrine\ORM\Mapping as ORM;
use GraphQL\Doctrine\Attribute as API;
use Money\Money;

trait HasAutomaticBalance
{
    /**
     * @var Money
     */
    #[ORM\Column(type: 'CHF', options: ['default' => 0])]
    private $balanceCHF;

    /**
     * @var Money
     */
    #[ORM\Column(type: 'EUR', options: ['default' => 0])]
    private $balanceEUR;

    /**
     * Get total balance.
     *
     * Read only, computed by SQL triggers
     */
    #[API\Field(type: 'CHF')]
    public function getBalanceCHF(): Money
    {
        return $this->balanceCHF;
    }

    /**
     * Get total balance.
     *
     * Read only, computed by SQL triggers
     */
    #[API\Field(type: 'EUR')]
    public function getBalanceEUR(): Money
    {
        return $this->balanceEUR;
    }

    /**
     * Returns the non-zero balance formatted as string.
     */
    public function getFormattedBalance(): string
    {
        return Utility::getFormattedBalance($this);
    }
}
