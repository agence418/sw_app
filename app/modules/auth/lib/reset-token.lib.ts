// Générer un token JWT avec une expiration de 1 heure
import jwt from "jsonwebtoken";

export const resetToken = (user) => {
    const userType = user.role;
    return jwt.sign(
        {
            userId: user.id,
            email: user.email,
            userType: userType,
            type: 'password_reset'
        },
        process.env.NEXTAUTH_SECRET || 'your-secret-key',
        {expiresIn: '1h'}
    );
}