import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword } from '@/lib/password';
import { validateEmail, validatePassword } from '@/lib/validation';

export async function POST(request: Request) {
    try {
        const data = await request.json();

        if (!data.name || !data.email || !data.password) {
            return NextResponse.json(
                { error: 'Nom, email et mot de passe requis' },
                { status: 400 }
            );
        }

        // Valider le format de l'email
        if (!validateEmail(data.email)) {
            return NextResponse.json(
                { error: 'Adresse email invalide' },
                { status: 400 }
            );
        }

        // Valider la sécurité du mot de passe
        const passwordValidation = validatePassword(data.password);
        if (!passwordValidation.isValid) {
            return NextResponse.json(
                { error: passwordValidation.error },
                { status: 400 }
            );
        }

        // Vérifier si l'email existe déjà
        const existingVisitor = await db.getVisitorByEmail(data.email);
        if (existingVisitor) {
            return NextResponse.json(
                { error: 'Un compte avec cet email existe déjà' },
                { status: 400 }
            );
        }

        // Hacher le mot de passe
        const hashedPassword = await hashPassword(data.password);

        // Créer le visiteur
        const visitor = await db.createVisitor({
            name: data.name,
            email: data.email,
            password: hashedPassword,
        });

        // Retourner sans le mot de passe
        const { password: _, ...visitorWithoutPassword } = visitor;

        return NextResponse.json(visitorWithoutPassword, { status: 201 });
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement:', error);
        return NextResponse.json(
            { error: 'Erreur lors de l\'enregistrement' },
            { status: 500 }
        );
    }
}
