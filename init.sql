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

-- Table des préférences de coaching
CREATE TABLE coach_preferences
(
    id              SERIAL PRIMARY KEY,
    participant_id  INTEGER REFERENCES participants (id),
    coach_name      VARCHAR(100) NOT NULL,
    preference_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (participant_id, coach_name)
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
VALUES ('Administrator', 'admin@startupweekend.com', 'admin2025');

-- Données de base pour les coaches
INSERT INTO coaches (name, email, password, expertise)
VALUES ('Marie Dubois', 'coach1@startupweekend.com', 'coach2025', 'Marketing Digital'),
       ('Jean Martin', 'coach2@startupweekend.com', 'coach2025', 'Développement Tech'),
       ('Sophie Laurent', 'coach3@startupweekend.com', 'coach2025', 'Business Model'),
       ('Pierre Durand', 'coach4@startupweekend.com', 'coach2025', 'Design UX/UI'),
       ('Claire Moreau', 'coach5@startupweekend.com', 'coach2025', 'Financement'),
       ('Thomas Bernard', 'coach6@startupweekend.com', 'coach2025', 'Stratégie');

-- Index pour optimiser les performances
CREATE INDEX idx_votes_participant ON votes (participant_id);
CREATE INDEX idx_presentations_participant ON presentations (participant_id);
CREATE INDEX idx_coach_preferences_participant ON coach_preferences (participant_id);
CREATE INDEX idx_team_members_team ON team_members (team_id);
CREATE INDEX idx_team_members_participant ON team_members (participant_id);