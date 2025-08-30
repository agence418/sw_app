import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';

export async function GET() {
    try {
        const teams = await db.getTeams();
        return NextResponse.json(teams);
    } catch (error) {
        return NextResponse.json(
            { error: 'Erreur lors de la récupération des équipes' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, idea_description, leader_id } = body;

        if (!name || !idea_description || !leader_id) {
            return NextResponse.json(
                { error: 'Tous les champs sont requis' },
                { status: 400 }
            );
        }

        const team = await db.createTeam({
            name,
            idea_description,
            leader_id: parseInt(leader_id)
        });

        return NextResponse.json(team);
    } catch (error) {
        console.error('Erreur lors de la création de l\'équipe:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la création de l\'équipe' },
            { status: 500 }
        );
    }
}