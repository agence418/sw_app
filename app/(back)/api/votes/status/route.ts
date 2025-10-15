import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const votesAllowed = await db.getVotesLockStatus();

    return NextResponse.json({ votesAllowed });
  } catch (_error) {
    console.error('Erreur lors de la récupération du statut des votes:', _error);
    return NextResponse.json(
      { _error: 'Erreur lors de la récupération du statut des votes' },
      { status: 500 }
    );
  }
}
