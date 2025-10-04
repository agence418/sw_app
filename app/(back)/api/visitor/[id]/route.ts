import {NextResponse} from 'next/server';
import {db} from '@/lib/db';

export async function PUT(
    request: Request,
    {params}: { params: Promise<{ id: string }> }
) {
    const {id} = await params;
    try {
        const data = await request.json();
        const visitor = await db.updateVisitor(parseInt(id), data);

        if (!visitor) {
            return NextResponse.json(
                {error: 'Coach non trouvé'},
                {status: 404}
            );
        }

        return NextResponse.json(visitor);
    } catch (error) {
        return NextResponse.json(
            {error: 'Erreur lors de la mise à jour'},
            {status: 500}
        );
    }
}

export async function DELETE(
    request: Request,
    {params}: { params: Promise<{ id: string }> }
) {
    const {id} = await params;
    try {
        const success = await db.deleteVisitor(parseInt(id));

        if (!success) {
            return NextResponse.json(
                {error: 'Visiteur non trouvé'},
                {status: 404}
            );
        }

        return NextResponse.json({message: 'Visiteur supprimé'});
    } catch (error) {
        return NextResponse.json(
            {error: 'Erreur lors de la suppression'},
            {status: 500}
        );
    }
}