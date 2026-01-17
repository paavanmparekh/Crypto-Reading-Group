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
        await prisma.member.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ message: 'Member deleted successfully' });
    } catch (error) {
        console.error('Error deleting member:', error);
        return NextResponse.json({ error: 'Failed to delete member' }, { status: 500 });
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
        const member = await prisma.member.update({
            where: { id: params.id },
            data: {
                name: body.name,
                email: body.email,
                role: body.role,
                year: body.year,
                bio: body.bio,
                websiteUrl: body.websiteUrl,
                githubUrl: body.githubUrl,
                researchInterests: body.researchInterests || [],
            },
        });

        return NextResponse.json(member);
    } catch (error) {
        console.error('Error updating member:', error);
        return NextResponse.json({ error: 'Failed to update member' }, { status: 500 });
    }
}

export async function GET(
    req: Request,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    try {
        const member = await prisma.member.findUnique({
            where: { id: params.id },
        });

        if (!member) {
            return NextResponse.json({ error: 'Member not found' }, { status: 404 });
        }

        return NextResponse.json(member);
    } catch (error) {
        console.error('Error fetching member:', error);
        return NextResponse.json({ error: 'Failed to fetch member' }, { status: 500 });
    }
}
