import {db} from "@/lib/db";
import {NextResponse} from "next/server";

export async function GET() {
    try {
        const teams = await db.getTeamsCount();
        return NextResponse.json(teams);
    } catch (error) {
        return NextResponse.json(
            { error: 'Erreur lors de la récupération des équipes' },
            { status: 500 }
        );
    }
}