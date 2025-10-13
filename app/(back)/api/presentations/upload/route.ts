import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.PRESENTATION_JWT_SECRET || 'your-secret-key-change-in-production';
const N8N_WEBHOOK_URL = process.env.N8N_PRESENTATION_WEBHOOK_URL;

interface TokenPayload {
    teamId: number;
    teamName: string;
    participantId: number;
    type: string;
}

// POST: Envoyer le fichier vers n8n via webhook
export async function POST(request: NextRequest) {
    try {
        // Récupérer le token depuis le header Authorization
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { error: 'Token manquant' },
                { status: 401 }
            );
        }

        const token = authHeader.substring(7);

        // Vérifier et décoder le token
        let decoded: TokenPayload;
        try {
            decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
        } catch (error) {
            return NextResponse.json(
                { error: 'Token invalide ou expiré' },
                { status: 401 }
            );
        }

        // Vérifier que le token est bien pour l'upload de présentation
        if (decoded.type !== 'presentation-upload') {
            return NextResponse.json(
                { error: 'Token non autorisé pour cette action' },
                { status: 403 }
            );
        }

        // Vérifier que le webhook n8n est configuré
        if (!N8N_WEBHOOK_URL) {
            console.error('N8N_PRESENTATION_WEBHOOK_URL n\'est pas configuré');
            return NextResponse.json(
                { error: 'Service d\'upload non configuré' },
                { status: 500 }
            );
        }

        // Récupérer le fichier depuis le FormData
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json(
                { error: 'Aucun fichier fourni' },
                { status: 400 }
            );
        }

        // Vérifier l'extension du fichier
        const fileName = file.name.toLowerCase();
        if (!fileName.endsWith('.ppt') && !fileName.endsWith('.pptx') && !fileName.endsWith('.pdf')) {
            return NextResponse.json(
                { error: 'Format de fichier non accepté. Utilisez .ppt, .pptx ou .pdf' },
                { status: 400 }
            );
        }

        // Préparer les données pour n8n
        const n8nFormData = new FormData();
        n8nFormData.append('file', file);
        n8nFormData.append('teamId', decoded.teamId.toString());
        n8nFormData.append('teamName', decoded.teamName);
        n8nFormData.append('participantId', decoded.participantId.toString());
        n8nFormData.append('fileName', file.name);

        // Envoyer vers n8n
        const response = await fetch(N8N_WEBHOOK_URL, {
            method: 'POST',
            body: n8nFormData,
        });

        if (!response.ok) {
            console.error('Erreur n8n:', await response.text());
            return NextResponse.json(
                { error: 'Erreur lors de l\'envoi vers le serveur' },
                { status: 500 }
            );
        }

        const result = await response.json().catch(() => ({}));

        return NextResponse.json({
            success: true,
            message: 'Présentation envoyée avec succès',
            teamName: decoded.teamName,
            fileName: file.name,
            ...result
        });

    } catch (error) {
        console.error('Erreur lors de l\'upload:', error);
        return NextResponse.json(
            { error: 'Erreur lors de l\'envoi du fichier' },
            { status: 500 }
        );
    }
}
