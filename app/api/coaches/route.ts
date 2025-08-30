import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';

export async function GET() {
    try {
        const coaches = await db.getCoaches();
        return NextResponse.json(coaches);
    } catch (error) {
        return NextResponse.json(
            { error: 'Erreur lors de la récupération des coachs' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        
        if (!data.name || !data.email) {
            return NextResponse.json(
                { error: 'Nom et email requis' },
                { status: 400 }
            );
        }

        const coach = await db.createCoach({
            name: data.name,
            email: data.email,
            expertise: data.expertise
        });

        return NextResponse.json(coach, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Erreur lors de la création du coach' },
            { status: 500 }
        );
    }
}