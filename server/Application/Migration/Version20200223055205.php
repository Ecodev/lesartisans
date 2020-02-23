<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;

class Version20200223055205 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE message CHANGE type type ENUM(\'register\', \'unregister\', \'reset_password\', \'updated_user\', \'confirmed_registration\', \'user_pending_order\', \'user_validated_order\', \'admin_pending_order\', \'admin_validated_order\') NOT NULL COMMENT \'(DC2Type:MessageType)\'');
    }
}
