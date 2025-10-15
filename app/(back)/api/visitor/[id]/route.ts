import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PUT(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const data = await _request.json();
    const visitor = await db.updateVisitor(parseInt(id), data);

    if (!visitor) {
      return NextResponse.json({ _error: 'Coach non trouvé' }, { status: 404 });
    }

    return NextResponse.json(visitor);
  } catch (_error) {
    return NextResponse.json({ _error: 'Erreur lors de la mise à jour' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const success = await db.deleteVisitor(parseInt(id));

    if (!success) {
      return NextResponse.json({ _error: 'Visiteur non trouvé' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Visiteur supprimé' });
  } catch (_error) {
    return NextResponse.json({ _error: 'Erreur lors de la suppression' }, { status: 500 });
  }
}
