import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const teams = await db.getTeamsCount();
    return NextResponse.json(teams);
  } catch (_error) {
    return NextResponse.json(
      { _error: 'Erreur lors de la récupération des équipes' },
      { status: 500 }
    );
  }
}
