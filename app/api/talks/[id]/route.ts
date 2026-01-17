import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';

export async function DELETE(
    req: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    const session = await getServerSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await prisma.talk.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ message: 'Talk deleted successfully' });
    } catch (error) {
        console.error('Error deleting talk:', error);
        return NextResponse.json({ error: 'Failed to delete talk' }, { status: 500 });
    }
}

export async function GET(
    req: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const talk = await prisma.talk.findUnique({
            where: { id: params.id },
        });

        if (!talk) {
            return NextResponse.json({ error: 'Talk not found' }, { status: 404 });
        }

        return NextResponse.json(talk);
    } catch (error) {
        console.error('Error fetching talk:', error);
        return NextResponse.json({ error: 'Failed to fetch talk' }, { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    const session = await getServerSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const talk = await prisma.talk.update({
            where: { id: params.id },
            data: {
                title: body.title,
                abstract: body.abstract,
                speaker: body.speaker,
                speakerAffiliation: body.speakerAffiliation,
                date: body.date ? ((new Date(body.date).toString() !== 'Invalid Date') ? new Date(body.date + 'T12:00:00Z') : undefined) : undefined,
                time: body.time,
                location: body.location,
                zoomLink: body.zoomLink,
                paperTitle: body.paperTitle,
                paperLink: body.paperLink,
                slidesUrl: body.slidesUrl,
                videoUrl: body.videoUrl,
                tags: body.tags || [],
                semester: body.semester,
                isUpcoming: body.isUpcoming,
            },
        });

        return NextResponse.json(talk);
    } catch (error) {
        console.error('Error updating talk:', error);
        return NextResponse.json({ error: 'Failed to update talk' }, { status: 500 });
    }
}
