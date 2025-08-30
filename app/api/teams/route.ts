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