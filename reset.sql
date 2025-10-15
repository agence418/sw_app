-- Base de données pour l'application Startup Weekend

-- Script de réinitialisation (supprime les tables existantes)
DROP TABLE IF EXISTS team_coaches CASCADE;
DROP TABLE IF EXISTS team_members CASCADE;
DROP TABLE IF EXISTS teams CASCADE;
DROP TABLE IF EXISTS coach_preferences CASCADE;
DROP TABLE IF EXISTS presentations CASCADE;
DROP TABLE IF EXISTS votes CASCADE;
DROP TABLE IF EXISTS ideas CASCADE;
DROP TABLE IF EXISTS coaches CASCADE;
DROP TABLE IF EXISTS participants CASCADE;
DROP TABLE IF EXISTS visitors CASCADE;
DROP TABLE IF EXISTS event_state CASCADE;
DROP TABLE IF EXISTS app_config CASCADE;
DROP TABLE IF EXISTS tools CASCADE;

-- Supprimer les séquences existantes pour les recréer proprement
DROP SEQUENCE IF EXISTS ideas_id_seq CASCADE;
DROP SEQUENCE IF EXISTS participants_id_seq CASCADE;
DROP SEQUENCE IF EXISTS teams_id_seq CASCADE;
DROP SEQUENCE IF EXISTS votes_id_seq CASCADE;
DROP SEQUENCE IF EXISTS coaches_id_seq CASCADE;
DROP SEQUENCE IF EXISTS visitors_id_seq CASCADE;

-- Table des coachs
CREATE TABLE coaches
(
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(100)        NOT NULL,
    email      VARCHAR(100) UNIQUE NOT NULL,
    password   VARCHAR(255),
    expertise  VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des participants
CREATE TABLE participants
(
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(100)        NOT NULL,
    email      VARCHAR(100) UNIQUE NOT NULL,
    password   VARCHAR(255)        NOT NULL,
    phone      VARCHAR(20),
    skills     TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des visitors
CREATE TABLE visitors
(
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(100)        NOT NULL,
    email      VARCHAR(100) UNIQUE NOT NULL,
    password   VARCHAR(255)        NOT NULL,
    phone      VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des projets
CREATE TABLE ideas
(
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    description TEXT,
    status      VARCHAR(50) DEFAULT 'active',
    leader_id   INTEGER REFERENCES participants (id),
    created_at  TIMESTAMP   DEFAULT CURRENT_TIMESTAMP
);

-- Table des votes du vendredi
CREATE TABLE votes
(
    id             SERIAL PRIMARY KEY,
    user_id        INTEGER NOT NULL,
    user_type      VARCHAR(20) NOT NULL CHECK (user_type IN ('participant', 'coach', 'visitor')),
    idea_name      VARCHAR(200) NOT NULL,
    vote_time      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, user_type, idea_name)
);

-- Table des présentations envoyées
CREATE TABLE presentations
(
    id                SERIAL PRIMARY KEY,
    participant_id    INTEGER REFERENCES participants (id),
    team_name         VARCHAR(100) NOT NULL,
    file_path         VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    uploaded_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des équipes formées
CREATE TABLE teams
(
    id               SERIAL PRIMARY KEY,
    name             VARCHAR(100) NOT NULL,
    idea_description TEXT,
    leader_id        INTEGER REFERENCES participants (id),
    position         VARCHAR(100),
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des préférences de coaching
CREATE TABLE coach_preferences
(
    id              SERIAL PRIMARY KEY,
    team_id         INTEGER REFERENCES teams (id),
    coach_name      VARCHAR(100) NOT NULL,
    preference_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (team_id, coach_name)
);

-- Table des membres d'équipe
CREATE TABLE team_members
(
    id             SERIAL PRIMARY KEY,
    team_id        INTEGER REFERENCES teams (id),
    participant_id INTEGER REFERENCES participants (id),
    role           VARCHAR(50),
    joined_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (team_id, participant_id)
);

-- Table pour lier les coaches aux équipes
CREATE TABLE team_coaches
(
    id         SERIAL PRIMARY KEY,
    team_id    INTEGER REFERENCES teams (id) ON DELETE CASCADE,
    coach_id   INTEGER REFERENCES coaches (id) ON DELETE CASCADE,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (team_id, coach_id)
);

-- Table pour l'état actuel des événements
CREATE TABLE event_state
(
    id           SERIAL PRIMARY KEY,
    var          VARCHAR(50) NOT NULL,
    val          INTEGER     NOT NULL DEFAULT 0,
    updated_at   TIMESTAMP            DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (var)
);

-- Table de configuration globale
CREATE TABLE app_config
(
    id                    SERIAL PRIMARY KEY,
    event_start_date      TIMESTAMP NOT NULL,
    allow_visitor_registration BOOLEAN NOT NULL DEFAULT true,
    allow_visitor_accounts BOOLEAN NOT NULL DEFAULT true,
    who_can_vote          TEXT[] NOT NULL DEFAULT ARRAY['participant']::TEXT[],
    votes_per_participant INTEGER NOT NULL DEFAULT 3,
    updated_at            TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des outils pratiques
CREATE TABLE tools
(
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(200) NOT NULL,
    url        VARCHAR(500) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Initialisation des états des événements
INSERT INTO event_state (var, val)
VALUES ('current_step', 0);

-- Initialisation de la configuration par défaut
INSERT INTO app_config (event_start_date, allow_visitor_registration, allow_visitor_accounts, who_can_vote, votes_per_participant)
VALUES ('2025-09-05T18:00:00', true, true, ARRAY['participant']::TEXT[], 3);

-- Initialisation des outils par défaut
INSERT INTO tools (name, url) VALUES
('Site officiel Startup Weekend', 'https://startupweekend.org'),
('Slack de l''événement', '#'),
('Drive partagé', '#'),
('Modèle de Business Canvas', '#'),
('Template pitch deck', '#');

-- Index pour optimiser les performances
CREATE INDEX idx_votes_user ON votes (user_id, user_type);
CREATE INDEX idx_presentations_participant ON presentations (participant_id);
CREATE INDEX idx_coach_preferences_team ON coach_preferences (team_id);
CREATE INDEX idx_team_members_team ON team_members (team_id);
CREATE INDEX idx_team_members_participant ON team_members (participant_id);
CREATE INDEX idx_team_coaches_team ON team_coaches (team_id);
CREATE INDEX idx_team_coaches_coach ON team_coaches (coach_id);

-- S'assurer que les séquences sont correctement configurées
SELECT setval('ideas_id_seq', COALESCE((SELECT MAX(id) FROM ideas), 0) + 1, false);
SELECT setval('participants_id_seq', COALESCE((SELECT MAX(id) FROM participants), 0) + 1, false);
SELECT setval('teams_id_seq', COALESCE((SELECT MAX(id) FROM teams), 0) + 1, false);
SELECT setval('votes_id_seq', COALESCE((SELECT MAX(id) FROM votes), 0) + 1, false);
SELECT setval('coaches_id_seq', COALESCE((SELECT MAX(id)
                                          FROM coaches), 0) + 1, false);
SELECT setval('visitors_id_seq', COALESCE((SELECT MAX(id)
                                           FROM visitors), 0) + 1, false);