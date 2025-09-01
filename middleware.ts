import { withAuth } from "next-auth/middleware";

export default withAuth({
    callbacks: {
        authorized: ({ req, token }) => {
            // Si c'est une route API (sauf auth), on vérifie le token
            if (req.nextUrl.pathname.startsWith('/api/') && 
                !req.nextUrl.pathname.startsWith('/api/auth')) {
                return !!token;
            }
            return true;
        }
    }
});

export const config = {
    matcher: [
        '/api/:path*',  // Toutes les routes API
    ]
};