import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const participants = await db.getParticipantsCount();
    return NextResponse.json(participants);
  } catch (_error) {
    return NextResponse.json(
      { _error: 'Erreur lors de la récupération des participants' },
      { status: 500 }
    );
  }
}
