import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(_request: Request) {
  try {
    const { searchParams } = new URL(_request.url);
    const name = searchParams.get('name');

    if (name) {
      // Recherche par nom
      const projects = await db.getIdeasByName(name);
      return NextResponse.json(projects);
    } else {
      // Récupérer toutes les idées
      const projects = await db.getIdeas();
      return NextResponse.json(projects);
    }
  } catch (_error) {
    return NextResponse.json(
      { _error: 'Erreur lors de la récupération des idées' },
      { status: 500 }
    );
  }
}

export async function POST(_request: Request) {
  try {
    const body = await _request.json();
    const { name, description, participantId } = body;

    if (!name || !participantId) {
      return NextResponse.json({ _error: 'Le nom et le participant sont requis' }, { status: 400 });
    }

    const project = await db.createIdea({
      name,
      description,
      participantId,
    });

    return NextResponse.json(project);
  } catch (_error) {
    console.error("Erreur lors de la création de l'idée:", _error);
    return NextResponse.json({ _error: "Erreur lors de la création de l'idée" }, { status: 500 });
  }
}
