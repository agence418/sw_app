import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PUT(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const data = await _request.json();
    const participant = await db.updateParticipant(parseInt(id), data);

    if (!participant) {
      return NextResponse.json({ _error: 'Participant non trouvé' }, { status: 404 });
    }

    return NextResponse.json(participant);
  } catch (_error) {
    return NextResponse.json({ _error: 'Erreur lors de la mise à jour' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const success = await db.deleteParticipant(parseInt(id));

    if (!success) {
      return NextResponse.json({ _error: 'Participant non trouvé' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Participant supprimé' });
  } catch (_error) {
    return NextResponse.json({ _error: 'Erreur lors de la suppression' }, { status: 500 });
  }
}
