import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET() {
    const session = await getServerSession(authOptions);

    // Vérifier que l'utilisateur est admin
    if (session?.user?.role !== 'admin') {
        return NextResponse.json(
            { error: 'Accès réservé aux administrateurs' },
            { status: 403 }
        );
    }

    try {
        // Lire le fichier reset.sql
        const filePath = join(process.cwd(), 'reset.sql');
        const fileContent = await readFile(filePath, 'utf-8');

        // Retourner le fichier en tant que téléchargement
        return new NextResponse(fileContent, {
            headers: {
                'Content-Type': 'application/sql',
                'Content-Disposition': 'attachment; filename="reset.sql"',
            },
        });
    } catch (error) {
        console.error('Erreur lors de la lecture du fichier reset.sql:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la lecture du fichier SQL' },
            { status: 500 }
        );
    }
}
