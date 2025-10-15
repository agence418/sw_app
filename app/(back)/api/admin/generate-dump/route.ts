import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function GET() {
  const session = await getServerSession(authOptions);

  // Vérifier que l'utilisateur est admin
  if (session?.user?.role !== 'admin') {
    return NextResponse.json({ _error: 'Accès réservé aux administrateurs' }, { status: 403 });
  }

  try {
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
      return NextResponse.json({ _error: 'DATABASE_URL non configurée' }, { status: 500 });
    }

    // Extraire les informations de connexion depuis DATABASE_URL
    // Format: postgresql://user:password@host:port/database
    const url = new URL(databaseUrl);
    const dbName = url.pathname.substring(1);
    const host = url.hostname;
    const port = url.port || '5432';
    const user = url.username;
    const password = url.password;

    // Générer le dump avec pg_dump
    const command = `PGPASSWORD="${password}" pg_dump -h ${host} -p ${port} -U ${user} -d ${dbName} --clean --if-exists --no-owner --no-privileges`;

    const { stdout, stderr } = await execAsync(command, {
      maxBuffer: 10 * 1024 * 1024, // 10MB
    });

    if (stderr && !stderr.includes('NOTICE')) {
      console.error('Erreur pg_dump:', stderr);
    }

    // Retourner le dump SQL
    return new NextResponse(stdout, {
      headers: {
        'Content-Type': 'application/sql',
        'Content-Disposition': `attachment; filename="dump_${new Date().toISOString().split('T')[0]}.sql"`,
      },
    });
  } catch (_error) {
    console.error('Erreur lors de la génération du dump:', _error);
    return NextResponse.json(
      { _error: 'Erreur lors de la génération du dump SQL' },
      { status: 500 }
    );
  }
}
