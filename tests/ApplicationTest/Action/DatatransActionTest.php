<?php

declare(strict_types=1);

namespace ApplicationTest\Action;

use Application\Action\DatatransAction;
use Application\Model\User;
use ApplicationTest\Traits\TestWithTransaction;
use Laminas\Diactoros\ServerRequest;
use Mezzio\Template\TemplateRendererInterface;
use Money\Money;
use PHPUnit\Framework\TestCase;
use Psr\Http\Server\RequestHandlerInterface;

class DatatransActionTest extends TestCase
{
    use TestWithTransaction;

    /**
     * @dataProvider providerProcess
     */
    public function testProcess(?array $data, ?int $accountId, Money $expectedAmount, array $expectedViewModel): void
    {
        $this->markTestSkipped('TODO figure out the payment workflow and adapt test and implementation');

        $userId = $data['refno'] ?? null;
        $user = _em()->getRepository(User::class)->getOneById((int) $userId);
        User::setCurrent($user);

        // Message always include input data
        $expectedViewModel['message']['detail'] = $data;
        $renderer = $this->prophesize(TemplateRendererInterface::class);
        $renderer->render('app::datatrans', $expectedViewModel);

        $handler = $this->prophesize(RequestHandlerInterface::class);

        $request = new ServerRequest();
        $request = $request->withParsedBody($data);

        $action = new DatatransAction(_em(), $renderer->reveal());
        $action->process($request, $handler->reveal());

        if ($accountId) {
            $actualBalance = _em()->getConnection()->fetchColumn('SELECT balance FROM account WHERE id = ' . $accountId);
            self::assertSame($expectedAmount->getAmount(), $actualBalance);
        }

        self::assertTrue(true); // Workaround when we only assert via prophesize
    }

    public function providerProcess(): array
    {
        return [
            'normal' => [
                [
                    'uppTransactionId' => '123456789012345678',
                    'status' => 'success',
                    'refno' => '1007',
                    'amount' => '10000',
                    'currency' => 'CHF',
                    'responseMessage' => 'Payment was successful',
                ],
                10902,
                Money::CHF(31020),
                [
                    'message' => [
                        'status' => 'success',
                        'message' => 'Payment was successful',
                    ],
                ],
            ],
            'user without account yet' => [
                [
                    'uppTransactionId' => '123456789012345678',
                    'status' => 'success',
                    'refno' => '1008',
                    'amount' => '10000',
                    'currency' => 'CHF',
                    'responseMessage' => 'Payment was successful',
                ],
                10902,
                Money::CHF(31020),
                [
                    'message' => [
                        'status' => 'success',
                        'message' => 'Payment was successful',
                    ],
                ],
            ],
            'error' => [
                [
                    'uppTransactionId' => '876543210987654321',
                    'status' => 'error',
                    'refno' => '1007',
                    'errorMessage' => 'Dear Sir/Madam, Fire! fire! help me! All the best, Maurice Moss.',
                ],
                10902,
                Money::CHF(21020),
                [
                    'message' => [
                        'status' => 'error',
                        'message' => 'Dear Sir/Madam, Fire! fire! help me! All the best, Maurice Moss.',
                    ],
                ],
            ],
            'cancel' => [
                [
                    'uppTransactionId' => '876543210987654321',
                    'status' => 'cancel',
                    'refno' => '1007',
                ],
                10902,
                Money::CHF(21020),
                [
                    'message' => [
                        'status' => 'cancel',
                        'message' => 'Cancelled',
                    ],
                ],
            ],
            'invalid body' => [
                null,
                null,
                Money::CHF(21020),
                [
                    'message' => [
                        'status' => 'error',
                        'message' => 'Parsed body is expected to be an array but got: NULL',
                    ],
                ],
            ],
            'invalid status' => [
                [
                    'uppTransactionId' => '123456789012345678',
                    'status' => 'non-existing-status',
                    'refno' => '1007',
                    'amount' => '10000',
                    'currency' => 'CHF',
                    'responseMessage' => 'Payment was successful',
                ],
                10902,
                Money::CHF(21020),
                [
                    'message' => [
                        'status' => 'error',
                        'message' => 'Unsupported status in Datatrans data: non-existing-status',
                    ],
                ],
            ],
            'non-existing user' => [
                [
                    'uppTransactionId' => '123456789012345678',
                    'status' => 'success',
                    'amount' => '10000',
                    'currency' => 'CHF',
                    'responseMessage' => 'Payment was successful',
                ],
                10902,
                Money::CHF(21020),
                [
                    'message' => [
                        'status' => 'error',
                        'message' => 'Cannot create transactions without a user',
                    ],
                ],
            ],
            'non-existing amount' => [
                [
                    'uppTransactionId' => '123456789012345678',
                    'status' => 'success',
                    'refno' => '1007',
                    'currency' => 'CHF',
                    'responseMessage' => 'Payment was successful',
                ],
                10902,
                Money::CHF(21020),
                [
                    'message' => [
                        'status' => 'error',
                        'message' => 'Cannot create transactions without an amount',
                    ],
                ],
            ],
            'invalid currency' => [
                [
                    'uppTransactionId' => '123456789012345678',
                    'status' => 'success',
                    'refno' => '1007',
                    'amount' => '10000',
                    'currency' => 'USD',
                    'responseMessage' => 'Payment was successful',
                ],
                10902,
                Money::CHF(21020),
                [
                    'message' => [
                        'status' => 'error',
                        'message' => 'Can only create transactions for CHF, but got: USD',
                    ],
                ],
            ],
        ];
    }
}
