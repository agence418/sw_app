import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { validateEmail } from '@/lib/validation';

export async function GET() {
  try {
    const participants = await db.getParticipants();
    return NextResponse.json(participants);
  } catch (_error) {
    return NextResponse.json(
      { _error: 'Erreur lors de la récupération des participants' },
      { status: 500 }
    );
  }
}

export async function POST(_request: Request) {
  try {
    const data = await _request.json();

    // Validation simple
    if (!data.name || !data.email) {
      return NextResponse.json({ _error: 'Nom et email requis' }, { status: 400 });
    }

    // Valider le format de l'email
    if (!validateEmail(data.email)) {
      return NextResponse.json({ _error: 'Adresse email invalide' }, { status: 400 });
    }

    // Vérifier si l'email existe déjà
    const existing = await db.getParticipantByEmail(data.email);
    if (existing) {
      return NextResponse.json({ _error: 'Cet email existe déjà' }, { status: 400 });
    }

    const participant = await db.createParticipant({
      name: data.name,
      email: data.email,
      phone: data.phone,
      skills: data.skills || [],
    });

    return NextResponse.json(participant, { status: 201 });
  } catch (_error) {
    return NextResponse.json(
      { _error: 'Erreur lors de la création du participant' },
      { status: 500 }
    );
  }
}
