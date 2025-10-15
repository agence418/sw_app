import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ _error: 'Non authentifié' }, { status: 401 });
  }

  const { id, role } = session.user;

  try {
    const participants = await db.canVote(id, role);
    return NextResponse.json(participants);
  } catch (_error) {
    return NextResponse.json(
      { _error: 'Erreur lors de la récupération des participants' },
      { status: 500 }
    );
  }
}
