import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ _error: 'Non autorisé' }, { status: 403 });
    }

    await db.setVotesLockStatus(true);

    return NextResponse.json({ success: true, votesAllowed: true });
  } catch (_error) {
    console.error('Erreur lors du déverrouillage des votes:', _error);
    return NextResponse.json(
      { _error: 'Erreur lors du déverrouillage des votes' },
      { status: 500 }
    );
  }
}
