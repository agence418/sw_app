import {NextResponse} from 'next/server';
import {db} from '@/lib/db';
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";

export async function GET() {
    const {user} = await getServerSession(authOptions);
    const {id, role} = user;

    try {
        if (role === 'admin') {
            const votes = await db.getVotes();
            return NextResponse.json(votes);
        }

        const votes = await db.getVotes(id, role);
        return NextResponse.json(votes);
    } catch (error) {
        return NextResponse.json(
            {error: 'Erreur lors de la récupération des votes'},
            {status: 500}
        );
    }
}

export async function POST(request: Request) {
    const {user} = await getServerSession(authOptions);
    const {id, role} = user;

    if (role === 'admin') {
        return NextResponse.json(
            {error: 'Les administrateurs ne peuvent pas voter'},
            {status: 403}
        );
    }

    try {
        const data = await request.json();

        if (!data.projectName) {
            return NextResponse.json(
                {error: 'Nom du projet requis'},
                {status: 400}
            );
        }

        if (data.value === 0) {
            await db.deleteVote(
                data.projectName,
                id,
                role
            );
            return NextResponse.json({message: 'Vote supprimé'}, {status: 200});
        }

        const vote = await db.createVote(
            data.projectName,
            id,
            role
        );

        return NextResponse.json(vote, {status: 201});
    } catch (error: any) {
        if (error.message && error.message.includes('déjà voté')) {
            return NextResponse.json(
                {error: error.message},
                {status: 400}
            );
        }
        return NextResponse.json(
            {error: 'Erreur lors de l\'enregistrement du vote'},
            {status: 500}
        );
    }
}