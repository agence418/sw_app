-- Données fictives pour tester l'application Startup Weekend

-- Participants fictifs
INSERT INTO participants (name, email, password, phone, skills) VALUES
('Alice Martin', 'alice.martin@email.com', 'temp2025', '0123456789', ARRAY['JavaScript', 'React', 'Node.js']),
('Bob Dupont', 'bob.dupont@email.com', 'temp2025', '0123456790', ARRAY['Python', 'Django', 'PostgreSQL']),
('Claire Moreau', 'claire.moreau@email.com', 'temp2025', '0123456791', ARRAY['Design', 'Figma', 'UX/UI']),
('David Laurent', 'david.laurent@email.com', 'temp2025', '0123456792', ARRAY['Marketing', 'SEO', 'Social Media']),
('Emma Bernard', 'emma.bernard@email.com', 'temp2025', '0123456793', ARRAY['Business', 'Finance', 'Excel']),
('François Dubois', 'francois.dubois@email.com', 'temp2025', '0123456794', ARRAY['DevOps', 'AWS', 'Docker']),
('Gabrielle Petit', 'gabrielle.petit@email.com', 'temp2025', '0123456795', ARRAY['Mobile', 'Flutter', 'iOS']),
('Henri Roux', 'henri.roux@email.com', 'temp2025', '0123456796', ARRAY['AI', 'Machine Learning', 'TensorFlow']),
('Isabelle Garnier', 'isabelle.garnier@email.com', 'temp2025', '0123456797', ARRAY['Product Management', 'Agile', 'Scrum']),
('Julien Fabre', 'julien.fabre@email.com', 'temp2025', '0123456798', ARRAY['Backend', 'API', 'Microservices']),
('Karine Simon', 'karine.simon@email.com', 'temp2025', '0123456799', ARRAY['Data Science', 'Analytics', 'R']),
('Louis Michel', 'louis.michel@email.com', 'temp2025', '0123456800', ARRAY['Blockchain', 'Ethereum', 'Solidity']),
('Marie Leroy', 'marie.leroy@email.com', 'temp2025', '0123456801', ARRAY['Frontend', 'Vue.js', 'CSS']),
('Nicolas Moreau', 'nicolas.moreau@email.com', 'temp2025', '0123456802', ARRAY['Sales', 'CRM', 'Negotiation']),
('Olivia Rousseau', 'olivia.rousseau@email.com', 'temp2025', '0123456803', ARRAY['QA', 'Testing', 'Automation']),
('Pierre Girard', 'pierre.girard@email.com', 'temp2025', '0123456804', ARRAY['Security', 'Cybersecurity', 'Pentesting']),
('Quentin Lefebvre', 'quentin.lefebvre@email.com', 'temp2025', '0123456805', ARRAY['IoT', 'Arduino', 'Sensors']),
('Rachel Fournier', 'rachel.fournier@email.com', 'temp2025', '0123456806', ARRAY['Content', 'Writing', 'SEO']),
('Sebastien Mercier', 'sebastien.mercier@email.com', 'temp2025', '0123456807', ARRAY['Legal', 'Compliance', 'GDPR']),
('Tara Vincent', 'tara.vincent@email.com', 'temp2025', '0123456808', ARRAY['HR', 'Recruitment', 'Management']);

-- Projets fictifs (idées pitchées vendredi)
INSERT INTO projects (name, description, leader_id, status) VALUES
('EcoTrack', 'Application mobile pour suivre son empreinte carbone quotidienne', 1, 'active'),
('StudyBuddy', 'Plateforme de mise en relation d''étudiants pour l''entraide', 2, 'active'),
('FoodShare', 'App anti-gaspillage pour partager les repas entre voisins', 3, 'active'),
('SmartPark', 'Système intelligent de gestion de parkings urbains', 4, 'active'),
('HealthMate', 'Assistant IA pour le suivi médical personnalisé', 5, 'active'),
('LocalBiz', 'Marketplace dédiée aux commerces de proximité', 6, 'active'),
('GreenEnergy', 'Plateforme de trading d''énergie renouvelable entre particuliers', 7, 'active'),
('PetCare', 'Application complète pour la gestion des animaux domestiques', 8, 'active'),
('WorkFlow', 'Outil de gestion de projet optimisé par IA', 9, 'active'),
('CityGuide', 'Guide touristique interactif avec réalité augmentée', 10, 'active');

-- Votes fictifs (vendredi soir après les pitchs)
-- Chaque participant vote pour 3 projets différents
INSERT INTO votes (participant_id, idea_name, vote_time) VALUES
-- Alice votes pour EcoTrack, FoodShare, HealthMate
(1, 'EcoTrack', '2025-01-24 20:30:00'),
(1, 'FoodShare', '2025-01-24 20:31:00'),
(1, 'HealthMate', '2025-01-24 20:32:00'),

-- Bob votes pour StudyBuddy, SmartPark, LocalBiz
(2, 'StudyBuddy', '2025-01-24 20:33:00'),
(2, 'SmartPark', '2025-01-24 20:34:00'),
(2, 'LocalBiz', '2025-01-24 20:35:00'),

-- Claire votes pour FoodShare, HealthMate, WorkFlow
(3, 'FoodShare', '2025-01-24 20:36:00'),
(3, 'HealthMate', '2025-01-24 20:37:00'),
(3, 'WorkFlow', '2025-01-24 20:38:00'),

-- David votes pour EcoTrack, GreenEnergy, CityGuide
(4, 'EcoTrack', '2025-01-24 20:39:00'),
(4, 'GreenEnergy', '2025-01-24 20:40:00'),
(4, 'CityGuide', '2025-01-24 20:41:00'),

-- Emma votes pour HealthMate, LocalBiz, WorkFlow
(5, 'HealthMate', '2025-01-24 20:42:00'),
(5, 'LocalBiz', '2025-01-24 20:43:00'),
(5, 'WorkFlow', '2025-01-24 20:44:00'),

-- François votes pour SmartPark, GreenEnergy, PetCare
(6, 'SmartPark', '2025-01-24 20:45:00'),
(6, 'GreenEnergy', '2025-01-24 20:46:00'),
(6, 'PetCare', '2025-01-24 20:47:00'),

-- Gabrielle votes pour FoodShare, PetCare, CityGuide
(7, 'FoodShare', '2025-01-24 20:48:00'),
(7, 'PetCare', '2025-01-24 20:49:00'),
(7, 'CityGuide', '2025-01-24 20:50:00'),

-- Henri votes pour EcoTrack, HealthMate, WorkFlow
(8, 'EcoTrack', '2025-01-24 20:51:00'),
(8, 'HealthMate', '2025-01-24 20:52:00'),
(8, 'WorkFlow', '2025-01-24 20:53:00'),

-- Isabelle votes pour StudyBuddy, LocalBiz, GreenEnergy
(9, 'StudyBuddy', '2025-01-24 20:54:00'),
(9, 'LocalBiz', '2025-01-24 20:55:00'),
(9, 'GreenEnergy', '2025-01-24 20:56:00'),

-- Julien votes pour SmartPark, WorkFlow, PetCare
(10, 'SmartPark', '2025-01-24 20:57:00'),
(10, 'WorkFlow', '2025-01-24 20:58:00'),
(10, 'PetCare', '2025-01-24 20:59:00'),

-- Karine votes pour EcoTrack, FoodShare, CityGuide
(11, 'EcoTrack', '2025-01-24 21:00:00'),
(11, 'FoodShare', '2025-01-24 21:01:00'),
(11, 'CityGuide', '2025-01-24 21:02:00'),

-- Louis votes pour HealthMate, GreenEnergy, WorkFlow
(12, 'HealthMate', '2025-01-24 21:03:00'),
(12, 'GreenEnergy', '2025-01-24 21:04:00'),
(12, 'WorkFlow', '2025-01-24 21:05:00'),

-- Marie votes pour StudyBuddy, FoodShare, LocalBiz
(13, 'StudyBuddy', '2025-01-24 21:06:00'),
(13, 'FoodShare', '2025-01-24 21:07:00'),
(13, 'LocalBiz', '2025-01-24 21:08:00'),

-- Nicolas votes pour SmartPark, PetCare, CityGuide
(14, 'SmartPark', '2025-01-24 21:09:00'),
(14, 'PetCare', '2025-01-24 21:10:00'),
(14, 'CityGuide', '2025-01-24 21:11:00'),

-- Olivia votes pour EcoTrack, HealthMate, GreenEnergy
(15, 'EcoTrack', '2025-01-24 21:12:00'),
(15, 'HealthMate', '2025-01-24 21:13:00'),
(15, 'GreenEnergy', '2025-01-24 21:14:00'),

-- Pierre votes pour StudyBuddy, WorkFlow, PetCare
(16, 'StudyBuddy', '2025-01-24 21:15:00'),
(16, 'WorkFlow', '2025-01-24 21:16:00'),
(16, 'PetCare', '2025-01-24 21:17:00'),

-- Quentin votes pour FoodShare, SmartPark, CityGuide
(17, 'FoodShare', '2025-01-24 21:18:00'),
(17, 'SmartPark', '2025-01-24 21:19:00'),
(17, 'CityGuide', '2025-01-24 21:20:00'),

-- Rachel votes pour LocalBiz, GreenEnergy, WorkFlow
(18, 'LocalBiz', '2025-01-24 21:21:00'),
(18, 'GreenEnergy', '2025-01-24 21:22:00'),
(18, 'WorkFlow', '2025-01-24 21:23:00'),

-- Sebastien votes pour EcoTrack, HealthMate, PetCare
(19, 'EcoTrack', '2025-01-24 21:24:00'),
(19, 'HealthMate', '2025-01-24 21:25:00'),
(19, 'PetCare', '2025-01-24 21:26:00'),

-- Tara votes pour StudyBuddy, FoodShare, CityGuide
(20, 'StudyBuddy', '2025-01-24 21:27:00'),
(20, 'FoodShare', '2025-01-24 21:28:00'),
(20, 'CityGuide', '2025-01-24 21:29:00');

-- Équipes formées (samedi matin après validation des votes)
-- Les 3 projets les plus votés : WorkFlow (8 votes), HealthMate (8 votes), EcoTrack (6 votes)
INSERT INTO teams (name, idea_description, leader_id) VALUES
('Équipe WorkFlow', 'Outil de gestion de projet optimisé par IA pour améliorer la productivité des équipes', 9),
('Équipe HealthMate', 'Assistant IA pour le suivi médical personnalisé et la prévention santé', 5),
('Équipe EcoTrack', 'Application mobile pour suivre son empreinte carbone et adopter des habitudes durables', 1);

-- Membres des équipes (ajout de participants aux équipes)
INSERT INTO team_members (team_id, participant_id, role) VALUES
-- Équipe WorkFlow (team_id = 1)
(1, 10, 'Développeur Backend'),
(1, 12, 'Développeur Blockchain'),
(1, 16, 'Expert Sécurité'),
(1, 18, 'Responsable Marketing'),
(1, 8, 'Expert IA'),
(1, 11, 'Data Scientist'),

-- Équipe HealthMate (team_id = 2)  
(2, 3, 'Designer UX/UI'),
(2, 15, 'QA Engineer'),
(2, 19, 'Expert Legal/Compliance'),
(2, 2, 'Développeur Backend'),
(2, 7, 'Développeur Mobile'),
(2, 20, 'Responsable RH'),

-- Équipe EcoTrack (team_id = 3)
(3, 4, 'Responsable Marketing'),
(3, 6, 'Expert DevOps'),
(3, 13, 'Développeur Frontend'),
(3, 14, 'Responsable Commercial'),
(3, 17, 'Expert IoT'),
(3, 1, 'Chef de Projet');

-- Préférences de coaching (samedi après formation des équipes)
INSERT INTO coach_preferences (team_id, coach_name) VALUES
-- Équipe WorkFlow demande 3 coaches
(1, 'Jean Martin'),      -- Développement Tech
(1, 'Sophie Laurent'),   -- Business Model  
(1, 'Thomas Bernard'),   -- Stratégie

-- Équipe HealthMate demande 2 coaches
(2, 'Marie Dubois'),     -- Marketing Digital
(2, 'Pierre Durand'),    -- Design UX/UI

-- Équipe EcoTrack demande 3 coaches
(3, 'Sophie Laurent'),   -- Business Model
(3, 'Claire Moreau'),    -- Financement
(3, 'Marie Dubois');     -- Marketing Digital

-- Statistiques des demandes de coaching par coach :
-- Marie Dubois: 2 demandes (HealthMate, EcoTrack)
-- Jean Martin: 1 demande (WorkFlow)
-- Sophie Laurent: 2 demandes (WorkFlow, EcoTrack)
-- Pierre Durand: 1 demande (HealthMate)
-- Claire Moreau: 1 demande (EcoTrack)
-- Thomas Bernard: 1 demande (WorkFlow)

-- Commentaire sur la répartition :
-- Toutes les équipes respectent la limite de 3 coaches max
-- Tous les coaches sont sous la limite de 5 demandes max
-- Cela permet de tester différents scénarios dans l'interface