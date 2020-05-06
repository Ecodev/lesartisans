<?php

declare(strict_types=1);

namespace ApplicationTest\Service;

use Application\Service\Importer;
use ApplicationTest\Traits\TestWithTransaction;
use PHPUnit\Framework\TestCase;

class ImporterTest extends TestCase
{
    use TestWithTransaction;

    public function testInvalidEmail(): void
    {
        $this->expectErrorMessage("A la ligne 1: Ce n'est pas une addresse email valide: fo[o");
        $this->import('tests/data/importer/invalid-email.csv');
    }

    public function testInvalidMembership(): void
    {
        $this->expectErrorMessage('A la ligne 1: Le membership aux artisans est invalide: foo');
        $this->import('tests/data/importer/invalid-membership.csv');
    }

    public function testInvalidEmpty(): void
    {
        $this->expectErrorMessage('A la ligne 1: Il faut soit un email, soit un pattern, mais aucun existe');
        $this->import('tests/data/importer/invalid-empty.csv');
    }

    public function testInvalidDuplicatedEmail(): void
    {
        $this->expectErrorMessage("A la ligne 3: L'email \"foo@example.com\" est dupliqué et a déjà été vu à la ligne 1");
        $this->import('tests/data/importer/invalid-duplicated-email.csv');
    }

    public function testInvalidReviewNumber(): void
    {
        $this->expectErrorMessage('A la ligne 1: Un numéro de revue doit être entièrement numérique, mais est: foo');
        $this->import('tests/data/importer/invalid-review-number.csv');
    }

    public function testInvalidMissingReviewNumber(): void
    {
        $this->expectErrorMessage('A la ligne 1: Revue introuvable pour le numéro de revue: 123');
        $this->import('tests/data/importer/invalid-missing-review-number.csv');
    }

    public function testInvalidColumnCount(): void
    {
        $this->expectErrorMessage('A la ligne 1: Doit avoir exactement 11 colonnes, mais en a 5');
        $this->import('tests/data/importer/invalid-column-count.csv');
    }

    public function testImport(): void
    {
        $this->assertUser([
            'email' => 'member@example.com',
            'first_name' => 'Hector',
            'subscription_last_review_id' => null,
            'membership' => 'none',
            'web_temporary_access' => '0',
            'password' => 'aa08769cdcb26674c6706093503ff0a3',
        ]);

        $otherMember = [
            'email' => 'othermember@example.com',
            'first_name' => 'Elizabeth',
            'subscription_last_review_id' => '3001',
            'membership' => 'payed',
            'web_temporary_access' => '0',
            'password' => '1895eaf4aad48bd97ec1a2fd15336591',
        ];
        $this->assertUser($otherMember);

        $actual = $this->import('tests/data/importer/normal.csv');

        self::assertArrayHasKey('time', $actual);
        unset($actual['time']);

        $expected = [
            'updatedUsers' => 4,
            'updatedOrganizations' => 1,
            'deletedOrganizations' => 2,
            'totalUsers' => 6,
            'totalOrganizations' => 1,
            'totalLines' => 5,
        ];
        self::assertSame($expected, $actual);

        $this->assertUser([
            'email' => 'new@example.com',
            'first_name' => '',
            'subscription_last_review_id' => null,
            'membership' => 'none',
            'web_temporary_access' => '0',
            'password' => '',
        ]);

        $this->assertUser([
            'email' => 'new.with.everything@example.com',
            'first_name' => '',
            'subscription_last_review_id' => '3000',
            'membership' => 'due',
            'web_temporary_access' => '0',
            'password' => '',
        ]);

        $this->assertUser([
            'email' => 'member@example.com',
            'first_name' => 'Roger "Bob"',
            'subscription_last_review_id' => null,
            'membership' => 'payed',
            'web_temporary_access' => '0',
            'password' => 'aa08769cdcb26674c6706093503ff0a3',
        ]);

        $this->assertOrganization([
            'pattern' => '.*@university.com',
            'subscription_last_review_id' => '3001',
        ]);

        // Unchanged
        $this->assertUser($otherMember);
    }

    private function assertUser(array $expected): void
    {
        $connection = $this->getEntityManager()->getConnection();
        $actual = $connection->fetchAssoc('SELECT email, first_name, subscription_last_review_id, membership, web_temporary_access, password FROM user WHERE email = ?', [$expected['email']]);
        self::assertSame($expected, $actual);
    }

    private function assertOrganization(array $expected): void
    {
        $connection = $this->getEntityManager()->getConnection();
        $actual = $connection->fetchAssoc('SELECT pattern, subscription_last_review_id FROM organization WHERE pattern = ?', [$expected['pattern']]);
        self::assertSame($expected, $actual);
    }

    private function import(string $filename): array
    {
        $importer = new Importer();
        $actual = $importer->import($filename);

        return $actual;
    }
}
