-- Base de données pour l'application Startup Weekend

-- Script de réinitialisation (supprime les tables existantes)
DROP TABLE IF EXISTS administrators CASCADE;

-- Supprimer les séquences existantes pour les recréer proprement
DROP SEQUENCE IF EXISTS administrators_id_seq CASCADE;

-- Table des administrateurs
CREATE TABLE administrators
(
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(100)        NOT NULL,
    email      VARCHAR(100) UNIQUE NOT NULL,
    password   VARCHAR(255)        NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Données de base pour l'administrateur
INSERT INTO administrators (name, email, password)
VALUES ('${ADMIN_NAME}', '${ADMIN_EMAIL}', 'TO_RESET');

SELECT setval('administrators_id_seq', COALESCE((SELECT MAX(id) FROM administrators), 0) + 1, false);