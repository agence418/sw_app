import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const data = await request.json();
        const coach = await db.updateCoach(parseInt(id), data);
        
        if (!coach) {
            return NextResponse.json(
                { error: 'Coach non trouvé' },
                { status: 404 }
            );
        }

        return NextResponse.json(coach);
    } catch (error) {
        return NextResponse.json(
            { error: 'Erreur lors de la mise à jour' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const success = await db.deleteCoach(parseInt(id));
        
        if (!success) {
            return NextResponse.json(
                { error: 'Coach non trouvé' },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: 'Coach supprimé' });
    } catch (error) {
        return NextResponse.json(
            { error: 'Erreur lors de la suppression' },
            { status: 500 }
        );
    }
}