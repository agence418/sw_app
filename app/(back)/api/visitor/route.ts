import {NextResponse} from 'next/server';
import {db} from '@/lib/db';

export async function GET() {
    try {
        const visitors = await db.getVisitors();
        return NextResponse.json(visitors);
    } catch (error) {
        return NextResponse.json(
            {error: 'Erreur lors de la récupération des visitors'},
            {status: 500}
        );
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();

        if (!data.name || !data.email) {
            return NextResponse.json(
                {error: 'Nom et email requis'},
                {status: 400}
            );
        }

        const visitor = await db.createVisitor({
            name: data.name,
            email: data.email,
        });

        return NextResponse.json(visitor, {status: 201});
    } catch (error) {
        return NextResponse.json(
            {error: 'Erreur lors de la création du visitor'},
            {status: 500}
        );
    }
}