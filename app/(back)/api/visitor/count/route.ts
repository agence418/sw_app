import {db} from "@/lib/db";
import {NextResponse} from "next/server";

export async function GET() {
    try {
        const participants = await db.getVisitorsCount();
        return NextResponse.json(participants);
    } catch (error) {
        return NextResponse.json(
            { error: 'Erreur lors de la récupération des participants' },
            { status: 500 }
        );
    }
}