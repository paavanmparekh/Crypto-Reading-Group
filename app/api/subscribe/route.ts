import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sendWelcomeEmail } from '@/lib/email';
import { z } from 'zod';

const subscribeSchema = z.object({
    email: z.string().email(),
    name: z.string().optional(),
});

export async function POST(req: Request) {
    return NextResponse.json({ error: 'Subscription disabled' }, { status: 404 });
    /*
    try {
        const body = await req.json();
        const result = subscribeSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: 'Invalid email address' },
                { status: 400 }
            );
        }

        const { email, name } = result.data;

        // Check if already subscribed
        const existing = await prisma.subscriber.findUnique({
            where: { email },
        });

        if (existing) {
            if (!existing.isActive) {
                // Reactivate
                await prisma.subscriber.update({
                    where: { email },
                    data: { isActive: true, name: name || existing.name },
                });
            }
            return NextResponse.json({ message: 'Already subscribed' });
        }

        // Create new subscriber
        await prisma.subscriber.create({
            data: {
                email,
                name,
            },
        });

        // Send welcome email
        await sendWelcomeEmail(email, name);

        return NextResponse.json({ message: 'Successfully subscribed' });
    } catch (error) {
        console.error('Subscription error:', error);
        return NextResponse.json(
            { error: 'Failed to subscribe' },
            { status: 500 }
        );
    }
    */
}
