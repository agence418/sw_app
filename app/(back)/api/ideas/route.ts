import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const name = searchParams.get('name');
        
        if (name) {
            // Recherche par nom
            const projects = await db.getIdeasByName(name);
            return NextResponse.json(projects);
        } else {
            // Récupérer toutes les idées
            const projects = await db.getIdeas();
            return NextResponse.json(projects);
        }
    } catch (error) {
        return NextResponse.json(
            { error: 'Erreur lors de la récupération des idées' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, description, participantId } = body;

        console.log('Données reçues:', { name, description, participantId });

        if (!name || !participantId) {
            console.log('Champs manquants:', { 
                name: !!name,
                participantId: !!participantId
            });
            return NextResponse.json(
                { error: 'Le nom et le participant sont requis' },
                { status: 400 }
            );
        }

        const project = await db.createIdea({
            name,
            description,
            participantId
        });

        return NextResponse.json(project);
    } catch (error) {
        console.error('Erreur lors de la création de l\'idée:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la création de l\'idée' },
            { status: 500 }
        );
    }
}