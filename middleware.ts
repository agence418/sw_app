import { withAuth } from "next-auth/middleware";

export default withAuth({
    callbacks: {
        authorized: ({ req, token }) => {
            // Routes API publiques
            if (req.nextUrl.pathname.startsWith('/api/auth') ||
                req.nextUrl.pathname === '/api/config') {
                return true;
            }

            // Si c'est une route API, on vérifie le token
            if (req.nextUrl.pathname.startsWith('/api/')) {
                return !!token;
            }

            return false;
        }
    }
});

export const config = {
    matcher: [
        '/api/:path*',  // Toutes les routes API
    ]
};