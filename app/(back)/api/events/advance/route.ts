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

        const { day } = await request.json();

        if (!day || !['vendredi', 'dimanche'].includes(day)) {
            return NextResponse.json(
                { error: 'Jour invalide. Doit être "vendredi" ou "dimanche"' },
                { status: 400 }
            );
        }

        const newStep = await db.advanceEventStep(day);
        
        return NextResponse.json({
            success: true,
            day,
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

export async function PUT(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        
        // Vérifier que c'est un admin
        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json(
                { error: 'Accès réservé aux administrateurs' },
                { status: 403 }
            );
        }

        const { day, step } = await request.json();

        if (!day || !['vendredi', 'dimanche'].includes(day)) {
            return NextResponse.json(
                { error: 'Jour invalide. Doit être "vendredi" ou "dimanche"' },
                { status: 400 }
            );
        }

        if (typeof step !== 'number' || step < 0) {
            return NextResponse.json(
                { error: 'Étape invalide' },
                { status: 400 }
            );
        }

        const success = await db.setEventStep(day, step);
        
        if (success) {
            return NextResponse.json({
                success: true,
                day,
                currentStep: step
            });
        } else {
            return NextResponse.json(
                { error: 'Erreur lors de la mise à jour' },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error('Erreur set event step:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la mise à jour de l\'étape' },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const day = url.searchParams.get('day');

        if (!day || !['vendredi', 'dimanche'].includes(day)) {
            return NextResponse.json(
                { error: 'Paramètre day requis (vendredi ou dimanche)' },
                { status: 400 }
            );
        }

        const currentStep = await db.getCurrentEventState(day as 'vendredi' | 'dimanche');
        
        return NextResponse.json({
            day,
            currentStep
        });
    } catch (error) {
        console.error('Erreur get event state:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la récupération de l\'état' },
            { status: 500 }
        );
    }
}