# Configuration de la Base de Données PostgreSQL

## ✅ État actuel
Le code a été modifié pour utiliser PostgreSQL avec de vraies requêtes SQL. Les packages `pg` et `@types/pg` sont installés.

## Installation et Configuration

### 1. Installer PostgreSQL

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql

# MacOS
brew install postgresql
brew services start postgresql

# Windows (avec chocolatey)
choco install postgresql
```

### 2. Créer la base de données

```bash
# Se connecter à PostgreSQL
sudo -u postgres psql

# Créer la base de données et l'utilisateur
CREATE DATABASE startup_weekend;
CREATE USER startup_user WITH PASSWORD 'startup_password';
GRANT ALL PRIVILEGES ON DATABASE startup_weekend TO startup_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO startup_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO startup_user;

# Quitter
\q
```

### 3. Exécuter le script SQL

```bash
# Exécuter le script d'initialisation
psql -U startup_user -d startup_weekend -f init.sql

# Ou si vous avez des problèmes de permissions :
sudo -u postgres psql -d startup_weekend -f init.sql
```

### 4. Configuration de l'application

#### Créer le fichier de configuration

```bash
# Copier le fichier d'exemple
cp .env.local.example .env.local

# Éditer avec vos paramètres
nano .env.local
```

#### Contenu du fichier `.env.local`

```env
DATABASE_URL=postgresql://startup_user:startup_password@localhost:5432/startup_weekend
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3001
NODE_ENV=development
```

### 5. Ajouter des données de test

```bash
# Se connecter à la base de données
psql -U startup_user -d startup_weekend

# Ajouter quelques participants de test
INSERT INTO participants (name, email, phone, skills) VALUES 
('Alice Dupont', 'participant1@startupweekend.com', '0612345678', ARRAY['React', 'Design']),
('Bob Martin', 'participant2@startupweekend.com', '0623456789', ARRAY['Backend', 'Python']),
('Claire Durand', 'participant3@startupweekend.com', '0634567890', ARRAY['Marketing', 'SEO']),
('Marie Dubois', 'coach1@startupweekend.com', '0645678901', ARRAY['Marketing Digital', 'Coach']),
('Jean Martin', 'coach2@startupweekend.com', '0656789012', ARRAY['Développement Tech', 'Coach']);

# Ajouter quelques votes de test
INSERT INTO votes (participant_id, idea_name) VALUES 
(1, 'EcoTrack - Application de suivi carbone'),
(2, 'EcoTrack - Application de suivi carbone'),
(3, 'FoodShare - Plateforme anti-gaspillage'),
(4, 'LearnAI - Tuteur IA personnalisé'),
(5, 'EcoTrack - Application de suivi carbone');

# Quitter
\q
```

### 5. Sécurité

Pour la production, il est important de :

1. **Hasher les mots de passe** avec bcrypt
2. **Valider les entrées** pour éviter les injections SQL
3. **Limiter les permissions** de l'utilisateur de base de données
4. **Utiliser HTTPS** pour toutes les communications
5. **Implémenter un rate limiting** sur les endpoints d'authentification

### 6. Test de connexion

Redémarrez votre serveur Next.js et testez la connexion :

```bash
pnpm dev
```

Visitez http://localhost:3000 et connectez-vous avec :
- Admin: `admin@startupweekend.com` / `admin2025`
- Participants: créez-les via l'interface admin

## Structure actuelle de la base de données

La base de données utilise le schéma défini dans `init.sql` avec les tables suivantes :
- `participants` - Stocke les informations des participants
- `votes` - Enregistre les votes du vendredi
- `presentations` - Stocke les présentations envoyées
- `coach_preferences` - Préférences de coaching
- `teams` - Équipes formées
- `team_members` - Membres des équipes