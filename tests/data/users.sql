START TRANSACTION;

REPLACE INTO user (id, owner_id, login, code, first_name, last_name, email, password, role) VALUES
(1000, NULL, 'administrator', 1, 'Jack', 'Sparrow', 'administrator@example.com', MD5('administrator'), 'administrator'),
(1001, NULL, 'facilitator', 2, 'Will', 'Turner', 'facilitator@example.com', MD5('facilitator'), 'facilitator'),
(1002, NULL, 'member', 3, 'Hector', 'Barbossa', 'member@example.com', MD5('member'), 'member'),
(1003, NULL, 'othermember', 4, 'Elizabeth', 'Swann', 'othermember@example.com', MD5('othermember'), 'member');

COMMIT;
