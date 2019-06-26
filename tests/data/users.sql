START TRANSACTION;

REPLACE INTO user (id, owner_id, login, code, first_name, last_name, email, password, role, status, birthday, billing_type, welcome_session_date, resign_date, family_relationship, door, iban) VALUES
(1000, NULL, 'administrator', 1, 'Admin', 'Istrator', 'administrator@example.com', MD5('administrator'), 'administrator', 'active', '1989-12-01', 'electronic', '2018-01-01 12:00:00', NULL, 'householder', 1, NULL),
(1001, NULL, 'responsible', 2, 'Respon', 'Sable', 'responsible@example.com', MD5('responsible'), 'responsible', 'active', '1991-05-12', 'electronic', '2018-01-01 12:00:00', NULL, 'householder', 1, NULL),
(1002, NULL, 'member', 3, 'Active', 'Member', 'member@example.com', MD5('member'), 'member', 'active', '1987-10-05', 'electronic', '2018-01-01 12:00:00', NULL, 'householder', 0, 'CH4200681926673315051'),
(1003, NULL, 'partner', 4, 'Booking', 'Only', 'partner@example.com', MD5('partner'), 'partner', 'active', NULL, 'electronic', '2018-01-01 12:00:00', NULL, 'householder', 0, NULL),
(1004, NULL, 'newmember', 5, 'New', 'User', 'newmember@example.com', MD5('newmember'), 'member', 'new', '1985-03-05', 'electronic', NULL, NULL, 'householder', 0, NULL),
(1005, NULL, 'inactive', 6, 'Inactive', 'Member', 'inactive@example.com', MD5('inactive'), 'member', 'inactive', '2000-08-05', 'electronic', '2018-01-01 12:00:00', NULL, 'householder', 0, NULL),
(1006, NULL, 'archived', 7, 'Archived', 'Member', 'archived@example.com', MD5('archived'), 'member', 'archived', '2001-03-05', 'paper', '2018-01-01 12:00:00', '2019-02-15 18:00:00', 'householder', 0, NULL),
(1007, 1002, 'individual', NULL, 'Conj', 'Oint', 'conjoint@example.com', MD5('individual'), 'individual', 'active', '1990-04-05', 'electronic', '2018-01-01 12:00:00', NULL, 'partner', 0, 'CH6303714697192579556'),
(1008, 1002, 'son', NULL, 'So', 'n', NULL, MD5('son'), 'individual', 'active', '2005-05-06', 'electronic', '2018-01-01 12:00:00', NULL, 'child', 0, 'CH7826637586626482007'),
(1009, 1002, 'daughter', NULL, 'daugh', 'ter', NULL, MD5('daughter'), 'individual', 'active' , '2008-02-12', 'electronic', '2018-01-01 12:00:00', NULL, 'child', 0, NULL),
(1010, NULL, 'voiliermember', 8, 'Voilier', 'Member', 'voiliermember@example.com', MD5('voiliermember'), 'member', 'archived', '1989-10-05', 'electronic', '2018-01-01 12:00:00', NULL, 'householder', 0, NULL),
(1011, 1010, 'voilierfamily', NULL, 'Voilier', 'Family', 'voilierfamily@example.com', MD5('voilierfamily'), 'individual', 'active', NULL, 'electronic', '2018-01-01 12:00:00', NULL, 'partner', 0, NULL),
(1012, NULL, 'product', 9, 'Product', 'Manager', 'productmanager@example.com', MD5('product'), 'product', 'active', '1993-05-21', 'electronic', '2019-06-20', NULL, 'householder', 1, NULL);

COMMIT;
