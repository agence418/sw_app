import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// PATCH: Mettre à jour la position d'une équipe
export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (session?.user?.role !== 'admin') {
    return NextResponse.json({ _error: 'Accès réservé aux administrateurs' }, { status: 403 });
  }

  try {
    const { position } = await _request.json();
    const { id } = await params;
    const teamId = parseInt(id);

    if (!position) {
      return NextResponse.json({ _error: 'La position est requise' }, { status: 400 });
    }

    const success = await db.updateTeamPosition(teamId, position);

    if (!success) {
      return NextResponse.json({ _error: 'Équipe non trouvée' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Position mise à jour avec succès' });
  } catch (_error) {
    console.error('Erreur lors de la mise à jour de la position:', _error);
    return NextResponse.json(
      { _error: 'Erreur lors de la mise à jour de la position' },
      { status: 500 }
    );
  }
}
