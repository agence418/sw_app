-- Base de données pour l'application Startup Weekend

-- Script de réinitialisation (supprime les tables existantes)
DROP TABLE IF EXISTS team_members CASCADE;
DROP TABLE IF EXISTS teams CASCADE;
DROP TABLE IF EXISTS coach_preferences CASCADE;
DROP TABLE IF EXISTS presentations CASCADE;
DROP TABLE IF EXISTS votes CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS coaches CASCADE;
DROP TABLE IF EXISTS administrators CASCADE;
DROP TABLE IF EXISTS participants CASCADE;

-- Supprimer les séquences existantes pour les recréer proprement
DROP SEQUENCE IF EXISTS projects_id_seq CASCADE;
DROP SEQUENCE IF EXISTS participants_id_seq CASCADE;
DROP SEQUENCE IF EXISTS teams_id_seq CASCADE;
DROP SEQUENCE IF EXISTS votes_id_seq CASCADE;

-- Table des administrateurs
CREATE TABLE administrators
(
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(100)        NOT NULL,
    email      VARCHAR(100) UNIQUE NOT NULL,
    password   VARCHAR(255)        NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des coachs
CREATE TABLE coaches
(
    id           SERIAL PRIMARY KEY,
    name         VARCHAR(100)        NOT NULL,
    email        VARCHAR(100) UNIQUE NOT NULL,
    password     VARCHAR(255),
    expertise    VARCHAR(100),
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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

-- Table des projets
CREATE TABLE projects
(
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    description TEXT,
    status      VARCHAR(50) DEFAULT 'active',
    leader_id   INTEGER REFERENCES participants (id),
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des votes du vendredi
CREATE TABLE votes
(
    id             SERIAL PRIMARY KEY,
    participant_id INTEGER REFERENCES participants (id),
    idea_name      VARCHAR(200) NOT NULL,
    vote_time      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (participant_id, idea_name)
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

-- Données de base pour l'administrateur
INSERT INTO administrators (name, email, password)
VALUES ('${ADMIN_NAME}', '${ADMIN_EMAIL}', 'TO_RESET');

-- Index pour optimiser les performances
CREATE INDEX idx_votes_participant ON votes (participant_id);
CREATE INDEX idx_presentations_participant ON presentations (participant_id);
CREATE INDEX idx_coach_preferences_team ON coach_preferences (team_id);
CREATE INDEX idx_team_members_team ON team_members (team_id);
CREATE INDEX idx_team_members_participant ON team_members (participant_id);

-- S'assurer que les séquences sont correctement configurées
SELECT setval('projects_id_seq', COALESCE((SELECT MAX(id) FROM projects), 0) + 1, false);
SELECT setval('participants_id_seq', COALESCE((SELECT MAX(id) FROM participants), 0) + 1, false);
SELECT setval('teams_id_seq', COALESCE((SELECT MAX(id) FROM teams), 0) + 1, false);
SELECT setval('votes_id_seq', COALESCE((SELECT MAX(id) FROM votes), 0) + 1, false);