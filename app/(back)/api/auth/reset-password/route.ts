import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
    try {
        const { token, password } = await request.json();

        if (!token) {
            return NextResponse.json(
                { error: 'Token manquant' },
                { status: 400 }
            );
        }

        if (!password || password.length < 8) {
            return NextResponse.json(
                { error: 'Le mot de passe doit contenir au moins 8 caractères' },
                { status: 400 }
            );
        }

        // Vérifier le token JWT
        let decoded: any;
        try {
            decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || 'your-secret-key');
        } catch (error) {
            return NextResponse.json(
                { error: 'Token invalide ou expiré' },
                { status: 400 }
            );
        }

        // Vérifier que c'est bien un token de reset
        if (decoded.type !== 'password_reset') {
            return NextResponse.json(
                { error: 'Token invalide' },
                { status: 400 }
            );
        }

        const { userId, userType } = decoded;

        // Mettre à jour le mot de passe selon le type d'utilisateur
        let success = false;

        try {
            switch (userType) {
                case 'admin':
                    success = await db.updateAdminPassword(userId, password);
                    break;
                case 'coach':
                    success = await db.updateCoachPassword(userId, password);
                    break;
                case 'participant':
                    success = await db.updateParticipantPassword(userId, password);
                    break;
                case 'visitor':
                    success = await db.updateParticipantPassword(userId, password);
                    break;
                default:
                    return NextResponse.json(
                        { error: 'Type d\'utilisateur invalide' },
                        { status: 400 }
                    );
            }

            if (!success) {
                return NextResponse.json(
                    { error: 'Utilisateur non trouvé' },
                    { status: 404 }
                );
            }

        } catch (dbError) {
            console.error('Erreur base de données:', dbError);
            return NextResponse.json(
                { error: 'Erreur lors de la mise à jour' },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { success: true, message: 'Mot de passe modifié avec succès' },
            { status: 200 }
        );

    } catch (error) {
        console.error('Erreur lors de la modification du mot de passe:', error);
        return NextResponse.json(
            { error: 'Erreur serveur' },
            { status: 500 }
        );
    }
}