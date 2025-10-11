import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// PATCH: Mettre à jour la position d'une équipe
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);

    if (session?.user?.role !== 'admin') {
        return NextResponse.json(
            { error: 'Accès réservé aux administrateurs' },
            { status: 403 }
        );
    }

    try {
        const { position } = await request.json();
        const teamId = parseInt(params.id);

        if (!position) {
            return NextResponse.json(
                { error: 'La position est requise' },
                { status: 400 }
            );
        }

        const success = await db.updateTeamPosition(teamId, position);

        if (!success) {
            return NextResponse.json(
                { error: 'Équipe non trouvée' },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: 'Position mise à jour avec succès' });
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la position:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la mise à jour de la position' },
            { status: 500 }
        );
    }
}