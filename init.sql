-- Base de données pour l'application Startup Weekend

-- Table des participants
CREATE TABLE participants
(
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(100)        NOT NULL,
    email      VARCHAR(100) UNIQUE NOT NULL,
    phone      VARCHAR(20),
    skills     TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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

-- Données de base pour les coaches
INSERT INTO participants (name, email, skills)
VALUES ('Marie Dubois', 'marie@startup.com', ARRAY['Marketing Digital']),
       ('Jean Martin', 'jean@startup.com', ARRAY['Développement Tech']),
       ('Sophie Laurent', 'sophie@startup.com', ARRAY['Business Model']),
       ('Pierre Durand', 'pierre@startup.com', ARRAY['Design UX/UI']),
       ('Claire Moreau', 'claire@startup.com', ARRAY['Financement']),
       ('Thomas Bernard', 'thomas@startup.com', ARRAY['Stratégie']);

-- Index pour optimiser les performances
CREATE INDEX idx_votes_participant ON votes (participant_id);
CREATE INDEX idx_presentations_participant ON presentations (participant_id);
CREATE INDEX idx_coach_preferences_participant ON coach_preferences (participant_id);
CREATE INDEX idx_team_members_team ON team_members (team_id);
CREATE INDEX idx_team_members_participant ON team_members (participant_id);