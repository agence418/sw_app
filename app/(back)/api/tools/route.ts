import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
    try {
        const tools = await db.getTools();
        return NextResponse.json(tools);
    } catch (error) {
        return NextResponse.json(
            { error: 'Erreur lors de la récupération des outils' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();

        if (!data.name || !data.url) {
            return NextResponse.json(
                { error: 'Nom et URL requis' },
                { status: 400 }
            );
        }

        const tool = await db.createTool({
            name: data.name,
            url: data.url
        });

        return NextResponse.json(tool, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Erreur lors de la création de l\'outil' },
            { status: 500 }
        );
    }
}
