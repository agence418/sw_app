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

    const newStep = await db.advanceEventStep();

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

export async function PUT(_request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Vérifier que c'est un admin
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ _error: 'Accès réservé aux administrateurs' }, { status: 403 });
    }

    const { step } = await _request.json();

    if (typeof step !== 'number' || step < -1) {
      return NextResponse.json({ _error: 'Étape invalide' }, { status: 400 });
    }

    const success = await db.setEventStep(step);

    if (success) {
      return NextResponse.json({
        success: true,
        currentStep: step,
      });
    } else {
      return NextResponse.json({ _error: 'Erreur lors de la mise à jour' }, { status: 500 });
    }
  } catch (_error) {
    console.error('Erreur set event step:', _error);
    return NextResponse.json(
      { _error: "Erreur lors de la mise à jour de l'étape" },
      { status: 500 }
    );
  }
}

export async function GET(_request: NextRequest) {
  try {
    const currentStep = await db.getCurrentEventState();

    return NextResponse.json({
      currentStep,
    });
  } catch (_error) {
    console.error('Erreur get event state:', _error);
    return NextResponse.json(
      { _error: "Erreur lors de la récupération de l'état" },
      { status: 500 }
    );
  }
}
