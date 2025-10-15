import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(_request: NextRequest) {
  try {
    const url = new URL(_request.url);
    const teamId = url.searchParams.get('teamId');

    if (!teamId) {
      return NextResponse.json({ _error: 'teamId is required' }, { status: 400 });
    }

    const preferences = await db.getCoachPreferences(parseInt(teamId));
    return NextResponse.json(preferences);
  } catch (_error) {
    console.error('Error fetching coach preferences:', _error);
    return NextResponse.json({ _error: 'Internal server _error' }, { status: 500 });
  }
}

export async function POST(_request: NextRequest) {
  try {
    const body = await _request.json();
    const { teamId, coachName } = body;

    if (!teamId || !coachName) {
      return NextResponse.json({ _error: 'teamId and coachName are required' }, { status: 400 });
    }

    // Vérifier si l'équipe a déjà 3 coachs
    const existingPreferences = await db.getCoachPreferences(teamId);
    if (existingPreferences.length >= 3) {
      return NextResponse.json({ _error: 'Maximum 3 coaches allowed per team' }, { status: 400 });
    }

    // Vérifier si le coach a déjà 5 demandes
    const coachDemandCount = await db.getCoachDemandCount(coachName);
    if (coachDemandCount >= 5) {
      return NextResponse.json(
        { _error: 'This coach has reached the maximum number of requests (5)' },
        { status: 400 }
      );
    }

    const preference = await db.createCoachPreference(teamId, coachName);
    return NextResponse.json(preference, { status: 201 });
  } catch (_error) {
    console.error('Error creating coach preference:', _error);
    if (_error instanceof Error && _error.message.includes('duplicate key')) {
      return NextResponse.json(
        { _error: 'This coach is already requested by this team' },
        { status: 409 }
      );
    }
    return NextResponse.json({ _error: 'Internal server _error' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest) {
  try {
    const body = await _request.json();
    const { teamId, coachName } = body;

    if (!teamId || !coachName) {
      return NextResponse.json({ _error: 'teamId and coachName are required' }, { status: 400 });
    }

    const success = await db.deleteCoachPreference(teamId, coachName);
    if (!success) {
      return NextResponse.json({ _error: 'Coach preference not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Coach preference deleted successfully' });
  } catch (_error) {
    console.error('Error deleting coach preference:', _error);
    return NextResponse.json({ _error: 'Internal server _error' }, { status: 500 });
  }
}
