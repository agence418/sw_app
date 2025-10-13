import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.PRESENTATION_JWT_SECRET || 'your-secret-key-change-in-production';

// POST: Générer un token pour permettre l'upload depuis un ordinateur
export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);

    // Vérifier que l'utilisateur est un participant
    if (session?.user?.role !== 'participant') {
        return NextResponse.json(
            { error: 'Accès réservé aux participants' },
            { status: 403 }
        );
    }

    try {
        const participantId = session.user.id;

        // Récupérer l'équipe du participant
        const team = await db.getTeamByLeaderId(participantId);

        if (!team) {
            return NextResponse.json(
                { error: 'Vous devez être leader d\'une équipe pour envoyer une présentation' },
                { status: 400 }
            );
        }

        // Générer un token JWT valide 6 heures
        const token = jwt.sign(
            {
                teamId: team.id,
                teamName: team.name,
                participantId: participantId,
                type: 'presentation-upload'
            },
            JWT_SECRET,
            { expiresIn: '6h' }
        );

        // Créer l'URL complète
        const baseUrl = process.env.NEXTAUTH_URL || `${request.nextUrl.protocol}//${request.nextUrl.host}`;
        const uploadUrl = `${baseUrl}/upload/${token}`;

        return NextResponse.json({
            token,
            uploadUrl,
            teamName: team.name,
            expiresIn: '6 heures'
        });
    } catch (error) {
        console.error('Erreur lors de la génération du token:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la génération du lien' },
            { status: 500 }
        );
    }
}
