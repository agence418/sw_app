import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const results = await db.getVoteResults();
    return NextResponse.json(results);
  } catch (_error) {
    return NextResponse.json(
      { _error: 'Erreur lors de la récupération des résultats' },
      { status: 500 }
    );
  }
}
