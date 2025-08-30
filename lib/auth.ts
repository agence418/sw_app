import {NextAuthOptions} from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
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

                // Remplacez par votre logique d'authentification
                // Exemple simple pour le Startup Weekend
                const validEmails = [
                    'participant@startupweekend.com',
                    'admin@startupweekend.com',
                    'coach@startupweekend.com',
                ];

                if (validEmails.includes(credentials.email) && credentials.password === 'startup2025') {
                    return {
                        id: '1',
                        email: credentials.email,
                        name: credentials.email.split('@')[0],
                        role: credentials.email.includes('admin') ? 'admin' : credentials.email.includes('coach') ? 'coach' : 'participant'
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
        signIn: '/login',
    },
    session: {
        strategy: 'jwt'
    }
};