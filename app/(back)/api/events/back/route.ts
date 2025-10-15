import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(_request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Vérifier que c'est un admin
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ _error: 'Accès réservé aux administrateurs' }, { status: 403 });
    }

    const newStep = await db.backEventStep();

    return NextResponse.json({
      success: true,
      currentStep: newStep,
    });
  } catch (_error) {
    console.error('Erreur advance event:', _error);
    return NextResponse.json(
      { _error: "Erreur lors de l'avancement de l'événement" },
      { status: 500 }
    );
  }
}
