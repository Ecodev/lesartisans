<?php

declare(strict_types=1);

namespace Application\Traits;

use Money\Money;

trait HasVatPart
{
    /**
     * @var Money
     *
     * @ORM\Column(type="Money", options={"default" = 0})
     */
    private $vatPart;

    /**
     * Get amount of VAT
     *
     * No setter, computed by SQL triggers
     *
     * @return Money
     */
    public function getVatPart(): Money
    {
        return $this->vatPart;
    }
}
