import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// POST: Ajouter un membre à une équipe
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);

    if (session?.user?.role !== 'admin') {
        return NextResponse.json(
            { error: 'Accès réservé aux administrateurs' },
            { status: 403 }
        );
    }

    try {
        const { participantId, role } = await request.json();
        const { id } = await params;
        const teamId = parseInt(id);

        if (!participantId) {
            return NextResponse.json(
                { error: 'L\'ID du participant est requis' },
                { status: 400 }
            );
        }

        const success = await db.addMemberToTeam(teamId, parseInt(participantId), role);

        if (!success) {
            return NextResponse.json(
                { error: 'Erreur lors de l\'ajout du membre' },
                { status: 400 }
            );
        }

        return NextResponse.json({ message: 'Membre ajouté avec succès' });
    } catch (error) {
        console.error('Erreur lors de l\'ajout du membre:', error);
        return NextResponse.json(
            { error: 'Erreur lors de l\'ajout du membre' },
            { status: 500 }
        );
    }
}

// DELETE: Retirer un membre d'une équipe
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);

    if (session?.user?.role !== 'admin') {
        return NextResponse.json(
            { error: 'Accès réservé aux administrateurs' },
            { status: 403 }
        );
    }

    try {
        const { searchParams } = new URL(request.url);
        const participantId = searchParams.get('participantId');
        const { id } = await params;
        const teamId = parseInt(id);

        if (!participantId) {
            return NextResponse.json(
                { error: 'L\'ID du participant est requis' },
                { status: 400 }
            );
        }

        const success = await db.removeMemberFromTeam(teamId, parseInt(participantId));

        if (!success) {
            return NextResponse.json(
                { error: 'Membre non trouvé dans cette équipe' },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: 'Membre retiré avec succès' });
    } catch (error) {
        console.error('Erreur lors du retrait du membre:', error);
        return NextResponse.json(
            { error: 'Erreur lors du retrait du membre' },
            { status: 500 }
        );
    }
}