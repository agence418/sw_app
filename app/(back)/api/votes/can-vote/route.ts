import {db} from "@/lib/db";
import {NextResponse} from "next/server";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";

export async function GET() {
    const {user} = await getServerSession(authOptions);

    const {id, role} = user;

    try {
        const participants = await db.canVote(id, role);
        return NextResponse.json(participants);
    } catch (error) {
        return NextResponse.json(
            {error: 'Erreur lors de la récupération des participants'},
            {status: 500}
        );
    }
}