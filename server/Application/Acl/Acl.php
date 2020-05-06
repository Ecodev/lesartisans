<?php

declare(strict_types=1);

namespace Application\Acl;

use Application\Acl\Assertion\IsMyself;
use Application\Model\AbstractModel;
use Application\Model\Comment;
use Application\Model\Configuration;
use Application\Model\Country;
use Application\Model\Event;
use Application\Model\File;
use Application\Model\Image;
use Application\Model\Message;
use Application\Model\News;
use Application\Model\Order;
use Application\Model\OrderLine;
use Application\Model\Organization;
use Application\Model\Product;
use Application\Model\ProductTag;
use Application\Model\Session;
use Application\Model\Subscription;
use Application\Model\User;
use Doctrine\Common\Util\ClassUtils;

class Acl extends \Laminas\Permissions\Acl\Acl
{
    /**
     * The message explaining the last denial
     *
     * @var null|string
     */
    private $message;

    /**
     * @var null|string
     */
    private $reason;

    public function __construct()
    {
        // Each role is strictly "stronger" than the last one
        $this->addRole(User::ROLE_ANONYMOUS);
        $this->addRole(User::ROLE_MEMBER, User::ROLE_ANONYMOUS);
        $this->addRole(User::ROLE_FACILITATOR, User::ROLE_MEMBER);
        $this->addRole(User::ROLE_ADMINISTRATOR, User::ROLE_FACILITATOR);

        $comment = new ModelResource(Comment::class);
        $configuration = new ModelResource(Configuration::class);
        $country = new ModelResource(Country::class);
        $event = new ModelResource(Event::class);
        $file = new ModelResource(File::class);
        $image = new ModelResource(Image::class);
        $message = new ModelResource(Message::class);
        $news = new ModelResource(News::class);
        $order = new ModelResource(Order::class);
        $orderLine = new ModelResource(OrderLine::class);
        $organization = new ModelResource(Organization::class);
        $product = new ModelResource(Product::class);
        $productTag = new ModelResource(ProductTag::class);
        $session = new ModelResource(Session::class);
        $subscription = new ModelResource(Subscription::class);
        $user = new ModelResource(User::class);

        $this->addResource($comment);
        $this->addResource($configuration);
        $this->addResource($country);
        $this->addResource($event);
        $this->addResource($file);
        $this->addResource($image);
        $this->addResource($message);
        $this->addResource($news);
        $this->addResource($order);
        $this->addResource($orderLine);
        $this->addResource($organization);
        $this->addResource($product);
        $this->addResource($productTag);
        $this->addResource($session);
        $this->addResource($subscription);
        $this->addResource($user);

        $this->allow(User::ROLE_ANONYMOUS, [$configuration, $event, $news, $session, $product, $subscription, $productTag, $image, $country, $comment], ['read']);

        $this->allow(User::ROLE_MEMBER, [$user], ['read']);
        $this->allow(User::ROLE_MEMBER, [$user], ['update'], new IsMyself());
        $this->allow(User::ROLE_MEMBER, [$file], ['read']);
        $this->allow(User::ROLE_MEMBER, [$message], ['read']);
        $this->allow(User::ROLE_MEMBER, [$order, $orderLine], ['read']);
        $this->allow(User::ROLE_MEMBER, [$order], ['create']);
        $this->allow(User::ROLE_MEMBER, [$comment], ['create']); // if grant update, care to GUI button that sends to admin

        $this->allow(User::ROLE_FACILITATOR, [$file], ['read', 'update']);
        $this->allow(User::ROLE_FACILITATOR, [$user], ['create', 'update']);

        $this->allow(User::ROLE_ADMINISTRATOR, [$file, $event, $news, $session, $subscription, $product, $productTag, $country, $image, $comment], ['create', 'update', 'delete']);
        $this->allow(User::ROLE_ADMINISTRATOR, [$orderLine], ['update']);
        $this->allow(User::ROLE_ADMINISTRATOR, [$configuration, $organization], ['create']);
    }

    /**
     * Return whether the current user is allowed to do something
     *
     * This should be the main method to do all ACL checks.
     *
     * @param AbstractModel $model
     * @param string $privilege
     *
     * @return bool
     */
    public function isCurrentUserAllowed(AbstractModel $model, string $privilege): bool
    {
        $resource = new ModelResource($this->getClass($model), $model);
        $role = $this->getCurrentRole();
        $this->reason = null;

        $isAllowed = $this->isAllowed($role, $resource, $privilege);

        $this->message = $this->buildMessage($resource, $privilege, $role, $isAllowed);

        return $isAllowed;
    }

    /**
     * Set the reason for rejection that will be shown to end-user
     *
     * This method always return false for usage convenience and should be used by all assertions,
     * instead of only return false themselves.
     *
     * @param string $reason
     *
     * @return false
     */
    public function reject(string $reason): bool
    {
        $this->reason = $reason;

        return false;
    }

    private function getClass(AbstractModel $resource): string
    {
        return ClassUtils::getRealClass(get_class($resource));
    }

    private function getCurrentRole(): string
    {
        $user = User::getCurrent();
        if (!$user) {
            return User::ROLE_ANONYMOUS;
        }

        return $user->getRole();
    }

    private function buildMessage($resource, ?string $privilege, string $role, bool $isAllowed): ?string
    {
        if ($isAllowed) {
            return null;
        }

        if ($resource instanceof ModelResource) {
            $resource = $resource->getName();
        }

        $user = User::getCurrent() ? 'User "' . User::getCurrent()->getName() . '"' : 'Non-logged user';
        $privilege = $privilege === null ? 'NULL' : $privilege;

        $message = "$user with role $role is not allowed on resource \"$resource\" with privilege \"$privilege\"";

        if ($this->reason) {
            $message .= ' because ' . $this->reason;
        }

        return $message;
    }

    /**
     * Returns the message explaining the last denial, if any
     *
     * @return null|string
     */
    public function getLastDenialMessage(): ?string
    {
        return $this->message;
    }
}
