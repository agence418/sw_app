import {db} from "@/lib/db";
import {resetToken} from "@/app/modules/auth/lib/reset-token.lib";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
        return new Response(JSON.stringify({error: 'Email is required'}), {status: 400});
    }

    const admin = await db.getAdminByEmail(email.trim().toLowerCase());
    const coach = await db.getCoachByEmail(email.trim().toLowerCase());
    const participant = await db.getParticipantByEmail(email.trim().toLowerCase());
    const visitor = await db.getVisitorByEmail(email.trim().toLowerCase());

    let user = admin || coach || participant || visitor;

    // Générer un token JWT avec une expiration de 1 heure
    const token = resetToken(user);
    const resetLink = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password?token=${token}`;

    // Simulate sending email
    console.log(`Send reset link : ${resetLink}`);

    return new Response(JSON.stringify({resetLink}), {status: 200});
}