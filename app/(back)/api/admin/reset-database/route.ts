import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { Pool } from 'pg';

export async function POST() {
  const session = await getServerSession(authOptions);

  // Vérifier que l'utilisateur est admin
  if (session?.user?.role !== 'admin') {
    return NextResponse.json({ _error: 'Accès réservé aux administrateurs' }, { status: 403 });
  }

  try {
    // Lire le fichier reset.sql
    const filePath = join(process.cwd(), 'reset.sql');
    const sqlContent = await readFile(filePath, 'utf-8');

    // Créer une connexion à la base de données
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: false,
    });

    // Exécuter le script SQL
    await pool.query(sqlContent);
    await pool.end();

    return NextResponse.json({
      success: true,
      message: 'Base de données réinitialisée avec succès',
    });
  } catch (_error: any) {
    console.error('Erreur lors de la réinitialisation de la base:', _error);
    return NextResponse.json(
      {
        _error: 'Erreur lors de la réinitialisation de la base de données',
        details: _error.message,
      },
      { status: 500 }
    );
  }
}
