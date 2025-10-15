import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(_request: NextRequest) {
  try {
    const { searchParams } = new URL(_request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ _error: 'Token manquant' }, { status: 400 });
    }

    // Vérifier le token JWT
    try {
      const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || 'your-secret-key');

      // Vérifier que c'est bien un token de reset
      if (typeof decoded === 'object' && decoded.type === 'password_reset') {
        return NextResponse.json(
          {
            email: decoded.email,
            valid: true,
          },
          { status: 200 }
        );
      } else {
        return NextResponse.json({ _error: 'Token invalide' }, { status: 400 });
      }
    } catch (_error) {
      return NextResponse.json({ _error: 'Token invalide ou expiré' }, { status: 400 });
    }
  } catch (_error) {
    console.error('Erreur lors de la vérification du token:', _error);
    return NextResponse.json({ _error: 'Erreur serveur' }, { status: 500 });
  }
}
