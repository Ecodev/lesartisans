<?php

declare(strict_types=1);

namespace Application\Service;

use Application\Api\Exception;
use Application\Model\User;
use Doctrine\DBAL\Connection;
use Throwable;

/**
 * Service to import users from CSV with maximal performance.
 *
 * Users are never deleted, even though technically they should be, to limit the loss of
 * data in case of human error in the incoming files. Because it could mean losing all historic
 * of purchases.
 *
 * On the other hand, organizations are **always** deleted, because they don't have any related objects,
 * and they are not editable (not even visible) in any way in the app.
 */
class Importer
{
    private int $lineNumber = 0;

    private array $reviewByNumber = [];

    private array $countryByCode = [];

    private Connection $connection;

    private int $updatedUsers = 0;

    private int $updatedOrganizations = 0;

    private int $deletedOrganizations = 0;

    public function import(string $filename): array
    {
        $this->connection = _em()->getConnection();
        $this->fetchReviews();
        $this->fetchCountries();
        $this->updatedUsers = 0;
        $this->updatedOrganizations = 0;
        $this->deletedOrganizations = 0;

        $file = fopen($filename, 'r');
        if ($file === false) {
            throw new Exception('Could not read file: ' . $filename);
        }

        try {
            $this->connection->beginTransaction();
            $this->read($file);
            $this->deleteOldOrganizations();
            $this->connection->commit();
        } catch (Throwable $exception) {
            $this->connection->rollBack();

            throw $exception;
        } finally {
            fclose($file);
        }

        $totalUsers = (int) $this->connection->fetchColumn('SELECT COUNT(*) FROM user');
        $totalOrganizations = (int) $this->connection->fetchColumn('SELECT COUNT(*) FROM organization');

        return [
            'updatedUsers' => $this->updatedUsers,
            'updatedOrganizations' => $this->updatedOrganizations,
            'deletedOrganizations' => $this->deletedOrganizations,
            'totalUsers' => $totalUsers,
            'totalOrganizations' => $totalOrganizations,
            'totalLines' => $this->lineNumber,
        ];
    }

    private function fetchReviews(): void
    {
        $records = $this->connection->fetchAll('SELECT id, review_number FROM product WHERE review_number IS NOT NULL');

        $this->reviewByNumber = [];
        foreach ($records as $r) {
            $this->reviewByNumber[$r['review_number']] = $r['id'];
        }
    }

    private function fetchCountries(): void
    {
        $records = $this->connection->fetchAll('SELECT id, code FROM country');

        $this->countryByCode = [];
        foreach ($records as $r) {
            $this->countryByCode[$r['code']] = $r['id'];
        }
    }

    /**
     * @param resource $file
     */
    private function read($file): void
    {
        $seenEmails = [];
        $currentUser = User::getCurrent() ? User::getCurrent()->getId() : null;

        $this->lineNumber = 0;
        while ($line = fgetcsv($file)) {
            ++$this->lineNumber;

            $expectedColumnCount = 11;
            $actualColumnCount = count($line);
            if ($actualColumnCount !== $expectedColumnCount) {
                $this->throw("Doit avoir exactement $expectedColumnCount colonnes, mais en a " . $actualColumnCount);
            }

            [$email, $lastReviewNumber, $membershipBegin, $membershipEnd, $firstName, $lastName, $street, $postcode, $locality, $country, $phone] = $line;

            $this->assertEmail($seenEmails, $email);
            $lastReviewId = $this->readReviewId($lastReviewNumber);
            $membershipBegin = $this->readDate($membershipBegin);
            $membershipEnd = $this->readDate($membershipEnd);
            $country = $this->readCountryId($country);

            $seenEmails[$email] = $this->lineNumber;

            if ($this->isUser($email)) {
                $sql = 'INSERT INTO user (
                            email,
                            subscription_last_review_id,
                            membership_begin,
                            membership_end,
                            first_name,
                            last_name,
                            street,
                            postcode,
                            locality,
                            country_id,
                            phone,
                            web_temporary_access,
                            creator_id,
                            creation_date
                        )
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
                        ON DUPLICATE KEY UPDATE
                            email = VALUES(email),
                            subscription_last_review_id = VALUES(subscription_last_review_id),
                            membership_begin = VALUES(membership_begin),
                            membership_end = VALUES(membership_end),
                            first_name = VALUES(first_name),
                            last_name = VALUES(last_name),
                            street = VALUES(street),
                            postcode = VALUES(postcode),
                            locality = VALUES(locality),
                            country_id = VALUES(country_id),
                            phone = VALUES(phone),
                            web_temporary_access = VALUES(web_temporary_access),
                            updater_id = VALUES(creator_id),
                            update_date = NOW()';

                $data = [
                    $email,
                    $lastReviewId,
                    $membershipBegin,
                    $membershipEnd,
                    $firstName,
                    $lastName,
                    $street,
                    $postcode,
                    $locality,
                    $country,
                    $phone,
                    false,
                    $currentUser,
                ];

                $changed = $this->connection->executeUpdate($sql, $data);
                if ($changed) {
                    ++$this->updatedUsers;
                }
            } elseif ($this->isOrganization($email)) {
                $sql = 'INSERT INTO organization (pattern, subscription_last_review_id, creator_id, creation_date)
                        VALUES (?, ?, ?, NOW())
                        ON DUPLICATE KEY UPDATE
                        pattern = VALUES(pattern),
                        subscription_last_review_id = VALUES(subscription_last_review_id),
                        updater_id = VALUES(creator_id),
                        update_date = NOW()';

                $changed = $this->connection->executeUpdate($sql, [$email, $lastReviewId, $currentUser]);
                if ($changed) {
                    ++$this->updatedOrganizations;
                }
            } else {
                $this->throw("L'email suivant n'est ni une addresse email valide, ni un expression régulière valide: " . $email);
            }
        }
    }

    private function readDate(string $date): ?string
    {
        if (!$date) {
            return null;
        }

        if (!preg_match('~^\d{4}-\d{2}-\d{2}$~', $date)) {
            $this->throw('La date devrait avoir le format YYYY-MM-DD, mais est: ' . $date);
        }

        return $date;
    }

    private function assertEmail(array $seenEmails, string $email): void
    {
        if (!$email) {
            $this->throw('L\'email ne peut pas être vide');
        }

        if (array_key_exists($email, $seenEmails)) {
            $this->throw('L\'email "' . $email . '" est dupliqué et a déjà été vu à la ligne ' . $seenEmails[$email]);
        }
    }

    private function readReviewId(string $reviewNumber): ?string
    {
        if (!$reviewNumber) {
            return null;
        }

        if ($reviewNumber && !preg_match('~^\d+$~', $reviewNumber)) {
            $this->throw('Un numéro de revue doit être entièrement numérique, mais est: ' . $reviewNumber);
        }

        $reviewNumberNumeric = (int) $reviewNumber;
        if (!array_key_exists($reviewNumberNumeric, $this->reviewByNumber)) {
            $this->throw('Revue introuvable pour le numéro de revue: ' . $reviewNumber);
        }

        return $this->reviewByNumber[$reviewNumberNumeric];
    }

    private function readCountryId(string $country): ?string
    {
        if (!$country) {
            return null;
        }

        if (!array_key_exists($country, $this->countryByCode)) {
            $this->throw('Pays introuvable pour code: ' . $country);
        }

        return $this->countryByCode[$country];
    }

    private function isUser(string $email): bool
    {
        return (bool) filter_var($email, FILTER_VALIDATE_EMAIL);
    }

    private function isOrganization(string $email): bool
    {
        $result = @preg_match('~' . $email . '~', '');

        return $result !== false;
    }

    private function throw(string $message): void
    {
        throw new Exception('A la ligne ' . $this->lineNumber . ': ' . $message);
    }

    private function deleteOldOrganizations(): void
    {
        $sql = 'DELETE FROM organization WHERE
      creation_date IS NULL
      OR (update_date IS NULL AND creation_date < DATE_SUB(NOW(), INTERVAL 30 MINUTE))
      OR (update_date IS NOT NULL AND update_date < DATE_SUB(NOW(), INTERVAL 30 MINUTE))
';
        $this->deletedOrganizations += $this->connection->executeUpdate($sql);
    }
}
