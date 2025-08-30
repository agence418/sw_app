import {NextAuthOptions} from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET || 'startup-weekend-secret-key-2025-very-long-random-string',
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: {label: 'Email', type: 'email'},
                password: {label: 'Password', type: 'password'}
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                // Admin depuis les variables d'environnement
                const adminEmail = process.env.ADMIN_EMAIL || 'admin@startupweekend.com';
                const adminPassword = process.env.ADMIN_PASSWORD || 'admin2025';
                const adminName = process.env.ADMIN_NAME || 'Administrator';

                if (credentials.email === adminEmail && credentials.password === adminPassword) {
                    return {
                        id: '1',
                        email: adminEmail,
                        name: adminName,
                        role: 'admin'
                    };
                }

                // Coachs hardcodés
                const coaches = [
                    { email: 'coach1@startupweekend.com', password: 'coach2025', name: 'Marie Dubois' },
                    { email: 'coach2@startupweekend.com', password: 'coach2025', name: 'Jean Martin' },
                ];

                const coach = coaches.find(c => c.email === credentials.email);
                if (coach && credentials.password === coach.password) {
                    return {
                        id: coach.email,
                        email: coach.email,
                        name: coach.name,
                        role: 'coach'
                    };
                }

                return null;
            }
        })
    ],
    callbacks: {
        async jwt({token, user}) {
            if (user) {
                token.role = user.role;
            }
            return token;
        },
        async session({session, token}) {
            if (token) {
                session.user.id = token.sub!;
                session.user.role = token.role as string;
            }
            return session;
        }
    },
    pages: {
        signIn: '/',
        error: '/'
    },
    session: {
        strategy: 'jwt',
        maxAge: 24 * 60 * 60, // 24 heures
    },
    debug: process.env.NODE_ENV === 'development'
};