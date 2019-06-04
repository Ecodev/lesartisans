<?php

declare(strict_types=1);

namespace Application\Model;

use Application\Traits\HasBalance;
use Application\Traits\HasName;
use Application\Traits\HasQuantity;
use Application\Traits\HasUnit;
use Application\Traits\HasVatPart;
use Application\Traits\HasVatRate;
use Doctrine\ORM\Mapping as ORM;
use GraphQL\Doctrine\Annotation as API;
use Money\Money;

/**
 * A single line in the shopping cart when making an order
 *
 * @ORM\Entity(repositoryClass="Application\Repository\OrderLineRepository")
 */
class OrderLine extends AbstractModel
{
    use HasName;
    use HasUnit;
    use HasQuantity;
    use HasBalance;
    use HasVatRate;
    use HasVatPart;

    /**
     * @var Order
     *
     * @ORM\ManyToOne(targetEntity="Order", inversedBy="orderLines")
     * @ORM\JoinColumns({
     *     @ORM\JoinColumn(nullable=false, onDelete="CASCADE")
     * })
     */
    private $order;

    /**
     * @var null|Product
     *
     * @ORM\ManyToOne(targetEntity="Product")
     * @ORM\JoinColumns({
     *     @ORM\JoinColumn(nullable=true, onDelete="SET NULL")
     * })
     */
    private $product;

    /**
     * @var string
     *
     * @ORM\Column(type="decimal", precision=4, scale=2, options={"unsigned" = true, "default" = "1.00"})
     */
    private $pricePonderation = '1.00';

    /**
     * @var null|StockMovement
     *
     * @ORM\OneToOne(targetEntity="StockMovement", mappedBy="orderLine")
     */
    private $stockMovement;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->vatPart = Money::CHF(0);
    }

    /**
     * @API\Exclude
     *
     * @param Order $order
     */
    public function setOrder(Order $order): void
    {
        if ($this->order) {
            $this->order->orderLineRemoved($this);
        }

        $this->order = $order;
        $order->orderLineAdded($this);
    }

    /**
     * @return Order
     */
    public function getOrder(): Order
    {
        return $this->order;
    }

    /**
     * Get related product, if it still exists in DB
     *
     * @return null|Product
     */
    public function getProduct(): ?Product
    {
        return $this->product;
    }

    /**
     * Set related product
     *
     * @param Product $product
     */
    public function setProduct(Product $product): void
    {
        $this->product = $product;
        $this->setName($product->getName());
        $this->setUnit($product->getUnit());
        $this->setVatRate($product->getVatRate());
    }

    /**
     * Set price ratio ponderation
     *
     * @param string $pricePonderation
     */
    public function setPricePonderation(string $pricePonderation): void
    {
        $this->pricePonderation = $pricePonderation;
    }

    /**
     * @return string
     */
    public function getPricePonderation(): string
    {
        return $this->pricePonderation;
    }

    /**
     * For historical reason very old orderLine may not have a stockMovement
     *
     * @return null|StockMovement
     */
    public function getStockMovement(): ?StockMovement
    {
        return $this->stockMovement;
    }

    /**
     * Notify the orderLine that it has a new stockMovement
     * This should only be called by StockMovement::setOrderLine()
     *
     * @param StockMovement $stockMovement
     */
    public function stockMovementAdded(StockMovement $stockMovement): void
    {
        $this->stockMovement = $stockMovement;
    }
}
