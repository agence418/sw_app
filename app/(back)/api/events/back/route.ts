import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        
        // Vérifier que c'est un admin
        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json(
                { error: 'Accès réservé aux administrateurs' },
                { status: 403 }
            );
        }

        const newStep = await db.backEventStep();
        
        return NextResponse.json({
            success: true,
            currentStep: newStep
        });
    } catch (error) {
        console.error('Erreur advance event:', error);
        return NextResponse.json(
            { error: 'Erreur lors de l\'avancement de l\'événement' },
            { status: 500 }
        );
    }
}
