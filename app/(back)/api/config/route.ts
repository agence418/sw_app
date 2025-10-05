import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
    try {
        const config = await db.getAppConfig();
        return NextResponse.json(config);
    } catch (error) {
        console.error('Erreur lors de la récupération de la configuration:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la récupération de la configuration' },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'admin') {
            return NextResponse.json(
                { error: 'Non autorisé' },
                { status: 403 }
            );
        }

        const data = await request.json();

        const config = await db.updateAppConfig(data);
        return NextResponse.json(config);
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la configuration:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la mise à jour de la configuration' },
            { status: 500 }
        );
    }
}
