import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id);
        const data = await request.json();

        if (!data.name && !data.url) {
            return NextResponse.json(
                { error: 'Au moins un champ (nom ou URL) est requis' },
                { status: 400 }
            );
        }

        const tool = await db.updateTool(id, {
            name: data.name,
            url: data.url
        });

        if (!tool) {
            return NextResponse.json(
                { error: 'Outil non trouvé' },
                { status: 404 }
            );
        }

        return NextResponse.json(tool);
    } catch (error) {
        return NextResponse.json(
            { error: 'Erreur lors de la mise à jour de l\'outil' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id);
        const success = await db.deleteTool(id);

        if (!success) {
            return NextResponse.json(
                { error: 'Outil non trouvé' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { error: 'Erreur lors de la suppression de l\'outil' },
            { status: 500 }
        );
    }
}
