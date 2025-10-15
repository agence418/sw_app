import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ _error: 'Non authentifié' }, { status: 401 });
  }

  const { id, role } = session.user;

  try {
    if (role === 'admin') {
      const votes = await db.getVotes();
      return NextResponse.json(votes);
    }

    const votes = await db.getVotes(id, role);
    return NextResponse.json(votes);
  } catch (_error) {
    return NextResponse.json(
      { _error: 'Erreur lors de la récupération des votes' },
      { status: 500 }
    );
  }
}

export async function POST(_request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ _error: 'Non authentifié' }, { status: 401 });
  }

  const { id, role } = session.user;

  if (role === 'admin') {
    return NextResponse.json(
      { _error: 'Les administrateurs ne peuvent pas voter' },
      { status: 403 }
    );
  }

  try {
    const data = await _request.json();

    if (!data.projectName) {
      return NextResponse.json({ _error: 'Nom du projet requis' }, { status: 400 });
    }

    if (data.value === 0) {
      await db.deleteVote(data.projectName, id, role);
      return NextResponse.json({ message: 'Vote supprimé' }, { status: 200 });
    }

    const vote = await db.createVote(data.projectName, id, role);

    return NextResponse.json(vote, { status: 201 });
  } catch (_error: any) {
    if (_error.message && _error.message.includes('déjà voté')) {
      return NextResponse.json({ _error: _error.message }, { status: 400 });
    }
    return NextResponse.json(
      { _error: "Erreur lors de l'enregistrement du vote" },
      { status: 500 }
    );
  }
}
