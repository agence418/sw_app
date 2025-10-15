import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import nodemailer from 'nodemailer';
import { resetToken } from '@/app/modules/auth/lib/reset-token.lib';

// Créer un transporteur email - À configurer avec vos paramètres SMTP
const createTransporter = () => {
  // Si les variables d'environnement pour l'email sont configurées
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // Sinon, utiliser un compte de test Ethereal (pour le développement)
  return null;
};

export async function POST(_request: NextRequest) {
  try {
    const { email } = await _request.json();

    if (!email || !email.trim()) {
      return NextResponse.json({ _error: 'Email requis' }, { status: 400 });
    }

    const admin = await db.getAdminByEmail(email.trim().toLowerCase());
    const coach = await db.getCoachByEmail(email.trim().toLowerCase());
    const participant = await db.getParticipantByEmail(email.trim().toLowerCase());
    const visitor = await db.getVisitorByEmail(email.trim().toLowerCase());

    const user = admin || coach || participant || visitor;

    // Même si l'utilisateur n'existe pas, on retourne un succès pour des raisons de sécurité
    if (!user) {
      return NextResponse.json(
        {
          success: true,
          message: 'Si cette adresse existe, un email de réinitialisation a été envoyé',
        },
        { status: 200 }
      );
    }

    const token = resetToken(user);
    const resetLink = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password?token=${token}`;

    // eslint-disable-next-line no-console
    console.log({ resetLink });

    // Créer le transporteur email
    let transporter = createTransporter();
    let testAccount = null;

    // Si aucune config SMTP, utiliser Ethereal pour les tests
    if (!transporter) {
      try {
        testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
        });
      } catch (_error) {
        console.error('Erreur création compte Ethereal:', _error);
        transporter = null;
      }
    }

    if (transporter) {
      // Si un transporteur est disponible, envoyer l'email
      try {
        const mailOptions = {
          from: process.env.SMTP_FROM || `"Startup Weekend" <${process.env.SMTP_USER}>`,
          to: user.email,
          subject: 'Réinitialisation de votre mot de passe - Startup Weekend',
          html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                            <h2 style="color: #333;">Bonjour ${user.name},</h2>
                            
                            <p>Vous avez demandé à réinitialiser votre mot de passe pour votre compte Startup Weekend.</p>
                            
                            <p>Cliquez sur le lien ci-dessous pour créer un nouveau mot de passe :</p>
                            
                            <div style="margin: 30px 0;">
                                <a href="${resetLink}" 
                                   style="background-color: #22c55e; color: white; padding: 12px 30px; 
                                          text-decoration: none; border-radius: 5px; display: inline-block;">
                                    Réinitialiser mon mot de passe
                                </a>
                            </div>
                            
                            <p style="color: #666; font-size: 14px;">
                                Ou copiez et collez ce lien dans votre navigateur :<br>
                                <span style="color: #0066cc;">${resetLink}</span>
                            </p>
                            
                            <p style="color: #666; font-size: 14px;">
                                Ce lien est valable pendant 1 heure. Si vous n'avez pas demandé cette réinitialisation, 
                                vous pouvez ignorer cet email.
                            </p>
                            
                            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
                            
                            <p style="color: #999; font-size: 12px;">
                                Cet email a été envoyé automatiquement, merci de ne pas y répondre.
                            </p>
                        </div>
                    `,
          text: `
                        Bonjour ${user.name},
                        
                        Vous avez demandé à réinitialiser votre mot de passe pour votre compte Startup Weekend.
                        
                        Cliquez sur le lien ci-dessous pour créer un nouveau mot de passe :
                        ${resetLink}
                        
                        Ce lien est valable pendant 1 heure. Si vous n'avez pas demandé cette réinitialisation, 
                        vous pouvez ignorer cet email.
                        
                        Cet email a été envoyé automatiquement, merci de ne pas y répondre.
                    `,
        };

        await transporter.sendMail(mailOptions);
      } catch (emailError) {
        console.error("Erreur lors de l'envoi de l'email:", emailError);
        // On continue quand même pour ne pas bloquer l'utilisateur
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Un email de réinitialisation a été envoyé',
        // En développement uniquement, retourner le lien
        resetLink: process.env.NODE_ENV === 'development' ? resetLink : undefined,
      },
      { status: 200 }
    );
  } catch (_error) {
    console.error('Erreur lors de la demande de reset:', _error);
    return NextResponse.json({ _error: 'Erreur serveur' }, { status: 500 });
  }
}
