<?php

declare(strict_types=1);

namespace Application\Migration;

use Doctrine\DBAL\Schema\Schema;

class Version20191009020258 extends AbstractMigration
{
    public function up(Schema $schema): void
    {
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE log (id INT AUTO_INCREMENT NOT NULL, creator_id INT DEFAULT NULL, owner_id INT DEFAULT NULL, updater_id INT DEFAULT NULL, creation_date DATETIME DEFAULT NULL, update_date DATETIME DEFAULT NULL, priority SMALLINT NOT NULL, message VARCHAR(5000) NOT NULL, referer VARCHAR(500) NOT NULL, request VARCHAR(1000) NOT NULL, ip VARCHAR(40) NOT NULL, extra LONGTEXT NOT NULL COMMENT \'(DC2Type:json_array)\', url VARCHAR(2000) DEFAULT \'\' NOT NULL, INDEX IDX_8F3F68C561220EA6 (creator_id), INDEX IDX_8F3F68C57E3C61F9 (owner_id), INDEX IDX_8F3F68C5E37ECFB0 (updater_id), INDEX priority (creation_date), INDEX date_created (creation_date), INDEX message (message), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user (id INT AUTO_INCREMENT NOT NULL, creator_id INT DEFAULT NULL, owner_id INT DEFAULT NULL, updater_id INT DEFAULT NULL, creation_date DATETIME DEFAULT NULL, update_date DATETIME DEFAULT NULL, login VARCHAR(50) DEFAULT NULL, first_name VARCHAR(191) DEFAULT \'\' NOT NULL, last_name VARCHAR(191) DEFAULT \'\' NOT NULL, password VARCHAR(255) NOT NULL, email VARCHAR(191) DEFAULT NULL, role ENUM(\'member\', \'facilitator\', \'administrator\') DEFAULT \'member\' NOT NULL COMMENT \'(DC2Type:UserRole)\', membership_begin DATETIME DEFAULT NULL, membership_end DATETIME DEFAULT NULL, phone VARCHAR(25) DEFAULT \'\' NOT NULL, restrict_renew_visibility TINYINT(1) DEFAULT \'0\' NOT NULL, token VARCHAR(32) DEFAULT NULL, token_creation_date DATETIME DEFAULT NULL, internal_remarks TEXT NOT NULL, street VARCHAR(255) DEFAULT \'\' NOT NULL, postcode VARCHAR(20) DEFAULT \'\' NOT NULL, locality VARCHAR(255) DEFAULT \'\' NOT NULL, code INT UNSIGNED DEFAULT NULL, url VARCHAR(2000) DEFAULT \'\' NOT NULL, UNIQUE INDEX UNIQ_8D93D649AA08CB10 (login), UNIQUE INDEX UNIQ_8D93D649E7927C74 (email), UNIQUE INDEX UNIQ_8D93D6495F37A13B (token), UNIQUE INDEX UNIQ_8D93D64977153098 (code), INDEX IDX_8D93D64961220EA6 (creator_id), INDEX IDX_8D93D6497E3C61F9 (owner_id), INDEX IDX_8D93D649E37ECFB0 (updater_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user_tag (id INT AUTO_INCREMENT NOT NULL, creator_id INT DEFAULT NULL, owner_id INT DEFAULT NULL, updater_id INT DEFAULT NULL, creation_date DATETIME DEFAULT NULL, update_date DATETIME DEFAULT NULL, name VARCHAR(191) NOT NULL, color VARCHAR(7) DEFAULT \'\' NOT NULL, INDEX IDX_E89FD60861220EA6 (creator_id), INDEX IDX_E89FD6087E3C61F9 (owner_id), INDEX IDX_E89FD608E37ECFB0 (updater_id), UNIQUE INDEX unique_name (name), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user_tag_user (user_tag_id INT NOT NULL, user_id INT NOT NULL, INDEX IDX_83118DFFDF80782C (user_tag_id), INDEX IDX_83118DFFA76ED395 (user_id), PRIMARY KEY(user_tag_id, user_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE message (id INT AUTO_INCREMENT NOT NULL, creator_id INT DEFAULT NULL, owner_id INT DEFAULT NULL, updater_id INT DEFAULT NULL, recipient_id INT DEFAULT NULL, creation_date DATETIME DEFAULT NULL, update_date DATETIME DEFAULT NULL, email VARCHAR(191) NOT NULL, type ENUM(\'register\', \'unregister\', \'reset_password\', \'balance\') NOT NULL COMMENT \'(DC2Type:MessageType)\', date_sent DATETIME DEFAULT NULL, subject VARCHAR(255) DEFAULT \'\' NOT NULL, body TEXT NOT NULL, INDEX IDX_B6BD307F61220EA6 (creator_id), INDEX IDX_B6BD307F7E3C61F9 (owner_id), INDEX IDX_B6BD307FE37ECFB0 (updater_id), INDEX IDX_B6BD307FE92F8F78 (recipient_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE image (id INT AUTO_INCREMENT NOT NULL, creator_id INT DEFAULT NULL, owner_id INT DEFAULT NULL, updater_id INT DEFAULT NULL, creation_date DATETIME DEFAULT NULL, update_date DATETIME DEFAULT NULL, filename VARCHAR(190) DEFAULT \'\' NOT NULL, mime VARCHAR(255) DEFAULT \'\' NOT NULL, width INT NOT NULL, height INT NOT NULL, INDEX IDX_C53D045F61220EA6 (creator_id), INDEX IDX_C53D045F7E3C61F9 (owner_id), INDEX IDX_C53D045FE37ECFB0 (updater_id), UNIQUE INDEX unique_name (filename), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE configuration (id INT AUTO_INCREMENT NOT NULL, creator_id INT DEFAULT NULL, owner_id INT DEFAULT NULL, updater_id INT DEFAULT NULL, creation_date DATETIME DEFAULT NULL, update_date DATETIME DEFAULT NULL, `key` VARCHAR(191) NOT NULL, value LONGTEXT NOT NULL, description TEXT NOT NULL, UNIQUE INDEX UNIQ_A5E2A5D78A90ABA9 (`key`), INDEX IDX_A5E2A5D761220EA6 (creator_id), INDEX IDX_A5E2A5D77E3C61F9 (owner_id), INDEX IDX_A5E2A5D7E37ECFB0 (updater_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE session (id INT AUTO_INCREMENT NOT NULL, creator_id INT DEFAULT NULL, owner_id INT DEFAULT NULL, updater_id INT DEFAULT NULL, creation_date DATETIME DEFAULT NULL, update_date DATETIME DEFAULT NULL, place VARCHAR(255) DEFAULT \'\' NOT NULL, price VARCHAR(255) DEFAULT \'\' NOT NULL, availability VARCHAR(255) DEFAULT \'\' NOT NULL, dates LONGTEXT NOT NULL COMMENT \'(DC2Type:json)\', name VARCHAR(191) NOT NULL, description TEXT NOT NULL, INDEX IDX_D044D5D461220EA6 (creator_id), INDEX IDX_D044D5D47E3C61F9 (owner_id), INDEX IDX_D044D5D4E37ECFB0 (updater_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE product (id INT AUTO_INCREMENT NOT NULL, creator_id INT DEFAULT NULL, owner_id INT DEFAULT NULL, updater_id INT DEFAULT NULL, image_id INT DEFAULT NULL, creation_date DATETIME DEFAULT NULL, update_date DATETIME DEFAULT NULL, price_per_unit_chf INT DEFAULT 0.00 NOT NULL COMMENT \'(DC2Type:CHF)\', price_per_unit_eur INT DEFAULT 0.00 NOT NULL COMMENT \'(DC2Type:EUR)\', is_active TINYINT(1) DEFAULT \'1\' NOT NULL, name VARCHAR(191) NOT NULL, description TEXT NOT NULL, code VARCHAR(20) DEFAULT NULL, internal_remarks TEXT NOT NULL, reading_duration SMALLINT UNSIGNED DEFAULT NULL, release_date DATE NOT NULL, review_number SMALLINT UNSIGNED NOT NULL, UNIQUE INDEX UNIQ_D34A04AD77153098 (code), INDEX IDX_D34A04AD61220EA6 (creator_id), INDEX IDX_D34A04AD7E3C61F9 (owner_id), INDEX IDX_D34A04ADE37ECFB0 (updater_id), UNIQUE INDEX UNIQ_D34A04AD3DA5256D (image_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE `order` (id INT AUTO_INCREMENT NOT NULL, creator_id INT DEFAULT NULL, owner_id INT DEFAULT NULL, updater_id INT DEFAULT NULL, creation_date DATETIME DEFAULT NULL, update_date DATETIME DEFAULT NULL, balance_chf INT DEFAULT 0 NOT NULL COMMENT \'(DC2Type:CHF)\', balance_eur INT DEFAULT 0 NOT NULL COMMENT \'(DC2Type:EUR)\', INDEX IDX_F529939861220EA6 (creator_id), INDEX IDX_F52993987E3C61F9 (owner_id), INDEX IDX_F5299398E37ECFB0 (updater_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE order_line (id INT AUTO_INCREMENT NOT NULL, creator_id INT DEFAULT NULL, owner_id INT DEFAULT NULL, updater_id INT DEFAULT NULL, order_id INT NOT NULL, product_id INT DEFAULT NULL, subscription_id INT DEFAULT NULL, creation_date DATETIME DEFAULT NULL, update_date DATETIME DEFAULT NULL, name VARCHAR(191) NOT NULL, quantity NUMERIC(10, 3) DEFAULT \'0.00\' NOT NULL, is_chf TINYINT(1) DEFAULT \'1\' NOT NULL, balance_chf INT NOT NULL COMMENT \'(DC2Type:CHF)\', balance_eur INT NOT NULL COMMENT \'(DC2Type:EUR)\', type ENUM(\'paper\', \'digital\') NOT NULL COMMENT \'(DC2Type:OrderType)\', INDEX IDX_9CE58EE161220EA6 (creator_id), INDEX IDX_9CE58EE17E3C61F9 (owner_id), INDEX IDX_9CE58EE1E37ECFB0 (updater_id), INDEX IDX_9CE58EE18D9F6D38 (order_id), INDEX IDX_9CE58EE14584665A (product_id), INDEX IDX_9CE58EE19A1887DC (subscription_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE event (id INT AUTO_INCREMENT NOT NULL, creator_id INT DEFAULT NULL, owner_id INT DEFAULT NULL, updater_id INT DEFAULT NULL, creation_date DATETIME DEFAULT NULL, update_date DATETIME DEFAULT NULL, name VARCHAR(191) NOT NULL, description TEXT NOT NULL, date DATETIME NOT NULL, INDEX IDX_3BAE0AA761220EA6 (creator_id), INDEX IDX_3BAE0AA77E3C61F9 (owner_id), INDEX IDX_3BAE0AA7E37ECFB0 (updater_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE file (id INT AUTO_INCREMENT NOT NULL, creator_id INT DEFAULT NULL, owner_id INT DEFAULT NULL, updater_id INT DEFAULT NULL, product_id INT NOT NULL, creation_date DATETIME DEFAULT NULL, update_date DATETIME DEFAULT NULL, filename VARCHAR(190) DEFAULT \'\' NOT NULL, mime VARCHAR(255) DEFAULT \'\' NOT NULL, INDEX IDX_8C9F361061220EA6 (creator_id), INDEX IDX_8C9F36107E3C61F9 (owner_id), INDEX IDX_8C9F3610E37ECFB0 (updater_id), INDEX IDX_8C9F36104584665A (product_id), UNIQUE INDEX unique_name (filename), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE product_tag (id INT AUTO_INCREMENT NOT NULL, creator_id INT DEFAULT NULL, owner_id INT DEFAULT NULL, updater_id INT DEFAULT NULL, creation_date DATETIME DEFAULT NULL, update_date DATETIME DEFAULT NULL, name VARCHAR(191) NOT NULL, color VARCHAR(7) DEFAULT \'\' NOT NULL, INDEX IDX_E3A6E39C61220EA6 (creator_id), INDEX IDX_E3A6E39C7E3C61F9 (owner_id), INDEX IDX_E3A6E39CE37ECFB0 (updater_id), UNIQUE INDEX unique_name (name), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE product_tag_product (product_tag_id INT NOT NULL, product_id INT NOT NULL, INDEX IDX_4D54B718D8AE22B5 (product_tag_id), INDEX IDX_4D54B7184584665A (product_id), PRIMARY KEY(product_tag_id, product_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE news (id INT AUTO_INCREMENT NOT NULL, creator_id INT DEFAULT NULL, owner_id INT DEFAULT NULL, updater_id INT DEFAULT NULL, creation_date DATETIME DEFAULT NULL, update_date DATETIME DEFAULT NULL, name VARCHAR(191) NOT NULL, description TEXT NOT NULL, date DATETIME NOT NULL, INDEX IDX_1DD3995061220EA6 (creator_id), INDEX IDX_1DD399507E3C61F9 (owner_id), INDEX IDX_1DD39950E37ECFB0 (updater_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user_product (id INT AUTO_INCREMENT NOT NULL, creator_id INT DEFAULT NULL, owner_id INT DEFAULT NULL, updater_id INT DEFAULT NULL, user_id INT NOT NULL, product_id INT NOT NULL, creation_date DATETIME DEFAULT NULL, update_date DATETIME DEFAULT NULL, type ENUM(\'paper\', \'digital\') NOT NULL COMMENT \'(DC2Type:OrderType)\', INDEX IDX_8B471AA761220EA6 (creator_id), INDEX IDX_8B471AA77E3C61F9 (owner_id), INDEX IDX_8B471AA7E37ECFB0 (updater_id), INDEX IDX_8B471AA7A76ED395 (user_id), INDEX IDX_8B471AA74584665A (product_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE newsletter (id INT AUTO_INCREMENT NOT NULL, creator_id INT DEFAULT NULL, owner_id INT DEFAULT NULL, updater_id INT DEFAULT NULL, creation_date DATETIME DEFAULT NULL, update_date DATETIME DEFAULT NULL, email VARCHAR(191) NOT NULL, UNIQUE INDEX UNIQ_7E8585C8E7927C74 (email), INDEX IDX_7E8585C861220EA6 (creator_id), INDEX IDX_7E8585C87E3C61F9 (owner_id), INDEX IDX_7E8585C8E37ECFB0 (updater_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE subscription (id INT AUTO_INCREMENT NOT NULL, creator_id INT DEFAULT NULL, owner_id INT DEFAULT NULL, updater_id INT DEFAULT NULL, image_id INT DEFAULT NULL, creation_date DATETIME DEFAULT NULL, update_date DATETIME DEFAULT NULL, price_per_unit_chf INT DEFAULT 0.00 NOT NULL COMMENT \'(DC2Type:CHF)\', price_per_unit_eur INT DEFAULT 0.00 NOT NULL COMMENT \'(DC2Type:EUR)\', is_active TINYINT(1) DEFAULT \'1\' NOT NULL, name VARCHAR(191) NOT NULL, description TEXT NOT NULL, code VARCHAR(20) DEFAULT NULL, internal_remarks TEXT NOT NULL, type ENUM(\'standard\', \'pro\', \'solidarity\') NOT NULL COMMENT \'(DC2Type:SubscriptionType)\', UNIQUE INDEX UNIQ_A3C664D377153098 (code), INDEX IDX_A3C664D361220EA6 (creator_id), INDEX IDX_A3C664D37E3C61F9 (owner_id), INDEX IDX_A3C664D3E37ECFB0 (updater_id), UNIQUE INDEX UNIQ_A3C664D33DA5256D (image_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('ALTER TABLE log ADD CONSTRAINT FK_8F3F68C561220EA6 FOREIGN KEY (creator_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE log ADD CONSTRAINT FK_8F3F68C57E3C61F9 FOREIGN KEY (owner_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE log ADD CONSTRAINT FK_8F3F68C5E37ECFB0 FOREIGN KEY (updater_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE user ADD CONSTRAINT FK_8D93D64961220EA6 FOREIGN KEY (creator_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE user ADD CONSTRAINT FK_8D93D6497E3C61F9 FOREIGN KEY (owner_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE user ADD CONSTRAINT FK_8D93D649E37ECFB0 FOREIGN KEY (updater_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE user_tag ADD CONSTRAINT FK_E89FD60861220EA6 FOREIGN KEY (creator_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE user_tag ADD CONSTRAINT FK_E89FD6087E3C61F9 FOREIGN KEY (owner_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE user_tag ADD CONSTRAINT FK_E89FD608E37ECFB0 FOREIGN KEY (updater_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE user_tag_user ADD CONSTRAINT FK_83118DFFDF80782C FOREIGN KEY (user_tag_id) REFERENCES user_tag (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE user_tag_user ADD CONSTRAINT FK_83118DFFA76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE message ADD CONSTRAINT FK_B6BD307F61220EA6 FOREIGN KEY (creator_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE message ADD CONSTRAINT FK_B6BD307F7E3C61F9 FOREIGN KEY (owner_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE message ADD CONSTRAINT FK_B6BD307FE37ECFB0 FOREIGN KEY (updater_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE message ADD CONSTRAINT FK_B6BD307FE92F8F78 FOREIGN KEY (recipient_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE image ADD CONSTRAINT FK_C53D045F61220EA6 FOREIGN KEY (creator_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE image ADD CONSTRAINT FK_C53D045F7E3C61F9 FOREIGN KEY (owner_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE image ADD CONSTRAINT FK_C53D045FE37ECFB0 FOREIGN KEY (updater_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE configuration ADD CONSTRAINT FK_A5E2A5D761220EA6 FOREIGN KEY (creator_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE configuration ADD CONSTRAINT FK_A5E2A5D77E3C61F9 FOREIGN KEY (owner_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE configuration ADD CONSTRAINT FK_A5E2A5D7E37ECFB0 FOREIGN KEY (updater_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE session ADD CONSTRAINT FK_D044D5D461220EA6 FOREIGN KEY (creator_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE session ADD CONSTRAINT FK_D044D5D47E3C61F9 FOREIGN KEY (owner_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE session ADD CONSTRAINT FK_D044D5D4E37ECFB0 FOREIGN KEY (updater_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE product ADD CONSTRAINT FK_D34A04AD61220EA6 FOREIGN KEY (creator_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE product ADD CONSTRAINT FK_D34A04AD7E3C61F9 FOREIGN KEY (owner_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE product ADD CONSTRAINT FK_D34A04ADE37ECFB0 FOREIGN KEY (updater_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE product ADD CONSTRAINT FK_D34A04AD3DA5256D FOREIGN KEY (image_id) REFERENCES image (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE `order` ADD CONSTRAINT FK_F529939861220EA6 FOREIGN KEY (creator_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE `order` ADD CONSTRAINT FK_F52993987E3C61F9 FOREIGN KEY (owner_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE `order` ADD CONSTRAINT FK_F5299398E37ECFB0 FOREIGN KEY (updater_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE order_line ADD CONSTRAINT FK_9CE58EE161220EA6 FOREIGN KEY (creator_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE order_line ADD CONSTRAINT FK_9CE58EE17E3C61F9 FOREIGN KEY (owner_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE order_line ADD CONSTRAINT FK_9CE58EE1E37ECFB0 FOREIGN KEY (updater_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE order_line ADD CONSTRAINT FK_9CE58EE18D9F6D38 FOREIGN KEY (order_id) REFERENCES `order` (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE order_line ADD CONSTRAINT FK_9CE58EE14584665A FOREIGN KEY (product_id) REFERENCES product (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE order_line ADD CONSTRAINT FK_9CE58EE19A1887DC FOREIGN KEY (subscription_id) REFERENCES subscription (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE event ADD CONSTRAINT FK_3BAE0AA761220EA6 FOREIGN KEY (creator_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE event ADD CONSTRAINT FK_3BAE0AA77E3C61F9 FOREIGN KEY (owner_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE event ADD CONSTRAINT FK_3BAE0AA7E37ECFB0 FOREIGN KEY (updater_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE file ADD CONSTRAINT FK_8C9F361061220EA6 FOREIGN KEY (creator_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE file ADD CONSTRAINT FK_8C9F36107E3C61F9 FOREIGN KEY (owner_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE file ADD CONSTRAINT FK_8C9F3610E37ECFB0 FOREIGN KEY (updater_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE file ADD CONSTRAINT FK_8C9F36104584665A FOREIGN KEY (product_id) REFERENCES product (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE product_tag ADD CONSTRAINT FK_E3A6E39C61220EA6 FOREIGN KEY (creator_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE product_tag ADD CONSTRAINT FK_E3A6E39C7E3C61F9 FOREIGN KEY (owner_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE product_tag ADD CONSTRAINT FK_E3A6E39CE37ECFB0 FOREIGN KEY (updater_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE product_tag_product ADD CONSTRAINT FK_4D54B718D8AE22B5 FOREIGN KEY (product_tag_id) REFERENCES product_tag (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE product_tag_product ADD CONSTRAINT FK_4D54B7184584665A FOREIGN KEY (product_id) REFERENCES product (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE news ADD CONSTRAINT FK_1DD3995061220EA6 FOREIGN KEY (creator_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE news ADD CONSTRAINT FK_1DD399507E3C61F9 FOREIGN KEY (owner_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE news ADD CONSTRAINT FK_1DD39950E37ECFB0 FOREIGN KEY (updater_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE user_product ADD CONSTRAINT FK_8B471AA761220EA6 FOREIGN KEY (creator_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE user_product ADD CONSTRAINT FK_8B471AA77E3C61F9 FOREIGN KEY (owner_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE user_product ADD CONSTRAINT FK_8B471AA7E37ECFB0 FOREIGN KEY (updater_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE user_product ADD CONSTRAINT FK_8B471AA7A76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE user_product ADD CONSTRAINT FK_8B471AA74584665A FOREIGN KEY (product_id) REFERENCES product (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE newsletter ADD CONSTRAINT FK_7E8585C861220EA6 FOREIGN KEY (creator_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE newsletter ADD CONSTRAINT FK_7E8585C87E3C61F9 FOREIGN KEY (owner_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE newsletter ADD CONSTRAINT FK_7E8585C8E37ECFB0 FOREIGN KEY (updater_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE subscription ADD CONSTRAINT FK_A3C664D361220EA6 FOREIGN KEY (creator_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE subscription ADD CONSTRAINT FK_A3C664D37E3C61F9 FOREIGN KEY (owner_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE subscription ADD CONSTRAINT FK_A3C664D3E37ECFB0 FOREIGN KEY (updater_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE subscription ADD CONSTRAINT FK_A3C664D33DA5256D FOREIGN KEY (image_id) REFERENCES image (id) ON DELETE CASCADE');
    }
}
