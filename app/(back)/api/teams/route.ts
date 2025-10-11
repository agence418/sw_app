import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";

export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const leaderId = url.searchParams.get('leaderId');

        if (leaderId) {
            // Si leaderId est fourni, chercher l'équipe de ce leader
            const team = await db.getTeamByLeaderId(parseInt(leaderId));
            return NextResponse.json(team ? [team] : []);
        } else {
            // Sinon, retourner toutes les équipes
            const teams = await db.getTeams();
            return NextResponse.json(teams);
        }
    } catch (error) {
        return NextResponse.json(
            { error: 'Erreur lors de la récupération des équipes' },
            { status: 500 }
        );
    }
}


export async function DELETE(request: NextRequest) {
    const {user} = await getServerSession(authOptions);

    if (user?.role !== 'admin') {
        return NextResponse.json(
            { error: 'Accès réservé aux administrateurs' },
            { status: 403 }
        );
    }

    try {
        await db.deleteTeams();
        return NextResponse.json({ message: 'Toutes les équipes ont été supprimées' });

    } catch (error) {
        return NextResponse.json(
            { error },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, idea_description, leader_id } = body;

        if (!name || !leader_id) {
            return NextResponse.json(
                { error: 'Tous les champs sont requis' },
                { status: 400 }
            );
        }

        const team = await db.createTeam({
            name,
            idea_description: idea_description ?? '',
            leader_id: parseInt(leader_id)
        });

        return NextResponse.json(team);
    } catch (error) {
        console.error('Erreur lors de la création de l\'équipe:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la création de l\'équipe' },
            { status: 500 }
        );
    }
}