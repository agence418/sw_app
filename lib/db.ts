// Configuration de la base de données PostgreSQL

import { Pool } from 'pg';
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

interface DbParticipant {
    id: number;
    name: string;
    email: string;
    password?: string;
    phone?: string;
    skills?: string[];
    created_at?: Date;
}

interface DbVote {
    id: number;
    participant_id: number;
    idea_name: string;
    vote_time: Date;
}

interface DbCoach {
    id: number;
    name: string;
    email: string;
    password?: string;
    expertise?: string;
    created_at?: Date;
}

interface DbAdmin {
    id: number;
    name: string;
    email: string;
    password?: string;
    created_at?: Date;
}

interface DbProject {
    id: number;
    name: string;
    description?: string;
    status: string;
    leader_id?: number;
    created_at?: Date;
}

// Fonctions de base de données avec vraies requêtes SQL
export const db = {
    // Participants
    async getParticipants(): Promise<DbParticipant[]> {
        try {
            const { rows } = await pool.query(
                'SELECT * FROM participants ORDER BY name'
            );
            return rows;
        } catch (error) {
            console.error('Erreur getParticipants:', error);
            return [];
        }
    },

    async getParticipantByEmail(email: string): Promise<DbParticipant | null> {
        try {
            const { rows } = await pool.query(
                'SELECT * FROM participants WHERE email = $1',
                [email]
            );
            return rows[0] || null;
        } catch (error) {
            console.error('Erreur getParticipantByEmail:', error);
            return null;
        }
    },

    async createParticipant(data: Omit<DbParticipant, 'id'>): Promise<DbParticipant> {
        try {
            const { rows } = await pool.query(
                'INSERT INTO participants (name, email, password, phone, skills) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                [data.name, data.email, data.password || 'temp2025', data.phone || null, data.skills || []]
            );
            return rows[0];
        } catch (error) {
            console.error('Erreur createParticipant:', error);
            throw error;
        }
    },

    async updateParticipant(id: number, data: Partial<DbParticipant>): Promise<DbParticipant | null> {
        try {
            const { rows } = await pool.query(
                'UPDATE participants SET name = COALESCE($2, name), email = COALESCE($3, email), password = COALESCE($4, password), phone = COALESCE($5, phone), skills = COALESCE($6, skills) WHERE id = $1 RETURNING *',
                [id, data.name, data.email, data.password, data.phone, data.skills]
            );
            return rows[0] || null;
        } catch (error) {
            console.error('Erreur updateParticipant:', error);
            return null;
        }
    },

    async deleteParticipant(id: number): Promise<boolean> {
        try {
            const result = await pool.query(
                'DELETE FROM participants WHERE id = $1',
                [id]
            );
            return result.rowCount > 0;
        } catch (error) {
            console.error('Erreur deleteParticipant:', error);
            return false;
        }
    },

    // Coaches
    async getCoaches(): Promise<DbCoach[]> {
        try {
            const { rows } = await pool.query(
                'SELECT * FROM coaches ORDER BY name'
            );
            return rows;
        } catch (error) {
            console.error('Erreur getCoaches:', error);
            return [];
        }
    },

    async createCoach(data: Omit<DbCoach, 'id'>): Promise<DbCoach> {
        try {
            const { rows } = await pool.query(
                'INSERT INTO coaches (name, email, expertise) VALUES ($1, $2, $3) RETURNING *',
                [data.name, data.email, data.expertise]
            );
            return rows[0];
        } catch (error) {
            console.error('Erreur createCoach:', error);
            throw error;
        }
    },

    async updateCoach(id: number, data: Partial<DbCoach>): Promise<DbCoach | null> {
        try {
            const { rows } = await pool.query(
                'UPDATE coaches SET name = COALESCE($2, name), email = COALESCE($3, email), password = COALESCE($4, password), expertise = COALESCE($5, expertise) WHERE id = $1 RETURNING *',
                [id, data.name, data.email, data.password, data.expertise]
            );
            return rows[0] || null;
        } catch (error) {
            console.error('Erreur updateCoach:', error);
            return null;
        }
    },

    async deleteCoach(id: number): Promise<boolean> {
        try {
            const result = await pool.query(
                'DELETE FROM coaches WHERE id = $1',
                [id]
            );
            return result.rowCount > 0;
        } catch (error) {
            console.error('Erreur deleteCoach:', error);
            return false;
        }
    },

    // Votes
    async getVotes(): Promise<DbVote[]> {
        try {
            const { rows } = await pool.query(
                'SELECT * FROM votes ORDER BY vote_time DESC'
            );
            return rows;
        } catch (error) {
            console.error('Erreur getVotes:', error);
            return [];
        }
    },

    async getVoteResults(): Promise<any[]> {
        try {
            const { rows } = await pool.query(`
                SELECT 
                    v.idea_name as "ideaName",
                    COUNT(*)::int as votes,
                    CASE 
                        WHEN (SELECT COUNT(*) FROM votes) > 0 
                        THEN ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM votes)), 0)::int
                        ELSE 0
                    END as percentage,
                    ARRAY_AGG(p.name ORDER BY p.name) as voters
                FROM votes v
                JOIN participants p ON v.participant_id = p.id
                GROUP BY v.idea_name
                ORDER BY votes DESC
            `);
            return rows;
        } catch (error) {
            console.error('Erreur getVoteResults:', error);
            return [];
        }
    },

    async createVote(data: any): Promise<DbVote> {
        try {
            // Récupérer le nom du projet depuis l'ID
            const projectResult = await pool.query(
                'SELECT name FROM projects WHERE id = $1',
                [parseInt(data.projectId)]
            );
            
            if (projectResult.rows.length === 0) {
                throw new Error('Projet non trouvé');
            }
            
            const projectName = projectResult.rows[0].name;
            
            // Vérifier si le participant a déjà voté pour ce projet
            const existing = await pool.query(
                'SELECT * FROM votes WHERE participant_id = $1 AND idea_name = $2',
                [data.participantId, projectName]
            );
            
            if (existing.rows.length > 0) {
                throw new Error('Ce participant a déjà voté pour ce projet');
            }

            const { rows } = await pool.query(
                'INSERT INTO votes (participant_id, idea_name, vote_time) VALUES ($1, $2, NOW()) RETURNING *',
                [data.participantId, projectName]
            );
            return rows[0];
        } catch (error) {
            console.error('Erreur createVote:', error);
            throw error;
        }
    },

    // Administrateurs
    async getAdministrators(): Promise<DbAdmin[]> {
        try {
            const { rows } = await pool.query(
                'SELECT * FROM administrators ORDER BY name'
            );
            return rows;
        } catch (error) {
            console.error('Erreur getAdministrators:', error);
            return [];
        }
    },

    // Équipes
    async getTeams(): Promise<any[]> {
        try {
            const { rows } = await pool.query(`
                SELECT 
                    t.id,
                    t.name,
                    t.idea_description,
                    t.created_at,
                    p.name as leader_name,
                    p.email as leader_email,
                    COALESCE(
                        (SELECT json_agg(json_build_object(
                            'id', tm_p.id,
                            'name', tm_p.name,
                            'email', tm_p.email,
                            'role', tm.role
                        ))
                        FROM team_members tm
                        JOIN participants tm_p ON tm.participant_id = tm_p.id
                        WHERE tm.team_id = t.id),
                        '[]'
                    ) as members,
                    COALESCE(
                        (SELECT json_agg(cp.coach_name ORDER BY cp.preference_time)
                        FROM coach_preferences cp
                        WHERE cp.team_id = t.id),
                        '[]'
                    ) as coach_requests
                FROM teams t
                LEFT JOIN participants p ON t.leader_id = p.id
                ORDER BY t.name
            `);
            return rows;
        } catch (error) {
            console.error('Erreur getTeams:', error);
            return [];
        }
    },

    async createTeam(data: any): Promise<any> {
        try {
            const { rows } = await pool.query(`
                INSERT INTO teams (name, idea_description, leader_id) 
                VALUES ($1, $2, $3) 
                RETURNING *
            `, [data.name, data.idea_description, data.leader_id]);
            return rows[0];
        } catch (error) {
            console.error('Erreur createTeam:', error);
            throw error;
        }
    },

    // Préférences de coaching
    async getCoachPreferences(teamId: number): Promise<any[]> {
        try {
            const { rows } = await pool.query(`
                SELECT * FROM coach_preferences 
                WHERE team_id = $1 
                ORDER BY preference_time
            `, [teamId]);
            return rows;
        } catch (error) {
            console.error('Erreur getCoachPreferences:', error);
            return [];
        }
    },

    async createCoachPreference(teamId: number, coachName: string): Promise<any> {
        try {
            const { rows } = await pool.query(`
                INSERT INTO coach_preferences (team_id, coach_name) 
                VALUES ($1, $2) 
                RETURNING *
            `, [teamId, coachName]);
            return rows[0];
        } catch (error) {
            console.error('Erreur createCoachPreference:', error);
            throw error;
        }
    },

    async deleteCoachPreference(teamId: number, coachName: string): Promise<boolean> {
        try {
            const result = await pool.query(`
                DELETE FROM coach_preferences 
                WHERE team_id = $1 AND coach_name = $2
            `, [teamId, coachName]);
            return result.rowCount > 0;
        } catch (error) {
            console.error('Erreur deleteCoachPreference:', error);
            return false;
        }
    },

    async getCoachDemandCount(coachName: string): Promise<number> {
        try {
            const { rows } = await pool.query(`
                SELECT COUNT(*) as count 
                FROM coach_preferences 
                WHERE coach_name = $1
            `, [coachName]);
            return parseInt(rows[0].count);
        } catch (error) {
            console.error('Erreur getCoachDemandCount:', error);
            return 0;
        }
    },

    async getTeamByLeaderId(leaderId: number): Promise<any | null> {
        try {
            const { rows } = await pool.query(`
                SELECT * FROM teams WHERE leader_id = $1
            `, [leaderId]);
            return rows[0] || null;
        } catch (error) {
            console.error('Erreur getTeamByLeaderId:', error);
            return null;
        }
    },

    // Projets
    async getProjects(): Promise<any[]> {
        try {
            const { rows } = await pool.query(`
                SELECT 
                    p.id::text, 
                    p.name, 
                    p.description, 
                    p.leader_id::text as "participantId",
                    par.name as "participantName",
                    p.created_at as "createdAt" 
                FROM projects p
                LEFT JOIN participants par ON p.leader_id = par.id
                ORDER BY p.created_at DESC
            `);
            return rows;
        } catch (error) {
            console.error('Erreur getProjects:', error);
            return [];
        }
    },

    async getProjectsByName(name: string): Promise<any[]> {
        try {
            const { rows } = await pool.query(`
                SELECT 
                    p.id::text, 
                    p.name, 
                    p.description, 
                    p.leader_id::text as "participantId",
                    par.name as "participantName",
                    p.created_at as "createdAt" 
                FROM projects p
                LEFT JOIN participants par ON p.leader_id = par.id
                WHERE p.name = $1
            `, [name]);
            return rows;
        } catch (error) {
            console.error('Erreur getProjectsByName:', error);
            return [];
        }
    },

    async createProject(data: any): Promise<any> {
        try {
            // Vérifier si participantId est vide ou invalide
            const leaderId = data.participantId ? parseInt(data.participantId) : null;
            
            const { rows } = await pool.query(`
                INSERT INTO projects (name, description, leader_id, status) 
                VALUES ($1, $2, $3, $4) 
                RETURNING 
                    id::text, 
                    name, 
                    description, 
                    leader_id::text as "participantId",
                    created_at as "createdAt"
            `, [data.name, data.description, leaderId, 'active']);
            
            // Récupérer le nom du participant pour le retour
            const projectWithParticipant = {
                ...rows[0],
                participantName: data.participantName || null
            };
            return projectWithParticipant;
        } catch (error) {
            console.error('Erreur createProject:', error);
            throw error;
        }
    },

    async updateProject(id: number, data: Partial<DbProject>): Promise<DbProject | null> {
        try {
            const { rows } = await pool.query(
                'UPDATE projects SET name = COALESCE($2, name), description = COALESCE($3, description), status = COALESCE($4, status), leader_id = COALESCE($5, leader_id) WHERE id = $1 RETURNING *',
                [id, data.name, data.description, data.status, data.leader_id]
            );
            return rows[0] || null;
        } catch (error) {
            console.error('Erreur updateProject:', error);
            return null;
        }
    },

    async deleteProject(id: number): Promise<boolean> {
        try {
            const result = await pool.query(
                'DELETE FROM projects WHERE id = $1',
                [id]
            );
            return result.rowCount > 0;
        } catch (error) {
            console.error('Erreur deleteProject:', error);
            return false;
        }
    },

    // Authentification
    async authenticateUser(email: string, password: string): Promise<any | null> {
        try {
            // Vérifier admin
            const adminResult = await pool.query(
                'SELECT * FROM administrators WHERE email = $1 AND password = $2',
                [email, password]
            );
            if (adminResult.rows[0]) {
                return {
                    id: adminResult.rows[0].id.toString(),
                    email: adminResult.rows[0].email,
                    name: adminResult.rows[0].name,
                    role: 'admin'
                };
            }

            // Vérifier coaches
            const coachResult = await pool.query(
                'SELECT * FROM coaches WHERE email = $1 AND password = $2',
                [email, password]
            );
            if (coachResult.rows[0]) {
                return {
                    id: coachResult.rows[0].id.toString(),
                    email: coachResult.rows[0].email,
                    name: coachResult.rows[0].name,
                    role: 'coach'
                };
            }

            // Vérifier participants
            const participantResult = await pool.query(
                'SELECT * FROM participants WHERE email = $1 AND password = $2',
                [email, password]
            );
            if (participantResult.rows[0]) {
                return {
                    id: participantResult.rows[0].id.toString(),
                    email: participantResult.rows[0].email,
                    name: participantResult.rows[0].name,
                    role: 'participant'
                };
            }

            return null;
        } catch (error) {
            console.error('Erreur authenticateUser:', error);
            return null;
        }
    },

    // Fonction utilitaire pour tester la connexion
    // Méthodes pour l'authentification et la réinitialisation de mot de passe
    async getAdminByEmail(email: string): Promise<DbAdmin | null> {
        try {
            const { rows } = await pool.query(
                'SELECT * FROM administrators WHERE email = $1',
                [email]
            );
            return rows[0] || null;
        } catch (error) {
            console.error('Erreur getAdminByEmail:', error);
            return null;
        }
    },

    async getCoachByEmail(email: string): Promise<DbCoach | null> {
        try {
            const { rows } = await pool.query(
                'SELECT * FROM coaches WHERE email = $1',
                [email]
            );
            return rows[0] || null;
        } catch (error) {
            console.error('Erreur getCoachByEmail:', error);
            return null;
        }
    },

    async updateAdminPassword(id: number, password: string): Promise<boolean> {
        try {
            const result = await pool.query(
                'UPDATE administrators SET password = $1 WHERE id = $2',
                [password, id]
            );
            return result.rowCount > 0;
        } catch (error) {
            console.error('Erreur updateAdminPassword:', error);
            return false;
        }
    },

    async updateCoachPassword(id: number, password: string): Promise<boolean> {
        try {
            const result = await pool.query(
                'UPDATE coaches SET password = $1 WHERE id = $2',
                [password, id]
            );
            return result.rowCount > 0;
        } catch (error) {
            console.error('Erreur updateCoachPassword:', error);
            return false;
        }
    },

    async updateParticipantPassword(id: number, password: string): Promise<boolean> {
        try {
            const result = await pool.query(
                'UPDATE participants SET password = $1 WHERE id = $2',
                [password, id]
            );
            return result.rowCount > 0;
        } catch (error) {
            console.error('Erreur updateParticipantPassword:', error);
            return false;
        }
    },

    async authenticateUser(email: string, password: string): Promise<any | null> {
        try {
            // Vérifier dans la table administrators
            const adminResult = await pool.query(
                'SELECT id, name, email, \'admin\' as role FROM administrators WHERE email = $1 AND password = $2',
                [email.toLowerCase(), password]
            );
            
            if (adminResult.rows.length > 0) {
                return adminResult.rows[0];
            }
            
            // Vérifier dans la table coaches
            const coachResult = await pool.query(
                'SELECT id, name, email, \'coach\' as role FROM coaches WHERE email = $1 AND password = $2',
                [email.toLowerCase(), password]
            );
            
            if (coachResult.rows.length > 0) {
                return coachResult.rows[0];
            }
            
            // Vérifier dans la table participants
            const participantResult = await pool.query(
                'SELECT id, name, email, \'participant\' as role FROM participants WHERE email = $1 AND password = $2',
                [email.toLowerCase(), password]
            );
            
            if (participantResult.rows.length > 0) {
                return participantResult.rows[0];
            }
            
            return null;
        } catch (error) {
            console.error('Erreur authenticateUser:', error);
            return null;
        }
    },

    async testConnection(): Promise<boolean> {
        try {
            const { rows } = await pool.query('SELECT NOW()');
            console.log('Connexion à la base de données réussie:', rows[0].now);
            return true;
        } catch (error) {
            console.error('Erreur de connexion à la base de données:', error);
            return false;
        }
    }
};

// Tester la connexion au démarrage (seulement en développement)
if (process.env.NODE_ENV !== 'production') {
    db.testConnection();
}