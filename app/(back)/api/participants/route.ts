import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
    try {
        const participants = await db.getParticipants();
        return NextResponse.json(participants);
    } catch (error) {
        return NextResponse.json(
            { error: 'Erreur lors de la récupération des participants' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        
        // Validation simple
        if (!data.name || !data.email) {
            return NextResponse.json(
                { error: 'Nom et email requis' },
                { status: 400 }
            );
        }

        // Vérifier si l'email existe déjà
        const existing = await db.getParticipantByEmail(data.email);
        if (existing) {
            return NextResponse.json(
                { error: 'Cet email existe déjà' },
                { status: 400 }
            );
        }

        const participant = await db.createParticipant({
            name: data.name,
            email: data.email,
            phone: data.phone,
            skills: data.skills || []
        });

        return NextResponse.json(participant, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Erreur lors de la création du participant' },
            { status: 500 }
        );
    }
}