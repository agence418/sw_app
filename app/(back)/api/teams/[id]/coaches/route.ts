import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// POST: Affecter un coach à une équipe
export async function POST(
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
        const { coachId } = await request.json();
        const teamId = parseInt(params.id);

        if (!coachId) {
            return NextResponse.json(
                { error: 'L\'ID du coach est requis' },
                { status: 400 }
            );
        }

        const success = await db.addCoachToTeam(teamId, parseInt(coachId));

        if (!success) {
            return NextResponse.json(
                { error: 'Erreur lors de l\'affectation du coach' },
                { status: 400 }
            );
        }

        return NextResponse.json({ message: 'Coach affecté avec succès' });
    } catch (error) {
        console.error('Erreur lors de l\'affectation du coach:', error);
        return NextResponse.json(
            { error: 'Erreur lors de l\'affectation du coach' },
            { status: 500 }
        );
    }
}

// DELETE: Retirer un coach d'une équipe
export async function DELETE(
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
        const { searchParams } = new URL(request.url);
        const coachId = searchParams.get('coachId');
        const teamId = parseInt(params.id);

        if (!coachId) {
            return NextResponse.json(
                { error: 'L\'ID du coach est requis' },
                { status: 400 }
            );
        }

        const success = await db.removeCoachFromTeam(teamId, parseInt(coachId));

        if (!success) {
            return NextResponse.json(
                { error: 'Coach non trouvé dans cette équipe' },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: 'Coach retiré avec succès' });
    } catch (error) {
        console.error('Erreur lors du retrait du coach:', error);
        return NextResponse.json(
            { error: 'Erreur lors du retrait du coach' },
            { status: 500 }
        );
    }
}