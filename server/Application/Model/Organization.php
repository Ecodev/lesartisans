<?php

declare(strict_types=1);

namespace Application\Model;

use Application\Traits\HasSubscriptionLastReview;
use Doctrine\ORM\Mapping as ORM;

/**
 * An organization
 *
 * The sole purpose of an organization is to define a pattern that can match email address.
 * When a user is created with a matching email, then he will inherit access from that organization.
 *
 * This only concern digital version, never paper.
 *
 * @ORM\Entity(repositoryClass="Application\Repository\OrganizationRepository")
 */
class Organization extends AbstractModel
{
    use HasSubscriptionLastReview;

    /**
     * A regexp pattern that match email address
     *
     * @var string
     * @ORM\Column(type="string", length=191, unique=true)
     */
    private $pattern;

    public function __construct()
    {
    }

    /**
     * @param string $pattern
     *
     * @return Organization
     */
    public function setPattern(string $pattern): self
    {
        $this->pattern = $pattern;

        return $this;
    }
}
