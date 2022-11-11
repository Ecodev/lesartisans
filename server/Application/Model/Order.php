<?php

declare(strict_types=1);

namespace Application\Model;

use Application\Traits\HasAddress;
use Application\Traits\HasAutomaticBalance;
use Application\Traits\HasBalanceInterface;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Ecodev\Felix\Model\Traits\HasInternalRemarks;
use GraphQL\Doctrine\Annotation as API;
use Money\Money;

/**
 * An order made by a users.
 *
 * @ORM\Entity(repositoryClass="Application\Repository\OrderRepository")
 * @ORM\Table(name="`order`")
 */
class Order extends AbstractModel implements HasBalanceInterface
{
    final public const STATUS_PENDING = 'pending';
    final public const STATUS_VALIDATED = 'validated';
    final public const STATUS_CANCELED = 'canceled';

    use HasAddress;
    use HasAutomaticBalance;
    use HasInternalRemarks;

    /**
     * @ORM\Column(type="OrderStatus", options={"default" = Order::STATUS_PENDING})
     */
    private string $status = self::STATUS_PENDING;

    /**
     * @var Collection<OrderLine>
     *
     * @ORM\OneToMany(targetEntity="OrderLine", mappedBy="order")
     */
    private Collection $orderLines;

    /**
     * @ORM\Column(type="PaymentMethod")
     */
    private string $paymentMethod;

    /**
     * @param string $status status for new order
     */
    public function __construct(string $status = self::STATUS_PENDING)
    {
        $this->status = $status;
        $this->orderLines = new ArrayCollection();
        $this->balanceCHF = Money::CHF(0);
        $this->balanceEUR = Money::EUR(0);
    }

    /**
     * Notify when a order line is added
     * This should only be called by OrderLine::setOrder().
     */
    public function orderLineAdded(OrderLine $orderLine): void
    {
        $this->orderLines->add($orderLine);
    }

    /**
     * Notify when a order line is removed
     * This should only be called by OrderLine::setOrder().
     */
    public function orderLineRemoved(OrderLine $orderLine): void
    {
        $this->orderLines->removeElement($orderLine);
    }

    public function getOrderLines(): Collection
    {
        return $this->orderLines;
    }

    /**
     * @API\Field(type="OrderStatus")
     */
    public function getStatus(): string
    {
        return $this->status;
    }

    /**
     * @API\Input(type="OrderStatusType")
     */
    public function setStatus(string $status): void
    {
        // If we change from non-confirmed to confirmed, then give temporary access (until explicit import of users)
        if ($this->status !== self::STATUS_VALIDATED && $status === self::STATUS_VALIDATED) {
            /** @var OrderLine $orderLine */
            foreach ($this->getOrderLines() as $orderLine) {
                $orderLine->maybeGiveTemporaryAccess();
            }
        }

        $this->status = $status;
    }

    /**
     * @API\Field(type="PaymentMethod")
     */
    public function getPaymentMethod(): string
    {
        return $this->paymentMethod;
    }

    /**
     * @API\Input(type="PaymentMethod")
     */
    public function setPaymentMethod(string $paymentMethod): void
    {
        $this->paymentMethod = $paymentMethod;
    }

    /**
     * Return whether there is at least one subscription in the order.
     *
     * @API\Exclude
     */
    public function hasSubscription(): bool
    {
        /** @var OrderLine $line */
        foreach ($this->getOrderLines() as $line) {
            if ($line->getSubscription()) {
                return true;
            }
        }

        return false;
    }
}
