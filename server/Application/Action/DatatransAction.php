<?php

declare(strict_types=1);

namespace Application\Action;

use Application\Model\Order;
use Application\Repository\OrderRepository;
use Doctrine\ORM\EntityManager;
use Laminas\Diactoros\Response\HtmlResponse;
use Mezzio\Template\TemplateRendererInterface;
use Money\Currencies\ISOCurrencies;
use Money\Formatter\DecimalMoneyFormatter;
use Money\Money;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;

class DatatransAction extends AbstractAction
{
    /** @var TemplateRendererInterface */
    private $template;

    /**
     * @var EntityManager
     */
    private $entityManager;

    /**
     * @var array
     */
    private $config;

    public function __construct(EntityManager $entityManager, TemplateRendererInterface $template, array $config)
    {
        $this->entityManager = $entityManager;
        $this->template = $template;
        $this->config = $config;
    }

    /**
     * Webhook called by datatrans when a payment was made
     *
     * See documentation: https://api-reference.datatrans.ch/#failed-unsuccessful-authorization-response
     *
     * @param ServerRequestInterface $request
     * @param RequestHandlerInterface $handler
     *
     * @return ResponseInterface
     */
    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $request->getMethod();
        $body = $request->getParsedBody();

        try {
            if (!is_array($body)) {
                throw new \Exception('Parsed body is expected to be an array but got: ' . gettype($body));
            }

            if (isset($this->config['key'])) {
                $this->checkSignature($body, $this->config['key']);
            }
            $status = $body['status'] ?? '';

            $message = $this->dispatch($status, $body);
        } catch (\Throwable $exception) {
            $message = $this->createMessage('error', $exception->getMessage(), is_array($body) ? $body : []);
        }

        $viewModel = [
            'message' => $message,
        ];

        return new HtmlResponse($this->template->render('app::datatrans', $viewModel));
    }

    /**
     * Make sure the signature protecting important body fields is valid
     *
     * @param array $body
     * @param string $key HMAC-SHA256 signing key in hexadecimal format
     *
     * @throws \Exception
     */
    private function checkSignature(array $body, string $key): void
    {
        if (!isset($body['sign'])) {
            throw new \Exception('Missing HMAC signature');
        }

        $aliasCC = $body['aliasCC'] ?? '';
        $valueToSign = $aliasCC . @$body['merchantId'] . @$body['amount'] . @$body['currency'] . @$body['refno'];
        $expectedSign = hash_hmac('sha256', trim($valueToSign), hex2bin(trim($key)));
        if ($expectedSign !== $body['sign']) {
            throw new \Exception('Invalid HMAC signature');
        }
    }

    /**
     * Create a message in a coherent way
     *
     * @param string $status
     * @param string $message
     * @param array $detail
     *
     * @return array
     */
    private function createMessage(string $status, string $message, array $detail): array
    {
        return [
            'status' => $status,
            'message' => $message,
            'detail' => $detail,
        ];
    }

    /**
     * Dispatch the data received from Datatrans to take appropriate actions
     *
     * @param string $status
     * @param array $body
     *
     * @return array
     */
    private function dispatch(string $status, array $body): array
    {
        switch ($status) {
            case 'success':
                $this->validateOrder($body);
                $message = $this->createMessage($status, $body['responseMessage'], $body);

                break;
            case 'error':
                $message = $this->createMessage($status, $body['errorMessage'], $body);

                break;
            case 'cancel':
                $message = $this->createMessage($status, 'Cancelled', $body);

                break;
            default:
                throw new \Exception('Unsupported status in Datatrans data: ' . $status);
        }

        return $message;
    }

    private function validateOrder(array $body): void
    {
        $orderId = $body['refno'] ?? null;

        /** @var OrderRepository $orderRepository */
        $orderRepository = $this->entityManager->getRepository(Order::class);

        /** @var null|Order $order */
        $order = $orderRepository->getAclFilter()->runWithoutAcl(function () use ($orderRepository, $orderId) {
            return $orderRepository->findOneById($orderId);
        });

        if (!$order) {
            throw new \Exception('Cannot validate an order without a valid order ID');
        }

        if ($order->getPaymentMethod() !== \Application\DBAL\Types\PaymentMethodType::DATATRANS) {
            throw new \Exception('Cannot validate an order whose payment method is: ' . $order->getPaymentMethod());
        }

        if ($order->getStatus() === Order::STATUS_VALIDATED) {
            throw new \Exception('Cannot validate an order which is already validated');
        }

        $money = $this->getMoney($body);

        if (!$order->getBalanceCHF()->equals($money) && !$order->getBalanceEUR()->equals($money)) {
            $expectedCHF = $this->formatMoney($order->getBalanceCHF());
            $expectedEUR = $this->formatMoney($order->getBalanceEUR());
            $actual = $this->formatMoney($money);

            throw new \Exception("Cannot validate an order with incorrect balance. Expected $expectedCHF, or $expectedEUR, but got: " . $actual);
        }

        // Actually validate
        $order->setStatus(Order::STATUS_VALIDATED);
        $order->setInternalRemarks(json_encode($body, JSON_PRETTY_PRINT));

        $this->entityManager->flush();
    }

    private function formatMoney(Money $money): string
    {
        $currencies = new ISOCurrencies();
        $moneyFormatter = new DecimalMoneyFormatter($currencies);

        return $moneyFormatter->format($money) . ' ' . $money->getCurrency()->getCode();
    }

    private function getMoney(array $body): Money
    {
        if (!array_key_exists('amount', $body)) {
            // Do not support "registrations"
            throw new \Exception('Cannot validate an order without an amount');
        }
        $amount = $body['amount'];

        $currency = $body['currency'] ?? '';
        if ($currency === 'CHF') {
            return Money::CHF($amount);
        }

        if ($currency === 'EUR') {
            return Money::EUR($amount);
        }

        throw new \Exception('Can only accept payment in CHF or EUR, but got: ' . $currency);
    }
}
