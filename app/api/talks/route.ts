import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { sendTalkNotification } from '@/lib/email';

export async function GET() {
    try {
        const talks = await prisma.talk.findMany({
            orderBy: { date: 'desc' },
        });
        return NextResponse.json(talks);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch talks' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const talk = await prisma.talk.create({
            data: {
                title: body.title,
                abstract: body.abstract,
                speaker: body.speaker,
                speakerAffiliation: body.speakerAffiliation,
                date: (new Date(body.date).toString() !== 'Invalid Date') ? new Date(body.date + 'T12:00:00Z') : (() => { throw new Error('Invalid date provided'); })(),
                time: body.time,
                location: body.location,
                zoomLink: body.zoomLink,
                paperTitle: body.paperTitle,
                paperLink: body.paperLink,
                slidesUrl: body.slidesUrl,
                videoUrl: body.videoUrl,
                tags: body.tags || [],
                semester: body.semester,
                isUpcoming: true,
            },
        });

        // Notify subscribers if requested
        if (body.notifySubscribers) {
            const subscribers = await prisma.subscriber.findMany({
                where: { isActive: true },
                select: { email: true },
            });

            const emailList = subscribers.map((s: { email: string }) => s.email);
            if (emailList.length > 0) {
                await sendTalkNotification(emailList, {
                    title: talk.title,
                    speaker: talk.speaker,
                    date: talk.date.toLocaleDateString(),
                    time: talk.time,
                    location: talk.location,
                    zoomLink: talk.zoomLink || undefined,
                });
            }
        }

        return NextResponse.json(talk);
    } catch (error) {
        console.error('Error creating talk:', error);
        return NextResponse.json({ error: 'Failed to create talk', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
    }
}
